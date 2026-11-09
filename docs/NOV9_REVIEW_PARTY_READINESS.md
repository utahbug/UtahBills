# November 9 Review Party and readiness

Owner-authorized bounded Review development and read-only audit. No acquisition, Cloudflare deployment, production tracking, DNS, analytics configuration or indexing change.

## Party evidence and presentation

Review adds an unchecked Party (2026) checkbox to the existing Columns menu. Native Name, Introduced bills, Public requests, District, sorting, counts, profile/count links, Copy and CSV remain unchanged. Party does not add sorting or vote totals. A separate local preference preserves native saved choices; Restore defaults clears Party too. The Review module and projection are absent from Main. Combined packaging retains identical shared data/assets.

Source: saved [official 2026 year roster](https://le.utah.gov/asp/roster/roster.asp?year=2026), retrieved `2026-10-21T04:04:42.412887+00:00`, SHA-256 `737ac5c975d2c578f9347a22a220c07dc5ad16d46458ccf4bad247ce6608ebb2`, preserved at `data/catalog-raw/737ac5c975d2c578f9347a22a220c07dc5ad16d46458ccf4bad247ce6608ebb2.txt`. Source hashes are validated. Exactly 100 of 104 roster rows have a unique direct Listbox member ID and exact name/chamber/district/2026GS match to the directory. Their recorded labels (Democrat, Republican, Forward) are retained verbatim. The four rows without direct IDs—Jefferson S. Burton (House 64), Tyler Clancy (House 60), Matthew H. Gwynn (House 6), and Trevor Lee (House 16)—display Unavailable; no current-contact or name-only join supplies party. The generated Review-only evidence includes every unavailable name/reason. No 2027 affiliation or membership is asserted. A year-roster observation is not a dated history of affiliation at every vote; this does not implement TRANS-008.

On Review Bills results only, an exact secondary Request label below Bill request is hidden. Meaningful secondary content remains visible. Shared data, kind, identities, search/filter/sort/Copy/CSV code and Main labels are unchanged.

## Operational recovery

Started from clean local/remote main `5a4f96113b648c2e6eb3525c4c8aef4ed2e7abca`; PR #32 merged, no other open PRs at handoff. Push workflow 42669967054 was still in progress at initial recovery. Publication is separate from acquisition.

Latest genuine schedules checked through November 9:

| Run/date | Acquisition components | Build/publication |
| --- | --- | --- |
| [42279718407, November 6](https://github.com/utahbug/UtahBills/actions/runs/42279718407) | Calendar, catalog, observations, bounded text, historical archive steps successful | Required checks and Pages successful |
| [42397856510, November 7](https://github.com/utahbug/UtahBills/actions/runs/42397856510) | All five acquisition steps successful | Browser installation failed; tests/publication skipped |
| [42507465429, November 8](https://github.com/utahbug/UtahBills/actions/runs/42507465429) | 97 Calendar events/eight months; catalog 282/282 verified requests, zero introduced; observations 282 matched/no missing; text success with zero documents attempted; 5,672 cached historical vote sources, zero retrieved | Functional tests failed; snapshot preservation and publication skipped |

No newer schedule was found. Successful zero-document/cached steps are not new text/vote coverage. The accepted current snapshot instead comes from manual run 42531024937 on November 8; its later partial 283 observed/282 status-verified reconciliation is distinct from the earlier schedule's 282/282. No manual refresh was initiated. Synthetic validation-fixture failures in logs are not real acquisition failures.

## Search accounts

Saved November 9 release evidence records 283 eligible sitemap URLs (homepage plus 282 verified requests), excludes unconfirmed YPQWEJNNQR, and reports successful ordinary/Googlebot/Bingbot probes. The Google verification tag is preserved. This establishes eligibility/access, not ownership or indexing. Google/Bing ownership, submission history, sitemap last-read/status and actual indexed URLs remain unverified. Owner should inspect the exact HTTPS production property in Google Search Console and Bing Webmaster Tools, inspect existing sitemap status/history and a representative homepage/request URL, and report outcomes. No account changes or resubmissions were made. Preserve GitHub noindex and existing production qualifications.

## Preserved production

Runtime `41e6c63e8d2d328178aa50df645557be7e99add1`; deployment `e89d8426-df1e-422a-9ae7-890570279788`; content SHA-256 `a496d85fd5635a3bfa868ca9c8023123e77bb5ad54a551de5980a95db5a28bf4`. Rollback deployment `9cd53e01-15f6-43b1-8185-b48f9522348a`, runtime `8af6ca7d990d0b6dec156561aa89ce0140a36e15`, checksum `285232f20c53011cc0255b50021300c091da28aec9db79641778c985cad5d504`. Both successful deployments were re-read; immutable packages are untouched. [Permanent release receipt](evidence/NOV9_PUBLIC_RELEASE.json).

## Verification and outstanding gates

`tests/review-party.mjs` adds exact identity/session/unavailable checks, all native column combinations, default and existing preference behavior, restore/reload, blocked storage/evidence fetch, Chromium/WebKit, keyboard, narrow/enlarged layouts, accessibility, Main absence and label preservation. Python evidence tests reject altered source hashes or member identity fields. Existing assertions and full mandatory suite remain.

Local Party evidence and Chromium/WebKit browser tests passed, including Party-enabled iPhone coordinate taps and independent count links. The retained Main Phase 7B follow-up suite passed. Phone/desktop Light/Dark screenshots were inspected. [PR #33](https://github.com/utahbug/UtahBills/pull/33) holds the implementation; the broader retained row matrix and mandatory CI/publication remain separate gates. Physical iPhone/iPad, VoiceOver, native clipboard, visual owner acceptance and independent editorial acceptance remain pending. Party promotion and analytics changes need separate explicit owner approval. [Analytics audit and proposed solution](CLOUDFLARE_ANALYTICS_AUDIT.md).


Local verification found and corrected a Review Columns popover overflow under WebKit 200% CSS zoom: its native rect/offset scale omitted zoom. The Review panel now explicitly accounts for root zoom. Review header/banner ResizeObserver measurements are deferred one frame to prevent WebKit feedback warnings during enlargement; Main and frozen production observers are untouched. The browser test waits for the native popover layout event before checking unchanged bounds. No original assertion was weakened.

Main comparison against the live GitHub site: app.js, styles.css, catalog-ui.json and calendar-ui.json matched byte-for-byte. index.html matched after CRLF-to-LF normalization, consistent with Windows checkout versus Linux CI; source index.html is unchanged. The complete build packaged 9,337 shared snapshot files and preserved Main during packaging. Production files were not built or modified.

Complete artifact verification rechecked every one of the 9,337 Main manifest files and all shared Review files. Both preserved production and rollback packages passed their complete manifest/file checksums again. The November 8 failed schedule retains its unexpired refresh-attempt artifact; no failed-run snapshot was promoted.

Owner added the final domain decision during this batch. RELEASE-003 is complete after [actual redirect/canonical verification](DOMAIN_REDIRECT_VERIFICATION.md). The owner configured the rule; this agent performed only read-only tests/documentation, with no separate deployment or account change.


Regression diagnostics: a retained WebKit 1180px/dark count-link case timed out while multiple local suites were running. The exact unchanged case passed in isolation; no assertion or application navigation was changed for that result. Final CI must still exercise the complete matrix. The new accessibility test resets zoom, returns to the page top and waits for layout before auditing; this avoids measuring a transient partially clipped link during viewport restoration. Both open and closed Columns panels remain subject to the full axe checks.

Final commit, mandatory CI and hosted Review evidence are recorded in the [PR #33 publication receipt](https://github.com/utahbug/UtahBills/pull/33). Consult that receipt before treating the implementation as published; local verification alone is not publication.


### Post-merge CI correction

Inherited push run [42669967054](https://github.com/utahbug/UtahBills/actions/runs/42669967054) completed successfully. PR #33 merged at `60075015f35bbf223439cf3a9ee24844af920f39`. Its push run [42675668946](https://github.com/utahbug/UtahBills/actions/runs/42675668946) stopped at the retained typography assertion before publication: unchecked Party cells were hidden visually but still changed row textContent. The correction creates Party headings/cells only when enabled for 2026 and removes them when disabled. The original typography assertion remains unchanged; the new Party suite additionally verifies zero disabled Party elements and exact original row text after Restore defaults. This is a Review-only rendering fix, with no data, native preferences or production change. Final CI and publication evidence is recorded in the linked PR receipt; failed CI is not a published or accepted release.


The focused correction passed the unchanged complete `review-artifact.mjs` and `review-typography.mjs` checks locally, followed by the full Party/labels suite in Chromium and WebKit (including the added default DOM/Restore checks). `scripts/analyze.py --check` and whitespace checks passed. This local result does not substitute for mandatory post-merge CI or live Review verification.


### Linux WebKit resize gate

Both attempts of [42681875116](https://github.com/utahbug/UtahBills/actions/runs/42681875116) passed the retained artifact/typography checks and Chromium Party suite, then failed the unchanged zero-browser-errors assertion with a WebKit ResizeObserver notification. Four instrumented local WebKit runs passed. A separate [diagnostic run 42687594426](https://github.com/utahbug/UtahBills/actions/runs/42687594426) used `refresh_data=false`, retained all checks and explicitly disabled publication. Its trace located the error at the initial 1280-to-320px desktop viewport transition, before text/zoom enlargement, while the shared header observer changed wrapping state.

The focused Review-only CSS correction fixes narrow desktop header top padding at the wrapped value (8px), so toggling `navigation-wrapped` no longer changes the height being measured. Phone rules, Main assets and frozen production remain unchanged. Test errors now include the active viewport/theme/enlargement phase; no error is suppressed and no assertion or mandatory workflow check is removed. Final Linux CI and live publication remain required; see the PR receipts linked from PR #33 for the final outcome.


The stable-padding correction passed the unchanged complete artifact and typography suites locally, then the complete Chromium/WebKit Party suite. Source/documentation analysis and whitespace checks passed. These results supplement, not replace, the pending full Linux CI gate.
