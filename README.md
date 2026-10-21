# UtahBug — UtahBills

Independent, nonpartisan legislative-information prototype. Application: **UtahBug**. Repository: **UtahBills**. Intended permanent URL: **https://utahbug.github.io/UtahBills/**. Initial live-session target: **2027 General Session**. Current prototype: 1,016 indexed 2026 measures, 253 public 2027 requests, a 104-entry 2026 legislator directory, and an official calendar. Four analyzed examples retain nine text versions and comparisons. Saved official records; not live.

## Run

Node 22 or later and Python 3:

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

Individual records were verified for HB0011, HB0154, HB0155, and SB0069 in 2026GS. Fields include sponsor names, action histories, vote totals and identifiers, committee meetings, affected sections, document versions, source dates, and links to XML, comparisons, fiscal notes, and committee reports. Some supporting documents are hosted at `pf.utleg.gov`; no SharePoint dependency was found in this acquisition path. Batch 2B now imports the full 2026 index and public 2027 requests; detailed XML analysis remains limited to those four examples.

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

The local project is independent. No other application or repository is used or modified. Main is published at https://utahbug.github.io/UtahBills/. Review remains unconfigured and undeployed.

The existing `utahbug/UtahBills` repository deploys updates pushed to `main` through GitHub Actions. The included Pages workflow builds, checks provenance, runs browser/accessibility tests, and deploys `dist/`. All navigation stays below the permanent `/UtahBills/` URL. No Sites hosting or external backend is required.

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

## Development Batch 1 — implementation notes

- Narrow bill rows stack vertically; metadata wraps instead of occupying a fixed side column. Tests compare every visible text rectangle in each row at 320/375/390/430px, with normal text, doubled computed font sizes, and 200% CSS zoom. This supplements document-level overflow checks.
- Encoding trace: the H.B. 11 authored summary already contained the UTF-8-as-Windows-1252 sequence for a curly apostrophe in `scripts/analyze.py`. Analysis faithfully copied that corruption to `data/bills.json`; rendering was not the origin. Corrected only the authored string. All analysis JSON reads now explicitly specify UTF-8 rather than the Windows locale default. Raw source bytes and summary source pins remain unchanged.
- `formatted` version data preserves the source XML tree for cover/long title, enacting clause, and body. `reader.js` escapes text, maps sections/subsections to readable blocks, and retains addition/deletion states. Internal `sinfo` metadata, print footers, and line-break markers are not displayed. Whitespace is adapted; no legal wording is paraphrased. All nine sample versions are checked character-by-character (excluding whitespace) and by effective change state against an independent browser XML parse.
- `python scripts/analyze.py --check` verifies deterministic regeneration without writing. CI runs it before the build. The complete `npm test` command now includes the original suite, text-enlargement tests, and `tests/batch1.mjs`.
- How It Works was checked on October 20, 2026 against current official Constitution Article VI §22, House Rules HR4-4-101/201 and HR4-7-201, Senate Rules SR4-4-201/301 and SR4-7-101/201/202, and Joint Rules JR4-3-101 and JR4-2-103. Links and rule identifiers appear in the guide. Voting to advance and voting for final passage are explicitly distinguished. The current Joint Rules do not impose the old same-chamber cosponsor restriction; the explanation does not repeat that obsolete restriction.
- At Batch 1, header navigation contained Bills only; reference links remain in the footer and in relevant bill content. No nonfunctional future sections were introduced.
- `ROADMAP.md` separates implemented work from planned and deferred stages. These are priorities for later batches, not promised delivery dates.

The reader is a rendering of a selected official XML version, not an independently verified current-law snapshot. Manual assistive-technology checks and physical iPhone/iPad checks remain required before claiming WCAG conformance. Main remains noindex/nofollow and a Research Prototype.

## Batch 2A — Calendar and bill navigation

