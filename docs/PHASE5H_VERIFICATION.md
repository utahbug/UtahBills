# Phase 5H — Simplified legislative voting presentation

October 26, 2026 (Mountain). Baseline: clean synchronized `main` at `70f72a3768fbb409b15505fd56bbcca6df47d53c`, successfully published by [run 40395631414](https://github.com/utahbug/UtahBills/actions/runs/40395631414). Latest genuine scheduled run remains [40380145137](https://github.com/utahbug/UtahBills/actions/runs/40380145137). No scheduled acquisition was active at the initial check. This is a scoped presentation batch, not source acquisition or TEST-001 acceptance.

## Presentation and evidence

The enhanced-page overview now uses one native `ul` with `li` entries. Descriptions inherit Bill Summary body typography at regular weight; supporting tallies/referral information sit directly beneath each description in slightly smaller muted text. Only the existing section heading remains. No status icons, badges or manually positioned bullets were added.

The existing verified vote-selection function is unchanged: exact bill/session identity, verified detail state, dated decisions and separate committee/floor/concurrence classifications still govern inclusion. H.B. 154 retains committee 12–0–2, House third reading 48–22–5, and a Senate no-final-passage-record qualification with the source-supported committee referral. H.B. 155 has no invented tallies. S.B. 69's committee recommendations, two chamber decisions and Senate concurrence remain separate entries; its enrolled text is not substituted for the pinned explanation.

Dates, full committee names, original source links, technical motions, complete decisions and individual records remain in the existing detailed entries. The longer missing-vote and coverage/enactment qualifications now appear in expanded Votes. The compact overview retains essential missing-vote, saved-coverage and voice-vote qualifications. Fetch failure still says evidence could not be loaded; it does not assert that no vote occurred.

Only enhanced pages omit the inner Votes heading, because their native outer disclosure supplies it. Loading, success and error share this conditional heading treatment. The inner section has the accessible name Detailed voting records. Basic bill pages retain their existing Votes heading. The detailed-entry renderer and individual-vote/source disclosures are unchanged.

Bill Summary, official-summary access, source pins, all four default-collapsed major sections, statutory comparison, reader and ancestor-opening navigation remain unchanged. Application changes are limited to `votes.js` and related voting CSS.

## Verification

- Source checksum/session/version/summary validation and all three `tests/vote_data.py` integrity tests passed. Unchanged saved projections were reused; only the UI bundle and stylesheet were rebuilt locally. Mandatory CI retains the complete production build and integrity gates.
- New `tests/phase5h.mjs` passed: all four enhanced records; exact HB0154 list/tallies; no invented HB0155 result; distinct SB0069 concurrence; all saved individual rows, dates, full committee/body names, motions and official links in complete detailed records; no duplicate heading during loading/success/error; disputed-record withholding; unchanged basic-page heading; keyboard focus and sticky-header clearance.
- Responsive checks cover 320, 390, 768, 1024 and 1280 CSS pixels, normal and doubled text, semantic lists, matching body fonts, regular descriptions, smaller supporting text, aligned content, no horizontal overflow and automated WCAG A/AA checks.
- Representative 390px and 1280px rendered screenshots were inspected; bullets and their supporting lines align with the summary list convention.
- Retained Phase 5G verification passed and covers exact summary/pinned official text, disclosures, reader/history navigation, supported 200% CSS zoom, and its model-level identity/date/procedural/voice/failed-vote safeguards. No valid assertion was weakened.
- Required CI and post-publication asset/route results accompany delivery. Resolve this implementation commit with `git log -1 --format=%H -- docs/PHASE5H_VERIFICATION.md`.

## Follow-up decisions recorded only

The [authoritative backlog](TASK_BACKLOG.md#phase-5h-follow-up-decisions--documentation-only) adds SHARE-001 (Medium, important pre-session), LEG-004 (approved directory spacing/alignment refinement), ACT-004 (deferred discrepancy typography), ACT-005 (deferred optional Activity search) and ACT-006 (deferred evaluation of Activity as the session landing page). None is implemented here. Existing unfinished task IDs and statuses remain intact.

## Pending acceptance and release boundaries

Independent human editorial review, physical iPhone/iPad, VoiceOver/NVDA, native browser zoom, TEST-001 evidence review and explicit public-release authorization remain open. Automated accessibility/CSS zoom does not certify these human tasks. Main-only publication, current hosting, source provenance and noindex/nofollow remain. No Bills/archive search, directory, Activity, Calendar, Contact, original data, reconciliation or refresh changes are included.
