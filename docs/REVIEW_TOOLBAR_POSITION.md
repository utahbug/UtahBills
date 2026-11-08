# UI-030 — Review phone toolbar position

Owner authorized this independent Review experiment November 7, 2026. It does not include the separately queued oval-navigation or Settings typography refinements.

The phone-only Settings row is `Toolbar: [Bottom] [Top]`, using labeled pressed-state buttons and a live announcement. New/invalid preferences default to Bottom. `utahbills-review-toolbar-position` stores the browser-local selection; blocked storage permits changing it for the visit. Existing Dark/Light, Contact, About and FAQ entries are preserved. Tablet/desktop hide the row and retain their current navigation.

`review-toolbar-position.js`, bundled only into Review, moves the original navigation element beneath the brand row in Top mode and returns it to its original header location in Bottom mode. No anchors are cloned or rebound. Top mode uses a sticky header in normal document flow, includes safe-area padding, reserves header clearance and removes only the now-unneeded bottom-bar reserve. Bottom mode retains the shared existing styles. The shared phone detector, keyboard branch, router, saved-list behavior and UI-025 MAIN focus exclusion remain unchanged. Returning to tablet/desktop restores the original DOM position.

Focused Chromium/WebKit tests cover default/blocked storage, immediate toggles, keyboard/pressed states, persistence, one original toolbar and four original anchors, phone portrait/landscape, Light/Dark, content/header clearance, tablet/Main isolation and axe. The established navigation suite is reused with a Top preference to cover repeated bill taps, browser history, saved search/bookmarks, Copy/CSV fallback, archive return, enlarged text, final-content clearance and simulated keyboard handling. Its normal invocation retains Bottom coverage. Existing Settings nine-width/text/zoom checks remain; a minimum-width constraint was removed so the phone panel can honor its scaled viewport maximum at 200% zoom.

Mandatory CI, the combined Main/Review artifact and actual published checks gate delivery. Both development environments retain noindex. No data acquisition, shared application edits, Cloudflare, indexing or analytics changes are included.

Physical acceptance remains required on iPhone Safari: portrait/landscape, native keyboard and browser chrome, top/bottom safe areas, repeated taps while scrolled, switching/reloading, final content and pagination clearance, VoiceOver announcements and enlarged text. Automated WebKit is not physical-device acceptance.

Integration correction: the retained Settings fallback test used a generic status-region selector. UI-030 intentionally adds a second status region for toolbar changes. The assertion now targets `#review-theme-status`, preserving its blocked-storage check; the toolbar status remains separately checked. The unchanged application passed the focused Chromium/WebKit Settings suite with this selector correction. No assertion was removed or weakened.

## Published verification and layout clarification

UI-030 published independently at `0149b1ce647de1b823a77a1d53ec325a92f204c4`; [mandatory CI and Pages run 42428274498](https://github.com/utahbug/UtahBills/actions/runs/42428274498) succeeded. The preceding run 42427804430 stopped at the ambiguous status-region test documented above and did not deploy. Live Chromium/WebKit verified saved/blocked preferences, the same original bar, Top clearance, repeated bill taps, history, search/bookmarks/Copy, both themes and Main isolation. Main baseline hashes and shared data remain unchanged; both environments retain noindex.

Owner clarification November 7: offer Toolbar Bottom/Top only when the compact four-icon layout is active. This includes an iPad using that layout; standard tablet and desktop navigation never gain a position option. Hide the setting automatically when standard navigation returns and preserve the saved choice. Existing implementation already follows the shared layout class, without device-name detection. Targeted local and live Chromium/WebKit checks passed for an iPad switching 600px compact to 1024px standard and back, and a narrow non-touch desktop with no setting. Physical iPhone/iPad and VoiceOver acceptance remains pending.

[Machine-readable receipt](evidence/REVIEW_TOOLBAR_POSITION.json).
