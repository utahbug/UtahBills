# Phase 6F — Public Requests by Legislator (LEG-003 portion)

October 27, 2026 (Mountain). Baseline: clean synchronized Main at Phase 6E `f7676971c5dfcce984b8722eb71bac47094fd7e6`, successfully published by [run 40479907107](https://github.com/utahbug/UtahBills/actions/runs/40479907107). No newer acquisition was present at baseline. This phase uses existing published evidence; no official-source refresh is initiated.

## Published evidence and limits

The saved request check is `2026-10-26T18:44:07.525531+00:00`. The projection contains **274 unique currently listed, unconverted public requests**: 273 verified statuses and one source-observed request with unconfirmed status. All 104 directory identities remain from the [official 2026 roster](https://le.utah.gov/asp/roster/roster.asp?year=2026), not a finalized 2027 roster.

- **233 requests** match a 2026 roster member by exact saved sponsor ID.
- **40 requests** have no published sponsor ID. No name-based attribution is attempted.
- **One request**, `IBWQDXLTYO`, supplies `PACEG`, absent from the 2026 roster. The separately dated current contact projection contains `PACEG` (Pace, Grant); this does not authorize adding him to the historical roster or claiming verified 2027 membership. His existing current-contact profile can show the exact-ID request, while directory Info explicitly accounts for its absence from the roster counts.
- The unconfirmed request `KECAYMBVUG` (Homeless Shelter Amendments) supplies `PETERVL` and is included in that sponsor's count/list with **Official status not confirmed**. No status is inferred.
- There are still no verified introduced 2027 measures in this saved index. Introduced-bill counting remains unchanged: unique chief-sponsored HB/SB bills only; no requests, resolutions or extra versions.

Preserved manifests are unchanged:

| Evidence | SHA-256 |
| --- | --- |
| [Catalog](../data/catalog.json) | `c46ee32334263718ceb81bcaca79b3359e4cbdb845d055b453dd2bf8cec197c4` |
| [Independent request observations](../data/request-observations.json) | `6d69bdf02e9a2746f1862fcbc55d7d75bf1ebbd52d4e5bde44760010a650e8d3` |

`tests/phase6f.mjs` reproduces counts and writes an ignored `test-results/phase6f/sponsorship.json` listing every unmatched tracking ID, source sponsor ID and reason. Directory Info exposes the same complete list with links to individual records. It does not silently fold unmatched requests into another member's count or suggest wrongdoing.

## Bounded implementation

- Directory columns are **Name / Introduced bills / Public requests**, retaining the existing three-column width and independent bounded search. District remains in profiles, the official district finder, and both directions of the existing Sort control. The compact Sort is available on desktop too because District no longer has a column heading.
- Both-chamber names show discreet Rep./Sen. prefixes based on the historical roster. Single-chamber views omit the redundant prefix. Name ordering uses the original name/ID comparator.
- Phone entries put the name above **Introduced: count · Requests: count**. Counts are separate links with at least 44px targets. Desktop headings sort in both directions; the existing native Sort provides all eight choices. Equal numeric counts keep alphabetical name/ID ordering, regardless of direction.
- `request-sponsors.js` is a deterministic display projection over published request arrays. It groups exact tracking IDs, excludes converted/no-longer-listed identities, preserves source-observed records, and counts each identity once. Conflicting duplicate sponsor IDs are explicitly unmatched rather than attributed. Source data and acquisition are not modified.
- Directory counts and the existing profiles use that same projection. A request-count link opens only the corresponding sponsor's profile; its clearly counted Public requests section lists exact saved titles, tracking IDs, statuses and internal detail links. Zero remains an explicit empty saved list. Current-contact-only profiles retain their membership qualification. No unfiltered-list redirect or new inferred conversion is introduced.
- Directory Copy keeps its existing detailed format, roster/district fields, ordering and filtering, adding the displayed public-request count. Bills/Activity Copy, CSV, menus, request detail evidence, profile contacts and historical sponsorship/voting remain unchanged.

## Verification

- New `tests/phase6f.mjs`: independent real-data count calculation, every roster member's count and exact profile request identities, converted/removed requests, duplicate IDs, conflicting sponsor IDs, unknown/missing sponsors, source-observed status, current-contact-only identity, numerical ties, all eight sort choices, House/Senate/combined scopes, search/Copy/Back, exact detail routes and zero-result lists.
- Responsive checks: 320/375/390/430/768/1024/1280 CSS pixels, doubled text and 200% CSS zoom, both count targets, labels, keyboard focus, no overflow and full automated WCAG A/AA assertions. Expanded unmatched Info is checked at 320px in all three modes, including viewport containment and Escape focus restoration. Representative 390/1280 screenshots inspected. Pinned CI Chromium also exercises the new suite.
- Retained directory tests: Phase 6B field/label/column geometry and font metrics; Phase 4X sorting/counts/profile history; Phase 4V sponsorship, directory and archive navigation; Phase 4F official finder/privacy; Batch 2B directory/profile/source behavior. Old District-column and count-label expectations are updated to the expressly approved interface; exact IDs, counts, navigation, source and accessibility assertions remain. The older Phase 4V test now closes Sort with Escape before clicking the underlying bill, preserving normal pointer operation.
- Local esbuild bundle and source validation passed against the unchanged verified projections. Full source-integrity checks, production build and all browser suites remain mandatory in CI; no redundant full local historical-data rebuild or all-suite run is needed for this display projection.

## Publication and remaining work

Resolve the implementation with `git log -1 --format=%H -- docs/PHASE6F_VERIFICATION.md`; required Main workflow and published-asset/live checks accompany delivery. Check for active scheduled acquisition before pushing. No additional environment, hosting/domain, refresh-frequency, legislative data or `noindex, nofollow` change.

This is only the owner-authorized Public Requests portion of LEG-003. Total-sponsored union counts, floor/cosponsor columns, optional display columns, committee filters and broader comparison remain deferred. SESSION-002/003 still require authoritative membership/real introduced records. TEST-001 remains completed under Phase 6A. Physical iPhone/iPad, VoiceOver/NVDA, native browser zoom, independent editorial and explicit public-release approval remain outstanding; automated checks are not human acceptance.

## CI wording assertion correction

Initial run [40517245403](https://github.com/utahbug/UtahBills/actions/runs/40517245403) passed integrity/build and preceding browser suites, then stopped at the retained Phase 4J Info wording assertion. It expected “Saved 2027 House/Senate bills” without the newly explicit “General Session” reporting period. The assertion now requires the full approved wording; it is not removed or broadened. Only this test and verification record change in the follow-up commit. Main was not deployed by the failed run; the affected suite is checked locally before another mandatory CI run.
