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
- Review is activated for owner-approved experiments. Every build must package Main and Review together in one complete `dist/` artifact using `scripts/package-review.mjs`. Main remains at the artifact root; Review is under `review/`, with identical verified data and shared application assets plus its isolated experiment stylesheet. Never upload Review alone or omit it from a normal/scheduled deployment.
- Typography changes in `review-typography.css` remain Review-only until explicit owner acceptance and promotion authorization. Preserve Main's appearance. Required CI includes the existing full suite and the combined-artifact/Review checks. Deployment concurrency queues new work instead of cancelling an active run.

## Communication

End every final summary with exactly: This is the UTAHBILLS Project (CODEX).
Do not add that line to processing/progress updates.

## Temporary indexing restriction

Until public release is explicitly approved, preserve `<meta name="robots" content="noindex, nofollow">` in the static head of every application HTML page. Current hash routes share index.html. Do not block crawling in robots.txt or submit sitemaps during development. Keep direct access, source attribution, snapshot freshness and review-status disclosures. Phase 4A explicitly removes the Research Prototype banner and visible label; Phase 4E subsequently removes Main identification from the footer. At approved public release, remove the directive from all application HTML and verify the deployed source; see README.md.
