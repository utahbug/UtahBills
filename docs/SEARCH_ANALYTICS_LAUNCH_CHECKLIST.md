# Search, AI and analytics activation checklist

No indexing request, sitemap submission, analytics beacon or advertising was activated in Phase 7C. Main, Review and the local production candidate retain noindex,nofollow. Account-specific Cloudflare settings were not accessible and remain owner checks.

## Current audit and smallest next step

The application supplies a static shell with title/description and JavaScript-rendered record content. Its bill, request and legislator routes are hash fragments. They work as direct browser links but are not distinct crawlable document paths; a crawler that does not execute JavaScript sees the shell, not a complete record. Dynamic browser titles do not solve that limitation. The production candidate adds a root canonical and basic Open Graph title/description/URL; it does not pretend each fragment has independent metadata. There is no per-record sitemap, social image or per-record static preview. GitHub routes remain unchanged.

Before seeking record-level discovery, the smallest reliable improvement is generated static landing documents at stable production paths keyed by exact bill/session, tracking ID or verified legislator identity. Include current title, factual summary/coverage, source attribution, self-canonical metadata and a link into the interactive application. Generate only verified records and a sitemap of these non-fragment URLs. This is a separately scoped recommendation, not a new route framework implemented here. See [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

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
