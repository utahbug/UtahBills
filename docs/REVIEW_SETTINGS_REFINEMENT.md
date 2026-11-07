# Review Settings and mobile surface refinement

November 6, 2026. Owner-authorized Review-only refinement of UI-029/UI-031; no Main or production promotion.

## Changes

- Existing Lucide horizontal-sliders icon replaces the gear. The compact native popover has Appearance beside its Light/Dark/System select, then direct Contact, About UtahBug and Frequently asked questions links. System retains the existing `device` storage value and OS preference behavior. No extra heading or nested disclosure remains.
- Replacement functions first passed the retained Chromium/WebKit tests while standalone controls were visible. Review now hides its duplicate Appearance/Contact buttons only after replacement initialization succeeds. Main retains both controls. Minimum 44px targets, natural Tab order, visible focus, Escape return and outside dismissal remain.
- Desktop backgrounds are unchanged. Phone Bills/Legislators retain the current blue-gray page. Activity uses a flat white reading surface with existing dividers. Calendar uses white around the agenda/grid, retaining existing date highlights and the existing tint for blank grid cells. Dark colors remain unchanged; no palette colors were added.
- Only the phone navigation label changes from Activity to Recent. The original anchor, clock icon, destination, active state and router handlers remain intact. Desktop still says Recent Activity.

## Isolation and checks

Only `review-release.js` and `review-release.css` change presentation. Combined packaging continues to exclude those files from Main and production candidates and to verify identical shared application/data bytes. No acquisition, source records, indexing policy, Cloudflare settings or preserved candidate/rollback package changes are included.

`tests/nov13-review.mjs` retains the nine-width, both-engine/theme, persistence/device change, route, focus, enlarged-text/zoom and axe checks. Its assertions now verify Main's standalone controls and Review's verified replacement. `tests/review-refinement.mjs` adds route-specific phone/desktop backgrounds, portrait/landscape, menu alignment/keyboard order/light dismissal, blocked storage, Recent label/icon/destination/history and visual captures. The existing Review typography/navigation checks remain, with Contact reached through Settings in Review.

Initial test notes: browser innerText included trailing layout whitespace around Recent; the assertion trims that whitespace without changing the label. One local navigation run overlapped artifact rebuilding and timed out loading rows; the unchanged test subsequently passed in Chromium and WebKit against the completed artifact. WebKit’s default Tab preference skipped ordinary links; explicit natural-order tab stops now make all three Settings links reachable. No safeguard or source-integrity assertion was relaxed.

Local visual captures are under `test-results/review-refinement/` and `test-results/nov13/`. Required CI and combined Pages publication gate the rollout. Record the actual published result in the change PR and final report; local checks alone do not establish deployment.

Physical iPhone visual preference, native zoom, Safari keyboard/chrome and VoiceOver acceptance remain pending. These changes are not promoted to Main or included in the November 13 production candidate without separate owner approval.

Local verification completed: full build and combined-artifact byte checks passed; matched Main/Review typography comparisons passed; nine-width Settings tests, focused route/background/keyboard/axe checks, and the repeated-tap/history/Copy/bookmark phone navigation suite passed in Chromium and WebKit. Published verification remains a separate rollout gate.

## Contact icon follow-up

Owner additionally requested the existing circular envelope inside Settings immediately before Contact. Review moves the original rendered SVG into an aria-hidden icon slot that reuses the existing `.header-contact svg` rules; it does not redraw the icon. All menu labels share one text column. The header link remains hidden in Review after replacement setup; Main retains its original visible icon/link.

Chromium/WebKit checks compare the menu SVG markup and computed size, padding, circular border, stroke and colors with Main's original icon in both themes; they also verify aligned text, keyboard order, 44px link targets, nine widths, enlarged text/zoom, Contact navigation/mailto and axe. All passed locally. The duplicate-control assertion is scoped to the header because the icon styling class is intentionally reused. The popover assertion now waits for its native toggle event before checking aria-expanded. The existing CI run is not cancelled; this follow-up uses the same queued combined-artifact workflow.

## Final menu typography and spacing — November 6

