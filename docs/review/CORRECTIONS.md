# Correction-management procedure

Updated October 25, 2026 for RELEASE-001 / Phase 5B. The owner approved **kenroberts@live.com** as the initial contact address for testing, displayed on [Contact](https://utahbug.github.io/UtahBills/#contact). Actual email send/receipt testing remains **pending owner acceptance**. This channel is not independent editorial approval or public-release authorization. [Review package](README.md).

## Approved channel and remaining owner decisions

The application value is centralized in [contact-config.js](../../contact-config.js). The future contact@utahbug.com address is inactive until the owner confirms configuration, testing and approval. No form, submission database or new service is created. No DNS, routing or hosting changes are authorized.

The owner must send and receive a real test message, confirm monitoring, name an intake maintainer/backup and independent editorial reviewer, and assign approval responsibilities. No response-time commitment is approved. The initial substantive public record is [CORRECTION_LOG.md](CORRECTION_LOG.md); no entries or past approvals are invented. Reporter identities and private correspondence must not be published without permission. Store private intake correspondence in the approved mailbox, not GitHub; public evidence must be redacted and limited to what establishes the correction.

## Procedure

1. **Submit:** email the approved address. Helpful but optional details include affected route, bill/session/version, exact disputed wording, expected correction, official URL, section/passage, observed date and reproduction steps for display errors. Include preserved file/hash when available. Distinguish the source's own date from retrieval. Do not collect residential addresses, unnecessary personal information or private credentials. Public reports must redact unrelated personal information.
2. **Register and preserve:** the intake maintainer assigns `COR-YYYY-NNN`, records receipt time and any acknowledgement without promising a response deadline, and preserves the original wording, screenshot where relevant, commit, source bytes/URLs/hash and reported evidence. Retain earlier official versions; never overwrite evidence to make a conflict disappear.
3. **Classify:** use the table below. Record reported versus independently reproduced facts. Unknown cause remains unknown. A mismatch between official sources does not imply wrongdoing. Reject unsupported associations rather than inventing a status, voter identity or legal effect.
4. **Investigate:** the assigned independent human editorial reviewer verifies exact session/version/section and the assertion's meaning; the technical maintainer reproduces projection/navigation errors and checks hashes/guards. The original author or Codex may supply analysis but cannot supply independent editorial approval. An unresolved legal meaning question is escalated to a reviewer with appropriate expertise; it stays unresolved meanwhile.
5. **Prioritize and contain:** material wrong identity/status, unsupported enacted-law claims, fabricated attribution or inaccessible essential information is release-blocking when confirmed. Owner/maintainer decides the smallest evidence-supported correction or temporary qualification/removal, preserving sources and history. Cosmetic issues remain lower priority. Response targets remain an owner decision; none is promised.
6. **Approve:** independent human reviewer approves interpretation/explanation corrections with exact replacement wording and evidence. Technical maintainer approves mechanical corrections with a reproducible check; editorial reviewer also signs if meaning changes. The owner confirms release-impact decisions. No unresolved claim is marked accurate merely because a build passes.
7. **Implement and disclose:** make a bounded commit through existing tests/Main safeguards, avoiding an active schedule. For material corrections, publish the approved correction log entry in CORRECTION_LOG.md: affected version/route, previous and corrected wording, reason, evidence, dates, approving role and commit. Make the correction discoverable from the affected material when warranted; do not quietly rewrite legislative history. Notification channel and privacy scope require owner approval.
8. **Verify and close:** reproduce the original issue on the corrected build, run focused integrity/UI checks, have the reviewer re-read meaning, verify Main against the tested commit and inspect relevant routes. Record CI/deployment and reviewer sign-off. Close only after those checks; reopen if new evidence contradicts the resolution. Recheck summary pins whenever supporting source hashes change.

## Classification and priorities

| Class | Example | Required evidence / handling |
| --- | --- | --- |
| Source discrepancy | Feed identity present, status absent; contradictory official tally | Preserve both originals and dates; qualify/withhold unsupported facts; seek authoritative resolution. Source disagreement is not automatically an application defect. |
| Interpretation error | Explanation overstates an exception or applies a proposal as current law | Exact pinned passage plus independent human assessment; review materiality before release. |
| Presentation error | Correct saved record shown under wrong label or broken source link | Reproduction, affected data/version, expected display and focused regression. |
| Unsupported claim | Status, identity, effective date or causal assertion lacks evidence | Identify absent support; remove or qualify after review, rather than manufacture support. |

Severity is separate from class: **Critical** = confirmed material error causing immediate reliance risk or essential access failure; **High** = material but bounded factual/access error; **Medium** = ambiguity or partial impairment; **Low** = nonessential/cosmetic. A pending review is an evidence gap, not a confirmed Critical defect. Owner/reviewer records rationale; do not auto-close longstanding source discrepancies.

## Correction record template

| Field | Entry |
| --- | --- |
| ID / received / approved intake channel | Pending |
| Reporter role (minimum necessary) / acknowledgement | Pending |
| Route / session / bill / exact version / affected commit | Pending |
| Original wording or reproducible behavior | Pending |
| Official source URL / section / retrieval time / SHA-256 | Pending |
| Preserved evidence path / conflicting source, if any | Pending |
| Class / reported vs reproduced / severity and rationale | Pending |
| Assigned maintainer / independent reviewer / owner decision | Pending |
| Investigation and unresolved uncertainty | Pending |
| Proposed correction / approval role and date | Pending |
| Corrected commit / tests / CI / Main verification | Pending |
| Public log location / material-change disclosure | Pending |
| Re-review findings / reviewer / date | Pending |
| Disposition / closure or reason still open | Pending |

Allowed states: received, investigating, awaiting evidence, correction approved, implemented awaiting verification, resolved, or not substantiated with reasons. None is preselected as resolved.
