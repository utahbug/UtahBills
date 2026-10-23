# Phase 4N — official source reconciliation and 2027 readiness

Verified October 23, 2026. Fetched clean `main` and `origin/main` both at `823881d47f9c586d6cdc8726020caf5c87bb986b`; latest push publication [39995658091](https://github.com/utahbug/UtahBills/actions/runs/39995658091) succeeded. The scheduled Calendar-only snapshot `4e6ef340eb1a427716c7c127410b223e4eb70234` is already included. No application, acquisition, workflow, legislative catalog or text-manifest changes are justified by this investigation.

## Official reconciliation

One bounded acquisition at **2026-10-23T18:09:23Z** returned HTTP 200 from all three official endpoints. [Evidence manifest](evidence/phase4n/manifest.json) records exact URLs, response paths, retrieval timestamps, original-byte SHA-256 hashes, count/set comparisons and the isolated guarded-replay result. Original response bytes are preserved beside the manifest and protected against Git line-ending conversion.

| Official source | Observed result |
| --- | --- |
| [Public requests](https://le.utah.gov/data/2027GS/filelist.json) | 271 unique requests |
| [All-subject status listing](https://le.utah.gov/bills/billSearch.jsp?sess=2027GS&disp=all&sub=all) | 270 unique status rows, all `Not Numbered` |
| [Introduced index](https://le.utah.gov/data/2027GS/billlist.json) | Zero bills/resolutions; unchanged empty-array hash |

**DYVEPWTRCQ remains publicly present in the JSON feed as Health Insurance Amendments, with an empty sponsor field. It remains absent from the human status listing.** Its literal ID is absent from the original HTML, and independent extraction of all `data-trackingid` attributes finds the same 270 IDs as the existing parser. This demonstrates an upstream source omission, not a parser dropping a present record. Timing, caching or another upstream cause cannot be distinguished from these responses; no submission/publication date or missing status is inferred.

There is exactly one missing status ID, no extra status IDs, and no title mismatch among the 270 matched requests. Compared with the published 268-request snapshot, three IDs are new: DYVEPWTRCQ; BSDHEWBYIL (Water Rights Restricted Account Amendments, sponsor ALBRECR); TFEMJWKJCF (Transfer of Water Interests, sponsor OWENSDO). No saved ID disappeared. ECMJQIXCHM changed title from Judicial Performance Conduct Commission Amendments to Judicial Performance Evaluation Commission Modifications; its sponsor remains blank. Matched saved statuses are unchanged. Sponsor strings are official feed values, not independently verified 2027 membership.

The complete candidate cannot reconcile. **All 268 previously verified requests, their histories and the 16 saved Recent Activity observations remain unchanged**, including the older verified ECMJQIXCHM title. None of the new/revised candidate records is selectively promoted. The saved catalog SHA-256 remains `003e64ec12b16d4352a0d38047af2d796608118df5181209c4eab1487fc94e90`. Existing source timestamps are not refreshed by this diagnostic check.

Resolution requires authoritative complete exact-ID/title agreement, or an independently supported request-to-introduced-measure conversion satisfying the existing guards. Removing a still-public feed record, inferring a status, or relaxing exact-ID matching is not a resolution. No repeated live retry or manual refresh was triggered.

## Scheduled execution and diagnostic review

No genuine scheduled execution newer than [39993137239](https://github.com/utahbug/UtahBills/actions/runs/39993137239) was available at this review. That run was created at 17:12:16Z on Phase 4M commit `dd692def5b5e55ef40b53ed2e2eb9b05fc285fad`.

| Stage | Verified evidence |
| --- | --- |
| Calendar acquisition | Success: 90 events / eight complete months in the preserved log |
| Catalog acquisition/reconciliation | Failed at 17:14:08–17:14:09Z: missing DYVEPWTRCQ; [original report](PHASE4M_SCHEDULED_CATALOG.json) |
| Dependent text/archive | Both skipped because catalog acquisition failed; not successful empty acquisitions |
| Integrity/build/browser gates | Passed; all 25 browser suites and Phase 4M acquisition tests passed |
| Snapshot preservation | Bot commit [4e6ef34](https://github.com/utahbug/UtahBills/commit/4e6ef340eb1a427716c7c127410b223e4eb70234) changed only Calendar; catalog/text/archive retained |
| Main publication | Deploy job succeeded at 17:28:39Z |
| Overall refresh | `refresh_health` failed and overall run failed; deployment does not establish catalog acquisition success |

GitHub's step API reports a `success` conclusion for the continue-on-error catalog step. The actual step outcome, failed machine-readable report, dependent skipped steps, job summary warning and failed independent health job correctly distinguish acquisition failure. Reviewers must not use that step conclusion alone. Text partial acquisition has explicit report counts/status and warnings; valid partial progress is publishable only after the existing integrity/tests, while fatal failures retain prior manifests. Archive outcomes likewise require their report, not merely a green step. This run did not attempt either dependent component, so it provides no live partial-text recovery evidence. No new reporting or workflow defect was established; code remains unchanged.

**TEST-001 remains High / Blocked.** A subsequent genuine schedule must satisfy acquisition, reconciliation, applicable text/archive outcomes, tests, preserved snapshots and publication acceptance. Neither this documentation push nor the previous successful push substitutes for that evidence.

## First-introduction and text readiness

Both the index and human-readable listing still show zero introduced 2027 measures. No real request conversion, bill versions, document metadata, or new legislative activity can be validated from this snapshot. No fabricated events or membership are added.

Phase 4M remains fixture-verified for bounded official-metadata-linked XML acquisition, exact session/bill/version validation, original bytes/hashes, revision preservation, partial outcomes/recovery and comparison integration. It has not demonstrated live 2027 text acquisition: this scheduled attempt correctly skipped it. SESSION-003 remains blocked pending first actual introduced records and conversions; SESSION-002 remains blocked pending a verified roster and is not inferred from sponsors. TRANS-001 remains In progress and TRANS-002 Approved/Not started.

## Verification and publication scope

- Replayed the three preserved real responses through the unchanged `refresh_catalog.run()` using a temporary target and mocked acquisition only: exact missing-ID failure, failed report, and byte-identical retained catalog. No network retry or production candidate promotion.
- Existing `tests/catalog_updates.py`: all six tests passed, covering exact-ID conversions, changed revisions, source rejection, disappearing data, status-only changes and atomic failure retention.
- Main baseline: nine generated files match the previously tested build; published Calendar and derived Calendar view match the scheduled snapshot; noindex/nofollow retained.
- Evidence hashes and relative documentation links checked before commit. Documentation/evidence-only change: no redundant local browser suite, screenshots, preview server or new physical-device/manual screen-reader claim. All mandatory CI publication checks remain enabled.

Publication result and commit are identified by this document's Git history and the corresponding Main push workflow; no success is claimed here before that workflow completes. Review remains unconfigured. All unfinished task statuses and inventory counts remain unchanged.

Next substantive priority: authoritative request/status convergence, followed by a genuine qualifying scheduled refresh and first-real-2027 introduction/text verification. November 4 is a readiness planning target, not a guaranteed public-release date. Existing accessibility/editorial-review and roster dependencies remain open; no unrelated feature expansion started.
