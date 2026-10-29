# Search, AI and analytics activation checklist

No indexing request, sitemap submission, analytics beacon or advertising was activated in Phase 7C. Main, Review and the local production candidate retain noindex,nofollow. Account-specific Cloudflare settings were not accessible and remain owner checks.

## Current audit and smallest next step

The interactive application retains hash routes and a JavaScript shell. Hash URLs and dynamic titles are not distinct crawlable documents. Phase 7G adds production-package-only static HTML at `/requests/2027/<exact tracking ID>/` and, when actual verified saved records exist, `/bills/2027/<bill number>/`. Each has a self-canonical, exact title, qualified status/action, recorded sponsor ID, retrieval dates, official references and an exact interactive link. The sitemap lists only generated documents; no fragment URLs or invented bills. The 2026 archive and legislator static pages are deferred. No social image, structured-data claims or indexing guarantees are added.

Production homepage title/description/Open Graph metadata identify UtahBug as independent and nonpartisan, covering Utah legislation, requests, legislators and activity without claiming live or complete coverage. Main/Review metadata and application behavior remain unchanged. All candidate HTML retains noindex,nofollow and the existing wildcard X-Robots-Tag applies to new paths. No robots blocking, account verification or sitemap submission occurs. See [Phase 7G verification](PHASE7G_SEARCH_VERIFICATION.md).

### Owner verification steps, only after separate authorization

1. Sign in to the owner's Google Search Console account and add the URL-prefix property `https://legislation.utahbug.com/`. Prefer the provided HTML meta verification token in a reviewed production package; keep it present after verification. A Domain property requires DNS verification and therefore separate DNS authorization. No token is invented or installed now. See [Google ownership verification](https://support.google.com/webmasters/answer/9008080?hl=en).
2. Add the exact site in Bing Webmaster Tools and use its owner-issued HTML meta token or XML-file method in a reviewed package. Revisit the packaging allowlist explicitly for any verification file. Importing Search Console can also import sitemaps, so do not import as a workaround before submission approval. See [Bing verification](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b).
3. Following explicit indexing approval, deploy the separately reviewed production-only removal of meta/header noindex; leave GitHub Main/Review restricted. Check real responses, canonical URLs and crawler access. Then submit the verified production `/sitemap.xml` in each owner's console and monitor fetched pages and errors. Verification alone does not guarantee indexing. No submission or request-indexing action is authorized by Phase 7G.

## Explicit public-launch gate

- [ ] Owner approves official public release separately from unindexed prelaunch; RELEASE-001–004 and UI-001 acceptance is recorded honestly.
- [ ] Resolve or explicitly accept data/operational limitations, establish a monitored frozen-code data process, verify independent editorial and physical-device/accessibility review.
- [ ] Verify production titles/descriptions/canonicals and chosen static record URLs, response status and source provenance. Confirm social previews in actual receiving applications.
- [ ] Inspect owner account WAF, bot protection, managed robots and AI crawler settings. Allow intended Google/Bing and selected AI crawler access deliberately; no blanket bypass of security protections. Public HTTP access does not prove crawler access.
- [ ] Only after explicit indexing authorization remove noindex from production HTML and response headers. Keep development Main/Review restrictions. Do not use robots.txt blocking as a substitute for noindex: crawlers need access to observe directives.
- [ ] Validate sitemap containing genuine non-fragment public URLs; verify Google Search Console/Bing Webmaster ownership through the owner and submit only then. No claim of guaranteed ranking or AI citation.

[Cloudflare AI Crawl Control](https://developers.cloudflare.com/ai-crawl-control/) describes recognized crawler monitoring and controls. [WAF interaction](https://developers.cloudflare.com/ai-crawl-control/configuration/ai-crawl-control-with-waf/) means upstream rules can block requests before this view; inspect actual account capabilities and logs before conclusions.

## Privacy-conscious measurement, after separate activation approval

Prefer Cloudflare Web Analytics for the production hostname. The owner can add the domain in Web Analytics, review current privacy settings and install the provided beacon or the existing Pages integration once (avoid duplicate injection). Keep development environments excluded. Do not add advertising, visitor accounts or personal identifiers to URLs/events. Document the active measurement in the site's privacy disclosure before activation.

In Web Analytics, select the production hostname/date range and review visits/pageviews, country, device/browser/OS and referring hosts. Filter referrers for observed Google/Bing and identifiable AI services, rather than labeling all direct traffic as search or AI. Missing/refused referrers, copied links, privacy protections and in-app browsers limit attribution; counts are not unique people. See [available dimensions](https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/).

Verify a pageview after navigation/reload/back/forward on the actual hash-based app. [SPA collection behavior](https://developers.cloudflare.com/web-analytics/get-started/web-analytics-spa/) depends on browser navigation APIs; do not assume every hash change produces a distinct record view. Check Safari as well as Chromium before using route-level reports.

Keep human-oriented analytics separate from known automated crawler activity. Where available, use bot exclusion for visitor trends and AI Crawl Control for recognized self-identifying crawlers. Unknown/spoofed bots and account/plan visibility limit completeness; crawler requests are not human referrals or proof of AI citations. Do not merge the two totals.

Launch remains advertising-free. Future advertising would require a separate owner decision, privacy/consent and accessibility/performance review; no ad slots, scripts or readiness tracking are implemented.
