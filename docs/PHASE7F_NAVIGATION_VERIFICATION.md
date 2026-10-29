# Phase 7F — iPhone Bills navigation defect

High priority, stable acceptance ID UI-025. Starting code: a8b077348e5166f720d2726caff51d45777c150b. Cloudflare production is not authorized for replacement by this repair.

## Evidence-supported cause

On the unchanged build, a twelve-attempt trace at 390px reproduced the owner's exact alternating pattern in Playwright WebKit: six failed taps, six successful taps. Chromium passed all twelve. Both reported requests were used: JDPVVTMPKT (Amendments for the Repeal of Boards) and PMJAPMXJQE (At-Home Parent Tax Credit Amendments).

On a failed WebKit attempt, pointerdown/up targeted the correct title at scrollY 1345. WebKit then focused the tabindex-bearing MAIN ancestor. The shared sticky-navigation focusin handler treated that large route container as an obscured control and scrolled it to y=44 before click dispatch. The eventual click targeted DIV.bill-list; no record hashchange occurred. On the following tap MAIN was already focused, so no new focusin correction ran and navigation succeeded. Returning from detail caused the pattern to repeat. This is not evidence of a bad record or user tap-zone error. The unexpected scroll also overwrote the saved listing scroll position.

Local diagnostic traces (not shipped): test-results/phase7f/chromium-trace.json and webkit-trace.json. No diagnostic listener is added to application code.

## Minimal correction and verification

ui.js excludes MAIN from the sticky-header focus scroll correction. Actual focusable controls retain their existing visibility adjustment; explicit route focus/scroll and saved listing state remain managed by the router. No CSS, routing architecture, data or Calendar acquisition changes.

The focused tests/iphone-navigation.mjs covers repeated same/different title and row taps, Browser Back/Forward, application return, restored scroll/search/pagination, saved filters and bookmark removal, sponsor links and archive records at 375/390/430/1280px in Chromium and WebKit. Mandatory CI installs WebKit and runs this regression in addition to every existing test. Targeted retained navigation/header checks and final CI/live evidence are recorded in delivery. No repeated full local suite is required.

Playwright WebKit on a computer is simulated engine coverage, not physical iPhone Safari acceptance. Owner must test Main on the affected iPhone: repeatedly open the two reported titles and other records from a scrolled listing, return via both Back and the app link, repeat with search/saved filters, then check sponsor and bookmark actions. Every tap must open the exact record without a top-of-list jump or lost state. Test Review separately if desired; its lighter typography remains isolated.

Cloudflare stays on the previously approved Phase 7D commit. Only after physical acceptance and a separate explicit authorization may a replacement production candidate be prepared/published. No new phase, production data update, DNS/indexing/analytics or Calendar work is included. The prior uncommitted Phase 7E diagnosis is kept separate from this repair commit.

Focused local result: Chromium and WebKit each passed 32 repeated title/whole-row taps across all four widths, plus filtered/saved navigation, distinct sponsor/bookmark actions, browser/app return, Forward, pagination and archive navigation. The retained `tests/header.mjs` and `tests/navigation.mjs` also passed, including visible keyboard focus, responsive/text/zoom/axe checks. Source validation and the combined Main/Review build passed. No full local suite was rerun. Mandatory CI and published verification remain required before delivery; physical-device acceptance remains pending.
