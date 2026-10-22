# browsersupport.io

A JavaScript API explorer, rebuilt with Next.js App Router. The original 44,642-property collection remains a historical archive. Existence checks are deliberately separate from behavioral compatibility claims.

## Workspace

- **apps/web** — public site, search, API path navigation, browser observations, light/dark/system themes, and read-only API routes.
- **apps/lab** — localhost-only property discovery and detection. Never deployed.
- **packages/data** — MongoDB access, shared contracts, validation, and detector.

Next.js 16, React 19, Tailwind 4, next-themes, pnpm 11, Turborepo, Jest, ESLint, TypeScript, and Prettier. Dependency versions are exact; pnpm enforces a 48-hour release age and explicit build permissions.

## Local development

Use Node.js 24 or newer and the packageManager version of pnpm.

1. Run pnpm install.
2. Link the Vercel project named browsersupport in your personal team and pull development variables into the ignored root .env.local.
3. Copy .env.local into apps/web/.env.local and apps/lab/.env.local. Never commit these files. Both apps need MONGODB_URI. MONGODB_DATABASE defaults to browsersupport.
4. Run pnpm db:check to verify the connection. Run pnpm db:indexes only when setting up a new collection.
5. Run pnpm dev for the public site at http://127.0.0.1:3000.
6. Run pnpm dev:lab separately for the lab at http://127.0.0.1:3001.

The Vercel MongoDB Atlas integration supplies MONGODB_URI. The free resource is named Browsersupport; the application database is browsersupport and its collection is properties. A serverless connection pool is reused per process with at most five connections.

If Node reports ECONNREFUSED on an Atlas SRV lookup, check the machine’s DNS resolver. The application uses normal system DNS; it does not embed a public resolver or turn off TLS verification.

## Quality checks

- pnpm build builds **only web**.
- pnpm lint checks all workspaces.
- pnpm check-types checks all workspaces.
- pnpm test runs Jest checks for clickable paths, symbols, support semantics, input bounds, and acquisition behavior.
- pnpm format:check verifies Prettier formatting.
- pnpm audit --prod checks production dependency advisories.
- pnpm --filter @browsersupport/lab build verifies the optional local production build.

Use the Next.js docs bundled in apps/web/node_modules/next/dist/docs/ when changing framework behavior.

## Data and semantics

The original document layout is retained: name, created, and browsers[browserId][version]. Version dots are stored as underscores, e.g. safari / 9_1. Existing IDs and other original fields remain in MongoDB. The web serializer exposes only the fields it needs.

- **Present:** in is true, including an inherited property.
- **Absent:** in is false, or the parent, prototype, or required symbol was missing.
- **Unknown:** no observation, no decisive flag, or a thrown detection error.

Original test dates were not recorded. The created field identifies when a property record was created; it is not a test timestamp. New observations receive a server-generated recordedAt. No usage percentages or current browser-release claims are inferred from the old dataset.

Search treats user input literally and bounds query length, pagination, result size, and database execution time. It does not accept MongoDB expressions. Property URLs retain their original paths, including Array.prototype[@@iterator]. Case-insensitive suggestions redirect only when there is a single match.

Public endpoints: /api/properties?q=String&page=1, /api/properties/NAME, and /api/properties/stream (NDJSON names). The sitemap remains /sitemap.txt. Old /static/ example screenshots remain available.

## Running the lab

Use a clean browser profile without extensions or polyfills. Click Discover properties, review the names, then save them. Checks run in a fresh same-origin iframe to exclude Next.js development globals; API exposure can differ from a top-level page. Discovery inspects globals, static properties, prototypes, and well-known symbols without invoking global getters. Existing records are left intact.

Choose the actual browser family and version manually, then click Detect in this browser. The lab checks up to 500 untested properties per batch and stores only validated boolean flags, with a server-generated timestamp. Existing observations for that browser/version are never overwritten. Stop finishes the current batch; running the same version again resumes missing results.

No authentication is included: scripts bind to 127.0.0.1, requests require the local Host, and mutation requests require an exact local Origin. A VERCEL build is refused. The lab is excluded from deployment uploads. Do not expose it through a tunnel or change its listen address without adding suitable access controls.

The lab itself needs a browser supported by the modern Next.js stack. Sauce Labs and an ES5-compatible remote runner are not connected. Historical observations remain available regardless.

## Vercel

Deploy only apps/web as the browsersupport project. Project settings:

- Framework: Next.js; Node: 24.x.
- Root directory: apps/web; include workspace files outside that directory.
- Install: cd ../.. && pnpm install --frozen-lockfile.
- Build: cd ../.. && pnpm exec turbo run build --filter=@browsersupport/web.
- Function region: Frankfurt, alongside the Atlas resource.
- Connect the Browsersupport free Atlas resource to development, preview, and production.

A deployment to a Vercel URL does not move browsersupport.io automatically. Verify the deployment before updating the domain’s DNS, and keep the old host until the domain serves the new site correctly. Backups and migration exports belong outside this public repository and must never be uploaded to Vercel.
