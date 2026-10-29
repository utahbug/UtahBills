# Cloudflare unindexed prelaunch procedure

**Approval gate:** the owner explicitly required “Do not upload to Cloudflare or replace the placeholder during preparation.” Nothing here activates deployment, changes DNS, connects GitHub, or creates a project. Existing project: `utahbills`; existing domain: https://legislation.utahbug.com. Main and Review retain their existing GitHub deployment.

## Prepare and verify

From a clean approved Main commit with successful mandatory CI, install locked dependencies (`npm ci`), set PYTHON to an available Python interpreter, and run:

```text
node scripts/prepare-release.mjs
node scripts/prepare-release.mjs --verify release-candidates/<full-commit>
```

The fresh build verifies sources and packages Main+Review normally. The separate candidate copies only manifest-verified Main files into `release-candidates/<commit>/site/`, excluding Review, empty .gitkeep markers and internal source/test/configuration files. Root index/assets/data use relative routes. Original official raw response bytes are preserved; generated text line endings are normalized. Static noindex,nofollow remains and a production X-Robots-Tag header reinforces it. Root canonical/social metadata is added only to this candidate, not GitHub Main.

`release.json` records commit, data tree, tool versions, lockfile hash, source dates and runtime-code hash. The outer `release-manifest.json` inventories every deployed file with SHA-256; `SHA256SUMS` hashes that manifest. Verification rejects changed/missing/extra files. Known private-key/token patterns and unexpected paths are rejected; this bounded scan supplements the explicit publish allowlist, not a guarantee against every conceivable secret. No signing key was configured; do not label the result signed. `approved:false` records candidate preparation; record later owner authorization separately without modifying the checksum-locked package.

The packager enforces 20,000 files and 25 MiB per asset. About 9,330 source assets exceed the dashboard's 1,000-file drag-and-drop limit, so use Wrangler Direct Upload after approval. [Cloudflare Direct Upload limits](https://developers.cloudflare.com/pages/get-started/direct-upload/) and [platform limits](https://developers.cloudflare.com/pages/platform/limits/) must be rechecked if deployment is delayed.

## After explicit approval only

1. Confirm the exact candidate commit/checksum, successful mandatory CI and owner-approved limitations. Verify the local package again.
2. In the owner's existing account, confirm project `utahbills`, its existing production branch and custom domain. Record the current successful placeholder production deployment ID before replacement. Do not create another project, change DNS, or select a preview branch.
3. Authenticate locally without recording credentials in repository files. With the existing production branch substituted, use the pinned reviewed CLI:

```text
npx wrangler@4.155.0 pages deploy release-candidates/<commit>/site --project-name utahbills --branch <existing-production-branch> --commit-hash <commit>
```

4. Confirm root HTTP/TLS, commit in release.json, noindex meta/header, assets/data, direct hash record links/reload, all routes and contact, filters/bookmarks/Copy/CSV, Light/Dark and phone layouts. Check actual hostname in rich clipboard links. Confirm Review files are absent. Do not submit indexing or enable analytics/updaters as an incidental deployment step.
5. Record deployment ID, time, candidate checksum, owner approval and functional result. A successful upload is not evidence of a successful source refresh.

## Rollback

Before first upload preserve the successful placeholder production deployment ID and a local copy. Read-only preparation observed HTTP 200, Cloudflare TLS, and 609-byte placeholder SHA-256 `f0f188b12a51cf15f45e3fda62128e8e9368d2782ed9100aa16a3ce814ef7db6`; its robots meta includes noindex,nofollow,noarchive. Account deployment IDs remain owner-verification items.

For a failure, use the existing project's Deployments → successful previous production deployment → Rollback, then verify domain/content/noindex. [Cloudflare rollback documentation](https://developers.cloudflare.com/pages/configuration/rollbacks/) excludes preview deployments as rollback targets. For later releases retain each accepted package and manifest; an approved re-upload of an unchanged verified previous package is a fallback. Never reconstruct a rollback from moving Main or silently substitute a newer data snapshot.

## Freeze production code; review data separately

The simplest safe initial policy is a manual, approval-gated data candidate. Keep the last accepted production commit and runtime-code manifest frozen. Select a validated official snapshot from a named acquisition run; inspect acquisition health independently of build/deploy success. On an isolated checkout of that approved code, bring only the reviewed source snapshot/data manifests, run that version's source-integrity validators and projection builder, then compare every non-data runtime hash against the accepted release. Any schema incompatibility or non-data change requires a separately reviewed code release. Retain the prior accepted data on acquisition failure; do not treat a green application deployment as permission to replace data.

Record code commit and data commit separately, source dates/qualifications, full candidate checksums and the acquisition run. Run focused complete-source/integration checks against frozen code; obtain owner approval before uploading the combined frozen-code/new-data artifact. Retain and verify rollback packages. Monitor freshness and source failures after deployment. This procedure is a recommendation, not a fully implemented or operationally proven data updater; that remains a public-launch limitation. No scheduled Cloudflare job or automatic promotion is enabled. The current preparer deliberately requires one clean committed candidate and does not silently mix moving branches.
