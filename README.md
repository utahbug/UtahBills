# UtahBug — UtahBills

Independent, nonpartisan legislative-information prototype. Application: **UtahBug**. Repository: **UtahBills**. Intended permanent URL: **https://utahbug.github.io/UtahBills/**. Initial live-session target: **2027 General Session**. Current prototype: four real 2026 bills, nine published text versions, saved official records; not live.

## Run

Node 22 or later:

```sh
npm ci
npm run build
npm start
```

Open http://127.0.0.1:4173/UtahBills/ . The server binds only to loopback. The output in `dist/` is entirely static. Relative asset URLs and hash routes work beneath `/UtahBills/` without server rewrites. No permanent server, database, paid AI service, third-party fonts, or runtime CDN is required.

```sh
npm test
```

Tests expect the local server running. Windows uses installed Microsoft Edge. CI installs Chromium. Set `CI=1` to use Playwright's bundled Chromium locally. Test outputs go to `test-results/`.

## Architecture

- `scripts/acquire.py`: downloads the selected official JSON records and only text URLs discovered in their document lists. Preserves distinct introduced/substitute/enrolled files with retrieval timestamps and SHA-256 hashes.
- `data/raw/`: unmodified source snapshots. `data/sources.json`: provenance manifest.
- `scripts/analyze.py`: converts official XML change markup into baseline and proposed sections, normalizes layout whitespace, and combines factual JSON with version-specific explanations.
- `data/summary-evidence.json`: pins explanations to source text hashes. Changed source text blocks analysis/build until editorial review updates the evidence intentionally.
- `scripts/validate.mjs`: validates checksums, sessions, source/version links, summary pins, and retrieval consistency before every build.
- `app.js` and `styles.css`: presentation. Lucide supplies icons; diff supplies textual comparisons. esbuild bundles these dependencies locally.
- `tests/qa.mjs`: functional, legal-text regression, accessibility, reflow, keyboard, and base-path checks.

## Data findings and limitations

The official download tool at https://le.utah.gov/data/scripts/BillList_download.html uses `data/{year}GS/filelist.json` for requests, `billlist.json` for bills, and `{billNumber}.json` for individual records. These paths were observed in its source; they are not a guaranteed, versioned API contract. Its page warns that updates are irregular.

Individual records were verified for HB0011, HB0154, HB0155, and SB0069 in 2026GS. Fields include sponsor names, action histories, vote totals and identifiers, committee meetings, affected sections, document versions, source dates, and links to XML, comparisons, fiscal notes, and committee reports. Some supporting documents are hosted at `pf.utleg.gov`; no SharePoint dependency was found in this acquisition path. Request and full-session feed ingestion remain unimplemented.

The official “Bill Data” information page currently points to a Power BI statistics report; it should not be confused with the download tool's JSON source. Official bill HTML pages populate details dynamically, so fetching their HTML alone is insufficient. Some web fetches were rejected or timed out. Acquisition must fail rather than invent missing content.

The downloaded XML declares UTF-16 but the sampled payloads are UTF-8. Analysis removes that declaration after explicitly decoding the observed UTF-8 bytes. Raw bytes remain unchanged. Future encoding/schema changes must be reviewed.

Document dates and action timestamps have no explicit timezone and do not establish first public availability. Retrieval time is separate. No precise publication-to-hearing duration, late-change accusation, or boxcar label is inferred.

“Law before proposal” is reconstructed from the selected bill's own change markup. It is NOT an independently validated historical-Code snapshot or today's current law. Historical Utah Code versions, section effective dates, repeal/re-enactment handling, and conflicts across bills need a separate verified consolidation pipeline. The official Code entry point is https://le.utah.gov/xcode/code.html and historical resources are linked from the Legislature site.

Cross-version comparisons include proposed section/effective-date text, excluding titles, sponsor blocks, and formatting. A comparison can truthfully show no extracted text difference even when source formatting or metadata differs. The UI links each exact source version. Comparison is not a legal-effect determination.

