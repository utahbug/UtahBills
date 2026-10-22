# UtahBills development roadmap

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
- **Next bounded batch:** reconcile reported official vote-source discrepancies, verify unresolved historical voter identities, then verify and connect the official 2027 session roster when published, and review early-session source completeness. Expand verified vote coverage with explicit identity and source checks; broader XML analysis remains separate later work.
- **Implemented:** separately labeled public requests and introduced measures; counts derive from each verified snapshot. The initial Batch 2C snapshot has 253 pending requests and an empty introduced index; neither count is fixed in the application.
- **Batch 2C implemented:** compact status/Info disclosure and corrected shared request template, human-readable official listing, optional source/history details.
- Substitutes, late changes and boxcar-bill histories using verifiable version/publication evidence.
- **Batch 2D implemented:** 22 source-verified decisions / 524 individual entries for HB0002, HB0011, HB0154 and SB0069; HB0155 has no imported roll call. Bill vote sections and explicitly partial legislator histories distinguish voice, procedural, amendment, committee recommendation, passage and concurrence records.
- **Phase 2 implemented:** all 5,672 action-history vote sources retrieved; 5,667 reconciled records and 115,130 individual entries. Five conflicting tallies are flagged and individual attribution withheld. Full version/document/statutory metadata and an index/listing completeness report are available; readers and roll calls load on demand.
- **Planned:** resolve official discrepancies and historical identity gaps; establish coverage beyond available action-history references.
- Historical statutory comparisons and related legislation; independently verify baseline and effective dates.

- **Batch 2D implemented:** initial 2027 request/introduced default based on verified records; preserved session choices; inline search Info, separate search clear and filter clear; structurally separated detail back links.

## Stage 2 — Legislator directory · Partly implemented

- **Implemented:** 104-member 2026 year roster, chamber/name filters and suggested spelling matches, profiles and separately dated current contact records. Four former members have no matched current contact record.
- **Implemented:** district-specific official Census maps for 2022 state legislative boundaries.
- **Implemented:** linked bill counts/listings by stable ID; chief, floor and version-specific cosponsor roles stay separate.
- **Planned:** establish 2027 membership from official session records; historical contact snapshots when verified.
- **Deferred:** public financial disclosures, after source and interpretation review.

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
