# UTAH BILLS 6 (CODEX) — starting handoff

Verified November 9, 2026 (America/Denver). This is a context transfer, not authorization for new development, acquisition or deployment. Read AGENTS.md and PROJECT_HANDOFF.md first. The current-state sections below supersede older dated pending statuses; retain the historical records as evidence.

## Project and environment identity

- Application: UtahBug / UtahBills, an independent, nonpartisan Utah legislative tracker. Repository: https://github.com/utahbug/UtahBills. Checkout: `C:\Users\kenro\Documents\UtahBills`; normal branch `main`. Do not use similarly named Utah or music repositories.
- Main: https://utahbug.github.io/UtahBills/ ; Review: https://utahbug.github.io/UtahBills/review/ . They publish as one complete GitHub Pages artifact with identical verified data. Both retain `noindex, nofollow`.
- Production: https://legislation.utahbug.com/ ; Cloudflare Pages project `utahbills`, production branch `main`, manual Direct Upload. Existing domains include `utahbills.pages.dev` and `bills.utahbug.com`; do not change domains, DNS or redirects incidentally.
- Eligible production pages are already indexable. Cloudflare alternate hostnames and unverified record pages retain scoped restrictions. Existing Cloudflare Analytics is present. No automatic Cloudflare deployment/data updater, advertising or new analytics service is authorized.

## Exact verified release