Votes show official aggregate strings without assigning unverified meanings to each component. Individual roll calls and comprehensive amendment incorporation need further development; supporting records are linked.

Summaries are AI-assisted, source-checked during development, and labeled as pending independent human review. They are not presented as human-approved. SB0069's explanation specifically refers to its second substitute; its enrolled version is separately available.

## Refresh sources safely

With Python 3:

```sh
python scripts/acquire.py
python scripts/analyze.py
npm run build
```

If source hashes change, review the source, revise explanations if necessary, and intentionally update `data/summary-evidence.json`. Do not blindly replace pins. Inspect the resulting dataset diff before committing. Manual retrieval workflow saves an artifact for review and does not commit or publish. Scheduled acquisition is feasible on GitHub Actions but intentionally not activated in this non-live prototype.

## GitHub Pages preparation

The local project is independent. No other application or repository is used or modified. The remote repository did not resolve during the initial check; no GitHub publication has been performed.

When publishing is desired, create `utahbug/UtahBills`, push this repository's `main` branch, and choose **Settings → Pages → Build and deployment → GitHub Actions**. The included Pages workflow builds, checks provenance, runs browser/accessibility tests, and deploys `dist/`. All navigation stays below the permanent `/UtahBills/` URL. No Sites hosting or external backend is required.

## Verification and remaining work

Local Edge checks passed on seven routes at 320, 390, 768, and 1280 pixels: no horizontal overflow and no axe violations for WCAG A/AA tags through 2.2. Search, combined filters, no-result recovery, the explicitly unconnected 2027 state, legal-text checks, identical-version comparisons, direct hash-route reload, and keyboard skip links passed. See `VERIFICATION.md` for the final run.

This is not a WCAG certification. Screen-reader testing, real iPhone/iPad testing, complete keyboard review, human editorial review, individual voting records, live 2027 ingestion, historical-Code validation, reliable publication timing, and substantive-change analysis remain later milestones.

## Environment policy

Only these two published environment addresses are permitted:

| Environment | Permanent address | Purpose |
| --- | --- | --- |
| Main | https://utahbug.github.io/UtahBills/ | Normal updates and stable development |
| Review | https://utahbug.github.io/UtahBills/review/ | Experimental or disruptive changes, only when needed |

These addresses are planned; this documentation does not confirm deployment. Both must be reachable publicly from iPhone and PC. Clearly label Main versus Review in the interface and handoffs. No additional preview hosts, temporary sites, or per-branch deployment URLs.

Use one local instance at http://127.0.0.1:4173/UtahBills/ and reuse its browser tab. A second local instance is allowed only for necessary side-by-side testing and should be stopped afterward.

Before the first Review deployment, extend the Pages packaging workflow to preserve both environments in the same artifact. A Review-only upload would replace the entire Pages deployment and must never be used. Until that packaging exists, the included workflow supports Main only. Assess disruptive changes for Review before replacing working Main.

See `AGENTS.md` for the persistent development policy.

## Temporary search-engine exclusion — remove for public release

Main remains directly accessible for iPhone and PC testing, but `index.html` includes the static head directive `<meta name="robots" content="noindex, nofollow">`. Every application route uses this same HTML document (hash-based navigation), so the directive covers Bills, bill details, How it works, and About the data. Keep it in any new HTML pages added during development.

Do not block crawling with robots.txt: crawlers need to retrieve the HTML to see noindex. Do not submit sitemaps during development. No domain-wide settings or other repositories are involved. Retain the Research Prototype notice.

Public-release checklist: intentionally remove the robots noindex/nofollow meta tag from all application HTML, rebuild, deploy Main, and inspect the published HTML source. Revisit sitemap submission only when public release is approved. This directive discourages compliant search engines; it is not access control or an immediate removal guarantee for previously indexed content.
