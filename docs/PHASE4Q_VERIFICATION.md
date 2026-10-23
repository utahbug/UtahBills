# Phase 4Q — independent observations with separate publication safeguards

Baseline: clean fetched main `00dd66327406e3634738bcd5e6f7bd70325caf67`, successful Phase 4P deployment [40019492419](https://github.com/utahbug/UtahBills/actions/runs/40019492419). Read AGENTS, authoritative backlog and Phase 4O/4P verification. Scope: supported request existence, separate from catalog acceptance.

## Official evidence and current result

One recheck at **2026-10-23T21:00:51–52Z** found **273 request-feed entries, 271 status rows and zero introduced measures**. [Source URLs, hashes, paths and timestamps](PHASE4Q_SOURCES.json). DYVEPWTRCQ / Health Insurance Amendments now has an exact matching status row, **In Process**. DFTEVYMLXT / Reauthorization of Administrative Rules and VYQQDPXGUY / General Oversight Amendments still lack statuses. No inferred sponsor, status, bill number or introduction date.

The two remaining omissions fit Phase 4O's unchanged three-record AND 1% limits, so the [guarded catalog acquisition](PHASE4Q_CATALOG.json) advanced normally to **271 verified statuses, two explicitly unconfirmed records, all 273 requests discoverable**. Report status remains **partial**, not full reconciliation. Historical 2026 data and existing text/vote acquisition remain unchanged. No live 2027 introduction/text or roster verification is claimed.

The preserved Phase 4P **273/270** pair was also independently validated against its pre-existing catalog baseline, without another retrieval. Its original retrieval dates establish the earlier supplemental observations. The strict catalog policy still rejects that pair, while the independent observation projection safely exposes all three missing-first-status records. DYVEPWTRCQ retains its still-earlier Phase 4O/4P observation, not a duplicate event. [Current supplemental report](PHASE4Q_OBSERVATIONS.json).

## Architecture and trust boundaries

`data/request-observations.json` is a separate, reproducible manifest. Each checkpoint pins complete original request/status/index sources and an immutable SHA-bound **local catalog baseline**, stored in `data/observation-baselines/`. These baseline copies are local manifests, not official source documents; original official bytes remain in `data/catalog-raw/`. Projection revalidates every checkpoint and its facts from those bytes. Supplemental input is explicit; catalog acquisition derives its trust baseline without supplemental records.

The supplemental validator establishes request existence and source-provided fields only. It rejects:

- Wrong URLs/session evidence, malformed/duplicate feed identities, empty/incomplete status listings, hash mismatches or invalid/unordered timestamps.
- Missing previously verified statuses, contradictory titles, unexplained extra status IDs, disappearing prior feed/observation identities, or suspicious growth beyond the existing 250-record guard.
- Missing/contradictory introduced relationships. The observed introduced index must equal an already accepted catalog index. An index change that failed catalog validation cannot be bypassed here; successful catalog acquisition can supply the newer baseline. Exact number/tracking/title agreement with the status listing remains required for known introduced measures.
- A supplemental discrepancy broader than **10 missing IDs or 5% of the feed**. Both independent conservative bounds apply. They limit this narrowly scoped channel, do not change the catalog's three/1% rule, and are not evidence that an official feed is complete. Broader discrepancies require investigation rather than automatic promotion.

Each channel atomically replaces only its own manifest after validation. Failure leaves previous accepted bytes intact. Unknown or unsafe associations remain unavailable as ordinary new records; source evidence and failed reports identify the coverage limitation. This is not a raw-feed bypass or a second route into verified membership.

## Shared acquisition, independent reporting and publication

The existing catalog refresh captures the three once-acquired responses and pre-attempt baseline in `test-results/catalog-sources.json` before reconciliation. It removes stale attempt metadata before starting and preserves the original attempted bytes in diagnostic artifacts. The separate observation step consumes this evidence, never re-fetches it, and runs even when catalog reconciliation fails. Network failure without a complete new capture fails observation acquisition rather than reusing stale sources.

Workflow outcomes remain separate for Calendar, catalog reconciliation, supplemental observations, text, votes, snapshot preservation and deployment. Catalog failure stays a failed step and fails the final refresh-health job even if supplemental publication succeeds. Text/vote acquisition still requires successful catalog acceptance. Reports say source observations only, not full reconciliation; partial catalog reconciliation remains explicit. Required integrity checks, build and the complete browser suite run before preserved snapshots and Main deployment. An accepted supplemental manifest and its raw/baseline dependencies can be committed even when the catalog is retained. No schedule, concurrency group, hosting or domain-plan change.

## Discovery, counts and recovery

The verified archive is unchanged in meaning. Supplemental records join only `sourceObservedRequests2027` and its observation history. The existing blue-gray outline flag, visible Official status not confirmed wording, source links, technical hashes and compact disclosure are reused. Counts distinguish the retained verified catalog from a newer supplemental source total and date; records with status rows awaiting catalog acceptance are explicitly qualified rather than promoted. The machine-readable verification report separately counts verified, source-observed and visible requests.

When a status row arrives before catalog acceptance, the prior observation remains discoverable and the disclosure explains the pending reconciliation. When catalog acceptance succeeds, verified state and status replace the unconfirmed presentation while preserving earlier discrepancy/history evidence. Verification timing is sorted separately from original retrieval time, including unchanged request bytes with later status evidence.

Activity uses successive preserved snapshots, not inferred submission/publication dates. Initial baseline requests generate no bulk new-event batch. Original event IDs survive recovery; unchanged adjacent source pairs do not create checkpoints or duplicate activity. A genuine A-to-B-to-A source revision is retained as history rather than mistaken for a repeated unchanged check. Current production projection has **22 2027 observations**. Two previously hidden requests now link to source-supported detail pages; DYVEPWTRCQ's original observation remains, with its current detail showing verified In Process status.

## Targeted verification

- Eight independent-observation cases cover agreement, one/several missing statuses, the actual 273/270 evidence, failed catalog plus successful supplemental report, atomic retention, recovery, status arrival before catalog acceptance, repeated unchanged content, title revision/reversion, malformed/duplicate/incomplete/conflicting sources, checksum/manifest tampering, disappearance, introduced-index mismatch, bounds and stale-capture rejection. Focused reruns resolved a verification-order defect; no catalog safety assertion was relaxed.
- Existing 11 Phase 4O/4P policy tests, 10 catalog integrity tests, six guarded-update tests and five Activity model tests passed. Production build passed source checks and three vote-integrity tests. All mandatory CI checks remain enabled.
- New browser regression uses the real preserved failed-catalog 273/270 evidence in an isolated intercepted fixture: three observed records, accurate counts/date qualifications, search, Copy, detail/source links, keyboard disclosure, Activity dates/navigation, 320/1280px, enlarged text, 200% CSS zoom and axe WCAG 2.2 A/AA. Existing Phase 4P and Phase 4O browser checks passed on the current 273/271 snapshot. No full-suite local repetition, physical-device or manual screen-reader claim.

## Remaining readiness and TEST-001

Latest genuine scheduled execution remains failed [39993137239](https://github.com/utahbug/UtahBills/actions/runs/39993137239); no newer schedule was present at investigation. **TEST-001 remains High/Blocked.** Local preserved-source runs and a successful push cannot close it, nor can a successful supplemental channel prove full catalog reconciliation. Check for an active scheduled run before push.

Next priority: inspect a genuine scheduled use of the independent channels and authoritative resolution of the remaining two statuses, then verify first-real-2027 introduction/text acquisition. SESSION-002/003, TRANS-001/002, manual accessibility/editorial review and historical findings retain their statuses. Main only, Review unconfigured, noindex/nofollow retained; the future bills.utahbug.com plan is unchanged. Publication evidence belongs to the completion report and Actions run.
