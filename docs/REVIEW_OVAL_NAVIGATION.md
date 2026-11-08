# UI-027 — Review oval top navigation

Owner authorized this isolated experiment on November 7, 2026. Main promotion and physical/visual acceptance remain separate.

Review-only CSS adds 1px existing blue-gray control borders with fully rounded corners to the four primary top links. Existing fonts are unchanged; compact padding retains at least 44px targets. The selected page uses the existing subtle hover surface and link-colored border. The independent 3px keyboard-focus outline remains. Links can wrap at intermediate widths and enlarged text. Every selector excludes `.phone-navigation`; no phone-bottom-bar, Settings, page-color, shared application, data or Cloudflare changes are included.

`tests/review-oval-navigation.mjs` covers Chromium/WebKit at 600, 700, 768, 820, 899, 900, 960, 1024, 1180, 1280, 1440 and 1920px, normal/doubled header text, Light/Dark, route/current-page behavior, focus, target size, viewport bounds, Settings overlap and axe. It compares fonts, Settings styling and page colors with the experiment removed; phone portrait/landscape styling must be identical. A touch-tablet case confirms top-navigation activation. Screenshots are captured for tablet/desktop and enlarged text. Mandatory CI includes this test without removing any existing check.

Local results and actual published results are separate gates. Preserve the complete Main/Review artifact and noindex in both. Physical tablet/iPhone, VoiceOver and owner visual acceptance are not established by browser automation.

## November 7 - final shape and hover refinement

The visible 1px oval border is inset 5px vertically inside the unchanged minimum 44px link target. Bills has a 72px minimum width; all four links retain matched height, typography and compact gaps. A pointer-inert pseudo-element draws the border so hover and selection cannot move adjacent links. Fine-pointer hover-capable devices receive a restrained existing-blue surface mix, including a distinct hover treatment for the selected page. Keyboard focus remains a separate 3px outline. Phone navigation is excluded.

Focused Chromium/WebKit checks passed across the existing twelve widths, both themes and doubled header text, including dimensions before/after hover, selected hover, coarse-pointer exclusion, touch targets, focus, routes and axe. This visual-polish batch follows the independently published UI-030 experiment; it includes the separately requested compact Settings typography. Main, shared application/data and Cloudflare are unchanged. Hosted CI/publication and owner visual acceptance remain pending until recorded.

## November 8 desktop icon and wrapping refinement

Review standard navigation reuses the original document, clock, calendar and people SVG nodes at 18px before the labels. Recent keeps its route and page heading. Targets remain at least 44px; the visible 1px ovals, hover/selected/focus distinction and regular spacing remain. Row gaps are 2px and the header no longer reserves an empty Settings row. Compact phone styles are excluded. Chromium/WebKit local checks passed across twelve intermediate/desktop widths, Light/Dark and doubled header text, including visible icon dimensions, Settings separation, no excess bottom row, overflow, routes and axe. [Combined sources, screenshots and publication gates](REVIEW_NOV8_REFINEMENT.md). Owner visual acceptance and promotion remain pending.
