# UI-032/UI-033 production follow-up — preparation only

Owner authorization on November 8, 2026: finish and verify the Legislators navigation and Bills filter corrections in GitHub Review, then prepare a scoped production update. **No Cloudflare upload is authorized.** The previously requested 2027 Bill Tracker heading is included; no other design or typography promotion is included.

## Immutable baseline and scope

- Current production deployment: `9cd53e01-15f6-43b1-8185-b48f9522348a`, existing `utahbills/main`, https://legislation.utahbug.com/.
- Baseline package: `release-candidates/approved-production-8af6ca7d990d0b6dec156561aa89ce0140a36e15/`.
- Required content SHA-256: `285232f20c53011cc0255b50021300c091da28aec9db79641778c985cad5d504`.
- Preserve that entire package as the immediate rollback for this proposed replacement, along with the earlier rollback evidence in [the published release record](ACCEPTED_PRODUCTION_RELEASE.md).
- Only `app.js`, `assets/accepted-ui.js`, `assets/accepted-ui.css` and `release.json` may change. All data, static record pages, sitemap, robots, headers, Google verification, social assets and unrelated files must be byte-identical to the baseline. Review typography stays excluded.

## Preparation and approval gate

After exact-commit mandatory CI/Pages and live Review checks succeed, run the clean-checkout CLI:

```text
node scripts/package-interface-fixes.mjs BASE NEW_OUTPUT BASE_SHA EXACT_COMMIT SUCCESSFUL_CI_RUN
```

[The preparer](../scripts/package-interface-fixes.mjs) verifies the immutable baseline, frozen accepted interface and exact-commit successful build/deploy. It builds only the current application and the bounded correction on the frozen accepted interface, copies all other bytes from production, validates the four-file allowlist and inventories SHA-256 checksums. It preserves the source snapshot metadata and original indexing metadata, records the baseline authorization as historical evidence, and sets the new candidate to `approved:false` with pending upload authorization.

Verify using `verifyRelease` and `scripts/check-indexed-release.mjs`, then exercise the actual candidate in Chromium/WebKit including row/count links, saved-filter recovery, 2027/archive headings, navigation, Copy/CSV, Calendar and original typography. Record commit, checksum, file-difference evidence and limitations. Do not run Wrangler upload, alter Cloudflare settings, update data or relabel the immutable package as approved. A later explicit owner authorization must identify this exact candidate and use the existing immutable approval-copy procedure.

Candidate creation and publication remain pending until the final receipt is recorded. Physical iPhone/iPad, VoiceOver and real clipboard acceptance remain owner checks; automated browser tests do not establish those outcomes.

## Publication and candidate receipt

[PR #26](https://github.com/utahbug/UtahBills/pull/26) retains the exact merged commit, mandatory CI/Pages outcome, live Review verification and production-candidate checksum receipt as those gates complete. Consult that receipt rather than treating local test completion as publication or upload authorization.
