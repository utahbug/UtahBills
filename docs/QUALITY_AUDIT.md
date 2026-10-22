# UtahBills quality and data audit — Phase 4C

Audit date: October 22, 2026 (UTC). Baseline: `1ff2b05dceeab42e1738bbf0a5fa5a41fba1fb7a`, Main deployment [39857741101](https://github.com/utahbug/UtahBills/actions/runs/39857741101). Main was verified before this audit. Fetch found no newer remote commit; `main` and the working tree were clean.

This is an independent technical recomputation, source comparison and adversarial test pass by the coding agent, **not independent human editorial approval, legal analysis, or accessibility certification**. No redesign, new environment, production source refresh, vote reinterpretation or historical identity substitution was performed. Review remains unconfigured.

## Outcome and priorities

No new critical defect was established within the audited scope. Two narrow defects were corrected: a date-dependent browser test that blocked scheduled publication, and an incomplete historical-listing coverage condition. Current public-source freshness remains an open high-priority issue: newer request/status sources disagree, and the last scheduled publication failed. A successful code-push deployment must not be mistaken for a successful scheduled acquisition.

Evidence is in [QUALITY_AUDIT_EVIDENCE.json](QUALITY_AUDIT_EVIDENCE.json). Three bounded official responses are preserved under `audit-sources/`, with SHA-256 values and URLs in that file. They are audit evidence only, not runtime data. Git preserves their exact bytes; the quality suite checks their hashes. Original unchanged 2026 evidence remains in the existing production archives. HTTP observations are point-in-time checks, not guarantees of continuing availability.

## Critical

None confirmed. This does not establish exhaustive correctness, legal completeness, or absence of assistive-technology failures outside the automated coverage.

## High

### H1 — Calendar regression blocked scheduled publication — corrected

**Evidence:** [scheduled run 39820847031](https://github.com/utahbug/UtahBills/actions/runs/39820847031), October 22, failed at `tests/batch2.mjs:17`, waiting for `.calendar-empty`. The test assumed October 23, 2026 had no event. The independently retrieved official October feed contains 32 events, compared with 31 saved events, including `meeting-20784`, General Oversight Committee, October 23. The old assertion expected “Next scheduled” even when an event existed that day. This prevented the otherwise checked candidate snapshots from reaching the commit/deploy steps.

**Affected:** `tests/batch2.mjs`; scheduled Main refresh/publication. No calendar rendering bug was demonstrated.

**Reproduce:** select October 23 against the newer official feed; the original test waits for an empty-date notice that correctly does not exist. See `audit-sources/2026-october-calendar.json` and the failed run log.

**Correction:** real-source date/month assertions compare rendered event IDs to the saved snapshot. Empty-day, no-remaining-event and empty-month messages are still tested, now through isolated intercepted fixtures. Another fixture adds an October 23 event and asserts that it appears without an empty-date notice. Fixtures never enter production data. No assertions were bypassed for actual event identity/order.

**Remaining action:** verify a future scheduled refresh end-to-end. Other source-specific historical assertions should be reviewed when legitimate official corrections occur; do not automatically weaken them.

### H2 — New official requests are not yet safely publishable — open, upstream/freshness

**Evidence:** bounded live checks returned 268 request JSON entries but only 267 all-subject status rows. Tracking ID `MDIQORVFRP` is absent from the latter. The live introduced-measure index is still `[]`. The saved application has 255 requests: 249 In Process and six Bill Abandoned per Sponsor; there are no introduced tracking-ID joins. Thirteen newly observed IDs are listed in the evidence JSON, with no previous IDs missing. The status listing contains 261 In Process and six abandoned rows.

**Affected:** current `#bills` request scope, `#request/*`, `scripts/request_status.py`, guarded catalog refresh. Published request/calendar checks are dated October 21. Newer official information is therefore absent from Main; the visible check dates and snapshot qualifications remain material.

**Reproduce:** decode the preserved request JSON and pass it with the preserved status HTML to `request_status.validate_statuses`; it raises `Official status listing missing request MDIQORVFRP`. This is distinct from H1. Fixing H1 does not make inconsistent feeds safe to publish.

**Recommendation/status:** retain the existing complete prior snapshot and strict exact-ID/title join. Recheck when both official sources agree, then permit the established guarded workflow to validate and publish. Do not infer a status, silently omit the ID, or promote the audit responses. No manual refresh or data replacement was made in this batch. Confidential/unpublished requests remain outside any completeness claim. An empty introduced index does not prove no legislation exists.

### H3 — Five contradictory official vote totals — open, preserved

**Evidence/affected routes:** raw action sources, named roll calls and the Phase 4A minutes remain preserved. The archive reproduces the following mismatches (Yes–No–Absent):

| Measure / vote ID | Action history | Roll call |
| --- | --- | --- |
| HB0117 / 39191 | 12–0–2 | 11–0–3 |
| HB0117 / 39193 | 12–0–2 | 11–0–3 |
| HB0264 / 38981 | 11–0–3 | 12–0–2 |
| SB0141 / 38882 | 6–0–1 | 5–1–1 |
| SJR006 / 41466 | 7–0–1 | 8–0–0 |

**Reproduce:** `python tests/foundation_data.py`; inspect `data/phase4a-evidence.json`, `data/archive.json` and the affected `#bill/…` vote disclosures. Independent HTML-cell checks reproduce the preserved named counts. All five yield `Action and roll-call tally disagree`; individual attribution is withheld.

**Recommendation/status:** obtain authoritative clarification or corrected preserved evidence. Minutes corroborate roll calls but do not erase conflicting action records. No totals, classification rules, evidence pins or individual attributions changed. This is an existing source-quality problem, not a newly proven UI misstatement.

## Medium

### M1 — Historical completeness flag missed one direction of listing mismatch — corrected

**Evidence:** `scripts/foundation_model.py` calculated `absentFromSubjectListing` but omitted it from `metadataComplete`. If the human listing lost one measure while the JSON index and saved records retained it, the flag could remain true.

**Reproduce:** new `test_shortened_official_listing_cannot_claim_complete` in `tests/foundation_data.py` removes one listing entry through mocking; unrelated vote work is omitted only in that isolated fixture. It requires a false completeness flag and the missing identifier in the diagnostic list.

**Correction:** include `not extra_listing` in the existing condition. Current sources have no mismatch, so the real report, historical records and application data remain unchanged. This is a latent reporting defect; there is no evidence it previously misreported today's dataset.

### M2 — Historical identity and future roster remain incomplete — open

**Evidence/affected:** 104 historical 2026 roster entries; 1,046 individual entries named `Walter, N.` remain unlinked. The historical roster candidate is `Walter, R. Neil`, but first-initial matching cannot establish a general alias. Four historical IDs (`BURTOJS`, `CLANCT`, `GWYNNM`, `LEETA`) have no matched current contact record. 2027 membership remains unverified in the application.

**Reproduce:** `tests/foundation_data.py`, `tests/catalog_data.py`, `#legislator/WALTER/2026` and directory session controls. Names remain visible; unavailable contacts are not replaced with successors. Current biography/contact links are separately labeled and dated.

**Recommendation/status:** retain conservative chamber/name/initial/district checks and verify historical aliases and a published 2027 session roster in a scoped follow-up. Current officeholders/request sponsors do not establish future-session membership. No new authoritative identity evidence was found in this audit's bounded sources.

### M3 — Human accessibility and editorial review remain unperformed — open validation gap

**Evidence/affected:** all application routes, especially calendar table navigation, expanded document comparisons, long vote tables, dynamic result announcements and focus after updates. Automated keyboard/axe/reflow checks provide useful evidence but cannot establish VoiceOver/NVDA usability or factual editorial approval.

**Reproduce/next action:** on physical iPhone/iPad and desktop NVDA, check rotor/heading navigation, weekday/date context, Info expanded state, focus visibility/order, Copy confirmation/fallback, 200% browser zoom, sticky-header focus obstruction and long reader/vote navigation. Independently review the four source-pinned summaries against their specified versions. No certification or physical-device claim is made.

### M4 — Some UI tests still assume a request-heavy default session — open, future transition

**Evidence/affected:** `tests/usability.mjs` initially expects 50/100 rows, no Advanced Search, title sort, and later 200 rows without selecting the request session. `tests/batch2d.mjs` correctly verifies that the default switches to introduced 2027 legislation once such records exist. Those assumptions therefore conflict when the first small set of 2027 introduced bills arrives. Current saved data does not trigger this failure.

**Reproduce/recommendation:** use an isolated catalog fixture with one valid 2027 introduced measure and run the usability scenario: the default legitimately has fewer than 50/100 rows and exposes Advanced Search. Extend the initial-session transition fixture across the usability/toolbar suites and isolate large-page preference scenarios from changing live counts before the introduced-bill transition. Do not hold back real measures merely to satisfy test counts. This broader future-snapshot test cleanup is documented rather than changing multiple scenarios during this audit; H1's already-observed calendar failure is corrected separately.

## Low

### L1 — README contradicted later implementation notes — corrected

**Evidence/affected:** introduction still said 253 requests; an older paragraph described aggregate-only votes; the manual acquisition section broadly said scheduling was inactive; activity described a fixed 25-row display despite shared preferences.

**Correction/reproduction:** README now dates the saved 255-request count, describes reconciled vote coverage, distinguishes manual example acquisition from scheduled refreshes, and documents 25/50/100/200 display preferences. Dated historical acquisition counts remain as historical observations. Review the README diff; no runtime values changed.

### L2 — Session-long vote cache merits future device measurement — open opportunity

**Evidence/affected:** `votes.js` caches each visited bill/profile payload without an entry limit. All profile-history files total 37,601,251 raw bytes; the largest is `CULLIKA.json`, 517,209 bytes / 1,491 rows. Only selected histories are downloaded and only a bounded number of rows is initially rendered. This is not a measured leak or current responsiveness defect.

**Reproduce/recommendation:** visit many distinct profiles on a constrained physical device and profile retained heap before deciding whether eviction is useful. The audit's repeated About/directory navigation retained one document and 21 event listeners after garbage collection, with only about 0.10 MB heap difference over 12 round trips; it does not cover every cache growth pattern. Do not introduce speculative optimization in this batch.

## Verified legislative coverage and meaning

- Independent recount of saved original records: **1,016 measures**, **931 bills** (603 House, 328 Senate) and **85 resolutions**; **2,180 versions**, **37,214 actions**, **14,044 document references**. The original-record checks cover version identity, document URL families, supplied section identities, source hashes and expected vote references.
- Live 2026 JSON index: 1,016 IDs, zero saved omissions/extras or changed markers. Live all-subject HTML and index were byte-identical to the preserved independent evidence. Sample HB0011 JSON also matched its preserved bytes. This does not re-fetch all 1,016 detailed records or every external document.
- The generated report has zero title/status differences, conflicting listing rows, missing version-document groups or index-marker differences. **20,467 version-specific statutory references** and **4,388 version-document references** remain metadata, not consolidated current law or a complete offline document archive.
- **5,672 referenced vote responses**, **5,667 reconciled decisions**, **115,130 individual entries**. All references are accounted for; five conflicts remain explicit. Voice votes have no named attribution. Concurrence, amendments, procedural motions, committee recommendations and final passage use the recorded question; version text is not a full amendment-state reconstruction.
- Historical/current identities remain separate. The historical roster URL and sampled House/Senate biography destinations returned successful responses. A successful HTTP response alone does not independently validate membership dates or every biography statement.
- Activity reproduces **41,602 historical events**: 37,214 distinct actions plus 4,388 document records, with separate categories and source traceability. Current/upcoming activity is empty in the saved index. Missing dates remain in All Activity. Retrieval/status-observation dates are not publication/change dates; source timestamps have unspecified time zones unless explicitly supplied. Mountain date windows and DST boundaries are tested.
- Calendar has **89 saved events over eight months**, October 2026–May 2027. Eight month bodies and preserved agenda responses reproduce the saved projection and hashes. Live October has the newly observed event in H1. Future coverage, PDF-only agenda extraction and verified holiday/recess labels remain incomplete. Sunday shading is conventional only.
- Four explanations and nine formatted versions remain source-pinned; all non-whitespace source characters and change markings are checked. Reconstructed statutory baselines are not independently verified historical Code/current law. No publication-to-hearing interval, boxcar finding or motive is inferred.

## Navigation, accessibility and performance evidence

The established suite exercises Bills/request search and combined filters, 1,200-row synthetic pagination, all 255 saved request templates, directory/profile sponsorship and voting history, Recent Activity periods/pagination, calendar dates/types/All Month, About/legacy routes, detailed and basic measures, reader versions and clipboard fallback. Fixtures remain intercepted or temporary.

The new `tests/quality-audit.mjs` adds explicit Back **and** Forward restoration, direct history links, delayed detail responses while navigating away, simulated HTTP 503 with successful retry, initial lazy-loading checks and 200-row search. Principal direct routes have one h1 and no horizontal overflow in the added desktop check. Existing matrices cover 320/375/390/430/600/768/900/1024/1280 CSS widths as applicable, normal/doubled text and 200% **CSS** zoom; this does not replace actual browser/device zoom and assistive-technology review. There were no page errors in the focused audit.

The bounded official external-reference sample covers 13 endpoints: 2026 index/listing, 2027 index/requests/status listing, sample bill JSON and readable PDF, calendar landing/significant dates, historical roster, one House and one Senate biography, and October calendar feed. All returned HTTP 200 without the checked rejection/error markers; biography trailing-slash redirects were followed. This is not an exhaustive live crawl of 14,044 document references. Full stored document URLs are checked for expected official schemes/host families by integrity tests.

Local headless Edge, 1280×900, no throttling, warm filesystem/cache: initial app/CSS/index payload **2,062,851 raw bytes**, **190,581 gzip-equivalent bytes** (hosting wire compression differs). First listing was ready in roughly 0.1 seconds; individual route observations and synchronous search timings are recorded in the evidence JSON. Search/render including up to 200 rows was under 15ms in the measured runs. These timings exclude slower-device/network effects and are not Core Web Vitals field data. Initial listing did not fetch full examples, archive votes or voting histories. Activity cache is bounded to eight source pages; analyzed-example cache contains only four examples. No demonstrated need for a performance rewrite was found.

## Reliability and safeguards reviewed

- Catalog uses exact tracking IDs and normalized-title/status checks, validates session/version identities, prevents lost measures/requests, bounds unexpected growth, preserves revisions and replaces its manifest atomically. The real H2 mismatch demonstrates why fail-closed behavior is necessary.
- Calendar requires complete month shapes and retained prior events/logistics, with explicit cancellation exceptions; failed collection leaves the prior snapshot. Audit did not bypass these guards.
- Archive retrieval is paced and bounded to two connections; valid earlier bytes survive failures, stale resume cache cannot supersede newer sources, changed markers prevent blindly reusing stale detail, and parser/tally failures withhold individuals. `refreshError` is reported separately; partial-source warnings require attention even if the job proceeds with retained data.
- Scheduled workflow refreshes calendar/catalog independently, archives attempt reports, checks data and browsers before committing/deploying, and reports failed acquisition outcomes. Pushes do not run scheduled retrieval. H1 shows that browser failures can prevent all refreshed candidates from publishing. Schedule trigger timing is not an exact delivery guarantee.
- Dependencies/actions use existing pins; the latest successful workflow reports Node action-runtime deprecation/runner migration notices. No workflow/runtime upgrade was attempted in this audit. Revisit separately when compatibility testing is scoped.
- Runtime HTML escaping, relative base-path assets, static `noindex, nofollow`, local bundled dependencies and official fallback links remain intact. This was not a penetration test or exhaustive dependency vulnerability assessment.

## Validation and reproduction

From the UtahBills checkout, with Python available (`PYTHON` may point to the bundled Windows interpreter):

```text
python scripts/analyze.py --check
python tests/calendar_data.py
python tests/catalog_data.py
python tests/catalog_updates.py
python tests/foundation_data.py
python tests/activity_data.py
npm run build
npm start
npm test
```

The build also runs three vote-data tests. Integrity counts for this audit: calendar 5, catalog 10, controlled updates 6, foundation 9 (including the new shortened-listing fixture), activity 4, and build-time votes 3. Synthetic failure messages in test output are expected assertions, not production retrieval attempts. `npm test` now includes the new quality suite (17 suites total). The focused audit writes diagnostics to ignored `test-results/phase4c/browser-audit.json`; the committed evidence records a specific run rather than a performance threshold.

Local validation passed: all 16 established browser suites, the additional focused quality suite, deterministic analysis, and all integrity suites listed above. No automated WCAG A/AA violations were reported. The existing required GitHub workflow repeats the complete 17-suite command before publication; its result and final deployed-asset verification are recorded in the delivery report. Audit-only response files are excluded from the app build because the builder copies application assets and `data/`, not `docs/`. No separate published environment was created. The next scheduled acquisition and remaining manual reviews are explicitly still outstanding.
