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
