# Mobile Bills results toolbar — October 25, 2026

Baseline: published `733db38a1344e796857c3556e107d1e4a0189adf`. The prior Contact/header batch was already complete; this is a separate bounded refinement.

## Change

At the existing <=700px breakpoint, move the existing More disclosure into the left summary group and the existing count-Info button immediately before Copy at the right. Preserve DOM/keyboard order, names, event handlers, native Info popover association, 44px targets and existing sort/page-size state. Desktop resize restores the original containers and focus. The separate search-field Info disclosure remains untouched. The shared Bills implementation applies to requests, introduced measures and historical listings; Activity, Calendar and Legislators layouts are unchanged.

Count Info stays available when no results exist, even though Copy and More retain their existing hidden behavior. More’s existing panel is positioned within the visual viewport, accounting for CSS zoom, enlarged text, resize and scroll; it opens above the trigger when insufficient space exists below. Long content retains internal scrolling. Position listeners are disposed when the listing is replaced. No data, source, acquisition, header/footer or hosting changes.

## Focused checks

[mobile-toolbar.mjs](../tests/mobile-toolbar.mjs) covers real saved requests and isolated introduced-bill fixtures at 320, 375, 390, 430 and 700px, normal/doubled text/200% CSS zoom. It checks icon order and row centers, 44px targets, all four menu viewport edges, original labels/actions, sort/page size, complete Copy, CSV download, Info close/focus, Escape, filtered/empty results, bottom-of-viewport placement, and desktop/mobile resize focus and restoration. Full-page axe checks retain WCAG 2.2 A/AA tags. Fixtures do not enter production data.

The existing [toolbar suite](../tests/toolbar.mjs) retains Copy, source content, confirmation geometry, desktop controls and unrelated-page assertions. Its mobile row assertion now compares the three icon centers rather than the parent’s top edge, correctly allowing enlarged Info targets or wrapping counts without multiple icon rows. No target-size or accessibility assertion is removed.

Local focused mobile suite passed for both record types across five widths, doubled text and 200% CSS zoom, including non-overlapping targets. A touch-enabled 375px browser screenshot confirmed the menu fits and the separate search Info remains in place. At the smallest zoomed layout, a 132px minimum toolbar width preserves three 44px targets within the viewport.

The focused suite runs first in the mandatory chain to expose failures early; all other suites remain enabled. The existing toolbar suite also passed locally, including Copy, desktop/unrelated-page layouts, keyboard controls, text/zoom and axe checks. Final CI/publication accompany delivery. Automated checks do not close physical-device or manual assistive-technology acceptance. All unfinished backlog IDs remain open; noindex/nofollow and Main-only publication are preserved.
