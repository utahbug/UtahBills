# Review — compact Calendar layout (November 8, 2026)

Owner-authorized Review-only layout refinement; no new palette or source-data changes.

## Changes

Move the existing Month label/select and Show/Hide calendar button into one wrapping row. Event and Key Dates remain together in the following row. Reuse the actual nodes/handlers, preserve 44px targets and DOM keyboard order. Reduce only outer spacing: controls bottom margin 0; agenda top margin 4px/padding 0; Events toolbar margin 0; first date group margin 4px; expanded grid bottom margin 8px. Actual event padding, date-to-date grouping, details, official links and Copy stay unchanged.

## Live palette verification before editing

On November 8 at 11:17 AM MST, Chromium and WebKit iPhone emulation loaded the actual Review stylesheet. Its SHA-256 was `7d3e124b61910f955d7486e065ba6f3a69824eb940c185395cf64721c49f4767`, containing the latest neutral rule. Light page: `rgb(245, 245, 247)` / `#f5f5f7`; white Calendar reading surface: `#ffffff`. Dark page: `#18212b`; agenda transparent over the existing dark page. The owner's physical-iPhone observation that the near-white difference may be too subtle is recorded, not disputed. Browser checks prove server delivery, not the cache state of the owner's phone. Palette evaluation is deferred; this batch changes no color values.

## Verification gates

Focused Chromium/WebKit tests cover 320px/390px phones, landscape, iPad both orientations and desktop; Light/Dark and doubled main text; row order, graceful wrapping, 44px controls, selectors/toggle, Key Dates keyboard/Escape/focus, axe, complete Copy and clipboard fallback. Compare event text, source links and row spacing with Main. Preserve mandatory CI, full combined artifact and both noindex directives. A scheduled acquisition run was active at task start and is left uninterrupted; check its outcome and fetch resulting Main before publication.

Record local results, hosted CI, deployment and live checks separately. Owner physical iPhone/iPad/VoiceOver and visual acceptance remain pending. No Cloudflare, indexing, analytics, acquisition changes or Main appearance promotion are authorized.

## Local results and scheduled-run boundary

Combined build/artifact isolation passed. Focused Chromium/WebKit layout tests passed across six phone/tablet/desktop/orientation cases, both themes and normal/doubled text. All controls retain 44px targets; Tab to Key Dates, dialog/Escape/focus return, month/type changes and grid visibility passed. Event text, original link values, row padding/gaps and complete Copy output match Main; denied clipboard fallback retains the full text. Screenshots were inspected.

The already-running schedule [42507465429](https://github.com/utahbug/UtahBills/actions/runs/42507465429) failed at the existing `tests/phase5f.mjs:30` Bills Sort resize/focus assertion and skipped deployment. Main remained `6c04b0d`. That unchanged targeted regression passed locally; its assertions and acquisition are not modified or bypassed. A successful UI push would not prove a successful genuine scheduled refresh. Hosted CI/publication for this Calendar revision remains pending.
