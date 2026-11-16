# November 13 release-readiness review

Verified November 9, 2026, after CI and publication completed. This assesses the proposed November 13 release; it does not claim November 13 source freshness or authorize a new deployment. No feature development, acquisition, DNS/configuration/tracking change, data promotion or production deployment was performed in this review.

[Machine-readable live verification](evidence/NOV13_READINESS_REVIEW.json).

## Verified state

| Item | Implemented | Tested | Published | Owner accepted |
| --- | --- | --- | --- | --- |
| Existing production interface and typography | Yes | Prior full CI/live checks; identities/data rechecked | Cloudflare November 9 release | Existing authorized release; physical accessibility limitations remain |
| Optional Party (2026), default off | Review only | Full Linux CI, Chromium/WebKit, keyboard, text/zoom, axe, preferences and live iPhone-style checks | GitHub Review | Not yet accepted/promoted to production |
| Redundant secondary Request suppression | Review only; meaningful suffixes/data preserved | Full regression suite and live checks | GitHub Review | Not yet accepted/promoted to production |
| Header resize/menu overflow/navigation corrections | Review only where applicable | Full retained suite passed, including WebKit row/count links, touch/Back/Forward, columns, enlargement and axe | GitHub Review | Physical iPhone/iPad and VoiceOver pending |
| ANALYTICS-001 | Audit/proposal only | Controlled network probes; dashboard/account totals not accessible | Documentation only; existing beacon unchanged | Implementation/configuration not authorized |
| RELEASE-003 | Owner configured 301 | HTTP paths/queries, browser fragment inheritance and actual routes verified | Existing owner redirect active | Final domain decision accepted; complete |

PR #33 merged at `60075015f35bbf223439cf3a9ee24844af920f39`. Its original run failed and must not be described as passing. Follow-ups #34/#35 resolved the default DOM-content and Linux WebKit header-resize failures. Final runtime `36be68dde16e6a810ae9a51314d4e26a3095b748` passed [full CI and Main/Review publication, run 42689731784](https://github.com/utahbug/UtahBills/actions/runs/42689731784). No original assertion or normal workflow step was weakened. The earlier isolated navigation timeout is superseded by the complete passing Linux matrix. This establishes the tested scope, not universal accessibility certification.

