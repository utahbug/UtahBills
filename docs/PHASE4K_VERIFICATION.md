# Phase 4K — automatic refresh verification

Inspected October 22, 2026, approximately 22:20 America/Denver (October 23 04:20 UTC). Fetched clean `main` matching `origin/main` at `87c342ba264164691a9430409dfb0e0d7365d287`. Phase 4J [push deployment 39896134635](https://github.com/utahbug/UtahBills/actions/runs/39896134635) succeeded with all 24 browser suites. That push skipped acquisition and is not scheduled-refresh evidence.

## TEST-001: awaiting scheduled evidence

One bounded history query filtered by `event=schedule` found no run after [39820847031](https://github.com/utahbug/UtahBills/actions/runs/39820847031), October 22 17:14:08 UTC. The earlier successful schedule, 39642221786 on October 21, predates the failure and does not satisfy subsequent-run acceptance. No dispatch, acquisition, repeated cron polling or monitoring was initiated.

Rechecked the failed run's job steps: Calendar, 2027 catalog and applicable archive acquisition succeeded, as did Calendar/catalog validation and production build. The browser gate failed; snapshot preservation, artifact upload and deployment were skipped. [Phase 4H](PHASE4H_VERIFICATION.md#test-001-open-blocked-on-a-subsequent-actual-scheduled-run) preserves the report counts and diagnosis: a formerly empty Calendar date gained a real meeting. Phase 4C corrected that test using isolated fixtures. [Manual recovery 39869478421](PHASE4D_VERIFICATION.md#refresh-recovery-and-scheduling-distinction) separately demonstrated successful acquisition, tests, snapshot commit and deployment. Neither manual recovery nor later push checks closes TEST-001.

## Reviewed pipeline and safeguards

The [workflow](../.github/workflows/pages.yml) requests daily execution at **12:17 UTC**; actual Actions start time can differ, as the observed 17:14 UTC run demonstrates. Schedule invokes Calendar and 2027 catalog acquisition; archive refresh depends on catalog success. Calendar collects eight months and linked HTML agendas. Catalog fetches official introduced index, request feed and status listing; exact IDs, titles, session associations, lost records and bounded growth are checked. Applicable vote references are enumerated; valid unchanged cached responses are reused, with periodic 2027 rechecks. An archive success does not imply every historical response was downloaded again.

Calendar and catalog validate candidates before atomic manifest replacement. Archive failures preserve previously valid source bytes and retain explicit errors/history. Subsequent integrity tests, build and all browser suites precede snapshot commit and Pages publication. Catalog/archive staging depends on their step outcomes. Failed acquisitions can coexist with publication of independently valid or retained data; the refresh-health job flags failed step outcomes. Reports/logs are uploaded with 90-day retention and the workflow summary distinguishes components. No confirmed remaining blocker to the next cron run was established, so acquisition/workflow code is unchanged.

**Important limit:** archive acquisition can return normally with report `status: partial`, an `unavailable` list and warning while retaining prior valid sources. The step and refresh-health job alone therefore do not prove complete acquisition. Inspect `archive-refresh.json` and per-record `refreshError`/`failedAttemptAt`; do not close TEST-001 on a green step with a partial report. This is an existing, explicitly tested retention behavior, not evidence that all sources are fresh. A canceled overlapping workflow or an upstream reconciliation failure also cannot satisfy end-to-end acceptance.

## Freshness evidence map

| Question | Reliable existing evidence | Limits |
| --- | --- | --- |
| Last attempted scheduled check | Actions event, run ID, `createdAt`, and acquisition-step start times; attempt artifacts/logs | Run creation is not proof a step started. Static data does not retain every failed/canceled attempt; artifacts expire. |
| Last successful acquisition | Successful component report/log plus source `retrievedAt`, URL and hash | Catalog report has `attemptedAt`/`finishedAt`; Calendar uses log and per-source timestamps. Archive `checkedAt` may advance with reused or failed sources and is not proof of a new successful download. |
| Last successful validation | Candidate guards plus successful integrity/build/browser step completion timestamps for the identified run | No single persisted `validatedAt` field. Snapshot `checkedAt` precedes later CI gates. |
| Last verified publication | Successful Pages deploy job, tested commit/artifact and comparison of live files | Deployment time is not acquisition time; push builds may use older snapshots. |
| Most recent observed change | Hash-preserved request/status/measure histories and Activity observation events | Retrieval observations are not official submission/publication times; initial baselines are excluded. Calendar has source evidence but no equivalent comprehensive change-event history. Official action/document dates retain their separate meaning. |

Saved successful manual-refresh checks remain Calendar `2026-10-22T23:05:55.837120+00:00`, catalog `2026-10-22T23:05:57.188925+00:00`, archive `2026-10-22T23:05:58.092360+00:00`. The latest saved 2027 request observations use `2026-10-22T23:05:56.647422+00:00`; this is not an official change date. There are 268 requests and zero introduced measures. No timestamp or legislative source was rewritten for this inspection.

**Future compact freshness recommendation (not implemented):** show “Checks scheduled daily at 12:17 UTC; last successful [component] check: [verified timestamp]” with a contextual disclosure for last attempt/failure, retained snapshot, publication and observed-change dates. Use actual component acquisition evidence, not workflow/deploy success or the largest timestamp across components. When reports are missing or partial, explicitly label the limitation rather than implying a current successful update. Do not promise an exact execution time.

## Verification and remaining dependency

Targeted existing tests: `tests/calendar_data.py` (5), `tests/catalog_updates.py` (6), `tests/foundation_data.py` (9). These cover source integrity, exact-ID associations, malformed/contradictory sources, network failure retention and historical archive preservation. Synthetic failures are expected rejection tests, not new production acquisition attempts. No local browser rerun, preview server or new live acquisition was needed for this inspection/documentation batch. Required publication gates remain unchanged.

TEST-001 remains **High / Blocked**, with unchanged active backlog counts. The remaining evidence is one genuine subsequent schedule with successful Calendar/catalog/applicable archive reports (not partial), required tests, snapshot commit when warranted or explained no-change result, and successful Main publication linked to that tested snapshot. After it occurs, one bounded verification action can evaluate closure. No further code change or immediate manual refresh is required based on current evidence.

November 4, 2026 remains a readiness planning objective, not a release commitment. UI work, text counts, substitute comparisons, historical findings and all other open tasks remain outside this batch. Main-only hosting and static noindex/nofollow are unchanged.
