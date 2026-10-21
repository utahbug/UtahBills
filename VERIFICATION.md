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
