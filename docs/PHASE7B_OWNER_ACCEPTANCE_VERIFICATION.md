# Phase 7B final owner acceptance corrections

Baseline: Main `419633e712153442c99a11f7e7c3f0fcbba7022f`, fetched before editing. Repository instructions, Phase 7B/follow-up records and the continuing UI acceptance checklist were reviewed. No legislative data, acquisition logic, Cloudflare or indexing change is introduced by this UI correction. During verification, scheduled run 40744457953 completed its full tests and deployment, preserving snapshot commit 598cf33; its separate refresh-health job reported a source-refresh failure. The UI commit was rebased onto that tested snapshot after the run completed, without conflict or data edits.

## Scope and behavior

The directory order is Sort, Chamber:, count, flexible space, Columns, Copy dropdown. All eight native sorts remain; select/option right padding provides additional room where supported. The unchanged labels and 44px targets need approximately 430px of content width. Typical portrait iPhone content is narrower, so the controls intentionally use two compact rows; wider layouts retain one row. Enlarged text may require additional wrapping without hiding controls.

Columns opens independently, allows repeated changes, persists the existing preferences and offers Restore defaults. Name remains fixed; Introduced bills/Public requests default on and District off. District links show verified 2026 House/Senate and district number while retaining numeric sorting and unavailable-2027 qualifications. Copy offers the complete existing directory information, names only with verified Rep/Sen prefixes, and quoted UTF-8 CSV in complete filtered/sorted order. Clipboard denial retains selected manual-copy content and truthful messages. Both bounded opaque panels preserve layout, focus and dismissal.

Bills desktop Sort/Per page separation increases only horizontally. Only the literal Bill request classification is 15px/500 with the original 24px line box; bill numbers, titles, sponsor/status text and other typography remain unchanged. The Review experiment stylesheet is unchanged. Its broader title/name reductions are not promoted to Main; owner preference remains undecided (original on iPhone, lighter on PC).

## Verification record

`tests/owner-acceptance.mjs` adds exact district identity checks, defaults/persistence, full/names/CSV/fallback, six widths (320/375/390/430/768/1280), normal/doubled text/200% CSS zoom, both themes, axe, targets, bounded non-displacing panels, focus/dismissal and isolated classification typography. It is added ahead of the existing mandatory suite; no mandatory test is removed. Retained tests use the new directory Copy dropdown and visible trigger, with all prior assertions retained or updated for explicitly superseded design.

The initial zoom no-shift check caught sticky-header settling after scrolling. Measuring after the same settling interval used by the retained panel suite confirms identical results offsets before/after opening; the exact no-displacement assertion remains. The old toolbar audit measured the now-hidden Copy action after its menu closed; it now measures the visible Copy trigger.

Focused local checks passed: the new owner suite, retained Phase 7B/follow-up, toolbar, Phase 6F, Phase 6B and Phase 4J suites, plus the complete-artifact integrity check. Windows Edge additionally verified the native select, all eight choices, keyboard selection and supported right padding; desktop Columns/Copy/request and 390px phone screenshots were inspected. Final CI and live deployment checks accompany delivery. Resolve this implementation commit with `git log --diff-filter=A --format=%H -- docs/PHASE7B_OWNER_ACCEPTANCE_VERIFICATION.md`. Publication is permitted only after all mandatory workflow gates pass. Every normal/scheduled build retains the complete Main and Review artifact and identical verified data. Both static heads retain noindex, nofollow.

## Remaining limitations

Physical iPhone/Safari, VoiceOver/NVDA, native browser zoom, real clipboard recipient applications and owner visual acceptance remain pending. Native option padding/rendering is OS/browser dependent. UI-019 expanded technical-source target spacing and all unrelated backlog/editorial/release gates remain unresolved. Political Party and broader sponsorship columns remain deferred pending verified data and separate authorization. Bookmark tracking and Bill Status sorting are not started. Automated verification and screenshot inspection do not imply human acceptance.

CI run 40751029185 passed artifact/Review checks but blocked deployment on the new owner audit at 320px/200% zoom: the scrolled sticky header partly clipped the background Info target on Linux. As in retained toolbar/appearance tests, open panels are audited in their actual viewport position, then the full page is audited after returning to the top. Both themes, all target-size rules, exact no-shift geometry, and bounded/focus/dismissal checks remain enabled; no accessibility rule is suppressed.

Run 40752287331 passed the corrected owner suite, then exposed the same clipped-background Info audit in the retained Phase 7B follow-up. Its open Columns audit now uses the panel context, followed by full-page Light/Dark audits at the top. Existing column combinations, sorting, geometry, target sizes, focus and dismissal checks remain unchanged. Deployment was blocked by both failed runs.
