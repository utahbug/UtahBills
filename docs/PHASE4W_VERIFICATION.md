# Phase 4W — iPhone usability and information cleanup

Date: October 24, 2026 (America/Denver). Baseline: `8976a465026f514424a30c215914a2d31bc44524`, successful Main deployment [40150833984](https://github.com/utahbug/UtahBills/actions/runs/40150833984).

## Implemented scope

- At widths through 700 CSS pixels, the existing official Bill Search link moves to the Records heading, aligned within the selector width. The same link returns above Search on desktop. Current request/measure totals populate the two phone options from saved projections; unfiltered phone totals no longer repeat below. Filtered counts and count Info remain available. Archive routes still omit Records and retain historical styling and shared-footer access.
- The existing More disclosure contains the same Sort and Per page controls on phones, alongside CSV; desktop controls remain visible. There are no duplicate controls or preference stores. Added reverse-title sorting and stable identifier ties. Copy and CSV continue to include the complete matching, ordered collection. Escape, outside-pointer and outside-focus dismissal prevent the panel covering results after leaving it.
- The empty introduced index uses one normal-weight sentence and a compact public-request link. Filter-empty results remain distinct. Coverage qualifications stay in Info.
- Reviewed all seven principal Info panels. Legislative data, counts, types, Activity, Calendar and directory now use brief factual statements and links. Request status Info remains unchanged. Independent catalog/request/supplemental dates and verified/unconfirmed totals remain separate. Undated Activity retains its explicit control; Calendar Legend remains separate. Detailed classifications, request reconciliation, date interpretation, Calendar assumptions and roster qualifications are retained in the existing About Data route. Evidence dialogs, vote records and source histories are not shortened.
- Calendar state is local to a route visit. Entry or return starts at today's or the next matching saved date across coverage in Mountain Time. Month/date/category choices and grid visibility persist while actively browsing. Show/Hide uses the existing Lucide calendar icon. Events has a fixed heading and a discreet Upcoming action during manual browsing. Month selection retains whole-month access; grid selection retains date-forward browsing. Date headings group exact event records once, with chronological/time/name/ID ordering and regular event metadata. Copy retains complete dates and source links. Empty future coverage remains explicitly qualified.

## Verification

Targeted local checks cover the changed surfaces; no full local browser-suite rerun is required. `tests/phase4w.mjs` adds dynamic phone counts/link placement, a single responsive More disclosure, every request sort and complete matching copy order, stable IDs, retained page preferences and Back navigation, compact empty-index action, Calendar cross-month/same-day/no-future fixtures, route-return reset, active selection/toggle stability, and concise Info qualifications.

Retained affected regressions cover CSV/clipboard denial and recovery, undated Activity, source-observed/full/partial catalog counts, session-transition fixtures, historical deep links, sponsor sorting, keyboard/focus, directory privacy, original About wording and source links, grouped Calendar events, and toolbar geometry. Superseded presentation assertions now check the approved controls and wording; integrity and accessibility assertions remain enabled. Native selects are opened through the actual More disclosure, never forced while hidden.

Layout checks include 320, 375, 390, 430, 768, 1024 and 1280 CSS pixels, enlarged text and 200% CSS zoom, strict WCAG A/AA automated checks and representative phone/desktop screenshots. The open More panel is audited directly with 44px control assertions, followed by a full-page audit after dismissal: obscured background links are not treated as exposed targets. No accessibility rule is disabled.

Production build includes existing source/schema validation and vote integrity checks. Mandatory CI retains all Python integrity checks, build and every existing browser suite, adding Phase 4W. Published asset comparison and the final commit/run are reported with delivery; this document does not claim an unfinished CI run succeeded.

## Evidence and acceptance boundaries

No legislative source data, acquisition pipeline, roster, refresh frequency, hosting or indexing changes. Saved coverage remains 273 visible public requests, 272 verified statuses and one source-observed status; no introduced 2027 measures in the saved index. Fixtures are isolated test responses only.

Baseline scheduled-history check found no newer genuine schedule than [40109485828](https://github.com/utahbug/UtahBills/actions/runs/40109485828), which failed before preservation/deployment. TEST-001 remains High/Blocked; this push is not scheduled acquisition evidence. The pre-push check also found no active or queued workflow and no remote commits beyond the baseline.

Physical iPhone/iPad, manual VoiceOver/NVDA and native browser-zoom acceptance remain human tasks under UI-001. CSS zoom and automated checks do not complete them. RELEASE-001/002/004, first-real-2027 readiness and all other unfinished IDs remain open. Main remains the only configured deployment, with noindex/nofollow and the future domain plan unchanged.

Local outcome: production build/source validation and three vote-integrity tests passed. CSV/Mountain-date and session/Calendar model checks passed. Affected browser suites passed: Batch 2/2D, navigation, usability, toolbar, Phase 4B/4D/4E/4F/4G/4J/4O/4P/4Q/4R/4T/4U/4V the shared-header suite and the final Phase 4W suite. These include unchanged request-source evidence, full/partial reconciliation fixtures, CSV/fallback, seven target widths and strict accessibility assertions. Local Markdown file links and `git diff --check` passed. Remaining mandatory CI checks are not skipped.

## CI wording follow-up

Implementation commit: [d62f3e8c203ad0e139c776636e6a5d28ed91f9bd](https://github.com/utahbug/UtahBills/commit/d62f3e8c203ad0e139c776636e6a5d28ed91f9bd). Run [40157731046](https://github.com/utahbug/UtahBills/actions/runs/40157731046) passed mandatory Python integrity checks, build and the first five browser suites, then stopped in Batch 2C on its older exact Info wording. The test now explicitly requires both “Scheduled daily” and “Not live,” plus the approved empty-index qualification. Application assets and legislative evidence are unchanged. Main retains Phase 4V until all required checks succeed.

The corrected Batch 2C suite passed locally for all 272 verified request pages at 320/375/390/430px, source/disclosure assertions, enlarged text/CSS zoom, accessibility and isolated request-to-bill navigation. The directly affected Info refinement suite also passed. No unrelated local suites were repeated for this test-only follow-up.
