# Phase 5D — Bill detail readability and progressive disclosure

October 25, 2026 (Mountain). Baseline: `130cdc6cc340bb63cfb0de89799ff772161ae163`, successful Main build/deployment [40229896678](https://github.com/utahbug/UtahBills/actions/runs/40229896678).

## Presentation and source boundaries

The four enhanced bills now follow one reading order: identity/status, unchanged source-pinned explanation, exact official highlighted provisions, statutory comparison, votes/key actions, then supporting records. Basic details reuse the status/action/committee presentation without claiming a prepared explanation or statutory analysis. Historical parchment/session identification remains. Exact source wording is escaped; only known metadata bullet markers create nested semantic lists. H.B. 11 retains all three nested conditions.

The comparison defaults to the explanation's exact pinned proposal. Its result immediately follows Before/Proposed/Resulting controls. A short not-current-law qualification remains visible; adjacent Info explains the reconstructed, independently unverified historical Code baseline and proposal-only resulting text. Exact source-line/XML references move below the result. Published-version comparison remains accessible in supporting records. No comparison algorithm, source pin, explanation wording or legal interpretation is changed.

The internal Read full formatted bill link opens and focuses the existing reader; version selection remains. The separate explained-version link explicitly selects the pinned source. Source element boundaries separate AMENDS/ENACTS headings and adjacent effective qualifications. No underlying XML is edited. H.B. 154's two 63I-2-273 references remain distinct: effective May 6/superseded July 1 versus effective July 1. Every non-whitespace source character and change-state remains subject to the existing strict nine-version test.

Complete action history, assignments/agendas/minutes, document versions, amendments, published-version comparison, reader and technical provenance remain available. Document record dates are explicitly not verified first-publication dates. Key actions use saved action codes; current location is shown only as a dated last-recorded location supported by named chamber/committee metadata. Filed-without-passage requires the explicit official file-for-bills-not-passed owner. Veto and line-item-veto outcomes take precedence over earlier chamber passage. Passage alone is not enactment.

## Verified examples

| Record | Explanation pin | Outcome and evidence |
| --- | --- | --- |
| HB0011 | Introduced HB0011 | Signed; nested highlighted provisions and both chamber votes preserved. |
| HB0154 | First substitute HB0154S01 | Did not pass; separate committee and floor decisions, 31 complete actions, two effective-date references. |
| HB0155 | Introduced HB0155 | Did not pass; no verified final-passage roll call; missing votes are not fabricated. |
| SB0069 | Second substitute SB0069S02 | Signed measure, but explanation remains pinned to S02, not S01-enrolled. Committee/substitute, concurrence, procedural and voice decisions remain distinct. |

Exact XML hashes and human-review packets remain in [summary evidence](../data/summary-evidence.json) and [review materials](review/README.md). All independent editorial dispositions remain pending.

### H.B. 154 vote correction

- February 5 House Natural Resources, Agriculture, and Environment Committee recommendation: **Yes 12 / No 0 / Absent 2**; [official committee vote 39567](https://le.utah.gov/mtgvotes.jsp?voteid=39567). Preserved source SHA-256 `f21ba8c5cb1b96478eb570a5853adb13538800a701b4adab5b337fdbdea2cd89`.
- February 17 House third reading: **Yes 48 / No 22 / Absent or not voting 5**; [official House vote 480](https://le.utah.gov/DynaBill/svotes.jsp?sessionid=2026GS&voteid=480&house=H). Preserved source SHA-256 `491910ed2a7d0cc5d805dea9406d001072394c1fc65929f29e5ccd806a805b8e`.
- Both records were retrieved October 21. Original combined technical motion text, including its original encoding, remains in Source details; its committee tally no longer competes with the floor tally in primary presentation. No original data or individual attribution changed. Unavailable/conflicting records retain their warnings and withheld attribution.
- Key actions: HCAFAV February 5, HPASS3 February 17, SREAD1 February 18, SECS March 6, HFILED March 6. The last explicitly names `House file for bills not passed`. The complete 31-action disclosure preserves original descriptions, dates, owners and vote references.

## Readable document checks

One bounded check verified nine existing introduced/substitute/enrolled PDF destinations: HTTP 200, PDF content signature and first-page session/bill/version identity. [Check report](PHASE5D_PDF_CHECKS.json) retains URLs, check times, byte counts, hashes and identity excerpts. Original XML URLs remain technical links. These checks establish readable document availability and identity, **not** PDF/XML byte equivalence or an official publication time. The internal reader and comparisons continue to use preserved, hash-pinned XML. No historical bulk retrieval or production source update occurred.

## Verification

- `tests/vote_data.py`: three integrity tests pass; unchanged original-source reparse, tallies and individual identity safeguards.
- `tests/phase5d.mjs`: all four exact explanations/provisions, nested list, two separate H.B. 154 decisions, source motion disclosure, effective dates, 31 actions, committee links, default pin, all comparison views, future-2027 browser-only fixture, seven widths (320/375/390/430/768/1024/1280), doubled text, 200% CSS zoom, keyboard Info/Escape and automated WCAG A/AA checks.
- `tests/batch1.mjs`: all nine XML versions preserve every non-whitespace source character, addition/deletion state, section count and exact source URL; reader responsive/accessibility checks pass.
- `tests/qa.mjs`: comparison semantics, identical-version fallback, navigation and six-width accessibility checks pass.
- Existing `batch2d`, `phase4l`, `refinement`, `foundation` and `phase4x` suites passed. Affected vote, version, source disclosure and archive suites retain their assertions. Tests now open the intentionally collapsed published comparison and use the new shared heading container; the committee classification assertion accepts its sentence case. No legal-text, identity or accessibility assertion is relaxed.
- Representative 390px and 1280px screenshots inspected. The screenshot scroll position can leave an unrelated link partly beneath the sticky header; automated page audits reset to the stable top, consistent with existing tests. Keyboard focus/Escape behavior is tested separately, and the existing vote regression explicitly verifies that focusing the comparison disclosure reveals it below the sticky header after enlargement. All axe rules remain enabled.

The production build passed source/session/version/summary checksum validation, vote-integrity checks and deterministic catalog/activity/version projections. Mandatory CI/deployment results are recorded with delivery. Resolve the implementation commit with `git log -1 --format=%H -- docs/PHASE5D_VERIFICATION.md` and its checks in [Main Actions](https://github.com/utahbug/UtahBills/actions/workflows/pages.yml).

## Pending acceptance and unchanged safeguards

No data, raw source, review packet, acquisition pipeline, refresh frequency, Contact configuration, hosting or domain changes. Main only; static noindex/nofollow retained. TEST-001 remains open; latest listed genuine scheduled run is [40211750281](https://github.com/utahbug/UtahBills/actions/runs/40211750281), reported successful before this baseline. This presentation batch does not re-audit its component reports against all TEST-001 criteria or treat that overall conclusion as closure. Five historical vote conflicts, unresolved identities, first-real-2027 acceptance, independent human editorial review, physical iPhone/iPad, manual VoiceOver/NVDA, native browser zoom and release approval remain unfinished. Automated checks and CSS zoom do not certify those human tasks.

## CI correction

Initial push run [40249895833](https://github.com/utahbug/UtahBills/actions/runs/40249895833) passed source-integrity/build gates and the new Phase 5D suite, then stopped in `tests/batch2b.mjs` because the basic-record qualification no longer used its established wording. The original explicit “No reviewed plain-English explanation or reconstructed statutory comparison…” qualification is restored. The unchanged `tests/batch2b.mjs` suite passes locally after restoration; deployment was skipped for that failed run. The corrected commit receives the complete mandatory workflow.
