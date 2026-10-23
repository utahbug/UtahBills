# Phase 4G — 2027 activity and change transparency

Baseline: `a37369e61feba922a1b54325759453700f01e028`, clean main matching fetched origin/main, successful deployment 39880927110. Checked October 22, 2026, America/Denver. Implementation: [45f2791](https://github.com/utahbug/UtahBills/commit/45f2791f27ef9612a09eee408556fdbc33faa2d4).

## Evidence and behavior

The existing activity projection, paged files, date-window logic and UI were extended. No raw legislative records, acquisition logic, reconciliation, source hashes, scheduled workflow, hosting or indexing policy changed.

| Category | Supported evidence and date meaning |
| --- | --- |
| Public requests | IDs absent from the initial preserved request baseline become “New public request observed” at their first saved observation. Baseline IDs produce no new-request events. Later title/sponsor-ID/status differences show previous and new values with previous-source metadata; first status observations are not changes. |
| Introduced legislation | First preserved 2027 measure revision establishes first observation, never official introduction time. Exact tracking IDs link original requests; title similarity is never used. Bills and resolutions are supported. |
| Legislative actions | Existing official action text and source dates remain unchanged, including vote-related actions. No new vote interpretation or result inference. |
| Documents and amendments | Existing Introduced, PubSub, PubAmend, Amended, Enrolled and AmdPages records retain official document-record dates and readable source links. Uploads do not establish passage or legal effect. |

New observation dates use America/Denver only for timestamps with an explicit timezone. Missing, invalid or naive observation timestamps have no inferred date and appear only in All activity. Official action/document dates retain their source calendar date; their timezone/publication meaning is not independently established. The contextual Info explains these distinctions, initial baseline exclusion, snapshot freshness and source limitations.

Event identity remains content-based. Existing action/document/status IDs are retained. Unchanged request observations generate no changes. First introduced observations use the preserved first revision, not a later retrieval of the same record. Hash-checked sources, source paths and source SHA-256 values remain in projected events; changed request events also retain previousSource. Unsupported source revisions are not automatically classified into legislative events; originals remain in preserved histories. No legal comparison or summary engine was added.

The compact category selector works with Today, Yesterday, Last 5 days and All activity. Filtering continues across file boundaries to fill a page, preserves Previous/Next and Copy, and resets the page when filters change. Empty scopes explain saved coverage without claiming no legislative work occurred and link to requests and legislation. Historical 2026 activity generation and bill histories remain intact; Recent Activity retains the approved 2027 focus.

## Real saved coverage

The baseline includes 253 public requests. Later verified snapshots support **15 new-request observations and one title-change observation**, for **16 real 2027 events**. No baseline events or synthetic production activity were published. Current saved records contain **zero introduced 2027 measures**, zero observed sponsor/status changes, and no 2027 actions/documents. These categories are supported and fixture-tested, not claimed as populated. There remain 41,602 historical 2026 events from the existing model. Counts describe this tested snapshot and may change through guarded refreshes.

Current contacts do not retroactively identify request sponsors or establish 2027 membership; sponsor changes display source IDs. Exact request-to-measure relationships are implemented but await the first actual introduced 2027 measure. SESSION-003 remains open for live-source transition/completeness verification. Broader substitute/late-change analysis (TRANS-001), personalized following, historical Code comparisons and new vote interpretation remain separate work.

## Risk-based verification

- [activity_data.py](../tests/activity_data.py): five passing tests cover all saved official actions, unique IDs/provenance, date parsing, duplicate/missing-date observations, baseline exclusion, new/title/sponsor/status events, first-status exclusion, unchanged retrieval stability, resolutions and exact-ID request joins. Synthetic cases are isolated mocks, not production records.
- Production build passed, including source checksum verification, catalog/archive projections and three vote integrity tests.
- Existing [activity.mjs](../tests/activity.mjs) passed: Mountain date/DST windows, paged real-source fixtures, history routes, search return state, Copy, mobile/tablet/desktop reflow, doubled text, CSS zoom and axe.
- New [phase4g.mjs](../tests/phase4g.mjs) passed: real saved events; all category choices; sparse matching across 100-record data pages; 25-row UI pagination; inclusive date boundaries; undated and empty cases; detail/source links; Copy and keyboard; 320/390/768/1280 widths; doubled text and 200% CSS zoom; automated WCAG 2.2 A/AA tags. Representative phone and desktop screenshots inspected under ignored test-results/phase4g.
- Full mandatory GitHub Actions integrity/build/browser checks remain unchanged, with the focused suite appended (21 browser suites). Their result and final deployment SHA are reported in the delivery summary. Broader redundant local runs were avoided as requested.
- No physical-device, browser-chrome zoom or manual screen-reader verification is claimed. These remain UI-001.

## Scheduled refresh and delivery

No actual cron-triggered refresh occurred after Phase 4F at inspection. Latest scheduled run remains [39820847031](https://github.com/utahbug/UtahBills/actions/runs/39820847031), failed before the prior correction. The successful push deployment is not acquisition evidence; TEST-001 remains open. Workflow was not changed.

Main only. Review remains unconfigured. Delivery verification compares the published application and generated activity files with the tested build, exercises real saved activity on permanent Main, and stops the single local preview. Exact delivery result is recorded in the final report.
