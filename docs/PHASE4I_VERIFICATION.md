# Phase 4I — activity usability and shared sticky navigation

Verified October 22, 2026 (America/Denver). Started from clean `main` matching fetched `origin/main`, `57cdb19250ea8f507d0f0ba00d2e6ae335aaa73f`; its Main deployment [39887652602](https://github.com/utahbug/UtahBills/actions/runs/39887652602) succeeded. No scheduled snapshot commit advanced that baseline.

## Activity refinements — ACT-003

[Implementation 7c16b75](https://github.com/utahbug/UtahBills/commit/7c16b750b074798d4eba465f9d87960cd8ab523c): request headings contain the observed official title alone and retain exact request-detail routes. Activity kinds, dates and date qualifications remain separate. Compact secondary metadata contains the individual official record link, verified tracking ID and assigned bill link, or “Bill number: Not assigned.” Tracking IDs are one pixel smaller; normal-weight groups wrap with nonbreaking separator spacing. Introduced measures retain their bill/resolution number prominently. Copy output remains unchanged.

The activity projection exposes tracking IDs from checksum-verified records and the existing catalog-derived `introducedBill` association. That association is an exact-ID join to an acquired 2027 measure; no title matching or acquisition rule changed. Bill assignment metadata reflects the latest saved catalog, not a claimed assignment on the older observation date. Event identities, observed titles, timestamps, original bytes and source hashes remain unchanged. No legislative source data was edited.

Date/category captions are removed visually, with native controls named “Activity date range” and “Activity category,” retaining 44px targets. Public-request browsing has an “Official 2027 bill search” link with the shared external-link icon, separate from individual activity source links.

## Shared header correction — UI-003

[Implementation 6daf52d](https://github.com/utahbug/UtahBills/commit/6daf52d936c8cd618a869c165aafe86321fb97ee): the prior shared helper deliberately enabled sticky positioning only at widths of at least 900px and header heights below 30% of the viewport. Thus narrow screens, wrapping and enlarged text disabled it. There was no compact-on-scroll state. The header is outside the route-specific main content; no page-specific containing-block fix was needed.

One shared implementation now keeps the header sticky at all widths. Beyond 48px of scrolling it reduces padding and hides only the brand subtitle and independence descriptor; all four primary navigation destinations remain visible. At the top it restores the normal header. Separate entry/exit thresholds avoid oscillation from the height change. Route transitions synchronously update the header after the existing scroll reset/restoration; saved bill-list positions remain supported.

ResizeObserver maintains the actual header height for root scroll padding. Keyboard-focus correction accounts for CSS zoom; section offsets no longer double-count header height. The focused skip link stays above the sticky header. The shared section-scroll helper retains immediately preceding section navigation when opening its first section, so those links are not partially covered. The wordmark, normal-weight active underline, 44px primary links and narrow-screen wrapped alignment are preserved. No menu destination, route or source disclosure was removed.

## Focused local verification

- Python: `tests/activity_data.py` (5 tests), `tests/catalog_updates.py` (6 tests). Assigned/unassigned request metadata, introduced tracking IDs, exact-ID separation, preserved histories/stable IDs and acquisition guards pass. Fixture-only failures are expected rejection assertions, not production acquisition failures.
- Production build passes, including three vote integrity tests and source/catalog/archive verification.
- Extended `tests/phase4g.mjs`: actual request titles, metadata and official links; assigned/unassigned browser fixtures; accessible filter names; period/category/pagination and Copy; official search access; 320, 375, 390, 430, 600, 768 and 1280px, doubled text, 200% CSS zoom, wrapping/no overflow and axe WCAG A/AA checks.
- `tests/phase4h.mjs`: all 16 real activity request links, including XKUCMCIIHJ; stale catalog recovery, retry, unknown IDs and delayed navigation pass.
- `tests/activity.mjs`: historical actions/documents, date boundaries, paging, Copy and accessibility pass.
- `tests/header.mjs`: nine routes (Bills, Activity, Calendar, Legislators, About, FAQ, request, bill and legislator details), top/middle/bottom/return; seven widths, doubled text and CSS zoom; scrolled mouse/keyboard route transitions, touch targets, containment, no overlaps/overflow, visible focus, FAQ section heading offsets and axe pass. Short pages are not artificially padded to manufacture scrolling.
- Existing `tests/usability.mjs`: Back to top, preserved browsing and responsive behavior pass. Its obsolete expectation of a static mobile header now expects sticky positioning.
- Existing `tests/phase4b.mjs`: wrapped wordmark alignment, legacy links, compact layouts and accessibility pass.
- `tests/qa.mjs`: existing route/accessibility checks pass at all six widths after correcting the Guide anchor issue below.
- Representative 390px and 1280px activity/header screenshots inspected locally. Screenshots are local test artifacts, not new published environments.

The complete mandatory GitHub Actions integrity/build checks and browser suites remain required, including the new header suite (23 total). Publication outcome is reported with the final deployment run. Physical iPhone/iPad and manual VoiceOver/NVDA review were not performed; automated checks are not WCAG certification.

## Unchanged limitations and priorities

TEST-001 remains open/Blocked: latest actual scheduled run is still [39820847031](https://github.com/utahbug/UtahBills/actions/runs/39820847031), the previously investigated failed cron execution. No new manual refresh was triggered. Successful push publication cannot close scheduled acquisition acceptance.

Saved coverage remains 268 requests, 16 observed request events and zero introduced 2027 measures. Assigned/introduced cases are isolated fixtures until real official evidence exists. SESSION-002, SESSION-003, LEG-001, historical conflicts/identities, manual accessibility and editorial review remain open. The October 2026–April 2027 priority, static noindex/nofollow and Main-only deployment remain intact; Review is unconfigured.

## Publication-gate correction

Initial push run [39890359399](https://github.com/utahbug/UtahBills/actions/runs/39890359399) passed integrity/build checks but blocked deployment on a `target-size` violation at the legacy Guide route, 768px. Reproduction showed a preceding FAQ navigation link partially covered by the newly sticky header after section scrolling. The shared section-scroll helper now keeps immediately preceding section navigation visible; the destination heading also remains clear. The focused header suite now checks that legacy route at phone/tablet/desktop widths with axe, and the existing QA suite passes. No test or deployment gate was disabled. Main retained the previous verified version during the failed run.

Second push run [39890780349](https://github.com/utahbug/UtahBills/actions/runs/39890780349) passed the corrected QA routes but blocked deployment on the existing exact bill-list return-position assertion. Browser scroll anchoring adjusted the scroll coordinate when the header compacted. The shared update now preserves that coordinate across header resizing. The subsequent existing secondary-resource click check exposed a related pointer-focus shift: pointer-down hit the resource but compacting during focus moved it before pointer-up. Header resizing is deferred through pointer activation; an isolated event trace confirms pointer-down, pointer-up and click now hit the same resource. These changes preserve the original strict tests rather than relaxing them. The final production build and affected Batch 2, shared-header and QA suites all pass locally.

Third run [39891763420](https://github.com/utahbug/UtahBills/actions/runs/39891763420) passed all earlier functional/return-state regressions, then reported `target-size` during the toolbar audit. Local pinned Chromium reproduced an unfocused Calendar day partially behind the sticky header after scrolling to Copy (768px, doubled text); Copy itself remains visible. This matches the scrolled sticky-target limitation documented in [axe-core issue 3720](https://github.com/dequelabs/axe-core/issues/3720), which remains open. The toolbar test now explicitly checks the activated Copy control is unobscured in its actual scroll state, then returns to the top for the complete page-wide axe audit with **every existing rule still enabled**. The header suite additionally focuses a Calendar day scrolled behind the header and asserts it is fully revealed. This separates scroll/focus behavior from target-size measurement rather than disabling a rule or hiding a focused-control defect. Physical and manual accessibility acceptance remains open. The complete toolbar matrix and all remaining Phase 4A/4B, quality-audit, Phase 4D/4E/4F/4G/4H and shared-header regressions pass locally in pinned Chromium before the next push.
