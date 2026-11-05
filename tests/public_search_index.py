"""Exercise the production search release using a small official-shaped fixture."""
import json
from pathlib import Path
import sys
import tempfile
import unittest
from xml.etree import ElementTree as ET

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from prepare_public_index import (NS, ORIGIN, ROBOTS_META, STATUS_URL, audit_pages,
                                  digest, index_html, sitemap)


class PublicIndexTest(unittest.TestCase):
    def setUp(self):
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.site = Path(folder.name)
        self.files = {}
        self.date = "2026-10-28T12:00:00+00:00"
        self.verified = "ABCDEFGHIJ"
        self.observed = "KLMNOPQRST"
        rows = [dict(trackingID=i, shortTitle=i + " title", sponsor="SPONSOR")
                for i in [self.verified, self.observed]]
        json_ref = self.source(json.dumps(rows), "json", "https://le.utah.gov/data/2027GS/filelist.json")
        listing = ('<h1>2027GS</h1><table id="resultTbl"><tr>' +
                   "".join(f"<th>{h}</th>" for h in ["Tracking","Bill#","ShortTitle","Sponsor","FloorSponsor","Status"]) +
                   f'</tr><tr><td><input data-trackingid="{self.verified}"></td><td>Not Numbered</td>'
                   f'<td>{self.verified} title</td><td>Sponsor</td><td></td><td>In Process</td></tr></table>')
        status_ref = self.source(listing, "txt", STATUS_URL)
        records = []
        for row in rows:
            ident = row["trackingID"]
            verified = ident == self.verified
            status = "In Process" if verified else "Official status not confirmed"
            records.append(dict(row, history=[{"source": json_ref}], statusSource=status_ref,
                                verificationState="status-verified" if verified else "source-observed",
                                officialStatus=status if verified else None))
            path = f"requests/2027/{ident}/index.html"
            title = row["shortTitle"]
            self.save(path, (f'<head>{ROBOTS_META}<title>{title}</title>'
                      f'<meta name="description" content="{ident} {title} {status}">'
                      f'<link rel="canonical" href="{ORIGIN}/{path[:-10]}"></head>'
                      f'<a href="/#request/{ident}">Open record</a><a href="{json_ref["url"]}">Request</a>'
                      f'<a href="{STATUS_URL}">Status</a>{self.date}'))
        self.catalog = {"requests2027": records[:1], "sourceObservedRequests2027": records[1:],
                        "coverage": {"2027": {"expected":0,"imported":0,"emptyIndex":True}}, "measures":[]}
        self.save("data/catalog-ui.json", json.dumps(self.catalog))
        self.save("index.html", ROBOTS_META)

    def save(self, path, text):
        dest = self.site / path
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(text.encode())
        self.files[path] = digest(text.encode())

    def source(self, text, suffix, url):
        sha = digest(text.encode())
        path = f"data/catalog-raw/{sha}.{suffix}"
        self.save(path, text)
        return dict(path=path, sha256=sha, url=url, retrievedAt=self.date)

    def test_sitemap_and_qualification(self):
        eligible, excluded, _ = audit_pages(self.site, self.files)
        expected = f"requests/2027/{self.verified}/"
        self.assertEqual(list(eligible), [expected + "index.html"])
        self.assertEqual(excluded, [f"requests/2027/{self.observed}/index.html"])
        locations = ET.fromstring(sitemap(eligible)).findall(f".//{{{NS}}}loc")
        self.assertEqual([loc.text for loc in locations], [ORIGIN + "/", ORIGIN + "/" + expected])
        self.assertEqual(index_html("<head>" + ROBOTS_META + "</head>"), "<head></head>")

    def test_contradictory_status_stops_release(self):
        self.catalog["requests2027"][0]["officialStatus"] = "Unknown"
        self.save("data/catalog-ui.json", json.dumps(self.catalog))
        with self.assertRaisesRegex(ValueError, "Official status/title mismatch"):
            audit_pages(self.site, self.files)

    def test_damaged_source_stops_release(self):
        path = self.catalog["requests2027"][0]["history"][0]["source"]["path"]
        (self.site / path).write_bytes(b"[]")
        with self.assertRaisesRegex(ValueError, "Altered source"):
            audit_pages(self.site, self.files)


if __name__ == "__main__":
    unittest.main()
