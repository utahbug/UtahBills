# Phase 7H — bounded acquisition repair, October 29, 2026

Starting commit: c366381fa5406d2dd144ae3719950764cdba34eb. Latest scheduled run remains 40931397254: build/Pages deployment succeeded, but Calendar, catalog and independent request observations failed; text/archive were skipped because catalog failed. No newer schedule or active workflow was listed during preparation. Source retrieval is independent of deployment success.

## Calendar repair

The official feed still identifies meeting-20656 (Transportation Interim Committee, October 21) as MINUTES at `https://le.utah.gov/interim/2026/html/00003920.htm`. Phase 7E's earlier agenda and 2026 SB 197 evidence remain unchanged. This is a document transition, not evidence that the bill or action disappeared.

A bounded optional `historicalAgendas` collection preserves the complete original agenda source (URL, bytes/encoding, retrieval time, SHA-256 and explicit numbered links) together with its original calendar response, exact meeting ID/date/name. Only an exact same-event, same-date/name/source/official-record, past AGENDA-to-MINUTES transition can reconcile the old current-link loss. Historical source hashes, normalized calendar identity and parsed original agenda links are reproduced. Prior history must remain byte-for-byte equal as structured evidence; missing events, duplicate identities, missing logistics, ambiguous/future transitions, source tampering and unrelated link loss still fail closed. No title-based association or current legislative action is inferred.

Current minutes stay in the current document field; current bill links remain empty. The compact Calendar projection excludes historical raw response bodies. Historical links appear in a separate disclosure explicitly labeled “Historical agenda evidence — not a current scheduled action,” with original retrieval date/checksum. Existing calendar Copy continues to use current fields only. No general UI redesign is included.

One isolated official acquisition completed at 2026-10-29T20:30:40.895489+00:00: 94 events, eight complete months, 11 historical agenda transitions. This includes meeting-20656/SB 197 and the now-transitioned meeting-20784/2025 SB 330. Every normalized current event reproduces from saved responses; historical evidence and repeated guards validate. The isolated snapshot is test evidence only (`test-results/phase7h/calendar-isolated.json`); repository/published data is not replaced. No scheduled or production acquisition success is claimed.

## Request discrepancy remains blocked

Exact tracking ID JNAUIKTYPJ:

- Request JSON and last verified October 28 status listing: **Concurrent Resolution Regarding Sentencing Guidelines**.
- October 29 status listing: **Concurrent Resolution Authorizing Adult Sentencing and Supervision Length Guidelines and Juvenile Disposition Guidelines**.

At 20:28 UTC, both current official responses are byte-identical to the failed October 29 attempt: request SHA-256 `5e0a1752fbde4e92c6c1e90c6737d6469e6f76cb8bb59004530ce32654dc1763`; status SHA-256 `9fd75e224d7fea7af499537353b695354a84645bd69532c8e08f16e396ffdada`. This is a substantive source contradiction, not whitespace normalization or a demonstrated parser error. Feed timing may explain it, but coherent verified title change is not established. The listing still says In Process / Not Numbered. No status promotion, invented bill number or bill-text change is inferred.

The original baseline title/status/source dates remain retained. Request acquisition logic is unchanged and still rejects the contradictory pair. Existing matching-title-change handling will preserve history only when both feeds agree under the same exact ID. [Pinned evidence](evidence/phase7h/verification.json) preserves URLs/timestamps/hashes and the contradictory listing bytes; the unchanged JSON reuses its already committed source file.

## Focused verification and publication gates

- Eight Calendar tests pass against both the retained and isolated post-transition snapshots: source reproduction, immutable evidence, repeated refresh, unexplained loss, corruption, wrong identity, future minutes, timezone/logistics and transactional network-failure retention.
- Four selected existing request-publication tests plus the new pinned real-source discrepancy regression pass: unchanged/idempotent recovery, verified matching title changes, contradictory or missing previously verified statuses, and bounded partial-publication limits. No assertion is weakened.
- The focused Calendar disclosure browser check passes at 390px: exact historical source/date/hash and SB 197 link, separate current Minutes, no current linked-bill claim, no horizontal overflow. It is added to mandatory CI; no unrelated local UI suite was rerun.
- Existing workflow already records five independent component outcomes, preserves attempt artifacts, gates text/archive on catalog, retains failed snapshots, and reports refresh_health failure independently of Pages success. No workflow change or speculative manual full refresh is necessary.

The exact correction commit, full mandatory CI and live Main/Review verification accompany delivery. A genuine post-repair schedule remains pending. Catalog and observation acquisition remain blocked while the official title contradiction persists; an overall green acquisition is not promised by this Calendar repair. Existing TEST-001 historical acceptance and unrelated backlog decisions are not reopened.

## Production boundary

Cloudflare Phase 7G deployment 2f8c2940-cbc9-49dd-bd68-bb3b49eaf329 remains unchanged. No new production data package, upload, updater, DNS, indexing, sitemap submission, analytics or advertising. A future production update requires separate authorization, reviewed successful component snapshots, compatible frozen code, regeneration/verification of data-dependent static request pages and sitemap, complete checksums and rollback. This phase does not implement that process or resolve the separate extended WebKit verification limitation.
