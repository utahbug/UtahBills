# November 23 scheduled-refresh regression repair

## Evidence and cause

Read-only logs and retained attempt artifacts were inspected; no manual acquisition was started.

- November 16 schedule [43967295627](https://github.com/utahbug/UtahBills/actions/runs/43967295627): real `OGMUTSKTAJ` disagreement (request JSON: **Landlord Amendments**; status listing: **Property Management Amendments**). Catalog and supplemental acquisition failed their unchanged checks. `continue-on-error` can label these steps successful in the Jobs API; the actual logs, step outcomes and failed `refresh_health` job establish the source failure. Calendar, required tests, snapshot preservation and GitHub deployment succeeded independently, retaining the earlier request catalog.
- November 17 [44174888007](https://github.com/utahbug/UtahBills/actions/runs/44174888007): source disagreement remained; browser test additionally failed `One controls row` immediately after desktop-to-phone resize. Separately awaited geometry reads could span different layout/scroll frames.
- November 18–22: acquisition succeeded, but `phase7c.mjs` assumed every quoted former title matched exactly one record. November 22 [45062437498](https://github.com/utahbug/UtahBills/actions/runs/45062437498) retained 306 source requests, 305 verified statuses, one qualified observation `XYKLEENCOS`, zero introduced 2027 measures, and 100 Calendar events. `OGMUTSKTAJ` now has **Property Management Amendments** in both official sources. This is also a former title of `BXGJYEIWSS`, currently **Rental Housing Amendments**. Phrase search correctly returns both identities. **Municipal Incorporation** also matches distinct current titles for `KGHDYMTMHB` and `SQCGHFUWTK`.

## Correction and retained coverage

Only tests and documentation change. Application search, styling, acquisition, source reconciliation and workflow gates are untouched.

- Historical-title searches assert the exact matching identity set and current display titles. Per-record bookmark, Copy, CSV, navigation/reload and history assertions remain, using the tracking ID to disambiguate each record.
- Deterministic unique-title, shared historical/current-title and unrelated-record fixtures ensure coverage does not depend on evolving official titles. Shared-result bookmarking, Copy and CSV are also checked.
- Mobile toolbar bounds are captured together in one browser evaluation. Every original alignment, spacing, 44px target, keyboard, overflow, enlargement and accessibility assertion remains unchanged.

## Focused validation

- Offline replay of the retained November 22 source bytes, through the original reconciliation/projection functions, reproduced the original `2 !== 1` failure. No acquisition or saved-data replacement was needed.
- Corrected Phase 7C passed on the retained verified catalog (12 former titles) and the replay (15 former titles), including deterministic collisions, root packaging, routes, Copy/CSV/bookmarks/history and Light/Dark axe checks.
- Full mobile-toolbar suite passed: three record views, five widths, enlarged text/zoom, keyboard/focus, menus, Copy/CSV, resizing and axe.
- `historical_titles.py`, `catalog_updates.py`, `request_publication.py`, `supplemental_requests.py`, `calendar_data.py`, and `search-parser.mjs` passed. Deliberate duplicate/mismatch/disappearance failures inside these temporary fixtures are expected negative-test evidence, not current official-source incidents.

## Publication integrity and remaining gates

Catalog publication validates complete original responses, exact identity/title/status agreement and bounded first-status omissions before atomic replacement. Loss of previously verified status still fails. Qualified observations are explicitly not verified statuses. Calendar and other components retain independent safeguards.

November 17–22 failed browser checks skipped snapshot preservation, Pages artifact upload and deployment. They did not replace the previous verified GitHub publication. November 16 demonstrates the intended independent-component behavior: a failed overall refresh can still publish separately verified data while retaining the failed component's baseline. Therefore “failed workflow” does not always mean “no publication.”

Required full CI and post-repair GitHub publication are pending. A subsequent genuine scheduled success is a separate acceptance gate; a push or manual run must not be reported as scheduled recovery. Historical TEST-001 acceptance remains historical; this incident remains open until post-repair schedule evidence exists.

Cloudflare is untouched: preserved November 9 runtime `41e6c63e8d2d328178aa50df645557be7e99add1`, deployment `e89d8426-df1e-422a-9ae7-890570279788`, rollback deployment `9cd53e01-15f6-43b1-8185-b48f9522348a`. Existing release/rollback checksum receipts remain authoritative and unchanged. No DNS, production tracking, UI or source-data promotion is included.
