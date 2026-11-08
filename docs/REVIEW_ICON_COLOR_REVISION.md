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
