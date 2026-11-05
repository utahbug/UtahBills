"""Prepare a public search release from the checksum-locked November 4 production site."""
import argparse
from datetime import datetime
from functools import cache
from hashlib import sha256
from html import escape
from html.parser import HTMLParser
import json
from pathlib import Path
import subprocess
from xml.etree import ElementTree as ET

from request_status import STATUS_URL, normalized, parse_statuses

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://legislation.utahbug.com"
BASE = ROOT / "release-candidates/social-v2-90965ce84cf283161f6362213e0775d69770020b"
BASE_HASH = "bfce0594c0e39f0fc2b3bd48d27ab441446f04e9d6d7583817d0105d07f2c959"
ROBOTS_META = '<meta name="robots" content="noindex, nofollow">'
NS = "http://www.sitemaps.org/schemas/sitemap/0.9"


def require(condition, message):
    if not condition:
        raise ValueError(message)


def digest(data):
    return sha256(data).hexdigest()


def compact_hash(mapping):
    return digest(json.dumps(mapping, ensure_ascii=False, separators=(",", ":")).encode())


def json_bytes(data):
    return (json.dumps(data, indent=2, ensure_ascii=False) + "\n").encode()


def verify_package(folder):
    subprocess.run(["node", "scripts/prepare-release.mjs", "--verify", str(folder)],
                   cwd=ROOT, check=True)


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.links = []
        self.canonicals = []
        self.descriptions = []
        self.titles = []
        self.in_title = False
        self.feed(html)
        self.close()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self.in_title = True
            self.titles.append("")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs.get("href"))
        if tag == "meta" and attrs.get("name") == "description":
            self.descriptions.append(attrs.get("content", ""))
        if tag == "a":
            self.links.append(attrs.get("href"))

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, text):
        if self.in_title:
            self.titles[-1] += text


def audit_pages(site, files):
    catalog = json.loads((site / "data/catalog-ui.json").read_bytes())
    records = catalog["requests2027"] + catalog["sourceObservedRequests2027"]
    eligible = {}
    excluded = []
    seen = set()

    @cache
    def evidence(path, checksum, kind):
        require(path.startswith("data/catalog-raw/") and files.get(path) == checksum,
                f"Missing verified raw source: {path}")
        data = (site / path).read_bytes()
        require(digest(data) == checksum, f"Altered source: {path}")
        if kind == "status":
            return parse_statuses(data)
        rows = json.loads(data)
        by_id = {row["trackingID"]: row for row in rows}
        require(len(by_id) == len(rows), "Duplicate official request identity")
        return by_id

    for record in records:
        if record.get("currentlyListed") is False or record.get("introducedBill"):
            continue
        ident = record["trackingID"]
        require(len(ident) == 10 and ident.isascii() and ident.isalpha()
                and ident.isupper() and ident not in seen, f"Invalid tracking ID: {ident}")
        seen.add(ident)
        path = f"requests/2027/{ident}/index.html"
        require(path in files, f"Missing landing page: {ident}")
        html = (site / path).read_text(encoding="utf-8")
        page = Page(html)
        require(page.canonicals == [ORIGIN + "/" + path.removesuffix("index.html")]
                and len(page.titles) == 1 and record["shortTitle"] in page.titles[0]
                and len(page.descriptions) == 1 and record["shortTitle"] in page.descriptions[0]
                and ident in page.descriptions[0] and f"/#request/{ident}" in page.links
                and html.count(ROBOTS_META) == 1, f"Invalid static metadata or application link: {ident}")
        source = record["history"][-1]["source"]
        status = record["statusSource"]
        require(source["url"] == "https://le.utah.gov/data/2027GS/filelist.json"
                and status["url"] == STATUS_URL, f"Unexpected source origin: {ident}")
        for ref in (source, status):
            datetime.fromisoformat(ref["retrievedAt"])
            require(ref["retrievedAt"] in html and ref["url"] in page.links,
                    f"Missing static source disclosure: {ident}")
        row = evidence(source["path"], source["sha256"], "requests").get(ident)
        require(row and normalized(row["shortTitle"]) == normalized(record["shortTitle"])
                and row["sponsor"] == record["sponsor"], f"Official title/sponsor mismatch: {ident}")
        listing = evidence(status["path"], status["sha256"], "status").get(ident)
        if record["verificationState"] == "source-observed":
            require(listing is None and not record.get("officialStatus"),
                    f"Unexpected status evidence for source-observed request: {ident}")
            excluded.append(path)
            continue
        require(record["verificationState"] == "status-verified" and listing
                and listing["officialNumber"] == "Not Numbered"
                and normalized(listing["shortTitle"]) == normalized(record["shortTitle"])
                and listing["officialStatus"] == record["officialStatus"]
                and listing["officialStatus"] in page.descriptions[0],
                f"Official status/title mismatch: {ident}")
        eligible[path] = record["shortTitle"]

    coverage = catalog["coverage"]["2027"]
    require(coverage["expected"] == coverage["imported"] == 0 and coverage["emptyIndex"]
            and not any(m["sessionID"] == "2027GS" for m in catalog["measures"]),
            "Introduced legislation differs from approved empty index. Review official bill evidence.")
    documents = {p for p in files if p.endswith(".html")}
    require(documents == {"index.html", *eligible, *excluded},
            "HTML inventory differs from the verified catalog")
    return eligible, excluded, catalog


