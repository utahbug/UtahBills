# UtahBills development roadmap

## Current priority — 2027 legislative cycle

Owner decision, Phase 4F: prioritize useful, accurate, accessible coverage from October 2026 through April 2027. Focus on 2027 requests and introduced legislation, Recent Activity, changes/substitutes/votes, Calendar coverage, guarded refresh verification, verified membership and accessibility. Preserve historical 2026 records and safeguards. Historical vote conflicts and voter identities remain unresolved lower-priority reference work; investigate promptly if they expose defects affecting 2027 accuracy.

Find My Legislators now offers a compact official-finder link. Direct address lookup remains blocked under [LEG-001](docs/TASK_BACKLOG.md#leg-001), not completed: investigated geocoders do not meet the requested address privacy constraints. See [Phase 4F evidence](docs/PHASE4F_VERIFICATION.md).


Actionable task IDs, priorities, dependencies and acceptance criteria are maintained in the [authoritative task backlog](docs/TASK_BACKLOG.md). This roadmap remains the high-level strategy; completed phases do not close unresolved backlog findings.

Status: **Implemented** = available in the research prototype; **Planned** = approved direction for a later batch, not a delivery date; **Deferred** = revisit after core coverage and review. Priorities run from Stage 1 to Stage 6. Each stage needs a bounded batch and source verification before implementation.

## Implemented — through Phase 3

- Four real 2026 bills, saved official records and provenance checks.
- Search/filters, bill details, stages, aggregate votes, version comparisons and transparency timeline.
- Mobile stacked listings, UTF-8 pipeline correction, structured formatted bill reader for nine versions.
- Readings/votes/sponsorship guide with official references; compact header and secondary help navigation.
- Blue icons, Main deployment, temporary noindex/nofollow and Research Prototype notice.

- **Batch 2A:** official combined month-and-agenda calendar, category filters, Mountain times, rooms, agendas, explicit numbered-bill links and participation links; preserved sources and guarded daily Main refresh (October 2026–May 2027).
- **Batch 2A:** whole-row bill links, hover/focus feedback, 25-result pages, cached search text, restored filters/sort/page/scroll and logo return to top.

- **Interface refinement:** collapsed contextual vote guidance, expanded readable source details with secondary new-tab technical links, formatted-reader entry point and official PDF links, fixed search Info alignment, compact heading and consolidated request counts. Formatted in-app text remains limited to the nine verified example versions; basic measures link to official readable documents.

- **Request-status correction implemented:** complete tracking-ID joins to the official all-subject listing, daily status-only change detection, preserved status history and separate document-availability wording.

- **Navigation refinement implemented:** consistent nested disclosure alignment; stable-ID, session-aware sponsor profiles; source-verified request anchors; Lucide external-link indicators; Introduced Legislation with Bills/Resolutions filters. No expanded 2027 roster claim or new environment.

- **Phase 2 implemented:** independent 2026 index/listing verification; complete version/action/document/statutory-reference metadata; full referenced-vote acquisition with per-record gaps and conflicts reported; incremental daily 2027 vote acquisition; on-demand readers/votes, filtered paginated histories and a generated verification report.

- **Phase 3 implemented:** paged individual Recent Activity events, Mountain calendar-day windows, distinct document/status-observation labels, direct history links, collapsed Advanced Search and Source details, compact independent search scope.

## Stage 1 — Legislative data and transparency · Partly implemented

- **Implemented:** all 1,016 indexed 2026 measures as basic official records (931 bills, 85 resolutions); four examples retain reviewed explanations and comparisons.
- **Batch 2C implemented:** guarded daily 2027 metadata/request refresh, exact tracking-ID reconciliation, preserved request/measure revisions, independent refresh reports and retained 2026 history.
- **Next bounded batch:** verify first-real-2027 source completeness and connect the authoritative 2027 roster when published; scheduled end-to-end acceptance is complete under Phase 6A. Historical vote discrepancies and voter identities remain lower priority unless they affect current-session accuracy. Expand verified vote coverage with explicit identity and source checks; broader XML analysis remains separate later work.
- **Implemented:** separately labeled public requests and introduced measures; counts derive from each verified snapshot. The initial Batch 2C snapshot has 253 pending requests and an empty introduced index; neither count is fixed in the application.
- **Batch 2C implemented:** compact status/Info disclosure and corrected shared request template, human-readable official listing, optional source/history details.
- Substitutes, late changes and boxcar-bill histories using verifiable version/publication evidence.
- **Batch 2D implemented:** 22 source-verified decisions / 524 individual entries for HB0002, HB0011, HB0154 and SB0069; HB0155 has no imported roll call. Bill vote sections and explicitly partial legislator histories distinguish voice, procedural, amendment, committee recommendation, passage and concurrence records.
- **Phase 2 implemented:** all 5,672 action-history vote sources retrieved; 5,667 reconciled records and 115,130 individual entries. Five conflicting tallies are flagged and individual attribution withheld. Full version/document/statutory metadata and an index/listing completeness report are available; readers and roll calls load on demand.
- **Planned:** resolve official discrepancies and historical identity gaps; establish coverage beyond available action-history references.
- Historical statutory comparisons and related legislation; independently verify baseline and effective dates.

- **Batch 2D implemented:** initial 2027 request/introduced default based on verified records; preserved session choices; inline search Info, separate search clear and filter clear; structurally separated detail back links.

## Stage 2 — Legislator directory · Partly implemented

- **Phase 6F implemented — LEG-003 Public Requests portion:** Compact Name / Introduced bills / Public requests directory. Unique currently listed, unconverted 2027 requests use exact saved sponsor IDs, include qualified source observations and link to matching profile lists. Missing/unmatched IDs are explicitly disclosed. Membership remains the verified 2026 roster; broader sponsorship comparison and optional columns remain deferred. [Verification](docs/PHASE6F_VERIFICATION.md).

- **Implemented:** 104-member 2026 year roster, chamber/name filters and suggested spelling matches, profiles and separately dated current contact records. Four former members have no matched current contact record.
- **Implemented:** district-specific official Census maps for 2022 state legislative boundaries.
- **Implemented:** linked bill counts/listings by stable ID; chief, floor and version-specific cosponsor roles stay separate.
- **Planned:** establish 2027 membership from official session records; historical contact snapshots when verified.
- **Deferred:** public financial disclosures, after source and interpretation review.
- **Deferred — LEG-003:** factual 2027 sponsorship comparison once real introduced bills make it useful. Distinguish chief-sponsored bills from distinct bills sponsored across chief/floor/cosponsor roles, without duplicate roles/versions or performance scoring. Optional total-sponsored sorting/column and role labels require a separate scoped batch.

## Stage 3 — Calendar and activity · Partly implemented

- **Batch 2D implemented:** calendar heading Info with complete legend/freshness guidance, visible stale warning, compact agenda-level Show all month / return-to-date control.
- **Implemented:** combined month grid and chronological agenda of official meetings, times, rooms and available agendas.
- **Implemented:** 2027 session milestones/deadlines. Floor, special-session and caucus entries appear only when supplied by official records.
- **Planned:** extend coverage after May 2027, richer agenda/draft/PDF extraction, per-bill next actions, and cross-check other official special-session/caucus notices.
- **Deferred:** scroll-stop row highlighting; experimental moving emphasis could be mistaken for selection. Keep stable tap/focus feedback.

## Stage 4 — Additional bill information · Planned

- Source-linked fiscal-note summaries and related bills across sessions.
- Followed bills and changes since previous visits; define storage/privacy behavior first.
- Direct links to specific versions, sections and votes.

## Stage 5 — News and outside resources · Planned / Deferred

- **Planned:** Legislative Resources directory, relevant articles on bill pages, RSS-powered news listings.
- Evaluate feeds and permitted use from Deseret News, KSL TV/Radio and other Utah outlets; clearly separate reporting from official records.
- **Deferred:** optional X and Bluesky feeds after core source reliability and accessibility work.

## Legal resources — Planned for a later bounded batch

- Readable, searchable Utah Constitution.
- Current Utah Code and historical statutory resources.
- Utah Administrative Rules.
- Constitutional amendment comparisons, including ballot proposals and subsequent officially verified outcomes.

## Stage 6 — Public-release preparation · Planned

- Independent factual review and a correction process; begin this alongside Stage 1.
- Manual WCAG 2.2 AA checks, including screen readers and real iPhone/iPad testing.
- Data completeness/freshness verification; final branding and custom-domain decisions.
- Remove temporary noindex/nofollow only after explicit public-release approval and verify published HTML.

## Guardrails

Keep batches small and preserve political neutrality. Use official evidence, identify summary sources, and do not infer motives. Main remains the normal environment; evaluate Review only for disruptive experiments. Do not add empty navigation for future features. No extra published URLs, unrelated repository edits, or domain changes.

## Consolidated usability refinements (October 2026)

Implemented: Utah Legislation subtitle; wide-screen sticky header and reduced-motion-aware Back to top; aligned compact search, request Title/Status/Tracking ID sorts; locally remembered 25/50/100/200 result pages (50 mobile, 100 desktop); displayed-results copying with accessible confirmation and manual-copy fallback; historical labels; contextual request guidance; current/upcoming 2027 activity with collapsed source notes; calendar date/category/count hierarchy. Data snapshots and daily refresh remain unchanged.

Official request/update dates are not established in the saved records, so those sorts are omitted. Calendar has no search field; its Info stays beside the heading. Physical iPhone performance and manual screen-reader validation remain pending. Next: independent factual/accessibility review and resolution of documented vote-record gaps before wider feature expansion.

## Phase 4A — layout cleanup and bounded integrity investigation

- **Implemented:** removed the Research Prototype banner and redundant visible prototype labels; shared compact 16px top spacing; Main identification in the existing footer. Static noindex/nofollow, source/freshness/review disclosures and existing functionality retained. This supersedes the earlier banner-retention description; public release is not approved.
- **Investigated, unresolved:** all five official vote tally conflicts individually compared with original action/vote snapshots and newly preserved linked committee minutes. Minutes and named roll calls agree with each other but disagree with action totals; no demonstrated parser error or justified tally change. Warnings and withheld individual attribution remain. See `VERIFICATION.md` and `data/phase4a-evidence.json`.
- **Investigated, unresolved:** 1,046 `Walter, N.` entries; historical `Walter, R. Neil` and district 74 corroborate a candidate but no broadly applied alias is established. Conservative identity safeguards retained. Historical aliases, official conflict clarification, 2027 roster verification and all other unfinished stages remain future work.

## Phase 4B — compact interface and navigation

- **Implemented:** Session before Search retained; compact margins and inline session labeling where space permits; Sort/Per page left, count/check date right, borderless Copy at the far right with responsive grouping and unchanged clipboard/preferences. Content-sized status columns, half-size desktop column gaps, reduced result padding and semibold detail labels.
- **Implemented:** narrow wrapped navigation aligns Bills with the UtahBug wordmark; desktop navigation retained. One About & FAQ footer destination reuses all guide/data explanations and source links, adds concise FAQ entries, and maps old guide/source bookmarks to the relevant sections. Raw Contact source links removed from profiles; displayed contact information, human-readable official biographies and provenance retained.
- **Implemented:** Recent Activity keeps its already-current/upcoming session scope, moves date/source guidance into heading Info, labels pagination Previous page / Next page, and hides unused pagination for single/empty pages. Historical records remain accessible through Bills.
- **Implemented:** continuous semantic calendar table with shared dividers and weekday headers, smaller expanding cells, compact native selectors, conventional Sunday shading with explicit limitations, selected-date heading without From, and a grid-aligned Copy/All Month toolbar. All prior source/coverage guidance is in the single heading Info. No unsupported holiday/recess closure labels added.
- Phase 4A conflicts and identity gaps, physical-device/manual screen-reader review, official 2027 roster verification and all other unfinished roadmap work remain unresolved. Acquisition, data archives, reconciliation, refresh cadence and Main-only hosting are unchanged.

## Phase 4C — independent technical audit

- **Corrected:** calendar empty-date regressions now use isolated fixtures; real-source event assertions follow snapshot contents, removing the confirmed scheduled-publication blocker. A truncated official listing can no longer produce a complete historical-coverage flag. Added direct-route, Back/Forward, delayed-navigation and failed-detail recovery checks.
- **Open, high priority:** restore verified freshness after the official 2027 request feed and status listing agree. Audit observed 268 request IDs versus 267 status rows, missing `MDIQORVFRP`; Main retains the validated 255-request snapshot. The October calendar has a newly observed October 23 meeting. No guard was bypassed and no audit-only source was promoted.
- **Follow-up:** verify the next scheduled refresh end-to-end; review source-dependent test assumptions when official historical records change. Current successful push deployment does not prove successful scheduled acquisition.
- See `docs/QUALITY_AUDIT.md` for evidence and limits. All five vote conflicts, 1,046 unresolved Walter entries, 2027 roster verification, independent human factual review, physical-device and manual screen-reader checks remain unfinished.

- **Before first introduced 2027 measures:** remove request-only default/count assumptions from usability scenarios and exercise the existing automatic session transition across suites (audit M4). Current snapshots pass; a small initial introduced index can legitimately invalidate fixed 50/100/200-row assumptions.

## Phase 4D — refresh recovery and 2027 test readiness

- **Completed DATA-001:** upstream status listing added MDIQORVFRP; exact-ID/title reconciliation now passes for all 268 requests. Guarded manual run 39869478421 validated, committed and deployed 268 requests and 90 Calendar events. No reconciliation rule changed.
- **Completed SESSION-001:** isolated 0/1/3/240 introduced-record browser fixtures cover defaults, request conversion, historical access, shared toolbar and all page-size choices. Fixed large-request usability scenarios no longer depend on changing production counts. Runtime selection behavior is unchanged.
- **Still open TEST-001:** the shared scheduled path recovered under manual dispatch; no later actual scheduled trigger was available to verify. Five tally conflicts, 1,046 unresolved identities, the 2027 roster and human review remain open.
- See [Phase 4D verification](docs/PHASE4D_VERIFICATION.md) and the [task backlog](docs/TASK_BACKLOG.md). Earlier Phase 4C counts/findings remain dated evidence, not current freshness claims.

## Phase 4E — navigation, source disclosure and information-page polish

- Implemented: normal-weight active navigation with a thin underline; title-case session labels; request provenance in a keyboard/touch accessible source-icon dialog, independently of status Info.
- Implemented: separate About and FAQ destinations, preserved guide/data explanations and references, compatible legacy routes and section bookmarks, left-aligned FAQ section links, and the approved compact copyright/disclaimer footer. This explicitly supersedes Phase 4B's combined About & FAQ destination and Phase 4A's visible Main footer label.
- Implemented CAL-001: regular-weight full Calendar descriptions, concise Deadline icon/label, and “Timing: see official wording” without changing official descriptions, exceptions, dates or sources. Continuous grid and D identifiers remain.
- See [Phase 4E verification](docs/PHASE4E_VERIFICATION.md) and [backlog](docs/TASK_BACKLOG.md). Data, acquisition, unresolved conflicts, identities, roster, manual accessibility/editorial review and subsequent scheduled-run verification remain unchanged. Review remains unconfigured; noindex remains.

## Phase 4G — 2027 activity and change transparency

- Implemented: baseline-aware new-request observations, previous/new title and sponsor-ID changes, previous/new status observations, first saved introduced bills/resolutions and exact-ID original-request links. Dates distinguish observations from official actions and document records.
- Implemented: compact Public requests / Introduced legislation / Legislative actions / Documents and amendments filters, preserving date windows, pagination, Copy and history/source navigation. Initial baseline entries are not manufactured activity.
- Tested snapshot: 15 new requests plus one title change; no introduced 2027 measures yet. Live first-introduction validation remains SESSION-003. Historical activity and all safeguards remain intact.
- [Evidence and verification](docs/PHASE4G_VERIFICATION.md); ACT-001 completed in the [backlog](docs/TASK_BACKLOG.md#act-001). TEST-001, TRANS-001, roster verification, historical conflicts and human accessibility review remain open.

## Phase 4H — scheduled refresh and first-introduction readiness

- Rechecked actual cron history: no execution after the previous verification; TEST-001 remains open, explicitly blocked on that evidence. The old scheduled failure acquired/validated data but failed a Calendar test before preservation/deployment; Phase 4C already corrected that test.
- Official 2027 index, requests and status listing are unchanged: zero introduced measures and 268 reconciled requests. No data refresh or new activity was manufactured. SESSION-003 remains blocked on first real introduced/conversion evidence.
- SESSION-002 remains blocked: a year=2027 roster query returns incomplete rows without a 2027 year-selector option. Evidence is preserved, but no members were imported or inferred.
- Corrected a reproduced test-only readiness defect: activity provenance validation now recognizes preserved first measure revisions after later source changes. Acquisition remains unchanged. [Phase 4H verification](docs/PHASE4H_VERIFICATION.md).

- Additional Phase 4H correction (ACT-002): Recent Activity links now recover an exact request from a refreshed published catalog when an older in-memory snapshot lacks it. Verified XKUCMCIIHJ and all current activity request links, with explicit retry/failure and stale-navigation handling. No request is fabricated from the activity row.

## Phase 4I — activity usability and consistent sticky navigation

- Implemented: title-only public-request activity headings, compact verified identifiers and assigned/unassigned bill metadata, accessible caption-free date/category controls and contextual official bill search. Existing request navigation recovery and legislative distinctions remain intact.
- Implemented: one sticky navigation header at every viewport width, compact while scrolled and restored at the top, preserving all primary destinations, wrapping, touch targets, route transitions and measured anchor/focus offsets. This supersedes the older wide-screen-only sticky policy.
- [Verification](docs/PHASE4I_VERIFICATION.md); completed ACT-003 and UI-003 in the [backlog](docs/TASK_BACKLOG.md). TEST-001, actual 2027 introduction/roster verification and human accessibility review remain open. No acquisition, source records or deployment environment changed.


## Phase 4J — consolidated UI polish

Implemented compact shared-header spacing and 12px navigation gaps, aligned Activity controls with a visible Category label, compact directory count/Info/Copy/finder and closer columns, and Calendar filters with an accessible six-category Legend beside Copy. Existing sticky navigation, scroll restoration, pointer activation and data safeguards are preserved. This authorized label refinement supersedes Phase 4I's caption-free category control only.

[Verification](VERIFICATION.md#phase-4j--consolidated-ui-polish); UI-004 in the [backlog](docs/TASK_BACKLOG.md#ui-004). The official finder remains an external fallback, not completed on-site lookup. TEST-001, 2027 roster/first-introduction acceptance, physical devices and human review remain open.


## Phase 4K — automatic refresh evidence

TEST-001 remains awaiting a subsequent genuine scheduled run. Pipeline safeguards and freshness semantics are reviewed in [Phase 4K verification](docs/PHASE4K_VERIFICATION.md); no acquisition or UI change was justified. Component acquisition reports, validation and deployment must be verified separately. November 4, 2026 remains a readiness planning objective, not a release commitment.


## Phase 4L — bounded version and change transparency

Implemented grouped official versions/amendments and deterministic verified-text comparison on basic details, initially HB0117, while preserving all four enhanced examples. Successive 2027 snapshots can identify newly observed document records without calling retrieval a publication date or counting PDF/XML representations twice. Availability evidence separates official links, validated local text and untested documents; no public counters or bulk historical retrieval were added. [Verification and limitations](docs/PHASE4L_VERIFICATION.md). TRANS-001 remains In progress; publication timing, broader text coverage and live 2027 acceptance remain unfinished. TEST-001 and TRANS-002 are unchanged.


## Phase 4M — bounded automatic 2027 text acquisition

Implemented a separate guarded XML acquisition step following validated catalog refresh, with exact official document associations, immutable revisions, bounded retries/rechecks, explicit partial coverage and integration into existing comparisons. This supersedes Phase 4L's manual-only future-2027 text limitation. No UI redesign, historical acquisition or formatted-reader expansion. [Verification and limitations](docs/PHASE4M_VERIFICATION.md). TRANS-001 remains In progress; TRANS-002 and first-real-2027 acceptance remain unfinished. TEST-001 requires genuine scheduled evidence, independently of push deployment.

## Phase 4N — source reconciliation review

The October 23 official feed has 271 requests but only 270 status rows; DYVEPWTRCQ is absent from the original human-listing HTML. The validated 268-request snapshot remains published. No parser or workflow correction is justified. Prioritize authoritative source convergence, the next genuine fully verified scheduled refresh, and first-real-2027 introduction/text validation. Both current introduced sources remain empty. TEST-001 and SESSION-003 remain blocked; Phase 4M acquisition is fixture-verified, not live-2027 demonstrated. [Evidence and limitations](docs/PHASE4N_VERIFICATION.md). November 4 remains a readiness planning target, not a guaranteed public-release date.

## Phase 4O — bounded verified request publication

The owner-authorized policy now permits an explicit independently verified subset when at most three never-verified requests, and no more than 1% of the raw feed, lack their first matching status. All prior-record, identity, title, disappearance and atomic-publication guards remain; introduced relationships require independent listing validation during partial publication. The current candidate publishes 270 of 271 source requests with one withheld. This supersedes Phase 4N’s whole-catalog freeze only within these bounds. [Architecture and verification](docs/PHASE4O_VERIFICATION.md). TEST-001 remains open for genuine scheduled evidence; partial publication is not complete reconciliation. Prioritize scheduled recovery and first-real-2027 validation, not unrelated expansion.

## Phase 4P — source observation and verification

Eligible source-observed public requests are discoverable with unconfirmed status, a neutral flag and original-source evidence, logically separate from verified requests. Observation and later verification histories remain distinct without duplicate new-request events. This supersedes Phase 4O's public invisibility only, preserving every acquisition gate. Latest 273/270 evidence exceeds the 1% bound, so the published 271-source/270-verified snapshot remains unchanged. [Evidence and limitations](docs/PHASE4P_VERIFICATION.md). TEST-001, first-real-2027 readiness and all unrelated unfinished tasks remain open.

## Phase 4Q — independent source-observation preservation

Validated missing-first-status observations can be retained and displayed separately when catalog reconciliation fails, using immutable sources, pinned catalog baselines and independent diagnostics. Catalog three/1% limits and introduced/text safeguards remain unchanged. Current evidence has 273 requests/271 statuses; all requests are discoverable with two unconfirmed statuses and preserved recovery history. [Verification and boundaries](docs/PHASE4Q_VERIFICATION.md). TEST-001 and all unfinished 2027/human-validation priorities remain open. Main hosting and the future bills.utahbug.com plan are unchanged.

## November 4 readiness planning

[October 23 assessment](docs/PHASE4R_READINESS.md) separates release acceptance gaps, disclosable source limits and optional work. Latest bounded evidence is 273 requests / 272 verified statuses / one unconfirmed status; DFTEVYMLXT recovered through existing guards. TEST-001 remains High/Blocked with no newer schedule than 39993137239; RELEASE-002 remains open. RELEASE-001, UI-001 and explicit RELEASE-004 approval are still required. No task closes or changes priority/status. Next batch: genuine scheduled-run evidence plus independent human editorial/accessibility acceptance, before cosmetic work. November 4 is a planning target, not launch authorization.

## Phase 4T — Records and shared interface refinements

The owner-authorized [UI-005 batch](docs/PHASE4T_VERIFICATION.md) adds a two-choice 2027 Records selector beside Search, contextual 2026 archive, reliable Sponsor A–Z, native Activity row links and clearer event/source disclosures, stable header alignment, adjacent Calendar Legend and compact sponsor controls. It supersedes Phase 4S deferral only for this scope. Historical data and 2027 safeguards remain unchanged. Human accessibility/editorial acceptance, genuine scheduled refresh evidence and explicit release approval remain priorities; no release dependency closes with this UI batch.


## Phase 4U — reported iPhone usability corrections

The owner-authorized [UI-006 batch](docs/PHASE4U_VERIFICATION.md) restores the archive as Records' third option, adds complete matching Copy/CSV, compact valid pagination, Mountain 30-day/prior Activity windows with separate undated access, concise count disclosures and narrow navigation with scrolling branding. It supersedes Phase 4T's separate contextual archive entry. Source records and acquisition safeguards remain unchanged. The October 24 scheduled run acquired successfully but stopped on an outdated count test before preservation/deployment; TEST-001 remains open after the test correction. Human retesting, independent editorial acceptance and genuine scheduled publication remain priorities; no public release is authorized.

## Phase 4V — session clarity and compact discovery

The owner-authorized [UI-007 batch](docs/PHASE4V_VERIFICATION.md) separates 2027 bill counts/activity from the verified 2026 roster and archive, adds compact directory sorting/search, refines Advanced search and slate historical treatment, and makes Calendar optional with next-event selection across saved coverage. The amendment moves archive navigation to the shared footer and leaves only two 2027 Records choices; archive views omit that selector. This supersedes UI-006’s third archive option, preserving historical routes and profile archive activity. No acquisition or source-record changes. Human acceptance, scheduled publication and first-real-2027 validation remain priorities; no release authorization is implied.

## Phase 4W presentation refinement

Phone Records totals and official-source placement are compact; Sort and Per page reuse the existing More menu while desktop controls stay visible. Principal Info panels link to retained About Data methodology. Calendar returns to current/upcoming saved activity on route entry, preserves active browsing, and groups events by date. This supersedes the earlier permanent Show all month / return-to-date controls with month/date browsing and a contextual Upcoming action. See [Phase 4W verification](docs/PHASE4W_VERIFICATION.md) and UI-008; no data pipeline, source records or unfinished readiness priority changes.

## Phase 4X responsive directory and historical appearance

Directory column controls and stacked records share one container-width transition; narrow views use a six-choice dropdown backed by the existing sort state. Desktop bill-count sorting starts most first, with alphabetical ties. Row years remain accessible and in Copy; only the redundant desktop visual year is omitted. Historical headings and records use restrained parchment, with current contact panels unchanged. See [Phase 4X verification](docs/PHASE4X_VERIFICATION.md). LEG-003 remains deferred; Phase 4W Bills/Activity/Calendar behavior and all source safeguards are preserved.

## Phase 5A — readiness audit

The [comprehensive assessment](docs/PHASE5A_READINESS.md) verifies all saved requests/search/export and separates Main's 272 verified statuses plus one observation from newly checked 273/273 agreement. An isolated guarded candidate is not scheduled publication evidence. A reproduced full-reconciliation introduced-number contradiction is corrected; publication retains all mandatory checks and owner release boundaries. Next: genuine scheduled publication, independent editorial/device acceptance, then actual 2027 introduction/roster validation. TEST-001, SESSION-002/003 and release dependencies remain open; no deferred sponsorship comparison or visual redesign is included.

## Phase 6A — Scheduled acceptance complete; real introductions still pending

[TEST-001 acceptance](docs/PHASE6A_VERIFICATION.md) verifies genuine October 25/26 schedules, component reports, source hashes, required tests, snapshot commits and deployed freshness. Approved partial reconciliation remains explicitly partial: 274 observed requests, 273 verified statuses, one unconfirmed source observation. This supersedes older scheduled-acceptance-pending notes only. SESSION-003 remains blocked until real introduced legislation/conversions can be validated; SESSION-002 awaits verified membership. Independent editorial, human accessibility, broader release review and owner authorization remain open. No application, data, pipeline or hosting changes.

## Phase 7A - Global Appearance

- Implemented Device default / Light / Dark in the shared header, locally saved per browser with device-change and same-origin-tab synchronization. Early head initialization prevents a delayed light appearance; semantic dark colors cover all shared surfaces while retaining existing light fallbacks.
- [Verification](docs/PHASE7A_VERIFICATION.md) records responsive/keyboard/contrast, loading/persistence and retained navigation checks. Physical-device/manual accessibility, editorial and public-release acceptance remain open; noindex/nofollow and existing data/acquisition safeguards remain.