The Calendar uses the public JSON endpoint called by https://le.utah.gov/calendar.html:
`https://www.utleg.gov/Calendar/month?month=10&year=2026` (one-based months).
The feed supplies complete day arrays, explicit timezone-aware timestamps, meeting IDs,
rooms, agenda links, electronic participation and R/C revision/cancellation flags.
The published 2027 significant-date table at https://le.utah.gov/sessionSchedule/sessdates.jsp
was checked against the calendar: General Session January 19–March 5, 2027.
The initial bounded snapshot covers October 2026–May 2027: 89 entries, including
54 meetings, two Senate extraordinary floor sessions, two session milestones and
31 deadlines. October 21 and November 18 include the twelve interim committees;
December 8 includes Management, Executive Appropriations and Audit meetings.
An empty date/month is not evidence that no legislative work occurs.

`scripts/refresh_calendar.py` fetches eight months and each unique linked HTML agenda
(initially 25) once, spaced by 250 ms. It does not crawl bills or infer draft-bill identities.
Only explicit numbered-bill hyperlinks are extracted (initial snapshot: 2026 SB 197 in
the October 21 Transportation agenda). Other proposals remain in the linked agenda.
`data/calendar.json` preserves source bodies, URLs, encoding, SHA-256 hashes and each
retrieval timestamp. `checkedAt` is retrieval completion, never publication time.
HTML source bodies are JSON strings, not new published HTML pages.

The existing Main Pages workflow attempts a refresh daily at 12:17 UTC (06:17 MDT /
05:17 MST; GitHub scheduling can be delayed). Push/manual builds use the saved snapshot.
A refresh validates every day, date, timezone, event type, unique ID and session boundary.
Missing old IDs or disappearing logistics stop the run for manual review; disappearance
is not cancellation. Explicit canceled events may omit logistics. All requests and
validation finish before one atomic snapshot replacement. Tests/build run before the
snapshot is committed and Main deployed. Network/parser/test/push failures retain the
working Main deployment; a rejected refresh does not advance its displayed check time.
A snapshot older than 36 hours is labeled older. No live-update promise is made.
This is a public website endpoint, not a versioned supported API. Monitor Actions failures,
review source changes, and extend the bounded date window in a later batch.

Bill search text is indexed once after loading; only 25 matching rows are rendered per
page. In-memory query, filters, sort, page and scroll survive bill detail/back navigation;
a full reload resets them. Native anchors provide full-row hit targets via a stretched
pseudo-element. Future secondary resource links must be siblings with `row-resource`
positioning, never nested in the primary link. Logo activation returns to Bills/top.
Touch scroll-stop highlighting was evaluated in a temporary browser experiment and
left out: moving emphasis was ambiguous with selection. Native tap/focus is stable.
The synthetic 1,200-bill fixture exists only inside test interception, never in `data/`.

Run `python tests/calendar_data.py` and `npm test` after `npm run build` with the normal
single local server. Calendar tests cover provenance, fail-closed refreshes, DST, month
alignment, view/category changes, enlarged text, generated scale and navigation state.
Full WCAG conformance, VoiceOver and physical iPhone testing still require human review.

### Calendar usability refinement

The calendar now always presents its chronological agenda below the month grid.
The default and month-change state is All Month, so the agenda can be read without
operating any date button. Selecting a date limits the existing filtered events to
that date through month-end; empty dates identify the next matching event within the
month. An empty remainder or empty month has an explicit message. All Month restores
the complete filtered month. The category legend is a native keyboard-accessible
collapsed disclosure; month and type selectors share a compact responsive row.
Official acquisition, scheduled refresh and source data are unchanged.


## Batch 2B — expanded discovery

The official 2026 General Session index supplies 1,016 unique base measures: 931
bills and 85 resolutions (48 joint, 25 concurrent, 12 single-chamber). All were
retrieved successfully. Coverage means complete against that retrieved index,
not a claim about unpublished drafting work. Substitute versions are not separate
measures. The four analyzed examples retain their readers and comparisons; other
pages show official general descriptions, actions, sponsorship, committees and
version/document links without unreviewed plain-English explanations.

Sources: https://le.utah.gov/data/2026GS/billlist.json and individual measure JSON,
https://le.utah.gov/data/2027GS/billlist.json (currently empty), and
https://le.utah.gov/data/2027GS/filelist.json (253 public drafting requests).
Requests are separate from introduced measures and may exclude confidential work.
The 2027 roster is deliberately unavailable until established from official records.

