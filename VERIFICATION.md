# Prototype verification — October 20, 2026

- Production build: passed (Node 22 / esbuild).
- Provenance validation: 13 official source records; checksums, retrieval dates, sessions, nine version links, and summary source pins passed.
- Browser: Microsoft Edge, automated through Playwright.
- Responsive checks: seven routes at 320, 390, 768, and 1280 CSS pixels; no document horizontal overflow.
- axe-core 4.11: no violations for WCAG 2 A/AA, 2.1 A/AA, and 2.2 AA tags across the 28 route/viewport combinations.
- Text enlargement: all computed text sizes doubled on Bills, SB0069 detail, How it works, and About the data at 768px; no document horizontal overflow. A header wrapping issue found during this check was fixed.
- Functional checks: bill-number search; combined status/chamber filters; empty-state recovery; explicit unconnected 2027 state; identical-version comparison; direct bill URL reload under `/UtahBills/`; keyboard skip link; no browser runtime errors.
- Legal text regression: HB0011 baseline excludes the new probable-cause language while resulting text includes it; SB0069 S2 resulting text includes parental opt-out and excludes the removed Classroom hours definition.
- Visual review: desktop Bills and bill detail screenshots; phone bill-detail screenshot.

Limitations: automated checks are not a WCAG 2.2 AA certification. Manual screen-reader testing, complete keyboard traversal, real iPhone/iPad testing, and independent human editorial verification remain pending. Text enlargement is simulated through CSS, not a physical-device accessibility setting.

Run `npm test` with `npm start` running. Local reports/screenshots are generated in `test-results/` (ignored by Git). The supplementary Windows text-enlargement check is `node tests/text-resize.mjs`.

## Development Batch 1 verification — October 20, 2026

- Complete `npm test` passed: original functional suite, enlarged-text suite, and new Batch 1 regressions.
- Seven routes at 320, 375, 390, 430, 768, and 1280 CSS pixels: no document overflow or automated WCAG A/AA violations.
- Actual visible text rectangles in every bill row: no overlaps or text outside the row at all four requested phone widths, with normal text, doubled computed text sizes, and 200% CSS zoom. Test documents are isolated between scale scenarios.
- Expanded formatted reader: automated accessibility checks and doubled-text reflow at 320/375/390/430px passed. No violations reported; this is not a conformance certification.
- All nine XML versions: independent DOM parsing confirms each non-whitespace character, effective addition/deletion state, section count, and selected official-document URL in the reader. Whitespace/layout adapts to reading; printing/internal metadata is omitted as disclosed in the interface.
- H.B. 11 apostrophe and special-character renderer fixtures pass. Deterministic `scripts/analyze.py --check` passes and is now a CI gate. Official source snapshots, manifest, and evidence pins have no changes.
- Secondary footer navigation, noindex/nofollow, and Research Prototype notice verified.
- Additional installed WebKit mobile-emulation smoke check passed for bill navigation, the corrected apostrophe, formatted text, and reflow. This is not testing on a physical iPhone.
- Visual inspection: stacked mobile listing and indented legislative sections reviewed.

Still needed: physical iPhone/iPad checks, independent human factual review, and manual screen-reader/complete keyboard accessibility review. Published data remains the same four-bill 2026 snapshot. Future stages are in ROADMAP.md.

### Batch 2A verification — October 20, 2026

- Complete existing browser suite passed after adding Calendar as an eighth route.
- Five Python calendar tests: original source hashes and deterministic derivation,
  incomplete/missing/duplicate record rejection, cancellation/revision handling,
  network failure preservation, and Mountain daylight/standard time.
- Month alignment and leap-year arithmetic; keyboard date selection; month/list and
  category switching; chronological sorting; January opening and December meetings.
- 320, 375, 390, 430 and 1280 CSS pixels, doubled computed text and 200% CSS zoom;
  calendar date-cell overflow and automated WCAG A/AA checks. Existing bill text-rectangle
  overlap and exact official wording/change-markup checks remain passing.
- Generated 1,200-bill fixture: at most 25 rows rendered, single row target, filters/sort/
  pagination, padding-area click, keyboard activation, independent secondary resource link,
  detail/back scroll restoration and same-route logo return to top.
- WebKit mobile touch smoke: date selection, list view, logo, row tap and return to list.
- Reviewed mobile/desktop screenshots. Temporary scroll-stop highlight trial moved emphasis
  across three rows during normal scrolling; deferred to avoid ambiguous selection feedback.
