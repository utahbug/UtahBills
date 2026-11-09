# Review — active filter recovery and Bills heading

Owner-authorized follow-up, November 8, 2026. Review only; no production upload, legislative-data change, indexing change or acquisition.

## Decisions and implementation

- Current Review Bills heading becomes **2027 Bill Tracker**. The Record Type selector continues distinguishing public requests from introduced bills/resolutions. The 2026 archive heading stays unchanged.
- Saved-only mode displays a compact filled-bookmark notice, **Showing bookmarked records only — Show all**, next to the results controls. Show all disables only the saved filter and returns focus to its existing toggle. The redundant count suffix is removed only in Review.
- Empty states distinguish no bookmarks on this device, saved records excluded by current restrictions, and no records in the selected saved source scope. Recovery actions use the existing filter functions. They do not change matching rules, counts, saved IDs or source evidence.
- Record Type gets a restrained selected border. An empty introduced scope explicitly refers to the saved official records and provides a public-request action; it makes no claim that unpublished legislation does not exist.
- An ordinary primary Bills/brand navigation in Review opens a clean current listing. Previous filtered history entries remain intact for Back/Forward. Legislator Introduced and Requests destinations remain unchanged.
- `review-bills.js` receives actual complete-result counts and in-memory bookmark totals through a small optional hook in `app.js`. Only Review installs that hook. Main and frozen production assets do not activate it. This preserves the shared Main/Review application bundle and identical source data; no duplicate bookmark store, snapshot fetch or inferred identity is introduced.

## Verification and limits

Focused Chromium/WebKit tests exercise phone/tablet/desktop, zero/one/multiple bookmarks, blocked storage, combined search/status/type restrictions, unavailable introduced records, direct recovery, Copy/CSV, multi-page matches, historical headings, Back/Forward, Main isolation, themes, enlarged text and axe. Browser-only fixtures avoid assumptions about changing official records and are never published.

Local checks, mandatory CI and live publication results are recorded separately below. Owner physical iPhone/iPad, VoiceOver and visual acceptance remain pending. Existing Cloudflare release and rollback package are untouched; future promotion requires separate authorization.

## Local verification results

Chromium/WebKit filter-recovery suites passed, including isolated 65-request fixtures, zero/one/two bookmarks, reload persistence, blocked local storage, combined search/status/type restrictions, complete Copy across pagination, CSV, historical heading preservation, primary-navigation reset with Back/Forward restoration, selected Record Type styling, Light/Dark, enlarged text and axe. Existing November 8 Review content/heading checks also passed. These are browser checks, not physical-device or clipboard acceptance.

Production overlay unit checks pass exact-baseline/CI rejection gates, immutable rollback verification and the exact four-file allowlist. The owner authorized [candidate preparation only](INTERFACE_FIXES_RELEASE.md); production upload requires new authorization.

## Publication and candidate receipt

[PR #26](https://github.com/utahbug/UtahBills/pull/26) retains the exact merged commit, mandatory CI/Pages outcome, live Review verification and production-candidate checksum receipt as those gates complete. Consult that receipt rather than treating local test completion as publication or upload authorization.

## Focused recovery follow-up

The empty saved-results notice retains the existing any-word search action and its reverse action. The decorative bookmark is explicitly hidden from assistive technology. Focused Chromium/WebKit tests passed all three viewport widths, including the AND/any-word round trip with saved-only filtering retained.

CI run 42549054526 failed twice because the browser process crashed when the heavily exercised Review page navigated to Main. The isolation assertions now use a fresh Main browser context; all within-Review history and navigation assertions remain. No required checks were removed. Final mandatory CI and publication remain gated and are recorded in the linked publication receipt.
