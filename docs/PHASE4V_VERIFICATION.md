# Phase 4V — legislative clarity, search and Calendar refinement

Date: October 24, 2026 (America/Denver). Baseline: `23085a61ff2a03a97cb727b7cddec90b27a89880`, published by [40142233684](https://github.com/utahbug/UtahBills/actions/runs/40142233684).

## Scope and decisions

- Directory counts use exact stable sponsor IDs and distinct 2027 HB/SB base measures only. Requests, resolutions and version duplicates are excluded. Zero counts remain usable 2027 links. Names open primary 2027 activity; the verified 2026 roster and dated contact evidence remain explicitly identified. Historical profiles, sponsorship links and roll-call identity links are explicitly year-qualified. Individual profiles retain a separate **View 2026 archive activity** link.
- Desktop directory search capped at 520 CSS pixels (full available width on narrow phones), adjacent official district-finder link within that same bounded area, count/Info/Copy and content-sized columns. Name, district and bill-count sorting preserves filters; district order is numeric House then Senate, reversed as a whole for descending order. Stable name/ID ties prevent arbitrary reordering.
- Advanced search retains all five filters with compact, regular-weight disclosure and controls. Clear filters affects those filters only; Clear search and Clear sponsor retain distinct scopes. Sponsor result history restores filters and role. Official search links align with the search label/field. Historical results, headings and sponsor groups use readable muted slate with visible 2026 text.
- Calendar starts collapsed and selects today or the next matching saved date across the coverage window in Mountain Time. The initial list includes subsequent matching saved dates; selecting a month or grid date explicitly switches to that month’s recorded activity. No-future-event wording describes saved coverage, not the Legislature’s complete schedule. Toggle preserves selection/filter/focus; category and Revised metadata use regular weight, cancellation remains distinct. Coverage/freshness qualifications remain in Info.
- **Owner amendment:** Records contains only the two 2027 choices. The shared footer adds an ordinary **2026 Legislative Archive** link alongside About and FAQ, with inherited font family/size/weight/color and recognizable underlines. Archive views omit Records entirely. Bills navigation returns to current records while Back restores archive search/filter state. Existing `#archive/2026`, historical bill and year-qualified sponsor/profile bookmarks remain supported. This explicitly supersedes Phase 4U’s third selector option, without reopening unrelated design decisions.

## Source and release boundaries

No source files, acquisition logic, legislative interpretations, roster assignments or refresh frequency change. Retained coverage remains 273 visible requests, 272 verified statuses and one source-observed request; 2027 introduced measures remain absent from the saved index. No synthetic fixtures enter production. No new official acquisition was requested for this presentation batch.

Latest genuine schedule at baseline was [40109485828](https://github.com/utahbug/UtahBills/actions/runs/40109485828): acquisition/build succeeded but an outdated browser count assertion prevented preservation and deployment. Phase 4U corrected that test. This UI deployment is not subsequent scheduled evidence. **TEST-001 remains High/Blocked**. Its unpublished 273/273 acquisition candidate is not substituted for published records.

## Verification

- `tests/phase4v-data.mjs`: exact session/role counts, HB/SB identity and duplicate exclusion, numeric chamber/district sorting, stable surname ties, reverse order and next-event date boundaries.
- `tests/phase4v.mjs`: zero and isolated nonzero 2027 fixtures, roster/contact versus activity separation, historical vote/profile links, sponsor roles and Back navigation, filter scopes, sorting, Calendar today/next-month/category/no-future scenarios and toggle focus/context. Amendment checks exercise footer keyboard activation, archive/detail/Back/current return and typography consistency.
- Layout matrix: 320, 375, 390, 430, 768, 1024 and 1280 CSS pixels; normal, doubled text and 200% CSS zoom; directory, expanded archive search and expanded Calendar; strict WCAG A/AA automated checks and no horizontal overflow. Representative 390/1280 screenshots are local test artifacts.
- Retained Calendar regression tests explicitly open the now-collapsed grid before exercising existing date/weekday behavior. Historical count fixtures explicitly request 2026. Footer/selector tests reflect the approved amendment. No valid integrity/accessibility assertion is relaxed.
- Native browser zoom and physical iPhone/iPad/VoiceOver/NVDA acceptance are not inferred from CSS zoom or automated checks.

## Remaining acceptance

UI-001 human device/assistive-technology acceptance, RELEASE-001/002/004, TEST-001, first-real-2027 introduction/text validation and verified 2027 roster remain unfinished. Main only; Review unconfigured; current GitHub Pages address, future bills.utahbug.com plan and static noindex/nofollow preserved. Next priority remains genuine scheduled publication evidence plus independent human editorial/accessibility acceptance.

## Local completion evidence

Production build passed: original source checksums, identity/version/summary evidence, Python vote integrity, catalog/foundation projections, Activity and version-text coverage. Current JavaScript was independently compared with a fresh in-memory esbuild result; final CSS is copied verbatim into dist. No source snapshot changed.

Passed: Phase 4V model tests; final Phase 4V browser matrix including the footer amendment; retained Batch 2B directory/coverage suite; retained Phase 4T Records/navigation/layout suite. Navigation and Batch 2 Calendar suites also passed before the footer amendment. JavaScript syntax, Markdown relative destinations and git whitespace checks passed. Phone/desktop directory, archive, Calendar and keyboard-focused footer screenshots were inspected. All mandatory CI suites remain enabled, including the new Phase 4V checks.

The amendment test found and corrected Bills navigation retaining archive session state. The Records regression found a real desktop input-alignment issue after moving the official search link; controls now align at the lower edge. Enlarged native select/input heights differ, so the retained test explicitly checks that lower-edge alignment instead of an obsolete upper-edge ordering assumption. A permanent sponsor-select border expectation was replaced with visible keyboard focus and a 44px target check, matching the approved compact controls. A test launched while the build was regenerating vote projections was discarded and rerun only after the complete build; no missing source was inferred from that temporary preview state.

Pre-publication remote inspection: main remains at the baseline, no scheduled acquisition is active, and the latest genuine scheduled run remains 40109485828. Publication outcome and exact release SHA are reported with delivery; a push deployment cannot close TEST-001.

The owner’s final wide-screen clarification was folded into the same unpublished Phase 4V commit. A focused 320/390/768/1280/1920 check passed: the desktop field is 520px at 1280 and 1920, results remain independently 784px, the official finder aligns with the field’s right edge, and phone fields use the full content width. Strict automated accessibility/reflow checks passed at all five sizes. The regression is also included in the mandatory Phase 4V suite. No redundant full local suite was run for this CSS bound.