- Representative official meeting, room-map, agenda and extraordinary-session links returned
  HTTP 200. SB 197 is explicitly linked by the Transportation agenda; no synthetic bill data
  is included in production. Source bodies remain downloadable; the browser loads a compact
  derived calendar file instead of the approximately 3 MB evidence archive.
- No physical iPhone or manual VoiceOver conformance claim. Scheduled Actions execution is
  subject to GitHub timing; it has not yet had its first scheduled run at initial publication.

### Calendar usability refinement verification

Combined agenda regression checks cover date-to-month-end selection, All Month,
chronological ordering, filters, empty dates, empty remaining ranges, empty months,
month changes and removal of separate view controls. Existing mobile/desktop axe,
normal/doubled-text/200%-zoom checks include the expanded legend. WebKit touch smoke
covers selection, All Month, Legend and an empty month. Mobile/desktop screenshots
reviewed. Physical iPhone and manual screen-reader testing remain user review tasks.
Calendar source data, acquisition and scheduled refresh are unchanged.


### Batch 2B verification

- Verified all 1,016 official 2026 indexed base measures (931 bills, 85 resolutions),
  unique IDs, original byte hashes, exact sponsor associations and independent raw-record
  chief-sponsored counts. The 2027 index is empty; 253 public requests are separate.
- Eight catalog data tests cover complete/partial coverage, source date conversion,
  historical roster/current-contact separation, district-specific maps, cosponsorship,
  request/introduced distinction, network failure, disappearing requests and incremental reuse.
- Existing complete browser suite retained: search/filter/page/scroll restoration,
  actual bill text-rectangle overlap, nine-version exact legislative wording/change markup,
  calendar dates/filters/selection, 1,200 generated test bills and automated WCAG checks.
- New browser regressions cover real expanded coverage, exact bill-number search,
  directory chamber/partial-name/spelling search, keyboard profile navigation, stable-ID
  role counts/list links, former-member contact unavailability, 2027 unavailable roster,
  request details, partial coverage and failed detail fetches.
- New routes checked at 320, 375, 390, 430 and 1280 CSS pixels, doubled text and 200%
  CSS zoom; automated WCAG A/AA checks found no violations. Visual review caught and
  corrected an official-source date-format mismatch and a narrow search-field overflow.
- WebKit mobile touch checks: directory/profile/sponsored bills, return navigation,
  calendar selection and All Month. Desktop/mobile screenshots reviewed. Representative
  official district PDFs, House/Senate biographies and measure links returned HTTP 200.
- Calendar acquisition/refresh, original analysis source snapshots, icons, static noindex
  and Research Prototype designation preserved. No fictional records published.

Limits: no physical iPhone or manual VoiceOver certification; independent factual review
remains necessary. The 104-entry year roster is not a claim about current membership.
Four former members lack matching current contact data. New measures have basic official
records, not full XML analysis or reviewed explanations. Bill/request refresh is manual;
calendar remains independently scheduled daily. No finalized 2027 roster is asserted.

CI font-metric follow-up: enlarged text exposed intrinsic minimum widths in the
listing help columns. Flexible wrapping now prevents that overflow; the reflow
regression covers both system UI and Verdana font metrics.


### Batch 2C verification

- Real official refresh: 253 pending public requests and zero entries in the retrieved
  2027 introduced index. Counts are derived, not pinned. Empty indexes are explicitly
  uncertain, not complete. The official 2027 human listing was checked with its own
  session/display/chamber query controls; the unfiltered form alone did not show rows.
- Official year-roster selector ends at 2026. Saved discovery evidence and timestamps
  support retaining an unavailable 2027 directory rather than assuming membership.
- Eight catalog integrity tests plus five controlled-update tests: new measures,
  changed request titles, exact tracking-ID reconciliation, title-collision separation,
  archived revisions, preserved 2026 references, vote/version metadata, unchanged reuse,
  count spikes, corrupted/duplicate records, inconsistent IDs, lost actions, failed
  updates and recovery. Synthetic data is temporary and never enters production data.
- Complete existing browser and calendar suites retained. Every saved request page
  tested at 320/375/390/430 CSS pixels for shared-template layout, actual back-link/label
  geometry, human-readable official link and hidden machine-readable sources.
- Long request title tested with normal/doubled text and 200% CSS zoom, expanded Source
  details, keyboard activation and automated WCAG A/AA checks. Info disclosure and
  empty-index wording checked. Synthetic linked-request/bill/back navigation checked.
- WebKit touch checks and mobile screenshots reviewed: Info and Source details toggle,
  request link separation, raw-data visibility and return to the request listing.
