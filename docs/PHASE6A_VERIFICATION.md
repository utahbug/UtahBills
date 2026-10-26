# Phase 6A — Scheduled refresh acceptance and 2027 readiness

Reviewed October 26, 2026. Baseline: clean synchronized Main at `0b4fe6d162f677a859b840a1222d2e8ea68454fb`, published by [Phase 5J run 40418850466](https://github.com/utahbug/UtahBills/actions/runs/40418850466). No new official retrieval or manual refresh was initiated. This review uses preserved official evidence, actual scheduled logs/artifacts and current Main. Application, data and workflow files are unchanged.

## TEST-001 decision: complete, with disclosed source limitations

The original criterion requires a genuine post-correction schedule, Calendar acquisition/attempt reports/provenance, validation, snapshot preservation and deployed freshness; catalog/archive outcomes must be recorded separately. It does not require perfect upstream agreement or first-live-2027 introduction. Phase 4O–4Q's approved bounded partial-publication policy supersedes the older Phase 4N whole-catalog reconciliation prerequisite. No acceptance rule or safety gate is weakened here.

| Evidence | October 25 | October 26 |
| --- | --- | --- |
| Genuine event and run | [40211750281](https://github.com/utahbug/UtahBills/actions/runs/40211750281), `schedule`, started 16:27:23Z | [40380145137](https://github.com/utahbug/UtahBills/actions/runs/40380145137), `schedule`, started 18:42:40Z |
| Calendar | 90 events, eight complete months, checked 16:27:48.320041Z | 90 events, eight complete months, checked 18:44:06.684759Z |
| Catalog | 273/273 verified; full reconciliation; checked 16:27:50.644023Z | 274 source requests / 273 verified; explicitly partial; checked 18:44:09.140553Z |
| Independent observations | Successful; no missing status IDs | Successful; one missing-first-status ID, KECAYMBVUG |
| Introduced 2027 / conversions | 0 / 0 in saved evidence | 0 / 0 in saved evidence |
| Text acquisition | Successful empty work queue; zero attempts/failures | Successful empty work queue; zero attempts/failures |
| Vote archive | 5,672 expected/retrieved retained sources, zero unavailable; checked 16:28:00.732774Z | Same; checked 18:44:22.078623Z |
| Required integrity/build/browser gates | Passed | Passed |
| Snapshot commit | [1fcba42](https://github.com/utahbug/UtahBills/commit/1fcba42fee16917ed07150e3a4df999b6dbc8d56) after tests | [6d6b349](https://github.com/utahbug/UtahBills/commit/6d6b349fe9f57f96052bdf307754e5313f2d390b) after tests |
| Main deploy | Successful, recorded Main environment URL | Successful, recorded Main environment URL |

All times are UTC and acquisition/check observations, not legislative publication times. Both schedules ran later than the configured daily 12:17 UTC cron time; daily scheduled checking is not a guaranteed live update time.

### Acceptance matrix

- **Passed:** genuine scheduled execution; Calendar regression and provenance; independent component reports; mandatory validation/build/browser checks; tested snapshot commits; successful Main publication.
- **Passed with source limitations:** October 26 partial catalog and independent observation channel. The catalog step succeeded under its approved policy, while its report still says `partial`. Refresh health was skipped because no component failed, not because all official statuses reconciled.
- **Passed with preservation qualification:** vote acquisition reused 5,672 cached verified original responses (`retrieving 0`). The run checked the reference inventory; it did not redownload every historical vote. Five conflicting records and 1,046 unresolved historical voter entries remain disclosed; no new 2027 vote source was available.
- **Unverified, separately blocked:** first real 2027 measure/conversion/text/vote acquisition and final 2027 membership. SESSION-003 and SESSION-002 remain open. Empty index/queue success is not live first-introduction evidence.
- **Historical artifact limitation:** October 25's Pages artifact is no longer listed/downloadable. Its logs, successful deployment job and immutable snapshot remain; independent historical asset-byte comparison is not claimed. October 26's retained artifact provides direct publication/freshness verification and satisfies TEST-001 without that missing older artifact.

## Preserved source and publication evidence

[Compact machine-readable evidence](evidence/PHASE6A_SCHEDULED.json) retains actual component reports, run/step conclusions, snapshot IDs, source URL/hash/path/retrieval pins, attempt-report hashes and ten published-file hashes. Large raw files are not duplicated. Original attempt artifacts are `refresh-attempt-40211750281` and `refresh-attempt-40380145137` on their run pages; the workflow retains them for 90 days. The compact report preserves their material outcomes beyond that retention period.

Source verification traversed both committed catalog, Calendar, observation, text and archive manifests: **6,711 unique pinned files + 34 embedded source references** on October 25, and **6,714 + 32** on October 26. Every checked hash matched; pinned file paths exist in the corresponding Git snapshot. Each acquisition artifact's three raw catalog feeds also matched its source manifest. Calendar original response bodies and agenda evidence remain embedded in [calendar.json](../data/calendar.json).

October 26's `github-pages` artifact was compared byte-for-byte with current Main for catalog, Calendar, request observations, text manifest, vote archive, compact catalog/Calendar projections, verification summary, version coverage and activity index. All ten matched. Local JSON was compared semantically to avoid Windows checkout line-ending differences. This confirms later UI deployments retained the accepted scheduled data and its freshness, not that any newer live source was checked.

Reproduce from `gh run view RUN --json event,headSha,jobs` and `--log`, `gh run download RUN --name refresh-attempt-RUN`, `git show SNAPSHOT:data/catalog.json` (and other manifests), SHA-256 of each pinned original source, and the retained Pages artifact. Exact source paths/hashes and compared publication hashes are in the compact evidence report.

## Current accepted 2027 coverage and discrepancy

The saved request JSON has **274** unique public requests; **273** have independently verified status rows. **KECAYMBVUG — Homeless Shelter Amendments**, source sponsor ID `PETERVL`, is a separately published source observation. Its status history is empty and introduced-bill association is null. The actual Main detail route was checked: exact title/ID, **Official status not confirmed**, neutral source disclosure and noindex/nofollow remain intact.

One newly observed missing status is 1/274 (about 0.365%), within both the existing maximum three-record and 1% bounds. The ID was not previously status-verified or linked to introduced legislation. Accepted identities/titles/statuses are reproduced from the full immutable feeds; no hardcoded exception or inferred status is used. Conflicting identities/titles, missing previously verified statuses, unexplained disappearances/growth and questionable introduced relationships still fail closed. Independently supported facts do not become a verified status.

The index source remains empty at **2026-10-26T18:44:07.163168Z**; requests were retrieved at **18:44:07.525531Z**, statuses at **18:44:08.029806Z**. Current Calendar coverage is October 1, 2026–May 31, 2027. No introduced measures, request conversions or eligible 2027 text documents are established by these saved sources; this is not proof that none exist elsewhere or later.

## First-introduction readiness

Existing guards and fixtures cover exact tracking-ID joins, independent numbered listing agreement, title/status validation, preserved request history and removal from outstanding requests after conversion, revised actions/versions/vote references, stable observation IDs, metadata-derived XML identity/hash validation, bounded acquisition, partial recovery and atomic retention. Amendment instructions remain distinct from complete text; PDF/XML counterparts do not double-count versions. Sponsor fixtures distinguish chief/floor/cosponsor roles, exclude requests/resolutions/2026 records from 2027 bill counts and deduplicate versions.

Locally rerun existing tests only: `tests/catalog_updates.py` **7 passed**, `tests/text_acquisition.py` **17 passed**, `tests/version_data.py` **8 passed**, and `node tests/phase4v-data.mjs` passed. Synthetic failures and fixtures stay isolated. Reviewed the successful scheduled Calendar, request-publication, supplemental-observation, activity and vote-foundation tests rather than redundantly rerunning them. Vote foundation explicitly checks every reference, wrong sessions/checksums, missing details and retrieval-failure retention. No uncovered defect requiring a code change was established. Real-source variation remains an acceptance risk under SESSION-003, not a demonstrated failure.

## Next actions and boundaries

1. When real 2027 introduced measures appear, perform SESSION-003's bounded official index/listing/detail, request conversion, sponsorship, text/version/action/vote and publication review. Keep it blocked until actual evidence exists.
2. Verify authoritative 2027 membership under SESSION-002 when available; do not promote the 2026 roster.
3. Continue RELEASE-001 independent editorial/correction-process acceptance and UI-001 physical-device/manual assistive-technology/native-zoom acceptance. TEST-001 closure removes only that dependency from RELEASE-002; it does not close the release review or authorize public release.

No UI, archive, Contact, DNS, hosting, frequency, original data or safeguards change. Main-only publication and noindex/nofollow remain. Required CI accompanies this documentation publication; delivery records its commit/run. Routine archive refinement remains subject to the Phase 5J owner review boundary.