[Main](https://utahbug.github.io/UtahBills/) and [Review](https://utahbug.github.io/UtahBills/review/#legislators) remain noindex, nofollow. Live checks repeated for this review confirmed default-off Party, persistence, 100 verified affiliations/four unavailable cases, 2027 restrictions, narrow iPhone-style behavior and Request-label suppression. Main's checked application/styles/catalog/Calendar bytes are unchanged. The complete artifact validated 9,337 unchanged Main files and identical shared Review assets/data. Production's existing typography is preserved; lighter Review typography is not approved for promotion.

Party uses the saved official 2026 roster (retrieved October 21), with exact ID/name/chamber/district/session matching. Jefferson S. Burton, Tyler Clancy, Matthew H. Gwynn and Trevor Lee remain Unavailable because direct IDs are absent. This is a roster snapshot, not affiliation history for every vote. No 2027 roster/party assertion is made. [Source and regression record](NOV9_REVIEW_PARTY_READINESS.md).

## Legislative data and freshness

The accepted snapshot contains **282 status-verified public requests plus one qualified source observation** (`YPQWEJNNQR`), **zero verified introduced 2027 bills**, and **97 Calendar events**, covering October 2026 through May 2027. Requests were checked `2026-11-08T22:36:06.519370+00:00`; Calendar `2026-11-08T22:36:05.440534+00:00`; catalog assembly `2026-11-08T22:36:08.093288+00:00`. Production data matches the approved package. These counts describe that snapshot, not independently verified current legislative totals on November 13.

| Genuine schedule | Collection | Testing/publication |
| --- | --- | --- |
| November 8, [42507465429](https://github.com/utahbug/UtahBills/actions/runs/42507465429) | Calendar, catalog, observations, bounded text and historical votes all succeeded | Functional checks failed; tested-snapshot preservation/publication skipped |
| November 7, [42397856510](https://github.com/utahbug/UtahBills/actions/runs/42397856510) | All five components succeeded | Browser installation failed; tests/preservation/publication skipped |
| November 6, [42279718407](https://github.com/utahbug/UtahBills/actions/runs/42279718407) | All five components succeeded | Tests, preservation and Pages publication succeeded |

No newer genuine schedule was found. The accepted November 8 snapshot came from later manual run 42531024937, not the failed earlier schedule. The successful November 9 push CI did not acquire data. The earlier diagnostic dispatch also disabled acquisition and publication. Successful bounded-text/cached-vote steps do not imply new documents: the November 8 schedule attempted zero text documents and retrieved zero new votes. Historical audit retains five unverified vote details and 1,046 unresolved individual entries; document links are not a complete offline text archive.

No verified new delta requiring production publication was identified. Recheck normal scheduled results and compare verified requests, introduced bills, Calendar/agenda changes and source qualifications near November 13. If a delta exists, it needs normal guards, full CI, exact package review and separate owner authorization before Cloudflare promotion. Do not refresh merely for a green badge, infer missing sources, or equate collection success with publication. If retaining the existing snapshot, retain visible dates and explicitly accept the freshness limitation; do not advertise automatic daily freshness while the scheduled publication path remains unproven.

## Analytics and owner settings

Automatic Pages injection remains confirmed; the application does not own the present beacon loader. Current official [Pages instructions](https://developers.cloudflare.com/pages/how-to/web-analytics/) and [dimensions](https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/) were rechecked.

The simplest immediate estimate is a trend of non-bot beacon traffic, not an exact count of people. Owner: **Cloudflare Web Analytics → the site's analytics → date range → Host = legislation.utahbug.com → Exclude Bots = Yes**. Review external Referer host and device/browser categories as context, not personal identity. These filters cannot reliably identify the owner's PC/iPhone or Codex visits, and cannot retroactively remove them accurately. Our access does not establish the owner's actual dashboard settings or totals.

Run routine automated tests locally or on Review. For necessary production tests, block the beacon and collection endpoints context-wide before navigation; controlled beacon audits may load the script while intercepting all submissions. A device content blocker is an interim owner-managed option only after PC/iPhone verification. Do not assume localStorage controls automatic injection, or that IP/browser filters identify one person.

For dependable application-owned opt-out, separately authorize the existing manual-loader proposal. Owner must inspect **Workers & Pages → utahbills → Metrics → Web Analytics** and the site's **Web Analytics → Manage site → Advanced options/rules**, then disable every automatic injection path as part of the approved migration. Do not disable it now without an approved replacement/release plan. Verify removal before relying on a device-local boolean that gates one manual beacon on all production entry pages. Set opt-out separately on each PC browser/profile and iPhone browser; clearing storage/private browsing requires renewed choice. Validate zero submissions when opted out and one beacon when opted in, with bounded owner-dashboard receipt checks. No visitor identifiers, cookies, fingerprinting, new service or secret credentials are needed. No added recurring analytics service fee is proposed; maintenance and real-device validation remain work. [Detailed proposal and limitations](CLOUDFLARE_ANALYTICS_AUDIT.md).

A new bounded probe visited Legislators, Recent Activity, Calendar and Bills in both browsers with all analytics collection intercepted. All routes rendered correctly. Chromium attempted five pageviews including the initial load; WebKit attempted two. Reported pageview locations were the root URL without section hashes. **Distinct internal section usage is not reliably measurable with the current installation.** Some navigation contributes aggregate events, but these are not reliable per-section or click totals. Cloudflare's [SPA mechanisms](https://developers.cloudflare.com/web-analytics/get-started/web-analytics-spa/) do not establish that this hash router has distinct reportable paths. Route-level measurement is future work, not a November 13 requirement.

## Domains and indexing

RELEASE-003 is documented and complete. `https://legislation.utahbug.com/` remains primary/canonical; `https://bills.utahbug.com/` remains the permanent publicity/tester shortcut. Repeated HTTP checks returned 301 with paths and queries intact; Chromium/WebKit preserved the Calendar hash through the real redirect. Existing direct-request/hash checks are also retained in [the domain record](DOMAIN_REDIRECT_VERIFICATION.md).

Live sitemap contains 283 canonical production URLs; the unconfirmed observation is excluded/noindex. robots.txt allows crawling and advertises the canonical sitemap. Current bounded ordinary/Googlebot/Bingbot probes of the homepage and a verified request returned 200, matching canonicals and no noindex header/meta. This supplements the saved all-eligible-URL audit; spoofed crawler user agents do not prove actual engine crawling or indexing. GitHub remains noindex. Owner must inspect the exact HTTPS property in Google Search Console and Bing Webmaster Tools: ownership, existing sitemap submission/last read/status, indexing/exclusion reasons and representative URL inspections. No account changes or sitemap resubmissions were made.

## Exact identities and rollback

| Environment | Runtime commit | Deployment |
| --- | --- | --- |
| GitHub Main/Review | `36be68dde16e6a810ae9a51314d4e26a3095b748` | Actions `42689731784`, build/deploy success |
| Cloudflare production | `41e6c63e8d2d328178aa50df645557be7e99add1` | `e89d8426-df1e-422a-9ae7-890570279788` |
| Immediate rollback | `8af6ca7d990d0b6dec156561aa89ce0140a36e15` | `9cd53e01-15f6-43b1-8185-b48f9522348a` |

Approved production package: `release-candidates/approved-ui-public-41e6c63e8d2d328178aa50df645557be7e99add1`; content SHA-256 `a496d85fd5635a3bfa868ca9c8023123e77bb5ad54a551de5980a95db5a28bf4`.

Rollback package: `release-candidates/approved-production-8af6ca7d990d0b6dec156561aa89ce0140a36e15`; content SHA-256 `285232f20c53011cc0255b50021300c091da28aec9db79641778c985cad5d504`. All 9,625 files in each immutable package, the aggregate manifest checksums and deployment success/retention were rechecked; rollback was not executed. Production application/styles/data matched through browser-origin requests. A direct Python data GET returned 403; the working browser path returned 200, without any security/configuration change. [Original release receipt](evidence/NOV9_PUBLIC_RELEASE.json).

## Recommendation and prioritized gates

**Recommended November 13 scope:** retain the already-approved production interface and typography. Consider only owner-accepted Party/label changes and independently verified data deltas in a separately approved package. Do not wholesale-promote Review, add analytics migration or infer a 2027 roster. If owner acceptance is incomplete, keep the two additions in Review and use the existing live release.

| Priority | Outstanding work / decision |
| --- | --- |
| **Must fix before release** | Before any new package: explicitly approve exact UI/data scope and deployment; inspect near-release source freshness and scheduled end-to-end outcomes. Resolve remaining failed schedule behavior before claiming reliable automatic daily publication, or explicitly retain a dated snapshot without that claim. |
| **Must fix before release** | Before promoting new UI: physical Safari/iPhone (and relevant iPad), VoiceOver, keyboard and real clipboard acceptance for default/toggled columns, counts, repeated row taps/Back, menu bounds, enlarged text and labels. Any blocking defect prevents that feature's promotion. Automated emulation is not physical acceptance. |
| **Recommended** | Owner checks Google/Bing properties/sitemap/indexing and Cloudflare Host/bot/date filters; continue test-side analytics blocking. Verify an owner-device blocker if using it as an interim exclusion. |
| **Can wait** | Manual analytics opt-out migration, reliable section-level analytics, Party sorting, further historical affiliation coverage and Review typography promotion. 2027 affiliation must wait for authoritative evidence, not a deadline. |

No known unresolved automated UI regression remains in the tested final runtime. Scheduled acquisition-to-publication health and physical/owner acceptance remain distinct operational/release limitations. This review approves no production action.