- Refresh reports and health-job behavior are documented in README. A manual Actions
  dispatch with refresh_data=true exercises the same data path used by the daily cron;
  actual deployment/run outcomes are reported in the final handoff.

Pending: physical iPhone and manual VoiceOver testing of this update, independent
factual review, real-world observation of the first request-to-introduced conversion,
and verification of an official 2027 session roster when published. Official endpoint
schema changes and guarded count spikes require review rather than silent acceptance.


### Phase 4A — layout cleanup and vote-record investigation (October 22, 2026)

Part A removes the shared Research Prototype banner entirely, including its DOM container and CSS. All routes use 16px main top padding (previously 26px desktop / 22px mobile). Main identification moves to the existing footer. Redundant visible prototype wording is removed from About the Data, summary-source wording and the no-JavaScript fallback. Official attribution, snapshot dates, incomplete-record warnings, request/introduced distinctions, pending independent review, and static noindex/nofollow remain. This label removal is not public-release approval, live coverage, or factual certification.

Part B inspected the original checksum-verified action JSON and vote HTML for each of the five conflicts. The three displayed tally columns exactly match the named voters in every vote page; there is no missing cell, duplicate voter or demonstrated parsing error. Additional linked official minutes were retrieved on October 22 and saved byte-for-byte in `data/phase4a-raw/`; `data/phase4a-evidence.json` records URLs, full SHA-256 values, retrieval timestamps, original action/vote source references and the named groups for reproducible comparison. Meeting notice times are not exact vote times; action timestamps below have unspecified source timezone.

