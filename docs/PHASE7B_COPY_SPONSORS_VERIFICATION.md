# Phase 7B — Copy titles + sponsors

Baseline: `72d72a92bf3a21d7b694fe53a4422a8d1818c4e6`. The previous queued batch completed CI and Pages deployment successfully before work began. Fetched Main; no remote changes or active deployment at preparation. Read AGENTS, current SHARE-001/backlog and UI acceptance requirements, and the latest search/bookmarks verification.

## Implementation

Bills (requests, introduced legislation and historical archive) and Recent Activity add **Copy titles + sponsors** between Copy titles only and Export CSV. Existing options remain. The complete matching set and ordering feed all options; Activity retains every event and lazily loads all matching pages without title deduplication.

Plain text has exactly one entry per line, no blank separators or appended URLs. Assigned bill/resolution numbers precede complete titles. Whitespace within source titles/names is collapsed to avoid embedded line breaks; honorific prefixes Rep./Sen. are removed without abbreviating names. Rich HTML uses linked titles and, only for established exact sponsor IDs, linked session-qualified legislator profiles. Entries are separated by a single HTML break. Requests use their recorded request sponsor; bills use the recorded chief sponsor. Activity resolves its exact request/session-qualified bill route to the saved catalog association; it does not reconstruct historical sponsor changes or join by title/name. Conflicting IDs or unavailable records are labeled Unavailable. Recorded unresolved names remain plain text; absent names/IDs are labeled Not published. No inferred identities, conversion, topics or political interpretation.

Links use the actual HTTPS application host. Review links point to the corresponding Main route on that same host. Local/temporary preview hosts retain the existing published-URL fallback. No Cloudflare deployment/configuration or DNS changes.

The existing promised ClipboardItem path starts during the click, before Activity fetches finish, preserving the Safari user-activation opportunity. Both text/html and compact text/plain are provided, with writeText and selected-textarea fallbacks. Counts, retry feedback, focus restoration, opaque bounded floating panels and 44px menu targets are retained.

## Verification

Focused `tests/copy-sponsors.mjs` covers compact exact lines, Unicode/HTML escaping, verified/unresolved/missing/conflicting sponsors, actual future hostname, promised clipboard activation, rich/plain/manual fallbacks, filtered/sorted requests across pages, introduced and historical numbers, repeated Activity events over multiple lazy pages, category filtering and phone menu focus/targets in Light/Dark. It is added to mandatory CI without removing any suite. Retained `tests/sharing.mjs` and Phase 6D protect existing Copy/titles/CSV behavior and responsive accessibility; only the explicit menu-item expectations change.

Focused sponsor-copy checks passed in pinned Chromium and Windows Edge. Retained sharing and Phase 6D checks passed, including existing Copy/titles/CSV, load failures, responsive enlarged-text menus and axe. Final combined-artifact, mandatory CI/Pages and live verification outcomes are reported with delivery. Main and Review continue to ship together with identical data and separate typography; both retain noindex, nofollow. Official source data, snapshot dates and acquisition safeguards are unchanged.

## Limitations and acceptance

Physical iPhone/Safari paste into receiving applications, VoiceOver/NVDA and owner visual acceptance remain pending. Receiving applications decide which clipboard representation to use and how text wraps. Activity sponsors describe the exact record's saved catalog association, not an inferred sponsor at the historical event time. Existing source reconciliation, UI-019 and unrelated release/acceptance gates remain open.
