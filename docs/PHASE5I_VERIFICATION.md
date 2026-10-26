# Phase 5I — Final enhanced 2026 detail polish

October 26, 2026 (Mountain). Baseline: clean synchronized main at `6873ad466e406494303e550102325de47818ab5c`, published by [run 40401997273](https://github.com/utahbug/UtahBills/actions/runs/40401997273).

## Scoped presentation changes

- Bill Summary receives a 1px muted blue-gray divider, 11px inner separation and 10px top margin, aligned with its content width. Historical parchment and sponsor links remain intact.
- The voting overview and Key actions use shared list indentation as a grid track. Detailed voting records aligns with bullet text. Official action history aligns with the date glyphs, accounting for the existing 3px date-background padding through a shared variable. A 10px row gap separates the final action and source link; targets remain at least 44px.
- All four major native disclosures contain semantic level-two headings with the overview heading's family, 19px size, 700 weight, ink color and 1.5 line height. Small arrows remain; sections start closed and no inner duplicate headings are added.

No action-selection, vote-selection, summary, source text, source pins, outcomes, acquisition or data files change. Supporting technical sources, statutory comparisons, official summary and the formatted reader retain their destinations and behavior. Changes are limited to enhanced-detail markup and scoped styles, regression coverage and documentation.

## Verification

- Source checksum/session/version/summary validation and three vote-data integrity tests passed. Existing verified projections were reused; the production esbuild bundle and stylesheet were rebuilt. CI retains the complete production build and all integrity/browser gates.
- `tests/phase5i.mjs` checks four bills (HB0011, HB0154, HB0155, SB0069) at 320, 390, 768, 1024 and 1280 CSS pixels, each with normal text, doubled text and 200% CSS zoom. It measures actual first-character rectangles, divider and action gaps, computed heading typography, 44px targets, overflow, closed defaults, exact action dates, all inventoried source links, keyboard navigation and automated WCAG A/AA rules.
- Retained `tests/phase5g.mjs` passed and covers summary pins, disclosure/reader/history navigation and vote-model safeguards; `tests/batch1.mjs` passed and retains strict source-text conservation across all nine versions. The first retained reader audit reproduced axe target-size on an unrelated 44.5px Key actions summary partially behind the sticky header after selectOption auto-scroll. The full-document audit now explicitly returns to a stable top position; all axe rules remain enabled, and focused keyboard/anchor clearance and measured 44px assertions remain intact. No application navigation workaround or weakened assertion was added. The corrected audit passed at all four reader widths, preserving every character/change state across all nine versions.
- Representative default and expanded Key actions screenshots at 390px and 1280px were inspected. Generated screenshots and local logs remain ignored verification artifacts.
- The new regression joins the mandatory test chain without removing or relaxing any existing checks. Required CI and post-publication asset/route results accompany delivery. Resolve the implementation commit with `git log -1 --format=%H -- docs/PHASE5I_VERIFICATION.md`.

## Unfinished acceptance and scope

[UI-016 in the backlog](TASK_BACKLOG.md#phase-5i--ui-016) records this bounded implementation. No further historical-archive feature development is authorized; future work returns to scoped 2027 readiness priorities. All unfinished IDs remain open, including independent editorial review, physical iPhone/iPad, VoiceOver/NVDA, native browser zoom, public-release authorization and TEST-001. CSS zoom and automated accessibility are not human acceptance. The latest previously checked genuine scheduled run, 40380145137, does not establish full reconciliation acceptance. The final pre-push check found no active scheduled acquisition and no newer remote commit.

Main remains the only deployment; noindex/nofollow, hosting and source provenance are preserved.
