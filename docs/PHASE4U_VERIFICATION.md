# Phase 4U — physical-device UI acceptance corrections

Date: October 24, 2026. Baseline: `790f3cd6ea45564125b9497eb958d3584219d929`, Main deployment [40040539491](https://github.com/utahbug/UtahBills/actions/runs/40040539491). This batch implements the owner's reported iPhone usability corrections; it is not human accessibility acceptance or public-release authorization.

## Scheduled execution: acquired, tested incompletely, not published

Genuine scheduled run [40109485828](https://github.com/utahbug/UtahBills/actions/runs/40109485828) acquired Calendar, catalog, independent observations, legislative text and vote archive successfully. Provenance/integrity checks and production build succeeded. Browser testing stopped at `tests/phase4r.mjs`: the assertion expected technical source/status counts in the visible count even when all statuses reconciled. The application then correctly showed a concise fully reconciled count. This was an outdated conditional-display assumption, not an acquisition, timing or demonstrated accessibility failure.

The regression now verifies the always-available count Info disclosure, with both the actual partial snapshot and an isolated fully reconciled 273/273 fixture. No valid source or accessibility assertion is disabled. Snapshot preservation and Main deployment were skipped in that scheduled run. **TEST-001 remains High/Blocked.** A later successful push deployment cannot complete it.

The original diagnostic artifact (ID 12565886798) is preserved under [evidence/phase4u-scheduled-40109485828](evidence/phase4u-scheduled-40109485828/evidence-manifest.json), with individual SHA-256 checksums, original request/status/index bytes and acquisition reports. It reports 273 requests / 273 verified statuses, no introduced 2027 measures, no text acquisition work, and 5,672 retrieved vote sources. This candidate was **not published**. This UI batch retains the published 273 visible requests / 272 verified statuses / one source-observed request, VYQQDPXGUY; five historical vote conflicts remain unchanged. No repeated official-source fetch or manual refresh was initiated.

## Changes

- Bills and Activity hide impossible directions, hide single-page pagination, retain exact page totals and guard handlers. Compact Lucide arrows accompany Previous/Next. Page changes focus the first result; filters reset/clamp the page.
- Copy includes every matching record in the selected order, preserving the detailed text format and clipboard-denied textarea fallback. Activity separately loads matching saved pages only on Copy/CSV demand; normal browsing stays incremental. Failed loading reports failure rather than copying a partial set. Formatting yields between bounded chunks.
- Contextual ellipsis beside Copy exposes Export CSV. Downloads contain headings, identifiers, status qualifications, official URLs and applicable detail/date fields; UTF-8 BOM, CRLF and quoted/escaped fields support Excel. Potential formula-leading cells receive an export-only apostrophe. Original source values are untouched. Filenames identify record type and UTC export date. No server or account is added.
- Activity uses Mountain calendar Today, Yesterday, Last 5 days, Last 30 days, and Prior activity. Prior excludes undated events; a separate Info control reaches them without inventing dates. All categories replaces the ambiguous category caption. Detailed coverage explanations and the all-public-requests link are in Info. Compact selectors, count/Copy row, conditional Per page and initial divider reduce phone spacing.
- Deterministic Activity page metadata includes date/category counts, reproducing exact matching totals without eager event-page downloads. Event contents, identities, source chronology and acquisition are unchanged.
- On wrapped narrow headers, the brand scrolls out above the viewport while navigation stays visible at the same horizontal coordinates. The header retains its layout height to avoid scroll anchoring jumps. Desktop compaction, shared pointer protection, route restoration and anchor offsets remain. A focused regression caught reverse keyboard navigation reaching the scrolled-away brand; the shared focus handler now reveals the page top when that brand receives focus.
- Bills show concise matching/total counts and adjacent Info with source totals, verified statuses, observations, acquisition dates and limitations. Independent observation coverage takes precedence over an older catalog total. Freshness dates use the same local-date formatting as existing coverage disclosures.
- Records restores 2026 Legislative Archive as the third option. Separate archive/return links are removed; old routes and bookmarks still work. Historical rows and detail headings receive a muted slate treatment and explicit Historical · 2026 identification. Enacted laws are not described as obsolete.
- Collapsed Advanced Search has less bottom spacing. Discrepancy flags are 15px thin muted outlines; expanded content aligns with heading text, while independent metadata stays outside. The three redundant Bills support columns are removed; FAQ explanations/bookmarks remain.

## Verification

Production build and source-integrity/vote checks passed. Focused Python Activity tests cover original event identity/provenance/history and exact date/category page counts (six tests). CSV/date unit checks cover quoting, formula prefixes, BOM, large chunk yielding, Mountain midnight, DST, year boundaries and undated separation.

Targeted browser checks: Phase 4U, strict shared header, toolbar, Phase 4T, Phase 4G, Phase 4D, Phase 4P, Phase 4Q and Phase 4R. They cover complete Copy/CSV across pages and filters, first/middle/last/single pages, failed copy/recovery, fallback, archive Back/Forward, source links, discrepancy alignment, fully reconciled recovery, and retained source-observation semantics. Existing tests were updated only for authorized labels, count disclosures, archive entry, copy scope and visible header height. Mandatory CI retains all earlier suites and adds Phase 4U plus CSV/date unit tests.

Layout checks include 320, 375, 390, 430, 768, 1024 and 1280 CSS pixels, relevant intermediate widths, doubled text, 200% CSS zoom, keyboard focus, target sizes and unchanged WCAG 2.2 A/AA axe checks. Shared-header tests cover nine routes at top/middle/bottom, scrolled route changes and anchors. Representative phone/desktop screenshots were inspected. A headful Edge native-zoom shortcut probe left viewport width and devicePixelRatio unchanged; native browser zoom is therefore **not claimed as verified**. Physical iPhone/iPad and manual VoiceOver/NVDA acceptance remain pending under UI-001.

Implementation commit: [abb811937584c0e5c112ecab959309a653be1d68](https://github.com/utahbug/UtahBills/commit/abb811937584c0e5c112ecab959309a653be1d68). All targeted checks listed above passed, including the final reverse-keyboard-focus regression. Nine preserved artifact checksums and repository Markdown destinations passed.

## Publication and remaining work

Main-only workflow, mandatory checks, noindex/nofollow, future bills.utahbug.com plan and all source/atomic-retention safeguards remain. No scheduled workflow was active at the initial and pre-publication inspections; recheck immediately before push. Release SHA, CI result and published-asset verification accompany delivery. UI-001, TEST-001, RELEASE-001/002/004, first-real-2027/roster validation and historical source limitations remain open. Next priority: a genuine complete scheduled refresh plus human retesting of these corrections and independent editorial acceptance.


## CI follow-up

Push run [40140871564](https://github.com/utahbug/UtahBills/actions/runs/40140871564) passed provenance, production build and the first 15 browser suites, then stopped at Phase 4B's obsolete exact date-option array (`today/yesterday/five/all`). That expectation is updated to the owner-approved five choices (`today/yesterday/five/thirty/prior`); the complete Phase 4B suite is rerun before publication. No source, layout or accessibility assertion is removed. Earlier push run 40140845501 was superseded before deployment while exact original evidence line endings were restored and verified against all nine hashes.