The original Batch 2B refresh was manual. Batch 2C replaces it with the guarded 2027-only process described below. It fetches
seven index/roster/contact/map-index sources, then only measures whose official
update marker changed; requests are paced by 150 ms. Content-addressed original
bytes, SHA-256 hashes, URLs and retrieval timestamps are preserved in
`data/catalog-raw/` and `data/catalog.json`. A failed retrieval, lost measure ID,
or unexplained disappearing request stops publication of the candidate manifest.
A disappeared request must have a corresponding introduced tracking ID. Investigate
source changes before accepting removals. The final manifest is replaced atomically.
The ignored resume cache is only a download optimization; all selected source hashes
are verified again. Retrieval dates are not official publication dates.

Run `python tests/catalog_data.py`, build, and the full browser suite before publishing
an updated snapshot. CI performs provenance and association checks. Batch 2C schedules 2027 catalog refresh daily; the calendar remains independent.
Build requires Python 3 (`PYTHON` can specify its executable on Windows).
The browser fetches a roughly 1 MB listing projection and lazy-loads detailed records;
it does not load the raw evidence archive. Listings render at most 25 results per page.

Legislators uses https://le.utah.gov/asp/roster/roster.asp?year=2026 (104 entries),
joined by official stable identifiers. Former entries lacking an ID link are resolved
only by an unambiguous complete official name. Current contacts from
https://le.utah.gov/data/legislators.json require matching ID and complete name;
four former members have no matching current contact, and successor information is
never substituted. The roster supplies historical districts. District links use the
official Census 2022 legislative district map indexes for Utah, consistent with the
2022–2032 state legislative boundaries documented by Utah SGID. These are district
maps, not live voter-address lookup. Counts include HB/SB chief-sponsored base bills;
floor sponsorship and verified version cosponsorship have separate linked lists.

Primary navigation is Bills, Calendar, Legislators. Calendar controls now place month
left/type right, Legend left/All Month right, and omit the duplicate month heading.
Acquisition and scheduled calendar refresh were not changed.


## Batch 2C — guarded daily 2027 updates

The Main workflow runs calendar and 2027 catalog retrieval independently each day at
12:17 UTC (06:17 MDT / 05:17 MST). GitHub may delay scheduled jobs. The cron expression
in `.github/workflows/pages.yml` is the scheduling configuration; future additional
legislative runs should retain the calendar's daily cadence. Manual dispatch with
`refresh_data=true` exercises the same refresh/test/commit/deploy path. Ordinary pushes
build saved data. No real-time promise is made.

`refresh_catalog.py` now leaves every 2026 source and record reference unchanged. It
fetches the official 2027 index and public request list, then newly indexed measures,
changed official update/action markers, and records not rechecked in seven days.
Requests are spaced by 250 ms with 40-second request timeouts. Original bytes are
content-addressed; SHA-256 and source identity are verified before atomic manifest
replacement. No XML analysis or AI summaries are generated. JSON metadata preserves
sponsors, committees, actions, vote references/tallies, version IDs and official links,
including published amendments and amended text. A saved vote reference is not an
individual-vote analysis or proof that every action was a final-passage vote.

Guardrails reject malformed JSON/schema, ambiguous identities, missing existing
measures, unexplained request disappearance, lost versions/actions, and increases of
more than 250 new measures or requests in one retrieval. The threshold is deliberately
conservative (`MAX_NEW_RECORDS`); review actual official evidence before changing it.
An empty index when no earlier measures were saved is accepted as an **empty retrieved
index**, never labeled complete or treated as proof that legislation does not exist.

Request history preserves observed title/sponsor revisions and source references.
Only the same official `trackingID` in a request and introduced base-measure record
establishes their relationship. Titles/names are never matching keys. Linked request
URLs continue working and lead to the assigned bill; bill pages link back to request
history. Linked requests leave the pending list and never add to introduced bill counts.
Earlier observations remain available even if the official public list drops the request.

