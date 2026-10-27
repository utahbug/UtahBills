# Phase 7B verification — consolidated UI refinements

## Scope and baseline

October 27, 2026. Read AGENTS.md, ROADMAP.md, TASK_BACKLOG.md and relevant Phase 6F/7A/6C records and owner observations before editing. Fetched Main at `eb0e50bfcfa57f1f660d7b9ceec1f7470cd7912b`; checkout clean and synchronized. Its mandatory workflow [40572944064](https://github.com/utahbug/UtahBills/actions/runs/40572944064) succeeded. No active acquisition was found at preparation; check again immediately before push. Only `utahbug/UtahBills` is changed. These are owner-authorized refinements for Main; Review is not activated. No Cloudflare operation is included.

## Implementation

- Appearance SVG and circled Contact artwork now occupy 22px; independent 44px targets, header geometry, persisted appearance and Contact route/recipient remain intact.
- Desktop Bills/Archive Sort uses the existing native select directly under compact Sort. Phone Sort retains its established disclosure and page-size control. The same select moves across the breakpoint, preserving selection and focus. Current selection is available through the native choice/title and a viewport-contained hover/focus caption that Escape dismisses. No criteria or filtering logic changed.
- Directory names omit added Rep./Sen. prefixes for every Chamber filter. Chamber remains a labeled filter beside the distinct Sort action. The eight sorts and clickable headers share the existing state. Compact Sort avoids a permanent verbose selected label; current state remains available on hover/focus, in the selected native option, the live sort announcement and active column arrow.
- Directory ordering controls have 24px separation from the results count on a shared row. Desktop count links center beneath centered headings; phone entries retain their compact two-line form and independent 44px count links. Name / Introduced bills / Public requests remain the default columns.
- Find My Legislators aligns with the search input's right edge, excluding the adjacent 44px Info target and 6px gap. Heading wrapping remains available at enlarged text.
- Created [UI_ACCEPTANCE_CHECKLIST.md](UI_ACCEPTANCE_CHECKLIST.md), preserving stable backlog IDs, historical owner observations, current defects and future UI scope. Implemented, Automated verified, Awaiting manual acceptance and Accepted are explicitly distinct. No human acceptance is inferred.
- Optional directory columns are documented only: future compact More with District, deduplicated Total bills sponsored, Floor-sponsored bills and Cosponsored bills. No new counts, columns, rankings, legislative data, acquisition or hosting behavior is implemented.

## Verification evidence

Focused local checks passed with pinned Chromium: Phase 7B, Phase 7A, Phase 6F, Phase 6C, Phase 6B, Phase 5F, Phase 5C, Phase 5B, toolbar, Phase 4V and Phase 4X. No full local suite was rerun. UI bundles use the existing production esbuild settings and already validated saved data. Mandatory CI retains all source-integrity checks, production build and every browser suite, adding Phase 7B first.

`tests/phase7b.mjs` covers widths 320, 375, 390, 430, 768, 1024 and 1280 with normal text, doubled text and 200% CSS zoom; both light/dark axe A/AA checks, icon/target dimensions, finder/input/Info geometry, count gap/centers, names, keyboard focus/current-state access, all eight directory sorts in all three chamber scopes and direct desktop native sorting. Screenshots are ignored local artifacts in `test-results/phase7b/`. Stable geometric/behavioral assertions are used instead of pixel-perfect image baselines.

The final spacing refinement additionally passed all 21 width/text/zoom layouts, baseline-identical header bounding boxes, caption viewport containment and Escape/focus, normal-width Chamber/Sort row alignment and axe. A targeted breakpoint check confirmed that focus transfers from the phone Sort trigger to the desktop native select. Phone light/dark, desktop dark and focused desktop Sort screenshots were inspected; agent inspection is not owner acceptance.

Older tests are updated only for owner-superseded assumptions: no chamber prefixes, Chamber moved beside Sort, finder aligned to input rather than including Info, centered numeric cells, constant compact Sort width and direct desktop selection. Existing source/count/order/filter/focus/reflow/accessibility assertions and every mandatory suite remain. Phase 6C still covers all 96 responsive Info cases and native sorting across breakpoints.

## Publication evidence

Resolve the implementation commit with `git log --diff-filter=A --format=%H -- docs/PHASE7B_VERIFICATION.md`. Mandatory workflow, final commit and byte-for-byte published asset comparison are reported with delivery. No publication success is claimed before the required workflow finishes.

## Remaining limitations

Physical iPhone/iPad/Safari, VoiceOver/NVDA, native browser zoom and owner visual acceptance remain pending. CSS zoom, automated Chromium/Edge and agent screenshot inspection do not complete these. Actual configured mail-client launch/send/receipt, clipboard behavior in recipient applications and independent editorial review remain unverified. The prior expanded enhanced-bill technical-source target-spacing issue is retained as UI-019; it is not corrected by this batch. Authoritative final 2027 roster/introduced evidence, source-refresh limitations and explicit public-release approval remain separate outstanding work. The prior scheduled refresh-health failure retained verified data; this phase does not investigate acquisition. TEST-001's historical Phase 6A completion remains unchanged. Static `noindex, nofollow` is preserved.

## Retained Phase 4W expectation correction

Initial mandatory run [40590552535](https://github.com/utahbug/UtahBills/actions/runs/40590552535) passed source integrity, production build, the new Phase 7B suite and all preceding retained suites through Phase 4V. Phase 4W then expected the native Sort select to be hidden at every width, including desktop. This is superseded by the owner's direct desktop selection requirement. Its assertion now explicitly expects visible desktop Sort and hidden phone Sort before opening the mobile disclosure; the rest of the suite and all workflow gates remain intact. No application change or deployment occurred from the failed run. The complete affected Phase 4W suite passed locally before the correction push, including phone/desktop placement, sorting/Copy, history, empty states, Calendar, seven widths, doubled text/CSS zoom and axe.

## Post-publication empty-disclosure correction

Run [40595503607](https://github.com/utahbug/UtahBills/actions/runs/40595503607) passed every mandatory check and deployed commit 417abf8. Published HTML/JS/CSS hashes and requested behavior matched locally tested assets. Final screenshot inspection then caught an empty extra desktop Sort disclosure after changing the selected sort: the results redraw reset its hidden state based only on result count. The redraw now also requires the select to be inside that disclosure. Desktop retains only the direct native control; phone sorting retains its existing disclosure. Phase 7B now explicitly checks absence of the empty desktop disclosure after every sorting option and after filtering/clearing. This narrowly scoped correction preserves all data, sort criteria, filtering and CI gates.

The complete Phase 7B matrix and retained mobile-toolbar suite passed after this correction. The updated desktop screenshot was inspected with sorting and filtering exercised; only one Sort control remains.
