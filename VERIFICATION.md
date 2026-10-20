# Prototype verification — October 20, 2026

- Production build: passed (Node 22 / esbuild).
- Provenance validation: 13 official source records; checksums, retrieval dates, sessions, nine version links, and summary source pins passed.
- Browser: Microsoft Edge, automated through Playwright.
- Responsive checks: seven routes at 320, 390, 768, and 1280 CSS pixels; no document horizontal overflow.
- axe-core 4.11: no violations for WCAG 2 A/AA, 2.1 A/AA, and 2.2 AA tags across the 28 route/viewport combinations.
- Text enlargement: all computed text sizes doubled on Bills, SB0069 detail, How it works, and About the data at 768px; no document horizontal overflow. A header wrapping issue found during this check was fixed.
- Functional checks: bill-number search; combined status/chamber filters; empty-state recovery; explicit unconnected 2027 state; identical-version comparison; direct bill URL reload under `/UtahBills/`; keyboard skip link; no browser runtime errors.
- Legal text regression: HB0011 baseline excludes the new probable-cause language while resulting text includes it; SB0069 S2 resulting text includes parental opt-out and excludes the removed Classroom hours definition.
- Visual review: desktop Bills and bill detail screenshots; phone bill-detail screenshot.

Limitations: automated checks are not a WCAG 2.2 AA certification. Manual screen-reader testing, complete keyboard traversal, real iPhone/iPad testing, and independent human editorial verification remain pending. Text enlargement is simulated through CSS, not a physical-device accessibility setting.

Run `npm test` with `npm start` running. Local reports/screenshots are generated in `test-results/` (ignored by Git). The supplementary Windows text-enlargement check is `node tests/text-resize.mjs`.
