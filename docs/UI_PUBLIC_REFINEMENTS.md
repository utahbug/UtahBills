# UI-034 — November 9 UI refinements and public release

The owner authorizes these six corrections in GitHub Main, Review, and Cloudflare after mandatory verification. This supersedes the earlier preparation-only gate for the scoped navigation/filter candidate. It does not authorize data acquisition, indexing changes, domain changes, unrelated features or Review typography promotion.

## Changes

1. Request Source Details and Bookmark share an independent two-control group, Source first, with 44px targets. Basic/enhanced bill headings without Source Details receive only the existing bookmark beside the title.
2. Source details has a visible hover/focus tooltip; Escape dismisses the tooltip without changing the dialog action.
3. Current heading is **2027 Utah Bill Tracking** in every environment; the 2026 archive and Record Type distinctions remain unchanged.
4. The active bookmarked-record notice centers its icon, message and Show all on wide fine-pointer layouts. Touch layouts retain compact left alignment.
5. Bookmark filter tooltips/accessible names are **Show bookmarked items / Show all items**. Record controls use **Bookmark this item / Remove bookmark**, retaining the title in accessible names and existing IDs/storage.
6. Chronological Calendar lists divide Monday–Sunday weeks using the saved official date. Sunday stays with the preceding Friday/Saturday; Monday starts the next week, including year boundaries. Compare adjacent visible date groups so filtered gaps still divide correctly. The first visible group has no leading divider; individual events and grid are untouched.

The previously verified UI-032 full-row links and UI-033 recovery are now shared across the authorized environments. No duplicate profile tab stop or nested link is added. Count links, primary Bills reset, Back/Forward, complete Copy/CSV and alternative-word search remain covered. Main retains its other design; Review retains its separate lighter typography and Settings/color experiments. Production keeps the accepted frozen interface and excludes experimental typography.

## Verification and publication gates

`tests/ui-public-refinements.mjs` checks both environments in Chromium/WebKit at 320, 390, 844, 820 and 1280px, Light/Dark, doubled text, independent source/bookmark action/state, focus/tooltip dismissal, headings, notice alignment, exact week boundaries/filtered gaps and axe. Existing full browser/source/package suites remain mandatory. Prior wording and isolation assertions are updated only for the expressly approved shared behavior.

Run the full required CI before combined Main/Review publication. Verify actual published hashes, functionality, typography differences and noindex. Then prepare from the immutable current production package using `package-interface-fixes.mjs`; only `app.js`, `styles.css`, `assets/accepted-ui.js` and `release.json` may change. Every other file must match the production baseline, including all data, static record pages, sitemap, robots/security headers, Google verification, social assets and Analytics configuration.

Baseline production remains deployment **9cd53e01-15f6-43b1-8185-b48f9522348a**, project **utahbills**, branch **main**, runtime **8af6ca7d990d0b6dec156561aa89ce0140a36e15**, checksum **285232f20c53011cc0255b50021300c091da28aec9db79641778c985cad5d504**. Live metadata and Wrangler deployment list confirmed it before editing. The prior `f22fd8a` candidate was not uploaded and remains preserved. Keep the current baseline as immediate rollback and retain older evidence.

After candidate browser/checksum/source/indexing verification, `approve-release.mjs` makes a new immutable approved copy recording this owner authorization and exact successful CI. Verify its checksum, current project/branch/deployment, then use the documented pinned Wrangler Direct Upload. No additional owner approval is needed within this scope; failed mandatory gates block the affected deployment. Verify the actual custom domain after upload before claiming publication. RELEASE-003 primary-domain choice and bills.utahbug.com redirects remain untouched.

Publication and final package/deployment evidence will be recorded in the implementation PR receipt, linked from the handoff. Physical iPhone/iPad, VoiceOver and actual-device clipboard acceptance remain outstanding; browser automation is not physical acceptance.

## Local verification

Source-validated build and combined-artifact checks passed. Focused Chromium/WebKit tests passed in Main and Review at all five widths, including hover without geometry changes, focus/Escape, doubled text, both themes, axe, filtered date groups and year boundaries. Dialog focus assertions wait for the native close event rather than assuming synchronous WebKit focus restoration. Existing filter recovery and repeated phone-sized row/count/history checks passed, as did immutable package/approval rejection tests. Screenshots of request controls and Calendar dividers were inspected. Full mandatory CI, hosted verification and production publication remain pending until the receipt is recorded.

[PR #28 publication receipt](https://github.com/utahbug/UtahBills/pull/28) records the exact final commit, mandatory CI/Pages result, live environment checks and Cloudflare deployment/checksum/rollback evidence as each gate completes. Local checks do not establish publication; consult the receipt for the final status.

The week-boundary browser fixture fixes its clock to December 29, 2026, while retaining real date arithmetic for supplied dates. This keeps upcoming-event assertions deterministic after the fixture dates pass; it does not alter the application clock or published records.
