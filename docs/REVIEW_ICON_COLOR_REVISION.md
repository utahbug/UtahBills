# November 8 — Review icon navigation and neutral color revision

Owner authorization supersedes UI-027 oval borders and UI-031 pale-blue page treatment. Review only; no Main promotion, Cloudflare, source-data, acquisition, indexing or analytics changes.

## Revised design

- Four existing banner anchors retain their 18px icons and text. Remove oval borders; use compact 44px targets, 2px wrapped-row gaps, subtle hover surfaces and an active underline plus background. Keyboard focus remains independent. Compact toolbar rules, defaults and saved preferences stay unchanged.
- Near-white neutral #f5f5f7 replaces the pale blue page background across all four main views. Reading surfaces remain white, with continuous Activity results and Calendar surfaces rather than individual event cards. Dark colors remain unchanged.
- Test a decorative two-pixel blue/purple/red gradient along the light-mode banner bottom. It conveys no political or record meaning and carries no text. Do not spread it onto reading surfaces.
- Key Dates uses inherited font, regular italic text, no permanent underline, hover/focus underline and the existing 44px target/modal/source links.
- Preserve branding, responsive tagline hiding, Settings, 2027 heading, Activity selection, toolbar positioning and KSR behavior.

## Verification and acceptance

Retain mandatory CI and artifact checks. Focused Chromium/WebKit checks cover twelve banner widths, normal/enlarged text, themes, hover/active/focus, touch targets, phone exclusion, all four surfaces, thin accent dimensions, Key Dates styling/dialog and axe. Preserve native-dialog assertions while awaiting asynchronous dismissal. Capture matched phone/iPad/desktop views and intermediate-width navigation screenshots.

Local verification, hosted CI, publication and live verification must be recorded separately. Owner visual acceptance of the restrained gradient and borderless navigation remains required; physical iPhone/iPad Safari, VoiceOver and device text sizing are not established by automation.

## Local verification

Complete combined build and artifact isolation passed (9,335 identical shared files). Chromium/WebKit navigation checks passed across twelve widths, normal/doubled text, themes, active/hover/focus, touch exclusion and axe. Four-page phone/iPad/desktop comparisons passed, including near-white surfaces, two-pixel light-only accent, italic Key Dates focus styling, modal dismissal, heading, Activity highlight, KSR and tagline. Retained Settings/refinement and nine-width enlarged-text/zoom suites passed. Screenshots were visually inspected; gallery: `test-results/review-nov8/comparisons.html`. Hosted CI, deployment and live verification are pending.

The existing native-dialog Escape test now waits for hidden state before its unchanged visibility assertion, resolving the previously documented asynchronous-close timing issue. No source assertions or mandatory suites were removed.

## Published verification

Published November 8 at 10:54 AM MST (17:54:36 UTC), commit `6c04b0d313153cd2d9f5f49ee0da594d3341c30e`. [Mandatory CI/Pages run 42502295933](https://github.com/utahbug/UtahBills/actions/runs/42502295933) passed on its first attempt. Implementation `a72a15a`; tests/decisions `98c19de`; PR #20. Live Chromium/WebKit passed twelve-width navigation, Light/Dark, enlarged text, hover/active/focus, axe and compact-toolbar isolation. Four-page phone/iPad/desktop checks passed for neutral surfaces, thin light-only gradient, Key Dates and preserved Review behavior. Explicit Key Dates hover/focus tests passed in both engines/themes. Refreshed live screenshots were inspected.

Main baseline hashes, shared app/data and both noindex directives remain unchanged. Cloudflare, indexing, analytics and acquisition were untouched. [Machine-readable receipt](evidence/REVIEW_ICON_COLOR_REVISION.json). Gallery: `test-results/review-nov8/comparisons.html`. Owner visual acceptance and physical iPhone/iPad Safari/VoiceOver remain pending; no promotion is authorized.
