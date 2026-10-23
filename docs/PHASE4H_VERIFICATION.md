# Phase 4H — scheduled refresh and 2027 readiness

Verified October 22, 2026, 7:55 p.m. America/Denver (source timestamps October 23, 01:55 UTC). Baseline: `fb5798ad2b33b07daf005f9dad4438da3749bcc7`, clean main matching fetched origin/main. Phase 4G deployment [39884315205](https://github.com/utahbug/UtahBills/actions/runs/39884315205) succeeded. [Machine-readable evidence](PHASE4H_EVIDENCE.json) records exact source URLs, check timestamps, SHA-256 and preserved paths.

## TEST-001: open, blocked on a subsequent actual scheduled run

No cron-triggered execution has occurred since Phase 4G verification. No manual dispatch was triggered. Latest actual scheduled run remains [39820847031](https://github.com/utahbug/UtahBills/actions/runs/39820847031), created October 22 at 11:14 a.m. Mountain time, on pre-correction commit 95844b4f7a67796fe1974495ebaec490119c8d89.

| Stage | Evidence from that scheduled run |
| --- | --- |
| Official acquisition | Downloaded refresh-attempt artifact: Calendar 90 events across 8 complete months; catalog success with 267 requests, 267 verified statuses, zero introduced/linked; archive success with 5,672 expected/retrieved vote sources and no unavailable sources. These are that run's dated counts, not today's saved counts. |
| Reconciliation/validation | Catalog success report and Calendar/catalog integrity steps succeeded. |
| Required testing | Build passed; browser step failed waiting for `.calendar-empty` in tests/batch2.mjs. The assumed empty date had acquired a real meeting. |
| Snapshot preservation/commit | Preserve tested snapshots skipped after the failed browser gate; no validated snapshot publication from this run. |
| Deployment | Pages artifact and deploy skipped. |

The underlying Calendar test defect was already corrected in Phase 4C: current tests use isolated empty/occupied fixtures. Later manual recovery and push checks passed, but neither is a subsequent cron execution. No additional workflow correction is justified. TEST-001 remains open; status now explicitly Blocked on the missing scheduled evidence.

## Current authoritative sources

Fresh HTTP 200 responses from the official [2027 index](https://le.utah.gov/data/2027GS/billlist.json), [public request feed](https://le.utah.gov/data/2027GS/filelist.json), and [all-subject status listing](https://le.utah.gov/bills/billSearch.jsp?sess=2027GS&disp=all&sub=all) are byte-for-byte identical to the saved sources. Existing exact-ID/title reconciliation passes for all **268 requests/statuses**. No IDs were added/removed and no request records or statuses changed. The JSON index and human listing both contain **zero introduced measures**; therefore no new exact-ID request conversions or activity events are supported.

No acquisition run or data freshness timestamp was rewritten for an unchanged inspection. The 16 Phase 4G request observations remain unchanged. This is a bounded source finding, not proof that no legislative work is taking place.

### SESSION-002: blocked, incomplete roster evidence retained

The official [year-roster query](https://le.utah.gov/asp/roster/roster.asp?year=2027) returns 89 rows (65 representatives, 24 senators), but its year selector ends at 2026 and has no 2027 option. The response does not establish a finalized 2027 session roster or each row's applicable dates. Ten House and five Senate districts are absent; exact gaps are recorded in the evidence JSON. This response is neither imported nor treated as election outcomes, successors or finalized membership. Its [original bytes](evidence/phase4h/roster2027-response.html.txt) are preserved with SHA-256. No 2026 roster or current-contact inference fills the gaps.

### SESSION-003: fixture-ready, blocked on real introduced evidence

Reviewed existing coverage rather than duplicating it:

- `tests/catalog_updates.py`: first measure acquisition, exact tracking-ID conversion, same-title/different-ID separation, preserved requests, changed versions/actions, unchanged reuse, missing/contradictory statuses, identity mismatch, disappearing records and atomic retention on failure.
- `tests/catalog_data.py`: source-derived sponsor counts/IDs, official status reconciliation, preserved historical membership, explicit empty-index uncertainty and readable official request targets.
- `tests/phase4d.mjs`: 0/1/3/240 introduced-record browser scenarios, session default transition, request-to-bill round-trip, history, incomplete vote notices, paging and preserved historical access. Reviewed, not redundantly rerun locally; mandatory CI still runs it.
- `tests/activity_data.py` and `tests/phase4g.mjs`: new/revised/status observations, first introduced resolution, exact request association, stable event identity, date/category/page boundaries and missing dates. Existing action/document records preserve source wording and date limitations.

First real 2027 introduction, sponsor/version/action verification and conversion remain unavailable for live acceptance, so SESSION-003 is explicitly Blocked pending those sources. The acquisition pipeline remains intact; the separately reported navigation defect is addressed below.

## Reproduced defect and targeted correction

The activity provenance test indexed only current measure sources and request histories. After a 2027 measure revision, its valid first-observed event references the preserved first measure source, no longer current. Strengthening the existing revision fixture reproduced `KeyError: 'measure'`. The test source inventory now includes `measureHistory`. The same fixture checks that a changed source hash/title retains the initial event ID, title and traceable original source. This prevents a false CI publication failure when real 2027 measures begin changing. This correction changes tests only; the navigation correction below changes client routing. Acquisition is unchanged.

Local verification: all **21 targeted Python tests passed** (activity_data: 5, catalog_updates: 6, catalog_data: 10). The initial regression failed as expected before correction. After the additional navigation report, a production build (including three vote integrity tests), tests/phase4h.mjs and the existing tests/navigation.mjs passed locally. No full local browser run or new screenshots were needed. Mandatory GitHub Actions retains complete integrity/build checks and all 22 browser suites. The single local preview is stopped after testing. Final commit/deployment result is recorded in the delivery report.

## Additional reported navigation defect — ACT-002

Reported tracking ID **XKUCMCIIHJ** is Division of Purchasing Modifications, officially In Process, with no identified sponsor. It exists in both the saved request archive and generated catalog, with the correct `#request/XKUCMCIIHJ` activity link. No validation rule or source content needed correction.

Fresh Main navigation and direct reload resolved this request. An isolated older loaded catalog (the 253-ID baseline) paired with the current activity feed reproduced **Request unavailable**. The application loaded its catalog once but loaded activity later and independently; new activity could therefore reference IDs absent from the in-memory catalog. This is a reproduced synchronization failure, not proof of the exact cache state on the user's device. Baseline requests remain resolvable in that scenario; the 15 newer IDs are missing. All 16 current activity request links resolve with a coherent fresh catalog.

[Navigation correction 9d0f79f](https://github.com/utahbug/UtahBills/commit/9d0f79fc1c43ba6d09e29de91edab0137fa7a817): initial catalog fetch revalidates HTTP cache. A request absent from memory now fetches the published catalog with no-store, validates its collections/unique tracking IDs, updates catalog-derived bill/request/search state together, and retries the exact ID. Existing filters and session choices remain intact. A failed refresh offers Retry instead of claiming absence; a genuinely unknown ID remains unavailable with source/recovery links. A delayed response cannot replace another route. This fetches the generated, guarded catalog, never bypasses official-source reconciliation or guesses a record.

[Focused regression](../tests/phase4h.mjs) checks all real activity request destinations and source-panel IDs, explicitly including XKUCMCIIHJ; older baseline versus newer request behavior; mixed-snapshot recovery and reuse; retry after 503; genuine unknown IDs; and delayed navigation. The Phase 4G check now rejects unavailable destination headings rather than validating only the hash. Existing navigation regressions also passed. Physical-device/manual screen-reader verification remains outstanding. Live Main verification follows successful deployment.

## Remaining priority

Await and verify the next actual scheduled refresh and first real introduced measure; do not manually manufacture either acceptance condition. For the next scoped development batch, prioritize source-linked substitute/amendment/version history (TRANS-001) for 2027, while arranging human accessibility review (UI-001). Roster verification remains evidence-dependent. Historical conflicts, voter identities, LEG-001 and all unrelated tasks remain open. Main-only hosting, noindex/nofollow and Phase 4G functionality are unchanged.
