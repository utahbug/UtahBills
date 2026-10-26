# Phase 5J — Final 2026 archive adjustments

October 26, 2026. Baseline: clean synchronized main at `827a5fe9aabfd26e75c45cda194176a6dba89363`, successfully published by [Phase 5I run 40410872202](https://github.com/utahbug/UtahBills/actions/runs/40410872202).

## Exactly two application changes

1. The enhanced `.summary-heading` flex layout now uses start alignment and an 11px gap. The existing badge text, source-derived status, colors and styling remain unchanged; wrapping is natural when the heading and badge cannot fit.
2. A shared wrapping `.historical-context` row contains the existing historical identification and one contextual `#archive/2026` link. Their horizontal gap is 10px. The link uses the existing parchment accent, an underline and an invisible minimum 44px target. The bill title follows on its own line. Existing All bills navigation is unchanged.

Application edits are limited to `enhanced-detail.js` and scoped `styles.css` rules. Summary wording, vote overview, key actions, supporting records, divider, other typography, source links/data, acquisition, search, other pages, hosting and indexing are unchanged.

## Focused verification

`tests/phase5j.mjs` passed and covers all four enhanced records (HB0011, HB0154, HB0155, SB0069), widths 320/390/768/1024/1280 and normal/doubled text. Assertions cover exact summary/status/title preservation, 11px adjacent badge placement or clean wrapping, shared 10px archive row or wrapping, title/divider alignment, matching parchment, underlined link, 44px target, keyboard focus, actual archive navigation, browser Back and All bills navigation, no horizontal overflow and automated WCAG A/AA checks. Representative 390px/1280px screenshots were inspected. The Phase 5I regression remains in mandatory CI with all existing checks; no assertions are relaxed.

Only the UI bundle and stylesheet are rebuilt locally from the unchanged verified data projection. Mandatory CI retains the full production build, data integrity and browser suites. Final targeted test, CI and Main asset/route verification results accompany delivery. Resolve this implementation commit with `git log -1 --format=%H -- docs/PHASE5J_VERIFICATION.md`.

## Acceptance boundaries

[UI-017](TASK_BACKLOG.md#phase-5j--ui-017) records this final scoped refinement. Routine 2026 archive interface development is to be treated as complete **following successful owner review**, which remains pending. Demonstrated defects can still be corrected. No future archive feature work is authorized.

All unfinished backlog IDs remain unchanged, including TEST-001, independent editorial review, physical iPhone/iPad, manual VoiceOver/NVDA, native browser zoom and public-release authorization. Automated checks do not replace human acceptance. Main-only hosting and noindex/nofollow remain. The pre-push workflow check found no active scheduled acquisition; this push is not scheduled-refresh evidence.
