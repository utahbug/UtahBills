# Phase 5A — legislative data and release-readiness audit

Assessment date: **October 24, 2026, America/Denver** (bounded source retrieval October 25, 05:38:55–05:38:56 UTC). **Useful development access; public-release acceptance remains incomplete.** November 4 is a planning target, not launch authorization.

## Baseline and evidence boundaries

Phase 4X commit `68b48797548f86dd58d0b7293d6ef34b09d5af2e` passed required checks and [Main deployment 40164863688](https://github.com/utahbug/UtahBills/actions/runs/40164863688). Main was clean and synchronized before this audit; no scheduled acquisition was active. No newer genuine schedule than 40109485828 was found. No manual workflow was dispatched.

This audit distinguishes four states:

- **Published accepted data:** October 23 catalog, 273 visible requests / 272 verified statuses / one source-observed request; unchanged by the audit.
- **Newly checked official evidence:** 273 request records / 273 matching status rows, empty introduced index, unchanged incomplete roster response. [URLs, original-byte hashes and timestamps](PHASE5A_SOURCES.json).
- **Validated but unpublished candidate:** the existing guarded refresh accepted that once-retrieved evidence in an isolated target. [Candidate outcome](PHASE5A_CANDIDATE.json). It is not scheduled acceptance or a production data update.
- **Earlier unpublished scheduled candidate:** October 24 run acquired 273/273 but failed before snapshot preservation/deployment. Original diagnostic files remain in the [Phase 4U evidence manifest](evidence/phase4u-scheduled-40109485828/evidence-manifest.json); all nine hashes were reverified.

Identical response bytes reuse existing preserved files, including the scheduled status response. No historical bulk acquisition, Calendar re-download, fictional production records, new reporting framework or visual redesign was performed.

## Current coverage and exhaustive request audit

| Area | Published evidence and qualification |
| --- | --- |
| Requests | 273 unique visible tracking IDs; 272 status-verified and one source-observed. No duplicate display IDs, omitted saved requests, wrong saved titles/sponsor IDs or incorrect saved statuses found. |
| Status wording | 266 **In Process**, six **Bill Abandoned per Sponsor**, one **Official status not confirmed**. All six abandonment labels match the original listing exactly; no motive or future outcome inferred. IDs/titles are in the [audit report](PHASE5A_AUDIT.json). |
| Histories | 275 title/sponsor history entries and 272 status-history entries checked against their own preserved bytes and hashes. Observation dates are not official submission/status-change dates. |
| Freshness | Request feed retrieved `2026-10-23T21:37:27.418777+00:00`; status listing `2026-10-23T21:37:27.576392+00:00`; catalog validation `2026-10-23T21:37:46.644411+00:00`. These differ from deployment and the audit's newer retrieval. |
| Introductions and conversions | Zero saved 2027 introduced bills/resolutions; zero exact-ID conversions. The newly checked official index remains `[]`, and the listing has no numbered measures. This is not proof that no legislation exists outside saved/public source coverage. SESSION-003 remains Blocked. |
| 2027 text, actions, votes | No qualifying introduced metadata, text documents, substitute/amendment records, legislative actions or votes. An empty successful text-acquisition run is not a live text-acquisition demonstration. |
| Recent Activity | 22 saved 2027 events: 20 new-request observations and two title-change observations; zero undated events in this snapshot. Unique stable IDs and request-detail targets verified. No baseline event flood or fabricated official publication dates. |
| Membership and sponsorship | 104 historical 2026 members, separately dated contact evidence, no verified 2027 roster. All source-supplied request sponsor IDs resolve to saved identity evidence; this does not establish 2027 membership. |
| Historical reference | 1,016 measures: 931 bills / 85 resolutions. All have metadata text links; only 13 text documents across five bills are locally validated, and four bills have comparisons. Nine enhanced-reader versions/four explanations are not universal analysis coverage. |
| Historical votes | 5,672 sources; 5,667 reconciled details; 115,130 individual entries. Five tally conflicts and 1,046 unresolved Walter, N. entries remain disclosed. No attribution change or historical reacquisition. |

Every saved request was also searched by exact tracking ID on Main: all 273 returned exactly one correct detail link and title. Complete CSV contained exactly those 273 IDs in selected tracking-ID order; the abandonment-filter CSV contained exactly six. Titles, statuses, session, empty introduced-bill fields and official URLs matched saved records. CSV remains export-only escaped; source values are unchanged.

Representative live checks covered request/detail/source dialog (including XKUCMCIIHJ, the unconfirmed record and an abandoned request), introduced empty state, Activity, Calendar, directory, About Data and archive. Saved preferences must be respected: entering Bills does not itself force the introduced record type; selecting that type produces the qualified empty-index message. No navigation defect was inferred from preserved filter state.

## New official comparison

Only one bounded retrieval of request JSON, all-subject status listing, introduced index and year-qualified roster was made. Request bytes are unchanged. **VYQQDPXGUY / General Oversight Amendments now has an exact matching In Process status.** All other saved request titles, sponsor IDs and statuses agree; no new or disappeared request IDs were found. The status response is byte-identical to the preserved unpublished October 24 scheduled candidate.

The 2027 roster-query response is unchanged from earlier preserved evidence: 89 rows (65 House / 24 Senate), no 2027 year-selector option, incomplete chamber/district coverage. It cannot establish final 2027 membership. SESSION-002 remains Blocked. The 2026 roster and contacts are not substituted for it.

The isolated candidate passed the existing bounded reconciliation, disappearance/growth, exact identity, historical preservation and atomic candidate-writing path with all 273 statuses. Production files were deliberately not replaced during the audit. Source convergence removes the observed upstream omission at the audit time; it does not demonstrate subsequent scheduled publication or retroactively change Main's older snapshot.

## Confirmed defect and bounded correction

**Needs correction before accepting the first real introduced measure — corrected and locally verified; mandatory publication checks required.** Existing numbered-status checks ran only when catalog reconciliation was partial. A temporary fixture with the same request ID, metadata `HB0001`, but status-listing number `HB9999` was incorrectly accepted when every request had a status.

The existing guard now applies whenever a status source is present, including full reconciliation. It rejects numbered rows without a matching acquired measure, mismatched exact tracking-ID/number relationships, missing/not-numbered introduced identities and conflicting introduced titles before atomic publication. No inferred relationships, source edits or relaxed bounds are introduced. A valid exact-ID conversion still links the request archive and removes the converted request from the outstanding-request list.

Regression fixtures now supply complete numbered listing evidence for valid introductions; intentionally missing-listing scenarios explicitly retain their incomplete fixture. Their original rejection and atomic-retention assertions remain. No actual 2027 data is affected because the saved introduced index is empty.

## Scheduled refresh assessment — TEST-001 remains open

[Run 40109485828](https://github.com/utahbug/UtahBills/actions/runs/40109485828), event **schedule**, began `2026-10-24T15:59:42Z`. [Preserved job outcomes](PHASE5A_SCHEDULE.json) and the earlier nine-file artifact distinguish:

| Component | Actual outcome |
| --- | --- |
| Calendar | Acquired 90 events / eight months; provenance checks passed. |
| Catalog | Acquired/reconciled 273/273 requests; zero introductions/conversions. |
| Independent observations | Success, 273 matched statuses, no missing IDs; still a separate channel. |
| Legislative text | Success with **zero attempted documents**; not live text acceptance. |
| Vote archive | Success, 5,672 expected/retrieved, no unavailable sources in the report; historical conflicts remain separate. |
| Integrity and build | Passed. |
| Browser checks | Failed on the outdated fully reconciled count assertion in Phase 4R's test. Phase 4U corrected it with full/partial fixtures; subsequent required push suites passed. |
| Snapshot preservation / deployment | Both skipped. No scheduled candidate was promoted. |
| Refresh-health job | Skipped because no acquisition component failed. The overall workflow still failed on browser validation; health alone is not publication evidence. |

There has been no later genuine schedule to validate the complete corrected path. TEST-001 and RELEASE-002 stay open. Closure requires actual scheduled component reports (including partial/rejected/skipped cases), mandatory tests, snapshot commit or justified unchanged result, Main deployment and published freshness verification. Schedule is 12:17 UTC daily with possible execution delays. Do not cancel an active schedule with a competing push.

## Calendar factual boundaries

All 90 events reproduce from eight checksum-verified saved monthly responses: 55 meetings, two floor events, 31 deadlines and two session milestones. Five revisions, no cancellation in this snapshot. Coverage is **October 1, 2026–May 31, 2027**; feed retrievals are October 23 17:13:53–17:13:56 UTC and validation is 17:14:08.505568 UTC. Coverage is not freshness.

Normalization checks each source day and weekday, requires a timezone, converts to America/Denver and rejects an event whose Mountain date disagrees with its source day. Existing tests cover the October/November DST offsets, revisions, cancellations and atomic failure retention. Event descriptions, official URLs, available agendas, source classifications and date grouping are preserved. Upcoming mode searches saved matching dates across months. Empty days do not establish closure, and absent agenda links do not establish that no agenda exists. PDF-only extraction, unannounced events and coverage beyond May remain disclosed limitations, not invented data.

## Release classification and priorities

| Classification | Finding / next action |
| --- | --- |
| Verified and ready within saved scope | Exhaustive request identity/title/status/history and search/export checks; stable-ID sponsorship model with request/resolution/version exclusion; saved Calendar reproduction; source-pinned historical references. |
| Needs correction | Full-reconciliation numbered-identity gap above: publish only after its targeted checks and mandatory CI pass. It is a future acceptance defect, not evidence of a wrong current 2027 bill. |
| Verified with disclosed limitation | Main's older 272/273 status snapshot; bounded text comparisons; historical vote/identity gaps; Calendar scope/extraction; failed-attempt reports primarily linked through Actions. |
| Blocked by official evidence | SESSION-002 final roster, SESSION-003 first real introduced measure/conversion and live 2027 text acquisition. Keep exact-ID, version/action and comparison validation when evidence appears. |
| Reliability acceptance gap | TEST-001 lacks a subsequent scheduled end-to-end publication. A push deployment or isolated cached-source candidate cannot close it. |
| Independent human review / owner approval | RELEASE-001's four editorial reviews and operational correction channel; UI-001's physical-device/VoiceOver/NVDA/native-zoom acceptance; RELEASE-004 explicit owner release decision. |

**Before November 4, in order:** publish and verify the bounded identity correction; evaluate the next genuine scheduled acquisition and its recovered status; complete independent editorial and human accessibility acceptance and appoint the correction channel/reviewers; validate the first real 2027 introduction/roster when available or explicitly accept the disclosed evidence limitations; obtain owner release authorization. Do not remove noindex/nofollow in this phase.

Historical conflicts remain lower-priority reference work unless they expose a defect affecting 2027. LEG-003 sponsorship comparisons, TRANS-002 expansion and cosmetic refinements remain deferred/separately scoped. No new domain, Review environment, DNS, hosting, schedule or source interpretation is authorized here.

## Human materials and verification

The four existing packets retain their exact hashes/versions: HB0011 introduced, HB0154S01, HB0155 introduced and SB0069S02. All four XML pins were rechecked; no explanation was rewritten or substituted with a later version. Independent dispositions and the owner-selected correction intake remain pending. The existing accessibility worksheet is updated only for obsolete Activity date options, Calendar navigation and complete-results Copy/CSV controls; no outcome is changed to passed.

At this audit commit (later snapshots require a new assessment), reproduce the exhaustive preserved-source audit with `python tests/phase5a_audit.py --report`; it performs no network requests or production writes. [Machine-readable results](PHASE5A_AUDIT.json), [one-time source evidence](PHASE5A_SOURCES.json), [isolated candidate](PHASE5A_CANDIDATE.json) and [scheduled outcomes](PHASE5A_SCHEDULE.json) support this assessment. Existing targeted model/integrity suites cover the guard, partial recovery, supplemental observations, sponsorship exclusions, Calendar timezone/cancellation and CSV/date handling. Local results: 41 targeted Python tests passed (7 catalog updates, 11 partial publication, 8 supplemental observations, 10 saved-catalog checks and 5 Calendar checks); the production build passed original-source/version/summary checks plus 3 vote-integrity tests. Sponsorship/Calendar and CSV/Mountain-date model scripts passed. All 273 live request searches, complete 273-row and filtered six-row CSV comparisons, three request-detail/source dialogs and representative routes passed. All nine scheduled-artifact hashes and all four editorial XML pins matched. Markdown file destinations, unchanged task IDs/status headings and git whitespace checks passed. No full local browser-suite repetition or human acceptance was performed. The consolidated batch is ready for Main publication through mandatory CI. The final commit, CI result and live asset verification accompany delivery; this assessment does not substitute a push deployment for scheduled-refresh acceptance.

## Publication safeguards

The owner supplied the complete publication requirements before commit. Main-only publication, original sources/history, guarded acquisition, neutral language, accessible disclosures and static noindex/nofollow are retained. No DNS, Cloudflare, domain, hosting or Review change, and no public-release authorization. The pre-publication check found synchronized Main, no active/queued workflow and no schedule newer than 40109485828. This release publishes the validation correction and audit materials; accepted legislative snapshots remain unchanged. The newly reconciled evidence remains an explicitly isolated candidate, awaiting normal guarded acquisition/publication. Technical preparation supports further human review; it does not establish final public-release approval.
