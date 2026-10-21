# UtahBills development roadmap

Status: **Implemented** = available in the sample prototype; **Planned** = approved direction for a later batch, not a delivery date; **Deferred** = revisit after core coverage and review. Priorities run from Stage 1 to Stage 6. Each stage needs a bounded batch and source verification before implementation.

## Implemented — prototype, Batch 1 and Batch 2A

- Four real 2026 bills, saved official records and provenance checks.
- Search/filters, bill details, stages, aggregate votes, version comparisons and transparency timeline.
- Mobile stacked listings, UTF-8 pipeline correction, structured formatted bill reader for nine versions.
- Readings/votes/sponsorship guide with official references; compact header and secondary help navigation.
- Blue icons, Main deployment, temporary noindex/nofollow and Research Prototype notice.

- **Batch 2A:** official combined month-and-agenda calendar, category filters, Mountain times, rooms, agendas, explicit numbered-bill links and participation links; preserved sources and guarded daily Main refresh (October 2026–May 2027).
- **Batch 2A:** whole-row bill links, hover/focus feedback, 25-result pages, cached search text, restored filters/sort/page/scroll and logo return to top.

## Stage 1 — Legislative data and transparency · Planned

- Complete historical 2026 coverage and ongoing 2027 data, with completeness/freshness indicators.
- Distinguish bill requests from introduced bills.
- Substitutes, late changes and boxcar-bill histories using verifiable version/publication evidence.
- Complete recorded voting histories and individual votes, distinguishing procedural and final-passage questions.
- Historical statutory comparisons and related legislation; independently verify baseline and effective dates.

## Stage 2 — Legislator directory · Planned

- Browsable/searchable list; names link to official profiles/contact information.
- District numbers link to appropriate official maps.
- Bill counts and linked bill lists, separating chief, floor and cosponsor roles.
- **Deferred:** public financial disclosures, after source and interpretation review.

## Stage 3 — Calendar and activity · Partly implemented

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
