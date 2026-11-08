# Official descriptions before bill introduction — investigation

Investigated November 5, 2026 (America/Denver). Documentation only. No application, published data, acquisition, indexing or hosting changes. Implementation requires owner approval.

## Finding and coverage

Meaningful official descriptions exist before bill numbers are assigned. They can support a bounded, reviewed description feature, but the current request feed does not itself provide summaries or draft-document cross-references.

This investigation inspected nine official October 21–22 committee/commission meeting-material inventories, 20 distinct 2027 draft proposals and one version-comparison PDF. Every draft contains an official General Description and Highlighted Provisions. The [evidence inventory](evidence/REQUEST_DESCRIPTION_INVESTIGATION.json) records original URLs, meeting IDs, retrieval timestamps, SHA-256 hashes, draft titles/sponsors and candidate request IDs. Raw PDFs and meeting JSON are retained locally under `test-results/request-description-audit/`; the small manifest is committed, the raw audit folder is not.

The comparison baseline is the genuine November 5 scheduled attempt's 281-request official response, SHA-256 `85e9f7a95b2fb7ae928199bab3a4bce82f7f9d47e89e4838eeaac17c16813443`. That attempt did not publish. Production and GitHub still have their separately documented snapshots. These results are a bounded lower-bound investigation, not a count of every description available statewide or a new production observation.

- **20** distinct official draft descriptions confirmed at document level.
- **13** current saved requests have corroborated candidates with an exact unique title, explicit 2027 draft session and matching recorded sponsor identity. One is now abandoned in the November 5 status evidence, leaving 12 In Process candidates.
- **0** direct tracking-ID-to-draft cross-references found in the inspected material/document records. The 13 compound-evidence candidates require an explicitly accepted manual association rule and reviewer disposition before publication. They are not 13 machine-verified joins.
- **0** descriptions approved for publication by this investigation. Four title matches lack sponsor corroboration, one has a title discrepancy, and two have no exact request-title match.