def index_html(html):
    require(html.count(ROBOTS_META) == 1, "Unexpected robots directives")
    return html.replace(ROBOTS_META, "", 1)


def sitemap(paths):
    ET.register_namespace("", NS)
    root = ET.Element(f"{{{NS}}}urlset")
    for path in ["index.html", *sorted(paths)]:
        entry = ET.SubElement(root, f"{{{NS}}}url")
        ET.SubElement(entry, f"{{{NS}}}loc").text = ORIGIN + "/" + path.removesuffix("index.html")
    return ET.tostring(root, encoding="utf-8", xml_declaration=True)


def prepare():
    verify_package(BASE)
    prior = json.loads((BASE / "release-manifest.json").read_bytes())
    require(prior["contentSha256"] == BASE_HASH, "Wrong production baseline")
    git = lambda *args: subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()
    require(not git("status", "--porcelain"), "Prepare from a clean checkout")
    commit = git("rev-parse", "HEAD")
    target = ROOT / "release-candidates" / ("public-index-" + commit)
    site = BASE / "site"
    paths, excluded, catalog = audit_pages(site, prior["files"])
    changes = {p: index_html((site / p).read_text(encoding="utf-8")).encode() for p in paths}
    home = index_html((site / "index.html").read_text(encoding="utf-8"))
    require(Page(home).canonicals == [ORIGIN + "/"] and len(Page(home).titles) == 1
            and any(Page(home).descriptions), "Invalid homepage metadata")
    links = "".join(f'<li><a href="/{p.removesuffix("index.html")}">{escape(title)}</a></li>'
                    for p, title in sorted(paths.items(), key=lambda item: item[1]))
    old = "<noscript>This application needs JavaScript."
    require(home.count(old) == 1, "Unexpected homepage fallback")
    fallback = (f"<noscript><p>Saved 2027 public requests, checked {catalog['requestCheckedAt'][:10]}. "
                f'Retrieval dates and official sources appear on each record.</p>'
                f'<details><summary>Browse {len(paths)} verified public requests</summary>'
                f"<ul>{links}</ul></details>The interactive application needs JavaScript.")
    changes["index.html"] = home.replace(old, fallback).encode()
    headers = (site / "_headers").read_text()
    restriction = "  X-Robots-Tag: noindex, nofollow\n"
    require(headers.count(restriction) == 1, "Unexpected production headers")
    changes["_headers"] = (headers.replace(restriction, "") +
                           "/data/*\n  X-Robots-Tag: noindex\n"
                           "https://utahbills.pages.dev/*\n  X-Robots-Tag: noindex\n"
                           "https://:version.utahbills.pages.dev/*\n  X-Robots-Tag: noindex\n").encode()
    changes["robots.txt"] = f"User-agent: *\nAllow: /\nSitemap: {ORIGIN}/sitemap.xml\n".encode()
    changes["sitemap.xml"] = sitemap(paths)

    target.mkdir()
    output = target / "site"
    output.mkdir()
    files = {}
    sizes = {}
    def save(path, data):
        dest = output / path
        dest.parent.mkdir(exist_ok=True, parents=True)
        dest.write_bytes(data)
        files[path] = digest(data)
        sizes[path] = len(data)

    for path, expected in prior["files"].items():
        data = (site / path).read_bytes()
        require(digest(data) == expected, f"Baseline changed: {path}")
        if path != "release.json":
            save(path, changes.get(path, data))
    for path in changes.keys() - prior["files"].keys():
        save(path, changes[path])
    release = json.loads((site / "release.json").read_bytes())
    release.update(phase="public-search-release", approved=True,
                   publicIndexing={"changeCommit": commit, "baseContentSha256": BASE_HASH,
                                   "eligibleRequests": len(paths), "eligibleBills": 0,
                                   "excludedSourceObserved": excluded},
                   runtimeCodeSha256=compact_hash({p: h for p, h in files.items()
                                                   if not p.startswith("data/")}))
    save("release.json", json_bytes(release))
    report = dict(release, uploadMethod="Wrangler Direct Upload", fileCount=len(files),
                  totalBytes=sum(sizes.values()), maxAssetBytes=max(sizes.values()), files=files,
                  contentSha256=compact_hash(files))
    require(report["fileCount"] <= 20000 and report["maxAssetBytes"] <= 25 * 1024**2,
            "Candidate exceeds upload limits")
    manifest = json_bytes(report)
    (target / "release-manifest.json").write_bytes(manifest)
    (target / "SHA256SUMS").write_bytes((digest(manifest) + "  release-manifest.json\n").encode())
    verify_package(target)
    print(json.dumps({"candidate": str(target), "contentSha256": report["contentSha256"],
                      "eligibleRequests": len(paths), "excluded": excluded}))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--audit", action="store_true")
    if parser.parse_args().audit:
        verify_package(BASE)
        manifest = json.loads((BASE / "release-manifest.json").read_bytes())
        require(manifest["contentSha256"] == BASE_HASH, "Unexpected production checksum")
        eligible, excluded, _ = audit_pages(BASE / "site", manifest["files"])
        print(f"Audited {len(eligible)} verified requests and {len(excluded)} source-observed pages.")
    else:
        prepare()
