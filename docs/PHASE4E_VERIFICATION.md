# Phase 4E verification

Baseline: clean main/origin/main at a9288254b0b179275ccaa608f622ca9c2e9c7ab0, fetched October 22, 2026. Push deployment 39872049170 succeeded. No newer data-refresh commit was present. Latest actual scheduled run remained 39820847031 (failed before the Phase 4C correction); successful Phase 4D manual refresh 39869478421 does not close TEST-001.

## Scope and preservation

- Normal-weight navigation retains aria-current, keyboard focus, touch targets, menu order and wrapped wordmark alignment. The active text has a thin underline and no persistent background.
- Request provenance moves intact from the bottom disclosure into a native modal dialog opened by a Lucide FileSearch button beside the record label. Native focus containment/Escape, explicit Close, restored trigger focus, scrollable viewport-constrained content and touch activation are tested. Status Info remains independent. Basic bill details are unchanged.
- Session option values and selection logic are unchanged; only capitalization changes.
- About contains the existing source/data/verification explanations plus purpose, independence, correction limitations and copyright distinguishing original UtahBug work from official/third-party materials. FAQ reuses the complete legislative guide and existing questions. Prior explanation fixtures and source references remain verified.
- Legacy #guide and #about/process open FAQ's process section; #sources and #about/data open About's data section; #about/faq opens FAQ's questions. New #faq/process and #faq/questions links, direct loads and Back/Forward work. Existing section IDs remain.
- Footer contains only © 2026 UtahBug, About, FAQ and the approved disclaimer with the official Legislature link. Plain footer links omit decorative external-link icons while retaining external-link accessibility information. Phase 4E supersedes earlier Main-label and combined-page policy; hosting policy is unchanged.
- Full Calendar event descriptions use weight 400. Concise type labels use semibold, deadlines use Lucide CalendarClock, date-cell D markers remain, and “Timing: see official wording” replaces the awkward label. Exact event names, date exceptions and official links remain source-driven. No legislative timing inference was added.

## Files changed

Presentation: app.js, calendar.js, discovery.js, index.html, info.js, links.js, styles.css and ui.js. Test command: package.json. Regressions: tests/batch1.mjs, batch2c.mjs, navigation.mjs, phase4a.mjs, phase4b.mjs, phase4d.mjs, quality-audit.mjs and refinement.mjs; new tests/phase4e.mjs and tests/fixtures/phase4e-request-sources.json. Documentation: AGENTS.md, README.md, ROADMAP.md, VERIFICATION.md, docs/TASK_BACKLOG.md and this report. No data/, scripts/ or .github/ file changed.

## Verification

Implementation: [f695b5f9ca88ba960c407b92696c2ddd2f7b4fa0](https://github.com/utahbug/UtahBills/commit/f695b5f9ca88ba960c407b92696c2ddd2f7b4fa0).

Passed locally: deterministic analysis, production build, all 37 Python tests (Calendar 5, Catalog 10, controlled updates 6, foundation 9, activity 4 and build-time votes 3), and the complete 19-suite npm test command. No automated WCAG A/AA violations were reported. Markdown file/anchor links, unique stable task IDs and backlog counts were checked. The new phase4e suite covers 320, 375, 390, 430, 600, 768, 900, 1024 and 1280 CSS pixels in normal, doubled-text and 200% CSS-zoom modes. It checks active nav, labels, legacy/new routes, footer wording/spacing, source panel preservation and accessibility, touch activation, exact Calendar descriptions and automated WCAG A/AA tags. Existing matrices retain search/filter/pagination/preferences and source safeguards.

Request-source baseline fixtures are compared when the saved catalog matches their normalized hash; current-source/history/link checks run regardless, allowing legitimate future refreshes. Earlier guide/data text and references remain pinned by the Phase 4B fixture. No source-dependent fixed request/event counts were introduced.

The zoom matrix found and corrected a dialog height overflow: viewport percentages now bound the dialog at zoom as well as normal size. Screenshots are saved under ignored test-results/phase4e/. Representative phone/desktop request, FAQ, Calendar and source-panel views are visually reviewed; this is desktop browser emulation, not physical iPhone/iPad testing or manual VoiceOver/NVDA acceptance.

## Remaining work and publication

Five vote conflicts, 1,046 unresolved Walter identities, the 2027 roster, Find My Legislators, physical-device/manual accessibility, independent editorial review and subsequent scheduled-refresh verification remain open. Static noindex/nofollow, data/provenance, guarded acquisition and Main-only workflow are unchanged. Review remains unconfigured. Deployment results and published asset checks are reported separately after the required workflow; successful publication does not establish factual completeness or accessibility certification.