A failed refresh leaves its previous manifest and last-checked time intact. The other
refresh may still succeed. Both retained/new snapshots must pass source, browser and
accessibility tests before commit/deployment. Push failure prevents deployment.
Each attempt records timestamps, outcome, counts or an error in the Actions summary
and `refresh-attempt-<run ID>` artifact (90-day retention); a separate refresh-health
job marks source failures red without blocking the independent validated snapshot.
A failed build never replaces Main. The interface links to Actions and labels 2027
snapshots older than 36 hours. A successful scheduled run with an empty index still
means only that the endpoint returned no introduced measures.

Official human-readable request listing:
https://le.utah.gov/bills/billSearch.jsp?sess=2027GS&disp=all&sen=all&rep=&sub=&comm=
The parameters are the site's own session/display/chamber controls; no individual
request deep links are invented. Raw JSON and tracking/history are in optional Source
details. Data notices use native Info disclosures and dynamic counts/retrieval dates.

The official year-roster selector still ends at 2026 at this investigation. Requesting
`year=2027` alone does not prove that a 2027 roster exists. Preserved evidence and check
timestamps are in `data/discovery-sources.json`. The historical 2026 directory remains;
2027 membership is unavailable pending verification of an officially published session
roster. Current officeholders/request sponsors are not assumed to be 2027 members.

Run `python tests/catalog_data.py`, `python tests/catalog_updates.py`, the calendar
integrity tests, build, and `npm test`. Exceptional update/reconciliation fixtures exist
only in temporary test files/intercepted browser responses, never in published data.
Physical iPhone and manual VoiceOver checks remain pending human review.


## Batch 2D — verified vote sample

`data/votes.json` contains 22 official decisions and 524 individual entries across HB0002, HB0011, HB0154 and SB0069 (2026GS). HB0155 is also checked and has no vote references in its preserved action history. This is a bounded sample, not a legislator’s complete history. The daily calendar and 2027 metadata refresh remain unchanged; votes are a saved, explicitly acquired historical sample, not a live or scheduled roll-call feed.

Run `python scripts/acquire_votes.py` to reproduce the sample from preserved source responses (new URLs are fetched with a 250 ms delay). Original HTML bytes (served as plain `.txt` source archives), URL, retrieval timestamp and SHA-256 are retained in `data/vote-raw/`; the exact original bill-action source is referenced per vote. The importer only publishes its projection after all records validate. Build runs `tests/vote_data.py` to reproduce every record and check source hashes, tallies and identities. No AI summaries are generated.

Floor sources are the official bill page’s `/DynaBill/svotes.jsp` links; committee sources are `/mtgvotes.jsp`. Floor source display times and committee meeting-notice times are preserved separately from action-history timestamps, without an invented time zone. Motion/stage text comes directly from the records; classifications use explicit wording. Concurrence stays distinct even when the display also says Final Passage. Second-reading passage is not labeled final passage. Voice-vote placeholder totals are not treated as individual votes or actual tallies.

Voter links require a unique historical 2026 chamber, surname and given-name-initial match, also checking district when the source supplies it. Never match surname alone or use a current district successor. `Walter, N.` remains unlinked because the source abbreviation cannot be confidently matched to the preserved roster. All recorded names remain visible. Version identifiers are shown only when explicitly supplied; these do not establish the complete amendment state. Missing records are described as unavailable, not as proof no vote occurred.

Batch 2D tests cover real source reproducibility and separated synthetic failure/ambiguity fixtures, vote distinctions, profile links, session defaults/restoration, compact Info/search/calendar controls, header geometry, 320/375/390/430 widths, doubled text, 200% CSS zoom and axe. Physical iPhone/iPad and manual screen-reader checks remain pending; automated checks do not certify WCAG conformance. Next bounded work: verify 2027 membership when official, review early-session completeness, and expand validated vote coverage.


### Document-reading refinement
The existing nine verified formatted example versions retain their source-character/change-marking regression checks. Basic measure versions prioritize official readable PDF/document links, with raw XML under Technical source. The XML-to-PDF mapping is the same mapping used by the Legislature’s `rexBill.js` for introduced, substitute, amended and enrolled documents; sample endpoints were checked during this refinement. Official XML responses do not enable cross-origin browser reads, so no unsupported live browser conversion or broad new text acquisition was introduced. Raw-source links open in a new tab with an accessible notice. Retrieval dates remain explicitly distinct from publication dates.
