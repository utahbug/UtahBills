# UtahBills project instructions

Application name: UtahBug. Repository: UtahBills. This is an independent application. Do not inspect or modify the existing Utah repository or other applications for this project.

## Deployment and testing policy

- Use no more than two published environments, always named **Main** and **Review**.
- Main: https://utahbug.github.io/UtahBills/ — normal updates and stable development.
- Review: https://utahbug.github.io/UtahBills/review/ — reserved consistent address for experimental or potentially disruptive changes. Publish only when needed.
- Both published environments must be publicly reachable from the user's iPhone and PC, including away from home. Localhost is development-only and cannot substitute for a published review environment.
- Do not create extra preview deployments, temporary published sites, per-branch URLs, or alternative hosting URLs.
- Before replacing a working Main version, assess whether a change needs evaluation in Review. Preserve working Main when publishing experiments.
- Use the same environment names and URLs consistently in handoffs. Phase 4E explicitly removes the visible Main footer label; the compact shared footer must not add an environment label.
- Use one local instance, normally http://127.0.0.1:4173/UtahBills/. Check for and reuse an existing instance before starting a server. Use a second instance only when necessary for side-by-side testing; stop it after testing.
- Reuse the existing browser tab when practical; avoid accumulating ports and tabs.
- Review is activated for owner-approved experiments. Every build must package Main and Review together in one complete `dist/` artifact using `scripts/package-review.mjs`. Main remains at the artifact root; Review is under `review/`, with identical verified data and shared application assets plus its isolated typography stylesheet. Owner-approved phone navigation is shared by Main and Review. Never upload Review alone or omit it from a normal/scheduled deployment.
- Typography changes in `review-typography.css` remain Review-only until explicit owner acceptance and promotion authorization. Preserve Main's appearance. Required CI includes the existing full suite and the combined-artifact/Review checks. Deployment concurrency queues new work instead of cancelling an active run.

## Communication

End every final summary with exactly: This is the UTAHBILLS Project (CODEX).
Do not add that line to processing/progress updates.

## Search indexing

GitHub Main and Review always keep static noindex, nofollow. The owner authorized public indexing on legislation.utahbug.com for the homepage and records that pass the frozen production source audit. Prepare that release from the last approved production package using scripts/prepare_public_index.py. Preserve the source dates, provenance, canonical URLs, rollback packages and the existing application. New production code or data requires separate authorization. See docs/PUBLIC_SEARCH_INDEXING.md for release and registration checks.
