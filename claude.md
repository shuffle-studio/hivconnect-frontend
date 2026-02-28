# HIV Connect Central NJ

**Frontend**: [shuffle-studio/hivconnect-frontend](https://github.com/shuffle-studio/hivconnect-frontend)
**Backend**: [shuffle-studio/hivconnect-backend](https://github.com/shuffle-studio/hivconnect-backend)
**Linear**: [HIV Connect Central NJ](https://linear.app/shuffle-studio/project/hiv-connect-central-nj-2021-present) (`c55a46a8-1aee-45a2-919f-71bf525e8b73`)
**Parent Issue**: [SHU-9](https://linear.app/shuffle-studio/issue/SHU-9)
**Team**: Shuffle Studio (`9fe49653-ca9a-4541-8eee-3b2ecbcaff5f`)
**Cycle**: `efc108b3-37c9-4a40-993f-00aad0fbe8a9`
**Stakeholders**: Kevin (CTO), Jose (CEO) / Shuffle SEO — for Middlesex-Somerset-Hunterdon HIV Health Services Planning Council

---

## Deployment Policy

**Production only** — no staging environments per client directive.

| Environment | Frontend | Backend |
|---|---|---|
| Local | `localhost:4321` | `localhost:3000` |
| Production | `hivconnectcnj.org` | `hivconnect-backend.shufflestudio.workers.dev` |

**Auto-rebuild**: CMS content changes trigger Cloudflare Pages deploy hook. Frontend live in ~2-3 min.
Manual rebuild: push to `main` or `git commit --allow-empty -m "trigger rebuild"`.

---

## Infrastructure

### Cloudflare
- **Account**: Shuffle Studio — `77936f7f1fecd5df8504adaf96fad1fb`
- **Auth**: Wrangler OAuth as `kevin@shufflestudio.io` (`npx wrangler whoami`)

### Frontend (Cloudflare Pages)
- **Project**: `hivconnect-frontend`
- **URL**: `hivconnect-frontend.pages.dev` → `hivconnectcnj.org`
- Auto-deploys on push to `main`

### Backend (Cloudflare Workers)
- **Worker**: `hivconnect-backend`
- **URL**: `hivconnect-backend.shufflestudio.workers.dev`
- **Admin**: `hivconnect-backend.shufflestudio.workers.dev/admin`
- **Stack**: Next.js 15 + PayloadCMS 3 + Lexical rich text (OpenNext for Cloudflare)
- **Config**: `mshtga-backend/wrangler.jsonc`

### Database (Cloudflare D1)
- **Name**: `hivconnect-db-production`
- **ID**: `4dc8866a-3444-46b8-b73a-4def21b45772`
- **Query**: `cd ~/Desktop/ShuffleSEO/mshtga-backend && npx wrangler d1 execute hivconnect-db-production --remote --command "SQL"`
- **From file**: `npx wrangler d1 execute hivconnect-db-production --remote --file path/to/file.sql`

### Deploy Hook
- **URL**: `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/60788d5a-a22a-4bcf-a427-bdba665710d9`
- Configured in `wrangler.jsonc` as `DEPLOY_HOOK_URL`

### API (PayloadCMS REST)
- **Base URL**: `PUBLIC_PAYLOAD_URL` env var (set in Cloudflare Pages)
- **Public**: `GET /api/providers`, `/api/blog`, `/api/resources`, `/api/faqs`, `/api/pages`, `/api/events`
- **Frontend fetches**: `src/lib/api.ts`

---

## Database Tables

**Key tables**: `providers` (19 rows), `blog`, `faqs`, `resources`, `events`, `pages`, `media`, `users`

**Provider child tables**: `providers_services_medical`, `providers_services_support`, `providers_services_prevention`, `providers_languages`, `providers_accessibility`, `providers_eligibility`, `providers_insurance`, `providers_ryan_white_parts`

**Child table pattern**: `_order` (INTEGER), `_parent_id` (INTEGER FK), `id` (TEXT, 24-char hex), value column (e.g. `service`, `language`, `feature`).
Exception: `providers_ryan_white_parts` uses `order`, `parent_id`, `value`, `id` (INTEGER PK).

---

## Current State

**Collections (8 active + 3 scaffold)**:
Providers (19), Resources, Blog, PDF Library, FAQs (6 categories), Pages, Tags, Media
Scaffold: Events, Bylaws, Service Standards

**Globals**: Site Settings (hotline, logo, footer links, navigation)

**Frontend**: Astro 5 + React 18 + TypeScript + Tailwind CSS 3
Leaflet maps, Fuse.js search, React Hook Form + Zod, i18next

### Design System
| Token | Value | Usage |
|---|---|---|
| Primary | Teal `#0F766E` (-700) | Replaces red across site |
| Secondary | Coral `#C2410C` (-700) | Accents, CTAs |
| Accent | Gold scale | Highlights |
| Neutrals | Stone-50 | Section backgrounds |
| Error/Crisis | Red `bg-error-600` | Crisis banner, hotline, emergency |
| Headings | Source Serif 4 | Serif display font |

---

## Local Directories

```
~/Desktop/ShuffleSEO/mshtga/          — Frontend (Astro 5)
~/Desktop/ShuffleSEO/mshtga-backend/  — Backend (Next.js 15 + PayloadCMS 3)
~/Desktop/ShuffleSEO/mshtga-backend-OLD/ — Archived stale backend (safe to delete)
```

---

## Git Workflow

**Auto-commit/push permission granted** — commit when work is complete and stable, push immediately.

**Branch model**: `main` (production), `feature/*`, `hotfix/*` — no dev/staging branches.

**Commit format**:
```
[SHU-XXX] Brief description

- What changed
- Why

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Linear linking**: `[SHU-XXX]` in commit auto-links. `Closes SHU-XXX` auto-closes on merge.

**Time tracking**: Document all time in Linear issue comments when task completes.

---

## Key File Paths

**Frontend** (`mshtga/`):
- `src/lib/api.ts` — API fetch utilities
- `src/data/providers.ts` — Legacy static provider data (1106 lines)
- `src/pages/` — File-based routing (20+ pages)
- `src/components/providers/` — Provider cards, map, search, filters
- `src/components/forms/PlanningCouncilForm.tsx` — Multi-step form
- `src/i18n/locales/{en,es}.json` — Translations
- `src/layouts/BaseLayout.astro` — Base layout
- `astro.config.mjs` — Astro config (hybrid output, Cloudflare adapter)
- `tailwind.config.mjs` — Tailwind config

**Backend** (`mshtga-backend/`):
- `wrangler.jsonc` — Cloudflare Workers config (D1/R2 bindings, deploy hook)
- `src/hooks/triggerFrontendRebuild.ts` — Auto-rebuild hook

---

## Remaining Backlog

All tracked in [Linear](https://linear.app/shuffle-studio/project/hiv-connect-central-nj-2021-present):

- **SHU-522**: Update provider services data (content work)
- **SHU-527**: Verify & update events section
- **SHU-528**: Populate Bylaws/Service Standards in CMS
- **SHU-226**: Spanish language toggle (large scope)
- **SHU-228**: Lighthouse performance & accessibility
- **SHU-209**: Site search (Pagefind)
