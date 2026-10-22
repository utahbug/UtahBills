# Phase 4D — data refresh and 2027 session readiness

Investigation: October 22, 2026. Baseline: `4673e250e3905bda04a3558e429c54afb9d80e15`, clean local/remote `main`; backlog documentation deployment [39868488992](https://github.com/utahbug/UtahBills/actions/runs/39868488992) passed before work began. No newer scheduled refresh existed at investigation.

## Official-source reconciliation

[Preserved evidence](PHASE4D_EVIDENCE.json) records exact source URLs, retrieval timestamps and SHA-256 hashes under `docs/phase4d-sources/`. These investigation files are not runtime data.

At 23:05 UTC, the official JSON listed **268 public requests**, the all-subject status listing contained **268 unique tracking IDs**, and the introduced index contained **zero measures**. Exact-ID and normalized-title reconciliation passed without changing the parser or source-completeness rules.

`MDIQORVFRP`, **Aquaculture Amendments**, sponsor `WILCORD`, now has the official status **In Process**, number **Not Numbered**, and observed anchor `trkMDIQORVFRP`. Compared with the preserved Phase 4C listing, this is the only added row: no rows were removed and no common parsed rows changed. The evidence supports an upstream row addition, not a demonstrated structural parser difference. It does not establish the Legislature's internal cause or precise correction time.

The unchanged validator still rejects the original 268-request/267-status audit sources with `Official status listing missing request MDIQORVFRP`. No status was invented, no request omitted and no guard relaxed.

## Refresh recovery and scheduling distinction

The latest actual scheduled run at investigation remained [39820847031](https://github.com/utahbug/UtahBills/actions/runs/39820847031), which failed before the Phase 4C Calendar test correction. No subsequent cron-triggered run had occurred.

The authorized [manual guarded refresh 39869478421](https://github.com/utahbug/UtahBills/actions/runs/39869478421), dispatched with `refresh_data=true`, uses the existing scheduled acquisition/test/commit/deploy path. Its retained acquisition reports establish:

| Component | Acquisition / reconciliation |
| --- | --- |
| Calendar | Success: 90 official events over eight complete months. |
| 2027 Catalog | Success: 268 public requests, all 268 statuses verified, zero introduced measures and zero linked requests. |
| Vote archive | Success: all 5,672 referenced responses available. Retrieval success does not resolve the five tally conflicts. |

The guarded run completed successfully: acquisition and reconciliation, the established 17 browser suites, snapshot commit [d4fa8cc](https://github.com/utahbug/UtahBills/commit/d4fa8cc22fb57eaec991423372d6d1fd95150a7a), and Main deployment all passed. Manual execution demonstrates recovery of the shared path; it does not prove the next cron trigger will run successfully. [TEST-001](TASK_BACKLOG.md#test-001) remains open for that observation.

## Transition-test changes

- `tests/usability.mjs` uses an isolated 240-request, empty-introduced fixture for fixed large-page/default-request assertions. The manual-copy fallback explicitly opens the Requests route instead of assuming the Bills default is requests.
- `tests/fixtures/session-transition.mjs` supplies browser-intercepted projections and detail responses only. It does not write to `data/`, participate in the build, or publish fictional records.
- `tests/phase4d.mjs` tests **0, 1, 3 and 240 introduced measures** at **390px and 1280px**, including all **25/50/100/200** page-size choices, fresh default selection, Advanced Search availability, Copy/toolbar alignment, sorting, chamber filtering, number search, pagination, detail/back state, request-to-bill/back links, removal of a converted request from the pending list, 2026 historical access and remembered page-size preferences.
- Existing Python controlled-update tests verify exact tracking-ID joins, separate identical-title/different-ID requests, preserved revision histories, incremental reuse, lost-record rejection and recovery. Existing failure cases compare the complete manifest bytes before/after rejection, which includes retrieval/check timestamps; Calendar failure tests similarly preserve the previous snapshot.
- The new suite verifies the preserved investigation hashes and is included in `npm test` (18 suites total). Existing runtime session/record-type selection is unchanged.

Representative one-measure mobile and three-measure desktop screenshots were visually reviewed; additional matrix screenshots are in ignored `test-results/phase4d/`. No application design or functional code changed. Physical iPhone/iPad and manual VoiceOver/NVDA checks remain separate human acceptance work.

## Local validation before snapshot publication

Passed: deterministic analysis, production build, Calendar integrity (5), Catalog integrity (10), controlled updates (6), foundation integrity (9), activity integrity (4), build-time vote integrity (3), and the complete **18-suite browser command**. The original 255-request saved snapshot was used for this local full run; synthetic future-session cases were intercepted independently. No new automated WCAG A/AA violations were reported. The guarded refresh separately validates the candidate official snapshots before publication.

## Remaining limits

Five official tally conflicts and 1,046 unresolved Walter identities remain unchanged. The 2027 roster remains unverified; an empty introduced index is not proof that no legislation exists. Calendar coverage still ends in May 2027. Human factual/accessibility review, real-device acceptance and a subsequent successful scheduled trigger remain outstanding. A successful deployment is not factual completeness or accessibility certification.

## Published snapshot and final readiness changes

Main now contains 268 requests (13 more than the previous verified snapshot) and 90 Calendar events (one additional event: October 23 General Oversight Committee, meeting-20784). The introduced index remains empty. No prior raw-source file changed; 2026 record/source references, every archived vote record, and previous request/status history entries were compared with the baseline and preserved.

Nine published files were checked against committed or generated bytes. Windows CRLF/LF differences were explicitly accounted for; the generated verification report also omits the committed report's final newline. Parsed report content matches exactly. Live Main at 390px verified the 268-request default, Aquaculture Amendments with In Process status, and the October 23 meeting. See PHASE4D_EVIDENCE.json for hashes and comparison methods.

After syncing the validated snapshot, the production build and the new Phase 4D matrix passed again. Readiness tests and source evidence are committed in [abfbd5c](https://github.com/utahbug/UtahBills/commit/abfbd5caed21ea189ff204f2105024dbe1b3ea73). The final push uses the existing workflow with all 18 browser suites; the delivery report records its outcome. DATA-001 and SESSION-001 are complete; TEST-001 retains the next actual scheduled-run check.
