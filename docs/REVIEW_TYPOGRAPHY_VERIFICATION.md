# Review typography comparison verification

October 28, 2026. Baseline Main: `39db2dd4594747d32f21ea011e4134fcb140176f`, successful full CI/Pages run `40717933013`. Read AGENTS.md, deployment documentation, ROADMAP, backlog and continuing UI checklist. Fetched synchronized Main; no active or queued run was found before implementation. Recheck before publication.

## Experiment and isolation

Only Review loads `review-typography.css`. Its two rules change listing title/name weight to 600 for Bills, Recent Activity and Legislators, and record classification/identification labels to 500. No size, line-height, padding, margin, color, navigation, control, dialog or global heading rule changes. Sponsor/secondary weights and link/focus styles remain shared and unchanged. Main application sources and assets are unchanged from baseline. No promotion to Main is authorized; UI-021 awaits owner visual acceptance.

## Combined deployment

Every normal or scheduled build first creates the ordinary Main output, then packages a complete copy under `review/` and injects the isolated stylesheet into Review HTML only. Main remains at the root of the single uploaded `dist/` artifact. Both copies include the same verified data, raw sources, assets, application bundle and shared stylesheet. The package manifest and final artifact test compare every shared file hash, both noindex directives and the exact isolated HTML/style difference. Packaging refuses an existing nested Review and guards the combined size. Initial measured output: 9,327 files per copy, approximately 455 MB total before the small manifest/experiment stylesheet. No additional host or public environment is created.

The existing full `npm test` gate is unchanged. Artifact and targeted Review checks are added. `cancel-in-progress: false` prevents a new run from interrupting active deployment work. Future source/data builds reconstruct both environments together; scheduled refresh logic and preservation rules are unchanged. Shared local preferences remain same-origin browser preferences. Existing copied sharing URLs intentionally retain the established canonical Main policy; in-app navigation and assets remain within Review.

## Focused verification

The first 64 paired Main/Review browser views passed: requests, 2026 introduced archive, Recent Activity and Legislators at 390px and 1280px, normal/doubled text and light/dark. Exact listing content, expected 700-to-600 title weights, 500 record-label weights, unchanged sizes/line-heights/padding/margins/colors, unchanged unrelated heading/secondary weights, focus indicators, no overflow and automated WCAG A/AA checks passed. No measured first-title height differences occurred. Review filtering, sorting, profile navigation, detail reload/history, Calendar and Contact passed. The real empty 2027 state is preserved; introduced-2027 behavior is tested only with intercepted browser fixtures, never packaged synthetic records.

Additional 200% CSS zoom comparisons and longest verified request-title cases passed, along with a clean `npm run build` and the complete-artifact hash check. One natural font-metric difference was observed: the first archive title at 1280px / 200% CSS zoom occupies 51px in Review versus 102px in Main (one fewer wrapped line), in both themes. No row-height, font-size or spacing rule was changed; natural wrapping can change the resulting row height. This remains visible for owner comparison rather than adding artificial sizing or altering Main. Full CI runs all 96 matched normal/text/zoom/theme views plus longest-title and routing checks. Final publication evidence accompanies delivery. Matched screenshots are saved in `test-results/typography/`; composites label Main on the left and Review on the right. Compare the same viewport, theme, zoom and filters. Font rendering and weight availability vary by operating system; screenshots do not establish owner acceptance.

## Publication and limits

Main: https://utahbug.github.io/UtahBills/

Review: https://utahbug.github.io/UtahBills/review/

The delivery report identifies the final commit, full CI/deployment run and exact published asset/data comparisons. No successful deployment is claimed before these gates complete. Resolve this record's initial implementation commit with `git log --diff-filter=A --format=%H -- docs/REVIEW_TYPOGRAPHY_VERIFICATION.md`.

Physical iPhone/Safari, native browser zoom and VoiceOver/NVDA review remain pending. Lighter glyphs can alter natural wrapping on other platform fonts even though layout CSS is unchanged. Existing UI-019 technical-source link spacing and unrelated data/editorial/release limitations remain open. Both environments retain `noindex, nofollow`; no Cloudflare changes or public release. Await explicit owner visual acceptance and separate authorization before promotion.
