# Phase 7D verification — October 28, 2026

This implements the owner's final interface refinements. Phase 7C development is accepted, but neither its candidate nor this replacement candidate is approved for Cloudflare upload. The previous candidate and verification evidence remain preserved. No Cloudflare, DNS, indexing, production hosting or acquisition changes are included.

## Implemented scope

- UI-023: compact guidance directly below the Bills search controls, approved search tips and explicit any-word/reverse actions. Other active filters are disclosed; no redundant large empty panel appears. Existing parsing, history, bookmark, sorting and complete-result sharing behavior remains intact.
- Status retains the existing filter state and official terminology. The summary says Status (filtered) when active; the selected option has a checkmark. All statuses and Advanced Search remain synchronized.
- UI-018D/E: directory toolbar and rows share an adaptive content boundary for all eight optional-column combinations. Name-only stays compact. Sort aligns with Name; Sort-to-Chamber uses the existing 24px Chamber-to-count spacing. Toolbar layout is independent of the data grid; phone arrangement is retained.
- SHARE-001: the individual profile's Public requests heading has the existing four-action Copy dropdown. Exact recorded sponsor IDs determine membership; no name matching. Complete displayed order, compact rich/plain formats, manual-copy recovery and full qualified source CSV are retained.
- UI-019: expanded enhanced-bill technical-source anchors have 44px minimum height and separation, preserving their URLs, provenance and focus behavior. Automated verification does not close physical-device or assistive-technology acceptance.
- The generated catalog UI JSON uses compact serialization to preserve the existing initial-payload budget. Parsed values and official source bytes are unchanged; acquisition logic and validators are unchanged.

## Focused automated verification

`tests/phase7d.mjs` is added to mandatory CI without removing any existing checks. It exercises search/alternative/reset/filter synchronization; all eight directory combinations; exact-ID profile sharing over a multi-page-sized list; all clipboard modes, denied/unavailable clipboard and manual recovery; complete CSV evidence/quoting; and all four enhanced bills with expanded technical sources.

Representative widths: 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920px. Light/Dark, touch-enabled browser interaction, focus/Escape, overflow, target geometry, 200% text/CSS zoom and full applicable axe WCAG checks are covered. Screenshots are retained locally under `test-results/phase7d/`. Synthetic fixtures are test-only and never enter official saved data.

Targeted retained regressions and final CI/live results are recorded in the delivery evidence. Mandatory CI must pass before GitHub publication is considered verified; a green deployment is not evidence of healthy scheduled acquisition.

## Release and acceptance gates

Main and Review remain one complete Pages artifact with identical data, separate Review typography and noindex, nofollow. The new production-only package is prepared only after the final commit passes CI and live GitHub verification. Its commit, manifest checksum and per-file verification are recorded in its local release receipt and final delivery. Review is excluded from that package. The previous Phase 7C candidate is retained as historical evidence, not overwritten.

The Phase 7C Calendar safeguard failure remains an operational limitation: retained Calendar data must not be described as freshly acquired. Request publication/source-observed qualifications, unresolved vote discrepancies and 2027 membership/introduction limitations remain. Frozen-code production data refresh is documented but not activated or operationally proven. See [Phase 7C readiness](PHASE7C_READINESS.md) and [Cloudflare procedure](CLOUDFLARE_PRELAUNCH.md).

Owner acceptance is still required for physical iPhone Safari/Notes/rich clipboard, native browser zoom, VoiceOver/NVDA, visual layouts and Review typography. Automated checks do not establish manual accessibility acceptance. Cloudflare account deployment ID/rollback confirmation and explicit approval are required before any upload. Official public release, indexing, analytics and promotion remain separate decisions.

## Optional Bills toolbar alignment decision

Measured 768/1024/1280/1440/1920px layouts and inspected desktop screenshots. The existing shared 1000px boundary remains correct. Aligning Per page with the title would add about 64px between the first controls even at intermediate widths, consuming space otherwise available to counts and sharing. The optional change is therefore not applied; the compact existing toolbar and phone arrangement are preserved. Geometry evidence: `test-results/phase7d/bills-alignment.json`.

Local completed evidence: the full new Phase 7D test passed, including unavailable clipboard and fresh-action/manual recovery. Foundation/payload, retained search-bookmark-sharing and final-sorting tests passed. Catalog UI parsed values match the preserved Phase 7C candidate exactly; initial raw payload is 2,208,633 bytes, below the unchanged 2,300,000-byte limit. Official data tree remains `20f8356b9cb0f51ed8dff9aaf7ee646f862d54a0`. The previous candidate verifies at content SHA-256 `316713bfd9e91d6bac2e1294d04d12803fca300a54e09e6f29f267aca9dc08dd`. Pre-push inspection found no active/queued deployment or acquisition; latest scheduled acquisition remains failed run 40744457953, separately from successful GitHub application deployment.

Retained Phase 7B follow-up also passed: directory exact-name sharing/CSV/fallback, all optional columns and persistence, sorting/counts, seven responsive widths with text/zoom/themes, finder alignment and non-shifting Info/Copy panels. Real saved-data preflight verified both local artifact environments at 390/1920px, exact Fillmore profile list (28 requests), complete CSV and separate 700/600 title weights. Read-only Cloudflare placeholder check retained HTTP 200 and original 609-byte checksum.
