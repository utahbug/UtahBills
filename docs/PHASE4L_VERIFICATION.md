# Phase 4L — legislative version and change transparency

Baseline: clean fetched `main` at `16acd46ed42ff6eb37c737f924a708d302e67a05`, Phase 4K [push deployment 39899960962](https://github.com/utahbug/UtahBills/actions/runs/39899960962) successful. Investigation October 22, 2026 America/Denver (October 23 UTC). TRANS-001 is partially implemented, not complete.

## Coverage and bounded acquisition

The saved 2026 catalog contains 1,016 measures (931 bills / 85 resolutions), 2,180 official version records and 14,044 document references of all kinds. 551 bills and 27 resolutions have multiple version IDs. 333 bills and 13 resolutions have published amendment or amendment-page references. These are metadata findings, not counts of substantive changes or verified adoption.

Reused nine previously preserved XML documents for HB0011, HB0154, HB0155 and SB0069, retaining their four enhanced presentations and pinned explanations. Acquired only four additional XML responses, all explicitly linked in HB0117's checksum-verified official metadata: introduced HB0117, amended HB0117 (AV_HB0117_2026-02-02_11-30-13), substitute HB0117S01, and enrolled HB0117 under the official HB0117S01 parent. [Manifest](../data/version-text.json) pins exact source URLs, original-byte SHA-256, retrieval timestamps, parent version/type, and the metadata source. [Original bytes](../data/version-raw/) are content-addressed and protected against Git line-ending conversion; committed blob hashes match the retrieval manifest. No historical bulk retrieval or new formatted-reader expansion occurred.

The official introduced [2027 index](https://le.utah.gov/data/2027GS/billlist.json), checked at 2026-10-23T05:07:50.268619+00:00, still contains zero measures and matches saved SHA-256 `4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945`. Existing catalog retrieval timestamps were not rewritten. No fictional 2027 documents or events were published.

### Availability definitions and counts

[Machine-readable inspected coverage](PHASE4L_COVERAGE.json); reproducible build output `data/version-coverage.json`. Public requests are excluded.

| Inspected 2026 coverage | Bills | Resolutions |
| --- | ---: | ---: |
| At least one official metadata link for introduced/substitute/amended/enrolled text | 931 | 85 |
| No such text link in saved metadata | 0 | 0 |
| At least one locally preserved, checksum/identity-validated XML text | 5 | 0 |
| No locally verified text, despite official links | 926 | 85 |
| At least two comparable local documents | 4 | 0 |
| Known unsuccessful retrieval/validation in this bounded text acquisition | 0 | 0 |

A link is not verified availability of its remote bytes. The 926/85 linked-but-unverified measures were **not individually attempted**; they cannot be labeled inaccessible, absent, or successfully retrieved. All four new attempts succeeded. Thirteen local XML documents across five bills are now verified; only the existing nine remain in the formatted reader. Zero 2027 introduced measures are present; 268 public requests remain a separate category. No new public counter/filter was added.

## Relationship and comparison method

`version_model.py` groups representations by exact official parent version, document type and URL path without the PDF/XML extension. An amendment document (`PubAmend`) or amendment pages (`AmdPages`) is a supporting record, not a new substitute ID or automatically applied textual operation. An amended full-text snapshot remains distinct from amendment instructions/pages. Introduced, substitute, amended and enrolled documents retain their official metadata associations. Enrolled base filenames do not overwrite substitute parent IDs.

PDF/XML counterparts can have slightly different record timestamps; all representation URLs/dates remain in bill-level groups. Logical ordering is version ID then type, explicitly **not** a verified chronology, adoption order or publication sequence. For example, SB0069's enrolled document belongs to S01 even though S02 also exists. No automatic causal chain or assertion that every published substitute was adopted is made.

The shared existing XML extraction function is now in `xml_text.py`; the four original analyses reproduce byte-for-byte under `analyze.py --check`. New text extraction validates preserved hashes, linked document URL, session/base bill and substitute identity. It preserves section number/UID/source-line metadata and proposed statutory/effective-date text, excluding erased text according to the existing markup parser. Unsupported/empty structures and identity/hash mismatches reject projection rather than yielding an unsupported comparison. Source bytes are never normalized or overwritten.

Basic bill details replace the flat versions list with compact **Versions and amendments** disclosures and readable comparison fallbacks. HB0117 readers can select any pair of its four verified documents. Deterministic `diffWords` presentation marks additions/deletions with screen-reader labels, ignores layout whitespace and reports unchanged extracted text. Both exact official XML sources remain linked. This is a proposed-section comparison, excluding titles/sponsors, not a full-document redline or legal-effect interpretation. Section identifiers remain in the comparison text and their UIDs/line metadata in the generated source-bound projection. Existing full version/statutory metadata and supporting links remain in their prior collapsed disclosure.

| Verified example | Evidence/result |
| --- | --- |
| HB0117 introduced → amended | Different extracted proposed wording; exact amended XML preserved. The separately linked Hamd.1 PDF is an amendment document, not counted as another substitute or automatically interpreted as adopted instructions. |
| HB0117 introduced → S01 substitute | Different proposed wording; additions/deletions available in the new basic-detail comparison. |
| HB0117 amended → S01 | Different proposed wording; both exact documents available. |
| HB0117 S01 → enrolled | Identical extracted proposed sections, despite distinct document records. |
| HB0011 introduced → enrolled | Identical proposed tokens; existing enhanced comparison preserved. |
| HB0154 introduced → S01 | Identical proposed tokens; a substitute record does not establish changed statutory wording. |
| SB0069 introduced/S01/S02/enrolled | Existing four-document comparison and enhanced reader retained; compared pairs contain changed proposed wording. Enrolled relationship remains S01. |
| HB0155 | One verified introduced document; no two-document comparison implied. |

Amendment PDFs/pages remain official links; their instructions were not parsed or mechanically applied. Unknown legal effect, independently verified publication times, late-change intervals and boxcar characterization remain unavailable. The new text manifest is explicitly bounded: future 2027 text requires separate authorized retrieval/validation entries; no blanket automatic text crawler was introduced.

## Recent Activity

Existing official action dates and document-record events remain distinct from observation dates. New **New document record observed** events use preserved successive 2027 measure snapshots, exact document-group identities, the first observation timestamp, previous/current source references, bill-history links and the corresponding official document. Initial per-measure baseline documents do not create “newly published” observations. Added PDF/XML representations and unchanged repeated snapshots do not create new document observations. Missing/naive observation timestamps remain undated; document dates do not substitute for them. Content changing at the same document URL is not inferred as a textual change from metadata alone; original revision evidence is retained.

Historical representation deduplication removes 368 duplicate format events, changing the 2026 event total from 41,602 to 41,234. All 37,214 recorded actions remain; the retained first representation keeps its existing event identity. The real 2027 total remains 16 request observations, with unchanged request records/navigation. Future introduction/substitute/amendment observations are tested only with isolated fixtures.

## Verification

- Final production build: source checksums/session/version/summary validation, 3 vote-integrity tests, catalog/foundation/activity/version projections pass.
- `tests/version_data.py`: 7 tests covering real substitute/amended/enrolled pairs, amendment-versus-version distinctions, paired representations with different dates, unchanged text, unknown dates, missing text, hash/session/bill/substitute/URL mismatches, successive 2027 snapshots, stable event IDs, duplicate/repeated observations and initial-baseline exclusion.
- `tests/activity_data.py`: 5 existing provenance/action/observation tests pass. `tests/catalog_updates.py`: 6 existing guarded-update tests pass. `scripts/analyze.py --check` preserves all four enhanced analyses.
- New `tests/phase4l.mjs`: changed and unchanged distinct real pairs, official links, unavailable comparison, enhanced SB0069 reader, document-observation history navigation, keyboard controls, 320/390/768/1280px, doubled text, 200% CSS zoom and axe WCAG 2.2 A/AA tags. Additional lexical assertion verifies punctuation-spacing-only differences do not become wording changes.
- Existing `tests/foundation.mjs`, `tests/activity.mjs` and `tests/phase4g.mjs` cover initial payload budgets, on-demand loading, metadata, preserved history links, activity chronology/filter/page/Copy, source links and reflow/accessibility.
- Representative 390px/1280px screenshots inspected. No physical-device or manual screen-reader certification claimed. Mandatory CI retains every prior gate and adds version integrity plus Phase 4L browser checks (25 browser suites).

TRANS-001 remains **In progress**. Remaining acceptance requires broader justified document coverage, authoritative publication/timing evidence for late-change claims, and live 2027 validation when measures appear. General amendment application, historical Code comparisons and TRANS-002 formatted-reader expansion are outside scope. No boxcar designation, substantive-change score or plain-English interpretation was generated. TEST-001 remains open pending genuine scheduled evidence; no schedule or acquisition guard changed. Main only, Review unconfigured, noindex/nofollow retained. Recommended next priority: the next real scheduled refresh and first introduced 2027 source verification, then separately scoped text coverage based on actual records.
