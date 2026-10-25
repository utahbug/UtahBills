# Human acceptance review package — Phase 4S

Prepared October 23, 2026. **All human reviews are pending.** Codex's source extraction, checksum checks and automated tests are preparation, not independent editorial approval or physical-device accessibility acceptance. November 4 remains a planning target; no release is authorized.

## Start here

1. Owner assigns independent editorial reviewers and device/assistive-technology reviewers, supplies devices and agrees on the supported browser scope.
2. Editorial reviewer opens a packet below, confirms the exact source hash/version, reads the verbatim existing explanation, compares the mapped statements and full section views with original XML, then fills its acceptance record. Review proposed wording separately from outcome/current-law claims. Do not replace an older explanation's source with later enrolled text.
3. Owner completes real send/receipt testing and staffing for the approved temporary Contact email under the [correction procedure](CORRECTIONS.md). The [correction log](CORRECTION_LOG.md) is prepared without invented entries.
4. Device reviewers copy an [environment run record](ACCESSIBILITY.md#run-record--copy-for-each-environment), execute assigned task cards and record actual outcomes, failures and retests. Unexecuted rows stay N/pending.
5. Return completed records through the owner-designated arrangement. Preserve review dates, commits, evidence and unresolved findings; do not edit pending results into “passed” based on automated checks.

## Editorial packets and acceptance records

| Packet | Exact explanation source | Human disposition |
| --- | --- | --- |
| [HB0011](HB0011.md) | HB0011 introduced | Pending |
| [HB0154](HB0154.md) | HB0154S01 first substitute | Pending |
| [HB0155](HB0155.md) | HB0155 introduced | Pending |
| [SB0069](SB0069.md) | SB0069S02 second substitute | Pending |

Each packet includes the unchanged summary and extra explanation, official/preserved links, full SHA-256 and retrieval time, section prompts, reconstructed-before/proposed passages, separate final-action evidence and a writable acceptance table. Collapsed passage views keep the worksheet short while retaining all pinned sections. The original XML remains authoritative. The parser is the existing `scripts/xml_text.py`; it reconstructs proposal text and is not a legal opinion. Hashes authenticate preserved bytes, not correctness of an interpretation.

Review attention points include HB0011's inspection qualifications; HB0154's two occurrences of 63I-2-273 and split effective dates; HB0155's supplier/customer scope and non-passage; and SB0069's second-substitute opt-out qualifications versus its separately enrolled version. These are questions for independent confirmation, not newly declared defects or approved interpretations.

## Baseline and existing evidence

Fetched clean main/origin/main at `e7dd8321c7b5c6e713b078a65b19d345e0051792`. [Phase 4R deployment 40030306553](https://github.com/utahbug/UtahBills/actions/runs/40030306553) succeeded, including all 29 browser suites and required integrity/build gates. Phase 4R's first run blocked on the old exact About-content fixture; its bounded expected-text correction passed the retained assertion and final CI. This is resolved validation evidence, not an open application defect.

One scheduled-history check found no newer execution than failed [39993137239](https://github.com/utahbug/UtahBills/actions/runs/39993137239). Calendar acquisition/tests/publication succeeded in that run, catalog failed, dependent text/votes were skipped and refresh-health failed. The independent observation channel postdates it. TEST-001 remains High/Blocked; no manual refresh or new official-source acquisition was performed for this preparation. [Readiness assessment](../PHASE4R_READINESS.md) and [Phase 4Q safeguards](../PHASE4Q_VERIFICATION.md) retain component distinctions and limits. Recheck only for an active schedule before push so it is not interrupted.

## Release-critical findings and evidence gaps

| Classification | Finding / evidence | Action |
| --- | --- | --- |
| Confirmed unresolved release-critical functionality/accessibility defects | **None newly established in this documentation review.** Existing Phase 4R automated evidence passed; this does not prove full conformance or absence of untested defects. | If a reviewer reproduces one, record exact steps/evidence and the smallest correction; do not redesign broadly. |
| Missing human acceptance evidence | RELEASE-001 independent review/correction operation and UI-001 physical-device/AT acceptance remain unperformed. | Complete pending records and material retests; these are evidence gaps, not confirmed functional failures. |
| Reliability acceptance gap | TEST-001 lacks a qualifying subsequent actual schedule; source acquisition can fail while independently valid data deploys. | Inspect real scheduled component reports, preservation and publication; do not close RELEASE-002 in advance. |
| Disclosed legislative-data limitations | Phase 4R's 273 visible requests, 272 verified statuses and one unconfirmed status; zero retrieved introduced 2027 measures; no established 2027 roster/live text acceptance; bounded historical comparisons, five vote conflicts and unresolved historical identities. | Keep source/date qualifications and unresolved IDs. These dated saved counts were not re-fetched in Phase 4S and must not be represented as a new live check. |
| Deferred cosmetic/information-design work | Bills-page information architecture, navigation movement, sponsor sorting and Recent Activity layout refinements remain deferred as instructed. Existing other deferred backlog work is retained. | No implementation or status promotion; require separately scoped authorization. |

No code correction is justified by newly reproduced evidence in this phase. No application, source snapshot, acquisition policy, layout, workflow, domain, DNS, refresh frequency or indexing change is made.

## Human and owner decisions still required

- Choose independent reviewer(s), record relevant expertise and independence from authoring, and schedule all four explanation reviews.
- Verify delivery to the approved temporary contact address and assign monitoring, maintainer/backup and reviewer responsibilities. Approve any response targets and notification arrangements; none is promised.
- Supply physical iPhone/iPad and desktop/AT environments; assign all task cards, evaluate remaining WCAG scope and sign acceptance after corrections/retests.
- Assess the next qualifying schedule and first real 2027 introduction/roster evidence when available; accept disclosed limitations explicitly without inventing missing evidence.
- Keep RELEASE-001, UI-001, TEST-001, RELEASE-002 and RELEASE-004 open until their real criteria are satisfied. Only the owner can explicitly authorize public release after dependencies; preparation is not approval.

Main remains the sole deployment at the current GitHub Pages address. Review stays unconfigured; bills.utahbug.com remains a future plan. Static noindex/nofollow, preserved source/history records and guarded atomic retention remain unchanged.

## Preparation verification

Focused checks verify the four original XML hashes and metadata pins, exact copied explanation text/version, complete ordered section extraction using the existing parser, relative document targets and unchanged task IDs. No redundant local browser suite, screenshot or new build is necessary for documentation-only changes. Mandatory CI remains unchanged for publication. Final commit/deployment evidence is supplied in the Phase 4S completion report and its Actions run.
