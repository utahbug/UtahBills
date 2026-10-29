# Phase 7C readiness — October 28, 2026

This is an unindexed prelaunch assessment, not public-release acceptance. Main and Review remain one GitHub Pages artifact; Review typography is not promoted. Cloudflare remains unchanged. The owner clarified: omit Morse; retain KSR and provenance.

| Area | Assessment | Evidence / remaining gate |
| --- | --- | --- |
| Historical-title identity and root packaging | Passed focused checks; mandatory CI required | `tests/release-preparation.mjs`, `tests/historical_titles.py`, `tests/phase7c.mjs`; final CI run is recorded in delivery |
| Existing navigation, search, sorting, bookmarks, Copy/CSV, Calendar and directory | Retained mandatory regression suite | Previous accepted CI 40796971230; current full CI required before publication |
| Physical iPhone, native zoom and assistive technology | Needs owner acceptance | UI-001; automated clipboard/axe checks do not establish Notes/Safari/VoiceOver/NVDA acceptance |
| Editorial and official public release | Needs owner acceptance | RELEASE-001 through RELEASE-004 remain human gates |
| Calendar refresh health | Blocked operational acceptance | Scheduled run 40744457953 retained prior data after lost numbered-bill links; successful deployment is not successful acquisition |
| 2027 membership / first introduction | Blocked on official evidence | SESSION-002/003; no inferred membership or invented introductions |
| Cloudflare publication | Needs explicit owner approval | Local production-only candidate, no upload; see deployment procedure |
| Automatic production refresh | Deferred / operational limitation | No updater activated; approved code must remain frozen |
| Per-record search indexing | Not ready | Hash fragments are not independently indexable pages; indexing remains disabled |

## RELEASE-002 dated saved-source assessment

Actual scheduled run [40744457953](https://github.com/utahbug/UtahBills/actions/runs/40744457953), started 2026-10-28T18:22:10Z at 419633e712153442c99a11f7e7c3f0fcbba7022f: build, tests and Pages deployment succeeded; refresh-health failed. Calendar rejected `Lost numbered bill links: manual review required`, retaining checkedAt 2026-10-26T18:44:06.684759+00:00. This requires investigation before operational release acceptance; safeguards were not relaxed.

Catalog refresh at 2026-10-28T18:22:41.364596+00:00 was partial: 276 official requests, 275 reconciled verified requests; YXDVILQHGE withheld from verified status because its matching status was missing, separately disclosed as source-observed. Request source retrieved 18:22:41.982759Z; status source 18:22:42.417193Z. Saved introduced coverage: 1,016 measures for 2026 and zero for 2027. Text refresh attempted zero records: that does not verify a first introduction. Archive refresh reported 5,672 expected/retrieved sources with none unavailable, including cached historical evidence rather than fresh downloads of every source.

Saved 2027 Activity contains 29 observations; historical Activity contains 41,234 events from 37,214 actions. Vote evidence covers 5,672 sources, 5,667 reconciled and 115,130 entries, with five official tally conflicts and 1,046 unresolved Walter N entries retained. The 104-member authoritative 2026 roster does not establish 2027 membership. Dates and warnings remain visible in the application. No new manual acquisition was triggered for this assessment. Historical TEST-001 completion under Phase 6A remains valid; it does not erase this newer refresh failure.

## Search and ownership

Previous request titles are searchable only through the preserved exact tracking-ID history and official-source provenance. Actual examples include Child Sexual Abuse Penalty Amendments → Capital Felony Amendments (PVKQFINLWR), Real Property in Divorce → Child Support Amendments (LJHSKLUION), Train Length Study → Railroad Amendments (VJCRETIYVY), and the preserved Judicial Performance title change (ECMJQIXCHM). Current titles remain displayed/copied; results are not duplicated. Title history is not a claim that bill text was amended.

Introduced measure history now projects verified archived titles only after exact session and bill identity checks. Current bill-version metadata does not publish version-specific titles, and current measureHistory has no archived title entries; no aliases are invented. Fixture tests exercise both verified and wrong-session history. Common HB10/HB 10/H.B. 10/H. B. 10/HB0010 forms retain exact identity matching.

K,S,R outside editable fields opens a nonprivileged attribution dialog. About provides a visible alternative and an off switch for the character shortcut. Escape/Close restores focus. Morse is omitted. No signing mechanism is configured: checksums and Git/CI evidence are unsigned provenance, not cryptographic authorship proof.

## Limitations and deferred work

Physical-device, manual screen-reader, independent editorial, actual mailbox send/receipt, Cloudflare account/bot settings, and production refresh operations remain unverified. UI-019 technical-source target-spacing review remains open. Advanced tracking/notifications, advertising, automatic production uploads, and a larger route migration are deferred. Contact continues to target contact@utahbug.com with its existing subject. No data discrepancies, source dates, safeguards or acquisition logic were changed.

See [Cloudflare preparation](CLOUDFLARE_PRELAUNCH.md) and [discoverability/analytics checklist](SEARCH_ANALYTICS_LAUNCH_CHECKLIST.md). Obtain exact implementation commit with `git log -1 --format=%H -- docs/PHASE7C_READINESS.md`; final CI, live verification and candidate hashes accompany delivery rather than self-referential committed hashes.

Focused local evidence: production root browser check passed for four real former-title records, Copy/CSV/bookmarks/history, synthetic exact-number formats, core routes, Contact/district references, and KSR at 320/390/1280/1920 in Light/Dark with axe. Package tests passed deterministic checksums, original response bytes and tamper/extra-file rejection. Combined-artifact verification passed 9,330 Main files and identical Review data with isolated typography. Final candidate adds headers/release metadata and excludes one .gitkeep, yielding 9,331 deployed files. Retained search/bookmark/sorting and mandatory CI outcomes are reported with delivery.