| Bill / official vote | Action date/time | Committee and motion | Action tally | Vote page and minutes tally |
| --- | --- | --- | --- | --- |
| HB0117 / [39191](https://le.utah.gov/mtgvotes.jsp?voteid=39191) | 2026-01-30 14:21:36.653 | House Health and Human Services; Amendment #1 recommendation | 12-0-2 | 11-0-3 |
| HB0117 / [39193](https://le.utah.gov/mtgvotes.jsp?voteid=39193) | 2026-01-30 14:21:51.707 | House Health and Human Services; favorable recommendation | 12-0-2 | 11-0-3 |
| HB0264 / [38981](https://le.utah.gov/mtgvotes.jsp?voteid=38981) | 2026-01-27 17:32:53.730 | House Health and Human Services; replace HB0264 with HB0264S01 | 11-0-3 | 12-0-2 |
| SB0141 / [38882](https://le.utah.gov/mtgvotes.jsp?voteid=38882) | 2026-01-26 14:49:50.000 | Senate Health and Human Services; favorable recommendation of SB0141S02 | 6-0-1 | 5-1-1 |
| SJR006 / [41466](https://le.utah.gov/mtgvotes.jsp?voteid=41466) | 2026-03-02 12:15:39.743 | House Rules; replace SJR006S01 with SJR006S02 | 7-0-1 | 8-0-0 |

Tallies are yes-no-absent. Each remains an **unresolved official-source conflict**, not an application correction:

- HB0117 39191: the [January 30 minutes](https://le.utah.gov/interim/2026/html/00000951.htm) record Ward's amendment motion at 11-0-3. Vote page names total 11 yes, no nays, with Bolinder, Clancy and Hollins absent.
- HB0117 39193: the same minutes separately record Ward's favorable-report motion at 11-0-3, with the same names. Neither motion reconciles with its 12-0-2 action entry.
- HB0264 38981: the [January 27 minutes](https://le.utah.gov/interim/2026/html/00000759.htm) record 12-0-2 for the substitute motion; vote-page names total 12 yes with Abbott and Bolinder absent. The action remains 11-0-3.
- SB0141 38882: the [January 26 minutes](https://le.utah.gov/interim/2026/html/00000634.htm) record Buss's favorable-report motion at 5-1-1. The vote page lists Buss, Escamilla, Grover, Plumb and Stratton yes, Stevenson no, and Adams absent. The action's 6-0-1 cannot support those individual attributions.
- SJR006 41466: the [March 2 minutes](https://le.utah.gov/interim/2026/html/00001997.htm) record Burton's substitute motion at 8-0-0. All eight vote-page names are yes; the action remains 7-0-1.

Minutes corroborate the roll-call representation but may share an upstream record system; they are not independent certification and do not erase the conflicting action records. No tally, original snapshot, manifest date, reconciliation rule or individual attribution was changed. All five warnings remain. Official clarification or corrected, preserved source evidence is required before resolving them. The previously documented 5,672 sources / 5,667 reconciled records / 115,130 individual entries remain unchanged.

Historical identities: the unresolved generated name set is only `Walter, N.` (1,046 individual entries). The saved 2026 roster lists `Walter, R. Neil`, ID `WALTER`, House district 74. The matcher requires surname plus the first given-name initial, chamber and supplied district; `N` does not equal `R`. Across raw sources, the abbreviation occurs in 827 floor and 230 committee responses (raw appearances include voice records and are not the count of attributable individuals). The floor cell links to `/asp/roster/leglookup.asp?house=H&dist=74`; it contains no stable legislator ID or historical year. The example source and its hash are retained in the investigation manifest. No current district lookup was followed, no successor substituted, and no surname-only or general middle-initial match introduced. The historical roster and floor district support a candidate, but this batch does not establish a source-backed alias applicable to all committee entries. All 1,046 remain unlinked pending that verification; the original visible names remain available. 2027 membership is still unverified.

Validation: production build and deterministic analysis check passed; Python suites passed (calendar 5, catalog 10, controlled updates 6, foundation 8, activity 4; build-time vote tests 3). All 14 existing browser suites plus the new Phase 4A suite passed locally in Edge. Checks cover search/filter/sort/pagination/copy/navigation, all 255 current request templates, bill details/readers/vote histories/calendar, 320–1280px widths, doubled computed text and 200% CSS zoom, keyboard, static noindex and automated WCAG A/AA tags through 2.2 with no violations. New geometry/axe checks cover seven routes at 320/390/768/1280px in all three text/zoom modes. Phone and desktop Bills/Calendar screenshots were visually reviewed. The supplemental evidence manifest was synchronized into dist after completing its annotations; it is not consumed by runtime vote processing. Physical iPhone/iPad and manual screen-reader testing remain pending. Automated checks are not WCAG certification.

CI follow-up: the first Phase 4A run stopped before deployment because Git text normalization changed the newly added minutes in the Linux checkout. The existing raw-source `-text -whitespace` rule is now also applied to `data/phase4a-raw/*`; original local response bytes and recorded SHA-256 values are retained. Staged Git blobs are checked against the evidence manifest before publishing. No source hash was relaxed or rewritten.

CI reflow follow-up: all 14 existing suites passed; the new Phase 4A matrix exposed detail-stage grid overflow at 768px / 200% CSS zoom on Linux Chromium. Reproduced locally with wider Verdana font metrics. Stage columns now use `minmax(0,1fr)` and their cells allow wrapping, retaining the same column counts. The added wide-font regression guards this case without weakening the overflow assertion.


### Phase 4B — compact interface and navigation (October 22, 2026)

Baseline: clean Main `8e469161ce42a33fecac890910dd0ec3358c753f`, successful deployment 39854274380; remote fetch found no newer commit. This is UI-only work. No legislative source, acquisition, reconciliation, provenance or scheduled-refresh code was modified. The five conflicts and 1,046 unlinked historical identity entries remain intact.

Before/after geometry below uses local Edge, a 900px-high viewport, normal text, the default public-request session and October 2026 calendar. Positions are CSS pixels from the viewport top; lower positions mean less scrolling. Measurements and before/after screenshots are in ignored `test-results/phase4b-*` files.

| Measurement | 1280px before → after | 390px before → after |
| --- | --- | --- |
| Header height | 61.9 → 61.9 | 107.6 → 107.6 |
| Bills: heading bottom to first request | 221.5 → 173.0 | 289.0 → 194.5 |
| Bills: first request top | 339.2 → 290.7 | 477.6 → 383.1 |
| First request card height | 93.5 → 81.5 | 177.5 → 163.5 |
| Bills results toolbar height | 44.0 → 44.0 | 111.5 → 65.5 |
| Calendar grid height | 480.4 → 389.2 | 420.4 → 365.2 |
| First calendar event top | 756.9 → 615.1 | 746.6 → 680.8 |
| Activity empty-state top | 210.7 → 175.9 | 255.6 → 221.6 |

Desktop result column gaps reduced from 18px to 9px. Native controls and Copy keep 44px minimum height; font sizes were not reduced to obtain the savings. Calendar cells expand for content and enlarged text. At 320px normal Edge metrics, compact navigation gaps/padding keep the header at two lines while aligning the Bills text with the U in UtahBug. Wider text may wrap naturally; it is never clipped. Mobile calendar selectors intentionally occupy separate inline-label rows when both cannot fit readably on one line.

Preservation checks compare all original How It Works and About the Data text and source links with the consolidated sections. Legacy routes and section navigation, official legal citations, disclosure keyboard operation, verification counts and source limitations remain. The footer has one About & FAQ link. Contact cleanup removes only the raw JSON UI link, not contact data or internal verification. Recent Activity no longer reserves a viewport-height blank area beneath sparse results. It already had no concluded-session selector; no redundant change or historical-data deletion was made. Temporary intercepted historical-event fixtures exercise current-session pagination without entering published data.

Calendar is a continuous table with seven weekday column headers, original month alignment and unchanged date/filter/All Month semantics. The selected heading omits From while Info explains through-month-end behavior. Sunday shading is explicitly conventional. The preserved feed contains holiday-related deadline wording but no explicit holiday/recess non-meeting designation, so no other dates were labeled as closures. All prior Calendar sources, coverage, retrieval and failure qualifications now appear in its single Info disclosure; stale warnings remain visible.

Validation status: production build, deterministic analysis and Python suites passed (calendar 5, catalog 10, controlled updates 6, foundation 8, activity 4; build-time vote tests 3). All 16 browser regression suites passed locally, including Phase 4A preservation and the new Phase 4B suite; no automated WCAG A/AA violations were reported. Desktop and phone before/after screenshots were visually reviewed. Publication proceeds through the existing required GitHub Actions build and browser checks; the final report records the deployment result and live asset verification. The new suite covers 320/375/390/430/600/768/900/1024/1280 widths, normal/doubled text/200% CSS zoom, heading Info, calendar cell overflow, grid/Copy alignment, wrapped navigation, legacy About routes/content and fixture-backed activity page labels. Physical iPhone/iPad and manual screen-reader testing remain pending; automated axe results do not certify WCAG conformance.


### Phase 4C — independent technical audit (October 22, 2026)

The comprehensive report is `docs/QUALITY_AUDIT.md`, with point-in-time source checks and measurements in `docs/QUALITY_AUDIT_EVIDENCE.json`. Live 2026 index/listing evidence still matches the preserved archive. The latest scheduled run failed on a calendar test's obsolete empty-date assumption; real-source checks now follow snapshot contents and isolated fixtures preserve empty/added-date coverage. A shortened human listing now correctly clears the historical completeness flag, with a new Python regression. No production data or UI design changed.

Live 2027 request JSON had 268 IDs but the status listing had 267 rows, missing MDIQORVFRP. The previous verified 255-request snapshot remains published; the strict guard is unchanged. October's official calendar has an additional October 23 meeting. These findings remain open freshness issues, separate from a successful code-push deployment. All five official tally conflicts and 1,046 Walter identities remain unresolved.

Local deterministic analysis, production build and Python integrity checks passed (calendar 5, catalog 10, update safeguards 6, foundation 9, activity 4; build-time vote tests 3). All 16 existing browser suites and the new focused quality suite passed. The new suite verifies preserved audit hashes, direct routes, Back/Forward, delayed-route safety and failed-record recovery, and records local timing/heap diagnostics. No automated axe violations were reported by the existing accessibility matrices. Physical iPhone/iPad, manual VoiceOver/NVDA, independent human editorial review and a subsequent successful scheduled acquisition remain pending.

### Phase 4D — refresh and introduced-session readiness (October 22, 2026)

See [Phase 4D verification](docs/PHASE4D_VERIFICATION.md) for source hashes, independent acquisition/reconciliation outcomes, manual-versus-scheduled limits and published-data comparisons. The upstream missing status row is corrected; guarded run 39869478421 successfully published 268 verified requests and 90 Calendar events. Historical data and conflict safeguards are unchanged.

Deterministic analysis, production build and all Python integrity suites passed; all 18 local browser suites passed, including isolated 0/1/3/240 introduced-record transitions. The guarded refresh separately passed its established 17-suite command on the new official snapshots. The new transition suite and build passed again after syncing those snapshots. Mobile/desktop fixture screenshots and live Main request/Calendar behavior were reviewed. Physical-device/manual screen-reader and human editorial acceptance remain pending. The final readiness push runs all 18 suites through the required workflow.

### Phase 4E — navigation, footer, About/FAQ and Calendar polish

See [Phase 4E verification](docs/PHASE4E_VERIFICATION.md) for scope, compatibility, test coverage and remaining limits. The new authorized design supersedes earlier combined-page and visible Main-footer descriptions without changing data, acquisition, unresolved findings or hosting policy.
