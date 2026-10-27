# Phase 6B — LEG-004 directory refinement

October 26, 2026. Baseline: clean synchronized Main at `40be34db96dc51b418174130cc4a06d523710459`, published successfully by [Phase 6A run 40421794068](https://github.com/utahbug/UtahBills/actions/runs/40421794068).

## Scope and measured changes

Application changes are limited to Legislators directory markup in `discovery.js` and related `styles.css` rules. Sorting calculations/state, names/IDs, roster/session distinctions, bill counts, source data, Copy text, official finder destination and all other pages are unchanged.

The shared heading/row grid now uses a single `--directory-columns` definition: 15rem Name, 11rem District and 16rem Introduced bills, with the existing 16px gaps. Directory width decreases from 49rem to 46rem; result columns remain independent of search width. Desktop row padding becomes 4px vertically instead of 10px. Stacked-row padding becomes 4px instead of 6px, preserving reading order and existing inline-link targets.

The search row is 400px maximum: a 350px input, 6px gap and existing 44px Info control. Narrow screens use their available width. Find My Legislators remains right-aligned above this bounded search area. The unchanged subgrid/label geometry keeps Session, Chamber and search aligned; no label, font, margin or baseline adjustment was introduced.

Mobile Sort reuses the established selected-value display over the native select. The visible selection has no border/background, retains the dropdown indicator and grows/wraps with the selected wording. Native select focus, all six choices and directory state are preserved; the display synchronizes after both native selection and desktop heading sorting.

### Actual before/after measurements

Measurements use normal text in Edge at 1280 CSS pixels; coordinates are CSS pixels from viewport origin.

| Measurement | Before | After |
| --- | ---: | ---: |
| Name column x | 86 | 86 |
| District column x | 390 | 342 |
| Introduced bills column x | 582 | 534 |
| Directory row width | 784 | 736 |
| Normal desktop row height | 65 | 53 |
| Search input width | 440 | 350 |
| Session / Chamber / Search input top | 171.796875 / 171.796875 / 171.796875 | unchanged |
| All three rendered label text bottoms | 159.296875 | unchanged |
| Label font / line height | 14px / 21px, existing system family | unchanged |

At 701px, all three field tops remain exactly 160px and label text bottoms remain 147.5px. Stacked rows at 390px and 701px decrease from 109px to 105px. All 11 before/after baseline widths preserve exact field tops, label boxes, rendered text baselines, fonts and margins. Enlarged text may enlarge the shared heading row naturally, without offsetting an individual input.

## Verification

- New `tests/phase6b.mjs`: 320, 375, 390, 430, 600, 700, 701, 767, 768, 769, 1024, 1280 and 1920px, normal/doubled text/200% CSS zoom. The 767/768/769 checks bracket the existing 46em container transition with normal root size. Actual field/column/label geometry, long-name text bounds, row heights, native selected-value synchronization, six sort orders, no overflow, sole Info control, keyboard/Escape/focus and automated WCAG A/AA checks are asserted.
- Existing Phase 4F finder regression passed: official destination, privacy, unverified membership, filter/profile return, keyboard/touch, eight widths, doubled text, CSS zoom and axe.
- Retained Phase 4X directory sorting/fixture/navigation regression passed with only the explicitly moved Info geometry and compact-label reflow assertions updated. The moved gap assertion accounts for CSS zoom; sort identity, counts, focus and all accessibility rules remain intact.
- Additional focused actual-name geometry check passed at six widths with normal/doubled text. Filtered/chamber/sorted Copy preserves every matching name in order and the historical roster label; accessible Copied confirmation passed.
- Screenshots inspected at 390, 701 and 1280px. Local before/after measurement files and screenshots remain ignored test artifacts. Production UI bundle rebuilt against unchanged verified data; full build/integrity/browser gates remain mandatory CI.
- Required input, Info, finder, Copy and sort controls retain minimum 44px targets. Desktop row links retain 44px; stacked inline links retain their established 32px height with no reduction. Automated WCAG checks pass; no human-device certification is inferred.

Location/width assertions in existing Phase 4F/4J/4V/4X/5C/toolbar tests are updated to the owner's new requirements. No sorting, source, privacy, keyboard or accessibility assertion is disabled. The new suite joins the full mandatory chain. Final CI and Main asset/route outcomes accompany delivery; resolve the implementation commit with `git log -1 --format=%H -- docs/PHASE6B_VERIFICATION.md`.

## Acceptance boundaries

LEG-004's scoped implementation is complete after verification; [backlog](TASK_BACKLOG.md#leg-004). No extra sponsorship column or related deferred task is implemented. Physical iPhone/iPad, manual VoiceOver/NVDA, native browser zoom, independent editorial and public-release acceptance remain open. TEST-001 remains completed by Phase 6A; SESSION-002/003 remain open for authoritative membership/real introduced legislation. No original legislative data, acquisition, hosting, Contact or other UI changes. Main and noindex/nofollow are preserved.

## CI font-metric correction

Initial run [40427821626](https://github.com/utahbug/UtahBills/actions/runs/40427821626) stopped on the new finder-right-edge assertion; Main was not replaced. The same overflow was reproduced with wider Verdana/Courier metrics at 701–769px and enlarged text/CSS zoom: the heading's automatic grid-item minimum exceeded its cell. A scoped `min-width:0` on `.directory-search-area .search-heading` permits the existing wrapping to fit. The finder's last-word/external-icon tail also permits wrapping within this directory control at extreme font metrics, instead of retaining its shared no-wrap minimum. The icon and official destination remain intact. Labels, fonts, margins and baseline rules remain unchanged. Eight explicit wide-font cases join the regression; the original alignment assertion is retained with useful geometry diagnostics. Pinned Chromium and Edge focused results accompany delivery; no source or pipeline correction was needed.
