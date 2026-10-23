# UtahBills authoritative task backlog

Updated: October 23, 2026. Application: **UtahBug**. This is the authoritative inventory of unfinished approved work, proposed ideas and deferred enhancements. [ROADMAP.md](../ROADMAP.md) remains the high-level strategy; this file supplies stable task IDs and acceptance criteria. Recording approval of a direction does **not** authorize automatic implementation.

Phase 4F priority: October 2026–April 2027 coverage takes precedence. Historical 2026 vote conflicts and voter identities remain open at Low priority, except defects affecting 2027 accuracy require prompt investigation. LEG-001 is High/Blocked; the official-link fallback does not complete address lookup. [Investigation and verification](PHASE4F_VERIFICATION.md). SESSION-002 and SESSION-003 are High priorities alongside TEST-001.

Phase 4E maintenance: CAL-001 and UI-002 complete the authorized interface refinements. Phase 4D request freshness and transition-test readiness remain complete; the next actual scheduled run remains unverified. See [Phase 4E verification](PHASE4E_VERIFICATION.md), [Phase 4D verification](PHASE4D_VERIFICATION.md) and the completed task ledger.

## Baseline and evidence

Before this documentation batch, fetched `main` and `origin/main` both pointed to [af26e785e5d9f9acca5ee7cb4f2e00bb1b1c9759](https://github.com/utahbug/UtahBills/commit/af26e785e5d9f9acca5ee7cb4f2e00bb1b1c9759); working tree clean, zero commits ahead/behind. Latest push deployment [39860908975](https://github.com/utahbug/UtahBills/actions/runs/39860908975) succeeded. No scheduled data commit had advanced that handoff. GitHub issue inventory (all states) was empty. `docs/CODEX_HANDOFF.md` was absent.

Read [AGENTS.md](../AGENTS.md), [ROADMAP.md](../ROADMAP.md), [README.md](../README.md), [VERIFICATION.md](../VERIFICATION.md), [QUALITY_AUDIT.md](QUALITY_AUDIT.md), the workflow and relevant existing implementation/tests. Source counts below are dated audit/snapshot evidence, not a new live-source acquisition. The original backlog-establishment batch changed documentation only. The separately authorized Phase 4D batch subsequently completed DATA-001 and SESSION-001 and manually verified the guarded refresh path; its results are recorded below.

“Backlog approval” references the owner's **UtahBills — Create and Maintain Authoritative Task Backlog** request, received October 22, 2026, especially §§4 and 8. It explicitly adds Find My Legislators and the remaining Calendar refinements. Existing roadmap **Planned** items retain approved direction; audit opportunities remain Proposed.

## Status and priority

Active inventory: **37 tasks**; **9 completed tasks** retain their IDs in the completion ledger. Completed tasks and batches are excluded from active counts.

| Status | Count |
| --- | ---: |
| In progress | 1 |
| Approved/Not started | 23 |
| Proposed | 2 |
| Blocked | 8 |
| Deferred | 3 |

| Priority | Count |
| --- | ---: |
| Critical | 0 |
| High | 4 |
| Medium | 25 |
| Low | 8 |

Priority is a planning order, not a new defect-severity finding. Blocked tasks remain approved work whose completion requires the stated evidence/dependency; bounded investigation may continue when separately scoped. No critical defect was established by Phase 4C.

## 1. Legislative data integrity and accuracy

### DATA-002

**Resolve five official vote conflicts** — **Low** · **Blocked**

- **Dependencies:** Authoritative clarification or corrected, preserved official evidence.
- **Source:** [Audit H3](QUALITY_AUDIT.md#h3--five-contradictory-official-vote-totals--open-preserved); [Phase 4A evidence](../data/phase4a-evidence.json).
- **Acceptance:** Resolve each of HB0117/39191, HB0117/39193, HB0264/38981, SB0141/38882 and SJR006/41466 with recorded evidence and reproducible tally tests. Preserve conflicting originals, warnings and withheld individual attribution until each correction is justified; minutes alone do not erase action conflicts.

### DATA-003

**Verify historical voter identities** — **Low** · **Blocked**

- **Dependencies:** Authoritative historical alias evidence applicable to the affected records.
- **Source:** [Audit M2](QUALITY_AUDIT.md#m2--historical-identity-and-future-roster-remain-incomplete--open); [Phase 4A verification](../VERIFICATION.md).
- **Acceptance:** Account for all 1,046 unresolved Walter, N. entries. Record the scope and sources of any verified alias; test chamber, district and historical identity checks and ambiguous cases. Retain original names and unresolved links where evidence is insufficient; do not infer aliases or use successors.

### DATA-004

**Establish vote coverage beyond action-history references** — **Medium** · **Approved/Not started**

- **Dependencies:** Bounded official-source inventory and identity verification; DATA-002 and DATA-003 remain explicit limitations.
- **Source:** [Roadmap Stage 1](../ROADMAP.md#stage-1--legislative-data-and-transparency--partly-implemented).
- **Acceptance:** Define and report the independently verified coverage boundary, preserve newly acquired originals, reproduce classifications/tallies, and disclose missing or conflicting records without claiming every vote is recorded.

## 2. 2027 legislative-session readiness

### SESSION-002

**Verify and publish the official 2027 roster** — **High** · **Blocked**

- **Dependencies:** An authoritative published 2027 session roster, rather than current contacts or request sponsors. Phase 4H found 89 rows from the year=2027 query, no 2027 selector option, and missing chamber/district coverage; no finalized membership was established. [Preserved evidence](PHASE4H_VERIFICATION.md#session-002-blocked-incomplete-roster-evidence-retained).
- **Source:** [Roadmap Stage 2](../ROADMAP.md#stage-2--legislator-directory--partly-implemented); [Audit M2](QUALITY_AUDIT.md#m2--historical-identity-and-future-roster-remain-incomplete--open).
- **Acceptance:** Preserve dated membership evidence and stable IDs; verify chamber/district membership and associations; test directory, sponsor and vote links. Preserve 2026 history and separately dated current contacts. Unverified membership remains unavailable.

### SESSION-003

**Review early-session source completeness** — **High** · **Blocked**

- **Dependencies:** First real introduced 2027 sources and conversions are still absent in both official index and human listing. Phase 4H verified 268 unchanged requests/statuses and corrected a future measure-revision provenance-test failure. Fixture readiness is not live acceptance. DATA-001, SESSION-001 and SESSION-002 constrain claims; [evidence](PHASE4H_VERIFICATION.md).
- **Source:** [Roadmap Stage 1](../ROADMAP.md#stage-1--legislative-data-and-transparency--partly-implemented).
- **Acceptance:** Cross-check official index/listing and acquired details, request joins, versions, actions and vote references; document gaps and failure recovery. Verify first real request conversion when available. Empty indexes and incomplete rosters never become completeness claims.

## 3. Interface, usability, and accessibility

### UI-001

**Complete human and physical-device accessibility acceptance** — **Medium** · **Approved/Not started**

- **Dependencies:** Physical iPhone/iPad access and manual VoiceOver/NVDA reviewers.
- **Source:** [Audit M3](QUALITY_AUDIT.md#m3--human-accessibility-and-editorial-review-remain-unperformed--open-validation-gap); [Roadmap Stage 6](../ROADMAP.md#stage-6--public-release-preparation--planned); backlog approval §4.
- **Acceptance:** Record devices, browsers, assistive technologies and a WCAG 2.2 AA acceptance matrix. Traverse all routes by keyboard; check focus order/visibility and sticky obstruction, headings/rotor, calendar weekday context, Info, Copy fallback/announcements, long readers/vote tables, actual zoom and reflow. Log and retest failures before closing; automated axe results alone are insufficient.

## 4. Legislative Calendar

### CAL-002

**Extend calendar coverage beyond May 2027** — **Medium** · **Approved/Not started**

- **Dependencies:** Official month sources and a scoped coverage window.
- **Source:** [Roadmap Stage 3](../ROADMAP.md#stage-3--calendar-and-activity--partly-implemented).
- **Acceptance:** Acquire and preserve additional official months through the existing guarded pipeline; test month boundaries, chronology, timezone and failure retention; accurately display coverage and freshness without implying empty days mean no work.

### CAL-003

**Verify holiday, recess and non-meeting designations** — **Medium** · **Blocked**

- **Dependencies:** Explicit authoritative designation evidence; current saved feed does not establish closures.
- **Source:** [Audit coverage](QUALITY_AUDIT.md#verified-legislative-coverage-and-meaning); backlog approval §4.
- **Acceptance:** Preserve official designation sources, dates and qualifications before adding any labels. Test accessible distinction from conventional Sunday shading. Do not infer closure from missing meetings or holiday wording in a deadline.

### CAL-004

**Improve agenda, draft and PDF coverage** — **Medium** · **Approved/Not started**

- **Dependencies:** Documented coverage need and verified official document formats.
- **Source:** [Roadmap Stage 3](../ROADMAP.md#stage-3--calendar-and-activity--partly-implemented).
- **Acceptance:** Define a bounded extraction scope, preserve originals and readable fallback links, test representative HTML/PDF/draft failures and exact bill associations. Report unextractable content; do not infer draft identities.

### CAL-005

**Add verified per-bill next actions** — **Medium** · **Approved/Not started**

- **Dependencies:** Reliable explicit agenda-to-bill links; CAL-004 where richer extraction is needed.
- **Source:** [Roadmap Stage 3](../ROADMAP.md#stage-3--calendar-and-activity--partly-implemented).
- **Acceptance:** Show source-linked upcoming actions only for verified bill associations, respecting cancellations, dates and Mountain times; test missing/stale/conflicting sources and avoid implying guaranteed action.

### CAL-006

**Cross-check special-session and caucus notices** — **Medium** · **Approved/Not started**

- **Dependencies:** Authoritative notices outside the currently collected calendar feeds.
- **Source:** [Roadmap Stage 3](../ROADMAP.md#stage-3--calendar-and-activity--partly-implemented).
- **Acceptance:** Inventory and reconcile additional official notices without duplicates; preserve source provenance and revision/cancellation handling; test coverage limitations and never synthesize meetings.

## 5. Legislators and district information

### LEG-001

**Find My Legislators by address** — **High** · **Blocked**

- **Dependencies:** A supported geocoder that keeps submitted addresses out of URLs/logs and provides documented retention controls; authoritative boundary accuracy/ambiguity validation; independently matched, dated members; SESSION-002 for 2027 claims. Phase 4F verified state district sources but found URL-based upstream geocoding and permitted temporary parameter retention. See [source investigation](PHASE4F_VERIFICATION.md). The external link is a fallback only.
- **Source:** Backlog approval §4 (Find My Legislators); [existing directory scope](../README.md#batch-2b--expanded-discovery).
- **Acceptance:** Return the user's Utah House representative and state senator from authoritative address/district evidence. Test boundary, ambiguous, invalid and out-of-state addresses with clear source/date/error disclosures. Exclude voter registration, party affiliation and voting instructions; never guess a district or member.

### LEG-002

**Add verified historical contact snapshots** — **Medium** · **Approved/Not started**

- **Dependencies:** Dated official historical contact records.
- **Source:** [Roadmap Stage 2](../ROADMAP.md#stage-2--legislator-directory--partly-implemented).
- **Acceptance:** Preserve historical source dates and stable-ID associations; distinguish historical contacts from current contacts in display and tests. Keep unavailable records explicit, including BURTOJS, CLANCT, GWYNNM and LEETA where evidence remains absent; never substitute a successor.

## 6. Additional bill transparency and legal resources

### TRANS-001

**Verify substitutes and late-change histories** — **Medium** · **In progress**

- **Dependencies:** Verified version relationships and publication evidence; reliable timing cannot be inferred from retrieval.
- **Source:** [Roadmap Stage 1](../ROADMAP.md#stage-1--legislative-data-and-transparency--partly-implemented); [README limitations](../README.md#data-findings-and-limitations).
- **Acceptance:** Trace substitutes, amendments, late changes and any proposed boxcar characterization to preserved exact versions and defensible timing. Distinguish document/action/retrieval dates, disclose unknown publication times, and test comparisons without motive or unsupported legal-effect claims.

**Phase 4L bounded progress:** Grouped source-verified version/document histories, four additional HB0117 XML documents and deterministic basic-detail comparison, plus successive-snapshot 2027 document observations are implemented. Full publication/late-change timing and broader/live-2027 acceptance remain unfinished. [Evidence and coverage](PHASE4L_VERIFICATION.md).

**Phase 4M bounded progress:** Scheduled catalog success now authorizes bounded 2027 complete-XML acquisition with immutable source revisions, validation, partial/failure reporting, recovery and existing comparison integration. No real introduced 2027 measure was available; first-live validation and publication/late-change timing remain open. [Evidence and limits](PHASE4M_VERIFICATION.md).

### TRANS-002

**Expand formatted bill-text analysis** — **Medium** · **Approved/Not started**

- **Dependencies:** Bounded source/version scope and editorial capacity; RELEASE-001 for new explanation review.
- **Source:** [Roadmap Stage 1](../ROADMAP.md#stage-1--legislative-data-and-transparency--partly-implemented); [README architecture](../README.md#architecture).
- **Acceptance:** Extend beyond the nine formatted example versions with preserved official XML, exact non-whitespace character/change-markup checks, source pins and readable fallbacks. Identify reviewed versus unreviewed explanations; no blanket automatic analysis claim.

### TRANS-003

**Verify historical statutory comparisons** — **Medium** · **Approved/Not started**

- **Dependencies:** Authoritative historical Code baselines and effective dates; LEGAL-002 supplies reference coverage.
- **Source:** [Roadmap Stage 1](../ROADMAP.md#stage-1--legislative-data-and-transparency--partly-implemented); [README limitations](../README.md#data-findings-and-limitations).
- **Acceptance:** Verify baseline dates, amendments, repeal/re-enactment and cross-bill conflicts; reproduce section comparisons with sources. Clearly distinguish reconstructed bill baselines, historical law and current law.

### TRANS-004

**Add source-linked fiscal-note summaries** — **Medium** · **Approved/Not started**

- **Dependencies:** Verified fiscal-note versions and independent explanation review.
- **Source:** [Roadmap Stage 4](../ROADMAP.md#stage-4--additional-bill-information--planned).
- **Acceptance:** Link each summary to its exact fiscal note and bill version, preserve assumptions and amounts, disclose absent/revised notes and test associations; do not present estimates as established outcomes.

### TRANS-005

**Connect related legislation across sessions** — **Medium** · **Approved/Not started**

- **Dependencies:** Documented, evidence-based relationship criteria.
- **Source:** [Roadmap Stages 1 and 4](../ROADMAP.md).
- **Acceptance:** Provide source-supported cross-session relationships with reasons and exact measure links; test false matches and unavailable records; do not equate similar titles with identical legislation.

### TRANS-006

**Follow bills and show changes since previous visits** — **Medium** · **Approved/Not started**

- **Dependencies:** Explicit storage/privacy and retention decisions before implementation.
- **Source:** [Roadmap Stage 4](../ROADMAP.md#stage-4--additional-bill-information--planned).
- **Acceptance:** Define follow/unfollow, storage clearing and first-visit behavior; show only verifiable changes since the stored baseline with source dates; test unavailable storage, stale snapshots and request-to-bill transitions.

### TRANS-007

**Deep-link to versions, sections and votes** — **Medium** · **Approved/Not started**

- **Dependencies:** Stable version/section/vote identities and preserved route compatibility.
- **Source:** [Roadmap Stage 4](../ROADMAP.md#stage-4--additional-bill-information--planned).
- **Acceptance:** Direct reload and Back/Forward reach the intended version, section or vote with accessible focus/context; invalid or missing targets have clear recovery. Existing bill and history links continue working.

### LEGAL-001

**Provide a readable, searchable Utah Constitution** — **Medium** · **Approved/Not started**

- **Dependencies:** Authoritative versioned text and bounded search/accessibility scope.
- **Source:** [Roadmap legal resources](../ROADMAP.md#legal-resources--planned-for-a-later-bounded-batch).
- **Acceptance:** Preserve exact article/section wording and dated provenance; verify search, section navigation, accessible reading and official fallback links without claiming legal advice.

### LEGAL-002

**Provide current Code and historical statutory references** — **Medium** · **Approved/Not started**

- **Dependencies:** Official Code sources, effective-date/version verification and defined coverage.
- **Source:** [Roadmap legal resources](../ROADMAP.md#legal-resources--planned-for-a-later-bounded-batch).
- **Acceptance:** Offer searchable, source-linked current and historical materials with explicit dates and gaps; test section identities and version distinctions. Do not label a bill-derived reconstruction as current law.

### LEGAL-003

**Provide searchable Utah Administrative Rules** — **Medium** · **Approved/Not started**

- **Dependencies:** Authoritative rule text, version/effective dates and bounded ingestion scope.
- **Source:** [Roadmap legal resources](../ROADMAP.md#legal-resources--planned-for-a-later-bounded-batch).
- **Acceptance:** Verify rule identities, exact text, search and source links; distinguish rules from statutes and disclose historical/current coverage and freshness.

### LEGAL-004

**Compare constitutional amendments and verified outcomes** — **Medium** · **Approved/Not started**

- **Dependencies:** Official proposal text, applicable Constitution version and certified outcome evidence.
- **Source:** [Roadmap legal resources](../ROADMAP.md#legal-resources--planned-for-a-later-bounded-batch).
- **Acceptance:** Compare exact amendment/ballot proposal text with the correct baseline; label proposal versus adopted outcome and effective date; test uncertain or unavailable results without premature adoption claims.

## 7. News and external resources

### NEWS-001

**Create the Legislative Resources directory** — **Medium** · **Approved/Not started**

- **Dependencies:** Verified resource scope and link descriptions.
- **Source:** [Roadmap Stage 5](../ROADMAP.md#stage-5--news-and-outside-resources--planned--deferred).
- **Acceptance:** Publish useful accessible resource links with source/official-versus-external labels and verified destinations; no empty navigation or implied endorsement.

### NEWS-002

**Add RSS news and relevant bill reporting** — **Medium** · **Approved/Not started**

- **Dependencies:** Evaluate feed reliability and permitted use for Deseret News, KSL TV/Radio and other Utah outlets.
- **Source:** [Roadmap Stage 5](../ROADMAP.md#stage-5--news-and-outside-resources--planned--deferred).
- **Acceptance:** Provide attributed dated RSS listings and evidence-based bill article associations; clearly separate reporting from official records; test unavailable feeds, duplicate articles, accessible links and permitted excerpt use.

## 8. Testing, reliability, and deployment

### TEST-001

Phase 4N evidence: [official reconciliation review](PHASE4N_VERIFICATION.md) at 2026-10-23T18:09:23Z finds 271 public requests / 270 status rows, with DYVEPWTRCQ absent from raw HTML. The verified 268-request catalog is retained. No newer genuine scheduled run than failed 39993137239 exists at this review; text/archive were skipped, while independent Calendar publication succeeded. TEST-001 remains High / Blocked pending complete authoritative reconciliation and qualifying scheduled evidence.

**Verify the next scheduled refresh end-to-end** — **High** · **Blocked**

- **Dependencies:** A subsequent scheduled run after the Phase 4C correction; catalog publication depends independently on DATA-001.
- **Source:** [Audit H1](QUALITY_AUDIT.md#h1--calendar-regression-blocked-scheduled-publication--corrected); [workflow](../.github/workflows/pages.yml).
- **Acceptance:** Record run ID, Calendar acquisition outcome, attempt reports, source provenance, validation, snapshot commit and deployed freshness. Confirm the Calendar refresh passes the corrected regression and publishes verified updates. Record catalog/archive outcomes separately even if retained data deploys. A successful push build is not this evidence; leave any failed acquisition open.

**Phase 4M scheduled evidence:** Genuine schedule [39993137239](https://github.com/utahbug/UtahBills/actions/runs/39993137239) acquired 90 Calendar events, but catalog reconciliation failed because official status data lacked DYVEPWTRCQ. The 268-request snapshot was retained and dependent text/archive acquisition skipped. All mandatory tests and Calendar deployment passed (snapshot commit `4e6ef34`); independent refresh health correctly failed. TEST-001 remains Blocked on successful subsequent acquisition and publication; DATA-001's earlier resolved discrepancy is not erased or reused for this new ID. [Evidence](PHASE4M_VERIFICATION.md#genuine-scheduled-execution-during-publication).

**Phase 4K recheck:** No subsequent schedule exists after 39820847031; TEST-001 remains High/Blocked. Closure must inspect component reports, including archive `partial` outcomes, and publication evidence. [Pipeline/freshness evidence](PHASE4K_VERIFICATION.md). November 4, 2026 is a readiness planning objective, not a release commitment.

**Phase 4D progress:** Manual guarded run [39869478421](https://github.com/utahbug/UtahBills/actions/runs/39869478421) passed Calendar/Catalog/archive acquisition, reconciliation, tests, snapshot commit and deployment. No subsequent cron-triggered run existed at verification; this task remains open for that distinct evidence. DATA-001 is resolved.

### TEST-002

**Review tests when official historical records change** — **Medium** · **Approved/Not started**

- **Dependencies:** A legitimate source revision and preserved before/after evidence.
- **Source:** [Audit H1 remaining action](QUALITY_AUDIT.md#h1--calendar-regression-blocked-scheduled-publication--corrected).
- **Acceptance:** Review source-dependent assertions against the verified correction, retain identity/tally/coverage safeguards, and isolate synthetic empty/count scenarios appropriately. Record the revision and passing affected regressions; never weaken assertions merely to pass.

### TECH-001

**Measure voting-history cache on constrained devices** — **Low** · **Proposed**

- **Dependencies:** Physical constrained-device measurements; UI-001 can share device access.
- **Source:** [Audit L2](QUALITY_AUDIT.md#l2--session-long-vote-cache-merits-future-device-measurement--open-opportunity).
- **Acceptance:** Measure retained heap and responsiveness while visiting many distinct profiles; document devices, payload counts and recovery. Establish whether a problem exists before proposing cache eviction; this task does not approve speculative optimization.

### TECH-002

**Review GitHub Actions runtime/deprecation notices** — **Low** · **Proposed**

- **Dependencies:** A scoped compatibility review of actual workflow notices and supported replacements.
- **Source:** [Audit reliability](QUALITY_AUDIT.md#reliability-and-safeguards-reviewed).
- **Acceptance:** Record affected actions/runtimes and deadlines, assess compatible changes, and verify required build/test/deployment behavior before any scoped upgrade; preserve all workflow gates and Main-only publishing.

## 9. Public-release preparation

### RELEASE-001

**Independently review explanations and establish corrections** — **Medium** · **Approved/Not started**

- **Dependencies:** Independent human editorial reviewer and exact source-pinned bill versions.
- **Source:** [Audit M3](QUALITY_AUDIT.md#m3--human-accessibility-and-editorial-review-remain-unperformed--open-validation-gap); [Roadmap Stage 6](../ROADMAP.md#stage-6--public-release-preparation--planned).
- **Acceptance:** Review HB0011, HB0154, HB0155 and SB0069 explanations against their pinned versions (SB0069 explanation is second substitute). Record findings, reviewer/date and resolved corrections; define a transparent reporting, verification and correction-history process. Do not relabel agent review as independent human approval.

### RELEASE-002

**Verify release data completeness and freshness** — **Medium** · **Approved/Not started**

- **Dependencies:** DATA-001, TEST-001 and a release-scoped coverage review; unresolved DATA-002/DATA-003/SESSION-002 findings explicitly assessed.
- **Source:** [Roadmap Stage 6](../ROADMAP.md#stage-6--public-release-preparation--planned).
- **Acceptance:** Publish a dated coverage/freshness assessment with source checks and unresolved limitations; ensure no stronger claims than evidence supports. Record release acceptance decisions separately from deployment success.

### RELEASE-003

**Decide final branding and custom-domain needs** — **Low** · **Approved/Not started**

- **Dependencies:** Explicit owner decisions; current UtahBug branding and Main URL remain.
- **Source:** [Roadmap Stage 6](../ROADMAP.md#stage-6--public-release-preparation--planned).
- **Acceptance:** Record final branding/domain decision, including retaining current choices if desired. Any domain or environment change requires its own explicit authorization and validation; this backlog creates no new URL.

### RELEASE-004

**Approve public release and remove indexing restriction** — **Medium** · **Blocked**

- **Dependencies:** Explicit public-release approval after RELEASE-001, RELEASE-002 and UI-001 acceptance.
- **Source:** [AGENTS policy](../AGENTS.md#temporary-indexing-restriction); [Roadmap Stage 6](../ROADMAP.md#stage-6--public-release-preparation--planned).
- **Acceptance:** Record approval; only then remove static noindex/nofollow from every application HTML page, run required checks, deploy and inspect published source. Preserve attribution and truthful limitations; banner removal or a successful deployment is not release approval.

## 10. Deferred enhancements

### DEFER-001

**Public financial disclosures** — **Low** · **Deferred**

- **Dependencies:** Core coverage and review, authoritative sources and interpretation review, then a new scoped request.
- **Source:** [Roadmap Stage 2](../ROADMAP.md#stage-2--legislator-directory--partly-implemented).
- **Acceptance:** Before activation, define source/date coverage and neutral interpretation rules; any eventual implementation must preserve source links, identity verification and uncertainty with applicable tests.

### DEFER-002

**Optional X and Bluesky feeds** — **Low** · **Deferred**

- **Dependencies:** Core source reliability, accessibility, permitted access and a new scoped request.
- **Source:** [Roadmap Stage 5](../ROADMAP.md#stage-5--news-and-outside-resources--planned--deferred).
- **Acceptance:** Before activation, document access/reliability and accessibility findings; eventual feeds must be clearly separate from official records with attribution and failure handling.

### DEFER-003

**Experimental scroll-stop row highlighting** — **Low** · **Deferred**

- **Dependencies:** New scoped request and usability evidence addressing ambiguous selection.
- **Source:** [Roadmap Stage 3](../ROADMAP.md#stage-3--calendar-and-activity--partly-implemented); [Batch 2A verification](../VERIFICATION.md).
- **Acceptance:** Do not reopen stable tap/focus behavior by default. Any reconsideration must demonstrate unambiguous selection, keyboard/touch accessibility and reduced-motion behavior before acceptance.

## Completed tasks

Stable IDs are retained here and excluded from active counts.

### ACT-003

**Compact Recent Activity request titles and metadata** — **Medium** · **Completed — October 22, 2026**

- **Source:** Owner's Phase 4I request; [verification](PHASE4I_VERIFICATION.md#activity-refinements--act-003).
- **Acceptance met:** Title-only request headings; verified tracking/assigned-bill metadata with explicit unassigned state; exact detail/source links; accessible compact filters; contextual official bill search; narrow wrapping and preserved filtering/Copy/navigation.
- **Implementation/tests:** [7c16b75](https://github.com/utahbug/UtahBills/commit/7c16b750b074798d4eba465f9d87960cd8ab523c); extended activity model and Phase 4G regressions, Phase 4H navigation, historical activity suite and production build. No source/acquisition changes.

### UI-003

**Consistent shared sticky and compact navigation** — **Medium** · **Completed — October 22, 2026**

- **Source:** Owner's additional Phase 4I sticky-header requirement; [cause and verification](PHASE4I_VERIFICATION.md#shared-header-correction--ui-003).
- **Acceptance met:** Shared all-width sticky header; compact scrolled state and normal top state; all primary links retained; synchronized route state, measured anchor/focus offsets, responsive wrapping and keyboard access.
- **Implementation/tests:** [6daf52d](https://github.com/utahbug/UtahBills/commit/6daf52d936c8cd618a869c165aafe86321fb97ee); [focused header regression](../tests/header.mjs), existing usability checks and build. Physical-device/manual assistive technology review remains UI-001.

### ACT-002

**Recover Recent Activity request details across snapshot updates** — **High** · **Completed — October 22, 2026**

- **Source:** Owner's additional Phase 4H report for XKUCMCIIHJ; [investigation](PHASE4H_VERIFICATION.md#additional-reported-navigation-defect--act-002).
- **Acceptance met:** Verify saved identity and generated link, reproduce older-catalog/newer-activity failure, preserve baseline routes, refresh the guarded published catalog on a missing exact ID, retain honest retry/unknown states, prevent delayed route replacement, and validate actual details/provenance for all current activity request links.
- **Implementation/tests:** [9d0f79f](https://github.com/utahbug/UtahBills/commit/9d0f79fc1c43ba6d09e29de91edab0137fa7a817); [focused navigation tests](../tests/phase4h.mjs), [existing navigation regressions](../tests/navigation.mjs), production build. No acquisition safeguards relaxed or legislative data changed.

### ACT-001

**2027 Recent Activity observations and categories** — **High** · **Completed — October 22, 2026**

- **Source:** Owner's Phase 4G scoped request; [Roadmap Phase 4G](../ROADMAP.md#phase-4g--2027-activity-and-change-transparency).
- **Acceptance met:** Exclude initial request baseline; derive later new IDs and previous/new title/sponsor/status observations; preserve exact-ID first introduced-measure relationships, action/document evidence and date distinctions; stable IDs, no unchanged-retrieval duplicates; category/date/page filtering, Copy, source/detail links and honest empty states.
- **Implementation/tests:** [45f2791](https://github.com/utahbug/UtahBills/commit/45f2791f27ef9612a09eee408556fdbc33faa2d4), [model tests](../tests/activity_data.py), [existing activity tests](../tests/activity.mjs), [Phase 4G regressions](../tests/phase4g.mjs), production build; [verification](PHASE4G_VERIFICATION.md).
- **Limits:** First real 2027 introduction still awaits SESSION-003; this does not complete TRANS-001 comparisons/late-change verification, roster, new vote interpretation, physical/manual accessibility or TEST-001. Real snapshot supports 16 request events; other 2027 categories are not yet populated.

### CAL-001

**Refine deadline typography and milestone labels** — **Medium** · **Completed — October 22, 2026**

- **Dependencies:** Preserve official wording, qualifications and date uncertainty; retain completed Phase 4B grid.
- **Source:** Backlog approval §4 (Calendar refinements); [Phase 4B verification](../VERIFICATION.md).
- **Acceptance:** Use normal-weight lengthy deadline descriptions and a compact accessible deadline icon/label. Simplify awkward milestone labels without inventing date/time precision. Preserve complete official wording and qualifications; verify keyboard/screen-reader labels and narrow/enlarged-text layouts.

- **Completion evidence:** [Phase 4E implementation](https://github.com/utahbug/UtahBills/commit/f695b5f9ca88ba960c407b92696c2ddd2f7b4fa0), production build, Python checks and all 19 browser suites; source-driven Calendar wording/typography, reflow and axe checks. Physical/manual acceptance remains UI-001. See [verification](PHASE4E_VERIFICATION.md).

### UI-002

**Phase 4E navigation, request sources, session labels, About/FAQ and footer** — **Medium** · **Completed — October 22, 2026**

- **Source:** Owner's Phase 4E request §§2–6 and 8–12; explicitly supersedes the combined About/FAQ and visible Main footer decisions.
- **Dependencies:** Preserve Phase 4A–4D behavior, source content, legacy routes and deployment safeguards.
- **Acceptance:** Normal-weight underlined active navigation without background or added height; independent accessible request-source dialog preserving provenance/history; exact title-case session labels; separate About/FAQ with original explanations/references and legacy bookmarks; approved compact footer and properly scoped copyright. Verify keyboard/touch, nine widths, doubled text, 200% CSS zoom, no overflow and automated accessibility. No data/acquisition or unrelated feature changes.
- **Completion evidence:** [Phase 4E implementation](https://github.com/utahbug/UtahBills/commit/f695b5f9ca88ba960c407b92696c2ddd2f7b4fa0), all 19 browser suites, production build and Python integrity checks; original explanation fixtures and captured source-panel text/link checks retained. See [verification](PHASE4E_VERIFICATION.md). Physical devices and manual screen readers remain UI-001.

### DATA-001

**Restore verified 2027 request freshness** — **High** · **Completed — October 22, 2026**

- **Dependencies at approval:** Official request/status sources must reconcile; TEST-001 validates subsequent publication.
- **Source:** [Audit H2](QUALITY_AUDIT.md#h2--new-official-requests-are-not-yet-safely-publishable--open-upstreamfreshness); backlog approval §4.
- **Acceptance:** Recheck and preserve both official responses; reconcile every exact tracking ID and normalized title; pass existing safeguards and publish only the validated snapshot with truthful dates. Audit observed 268 requests versus 267 status rows, missing MDIQORVFRP; Main retains 255. These are October 22 observations, not fixed expected counts. Never infer the missing status, omit the request, or bypass fail-closed behavior.

- **Completion evidence:** [Commit d4fa8cc](https://github.com/utahbug/UtahBills/commit/d4fa8cc22fb57eaec991423372d6d1fd95150a7a). Official 268/268 exact-ID/title reconciliation, guarded refresh 39869478421, integrity/browser checks, snapshot commit and verified Main publication. TEST-001 remains open only for a later cron-triggered observation. See [Phase 4D verification](PHASE4D_VERIFICATION.md).

### SESSION-001

**Test the public-request to introduced-bill transition** — **Medium** · **Completed — October 22, 2026**

- **Dependencies at approval:** Isolated valid future-session fixtures; complete before the first introduced 2027 records arrive.
- **Source:** [Audit M4](QUALITY_AUDIT.md#m4--some-ui-tests-still-assume-a-request-heavy-default-session--open-future-transition); [Roadmap Phase 4C](../ROADMAP.md#phase-4c--independent-technical-audit).
- **Acceptance:** Remove request-only and fixed 50/100/200-row assumptions from default-session scenarios. Exercise zero, one and multiple introduced records across usability/toolbar suites, exact-ID request conversion, preserved request history and 2026 session access. Keep large-page preference tests isolated from changing live counts; do not hold back valid measures.

- **Completion evidence:** [Commit abfbd5c](https://github.com/utahbug/UtahBills/commit/abfbd5caed21ea189ff204f2105024dbe1b3ea73). All 18 local browser suites passed, including the 0/1/3/240 introduced-record matrix and 25/50/100/200 preferences; existing Python update/reconciliation tests passed. The matrix also passed after rebuilding the refreshed official snapshot. See [Phase 4D verification](PHASE4D_VERIFICATION.md).

## Completed development batches and preserved decisions

These batches are completed; their unresolved findings remain in the active inventory. Historical batch IDs below are completion records, not additional active tasks.

| Batch | Completed scope | Commit evidence | Applicable verification |
| --- | --- | --- | --- |
| Phase 4A | Banner/visible prototype-label removal, compact top spacing, Main footer identification; bounded vote/identity investigation without unsupported corrections. | [5a151bc](https://github.com/utahbug/UtahBills/commit/5a151bc08af4361aadc4adfea273d561f0d6d276), byte-preservation follow-ups [283d3a2](https://github.com/utahbug/UtahBills/commit/283d3a2), [13314c4](https://github.com/utahbug/UtahBills/commit/13314c4), reflow correction [8e46916](https://github.com/utahbug/UtahBills/commit/8e469161ce42a33fecac890910dd0ec3358c753f). | [Phase 4A browser checks](../tests/phase4a.mjs), [foundation integrity](../tests/foundation_data.py), production build and 15 browser suites; [verification record](../VERIFICATION.md). |
| Phase 4B | Compact interface, navigation and Calendar layout; consolidated About & FAQ and contextual guidance. | [1ff2b05](https://github.com/utahbug/UtahBills/commit/1ff2b05dceeab42e1738bbf0a5fa5a41fba1fb7a). | [Phase 4B checks](../tests/phase4b.mjs), production build, integrity tests and 16 browser suites; [verification record](../VERIFICATION.md). |
| Phase 4C | Corrected Calendar test assumptions and historical completeness condition; route/recovery checks, audit and future-transition documentation. | [3465244](https://github.com/utahbug/UtahBills/commit/34652442a01de2a73d82d95ce4bc5cc080b73052), [af26e78](https://github.com/utahbug/UtahBills/commit/af26e785e5d9f9acca5ee7cb4f2e00bb1b1c9759). | [Quality checks](../tests/quality-audit.mjs), [Calendar browser regressions](../tests/batch2.mjs), [foundation integrity](../tests/foundation_data.py), build and 17 browser suites; [successful workflow](https://github.com/utahbug/UtahBills/actions/runs/39860908975), [audit](QUALITY_AUDIT.md). |
| Phase 4D | Verified refresh recovery and isolated introduced-session transitions; actual subsequent scheduled observation remains open. | [abfbd5c](https://github.com/utahbug/UtahBills/commit/abfbd5caed21ea189ff204f2105024dbe1b3ea73), [a928825](https://github.com/utahbug/UtahBills/commit/a9288254b0b179275ccaa608f622ca9c2e9c7ab0). | [Phase 4D verification](PHASE4D_VERIFICATION.md), all 18 browser suites and integrity checks. |
| Phase 4E | Underlined navigation, request-source dialog, title-case labels, separate About/FAQ and compact footer, regular Calendar descriptions. | [f695b5f9ca88ba960c407b92696c2ddd2f7b4fa0](https://github.com/utahbug/UtahBills/commit/f695b5f9ca88ba960c407b92696c2ddd2f7b4fa0). | [Phase 4E verification](PHASE4E_VERIFICATION.md), all 19 browser suites and integrity checks. |

Confirmed completed design decisions, preserved unless a new request reopens them:

- Session selector precedes Search; compact native controls/results minimize unused vertical space.
- Borderless Copy icons share existing toolbar rows, retaining accessible targets and confirmation.
- About & FAQ was consolidated in Phase 4B; the explicit Phase 4E request replaces it with separate About and FAQ pages, retaining old guide/source routes and section bookmarks.
- Raw JSON Contact source links are removed; verified contact data and human-readable biography links remain.
- Recent Activity has clear Previous page / Next page labels and no unnecessary single-page controls.
- Calendar is a continuous semantic grid with integrated weekday headings.
- Contextual Info disclosures replace redundant explanatory sections without deleting source/coverage qualifications.
- Wrapped narrow-screen navigation aligns with the UtahBug wordmark.
- Conservative data handling, exact-ID reconciliation, conflict warnings and withheld unsupported attribution remain in force.

Blue icons, neutral compact design, static `noindex, nofollow`, provenance, historical access and required workflow gates remain protected. Phase 4A explicitly superseded the older Research Prototype banner-retention instruction; removal is complete and is not public-release approval. Main remains the only configured deployment; Review is reserved and unconfigured.

## Documentation reconciliation

- **Older README generalizations:** “Verification and remaining work” still lists individual voting records and live 2027 ingestion as future milestones; “Environment policy” says addresses are planned and deployment unconfirmed. Later Phase 2/Batch 2C records, the actual workflow and the verified successful Main deployment establish implemented referenced-vote coverage, guarded scheduled ingestion and deployed Main. This does not establish live data, complete vote coverage, a verified 2027 roster or successful subsequent scheduled acquisition. This backlog uses that narrower verified state; no completed feature is reopened.
- **Dated snapshots and controls:** earlier README/VERIFICATION sections mention 253 requests, 25-row defaults, older Calendar arrangements and an unconnected 2027 state. Phase 4C documented the then-saved 255-request snapshot; Phase 4D publishes 268 verified requests. Later records also establish shared page preferences and Phase 4B controls. These historical observations are not permanent current counts or active feature requests.
- **Banner retention:** the early roadmap implemented list mentions the Research Prototype notice. The explicit Phase 4A section and current AGENTS policy supersede it. Keep noindex and substantive disclosures, not the removed banner.
- **Approval not previously itemized:** address lookup and remaining deadline typography/label refinements were not explicit strategic roadmap items. The current owner request approves their direction; [LEG-001](#leg-001) and [CAL-001](#cal-001) preserve that decision. Existing Census district maps do not implement address lookup, and the completed Calendar grid does not complete these refinements.
- **Batch completion versus unresolved findings:** Phase 4C H1/M1 code corrections are complete. Phase 4D subsequently resolves H2 under DATA-001 and M4 under SESSION-001. H3, identity/roster gaps, M3 human review and the next actual scheduled-run observation remain open under their task IDs. Phase completion and deployment are not evidence of factual completeness or accessibility certification.

No roadmap item was deleted or silently reclassified. The historical source documents remain available for context; this reconciliation records why the active inventory differs from their older statements.

## Phase 4E decision reconciliation

The owner explicitly replaced the combined About & FAQ destination and visible Main footer label with separate About/FAQ routes and the approved compact disclaimer. Prior phase descriptions remain historical evidence; UI-002 records this authorized replacement. CAL-001 is complete; other Calendar expansion tasks remain open. No acquisition logic or legislative data changed.

## Phase 4F maintenance

Official-finder fallback and priority updates are implemented; LEG-001 remains blocked, with no new task marked complete. At the October 22 check, latest actual scheduled run was [39820847031](https://github.com/utahbug/UtahBills/actions/runs/39820847031), which failed before the correction. No subsequent cron run was available. Successful manual run 39869478421 and push deployment 39876464781 do not close TEST-001. No acquisition logic or records changed.

## Phase 4G maintenance

ACT-001 records this bounded completion; active task counts and priorities are unchanged. TEST-001 remains open: no subsequent actual cron run was available. SESSION-003 still requires real introduced-session evidence, and TRANS-001 still requires deeper version/timing verification. Keep the 2027 cycle primary; no historical findings or human-review tasks were closed.

## Phase 4H maintenance

TEST-001 and SESSION-003 are explicitly **Blocked** on missing actual scheduled-run and first-introduction evidence, respectively; neither is complete. This accounts for the two status-count changes. SESSION-002 remains Blocked: the incomplete roster-query response is preserved but not imported. No legislative source data changed. A reproduced future-revision provenance-test defect was corrected; 21 targeted Python tests passed. The additional reported request-link defect is corrected under ACT-002; targeted browser tests and build passed. [Verification and source evidence](PHASE4H_VERIFICATION.md).

## Next Recommended Batch

**Recommended, not started:** verify a genuine scheduled use of the independent observation channel and seek authoritative convergence for the remaining two missing statuses ([Phase 4Q evidence](PHASE4Q_VERIFICATION.md)). Latest accepted coverage is 273 source requests, 271 verified statuses and two explicitly unconfirmed observations; failed catalog acceptance must remain distinct from supplemental success. The verified subset may advance under the new guards; partial reconciliation does not close TEST-001. Verify the next actual scheduled refresh under [TEST-001](#test-001), retaining separate acquisition, reconciliation, tests, commit and deployment evidence. The manual recovery path is now verified; no automatic monitoring has been created.

Prioritize 2027 early-session coverage, verified membership and [UI-001](#ui-001) / [RELEASE-001](#release-001) human review. Preserve Recent Activity, legislative changes/substitutes/votes, Calendar coverage and refresh reliability as current-cycle work. Historical DATA-002/DATA-003 remain open below these priorities unless current-session defects emerge. The first real introduced-session observation and roster verification remain under SESSION-003 / SESSION-002. Do not automatically start feature expansion.

## Maintenance rules

- Give each newly approved task a stable category ID; never reuse or renumber an existing ID. Link split/replacement tasks to their original record.
- Keep Proposed ideas distinguishable from approved work. Approval of direction is not permission to implement without a new bounded request.
- Update this backlog at the end of each development batch, including counts, source evidence, changed dependencies and the next recommendation.
- Mark a task complete only after implementation (or the specified investigation/review deliverable) and applicable verification satisfy its acceptance criteria. Move it to the completed ledger with the same ID, completion date, commit and applicable tests/review evidence. Completed is a ledger state, not an active status.
- Completed documentation or a parent phase never closes unresolved child findings. Keep partially resolved conflicts open and describe the remaining scope.
- Blocked items must name the missing evidence or dependency. Record dated rechecks without turning absence of evidence into a factual claim.
- Keep ROADMAP strategic and cross-linked; investigate discrepancies and document the evidence rather than silently changing either source's status.
- Never treat successful deployment as proof of factual completeness, successful scheduled acquisition or accessibility certification.
- Preserve Main-only workflow checks, official source/provenance/history safeguards, current design decisions and explicit public-release approval requirements. Do not automatically implement backlog tasks or create monitoring schedules from this inventory.

## Phase 4I maintenance

ACT-003 and UI-003 complete the authorized activity refinements and shared-header correction. Active counts remain unchanged. TEST-001 is still Blocked pending a subsequent successful actual cron run; no unrelated task was closed. [Evidence](PHASE4I_VERIFICATION.md).


## Phase 4J maintenance

### UI-004

**Consolidated compact interface polish** — **Medium** · **Completed — October 22, 2026**

- **Source:** Owner's Phase 4J request; shared UI-003/ACT-003 behavior remains protected.
- **Dependencies:** Existing shared header, result toolbars, official district-finder fallback and Calendar category definitions.
- **Acceptance:** Compact wrapped navigation with 12–16px gaps where space permits; aligned Activity controls; dynamic directory count/Info/Copy and compact official finder; closer directory columns; compact Calendar filters and accessible six-category Legend. Preserve strict scrolling/pointer tests, privacy, source safeguards, 320–1280px reflow, doubled text and 200% CSS zoom.
- **Completion evidence:** [6ab21ed](https://github.com/utahbug/UtahBills/commit/6ab21ed), production build/integrity checks, new Phase 4J matrix and existing header, Batch 2, toolbar, Phase 4F and Phase 4G regressions. [Detailed verification](../VERIFICATION.md#phase-4j--consolidated-ui-polish).

Active inventory remains 37 with unchanged statuses/priorities. TEST-001 remains blocked on a subsequent genuine scheduled run. LEG-001 is not completed by relocating its official-link fallback. All unfinished historical, 2027 roster/introduction, Calendar expansion, human accessibility and editorial-review IDs remain open. Phase 4J explicitly restores a visible Category label after Phase 4I's caption-free treatment; accessible naming remains unchanged.

## Phase 4N maintenance

Bounded investigation complete; upstream omission remains unresolved. No parser/workflow defect or new introduced 2027 measure was established. Three new feed requests and one revised title were preserved as diagnostic evidence, not imported into the verified catalog. TEST-001, SESSION-002, SESSION-003 and TRANS-001 remain open in their existing statuses; TRANS-002 is not started. Active inventory remains 37, with unchanged counts/priorities. [Findings, preserved sources and targeted verification](PHASE4N_VERIFICATION.md). November 4 remains a planning target, not a promised release.

## Phase 4O maintenance

Owner-authorized bounded partial publication is implemented under TEST-001 reliability work: 270 verified requests of 271 raw records; DYVEPWTRCQ remains explicitly withheld. Complete raw evidence and all historical guards remain; a missing previously verified status still fails publication. [Policy, alternatives, recovery tests and limitations](PHASE4O_VERIFICATION.md). This supersedes Phase 4N’s all-or-nothing policy only for bounded first-status omissions. TEST-001 remains High/Blocked pending genuine scheduled evidence and full acceptance; no task is prematurely closed. Active counts/priorities remain unchanged. SESSION-002/003, TRANS-001/002 and all historical/human-review dependencies remain open.

## Phase 4P maintenance

[Source-observed records and verification](PHASE4P_VERIFICATION.md): eligible bounded first-status omissions are now discoverable separately from the verified subset, with neutral flags, explicit counts, source provenance and stable observation/recovery history. Phase 4O public-invisibility wording is superseded only for this qualified presentation; all acquisition bounds and safety gates remain. The latest recheck has 273 feed / 270 status records, exceeding the 1% bound; acquisition was rejected and the published 271 source / 270 verified / one observed snapshot retained. TEST-001 remains High/Blocked; no newer schedule was present. Active inventory remains 37 with unchanged priorities/statuses; no unrelated task is closed.

## Phase 4Q maintenance

[Independent observations and safeguards](PHASE4Q_VERIFICATION.md) separate source existence from catalog acceptance. The preserved 273/270 pair remains rejected by the unchanged catalog limits, but its validated missing-first-status observations can be published independently. Latest evidence is 273/271: DYVEPWTRCQ is now verified In Process; two requests remain explicitly unconfirmed. All 273 are discoverable with separate counts/provenance and preserved observation history. Workflow reporting and refresh-health failure remain independent. TEST-001 stays High/Blocked pending genuine scheduled evidence; active inventory remains 37 with unchanged task statuses/priorities. No unrelated task is closed.
