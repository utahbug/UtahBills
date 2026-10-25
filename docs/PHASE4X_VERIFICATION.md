# Phase 4X — responsive directory and archive appearance

Date: October 24, 2026 (America/Denver). Baseline `09ffbcd3b13d396047bacfb6ce23f82ce8d94407`, successful Main run [40158634574](https://github.com/utahbug/UtahBills/actions/runs/40158634574). Fetched main matched origin/main, with a clean checkout and no new scheduled snapshot commit.

## Changes and rationale

The previous 700px media rule stacked legislator entries but retained three horizontal sort headings. A named inline-size container now controls both presentations at 46em of available content width. This also responds to increased container text size; the results and controls cannot choose different breakpoints. At the narrowest widths the compact Sort row sits immediately above the adjacent count/Info/Copy group, without a new panel.

The six native select options and desktop buttons update the same directory state and call the existing sorter. Name defaults A–Z; first desktop bill-count activation sorts most first. Count ties remain alphabetical in either numeric direction, with stable ID ties. District order remains numeric with House/Senate ordering reversed consistently for descending, preserving the existing behavior. Search, chamber/session filters, profile return, count links and Copy remain connected to that state.

Stacked links use at least 32px-high targets with no overlapping hit regions, zero inter-line grid gaps and subtle row dividers; select/column/Info/Copy controls retain 44px targets. Desktop rows omit the visually redundant year; link accessible names and complete copied text retain 2027, and stacked rows display it. Current counts still represent saved distinct chief-sponsored 2027 HB/SB bills, not roster membership, requests, resolutions or extra versions.

Historical records use parchment `#F7F1E6`, hover/focus `#F0E5D3`, year identification `#EADCC4` and beige borders `#CDBD9E`. Normal high-contrast text/link colors remain. Archive headings, rows, bill details, sponsorship listings and historical profile identification share the palette. Separately dated contact panels remain white. Footer/archive routes, 2026 designation, filters and history are unchanged.

LEG-003 records the requested future sponsorship comparison as **Deferred**, dependent on useful real introduced 2027 data and a new scoped request. No total-sponsored union, fourth column, role-comparison interface or performance score was implemented. Existing unfinished tasks retain their statuses.

## Verification scope

`tests/phase4x.mjs` covers isolated zero/nonzero introduced fixtures, all six sorts, stable alphabetical numeric ties, first-click descending behavior, numeric districts, shared state across resize, filters/Back/count routes, visible versus accessible years, complete Copy context, and unavailable roster behavior. Layout checks include 320/375/390/430/768/1024/1280px and 783/784/785/800px around the normal content transition; doubled text and 200% CSS zoom; column alignment, target sizing, no overflow and strict WCAG A/AA automated checks. Historical checks cover enhanced/basic details, archive search/Back, sponsor listings and dated current-contact separation. Representative phone/desktop screenshots are local test artifacts.

Affected Phase 4V assertions reflect the approved desktop year omission, most-first default and visible responsive sort controls. The source/count exclusions, route assertions and accessibility rules remain intact. Mandatory CI retains every existing suite and adds Phase 4X. Published files are compared with the tested build after successful deployment; final SHA/run outcome accompanies delivery.

## Boundaries and remaining acceptance

No legislative acquisition, source snapshot, roster, data pipeline, refresh frequency, index restriction, hosting or domain change. Main remains the only deployment. Latest genuine schedule at baseline remains failed [40109485828](https://github.com/utahbug/UtahBills/actions/runs/40109485828); TEST-001 remains open pending qualifying scheduled end-to-end evidence. Push publication is not that evidence.

Physical iPhone/iPad, VoiceOver/NVDA and native browser-zoom acceptance remain human tasks. Automated checks and CSS zoom do not complete UI-001 or authorize public release. The pre-push check found no active or queued workflow, no new remote commit and no newer genuine schedule.

## Local outcome

The focused Phase 4X suite, retained Phase 4V directory/archive suite, Phase 4J popover/keyboard/Copy suite and Phase 4V model tests passed. The final narrow toolbar keeps Info/Copy adjacent even at CSS zoom; a measured long-option regression verifies the complete selected sort label fits. At exceptionally narrow effective widths only the redundant visual Sort label is hidden; the native select retains its accessible name.

Local assets use the production esbuild bundle configuration and copied stylesheet over the unchanged verified Phase 4W data projections. No historical source reprocessing or acquisition was necessary for this UI-only phase. The full production build and every mandatory integrity/browser check remain enforced in CI. Screenshot inspection confirms compact phone rows and restrained historical parchment; native browser zoom and physical/AT acceptance remain unperformed.

## CI portability correction

Initial run 40160875200 passed all pre-existing suites, then the new full-sort-label assertion caught insufficient room under Linux Chromium at 200% CSS zoom. The select now explicitly inherits its compact label font and uses 2px inline padding, preserving its 44px height and the unchanged complete-label assertion. This resolves platform-dependent native-control font sizing without weakening accessibility checks.
