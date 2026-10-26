# Phase 5G — Bill summary, voting overview and progressive disclosure

October 26, 2026 (Mountain). Baseline: clean synchronized Main `6d6b349fe9f57f96052bdf307754e5313f2d390b`, the tested snapshot preserved and deployed by genuine scheduled [run 40380145137](https://github.com/utahbug/UtahBills/actions/runs/40380145137). No acquisition was active at the initial check. This batch changes presentation only.

## Presentation and preserved evidence

- The four enhanced 2026 pages retain their exact pinned explanations, additional qualifications and official highlighted provisions. Bill Summary and Legislative votes at a glance remain visible. The verified outcome appears once beside Bill Summary. Existing latest-action evidence remains, with no inferred “Not signed” status.
- What would this bill change?, Votes, Key actions and Supporting records are independent native disclosures, closed initially. Supporting records retains all five existing primary disclosures. Comparison controls still default to the pinned proposal and Proposed changes; no text, addition/deletion markup, statutory baseline or source pin changes.
- The inline Official bill summary link opens a native modal dialog containing only the preserved General Description/Highlighted Provisions nodes from the exact explanation-pinned XML version. It identifies the version and offers its readable official PDF; technical XML remains secondary. If highlighted provisions are absent, the link is labeled Official general description. The original AI-assisted wording is not regenerated. Independent human review remains pending.
- The formatted reader identifies its bill and selected version immediately. It initially selects the explanation pin and retains subsequent explicit selections. Reader, detailed-vote and local evidence links open necessary disclosure ancestors before focus and sticky-header-aware scrolling. Existing `/history` links likewise open Supporting records and complete action history. These in-page actions do not replace the bill route or browser history.

## Vote overview rules

The overview reads the existing per-bill verified vote projection and checks exact session/bill identity and `detailState`. It selects dated latest committee recommendations by named committee and latest final-passage decisions separately for House and Senate. Concurrence remains a separate labeled decision; procedural, second-reading, amendment and substitute decisions never become floor final passage. A substitute recommendation is explicitly identified if it is the latest committee recommendation. No tally is inferred from action prose. Voice votes remain without individual totals.

| Measure | Overview evidence |
| --- | --- |
| HB0011 | House third reading 74–0–1; Senate committee 4–0–3; Senate third reading 28–0–1. Signed outcome remains separate from passage. |
| HB0154 | House committee recommendation 12–0–2 ([39567](https://le.utah.gov/mtgvotes.jsp?voteid=39567)); House third reading 48–22–5 ([480](https://le.utah.gov/DynaBill/svotes.jsp?sessionid=2026GS&voteid=480&house=H)). No qualifying Senate final-passage vote in saved coverage; not described as a failed Senate floor vote. Overall Did not pass. |
| HB0155 | No verified final-passage roll call in saved coverage. No fictional tally. Overall Did not pass. |
| SB0069 | Senate committee recommendation 6–1–0; House committee 8–3–4; Senate third reading 27–1–1; House third reading 46–21–8; Senate concurrence separately 19–0–10. Signed; explanation/official-summary pin remains S02, distinct from enrolled text. |

Totals above are Yes/No/Absent (committee) or Absent or not voting (floor). Complete original decisions, dates, motions, source URLs, individual attribution and missing/conflicting-record safeguards remain in Votes. Missing or unavailable overview evidence is explicitly qualified; a failed fetch does not imply no vote occurred. Unknown dates cannot establish the latest decision. Committee recommendations and chamber passage do not establish enactment.

## Verification

Focused local checks passed; required CI/Main publication is recorded with delivery. The implementation commit is resolvable with `git log -1 --format=%H -- docs/PHASE5G_VERIFICATION.md`.

- `tests/phase5g.mjs` covers the four default presentations; exact pinned wording; official-summary version/PDF and Escape focus; independent disclosures; separated HB0154 tallies; missing/failed/voice/procedural/identity/date safeguards; nested reader/vote/history navigation; retained reader selection; seven widths, doubled text and 200% CSS zoom; automated WCAG A/AA checks.
- Retained `phase5d`, `phase5e`, `batch1`, `batch2d`, `refinement`, `qa` and `phase4l` suites passed. The strict reader comparison preserves every non-whitespace source character and change state across nine versions. The new official-summary assertion likewise compares every non-whitespace character against the pinned XML metadata. Representative 390px and 1280px rendered screenshots were inspected.
- Existing deep-content regressions explicitly open the major disclosures using `tests/fixtures/enhanced-sections.mjs`. Their original source-link, exact text, comparison, vote, identity and accessibility assertions remain. Readiness-only checks use attached state for now-collapsed reader content. No data assertion is weakened.
- Production build validates source checksums, sessions, versions and summary evidence, runs the three vote-integrity tests, and generates deterministic projections. Subsequent UI edits require only an esbuild rebundle, not repeated source processing.

## Boundaries and pending acceptance

No original legislative data, actions, hashes, review packets, acquisition code/frequency, Bills/archive search, Contact configuration, Calendar, Legislators, hosting/DNS or indexing changes. Main remains the only deployment with noindex/nofollow.

TEST-001 is not closed by this interface batch. The successful baseline schedule still reports partial request reconciliation; its component evidence and unresolved source limitations remain separate from successful publication. Independent editorial review, physical iPhone/iPad, VoiceOver/NVDA, native browser zoom and public-release authorization remain open. CSS zoom and automated accessibility results do not constitute those human acceptances.
