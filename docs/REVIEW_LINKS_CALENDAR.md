# Review — link interactions and Calendar alignment

November 8, 2026 owner authorization; builds on published Compact Calendar `a5aae24`. Review only. Main, production, legislative records, acquisition, indexing and analytics stay unchanged.

## Decisions

- Ordinary anchors and text-style actions have no resting underline, underline on hover-capable pointers and keyboard focus, retain active-page underlining and visible focus, and show pressed background feedback. Link colors, fonts, destinations and external indicators remain. Inline links in paragraphs/lists/descriptions, including the footer, get a small non-text link symbol before their text so color is not their sole cue. Source-text insertion/deletion annotations are not targeted.
- Calendar category letters share the legend's existing backgrounds, foregrounds, 3px radius, padding and typography in event listings and grid. Deadline event listings already use a clock icon rather than D; preserve that representation and accessible category text. D in grid/legend uses the same deadline colors. No classification is changed.
- Month/Event labels share the first grid track; Show calendar/Key Dates share the second. Wrappers use display:contents so existing nodes, handlers and logical DOM order remain. Flexible tracks wrap text; very narrow widths fall back to one column. Key Dates retains italic .9rem text, starts at the Show calendar icon's grid edge and has no resting underline.
- Inter-row gap stays zero: the existing rows already meet at 44px minimum target height, so a further 4px reduction would compromise touch targets or overlap them. Outer Events spacing from the previous release is preserved.

## Verification gates

Test Chromium/WebKit, phone/iPad portrait and landscape, desktop/intermediate widths, Light/Dark, enlarged text/zoom, hover/focus/touch, 44px controls, grid alignment, category fixtures for all six official types, actual source links, filtering, Copy/fallback, Key Dates and axe. Test-only category fixtures do not modify snapshots. Retain all mandatory CI and artifact isolation checks. Record local, hosted and live results separately. Owner physical-device/VoiceOver and visual acceptance remain pending; no Main/Cloudflare promotion is authorized.

Custom inline-link symbols are a visible non-color cue; automated link-in-text-block review may remain incomplete for pseudo-element content. Inspect those symbols and existing external indicators visually and in owner assistive-technology acceptance; do not claim automated conformance from zero violations alone.

## Local results

Combined build/artifact checks passed: 9,335 Main/shared files unchanged. Chromium/WebKit link states, target/font preservation, touch navigation, all six category fixtures, twelve device/theme/text Calendar combinations per browser, keyboard, filtering, complete Copy/fallback and axe checks passed. Explicit 200% CSS zoom at 390/820/1280px passed. Retained Settings/nine-width text/zoom and matched typography suites passed. Review legend styles were compared directly with Main's unchanged legend in both themes and match exactly. Screenshots were inspected. Custom prose-link cues remain a manual visual/assistive-technology acceptance item; zero automated violations is not a conformance claim. Hosted CI, publication and live verification are pending.
