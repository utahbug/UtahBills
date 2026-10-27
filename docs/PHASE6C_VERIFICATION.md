# Phase 6C — Info visibility and compact Bills sorting

October 26, 2026. Baseline: clean synchronized Main `d1dbff1865470c504b4532d597a852ae572d95b6`, successfully published by [run 40429080225](https://github.com/utahbug/UtahBills/actions/runs/40429080225).

## Scoped implementation

- Legislators `#directory-info` retains its existing native popover, content, placement, source links and dismissal/focus behavior. Its one-pixel `#8295a2` border, white background, 5px rounding, 12px padding and restrained shadow distinguish it from the page. No directory geometry or filtering changes.
- Bills/request/archive search disclosures wrap their existing informational children in one `.catalog-info-content` container with the same boundary treatment. The trigger remains outside that wrapper at its original position; expanded content still occupies document flow below Search. No information or evidence link is removed. Screenshot inspection identified grid stretching of the adjacent Records selector while Info is open; a scoped expanded-state `align-self:start` keeps its normal field height without changing closed-state alignment. The focused suite asserts this explicitly.
- Desktop reuses the existing native Sort select inside the existing Sort disclosure. Its compact borderless summary reads Sort with an adjacent downward indicator; the full selected option is visible inside. The separate native Per page stays in the desktop toolbar. Mobile retains its Sort/More/Copy layout, ordering and page-size panel, CSV menu, sorting state and handlers. The same disclosure/select nodes survive responsive transitions, retaining focus.
- TOPIC-001 is approved planning only. SHARE-001 and all prior unfinished work are preserved. No topic implementation, source/data/acquisition, bill-detail, Activity, Calendar, Contact, hosting or indexing changes.

## Verification

`tests/phase6c.mjs` covers all four requested Info contexts at 320, 390, 700, 701, 768, 1024, 1280 and 1920px with normal/doubled text and 200% CSS zoom. It checks computed panel treatment, viewport/flow containment, source links, keyboard Escape/focus, desktop/native selected options, independent page size, responsive focus continuity, dismissal and automated WCAG A/AA. Introduced-measure scenarios use isolated fixtures; production remains unchanged. Representative 390/1280 screenshots are local ignored artifacts.

Retained Phase 4W checks verify actual sort order and tie handling against saved records; mobile-toolbar checks cover full matching Copy/CSV, filtering, pagination, touch targets, keyboard and responsive transitions. Toolbar and Phase 5F assertions are updated only where desktop Sort now intentionally resides inside its disclosure; borderless summary and minimum target checks replace obsolete native-select appearance assumptions. All existing sorting/source/accessibility assertions and mandatory CI gates remain.

Production build verifies source checksums, session/version identities, summary evidence, three Python vote-integrity checks and deterministic data projections. Final focused-test, CI and published-asset outcomes accompany delivery. The implementation commit introduces this record (`git log -1 --format=%H -- docs/PHASE6C_VERIFICATION.md`); [Main workflow history](https://github.com/utahbug/UtahBills/actions/workflows/pages.yml) provides its complete required validation/deployment result.

## Acceptance boundaries

Physical iPhone/iPad, manual VoiceOver/NVDA, native browser zoom, independent editorial review and public-release approval remain human tasks. Automated CSS zoom is not native zoom acceptance. TEST-001 remains completed under Phase 6A; no new acquisition is requested. Main-only publication and static noindex/nofollow remain intact.