[Utah Ledger](https://utahledger.com/politics/bills/upcoming) was used only to discover official documents. No Ledger summary was imported or treated as evidence. Its collection is not the full request catalog.

## Original source types and examples

| Source type | Verified example and use | Boundary |
| --- | --- | --- |
| Official agenda PDF | [Transportation agenda, items 6–7](https://le.utah.gov/interim/2026/pdf/00003587.pdf) describes intended commercial-license and motorcycle changes and names presenters. | A scheduled discussion is not proof of occurrence, approval, introduction or enactment. A presenter is not automatically the sponsor. |
| Versioned draft legislation | [Commercial Driver Licenses Amendments](https://le.utah.gov/interim/2026/pdf/00003714.pdf), first page, identifies 2027, Candice B. Pierucci and draft `0516.hv..11`. Its provisions cover the limited-term commercial-license program and treatment of existing licenses. | A drafting file/version is not a bill number. Preserve the exact PDF/version and its complete qualifications. |
| Official meeting-material JSON | [Transportation meeting 20656](https://glen.le.utah.gov/committees/meeting/20656/1234) links the exact V005 motorcycle draft, V011 commercial-license draft and separate supporting presentations. The endpoint is called by the public committee page. | A stable meeting/document relationship is available, but the response does not expose request tracking IDs. Treat endpoint/schema changes and HTTP-200 rejection pages as failures. |
| Minutes and staff highlights | [Transportation minutes](https://le.utah.gov/interim/2026/html/00003920.htm) identify the discussed draft versions and recorded motions. [October Interim Highlights](https://le.utah.gov/interim/2026/pdf/00003922.pdf) summarizes committee work and lists committee files as of October 23. | Preserve whether minutes are draft or approved. A committee recommendation is not legislative passage. Recheck final minutes before asserting final committee history. |
| Supporting/comparison documents | [Professional Licensing comparison](https://le.utah.gov/interim/2026/pdf/00003877.pdf) is explicitly a v019/v020 comparison; its disclaimer warns of possible inaccuracies. Meeting materials also list an OLRGC motorcycle-safety presentation. | Distinguish staff, agency and outside-presenter authorship. A hosted presentation is not authoritative bill text; a comparison never replaces its original versions. |

Representative official detail exceeds a title paraphrase. The [Motorcycle draft](https://le.utah.gov/interim/2026/pdf/00003590.pdf) covers lane filtering, lighting and rider education. The [Portable Solar draft](https://le.utah.gov/interim/2026/pdf/00003642.pdf) specifies device standards, inspection and enforcement. The [Health Profession draft](https://le.utah.gov/interim/2026/pdf/00003639.pdf) addresses licensure/certification and medication administration. Each description must remain tied to that proposal version.

## Candidate request inventory

These are corroborated candidates, not approved application associations. Sponsor ID/name reconciliation used the saved official request/status evidence and existing source-backed identity mapping, without asserting 2027 roster membership.

| Candidate tracking ID | Request title | Draft PDF | Recorded sponsor ID |
| --- | --- | --- | --- |
| OWJRIPTDEL | National Register Review Committee Sunset Amendments | 00003634 | KWANK |
| VVARFIFFUT | Sunset Extension for Service Programs | 00003636 | KWANK |
| AYWKMFJYRV | Criminal Provision Technical Corrections | 00003701 | MUSSECR |
| NHLSKTLQND | Domesticated Elk Advisory Council Sunset Extension | 00003628 | OWENSD |
| LMQXRESDLY | Land Conservation Board Amendments | 00003629 | SHIPPRP |
| WJBCAUWMWD | Motorcycle Amendments | 00003590 | BROOKW |
| BBGNDHWWWU | Commercial Driver Licenses Amendments | 00003714 | PIERUC |
| YQAFXESDQS | Professional Licensing Modifications | 00003876 | THURSNK |
| UNITKLDLTU | Health Profession Licensing Modifications | 00003639 | WARDR |
| ABSFQKHOTI | Portable Solar Device Amendments | 00003642 | JACKC |
| HDVNLOGBLV | Groundwater Management Amendments | 00003630 | SHIPPRP |
| BSDHEWBYIL | Water Rights Restricted Account Amendments | 00003631 | ALBRECR |
| TFEMJWKJCF | Transfer of Water Interests | 00003633 | OWENSDO |

Groundwater Management is **Bill Abandoned per Sponsor** in the November 5 saved official status listing. An earlier draft remains historical evidence and must not imply the proposal is currently progressing. The listed status is not a claim about later unobserved official changes.

Unresolved cases:

- **OOKJOEVXNM — Tax Amendments; QWUGWFWJPU — Health Professions Licensing Amendments; BXGJYEIWSS — Property Management Amendments; OCNBFSIKLV — Open and Public Meeting Modifications.** Exact titles match, but both draft and request omit a chief sponsor. Matching blanks are not corroboration. Require an explicit identifier cross-reference, official committee-file relationship or written authoritative clarification.
- **RQTBAXTKDP — Resource Development Coordinating Committee Sunset Extension.** The official meeting material description uses this title, while linked PDF 00003626 says “Resource Development Coordinating Committee Amendments.” Sponsor and subject agree. Preserve both titles and the explicit material-to-PDF link; require reviewed reconciliation rather than silently renaming the request.
- **Precipitation Capture and Storage Amendments** (00003625) and **Colorado River Authority Membership Amendments** (00003632) have no exact title match in the 281-request snapshot. Do not manufacture a request or link a similar title.
- **Optometry Practice Amendments** appears on the Business and Labor agenda but was absent from that meeting's retrieved draft-material list and the inspected request snapshot. An agenda description does not establish a current matching request.
- The agenda's shortened “Health Licensing Modifications” wording is resolved at document level by the exact linked draft title and named chief sponsor; it does not independently create a tracking-ID cross-reference.

## Recommended identity and source rules

1. Prefer an official source explicitly binding the session-qualified request tracking ID to a draft URL/file identifier. Reject duplicate, contradictory or missing identifiers. Never convert drafting file codes such as `0516` or `FL0052` into HB/SB numbers.
2. If that cross-reference is unavailable, permit only an owner-approved **manual** association record supported by the exact unique official title, matching established sponsor identity, explicit session, official meeting-to-draft linkage and absence of conflicting records. Record reviewer, date, evidence URLs/hashes and reason. Similar titles, a shared topic, presenter names or two blank sponsors are insufficient. Title discrepancies require separately documented authoritative reconciliation.
3. Pin each displayed description to immutable source bytes, session, draft identifier/version, page/line range and successful verification timestamp. Keep document date/time separate from retrieval and meeting dates; do not invent a timezone for the PDF's unlabeled draft timestamp. Failed checks never advance freshness.
4. Start with official General Description and complete relevant Highlighted Provisions. Preserve exceptions and nested bullets. Label any later paraphrase as UtahBills explanation, pin its claims and require independent editorial review. Do not extrapolate legal effects from a title or broad agenda sentence.
5. Preserve earlier evidence when a draft is revised, removed or abandoned. Document-level availability must not overwrite the independently verified request status. Fail closed on contradictory session/title/sponsor/version or unreadable source; retain a readable official link and an explicit coverage limitation.
6. Keep the description component independent of catalog, Calendar, observation, text and archive refresh. A missing supplemental description must neither invalidate an otherwise verified request nor turn an unverified association into a published description. Corrupt accepted evidence must block replacement of that description snapshot.

## Transition after introduction

Use the existing official exact-tracking-ID conversion to a session-qualified introduced bill. Preserve the request identity, original draft history and bookmarks. Acquire and verify the introduced version through the existing text pipeline, then show that version's official General Description/Highlighted Provisions as the primary bill summary. Keep the pre-introduction description clearly labelled historical. Do not carry draft claims into an introduced, substitute or enrolled version without re-verification. New versions invalidate explanation currency, not preserved history. SESSION-003 still requires the first genuine introduced 2027 record; the inspected saved index is empty.

## Proposed compact presentation and reuse

On a request detail, after identity/status:

**Official draft description** · 2027 draft · version [verified label]

[Exact official General Description]

**Highlighted provisions** [compact bullets; expandable when long]

Source: [official PDF, page] · Last verified by UtahBills: [supported time and timezone]

Draft proposal; not introduced legislation. [View source] [Earlier drafts]

If only an agenda is available, label the section **Official committee description** and identify the meeting/date and its limited evidence. If no verified association exists, omit the description and retain the official request link. Do not add a speculative empty-state explanation or a large listing card.

Reuse the enhanced 2026 page's compact summary layout, ordered/nested provisions, progressive disclosure, exact-version pin, source links, accessible reader links and review-status disclosure. See [Phase 5E](PHASE5E_VERIFICATION.md), [Phase 5G](PHASE5G_VERIFICATION.md), [summary evidence pins](../data/summary-evidence.json) and [editorial review requirements](review/README.md). The four existing explanations are curated, AI-assisted and still awaiting independent editorial acceptance. `scripts/analyze.py` is not a generic automatic summarizer. Its XML formatting guarantees cannot simply be applied to PDFs. Start with verified text plus the original PDF; full PDF change-markup rendering is separate work.

## Complexity, dependencies and proposed approval boundary

A small manually reviewed pilot is moderate work. Broad automatic coverage is substantially harder because request-to-draft cross-references are absent, PDFs vary, descriptions can span pages, names/titles change and committees revise or replace materials. Some official committee-page requests returned an HTTP-200 rejection document while the published material endpoint and PDFs remained accessible. Content/schema checks are essential; do not bypass access controls.

Coordinate with **CAL-004** (agenda/draft/PDF coverage), **TRANS-002** (formatted analysis), **TRANS-001** (version changes), **DATA-005** (record freshness), **SESSION-003** (introduction identity), **RELEASE-001** (editorial review) and **TEST-001/RELEASE-002** (refresh reliability). No task is closed and no new implementation is authorized by this report.

Owner decisions before implementation: accept or reject the compound-evidence manual association rule; designate an independent reviewer; approve a small explicit pilot list and official-excerpt presentation; decide how supplemental acquisition will be monitored. Preserve the next genuine scheduled-refresh verification as the operational priority. No GitHub Pages or Cloudflare deployment is part of this investigation.

## Documentation verification

Relative links, all 21 retained PDF hashes, the nine-meeting inventory, 13 corroborated-candidate count and absence of request tracking IDs in extracted draft text were checked. All draft documents have General Description and Highlighted Provisions sections. Representative first pages were visually inspected, including the title-discrepancy example. Existing UTF-8/generated-analysis verification and Git whitespace checks passed. No new application tests, builds or deployments were run for this documentation. The separately authorized PR #5 CI/deployment is recorded in the handoff.