The owner requested uniform regular-weight menu text without persistent link underlines. Review-only CSS now inherits the application font/size at weight 400 for labels, selector and links, removes menu-link underlines, uses consistent 44px rows, and provides the existing subtle hover surface plus inset visible focus. The original circular envelope and aligned text column remain unchanged. Native select padding is adjusted to keep WebKit rows consistent without replacing the accessible native control. No typography outside the Settings panel changes.

Focused Chromium/WebKit checks passed at 320/390px portrait, 844px landscape and 1280px desktop in Light/Dark: exact font properties, absent underlines, aligned labels, equal row spacing, 44px targets, original icon styling, keyboard/Escape/outside dismissal, blocked storage and axe. Desktop and phone screenshots were visually inspected. The full hosted suite and live publication remain required. Physical iPhone/VoiceOver and owner visual acceptance remain separate.

The preceding envelope release `233df74` successfully published on owner-authorized deployment-only attempt 4 of [run 42310105510](https://github.com/utahbug/UtahBills/actions/runs/42310105510/attempts/4), November 6 at 7:01 PM MST. Live checks confirmed noindex and unchanged Main hashes before this typography refinement.

## Three-entry menu and direct toggle — November 6 owner correction

The owner superseded the three-choice appearance selector: Review now has exactly Dark/Light, Contact and About & FAQ as primary entries. Dark/Light uses the original half-filled circle and directly toggles the resolved light/dark state, storing the explicit choice with the existing API/key. It exposes aria-pressed and a current-mode live description. Existing `device` preferences continue to resolve safely until an explicit toggle; no new device/default option is offered. Review also hides the legacy About-page Device Default control. Main retains its original controls and behavior.

Contact retains the original circular envelope and route. About & FAQ uses the existing Lucide information icon and reveals the two existing links within the same popover. Escape first closes that disclosure and returns focus to its button; Escape from the primary menu returns to Settings. Outside dismissal and route closing remain. The narrower opaque panel keeps regular system typography, aligned icon/text columns, no persistent underlines, 44px targets and visible focus.

Focused Chromium/WebKit checks cover direct mouse/touch and Space toggling, persistence/reload, legacy device preference and OS changes before explicit selection, blocked storage, exact primary labels/order, matching fonts/spacing/icons, About/FAQ routes, keyboard focus/dismissal, phone/tablet/desktop Light/Dark, nine widths, enlarged text/zoom including expanded links, and axe. Screenshots are inspected separately. Mandatory CI and actual published verification gate completion; physical iPhone/VoiceOver and owner visual acceptance remain pending. No shared app/data, acquisition, production or indexing changes are included.

## Direct About and FAQ links — November 7

Owner requested four flat entries: Dark/Light, Contact, About and FAQ. The Review-only implementation removes the disclosure and its state entirely. About and FAQ link directly to their existing routes and use Lucide information/question-circle icons with 1.25px strokes and 85% opacity against the existing muted palette. Original theme/envelope icons, direct persisted toggle, uniform typography, no underlines, 44px rows, native popover dismissal and keyboard focus remain. Main shared application and data are unchanged.

Focused checks retain exact labels/order, font/row alignment, icon styling, no nested controls, all routes, keyboard/Escape/outside dismissal, toggle persistence/legacy preference/blocked storage, nine widths, phone/tablet/desktop, Light/Dark, enlarged text/zoom and axe. Screenshots are visually inspected. Mandatory CI and actual live verification gate publication; physical iPhone/VoiceOver and owner visual acceptance remain pending.

CI compatibility prerequisite: scheduled run [42397856510](https://github.com/utahbug/UtahBills/actions/runs/42397856510) failed installing Playwright 1.56.1 because ubuntu-latest moved to Ubuntu 26.04. Successful [42336318056](https://github.com/utahbug/UtahBills/actions/runs/42336318056) used Ubuntu 24.04.5 / image ubuntu-24.04. Pin only the build job to ubuntu-24.04; retain all tests, source safeguards, deployment jobs and acquisition behavior. No failed-run data is promoted and no acquisition rerun is part of this UI task. A successful UI push will not establish genuine scheduled-refresh recovery.
