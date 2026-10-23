# Phase 4T — consolidated UI refinements

Date: October 23, 2026. Baseline: `52a0f040fc5a03309c5a5a84fce8cebf26ef1491`, successful Main run [40033709343](https://github.com/utahbug/UtahBills/actions/runs/40033709343). Scope is the owner's Phase 4T request; this supersedes Phase 4S's deferral only for these approved interface changes.

## Behavior and implementation

- Primary Records contains only 2027 Bills and resolutions and 2027 Public bill requests. Existing default selection remains request-first until introduced measures exist. Records is left of Search on a wide layout; both wrap at constrained widths, including CSS zoom. Search labels/placeholders identify the selected record type.
- The contextual 2026 Legislative Archive destination uses the same historical catalog and detail routes. Its return link restores 2027 browsing. History entries preserve listing filters, page and scroll state; legacy bill/request/sponsor routes remain supported.
- Sponsor A–Z uses exact sponsor IDs and reliable comma-separated surname/given-name source names. Unknown names sort last; title and record ID provide deterministic ties. No unknown identity, successor or 2027 membership is inferred.
- Recent Activity has a thin initial divider and a native stretched detail link for blank row space. Selectable text and independent official links remain separate interactive targets. Native modifier-click behavior is preserved. Short Info sections distinguish events from records, official dates from observations, scheduled checks from publication, and retained/partial source coverage. A contextual link reaches all visible requests with an explicit events-versus-records caption.
- Header compaction previously removed flex items whose intrinsic widths affected navigation placement. The shared compact state now preserves horizontal brand/disclaimer geometry while reducing height; existing shared scroll/focus/pointer logic remains intact.
- Calendar Legend retains its native popover, six categories and dismissal/focus behavior. Position follows the trigger, right-aligned below it and clamped to the viewport; CSS zoom and viewport changes are accounted for.
- Sponsor name, role selector and borderless clear control share an aligned wrapping row. The redundant visible role label is removed; the accessible name and role-select border remain.

No legislative source files, acquisition scripts, schedules, version/vote rules or source-observation safeguards change. No new counters, legislative interpretations, hosting environments or domain changes. Main and static noindex/nofollow remain.

## Verification and regressions

New `tests/phase4t.mjs` covers real request/archive navigation and sponsor ordering, isolated future introduced fixtures, unknown/tied sponsor names, Back/Forward and search retention, native Activity row and Ctrl-click behavior, selectable text, independent source hit targets, Info/cross-links, header horizontal stability, Legend placement/dismissal, sponsor controls and WCAG 2.2 A/AA axe tags. Layout matrix: 320, 375, 390, 430, 768, 1024 and 1280 CSS pixels, plus doubled text and 200% CSS zoom. Representative 390/1280 screenshots inspected.

Existing strict archive tests now enter through the contextual archive link; their data, keyboard, layout and accessibility assertions are retained. The old session-label regression now checks the two approved primary options. Mandatory CI includes all 30 browser suites, including the new suite.

Targeted verification caught and corrected: listing state lost on archive Back/Forward; an official-search-link target spacing violation; and Records/Search overflow at 768px with 200% CSS zoom. The last was corrected with available-space wrapping rather than weakening the overflow assertion. Header overflow diagnostics now report the responsible elements.

Implementation commit: [f3daa4e](https://github.com/utahbug/UtahBills/commit/f3daa4e). Production build and its source-integrity checks passed. Phase 4T, strict shared-header, Phase 4D, Batch 2 and Phase 4G suites passed locally. The Phase 4B layout matrix passed through its final pagination fixture, which caught an editing-time encoding regression; original UTF-8 range dashes and disclosure arrows were restored, with focused pagination/glyph checks before publication. Publication requires the existing full CI gates; the final release commit/run and published-asset verification are reported with delivery. CSS zoom and desktop automation do not constitute physical iPhone/iPad, actual browser-zoom or VoiceOver/NVDA acceptance. UI-001 and the [human worksheet](review/ACCESSIBILITY.md) remain pending.

## Scheduled evidence and release boundaries

The latest genuine scheduled execution remains [39993137239](https://github.com/utahbug/UtahBills/actions/runs/39993137239), with failure already documented. No newer qualifying scheduled evidence was found. TEST-001 remains High/Blocked. A successful push run does not close it. No manual refresh was triggered. Check again for active scheduled runs immediately before pushing.

All 37 unfinished backlog IDs retain their status. RELEASE-001/002/004, UI-001, first-real-2027 validation, roster verification, source discrepancies and historical limitations remain open. This batch is not public-release authorization.
