# RELEASE-003 — Final domain and redirect verification

Owner decision and verification: November 9, 2026 (America/Denver). **Complete.**

Primary/canonical website: **https://legislation.utahbug.com/**. Publicity, social media and tester short address: **https://bills.utahbug.com/**. The owner configured a permanent Cloudflare Redirect Rule (301) from the short hostname to the primary hostname, preserving paths and queries. This task verified it read-only; no DNS, Cloudflare setting or deployment was changed by the agent for this update.

## Actual HTTP results

| Request at bills.utahbug.com | Status | Location |
| --- | --- | --- |
| `/` | 301 | `https://legislation.utahbug.com/` |
| `/?utm_source=redirect-check&test=one%20two` | 301 | Exact same path/query on primary hostname |
| `/requests/2027/YPQWEJNNQR/?test=path` | 301 | Exact same path/query on primary hostname |
| `/robots.txt` | 301 | `https://legislation.utahbug.com/robots.txt` |
| `/requests/2027/LEBLQCNWET/?test=direct` | 301 | Exact same path/query on primary hostname; target returned 200 |

The verified direct request is Multicounty Appraisal Trust Amendments. Its canonical excludes the test query and remains `https://legislation.utahbug.com/requests/2027/LEBLQCNWET/`. The unconfirmed YPQWEJNNQR path check does not alter its noindex qualification.

## Fragments and actual navigation

Fragments are handled by the browser, not sent in the HTTP request. Chromium and WebKit both preserved the fragment through the actual 301 for `/#request/YPQWEJNNQR`, `/?test=hash#calendar`, and `/requests/2027/YPQWEJNNQR/?test=direct#details`. Destination responses were locally intercepted in this initial fragment-preservation check; the network redirect itself was real.

A second bounded check loaded the actual production app via the short hostname in both browsers, blocking the analytics script/collection endpoints before navigation. `/#calendar` arrived at `https://legislation.utahbug.com/#calendar` and rendered Legislative Calendar. `/#request/LEBLQCNWET` arrived at the canonical host with the exact hash and rendered Multicounty Appraisal Trust Amendments. This verifies application navigation as well as URL preservation. No analytics submissions were allowed; ordinary edge requests still occurred.

## Canonical/indexing preservation

Live homepage canonical and Open Graph URL both identify `https://legislation.utahbug.com/`. All 283 live sitemap locations use that hostname. The direct static request canonical also uses it. No metadata/sitemap files were changed and no search-console submission was made. Ownership, sitemap processing and engine inclusion remain separate owner-account checks.

The owner-configured short-host redirect supersedes earlier notes describing bills.utahbug.com as a separately served restricted alias. Keep the short address available for sharing, while metadata, sitemap, search registration and primary website references remain canonical. The pages.dev restriction and GitHub Main/Review noindex policies are unchanged by this decision. A 301 may be cached by browsers; future redirects require separate owner decisions.

The November 9 application runtime `41e6c63e8d2d328178aa50df645557be7e99add1`, deployment `e89d8426-df1e-422a-9ae7-890570279788`, approved content checksum and immediate rollback remain as recorded in [the release receipt](evidence/NOV9_PUBLIC_RELEASE.json). This documentation update does not trigger a separate website release. The already-authorized Review Party PR remains a separate development/publication scope.
