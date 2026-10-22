# UtahBills authoritative task backlog

Updated: October 22, 2026. Application: **UtahBug**. This is the authoritative inventory of unfinished approved work, proposed ideas and deferred enhancements. [ROADMAP.md](../ROADMAP.md) remains the high-level strategy; this file supplies stable task IDs and acceptance criteria. Recording approval of a direction does **not** authorize automatic implementation.

## Baseline and evidence

Before this documentation batch, fetched `main` and `origin/main` both pointed to [af26e785e5d9f9acca5ee7cb4f2e00bb1b1c9759](https://github.com/utahbug/UtahBills/commit/af26e785e5d9f9acca5ee7cb4f2e00bb1b1c9759); working tree clean, zero commits ahead/behind. Latest push deployment [39860908975](https://github.com/utahbug/UtahBills/actions/runs/39860908975) succeeded. No scheduled data commit had advanced that handoff. GitHub issue inventory (all states) was empty. `docs/CODEX_HANDOFF.md` was absent.

Read [AGENTS.md](../AGENTS.md), [ROADMAP.md](../ROADMAP.md), [README.md](../README.md), [VERIFICATION.md](../VERIFICATION.md), [QUALITY_AUDIT.md](QUALITY_AUDIT.md), the workflow and relevant existing implementation/tests. Source counts below are dated audit/snapshot evidence, not a new live-source acquisition. This batch changes documentation only; it does not perform a refresh or start any task below.

“Backlog approval” references the owner's **UtahBills — Create and Maintain Authoritative Task Backlog** request, received October 22, 2026, especially §§4 and 8. It explicitly adds Find My Legislators and the remaining Calendar refinements. Existing roadmap **Planned** items retain approved direction; audit opportunities remain Proposed.

## Status and priority

Active inventory: **40 tasks**. Completed batches below are excluded from these counts.

| Status | Count |
| --- | ---: |
| In progress | 0 |
| Approved/Not started | 29 |
| Proposed | 2 |
| Blocked | 6 |
| Deferred | 3 |

| Priority | Count |
| --- | ---: |
| Critical | 0 |
| High | 3 |
| Medium | 31 |
| Low | 6 |

Priority is a planning order, not a new defect-severity finding. Blocked tasks remain approved work whose completion requires the stated evidence/dependency; bounded investigation may continue when separately scoped. No critical defect was established by Phase 4C.

## 1. Legislative data integrity and accuracy

### DATA-001

**Restore verified 2027 request freshness** — **High** · **Blocked**

- **Dependencies:** Official request/status sources must reconcile; TEST-001 validates subsequent publication.
- **Source:** [Audit H2](QUALITY_AUDIT.md#h2--new-official-requests-are-not-yet-safely-publishable--open-upstreamfreshness); backlog approval §4.
- **Acceptance:** Recheck and preserve both official responses; reconcile every exact tracking ID and normalized title; pass existing safeguards and publish only the validated snapshot with truthful dates. Audit observed 268 requests versus 267 status rows, missing MDIQORVFRP; Main retains 255. These are October 22 observations, not fixed expected counts. Never infer the missing status, omit the request, or bypass fail-closed behavior.

### DATA-002

**Resolve five official vote conflicts** — **High** · **Blocked**

- **Dependencies:** Authoritative clarification or corrected, preserved official evidence.
- **Source:** [Audit H3](QUALITY_AUDIT.md#h3--five-contradictory-official-vote-totals--open-preserved); [Phase 4A evidence](../data/phase4a-evidence.json).
- **Acceptance:** Resolve each of HB0117/39191, HB0117/39193, HB0264/38981, SB0141/38882 and SJR006/41466 with recorded evidence and reproducible tally tests. Preserve conflicting originals, warnings and withheld individual attribution until each correction is justified; minutes alone do not erase action conflicts.

### DATA-003

**Verify historical voter identities** — **Medium** · **Blocked**

- **Dependencies:** Authoritative historical alias evidence applicable to the affected records.
- **Source:** [Audit M2](QUALITY_AUDIT.md#m2--historical-identity-and-future-roster-remain-incomplete--open); [Phase 4A verification](../VERIFICATION.md).
- **Acceptance:** Account for all 1,046 unresolved Walter, N. entries. Record the scope and sources of any verified alias; test chamber, district and historical identity checks and ambiguous cases. Retain original names and unresolved links where evidence is insufficient; do not infer aliases or use successors.

### DATA-004

**Establish vote coverage beyond action-history references** — **Medium** · **Approved/Not started**

- **Dependencies:** Bounded official-source inventory and identity verification; DATA-002 and DATA-003 remain explicit limitations.
- **Source:** [Roadmap Stage 1](../ROADMAP.md#stage-1--legislative-data-and-transparency--partly-implemented).
- **Acceptance:** Define and report the independently verified coverage boundary, preserve newly acquired originals, reproduce classifications/tallies, and disclose missing or conflicting records without claiming every vote is recorded.

## 2. 2027 legislative-session readiness

### SESSION-001

**Test the public-request to introduced-bill transition** — **Medium** · **Approved/Not started**

- **Dependencies:** Isolated valid future-session fixtures; complete before the first introduced 2027 records arrive.
- **Source:** [Audit M4](QUALITY_AUDIT.md#m4--some-ui-tests-still-assume-a-request-heavy-default-session--open-future-transition); [Roadmap Phase 4C](../ROADMAP.md#phase-4c--independent-technical-audit).
- **Acceptance:** Remove request-only and fixed 50/100/200-row assumptions from default-session scenarios. Exercise zero, one and multiple introduced records across usability/toolbar suites, exact-ID request conversion, preserved request history and 2026 session access. Keep large-page preference tests isolated from changing live counts; do not hold back valid measures.

### SESSION-002

**Verify and publish the official 2027 roster** — **Medium** · **Blocked**

- **Dependencies:** An authoritative published 2027 session roster, rather than current contacts or request sponsors.
- **Source:** [Roadmap Stage 2](../ROADMAP.md#stage-2--legislator-directory--partly-implemented); [Audit M2](QUALITY_AUDIT.md#m2--historical-identity-and-future-roster-remain-incomplete--open).
- **Acceptance:** Preserve dated membership evidence and stable IDs; verify chamber/district membership and associations; test directory, sponsor and vote links. Preserve 2026 history and separately dated current contacts. Unverified membership remains unavailable.

### SESSION-003

**Review early-session source completeness** — **Medium** · **Approved/Not started**

- **Dependencies:** Published early-session sources; DATA-001, SESSION-001 and SESSION-002 constrain the claims that can be made.
- **Source:** [Roadmap Stage 1](../ROADMAP.md#stage-1--legislative-data-and-transparency--partly-implemented).
- **Acceptance:** Cross-check official index/listing and acquired details, request joins, versions, actions and vote references; document gaps and failure recovery. Verify first real request conversion when available. Empty indexes and incomplete rosters never become completeness claims.

## 3. Interface, usability, and accessibility

### UI-001

**Complete human and physical-device accessibility acceptance** — **Medium** · **Approved/Not started**

- **Dependencies:** Physical iPhone/iPad access and manual VoiceOver/NVDA reviewers.
- **Source:** [Audit M3](QUALITY_AUDIT.md#m3--human-accessibility-and-editorial-review-remain-unperformed--open-validation-gap); [Roadmap Stage 6](../ROADMAP.md#stage-6--public-release-preparation--planned); backlog approval §4.
- **Acceptance:** Record devices, browsers, assistive technologies and a WCAG 2.2 AA acceptance matrix. Traverse all routes by keyboard; check focus order/visibility and sticky obstruction, headings/rotor, calendar weekday context, Info, Copy fallback/announcements, long readers/vote tables, actual zoom and reflow. Log and retest failures before closing; automated axe results alone are insufficient.

## 4. Legislative Calendar

### CAL-001

**Refine deadline typography and milestone labels** — **Medium** · **Approved/Not started**

- **Dependencies:** Preserve official wording, qualifications and date uncertainty; retain completed Phase 4B grid.
- **Source:** Backlog approval §4 (Calendar refinements); [Phase 4B verification](../VERIFICATION.md).
- **Acceptance:** Use normal-weight lengthy deadline descriptions and a compact accessible deadline icon/label. Simplify awkward milestone labels without inventing date/time precision. Preserve complete official wording and qualifications; verify keyboard/screen-reader labels and narrow/enlarged-text layouts.

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

**Find My Legislators by address** — **Medium** · **Approved/Not started**

- **Dependencies:** Verified authoritative legislative district boundaries/lookup, applicable dates, matching roster and defined address privacy handling; SESSION-002 for 2027 claims.
- **Source:** Backlog approval §4 (Find My Legislators); [existing directory scope](../README.md#batch-2b--expanded-discovery).
- **Acceptance:** Return the user's Utah House representative and state senator from authoritative address/district evidence. Test boundary, ambiguous, invalid and out-of-state addresses with clear source/date/error disclosures. Exclude voter registration, party affiliation and voting instructions; never guess a district or member.

### LEG-002

**Add verified historical contact snapshots** — **Medium** · **Approved/Not started**

- **Dependencies:** Dated official historical contact records.
- **Source:** [Roadmap Stage 2](../ROADMAP.md#stage-2--legislator-directory--partly-implemented).
- **Acceptance:** Preserve historical source dates and stable-ID associations; distinguish historical contacts from current contacts in display and tests. Keep unavailable records explicit, including BURTOJS, CLANCT, GWYNNM and LEETA where evidence remains absent; never substitute a successor.

## 6. Additional bill transparency and legal resources

### TRANS-001

**Verify substitutes and late-change histories** — **Medium** · **Approved/Not started**

- **Dependencies:** Verified version relationships and publication evidence; reliable timing cannot be inferred from retrieval.
- **Source:** [Roadmap Stage 1](../ROADMAP.md#stage-1--legislative-data-and-transparency--partly-implemented); [README limitations](../README.md#data-findings-and-limitations).
- **Acceptance:** Trace substitutes, amendments, late changes and any proposed boxcar characterization to preserved exact versions and defensible timing. Distinguish document/action/retrieval dates, disclose unknown publication times, and test comparisons without motive or unsupported legal-effect claims.

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

**Verify the next scheduled refresh end-to-end** — **High** · **Approved/Not started**

- **Dependencies:** A subsequent scheduled run after the Phase 4C correction; catalog publication depends independently on DATA-001.
- **Source:** [Audit H1](QUALITY_AUDIT.md#h1--calendar-regression-blocked-scheduled-publication--corrected); [workflow](../.github/workflows/pages.yml).
- **Acceptance:** Record run ID, Calendar acquisition outcome, attempt reports, source provenance, validation, snapshot commit and deployed freshness. Confirm the Calendar refresh passes the corrected regression and publishes verified updates. Record catalog/archive outcomes separately even if retained data deploys. A successful push build is not this evidence; leave any failed acquisition open.

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

## Completed development batches and preserved decisions

These batches are completed; their unresolved findings remain in the active inventory. Historical batch IDs below are completion records, not additional active tasks.

| Batch | Completed scope | Commit evidence | Applicable verification |
| --- | --- | --- | --- |
| Phase 4A | Banner/visible prototype-label removal, compact top spacing, Main footer identification; bounded vote/identity investigation without unsupported corrections. | [5a151bc](https://github.com/utahbug/UtahBills/commit/5a151bc08af4361aadc4adfea273d561f0d6d276), byte-preservation follow-ups [283d3a2](https://github.com/utahbug/UtahBills/commit/283d3a2), [13314c4](https://github.com/utahbug/UtahBills/commit/13314c4), reflow correction [8e46916](https://github.com/utahbug/UtahBills/commit/8e469161ce42a33fecac890910dd0ec3358c753f). | [Phase 4A browser checks](../tests/phase4a.mjs), [foundation integrity](../tests/foundation_data.py), production build and 15 browser suites; [verification record](../VERIFICATION.md). |
| Phase 4B | Compact interface, navigation and Calendar layout; consolidated About & FAQ and contextual guidance. | [1ff2b05](https://github.com/utahbug/UtahBills/commit/1ff2b05dceeab42e1738bbf0a5fa5a41fba1fb7a). | [Phase 4B checks](../tests/phase4b.mjs), production build, integrity tests and 16 browser suites; [verification record](../VERIFICATION.md). |
| Phase 4C | Corrected Calendar test assumptions and historical completeness condition; route/recovery checks, audit and future-transition documentation. | [3465244](https://github.com/utahbug/UtahBills/commit/34652442a01de2a73d82d95ce4bc5cc080b73052), [af26e78](https://github.com/utahbug/UtahBills/commit/af26e785e5d9f9acca5ee7cb4f2e00bb1b1c9759). | [Quality checks](../tests/quality-audit.mjs), [Calendar browser regressions](../tests/batch2.mjs), [foundation integrity](../tests/foundation_data.py), build and 17 browser suites; [successful workflow](https://github.com/utahbug/UtahBills/actions/runs/39860908975), [audit](QUALITY_AUDIT.md). |

Confirmed completed design decisions, preserved unless a new request reopens them:

- Session selector precedes Search; compact native controls/results minimize unused vertical space.
- Borderless Copy icons share existing toolbar rows, retaining accessible targets and confirmation.
- About & FAQ is consolidated, with old guide/source routes preserved.
- Raw JSON Contact source links are removed; verified contact data and human-readable biography links remain.
- Recent Activity has clear Previous page / Next page labels and no unnecessary single-page controls.
- Calendar is a continuous semantic grid with integrated weekday headings.
- Contextual Info disclosures replace redundant explanatory sections without deleting source/coverage qualifications.
- Wrapped narrow-screen navigation aligns with the UtahBug wordmark.
- Conservative data handling, exact-ID reconciliation, conflict warnings and withheld unsupported attribution remain in force.

Blue icons, neutral compact design, static `noindex, nofollow`, provenance, historical access and required workflow gates remain protected. Phase 4A explicitly superseded the older Research Prototype banner-retention instruction; removal is complete and is not public-release approval. Main remains the only configured deployment; Review is reserved and unconfigured.

## Documentation reconciliation

- **Older README generalizations:** “Verification and remaining work” still lists individual voting records and live 2027 ingestion as future milestones; “Environment policy” says addresses are planned and deployment unconfirmed. Later Phase 2/Batch 2C records, the actual workflow and the verified successful Main deployment establish implemented referenced-vote coverage, guarded scheduled ingestion and deployed Main. This does not establish live data, complete vote coverage, a verified 2027 roster or successful subsequent scheduled acquisition. This backlog uses that narrower verified state; no completed feature is reopened.
- **Dated snapshots and controls:** earlier README/VERIFICATION sections mention 253 requests, 25-row defaults, older Calendar arrangements and an unconnected 2027 state. Later records document the 255 saved request snapshot, shared page preferences and Phase 4B controls. These historical observations are not permanent current counts or active feature requests.
- **Banner retention:** the early roadmap implemented list mentions the Research Prototype notice. The explicit Phase 4A section and current AGENTS policy supersede it. Keep noindex and substantive disclosures, not the removed banner.
- **Approval not previously itemized:** address lookup and remaining deadline typography/label refinements were not explicit strategic roadmap items. The current owner request approves their direction; [LEG-001](#leg-001) and [CAL-001](#cal-001) preserve that decision. Existing Census district maps do not implement address lookup, and the completed Calendar grid does not complete these refinements.
- **Batch completion versus unresolved findings:** Phase 4C H1/M1 code corrections are complete. H2/H3, identity/roster gaps, M3 human review and M4 transition tests remain open under their task IDs. Phase completion and deployment are not evidence of factual completeness or accessibility certification.

No roadmap item was deleted or silently reclassified. The historical source documents remain available for context; this reconciliation records why the active inventory differs from their older statements.

## Next Recommended Batch

**Recommended, not started: source freshness and scheduled-refresh verification** — scope [DATA-001](#data-001) and [TEST-001](#test-001) together. Recheck official request/status consistency, inspect the first subsequent scheduled Calendar acquisition, retain reports and verify any tested snapshot through publication. If upstream disagreement persists, retain the prior request snapshot and leave DATA-001 blocked while independently reporting Calendar results.

Before introduced 2027 measures arrive, separately scope [SESSION-001](#session-001). Continue to prioritize authoritative vote-conflict evidence and human accessibility/editorial review; do not expand features automatically from this recommendation.

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
