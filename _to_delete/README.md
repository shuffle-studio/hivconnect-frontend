# _to_delete — hivconnect-frontend

Staged 2026-08-25. Nothing here is referenced by `src/`, `astro.config.mjs`,
`package.json`, `claude.md` or `README.md` — verified by grep before moving.

Delete the whole folder when you've eyeballed it:

    git rm -r --cached _to_delete && rm -rf _to_delete && git commit -m "chore: remove stale config and docs"

| File | Why it's here | Confidence |
|---|---|---|
| `netlify.toml` | **The important one.** This project deploys to Cloudflare Pages (`public/_headers`, `public/_redirects`). This file is left over from an earlier host, and its CSP sets `connect-src 'self' https://api.netlify.com` — narrower than the live policy and missing the backend origin entirely. Harmless while ignored, breaks everything the moment something reads it. | Safe |
| `.cloudflare-test` | One-line smoke-test marker written during the 2025-12-09 repo transfer. "Test deployment after repository transfer." | Safe |
| `TYPESCRIPT_FIX.md` | Writes up a `tsconfig.json` change that was already applied. The current tsconfig extends `astro/tsconfigs/strict` exactly as the doc's "After" block prescribes, so this is a changelog for a resolved issue. | Safe |
| `SECURITY_HEADERS.md` | Documents the Netlify header setup and quotes the stale `connect-src 'self' https://api.netlify.com` policy as if it were live. Actively misleading now. If you want header docs, write a short note pointing at `public/_headers` instead — don't restore this. | Safe |
| `bylaws.md` | 79 KB of raw bylaws text at the repo root, unreferenced. `/bylaws` fetches from the Payload `bylaws` collection at runtime, so this was almost certainly the one-time import source. | **Eyeball this one** — confirm the CMS copy is complete before deleting. |
