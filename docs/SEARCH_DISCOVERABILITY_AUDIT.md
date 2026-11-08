# Production search discoverability audit

Read-only audit, November 5, 2026 (America/Denver). No metadata, data, indexing permission, sitemap submission or production change was made. All recommendations require owner approval.

## Existing production output

- Static homepage title: **UtahBug · Independent Utah legislation information**.
- After JavaScript loads the current Bills route, title: **Bills · UtahBug**.
- Description: **Explore Utah legislation, bills, public bill requests, legislators and legislative activity with saved official sources. Independent and nonpartisan; coverage and source dates are disclosed.**
- Canonical: `https://legislation.utahbug.com/`.
- Rendered H1: **Find a bill. Understand its impact.** The following H2 identifies **2027 Legislative Records**. The static homepage has no H1/H2; its no-JavaScript fallback provides the saved date and 275 verified request links.
- Independence and nonpartisanship are visible in the header and disclaimer. The tracker function is apparent from the application but is not named naturally in the static title or main heading. The static description omits 2027.
- Approved X/Open Graph title remains **UtahBug · Utah Legislation**, description **2027 Utah bill tracking**, with the approved square `social-capitol-2027-v2.png`. Search-title changes do not require changing those previously approved social fields.

Example [School Bus Route Safety](https://legislation.utahbug.com/requests/2027/DWEIOJKDXT/) has title **School Bus Route Safety — DWEIOJKDXT · UtahBug** and description **2027 public bill request DWEIOJKDXT: School Bus Route Safety. In Process. Saved official-source evidence and sponsor information.** Its H1 is the complete official title and H2 is **Saved source evidence**. Static content includes sponsor ID, saved status, request/source timestamps, source links, no-introduced-number qualification and a working application link. It is readable without JavaScript.

The archive route has title/H1 **2026 Legislative Archive · UtahBug** / **2026 Legislative Archive**, a **HISTORICAL · 2026** label and historical result labels. Its hash route shares the homepage canonical and general meta description. It is visibly distinct from 2027, but is not a separate static archive landing URL in the production sitemap. Do not label archive bills as 2027 or add speculative static pages.

## Access and indexing safeguards observed

All **276** advertised sitemap URLs (homepage and 275 verified 2027 requests) returned HTTP 200, had exact self-canonicals, lacked HTML/header noindex, and matched the preserved approved package byte-for-byte. There are zero introduced 2027 pages in this accepted snapshot. [Clean Air Fund](https://legislation.utahbug.com/requests/2027/YXDVILQHGE/) remains explicitly unconfirmed, excluded from the sitemap and `noindex, nofollow`.

`robots.txt` permits `/` and advertises the HTTPS production sitemap. The owner-supplied Google verification tag is present unchanged. Ordinary, Googlebot and Bingbot user-agent probes returned 200 on the homepage; Googlebot/Bingbot also returned 200 for the sampled record, robots file and sitemap. The raw catalog response retains `X-Robots-Tag: noindex`. Main and Review returned 200 with static `noindex, nofollow`.

Python's default `Python-urllib/3.11` user agent received 403, reproduced with Node using that user agent. This is a client-specific access limitation, not evidence that verified Google/Bing crawlers are blocked. User-agent probes do not prove genuine engine access. Google/Bing ownership, submissions, crawl history and indexing remain unconfirmed without account evidence. No settings were changed to overcome the 403.

## Minimal recommendations

1. Use the owner's proposed homepage title: **Utah Bill Tracker | 2027 Legislation & Bill Requests | UtahBug**. Keep the initial HTML and default route's JavaScript title consistent. Otherwise the application immediately replaces the descriptive title.
2. Suggested description: **Independent Utah legislative tracker for 2027 bill requests and legislation, with saved official sources, sponsor information and clearly disclosed coverage dates.** It naturally covers tracker/tracking intent without repeating every query or implying live updates, introduced bills or complete coverage.
3. Add a short static, visible description of the service and a descriptive main heading, such as **Independent Utah bill tracking for 2027**. Preserve compactness, current request-versus-bill distinctions and saved-source dating. Avoid a large promotional block.
4. Existing request metadata is useful and accurate. Optional title format: **[Official title] — 2027 Utah Bill Request | UtahBug**. Keep the exact tracking ID visible in the page and description. Optional description improvement: **Saved status: [verified status]**, so a snippet does not sound like a live status claim. Preserve full official titles, unresolved-status restrictions and exact canonicals.
5. Keep the archive's explicit 2026 labels. No archive URL or sitemap expansion is needed for this minimal metadata proposal.

Google recommends descriptive, concise titles and may generate title links from headings and other page content. Snippets can be generated from page text rather than the supplied description. These changes improve clarity and relevance, but cannot guarantee ranking for any target query, crawling or indexing. [Title guidance](https://developers.google.com/search/docs/appearance/title-link) · [Description guidance](https://developers.google.com/search/docs/appearance/snippet).

See [production indexing instructions](PUBLIC_SEARCH_INDEXING.md) and [permanent handoff](PROJECT_HANDOFF.md) for the accepted release, rollback and account gates. No implementation is authorized by this audit.
