# Review — full-row Legislators navigation

Owner-authorized focused follow-up, November 8, 2026. Cloudflare release `9cd53e01-15f6-43b1-8185-b48f9522348a` is already complete and its immutable package is untouched.

## Implementation

Only `review-release.css` changes runtime behavior. The existing heading anchor stretches over its containing article, using the Bills-list pattern. Existing Introduced, Requests and District anchors remain above that layer and retain exact destinations. No new handlers, nested anchors, tabindex attributes or keyboard stops are introduced. Rows have a 44px minimum hit area, isolated link stacking, pointer-only hover and inset full-row keyboard focus. Anchors use touch-action:manipulation, preserving panning/pinch zoom while avoiding double-tap gesture handling on links (see [WebKit guidance](https://webkit.org/blog/5610/more-responsive-tapping-on-ios/)). Existing source records, sorting, column preferences and native history behavior are retained. Main and frozen `production-ui/` are unchanged.

## Verification

`tests/review-legislator-rows.mjs` covers Chromium/WebKit at 390/844, 844/390, 820/1180, 1180/820 and 1280/900; Light/Dark; repeated whitespace taps; Back/Forward; all eight optional-column combinations; independent count destinations; keyboard Enter and focus; retained sort/chamber state; 200% text; axe; and Main isolation. Screenshots are saved under `test-results/review-legislator-rows/`.

Local results, mandatory CI and published verification are pending until recorded below. Physical iPhone/iPad, VoiceOver and owner visual acceptance remain required; simulated touch is not physical-device acceptance. No production promotion is authorized.

Initial focus/background variants exposed intermittent WebKit missed activations and were not published. The final variant retains native links, an isolated stacking context, inset keyboard feedback and standard fast-tap handling. The full WebKit device/theme/column/history matrix subsequently passed. Physical-device acceptance remains distinct.

## Local verification results

Full WebKit device/theme/optional-column/history tests passed with the final fast-tap/inset-focus variant; Chromium passed the same matrix before the touch-specific refinements, and both engines passed the final iPhone-default top-toolbar case. Shared artifact, mandatory CI and live checks remain separate publication gates. [Production candidate preparation](INTERFACE_FIXES_RELEASE.md) is authorized only after those gates; upload remains prohibited without separate approval.