| Item | Identity |
| --- | --- |
| Runtime / last verified Main+Review release | `41e6c63e8d2d328178aa50df645557be7e99add1` |
| Mandatory source/build/browser/accessibility/package CI and Pages | [42638733187 — success](https://github.com/utahbug/UtahBills/actions/runs/42638733187) |
| Current Cloudflare production deployment | `e89d8426-df1e-422a-9ae7-890570279788` |
| Approved content SHA-256 | `a496d85fd5635a3bfa868ca9c8023123e77bb5ad54a551de5980a95db5a28bf4` |
| Accepted interface baseline | `e7d17e382cfc01c241164d54e70bfc869570d1cf`, plus approved UI-032/033/034 fixes |
| Preserved source-data commit | `98a5dec7f10f4203d099a30454e3714beff45391` |
| Immediate rollback deployment | `9cd53e01-15f6-43b1-8185-b48f9522348a` |
| Rollback runtime | `8af6ca7d990d0b6dec156561aa89ce0140a36e15` |
| Rollback content SHA-256 | `285232f20c53011cc0255b50021300c091da28aec9db79641778c985cad5d504` |

Current local package: `release-candidates/approved-ui-public-41e6c63e8d2d328178aa50df645557be7e99add1/`. Rollback: `release-candidates/approved-production-8af6ca7d990d0b6dec156561aa89ce0140a36e15/`. Both were checksum-reverified during this handoff; both deployments remain listed. Packages are outside Git: preserve the complete directories, `site/`, `release-manifest.json`, `SHA256SUMS`, delivery and verification evidence. Earlier rollback `aa8f3da8-71b6-4959-a0a7-6ae979ab0ecc` and its package remain retained.

The November 9 overlay changed only `app.js`, `styles.css`, `assets/accepted-ui.js` and `release.json`: 9,621 of 9,625 files remained identical, including data, static request pages, sitemap, indexing/security headers, social image and Google verification. The original unapproved candidate checksum is `91a131a25d0c7d55f313539b83667f999e449037b691b5672f807108fca2af01`. The older `f22fd8a09b6def52e8285fad515da9fa99b6402d` candidate was never uploaded and must not be mistaken for the current release.

[Structured release evidence](evidence/NOV9_PUBLIC_RELEASE.json) and [PR #28 final receipt](https://github.com/utahbug/UtahBills/pull/28) record the live checks. Chromium/WebKit phone portrait/landscape, tablet and desktop checks passed for row/count navigation, repeated taps, Back/Forward, search, saved filters/bookmarks/reload, Copy/CSV, Calendar/Key Dates, themes, enlargement and axe. All 283 eligible static URLs passed ordinary/Googlebot/Bingbot probes; canonical, HTTPS, Google tag, Analytics presence, source hashes, GitHub noindex and alternate-host restrictions passed. Physical-device/VoiceOver/real clipboard acceptance is not established by automation or mocked clipboard APIs.

## Commit and PR history that matters now

- PR #28: six public UI refinements, merge `e3ae0e160165f67c81e27e7ac49eacce9acfe075`.
- PR #29: deterministic Calendar fixture clock, merge `196f8c0c28cce2ecb7d2b6a1ed205b7db866c532`; application dates were not changed.
- PR #30: preserve ordinary Bills listing state on brand return-to-top, merge `3afde3dee26697edaac9f1eb608ea078c964dc34`.
- PR #31: preserve the native unavailable-record panel when saved-only filtering is inactive, merge `41e6c63e8d2d328178aa50df645557be7e99add1`.
- [PR #32](https://github.com/utahbug/UtahBills/pull/32) consolidates release evidence and this handoff, documentation only. Its original receipt commit is `0dd6b60f4cf65a64fb04447b18df9b8a1454c79b`; consult the PR for final documentation head/merge SHA. No other open PR was found at the handoff audit. PRs #6/#8 were reconciled through #24, not abandoned outstanding work.
- A documentation merge may advance Main and automatically run its existing GitHub Pages workflow. It does not change the Cloudflare runtime or trigger Cloudflare upload. Read current Actions and PR state at the next conversation; do not confuse documentation HEAD with production `release.json`.

The original `tests/batch2.mjs:60` failure was a runtime regression, not a bad data fixture: brand clicks cleared the deliberate search, returning an empty string instead of `Generated test`. Brand return-to-top now retains ordinary listing search/sort/page/bookmarks/history; explicit Bills navigation and brand returns from other/sponsor views clear restrictive scope. Later unchanged Activity/phase4v/phase4w tests exposed the native empty-state link/ID/wording loss; the final fix preserves the original panel outside saved-only mode. No original assertion or source safeguard was weakened. `tests/brand-navigation.mjs` adds focused Chromium/WebKit coverage. Failed runs 42581951654, 42583209795 and 42635675549 did not publish; final 42638733187 passed. See [diagnosis](UI_PUBLIC_REFINEMENTS.md#november-9-ci-regression-diagnosis).

## Current interface decisions

Production uses borderless icon+text desktop navigation, compact Settings (Dark/Light direct toggle, Contact, About, FAQ), scrolling branding with sticky compact toolbar, iPhone Top / compact iPad Bottom defaults and device-local reversible positioning. Standard desktop navigation has no position setting. Preserve the Phase 7F repeated-tap repair (UI-025), row/count independence, accessible focus and 44px targets.

Keep near-white surroundings, the restrained accent, approved Calendar grid/control/category/Key Dates behavior, hover/focus link underlines, and KSR wording. Current heading is **2027 Utah Bill Tracking**; retain the separate 2026 archive designation. UI-032 full-row legislators and UI-033 visible/recoverable filters are published. UI-034 includes adjacent detail Source/Bookmark controls and tooltips, bookmark labels, desktop notice alignment and Monday–Sunday list separators. Brand and native empty-state compatibility fixes are part of this release.

Main retains its other established design and original title weights; Review retains the separate lighter-typography experiment (600 versus Main/production 700). Do not promote UI-021 without explicit acceptance. Old oval-navigation/System-selector/Bottom-for-all instructions are historical, not the current production design. KSR attribution/provenance remain; Morse-code features remain deferred. Contact targets `contact@utahbug.com` with its existing subject; actual mailbox delivery/monitoring remains an owner check.

## Data, freshness and operational limitations

- 2027: **282 verified requests** (274 In Process, eight abandoned), plus **one separately qualified source-observed request `YPQWEJNNQR`**, with no verified status. Visible total can be 283; sitemap eligibility is 282 requests plus homepage. Zero introduced 2027 measures. Never invent a bill number, status, sponsor identity, request conversion or roster membership.
- Request source check: `2026-11-08T22:36:06.519370+00:00`; Calendar: **97 events**, `2026-11-08T22:36:05.440534+00:00` (November 8, 3:36 PM MST). November 9 UI publication did not advance source freshness.
- 2026: 1,016 archived measures (931 bills, 85 resolutions), 104 verified 2026 legislators, four enhanced examples/nine formatted versions; preserve vote conflicts, unresolved identities, source qualifications and historical agenda evidence. Broader coverage is not equivalent to fully verified vote details.
- Latest genuinely successful scheduled acquisition remains [November 6, 42279718407](https://github.com/utahbug/UtahBills/actions/runs/42279718407). Scheduled runs November 7 (42397856510) and November 8 (42507465429) failed. The handoff Actions query found no newer scheduled run. [November 8 guarded manual refresh 42531024937](https://github.com/utahbug/UtahBills/actions/runs/42531024937) passed and supplied the current snapshot; it is not scheduled-run evidence. TEST-001 historical acceptance remains complete; continuing reliability monitoring is still necessary.
- Inspect independent Calendar/catalog/observation/text/archive outcomes, retained failure artifacts, source reconciliation, snapshot commit and publication separately. Successful Pages CI does not imply successful acquisition. Preserve fail-closed checks, bounded partial publication, prior verified records, immutable raw sources and exact associations. Failed attempts must not advance verified timestamps.
- No automated Cloudflare data update exists. Future data approval must review source evidence, code/schema compatibility, projections, static pages/sitemap and checksums together. The zero-introduced packaging safeguard must be reviewed when real introduced bills arrive; do not bypass it to publish invented or incomplete pages.

## Architecture and release/recovery map

[README](../README.md) and [permanent handoff](PROJECT_HANDOFF.md) map the static hash-routed app. Key files: `app.js` routing/listing state; `review-bills.js` shared filter-recovery helper despite its historical name; `bookmarks.js`, `control-tooltip.js`, `calendar.js`, `discovery.js`, shared `styles.css`/`phone-navigation.css`; `review-release.*`/`review-typography.css` for isolated Review work; `production-ui/` for frozen accepted production interface. Do not copy all Review assets into production.

Build: `scripts/build.mjs`; dual packaging: `scripts/package-review.mjs`; workflow: `.github/workflows/pages.yml`; sources/raw evidence: `data/`; guarded acquisition/projection/validators: `scripts/`; browser/source fixtures: `tests/`. `npm test` is the full mandatory suite; use focused local tests for scoped edits. CI uses Ubuntu 24.04 with Chromium/WebKit and preserves all mandatory gates. Full browser CI can take over an hour; queue time is additional. Do not cancel acquisition/deployment or weaken checks to save time.

[Cloudflare procedure](CLOUDFLARE_PRELAUNCH.md), [public indexing](PUBLIC_SEARCH_INDEXING.md), [accepted release](ACCEPTED_PRODUCTION_RELEASE.md), and [November 9 record](UI_PUBLIC_REFINEMENTS.md) are authoritative with their dates. The November 9 scoped helper `scripts/package-interface-fixes.mjs` validates the original frozen baseline; do not blindly reuse it against a different production package or replay an old candidate. Review any new release scope/allowlist separately. `scripts/approve-release.mjs` creates a new immutable approved copy after exact-commit CI and recorded authorization; never relabel checksum-locked files in place. `scripts/check-indexed-release.mjs` validates packages and optional live responses. `verifyRelease` in `scripts/release-package.mjs` checks the complete manifest.

Before any future authorized upload: verify the exact package/commit/checksum, successful mandatory CI, approved metadata, project `utahbills`/branch `main`, current deployment ID, preserved rollback and file-difference allowlist. Use the documented pinned Wrangler Direct Upload procedure only after the specific new authorization; do not run upload during this handoff. November 9 authorization is fulfilled, not blanket authorization for future releases.

Rollback uses the retained previous successful production deployment in the existing Cloudflare project, followed by actual custom-domain verification. An unchanged, checksum-verified previous package is the documented fallback for an explicitly authorized re-upload. Never rebuild rollback from moving Main. Preserve current and older packages; if the new chat lacks these local files, recover the evidence before any release action.

## Backlog and recommended next priorities — not execution authorization

1. **Operational reliability / TEST-001 evidence and RELEASE-002 ongoing review:** inspect the next genuine scheduled acquisition and its independent components/publication. Do not manually refresh merely to obtain a green result or auto-promote data.
2. **UI-001/UI-019 and RELEASE-001:** owner physical iPhone/iPad repeated taps, toolbar position/rotation, native clipboard/manual fallback, VoiceOver/focus/zoom and independent editorial review. Technical-source spacing is implemented; physical acceptance is still open. Automation does not close these tasks.
3. **SESSION-002/003:** verify authoritative 2027 membership, first real introduced bill/request conversion, versions/actions/votes and static-package compatibility when official evidence appears. Keep 2026/current-contact distinctions.
4. **Search registration:** Google verification tag is live, but Google/Bing ownership, sitemap submission, URL Inspection requests, crawling and confirmed indexing outcomes remain unverified. Consult the owner's accounts before claiming or submitting anything; never invent tokens or repeatedly submit unchanged URLs. Search metadata refinements remain recommendations in [the audit](SEARCH_DISCOVERABILITY_AUDIT.md), not implemented changes.
5. **DATA-005, LEG-003/TRANS-008:** record-level verified freshness, optional default-off party column and factual roll-call affiliation breakdown remain approved future directions requiring a separately scoped implementation and authoritative identities/dates. Do not infer party motives or missing affiliations.
6. **CAL-004/TRANS-002 descriptions:** [investigation](REQUEST_DESCRIPTION_INVESTIGATION.md) found 20 official drafts, 13 corroborated request candidates but zero direct tracking-ID joins and zero approved descriptions. Seven proposals are unmatched/ambiguous. Exact authoritative association and editorial policy are still required; no title-only inference. Existing 2026 readers/comparison can be reused only within verified source/version bounds.
7. **Deferred / owner decisions:** UI-021 typography promotion; advanced TRANS-006 monitoring/notifications/accounts/synchronization; LEG-001 private address lookup (official finder is only a fallback); RELEASE-003 domain/redirect choice; broader DATA-002/003/004 historical vote work; new analytics/indexing/automation decisions. Do not begin any of these merely because they appear in this handoff.

The [authoritative backlog](TASK_BACKLOG.md) contains full task dependencies/acceptance criteria. RELEASE-004's eligible-production indexing decision is fulfilled; keep development and qualified-record restrictions. RELEASE-002 has a current release-scoped assessment, not a guarantee of ongoing data freshness. Existing source/editorial/physical limitations remain disclosed.

## Safe recovery in UTAH BILLS 6

Read AGENTS.md, PROJECT_HANDOFF.md, this file, TASK_BACKLOG.md, UI_ACCEPTANCE_CHECKLIST.md and the relevant dated verification records. Inspect `git status`, fetch remote Main, check open PRs (especially final #32 state) and current Actions before editing. Treat later documentation commits separately from runtime/data identities. Recheck live `release.json`, deployment records and local checksums before production decisions. Do not erase local work or immutable evidence.

Use only this repository. The prior release task stopped its local port-4173 preview; check before starting one and stop task-owned previews when finished. Node 22 and Playwright are configured. On this workstation the available Python is `C:\Users\kenro\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe`; set PYTHON/PYTHONUTF8 or use `-X utf8` for the documented Windows build. Network/repository writes may require tool approval because the checkout is outside the current chat's writable roots; use narrow authorized commands, never bypass security controls. No authentication tokens belong in documentation.

The next conversation is **UTAH BILLS 6 (CODEX)**. End final summaries exactly as AGENTS.md requires: **This is the UTAHBILLS Project (CODEX).** Do not put that signature in progress updates. Start with verification/status recovery and wait for a concrete new owner task; this handoff does not authorize a new phase.
