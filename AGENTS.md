# Working conventions

- Use pnpm and exact versions. Keep the 48-hour release age and explicit build permissions in pnpm-workspace.yaml.
- apps/web is the public Next.js App Router site; apps/lab is localhost-only. Application code lives in each app's app/ directory, with @/ pointing there.
- Only deploy apps/web. Do not expose lab routes, credentials, or acquisition writes through the public site. Lab uses port 3001, loopback binding, and Host/Origin checks instead of authentication.
- Keep original property URLs and individually clickable API path segments, including well-known symbols.
- Preserve historical observations. Missing results and detection errors are unknown; property presence is not behavioral compatibility. Never present old results as current.
- Share data contracts and MongoDB access through packages/data. Prefer TypeScript configs and package.json PostCSS settings.
- Verify changes with build, lint, types, Jest, and formatting. Read bundled Next.js docs before changing framework behavior.
- This repository is public. Keep backups, exports, credentials, account details, and visitor data out of commits and uploads.
- Use lowercase conventional commits.
