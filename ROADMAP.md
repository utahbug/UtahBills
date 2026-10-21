# UtahBills development roadmap

Status: **Implemented** = available in the sample prototype; **Planned** = approved direction for a later batch, not a delivery date; **Deferred** = revisit after core coverage and review. Priorities run from Stage 1 to Stage 6. Each stage needs a bounded batch and source verification before implementation.

## Implemented — prototype and Batch 1

- Four real 2026 bills, saved official records and provenance checks.
- Search/filters, bill details, stages, aggregate votes, version comparisons and transparency timeline.
- Mobile stacked listings, UTF-8 pipeline correction, structured formatted bill reader for nine versions.
- Readings/votes/sponsorship guide with official references; compact header and secondary help navigation.
- Blue icons, Main deployment, temporary noindex/nofollow and Research Prototype notice.

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

## Stage 3 — Calendar and activity · Planned

- Month and chronological list views of committee hearings, times, locations and agendas.
- General sessions and officially announced special sessions.
- Official caucus information when available; next scheduled action and participation details.

## Stage 4 — Additional bill information · Planned

- Source-linked fiscal-note summaries and related bills across sessions.
- Followed bills and changes since previous visits; define storage/privacy behavior first.
- Direct links to specific versions, sections and votes.

## Stage 5 — News and outside resources · Planned / Deferred

- **Planned:** Legislative Resources directory, relevant articles on bill pages, RSS-powered news listings.
- Evaluate feeds and permitted use from Deseret News, KSL TV/Radio and other Utah outlets; clearly separate reporting from official records.
- **Deferred:** optional X and Bluesky feeds after core source reliability and accessibility work.

## Stage 6 — Public-release preparation · Planned

- Independent factual review and a correction process; begin this alongside Stage 1.
- Manual WCAG 2.2 AA checks, including screen readers and real iPhone/iPad testing.
- Data completeness/freshness verification; final branding and custom-domain decisions.
- Remove temporary noindex/nofollow only after explicit public-release approval and verify published HTML.

## Guardrails

Keep batches small and preserve political neutrality. Use official evidence, identify summary sources, and do not infer motives. Main remains the normal environment; evaluate Review only for disruptive experiments. Do not add empty navigation for future features. No extra published URLs, unrelated repository edits, or domain changes.
