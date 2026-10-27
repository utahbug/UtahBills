# Phase 6E — Copy actions and compact More menus

October 27, 2026 (Mountain). Baseline: Phase 6D `7198ba8e1a10ceb8e2fc31815f4974df18a37a09`, successful [Main run 40440991781](https://github.com/utahbug/UtahBills/actions/runs/40440991781). Main was clean and synchronized before implementation.

## Implemented scope

- Bills (public requests, introduced measures and archive) and Recent Activity primary Copy now uses the existing Phase 6D `titleLinks` formatter. Accessible name and tooltip: **Copy titles with links**. Output retains exact saved title, absolute HTTPS detail/history URL, blank line between records, escaped rich HTML and plain text. Success announces the actual count.
- Existing More contains exactly **Copy titles only** and **Export CSV**. Titles-only uses one saved title per line, retains duplicates and Unicode, and adds no metadata or links. CSV generation, all columns, source/status qualifications, UTF-8 escaping and formula protection are unchanged.
- Both copy actions snapshot the existing complete matching set and established ordering. Activity continues incremental browsing and loads remaining saved pages only on demand. A failed later page prevents partial clipboard output; a subsequent retry can recover. No new scope controls, filters or event definitions.
- More is content-sized (200px in ordinary test layouts), constrained to the visual viewport and permitted to wrap with enlarged text. It opens below the toolbar by preference, reserving space only while open so result links cannot be partly obscured. Above placement requires insufficient room below and no intersecting controls. Closing restores the original padding; closed toolbar/icon geometry and Sort are unchanged. Escape, outside dismissal, 44px actions and focus restoration remain.
- `sharing-ui.js` separates the two-page sharing interaction from unrelated Calendar/Legislators Copy. `sharing.js` retains the Phase 6D exact-route validation and `site-config.js` fallback. Public HTTPS bases use the actual application hostname/path; localhost/recognized previews use the documented Main fallback. A simulated alternate HTTPS hostname/application subpath is tested; no hosting change.

## Clipboard activation and limits

[WebKit clipboard guidance](https://webkit.org/blog/10855/async-clipboard-api/) requires writes during the user gesture. The handler now calls `clipboard.write` synchronously with promised ClipboardItem data before awaiting Activity loading/formatting. Promises resolve only after the complete matching set succeeds. Empty sets and loading failures do not replace the clipboard with partial/empty text. Unsupported/rejected rich writing tries plain text; complete denial exposes the complete focused/selected textarea with an honest manual-copy message. Formatting yields every 250 records.

An isolated gesture-boundary test verifies that `write` begins before asynchronous data resolves. This improves the activation opportunity; it is **not physical Safari acceptance**. Actual iPhone/iPad copying/pasting, recipient HTML support, VoiceOver/NVDA and native browser zoom remain human tasks.

## Focused verification

- `tests/sharing.mjs`: unchanged exact-route/identity restrictions, current/local/preview and alternate HTTPS bases, escaping, duplicates, Unicode, empty sets and 5,000-record formatting.
- `tests/phase6e.mjs`: promised clipboard activation, atomic failure/empty preservation, rich-to-plain fallback, total denial, alternate HTTPS subpath, exactly nine filtered matches across all three actions, 60-record complete output, titles-only manual selection and focus.
- Retained `tests/phase6d.mjs`: all 274 real public-request and 1,016 archive identities, exact request conversions/40 introduced fixtures, 155 events across eight chunks, preserved duplicate titles, categories, delayed-page failure/recovery and clipboard MIME content. Its action expectations are updated to the owner-approved arrangement; CSV still carries detailed evidence.
- More checks cover 320, 375, 390, 430, 700, 701, 1024 and 1280 CSS pixels with normal/doubled text and 200% CSS zoom. Compact width, viewport containment, 44px targets, keyboard dismissal/focus, no horizontal overflow and unchanged closed horizontal geometry are asserted. Phone/desktop screenshots inspected. Sixteen additional font-metric cases retain all axe WCAG A/AA assertions without target exclusions.
- Existing Copy-dependent regressions are migrated to title/link output. Tests that previously asserted copied status/source/date metadata now assert that evidence in CSV instead; source distinctions are not removed. The browser-only session fixture uses valid ten-letter tracking IDs so sharing validation is exercised rather than relaxed.
- Targeted retained checks: mobile toolbar, Phase 4U/4W sorting and complete export, Phase 4D transition, Phase 4G date/category activity, Phase 4P/4Q source-observed disclosure/export, toolbar and usability. Production build checks original checksums, session/version associations, summary evidence, three Python vote tests and deterministic projections. Full mandatory CI remains enabled, including the new Phase 6E test.

## Local diagnostic corrections

The compact panel initially retained a 200px minimum at 200% CSS zoom, exceeding a 320px viewport. Its minimum and maximum now use the measured zoom scale; the full responsive suite passes. One retained Activity test attempted to install Playwright’s fake clock after CSV scheduled object-URL cleanup and stalled at clock installation. The test now installs its clock before interactions and bounds its download wait; all date, source and navigation assertions remain. The first retained Phase 4W run overlapped the local data build and was rerun only after projections finished. No source data or production clock behavior was changed.

## Publication and outstanding acceptance

The implementation commit is identified by `git log -1 --format=%H -- docs/PHASE6E_VERIFICATION.md`. Required checks and Main publication are recorded in the [workflow history](https://github.com/utahbug/UtahBills/actions/workflows/pages.yml) and final delivery. Check for active scheduled acquisition immediately before pushing; never cancel it to publish UI work. Published assets must match the tested build before claiming deployment verified.

No legislative source files, acquisition/reconciliation, sorting algorithms, archive detail, Calendar/Legislators/Contact functionality, domain or environment changes. Main-only and static `noindex, nofollow` remain. TEST-001 stays completed under Phase 6A; first-real-2027 evidence, all unfinished backlog tasks, independent editorial review, actual-device/assistive-technology/native-zoom acceptance and owner public-release approval remain outstanding. This phase does not authorize release.
