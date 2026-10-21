# UtahBills project instructions

Application name: UtahBug. Repository: UtahBills. This is an independent application. Do not inspect or modify the existing Utah repository or other applications for this project.

## Deployment and testing policy

- Use no more than two published environments, always named **Main** and **Review**.
- Main: https://utahbug.github.io/UtahBills/ — normal updates and stable development.
- Review: https://utahbug.github.io/UtahBills/review/ — reserved consistent address for experimental or potentially disruptive changes. Publish only when needed.
- Both published environments must be publicly reachable from the user's iPhone and PC, including away from home. Localhost is development-only and cannot substitute for a published review environment.
- Do not create extra preview deployments, temporary published sites, per-branch URLs, or alternative hosting URLs.
- Before replacing a working Main version, assess whether a change needs evaluation in Review. Preserve working Main when publishing experiments.
- Clearly label the environment in the published interface and in handoffs. Use the same names and URLs consistently.
- Use one local instance, normally http://127.0.0.1:4173/UtahBills/. Check for and reuse an existing instance before starting a server. Use a second instance only when necessary for side-by-side testing; stop it after testing.
- Reuse the existing browser tab when practical; avoid accumulating ports and tabs.
- Review is reserved, not currently configured or deployed. Before first Review publication, adapt deployment to publish Main and Review together in one Pages artifact, preserving the verified Main output while updating Review and preserving Review when updating Main. Do not deploy a Review-only artifact over the Main site. The current workflow publishes only Main and must not be used unchanged for Review.
- This policy alone does not request immediate publication or activation of Review.

## Communication

End every final summary with exactly: This is the UTAHBILLS Project (CODEX).
Do not add that line to processing/progress updates.

## Temporary indexing restriction

Until public release is explicitly approved, preserve `<meta name="robots" content="noindex, nofollow">` in the static head of every application HTML page. Current hash routes share index.html. Do not block crawling in robots.txt or submit sitemaps during development. Keep direct access and the Research Prototype notice. At approved public release, remove the directive from all application HTML and verify the deployed source; see README.md.
