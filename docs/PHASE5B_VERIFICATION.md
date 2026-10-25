# Phase 5B — Contact and correction process

October 25, 2026. Baseline: Phase 5A `1d344ff8f5d67f68cb33b062fa71055072c21a29`, successful Main run [40202698123](https://github.com/utahbug/UtahBills/actions/runs/40202698123); clean synchronized `main` before edits.

## Implementation

- [Contact](https://utahbug.github.io/UtahBills/#contact) uses the shared route, page title, main focus, history and footer navigation. No top-navigation destination or new submission service.
- [contact-config.js](../contact-config.js) is the single application email value: owner-approved temporary kenroberts@live.com. The visible/selectable address is also a mailto link with URI-encoded subject “UtahBills — Question or Correction”. Visitors without a configured mail application can copy the address into their own email service. No message is sent by the application or tests.
- Compact optional evidence guidance, privacy reminder and correction explanation distinguish UtahBills errors, official source revisions and unresolved discrepancies. About links to Contact; independent factual approval remains explicitly pending.
- [Procedure](review/CORRECTIONS.md) records the approved testing channel, remaining staffing/receipt decisions, evidence preservation, classification, investigation, approval, bounded implementation and verification. [Correction log](review/CORRECTION_LOG.md) is an empty documented log with a clearly marked template, not invented historical entries. Reporter identity/private correspondence require permission before publication.
- The future contact@utahbug.com address remains inactive. No email routing, DNS, domain, hosting or refresh changes. Main only; noindex/nofollow preserved. Legislative files, explanation pins and histories unchanged.

## Focused verification

`tests/phase5b.mjs` is appended to the mandatory browser chain. It covers all route families (including real saved bill/request/profile details and legacy links), shared footer activation, direct bookmark/reload, Back/Forward, title/heading, active footer state, main focus and keyboard-visible email focus. It validates the exact mailto address/decoded subject and encoded em dash without activating an email client, and verifies text selection and the no-mail-client instructions.

Responsive checks: 320, 375, 390, 430, 768, 1024 and 1280 CSS pixels, normal/doubled text/200% CSS zoom, no horizontal overflow, usable email/footer target heights and underlined links. Automated WCAG 2.2 A/AA-tag checks at 320 and 1280. These are automated checks, not native browser zoom, physical-device or manual screen-reader acceptance. Existing Phase 4B/4E/4V exact footer assertions now include Contact; no assertions removed or weakened. Production build preserves mandatory source checks.

Local results: production build passed source/session/version/summary validation and three vote-integrity tests; the focused Contact suite passed all route/history/email/keyboard checks, 21 responsive combinations and both automated accessibility audits. Documentation links, stable backlog IDs and git whitespace checks passed. No production data files changed. The pre-push check found no active or queued workflow. Final commit, mandatory CI and Main asset verification accompany delivery. No redundant full local browser run is required for this bounded route addition; all mandatory CI checks remain enabled.

## Outstanding acceptance

Owner must send and receive a real test email, confirm monitoring and assign intake/backup/reviewer responsibilities. Automated mailto validation does not prove delivery. No response-time guarantee or independent editorial approval is made.

RELEASE-001 records partial progress only. Four independent explanation reviews, physical iPhone/iPad, VoiceOver/NVDA, native browser zoom/keyboard human acceptance, RELEASE-002 and explicit RELEASE-004 authorization remain open. TEST-001 remains High/Blocked: the latest genuine schedule is failed run [40109485828](https://github.com/utahbug/UtahBills/actions/runs/40109485828), with no newer schedule at baseline check. Push deployment cannot close it. All unfinished IDs are retained. This phase does not authorize public release.


## Follow-up — Contact and footer refinements

The owner subsequently approved a temporary testing mismatch: visible contact@utahbug.com, actual mailto recipient kenroberts@live.com, exact subject “Utah Legislation - Comments, questions or corrections”. These separate values live in contact-config.js. This supersedes the initial same-address presentation and subject described above; it does not establish branded-mailbox operation. The removed no-mail-client notice is not replaced with misleading copy instructions. The address remains selectable, but manually copying it uses the unverified branded address. Aligning the display and recipient after owner configuration, real delivery testing and approval is an outstanding pre-release correction under RELEASE-001 and the correction procedure.

Footer links precede the copyright/disclaimer sentence. Separators are removed so none can be orphaned on wrapping; spacing remains compact and link targets retain their established height. Contact uses four optional reporting bullets, keeps the privacy reminder/correction procedure, and places the independence statement last. No legislative records, pipeline, schedule, domain or hosting configuration changed.

Focused tests retain route/history/focus/axe and 21 responsive combinations, with new exact display/recipient/subject, bullet order, statement placement and footer structure assertions. Existing footer text/typography checks are updated to compare the relocated copyright/disclaimer. Genuine schedule 40211750281 was active at start; no competing push is permitted before it completes. Outcomes accompany delivery; TEST-001 is not closed by this UI follow-up.

Follow-up local results: changed UI assets bundled with the existing production esbuild settings against the previously validated local data; focused Contact suite passed route/history/focus, exact email values, 21 responsive combinations and automated WCAG checks. Relative documentation links and whitespace checks passed. Full data/build/browser validation remains mandatory in CI; no redundant local data rebuild was needed.

The protected genuine schedule [40211750281](https://github.com/utahbug/UtahBills/actions/runs/40211750281) completed successfully (build and deployment) and preserved snapshot commit `1fcba42`. Main was fast-forwarded to retain that automatic update before the follow-up commit; no data files are edited by this UI batch. This confirms the run outcome, not the full component-evidence acceptance review required to close TEST-001. No active or queued workflow remained before push.


## Shared header Contact icon

The owner added a Lucide Mail envelope linking internally to #contact, with accessible name/title “Contact UtahBug” and a 44 × 44 CSS-pixel target. The shared header reserves space for it; on narrow screens it sits alongside the existing navigation and remains visible when the branding scrolls away. No floating Site links tab, extra destination in the primary text navigation, or removed footer Contact link.

Focused checks compare default header height with/without the envelope at 320, 375, 390, 430, 768, 1024 and 1280 pixels. Default height does not increase. Doubled text retains full labels and controlled reflow rather than shrinking labels or allowing overlap; extra wrapping is necessary at the narrowest enlarged-text widths. Target size, viewport containment, no overlap with wordmark/navigation, sticky scroll positions, visible keyboard focus, internal activation/main focus, and touch activation are checked. Existing sticky-header route/history/zoom checks remain mandatory. Physical-device/VoiceOver/NVDA acceptance is not claimed.

Header local results: focused Contact checks passed, including 14 normal/enlarged-text header cases and a separate scrolled touch activation. The existing header suite passed nine routes at top/middle/bottom, seven widths, doubled text, 200% CSS zoom, scrolled navigation, focus, anchor offsets and axe. Phone/desktop screenshots were inspected. No physical-device or manual assistive-technology acceptance was performed.


CI correction: run 40215066461 passed the existing suites but the new no-added-header-height assertion failed at 375px on Linux. Local Arial and Verdana reproduced the extra row. Narrow-header link gaps and the invisible envelope target’s right gutter were adjusted; labels, wordmark alignment, 44px target and the height assertion are retained. Focus outline stays fully within the viewport. Two explicit 375px fallback-font cases now guard this risk. This is a layout correction, not a relaxed assertion; doubled-text reflow remains separately checked.

Correction validation: the focused Contact suite passed 21 responsive combinations, 16 header cases (including Arial/Verdana at 375px), touch activation and axe. No unrelated local suite was rerun. No active or queued workflow remained before the correction push.

Run 40217193114 again failed the new 375px default-height assertion after all prior suites passed. The focused suite is moved first in the unchanged mandatory chain and now records exact geometry/fonts on failure, to diagnose the Linux-specific remaining difference without another full-suite wait. No existing suite or assertion is removed. Publication remains blocked until the strict check passes.
