# HIV Connect Central NJ - Project Context & Implementation Guide

**Last Updated**: February 18, 2026
**Project Repository (Frontend)**: https://github.com/shuffle-studio/hivconnect-frontend
**Project Repository (Backend)**: https://github.com/shuffle-studio/hivconnect-backend (local: `~/Desktop/ShuffleSEO/mshtga-backend`)
**Linear Project**: https://linear.app/shuffle-studio/project/active-client-delivery-q4-2025
**Prepared for**: Kevin / Shuffle SEO CTO
**Purpose**: Complete context document for AI assistants and developers

---

## 🎯 Project Management - Linear First

**IMPORTANT**: This project uses Linear for all active work tracking, task management, and progress updates.

- **Linear Project**: [HIV Connect Central NJ (2021-Present)](https://linear.app/shuffle-studio/project/hiv-connect-central-nj-2021-present) (`c55a46a8-1aee-45a2-919f-71bf525e8b73`)
- **Parent Issue**: [SHU-9 - Client Testing Follow-up & Support](https://linear.app/shuffle-studio/issue/SHU-9)
- **Team**: Shuffle Studio (`9fe49653-ca9a-4541-8eee-3b2ecbcaff5f`)
- **Current Cycle**: `efc108b3-37c9-4a40-993f-00aad0fbe8a9`

**Markdown Files (Documentation Only)**:
- `CLAUDE.md` - This file: Complete project context and technical documentation
- `PROJECT_STATUS.md` - Current deployment status, architecture overview
- `SESSION_*.md` - Session summaries for historical reference
- `DEPLOYMENT.md` - Deployment procedures and infrastructure

**Linear is the Single Source of Truth** for:
- ✅ Active tasks and sub-issues
- ✅ Progress tracking and status updates
- ✅ Blockers and decisions needed
- ✅ Client communication and deliverables
- ✅ Time estimates and priorities
- ✅ Git commit references and deployment tracking

See [Linear Integration & Workflow](#linear-integration--workflow) section below for details.

---

## 🚨 DEPLOYMENT POLICY - PRODUCTION ONLY

**CRITICAL**: This project does **NOT** use staging environments per explicit client directive.

### Environments
- ✅ **Local Development**: `localhost:4321` (frontend) and `localhost:3000` (backend)
- ✅ **Production**: `https://hivconnectcnj.org` (live site)
- ❌ **Staging**: REMOVED - Do not create staging environments

### Auto-Rebuild System
**Frontend automatically rebuilds when backend content changes** via webhook:
1. Edit content in PayloadCMS admin
2. Webhook triggers Cloudflare Pages rebuild
3. Frontend live with updates in 2-3 minutes

**See**: `DEPLOYMENT_POLICY.md` for complete details

**Collections with auto-rebuild**: Providers, Resources, Blog, PDFLibrary, FAQs, Pages, Events, MembershipApplications, SiteSettings

---

## Infrastructure & Access Reference

### Cloudflare Account
- **Account**: Shuffle Studio
- **Account ID**: `77936f7f1fecd5df8504adaf96fad1fb`
- **Auth**: Wrangler OAuth as `kevin@shufflestudio.io` (run `npx wrangler whoami` to verify)

### Frontend (Cloudflare Pages)
- **Project Name**: `hivconnect-frontend`
- **Domain**: `hivconnect-frontend.pages.dev` → `hivconnectcnj.org`
- **Git Repo**: `shuffle-studio/hivconnect-frontend` (auto-deploys on push to `main`)
- **Local Path**: `~/Desktop/ShuffleSEO/mshtga`
- **Trigger rebuild**: Push to `main` or empty commit `git commit --allow-empty -m "trigger rebuild"`

### Backend (Cloudflare Workers)
- **Worker**: `hivconnect-backend-production`
- **URL**: `hivconnect-backend-production.shuffle-seo.workers.dev`
- **Admin**: `hivconnect-backend-production.shuffle-seo.workers.dev/admin`
- **Local Path**: `~/Desktop/ShuffleSEO/mshtga-backend`
- **Config**: `mshtga-backend/wrangler.toml` (contains D1/R2 bindings)

### Database (Cloudflare D1)
- **Name**: `hivconnect-db-production`
- **ID**: `4dc8866a-3444-46b8-b73a-4def21b45772`
- **Direct SQL access**:
  ```bash
  cd ~/Desktop/ShuffleSEO/mshtga-backend
  npx wrangler d1 execute hivconnect-db-production --env production --remote --command "YOUR SQL HERE"
  ```
- **SQL file execution**:
  ```bash
  npx wrangler d1 execute hivconnect-db-production --env production --remote --file path/to/file.sql
  ```
- **Key tables**: `providers` (19 rows), `providers_services_medical`, `providers_services_support`, `providers_services_prevention`, `providers_languages`, `providers_accessibility`, `providers_eligibility`, `providers_insurance`, `providers_ryan_white_parts`, `blog`, `faqs`, `resources`, `events`, `pages`, `media`, `users`
- **Related table pattern**: Array fields use child tables with `_order` (INTEGER), `_parent_id` (INTEGER FK), `id` (TEXT, 24-char hex), and a value column (e.g., `service`, `language`, `feature`, `plan`, `requirement`). Exception: `providers_ryan_white_parts` uses `order`, `parent_id`, `value`, `id` (INTEGER PK).

### API (PayloadCMS REST)
- **Base URL**: `PUBLIC_PAYLOAD_URL` env var (set in Cloudflare Pages environment)
- **Public endpoints** (no auth): `GET /api/providers`, `GET /api/blog`, `GET /api/resources`, etc.
- **Admin endpoints**: Require JWT auth via PayloadCMS admin login
- **Frontend fetches**: See `src/lib/api.ts` — `fetchProviders()`, `fetchFAQs()`, etc.

### Linear
- **Team**: Shuffle Studio (`9fe49653-ca9a-4541-8eee-3b2ecbcaff5f`)
- **Project**: HIV Connect Central NJ (`c55a46a8-1aee-45a2-919f-71bf525e8b73`)
- **MCP tools available**: `mcp__plugin_linear_linear__*` (list_issues, create_comment, update_issue, etc.)

---

## Table of Contents

1. [Deployment Policy - Production Only](#-deployment-policy---production-only)
2. [Project Overview](#project-overview)
3. [Current Implementation](#current-implementation)
4. [Backend Requirements](#backend-requirements)
5. [Collections Architecture](#collections-architecture)
6. [Implementation Phases](#implementation-phases)
7. [Technical Decisions](#technical-decisions)
8. [Environment Setup](#environment-setup)
9. [File Location Reference](#file-location-reference)
10. [QA Checklists](#qa-checklists)
11. [Linear Integration & Workflow](#linear-integration--workflow)
12. [Development Workflow](#development-workflow)
13. [Next Steps](#next-steps)

---

## Project Overview

### Purpose
HIV Connect Central NJ is a comprehensive web platform for the Middlesex-Somerset-Hunterdon HIV Health Services Planning Council, providing:
- HIV/AIDS resources and services directory
- Provider information and mapping
- Educational content and blog
- PDF library for downloadable resources
- Multi-step Planning Council application
- Bilingual support (English/Spanish)

### Stakeholders
- **Organization**: Middlesex-Somerset-Hunterdon HIV Health Services Planning Council
- **Grantee**: County of Middlesex (Administrative Agent)
- **CTO**: Kevin / Shuffle SEO
- **CEO**: José / Shuffle SEO
- **End Users**: People living with HIV/AIDS, caregivers, service providers, community members

### Current State (as of Feb 18, 2026)

**✅ PRODUCTION DEPLOYED**:
- **Backend**: PayloadCMS on Cloudflare Workers (`hivconnect-backend-production.shuffle-seo.workers.dev`)
- **Frontend**: Astro 5 on Cloudflare Pages (`hivconnect-frontend.pages.dev` → `hivconnectcnj.org`)
- **Database**: Cloudflare D1 — `hivconnect-db-production` (ID: `4dc8866a-3444-46b8-b73a-4def21b45772`)
- **Storage**: Cloudflare R2 (PDFs and media)
- **Cloudflare Account**: Shuffle Studio (`77936f7f1fecd5df8504adaf96fad1fb`)
- **Auto-Rebuild**: Frontend rebuilds in 2-3 minutes when CMS content changes OR on git push to `main`

**Collections (8 Active + 3 Scaffold)**:
- ✅ Providers (19 active providers — including RWJ Dental added Feb 18)
- ✅ Resources (with internal PDF / external link support)
- ✅ Blog (for news and updates)
- ✅ PDF Library (versioned documents)
- ✅ FAQs (6 categories)
- ✅ Pages (custom content pages)
- ✅ Tags (shared across collections)
- ✅ Media (R2 uploads)
- 📦 Events (scaffold — collection exists, data populated)
- 📦 Bylaws (scaffold — collection exists, needs data)
- 📦 Service Standards (scaffold — collection exists, needs data)

**Globals (1)**:
- ✅ Site Settings (hotline, logo, footer links, navigation)

**Frontend Pages (20+ pages)**:
- ✅ All original 17 pages + FAQ, Resources, dynamic [slug], Events, Bylaws, Service Standards
- ✅ Provider detail pages with Ryan White template, walk-in/appointment badges
- ✅ Visual redesign: teal/coral palette (SHU-574), warm stone backgrounds, Source Serif 4 headings

**Design System (updated Feb 18, 2026)**:
- **Primary**: Teal (`#0F766E` at -700) — replaces red
- **Secondary**: Coral/Orange (`#C2410C` at -700)
- **Accent**: Gold scale
- **Neutrals**: Stone-50 for section backgrounds (replaces gray-50)
- **Error/Crisis**: Still red (`bg-error-600`) — crisis banner, emergency buttons, hotline
- **Headings**: Source Serif 4 (serif display font)

**Sprint Status (Feb 18, 2026 — Production Launch Sprint COMPLETE)**:
- ✅ SHU-519: Broken appointment buttons → contact popups
- ✅ SHU-523: Missing headers on 4 pages
- ✅ SHU-526: Homepage contact button centering
- ✅ SHU-524: RWJ Dental separated (static + D1 database)
- ✅ SHU-525: Walk-in vs appointment icons
- ✅ SHU-520: Ryan White info template
- ✅ SHU-574: Full visual redesign (red → teal/coral)
- ✅ Lexical rich text fix for FAQ, [slug], resources pages

**Remaining Backlog (not blocking launch)**:
- SHU-522: Update provider services data (content work)
- SHU-527: Verify & update events section
- SHU-528: Populate Bylaws/Service Standards in CMS
- SHU-226: Spanish language toggle (large)
- SHU-228: Lighthouse performance & accessibility
- SHU-209: Site search (Pagefind)

### Target Architecture (2026 Stack)
- **Frontend**: Astro 5 (SSG/hybrid) → Cloudflare Pages
- **Backend**: PayloadCMS (Node.js) → Cloudflare Workers
- **Storage**: Cloudflare R2 (PDFs and media)
- **Database**: Cloudflare D1 (SQLite edge database)
- **CDN**: Cloudflare global network
- **Forms**: Migrate from Netlify Forms to Payload collections

---

## Current Implementation

### Technology Stack

**Frontend Framework**:
- Astro 5.2.5 (latest)
- React 18.3.1 + React DOM (islands architecture)
- TypeScript 5.8.3 (strict mode)
- Tailwind CSS 3.4.17

**UI/UX Libraries**:
- @headlessui/react (accessible components)
- Leaflet + React Leaflet (interactive maps)
- Fuse.js (client-side fuzzy search)

**Forms & Validation**:
- React Hook Form 7.61.1
- Zod 3.25.76 (schema validation)

**Internationalization**:
- i18next 25.3.2
- react-i18next 15.6.1
- Built-in Astro i18n routing

**Other Dependencies**:
- @supabase/supabase-js 2.53.0 (not currently used, legacy)

### Pages Built (17 Total)

1. **Homepage** (`/`) - Hero, service categories, coverage area map
2. **Find Services** (`/find-services`) - Interactive provider directory with search/filter/map
3. **Get Tested** (`/get-tested`) - HIV testing information
4. **Treatment & Care** (`/treatment-care`) - Treatment options
5. **Support Resources** (`/support-resources`) - Support services
6. **About** (`/about`) - Organization information
7. **Contact** (`/contact`) - Contact form (Netlify Forms)
8. **Accessibility** (`/accessibility`) - Accessibility statement
9. **Privacy Policy** (`/privacy-policy`)
10. **Terms of Service** (`/terms-of-service`)
11. **Planning Council Application** (`/planning-council-application`) - Multi-step form (40+ fields)
12. **Provider Types** (`/provider-types`)
13. **Provider Detail** (`/providers/[id]`) - Dynamic route for individual provider pages
14. **Spanish Homepage** (`/es`) - Internationalized Spanish version
15. **Success Page** (`/success`) - Form submission confirmation
16. **404 Page** - Custom 404 error page
17. **500 Page** - Custom 500 error page

### Current Data Structure

**Provider Data** (`/src/data/providers.ts` - 1106 lines):
- 15 hardcoded providers across 3 counties (Middlesex, Somerset, Hunterdon)
- Comprehensive TypeScript interface:
  ```typescript
  interface Provider {
    id: string;
    name: string;
    description: string;
    category: string[];
    location: {
      address: string;
      city: string;
      state: string;
      zipCode: string;
      county: string;
    };
    contact: {
      phone: string;
      fax?: string;
      email: string;
      website: string;
    };
    hours: {
      monday?: string;
      tuesday?: string;
      wednesday?: string;
      thursday?: string;
      friday?: string;
      saturday?: string;
      sunday?: string;
    };
    services: {
      medical: string[];
      support: string[];
      prevention: string[];
    };
    eligibility: string[];
    ryanWhite: boolean;
    languages: string[];
    accessibility: string[];
    coordinates: {
      lat: number;
      lng: number;
    };
  }
  ```

**Translation Files**:
- `/src/i18n/locales/en.json` - English translations
- `/src/i18n/locales/es.json` - Spanish translations

**Forms**:
- **Contact Form** (`/src/pages/contact/index.astro`) - Static HTML form with Netlify integration
- **Planning Council Application** (`/src/components/forms/PlanningCouncilForm.tsx`) - Multi-step React form
  - 5 steps: Personal Info, Demographics, Services, Experience, Commitment
  - 40+ fields with validation
  - Hidden HTML form for Netlify detection
  - JavaScript submission to Netlify Forms API

### Key Features Implemented

#### 1. Provider Search & Directory
- **Search**: Text search across provider names, descriptions, and services (Fuse.js)
- **Filters**: Multi-select filters for county, services, insurance, languages
- **Map View**: Interactive Leaflet map with provider markers and popups
- **Real-time Updates**: Filters update search results and map markers instantly
- **Accessibility**: Keyboard navigation, screen reader support

#### 2. Internationalization (i18n)
- **Languages**: English (default), Spanish
- **Routing**: Automatic language detection, URL-based language switching (`/es/*`)
- **Components**: Language switcher in header
- **Translation Keys**: Organized by page/component in JSON files
- **Dynamic Content**: React-i18next for client-side components, Astro i18n for static pages

#### 3. Accessibility Features
- **WCAG Compliance**: Skip links, focus management, proper heading hierarchy
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: ARIA labels, semantic HTML, descriptive text
- **High Contrast Mode**: Respects user OS preferences
- **Reduced Motion**: Respects `prefers-reduced-motion` for animations
- **Touch-Friendly**: Minimum 44px touch targets for buttons

#### 4. Security Implementation
- **HTTP Headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, HSTS
- **Content Security Policy (CSP)**: Comprehensive CSP for XSS protection
- **HTTPS Enforcement**: Automatic redirects and HSTS preload
- **Permissions Policy**: Restricts camera, microphone, geolocation access
- **Privacy**: FLoC disabled (`interest-cohort=()`)

See `SECURITY_HEADERS.md` for full details.

### Current Deployment (Netlify)

**Build Configuration** (`netlify.toml`):
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18

**Features**:
- Automatic HTTPS with Let's Encrypt
- Form processing enabled
- Sitemap generation (`@netlify/plugin-sitemap`)
- Asset optimization (CSS/JS minification, image compression)
- Cache headers for static assets (1 year for immutable assets)

**Redirects**:
- HTTPS enforcement
- www → non-www canonicalization
- `/en/*` → `/*` (English is default, no prefix)
- 404 handling

### Current Gaps (Needs Backend)

❌ **No Content Management System** - All content hardcoded
❌ **No Blog/News System** - Blog collection not implemented
❌ **No PDF Library** - Resources collection not built
❌ **No Dynamic Provider Updates** - Providers are static TypeScript
❌ **No Media Management** - Images are in `/public/` directory
❌ **No Analytics/Events** - Not implemented
❌ **No Admin Interface** - No CMS for content updates
❌ **Form Data Isolation** - Forms stored in Netlify, not in database

---

## Backend Requirements

### Architecture Overview (from CTO Handoff)

The backend will use a **fully cloud-native Cloudflare stack**:

```
┌─────────────────────────────────────────────────────────────┐
│                     Cloudflare Network                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │ Pages        │──────│ Workers      │──────│ R2 Bucket │ │
│  │ (Frontend)   │      │ (PayloadCMS) │      │ (PDFs)    │ │
│  └──────────────┘      └──────┬───────┘      └───────────┘ │
│                                │                             │
│                         ┌──────▼───────┐                    │
│                         │ D1 Database  │                    │
│                         │ (SQLite)     │                    │
│                         └──────────────┘                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### PayloadCMS Backend

**Why PayloadCMS?**
- Node.js CMS with TypeScript support
- Headless architecture (API-first)
- Flexible collections and field types
- Built-in admin UI
- File upload support (integrates with R2)
- Migration system for database changes
- Access control and authentication
- GraphQL and REST APIs

**Hosting Options** (in priority order):

1. **Cloudflare Workers/Pages + Functions** *(preferred)*
   - Deploy PayloadCMS as a Cloudflare Worker
   - Use Wrangler for bundling and deployment
   - R2 and D1 bindings in `wrangler.toml`
   - Cost-effective, globally distributed

2. **Netlify Functions + Express Adapter** *(fallback)*
   - Deploy PayloadCMS with Express adapter
   - Use Netlify Functions for serverless backend
   - Still use Cloudflare R2 and D1 for storage
   - Keeps everything in Netlify during transition

3. **Azure App Service** *(if nonprofit grant credits available)*
   - Azure App Service for Node.js
   - Azure Functions with Express wrapper
   - Still prefer Cloudflare R2 for storage (Azure storage is expensive)

### Storage: Cloudflare R2

**Bucket Configuration**:
- **Bucket Name**: `hivconnect-pdfs`
- **Permissions**:
  - Public GET (allow downloads)
  - Private PUT/DELETE (admin only)
- **Folder Structure**:
  ```
  hivconnect-pdfs/
  ├── pdfs/
  │   ├── {uuid}/{filename}
  │   └── {uuid}/{filename}
  └── media/
      ├── images/{uuid}/{filename}
      └── documents/{uuid}/{filename}
  ```

**Upload Rules**:
- Path format: `/pdfs/{uuid}/{filename}` or `/media/{type}/{uuid}/{filename}`
- Auto-versioning enabled
- Auto-clean old versions (nightly cron job)

**Cleanup Script** (Cloudflare Cron Trigger):
```javascript
// Runs nightly at 2 AM
// 1. Find PDFs older than X days
// 2. Check if referenced in Payload database
// 3. Delete if unused
```

### Database: Cloudflare D1

**What is D1?**
- SQLite database running on Cloudflare's edge network
- Distributed globally, low latency
- SQL-compatible, familiar syntax
- Bindings in Workers for direct access

**Database**:
- **Production**: `hivconnect-db-production` (Cloudflare D1)

**Migration Workflow**:
```bash
# Payload handles migrations
NODE_ENV=production PAYLOAD_SECRET=ignore pnpm payload migrate:create

# Run migration on production
CLOUDFLARE_ENV=production pnpm run deploy:database

# Review migrations before deploying
# All migrations must be PR-reviewed by Kevin
```

### Environments

| Environment | Purpose | Database | R2 Bucket | Backend URL | Frontend URL |
|-------------|---------|----------|-----------|-------------|--------------|
| **Local** | Development | Local SQLite | Local filesystem | `localhost:3000` | `localhost:4321` |
| **Production** | Live site | `hivconnect-db-production` | `hivconnect-media-production` | `hivconnect-backend-production.shuffle-seo.workers.dev` | `hivconnectcnj.org` |

**⚠️ NO STAGING** per client directive - see [Deployment Policy](#-deployment-policy---production-only)

**Environment Policy**:
- Local for development and testing
- Production for live site
- Content changes in production trigger automatic frontend rebuilds (2-3 min)
- Rollback via git if needed

---

## Collections Architecture

### Version 1 Collections (Active - Build Now)

#### 1. Providers Collection

**Purpose**: Migrate existing 15 providers from TypeScript to CMS

**Fields**:
- `name` (text, required)
- `slug` (text, unique, auto-generated from name)
- `description` (richText or textarea)
- `category` (select, multi: medical, support, prevention)
- `location` (group):
  - `address` (text)
  - `city` (text)
  - `state` (text)
  - `zipCode` (text)
  - `county` (select: Middlesex, Somerset, Hunterdon)
- `contact` (group):
  - `phone` (text)
  - `fax` (text, optional)
  - `email` (email)
  - `website` (text)
- `hours` (group):
  - `monday` through `sunday` (text, optional)
- `services` (group):
  - `medical` (text, array)
  - `support` (text, array)
  - `prevention` (text, array)
- `eligibility` (text, array)
- `ryanWhite` (checkbox, boolean)
- `languages` (text, array)
- `accessibility` (text, array)
- `coordinates` (group):
  - `lat` (number)
  - `lng` (number)
- `status` (select: active, inactive, pending)
- `createdAt` (date, auto)
- `updatedAt` (date, auto)

**API Endpoints**:
- `GET /api/providers` - List all active providers
- `GET /api/providers/:slug` - Single provider by slug
- `POST /api/providers` - Create (admin only)
- `PATCH /api/providers/:id` - Update (admin only)
- `DELETE /api/providers/:id` - Delete (admin only)

**Migration Plan**:
1. Export `/src/data/providers.ts` to JSON
2. Create migration script to import into Payload
3. Validate all fields and relationships
4. Test API endpoints in staging

#### 2. Resources Collection

**Purpose**: Downloadable resources with PDF uploads and external links

**Fields**:
- `title` (text, required)
- `slug` (text, unique, auto-generated)
- `category` (select: Testing, Treatment, Support, Prevention, Legal, Financial)
- `description` (richText)
- `externalLink` (text, URL, optional)
- `pdfFile` (upload, optional) → Uploads to R2
- `tags` (relationship to Tags collection, multi)
- `language` (select: English, Spanish, Both)
- `featured` (checkbox, boolean)
- `publishedDate` (date)
- `status` (select: draft, published, archived)

**API Endpoints**:
- `GET /api/resources` - List published resources
- `GET /api/resources/:slug` - Single resource

**Use Case**: Staff uploads PDFs or links to external resources. Frontend displays as searchable/filterable library.

#### 3. Blog / News Collection

**Purpose**: News articles, updates, event announcements

**Fields**:
- `title` (text, required)
- `slug` (text, unique, auto-generated)
- `date` (date, required)
- `author` (text or relationship to Users)
- `featuredImage` (upload) → Uploads to R2
- `excerpt` (textarea, 200 chars)
- `content` (richText, required)
- `category` (select: News, Events, Updates, Stories)
- `tags` (relationship to Tags collection, multi)
- `language` (select: English, Spanish, Both)
- `status` (select: draft, published, archived)
- `publishedDate` (date)

**API Endpoints**:
- `GET /api/blog` - List published posts (paginated)
- `GET /api/blog/:slug` - Single post

**Frontend Pages to Build**:
- `/blog` - List view with pagination
- `/blog/:slug` - Single post view

#### 4. PDF Library Collection

**Purpose**: Versioned document management with metadata

**Fields**:
- `file` (upload, required) → R2
- `title` (text, required)
- `description` (textarea)
- `versionNumber` (text, e.g., "1.0", "2.1")
- `category` (select: Forms, Reports, Guides, Policies)
- `createdAt` (date, auto)
- `updatedAt` (date, auto)
- `status` (select: current, archived)

**API Endpoints**:
- `GET /api/pdf-library` - List current PDFs
- `GET /api/pdf-library/:id/download` - Download PDF

**Use Case**: Track versions of official documents (bylaws, policies, forms) with audit trail.

#### 5. Globals Collection

**Purpose**: Site-wide settings (single instance, no multiple entries)

**Fields**:
- `siteName` (text)
- `hotlineNumber` (text)
- `logo` (upload) → R2
- `footerLinks` (array):
  - `label` (text)
  - `url` (text)
- `socialMedia` (group):
  - `facebook` (text)
  - `twitter` (text)
  - `instagram` (text)
- `contactEmail` (email)
- `maintenanceMode` (checkbox)

**API Endpoint**:
- `GET /api/globals/site-settings`

**Use Case**: Update site-wide settings without code changes (hotline number, logo, footer links).

#### 6. Tags Collection

**Purpose**: Shared tags for Resources and Blog posts

**Fields**:
- `name` (text, unique, required)
- `slug` (text, unique, auto-generated)

**API Endpoint**:
- `GET /api/tags`

**Relationships**:
- Used by Resources collection
- Used by Blog collection
- Enables tag-based filtering and search

### Version 2 Collections (Scaffold Only - Hidden Until 2026)

**Purpose**: Prepare architecture for future features without active implementation

These collections should be:
- Created with basic structure
- Hidden in admin UI (access control)
- Documented for future development
- Not populated with data yet

#### 7. Events Collection (v2)

**Fields** (scaffold):
- `title`, `description`, `startDate`, `endDate`, `location`, `registrationLink`, `capacity`

#### 8. Calendar Collection (v2)

**Fields** (scaffold):
- `name`, `year`, `events` (relationship to Events)

#### 9. Volunteer / Donor Centers Collection (v2)

**Fields** (scaffold):
- `name`, `type`, `contactInfo`, `services`, `needs`

#### 10. Impact Dashboard Collection (v2)

**Fields** (scaffold):
- `metric`, `value`, `date`, `category`, `description`

#### 11. Analytics Schema Collection (v2)

**Fields** (scaffold):
- `page`, `visits`, `uniqueVisitors`, `avgTimeOnPage`, `date`

**Documentation Note**: Each v2 collection should have a `README.md` in its directory explaining:
- Purpose and use case
- Expected launch date (2026 SOW)
- Dependencies and integrations
- Design mockups or wireframes (if available)

---

## Implementation Phases

### Phase 1: Backend Setup (Weeks 1-2)

**Goal**: Initialize PayloadCMS backend and Cloudflare infrastructure

#### Tasks:
1. **Create Backend Repository** (or monorepo decision)
   - [ ] Decide: Monorepo vs. separate repos
   - [ ] Initialize new repo: `hivconnect-backend` or merge into `mshtga`
   - [ ] Set up branching model: `main`, `dev`, feature branches
   - [ ] Configure branch protection rules (Kevin reviews all PRs)

2. **Initialize PayloadCMS Project**
   ```bash
   npx create-payload-app@latest
   # Choose: TypeScript, Blank template
   # Database: SQLite (for D1 compatibility)
   ```
   - [ ] Configure `payload.config.ts`
   - [ ] Set up TypeScript types
   - [ ] Configure admin panel settings

3. **Cloudflare Infrastructure Setup**
   - [ ] Create Cloudflare account / access existing
   - [ ] Create R2 bucket: `hivconnect-pdfs-staging`
   - [ ] Create R2 bucket: `hivconnect-pdfs` (production)
   - [ ] Create D1 database: `hivconnect-cms-staging`
   - [ ] Create D1 database: `hivconnect-cms-prod`
   - [ ] Generate API tokens for R2 and D1 access

4. **Configure Cloudflare R2 Plugin for Payload**
   ```bash
   npm install @payloadcms/plugin-cloud-storage
   ```
   - [ ] Configure R2 adapter in `payload.config.ts`
   - [ ] Set up bucket bindings in `wrangler.toml`
   - [ ] Test file uploads to staging bucket

5. **Create PayloadCMS Collections**
   - [ ] Providers collection (migrate from TypeScript types)
   - [ ] Resources collection
   - [ ] Blog collection
   - [ ] PDF Library collection
   - [ ] Globals collection
   - [ ] Tags collection
   - [ ] All v2 collections (scaffolded, hidden)

6. **Configure `wrangler.toml`**
   ```toml
   name = "hivconnect-backend"
   main = "dist/worker.js"
   compatibility_date = "2024-01-01"

   [[r2_buckets]]
   binding = "PDF_BUCKET"
   bucket_name = "hivconnect-pdfs-staging"

   [[d1_databases]]
   binding = "DB"
   database_name = "hivconnect-cms-staging"
   database_id = "xxxx"
   ```

7. **Set Up Authentication**
   - [ ] Configure admin user creation
   - [ ] Set JWT secret in environment variables
   - [ ] Enable public API for GET requests (read-only)
   - [ ] Protect mutations (POST/PUT/DELETE) with authentication

8. **Deploy to Cloudflare Workers (Staging)**
   ```bash
   wrangler deploy
   ```
   - [ ] Test deployment: `https://staging-api.hivconnectcnj.org`
   - [ ] Verify admin UI loads: `https://staging-api.hivconnectcnj.org/admin`
   - [ ] Test API endpoints with curl/Postman

**Deliverables**:
- ✅ Backend repo with PayloadCMS configured
- ✅ Cloudflare R2 buckets (staging + production)
- ✅ Cloudflare D1 databases (staging + production)
- ✅ Collections created and tested
- ✅ Staging deployment live and accessible

---

### Phase 2: Data Migration (Week 3)

**Goal**: Migrate existing provider data from TypeScript to PayloadCMS

#### Tasks:
1. **Export Provider Data**
   - [ ] Create script: `scripts/export-providers.ts`
   - [ ] Read `/src/data/providers.ts`
   - [ ] Convert to JSON format matching Payload schema
   - [ ] Save to `data/providers-export.json`

2. **Create Migration Script**
   ```typescript
   // scripts/import-providers.ts
   import payload from 'payload';
   import providersData from '../data/providers-export.json';

   async function importProviders() {
     await payload.init({ ... });

     for (const provider of providersData) {
       await payload.create({
         collection: 'providers',
         data: provider,
       });
     }
   }
   ```
   - [ ] Write import script with error handling
   - [ ] Add validation for required fields
   - [ ] Log import progress and errors

3. **Run Migration in Staging**
   ```bash
   npm run migrate:providers -- --env=staging
   ```
   - [ ] Import all 15 providers
   - [ ] Verify no data loss
   - [ ] Check coordinates, hours, services arrays

4. **Test API Endpoints**
   - [ ] `GET /api/providers` → Returns all 15 providers
   - [ ] `GET /api/providers/hyacinth-foundation` → Returns single provider
   - [ ] Validate JSON structure matches frontend expectations
   - [ ] Test filters: `?county=Middlesex`, `?ryanWhite=true`

5. **Data Validation**
   - [ ] Compare original TypeScript data with API responses
   - [ ] Verify all fields present and correctly typed
   - [ ] Check special characters, line breaks in descriptions
   - [ ] Validate coordinates for map display

6. **Performance Testing**
   - [ ] Measure API response time (should be < 200ms)
   - [ ] Test with pagination: `?limit=10&page=1`
   - [ ] Check caching headers

**Deliverables**:
- ✅ All 15 providers migrated to Payload
- ✅ Migration scripts in repo (reusable)
- ✅ API endpoints returning correct data
- ✅ Validation report comparing old vs. new data

---

### Phase 3: Frontend Integration (Weeks 4-5)

**Goal**: Replace hardcoded data with API fetches in Astro frontend

#### Tasks:

1. **Add Cloudflare Pages Adapter to Astro**
   ```bash
   npx astro add cloudflare
   ```
   - [ ] Update `astro.config.mjs`:
     ```javascript
     import cloudflare from '@astrojs/cloudflare';
     export default defineConfig({
       output: 'hybrid', // Allow server endpoints
       adapter: cloudflare(),
       // ...
     });
     ```
   - [ ] Test local build: `npm run build`

2. **Update Environment Variables**
   - [ ] Create `.env.local`:
     ```
     PAYLOAD_URL=http://localhost:3000
     PUBLIC_PAYLOAD_URL=https://staging-api.hivconnectcnj.org
     ```
   - [ ] Add to Cloudflare Pages environment settings
   - [ ] Document in `.env.example`

3. **Create API Utility Functions**
   ```typescript
   // src/utils/api.ts
   const PAYLOAD_URL = import.meta.env.PUBLIC_PAYLOAD_URL;

   export async function getProviders() {
     const response = await fetch(`${PAYLOAD_URL}/api/providers?limit=100`);
     const { docs } = await response.json();
     return docs;
   }

   export async function getProvider(slug: string) {
     const response = await fetch(`${PAYLOAD_URL}/api/providers/${slug}`);
     const { doc } = await response.json();
     return doc;
   }
   ```
   - [ ] Create utility file
   - [ ] Add error handling and TypeScript types
   - [ ] Add caching strategy (optional)

4. **Update Provider Pages**

   **Find Services Page** (`/src/pages/find-services/index.astro`):
   ```astro
   ---
   // Before:
   // import { providers } from '../../data/providers';

   // After:
   import { getProviders } from '../../utils/api';
   const providers = await getProviders();
   ---
   ```
   - [ ] Replace import with API fetch
   - [ ] Test search functionality
   - [ ] Test filters (county, services, insurance, language)
   - [ ] Verify map markers display correctly

   **Provider Detail Page** (`/src/pages/providers/[slug].astro`):
   ```astro
   ---
   import { getProvider, getProviders } from '../../utils/api';

   export async function getStaticPaths() {
     const providers = await getProviders();
     return providers.map(provider => ({
       params: { slug: provider.slug },
       props: { provider },
     }));
   }

   const { provider } = Astro.props;
   ---
   ```
   - [ ] Update dynamic route
   - [ ] Test individual provider pages
   - [ ] Verify all fields display correctly

5. **Add Error Handling and Loading States**
   ```astro
   ---
   let providers = [];
   let error = null;

   try {
     providers = await getProviders();
   } catch (e) {
     error = e.message;
   }
   ---

   {error && <div class="error">Failed to load providers: {error}</div>}
   {!error && providers.length === 0 && <div>No providers found.</div>}
   ```
   - [ ] Add try/catch blocks
   - [ ] Display user-friendly error messages
   - [ ] Add loading spinners for client-side fetches

6. **Update CORS Configuration (if needed)**
   - [ ] Configure Payload to allow requests from frontend domain
   - [ ] Add CORS headers in PayloadCMS config
   - [ ] Test cross-origin requests in staging

7. **Test in Staging Environment**
   - [ ] Deploy frontend to Cloudflare Pages staging
   - [ ] Test all provider-related pages
   - [ ] Check network tab for API calls
   - [ ] Verify no CORS errors
   - [ ] Test on mobile devices

8. **Performance Optimization**
   - [ ] Implement API response caching (Cloudflare Cache API)
   - [ ] Add ISR (Incremental Static Regeneration) for provider pages
   - [ ] Optimize images from R2 with Cloudflare Image Resizing
   - [ ] Run Lighthouse audit (target: >90 performance score)

**Deliverables**:
- ✅ Frontend fetches provider data from API
- ✅ All provider pages work in staging
- ✅ Error handling and loading states implemented
- ✅ Performance benchmarks met

---

### Phase 4: New Features (Weeks 6-7)

**Goal**: Build blog and resource library features

#### Tasks:

1. **Blog Listing Page** (`/src/pages/blog/index.astro`)
   ```astro
   ---
   import { getBlogPosts } from '../../utils/api';
   const posts = await getBlogPosts({ limit: 10, page: 1 });
   ---

   <div class="blog-grid">
     {posts.map(post => (
       <article class="blog-card">
         <img src={post.featuredImage.url} alt={post.title} />
         <h2>{post.title}</h2>
         <p>{post.excerpt}</p>
         <a href={`/blog/${post.slug}`}>Read More</a>
       </article>
     ))}
   </div>
   ```
   - [ ] Create blog listing page
   - [ ] Add pagination component
   - [ ] Add category filter
   - [ ] Add search functionality

2. **Blog Detail Page** (`/src/pages/blog/[slug].astro`)
   - [ ] Create dynamic blog post page
   - [ ] Render rich text content
   - [ ] Add featured image
   - [ ] Add social sharing buttons
   - [ ] Add related posts section

3. **Resource Library Page** (`/src/pages/resources/index.astro`)
   ```astro
   ---
   import { getResources } from '../../utils/api';
   const resources = await getResources();
   ---

   <div class="resource-grid">
     {resources.map(resource => (
       <div class="resource-card">
         <h3>{resource.title}</h3>
         <p>{resource.description}</p>
         {resource.pdfFile && (
           <a href={resource.pdfFile.url} download>
             Download PDF
           </a>
         )}
         {resource.externalLink && (
           <a href={resource.externalLink} target="_blank">
             View Resource
           </a>
         )}
       </div>
     ))}
   </div>
   ```
   - [ ] Create resource library page
   - [ ] Add category filters
   - [ ] Add search functionality
   - [ ] Handle PDF downloads from R2

4. **PDF Upload Interface in PayloadCMS**
   - [ ] Test PDF upload in admin UI
   - [ ] Verify files upload to R2
   - [ ] Check public URL generation
   - [ ] Test download links on frontend

5. **Rich Text Rendering**
   - [ ] Install rich text renderer for blog content
   - [ ] Style rich text elements (headings, lists, links, images)
   - [ ] Handle embedded media
   - [ ] Add syntax highlighting for code blocks (if needed)

6. **Search Functionality**
   - [ ] Add full-text search API endpoint in Payload
   - [ ] Create search component for blog/resources
   - [ ] Implement search results page
   - [ ] Add search filters (date, category, tags)

7. **Multilingual Content**
   - [ ] Add language field to blog and resources
   - [ ] Filter content by language in frontend
   - [ ] Add language switcher for bilingual posts
   - [ ] Test Spanish translations

8. **Form Migration (Optional)**
   - [ ] Create Contact Form collection in Payload
   - [ ] Create Planning Council Application collection
   - [ ] Migrate form submissions from Netlify to Payload
   - [ ] Update frontend forms to POST to Payload API
   - [ ] Add email notifications for form submissions

**Deliverables**:
- ✅ Blog listing and detail pages
- ✅ Resource library with PDF downloads
- ✅ Search functionality
- ✅ Rich text rendering
- ✅ Multilingual content support

---

### Phase 5: Infrastructure & Deployment (Week 8)

**Goal**: Deploy to production Cloudflare environment

#### Tasks:

1. **Set Up Production Cloudflare Environment**
   - [ ] Create production `wrangler.toml` configuration
   - [ ] Update R2 bucket binding to `hivconnect-pdfs` (production)
   - [ ] Update D1 binding to `hivconnect-cms-prod`
   - [ ] Set production environment variables

2. **Configure R2 Bucket Policies**
   - [ ] Public GET access for downloads
   - [ ] Private PUT/DELETE (admin only)
   - [ ] Set up CORS policy for frontend domain
   - [ ] Configure cache headers for R2 assets

3. **Database Migration to Production**
   ```bash
   npm run payload:migrate -- --env=production
   ```
   - [ ] Run all migrations on production D1
   - [ ] Import initial data (providers, globals)
   - [ ] Verify data integrity

4. **Set Up Cloudflare Cron Job for PDF Cleanup**
   ```javascript
   // workers/cron-cleanup.ts
   export default {
     async scheduled(event, env, ctx) {
       // Find PDFs older than 90 days
       // Check if referenced in Payload
       // Delete if unused
     }
   }
   ```
   - [ ] Create cron worker script
   - [ ] Schedule to run nightly at 2 AM
   - [ ] Test in staging first
   - [ ] Add logging and error handling

5. **Update Content Security Policy (CSP)**
   - [ ] Add API domain to `connect-src`: `https://api.hivconnectcnj.org`
   - [ ] Add R2 domain to `img-src`: `https://hivconnect-pdfs.r2.dev`
   - [ ] Test CSP in staging
   - [ ] Deploy updated CSP to production

6. **Deploy Backend to Production**
   ```bash
   wrangler deploy --env production
   ```
   - [ ] Deploy PayloadCMS to production Workers
   - [ ] Verify admin UI: `https://api.hivconnectcnj.org/admin`
   - [ ] Test API endpoints
   - [ ] Create admin users

7. **Deploy Frontend to Cloudflare Pages Production**
   - [ ] Update environment variables for production
   - [ ] Deploy frontend: `npm run build && wrangler pages deploy dist`
   - [ ] Test all pages on production domain
   - [ ] Verify API connections

8. **DNS Configuration**
   - [ ] Point `api.hivconnectcnj.org` to Cloudflare Workers
   - [ ] Point `hivconnectcnj.org` to Cloudflare Pages
   - [ ] Enable Cloudflare proxy (orange cloud)
   - [ ] Configure SSL/TLS (Full mode)

9. **Run Full QA Checklist** (see [QA Checklists](#qa-checklists))
   - [ ] Backend QA (all 8 items)
   - [ ] Frontend QA (all 6 items)
   - [ ] Infrastructure QA (all 5 items)

10. **Performance & Security Audits**
    - [ ] Run Lighthouse audit (target: >90 all categories)
    - [ ] Test with Mozilla Observatory: https://observatory.mozilla.org/
    - [ ] Test with Security Headers: https://securityheaders.com/
    - [ ] Run WebPageTest for performance
    - [ ] Check SSL Labs: https://www.ssllabs.com/ssltest/

11. **Monitoring & Logging**
    - [ ] Set up Cloudflare Analytics
    - [ ] Configure error logging for Workers
    - [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
    - [ ] Create alerts for critical errors

**Deliverables**:
- ✅ Production backend deployed to Cloudflare Workers
- ✅ Production frontend deployed to Cloudflare Pages
- ✅ R2 buckets configured with correct policies
- ✅ Cron job running for PDF cleanup
- ✅ DNS configured correctly
- ✅ All QA checklists passed
- ✅ Monitoring and alerts set up

---

### Phase 6: v2 Scaffolding (Week 9)

**Goal**: Prepare architecture for 2026 v2 features

#### Tasks:

1. **Create Hidden Collections**
   - [ ] Events collection (structure only)
   - [ ] Calendar collection (structure only)
   - [ ] Volunteer/Donor Centers collection (structure only)
   - [ ] Impact Dashboard collection (structure only)
   - [ ] Analytics Schema collection (structure only)

2. **Configure Access Control**
   ```typescript
   // collections/Events.ts
   export const Events = {
     slug: 'events',
     access: {
       read: () => false, // Hidden from admin UI
       create: () => false,
       update: () => false,
       delete: () => false,
     },
     // ...fields
   }
   ```
   - [ ] Hide v2 collections in admin UI
   - [ ] Add admin note: "Coming in 2026"
   - [ ] Document how to enable in future

3. **Document v2 Architecture**
   - [ ] Create `/docs/v2-roadmap.md`
   - [ ] Document each v2 collection's purpose
   - [ ] Add wireframes/mockups (if available)
   - [ ] Estimate implementation effort for 2026

4. **API Placeholder Endpoints**
   - [ ] Create placeholder endpoints for v2 collections
   - [ ] Return 501 Not Implemented status
   - [ ] Add "Coming Soon" message in response

5. **Frontend Placeholder Pages** (optional)
   - [ ] `/events` page with "Coming Soon" message
   - [ ] `/volunteer` page with interest form
   - [ ] `/impact-dashboard` page with preview

6. **Create Handoff Documentation**
   - [ ] Update this `claude.md` file with latest info
   - [ ] Create `HANDOFF.md` for client (Terri, MSHTGA staff)
   - [ ] Create `DEVELOPER_GUIDE.md` for future devs
   - [ ] Record video walkthrough of admin UI (optional)

**Deliverables**:
- ✅ v2 collections scaffolded (hidden)
- ✅ v2 documentation created
- ✅ Handoff documentation complete
- ✅ Client training materials prepared

---

## Technical Decisions

### Repository Structure

**Decision**: Separate Repositories (Recommended)

**Rationale**:
- Clear separation of concerns (frontend vs. backend)
- Independent deployment pipelines
- Easier to manage access control (different devs for frontend/backend)
- Simpler CI/CD configuration

**Structure**:
```
Shuffle SEO GitHub Org
├── mshtga (frontend)
│   ├── src/
│   ├── public/
│   ├── astro.config.mjs
│   └── package.json
│
└── mshtga-backend (backend)
    ├── src/
    │   ├── collections/
    │   ├── payload.config.ts
    │   └── server.ts
    ├── wrangler.toml
    └── package.json
```

**Alternative**: Monorepo (if team prefers single repo)
```
mshtga/
├── apps/
│   ├── frontend/ (Astro)
│   └── backend/ (PayloadCMS)
├── packages/
│   └── shared-types/ (TypeScript types shared between frontend/backend)
├── turbo.json (if using Turborepo)
└── package.json
```

### Hosting Strategy

**Primary**: Cloudflare (2026 stack consolidation)
- Frontend: Cloudflare Pages
- Backend: Cloudflare Workers
- Storage: Cloudflare R2
- Database: Cloudflare D1
- CDN: Cloudflare global network

**Benefits**:
- Single vendor, simplified billing
- Global edge network, low latency
- Cost-effective (generous free tier)
- Integrated analytics and security
- No cold starts for Workers

**Transition Plan**:
1. Keep Netlify deployment for frontend during Phase 3-4 (testing)
2. Deploy backend to Cloudflare Workers first (Phase 1)
3. Migrate frontend to Cloudflare Pages in Phase 5
4. Deprecate Netlify deployment after successful production launch

**Fallback**: Netlify (if Cloudflare issues arise)
- Backend: Netlify Functions + Express adapter for PayloadCMS
- Frontend: Netlify (current setup)
- Storage: Still use Cloudflare R2 (cheaper than Netlify Large Media)
- Database: Still use Cloudflare D1 or migrate to Neon Postgres

**Azure**: Only if nonprofit grant credits are substantial
- Azure App Service for backend
- Azure Static Web Apps for frontend
- Still use Cloudflare R2 for storage (Azure Blob Storage is expensive)

### API Integration Pattern

**Pattern**: Static Site Generation (SSG) with API fetches at build time

**Astro Configuration**:
```javascript
export default defineConfig({
  output: 'hybrid', // SSG by default, opt-in to SSR per page
  adapter: cloudflare(),
});
```

**Data Fetching Strategy**:
1. **Build-time fetching** (SSG) for:
   - Provider directory (updates infrequently)
   - Blog posts (generate static pages at build time)
   - Resources library

2. **Server-side rendering** (SSR) for:
   - Dynamic search results
   - Filtered views
   - User-specific content (if added)

3. **Client-side fetching** (CSR) for:
   - Interactive filters on provider search
   - Real-time form validation
   - Dynamic content updates

**Example**:
```astro
---
// SSG: Fetch at build time
export const prerender = true; // Static generation

import { getProviders } from '../../utils/api';
const providers = await getProviders();
---

<!-- Page content -->
```

```astro
---
// SSR: Fetch at request time
export const prerender = false; // Server-side rendering

const { searchQuery } = Astro.url.searchParams;
const results = await searchProviders(searchQuery);
---

<!-- Search results -->
```

**Caching Strategy**:
- API responses cached at Cloudflare edge (CDN)
- Stale-while-revalidate for frequently accessed data
- Purge cache on content updates (webhook from PayloadCMS)

### Authentication & Security

**PayloadCMS Authentication**:
- JWT-based authentication for admin users
- Secure password hashing (bcrypt)
- Session management with httpOnly cookies

**API Security**:
- Public GET endpoints (read-only, no auth required)
- Protected mutations (POST/PUT/DELETE require authentication)
- Rate limiting on API endpoints (Cloudflare Workers rate limiting)
- CORS configuration:
  ```typescript
  cors: {
    origins: [
      'https://hivconnectcnj.org',
      'https://staging.hivconnectcnj.org',
      'http://localhost:4321', // Local dev
    ],
    credentials: true,
  }
  ```

**Content Security Policy (CSP)**:
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob: https://hivconnect-pdfs.r2.dev;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.hivconnectcnj.org;
  frame-ancestors 'none';
  form-action 'self';
  object-src 'none';
```

**R2 Bucket Security**:
- Public GET access (allow downloads)
- Private PUT/DELETE (admin only, authenticated)
- Signed URLs for temporary access (if needed)
- CORS policy allowing frontend domain

### TypeScript Type Sharing

**Challenge**: Keep frontend and backend types in sync

**Solution**: Generate types from Payload collections

**Approach 1**: Manual type definitions (simple)
```typescript
// frontend/src/types/payload.ts
export interface Provider {
  id: string;
  name: string;
  // ...match Payload collection fields
}
```

**Approach 2**: Shared types package (monorepo)
```
packages/shared-types/
└── src/
    ├── Provider.ts
    ├── BlogPost.ts
    └── index.ts
```
- Backend imports types for Payload collections
- Frontend imports same types for API responses
- Single source of truth

**Approach 3**: Generate types from Payload (advanced)
```bash
# Generate TypeScript types from Payload collections
npm run payload:generate-types
```
- Payload CLI generates types automatically
- Export to `types/generated.ts`
- Frontend imports generated types
- Run as pre-build step

**Recommendation**: Start with Approach 1 (manual), migrate to Approach 3 (generated) later

---

## Environment Setup

### Prerequisites

- Node.js 18+ (LTS)
- npm or pnpm
- Cloudflare account (free tier is sufficient for development)
- Git

### Local Development Setup

#### 1. Clone Repositories

```bash
# Frontend
git clone https://github.com/jukeboxjay/mshtga.git
cd mshtga
npm install

# Backend (once created)
git clone https://github.com/shuffleseo/mshtga-backend.git
cd mshtga-backend
npm install
```

#### 2. Environment Variables

**Frontend** (`.env.local`):
```bash
# Local backend (when running Payload locally)
PAYLOAD_URL=http://localhost:3000

# Or staging backend
# PUBLIC_PAYLOAD_URL=https://staging-api.hivconnectcnj.org

# Google Maps API key (optional, for development)
PUBLIC_GOOGLE_MAPS_API_KEY=demo-key
```

**Backend** (`.env`):
```bash
# PayloadCMS secret (generate with: openssl rand -base64 32)
PAYLOAD_SECRET=your-secret-key-here

# Database (local SQLite for development)
DATABASE_URI=file:./dev.db

# Cloudflare R2 (for local testing with wrangler)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
R2_BUCKET_NAME=hivconnect-pdfs-staging

# Email (for notifications, optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### 3. Install Wrangler (Cloudflare CLI)

```bash
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

#### 4. Create Cloudflare Resources

**R2 Bucket**:
```bash
wrangler r2 bucket create hivconnect-pdfs-staging
wrangler r2 bucket create hivconnect-pdfs
```

**D1 Database**:
```bash
wrangler d1 create hivconnect-cms-staging
wrangler d1 create hivconnect-cms-prod

# Note the database IDs for wrangler.toml
```

#### 5. Run Frontend Locally

```bash
cd mshtga
npm run dev
# Open http://localhost:4321
```

#### 6. Run Backend Locally

```bash
cd mshtga-backend
npm run dev
# Open http://localhost:3000/admin
```

### Testing Locally

**Option 1**: Frontend + Backend both local
- Backend on `localhost:3000`
- Frontend on `localhost:4321`
- Frontend calls local backend API

**Option 2**: Frontend local + Backend on staging
- Backend on `staging-api.hivconnectcnj.org`
- Frontend on `localhost:4321`
- Frontend calls staging backend API (test with real data)

### Deployment Workflows

#### Staging Deployment

**Backend**:
```bash
cd mshtga-backend
wrangler deploy --env staging
# Deploys to staging-api.hivconnectcnj.org
```

**Frontend**:
```bash
cd mshtga
npm run build
wrangler pages deploy dist --project-name=mshtga-staging
# Or push to 'dev' branch (auto-deploy on Cloudflare Pages)
```

#### Production Deployment

**Backend**:
```bash
cd mshtga-backend
npm run test # Run tests first
wrangler deploy --env production
# Deploys to api.hivconnectcnj.org
```

**Frontend**:
```bash
cd mshtga
npm run build
wrangler pages deploy dist --project-name=mshtga
# Or merge PR to 'main' branch (auto-deploy on Cloudflare Pages)
```

### CI/CD (GitHub Actions)

**Staging Auto-Deploy** (`.github/workflows/staging.yml`):
```yaml
name: Deploy to Staging

on:
  push:
    branches: [dev]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy dist --project-name=mshtga-staging
```

**Production Deploy** (manual, PR-based):
- Developer creates PR to `main` branch
- Kevin reviews PR
- After approval and merge, auto-deploy to production
- Requires passing tests and build

---

## File Location Reference

### Current Project Structure

```
mshtga/ (Frontend Repository)
├── public/                 # Static assets
│   ├── images/            # Hero images, logos, etc.
│   ├── favicon.svg        # Favicon
│   └── _headers           # Netlify HTTP headers
│
├── src/
│   ├── components/
│   │   ├── forms/         # Multi-step Planning Council form
│   │   │   ├── PlanningCouncilForm.tsx
│   │   │   └── steps/     # Form step components
│   │   ├── providers/     # Provider-related components
│   │   │   ├── ProviderCard.tsx
│   │   │   ├── ProviderMap.tsx
│   │   │   ├── ProviderSearch.tsx
│   │   │   └── ProviderFilters.tsx
│   │   └── ui/            # Reusable UI components
│   │       ├── Header.astro
│   │       ├── Footer.astro
│   │       └── LanguageSwitcher.tsx
│   │
│   ├── data/
│   │   └── providers.ts   # **15 providers (1106 lines)** ← MIGRATE THIS
│   │
│   ├── i18n/
│   │   ├── locales/
│   │   │   ├── en.json    # English translations
│   │   │   └── es.json    # Spanish translations
│   │   └── i18next.ts     # i18n configuration
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro  # Base layout with SEO, header, footer
│   │
│   ├── pages/             # File-based routing
│   │   ├── index.astro    # Homepage
│   │   ├── find-services/ # Provider directory
│   │   │   └── index.astro
│   │   ├── providers/
│   │   │   └── [id].astro # Dynamic provider detail page
│   │   ├── contact/
│   │   │   └── index.astro
│   │   ├── planning-council-application/
│   │   │   └── index.astro
│   │   ├── get-tested/
│   │   ├── treatment-care/
│   │   ├── support-resources/
│   │   ├── about/
│   │   ├── accessibility/
│   │   ├── privacy-policy/
│   │   ├── terms-of-service/
│   │   ├── provider-types/
│   │   ├── success.astro
│   │   ├── 404.astro
│   │   ├── 500.astro
│   │   └── es/            # Spanish homepage
│   │       └── index.astro
│   │
│   ├── styles/
│   │   └── global.css     # Global CSS + Tailwind
│   │
│   ├── types/
│   │   └── provider.ts    # TypeScript types for Provider
│   │
│   └── utils/
│       └── api.ts         # **CREATE THIS** ← API utility functions
│
├── astro.config.mjs       # Astro configuration
├── tailwind.config.mjs    # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies
├── netlify.toml           # Netlify deployment config (legacy)
├── wrangler.toml          # **CREATE THIS** ← Cloudflare Pages config
│
├── .env.example           # Example environment variables
├── .env.local             # Local environment variables (not committed)
│
├── README.md              # Project documentation
├── NETLIFY_FORMS.md       # Netlify Forms documentation
├── SECURITY_HEADERS.md    # Security headers documentation
├── TYPESCRIPT_FIX.md      # TypeScript configuration notes
├── bylaws.md              # Organizational bylaws (reference)
├── HIV Connect Central NJ Backend.md  # Backend requirements (this project)
└── claude.md              # **THIS FILE** ← Complete project context
```

### Future Backend Structure (To Be Created)

```
mshtga-backend/ (Backend Repository)
├── src/
│   ├── collections/       # PayloadCMS collections
│   │   ├── Providers.ts
│   │   ├── Resources.ts
│   │   ├── Blog.ts
│   │   ├── PDFLibrary.ts
│   │   ├── Globals.ts
│   │   ├── Tags.ts
│   │   └── v2/            # Version 2 collections (scaffolded)
│   │       ├── Events.ts
│   │       ├── Calendar.ts
│   │       ├── VolunteerCenters.ts
│   │       ├── ImpactDashboard.ts
│   │       └── Analytics.ts
│   │
│   ├── hooks/             # PayloadCMS hooks (lifecycle events)
│   │   └── afterChange.ts
│   │
│   ├── endpoints/         # Custom API endpoints
│   │   └── search.ts
│   │
│   ├── payload.config.ts  # Main Payload configuration
│   └── server.ts          # Express server entry point
│
├── workers/
│   └── cron-cleanup.ts    # Cloudflare Cron job for PDF cleanup
│
├── scripts/
│   ├── export-providers.ts   # Export providers from TypeScript
│   ├── import-providers.ts   # Import providers to Payload
│   └── seed-data.ts          # Seed initial data
│
├── data/
│   └── providers-export.json # Exported provider data
│
├── wrangler.toml          # Cloudflare Workers configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
├── .env.example           # Example environment variables
└── README.md              # Backend documentation
```

### Key Files to Create/Modify

#### Frontend (mshtga)

**Create**:
- [ ] `/src/utils/api.ts` - API utility functions for fetching data from Payload
- [ ] `/src/pages/blog/index.astro` - Blog listing page
- [ ] `/src/pages/blog/[slug].astro` - Blog detail page
- [ ] `/src/pages/resources/index.astro` - Resource library page
- [ ] `wrangler.toml` - Cloudflare Pages configuration

**Modify**:
- [ ] `/src/pages/find-services/index.astro` - Replace hardcoded providers with API fetch
- [ ] `/src/pages/providers/[id].astro` - Use API for provider detail
- [ ] `astro.config.mjs` - Add Cloudflare adapter, change output to 'hybrid'
- [ ] `.env.example` - Add PAYLOAD_URL variable

**Delete (after migration)**:
- [ ] `/src/data/providers.ts` - After successful migration to Payload

#### Backend (mshtga-backend)

**Create** (entire backend repository):
- [ ] All files in backend structure above
- [ ] Collections matching frontend types
- [ ] Migration scripts
- [ ] Cloudflare Workers configuration

---

## QA Checklists

### Backend QA Checklist

**Before deploying backend to production, verify**:

- [ ] **Can create resource**: Admin can create a new resource entry in PayloadCMS
- [ ] **Can upload PDF**: PDF uploads successfully to Cloudflare R2
- [ ] **Can download PDF**: PDF downloads work from R2 public URL
- [ ] **Can create blog post**: Admin can create blog post with rich text and featured image
- [ ] **All endpoints return 200**: Test all API endpoints with curl/Postman
  - `GET /api/providers`
  - `GET /api/providers/:slug`
  - `GET /api/resources`
  - `GET /api/blog`
  - `GET /api/globals/site-settings`
- [ ] **No CORS errors**: Frontend can fetch data from backend without CORS issues
- [ ] **Admin UI loads correctly**: PayloadCMS admin panel loads at `/admin`
- [ ] **Versioning works**: PDF library versioning works correctly
- [ ] **Authentication works**: Admin login and logout work correctly
- [ ] **Database migrations successful**: All migrations run without errors

### Frontend QA Checklist

**Before deploying frontend to production, verify**:

- [ ] **Resources load from API**: Resource library page fetches data from Payload API
- [ ] **Blog lists load from API**: Blog listing page fetches posts from Payload API
- [ ] **Individual posts load**: Blog detail pages load with correct content
- [ ] **PDF downloads work**: Clicking PDF download links downloads files from R2
- [ ] **Mobile view correct**: All pages responsive on mobile devices (iPhone, Android)
- [ ] **Lighthouse score > 90**: Run Lighthouse audit, ensure all scores above 90
  - Performance: >90
  - Accessibility: >90
  - Best Practices: >90
  - SEO: >90
- [ ] **Search works**: Provider search, blog search, resource search all functional
- [ ] **Filters work**: All filter options update results correctly
- [ ] **Forms submit**: Contact form and Planning Council form submit successfully
- [ ] **i18n works**: Language switcher changes content to Spanish

### Infrastructure QA Checklist

**Before going live, verify**:

- [ ] **R2 bucket accessible publicly**: Test direct R2 URLs for PDFs
- [ ] **D1 migrations successful**: Check D1 dashboard for migration status
- [ ] **Staging + production environments tested**: Both environments work independently
- [ ] **Cron job for PDF cleanup works**: Verify cron job executes on schedule
- [ ] **API keys secure**: Ensure no API keys exposed in frontend code or git history
- [ ] **HTTPS enforced**: All traffic uses HTTPS
- [ ] **Security headers present**: Check headers with browser DevTools
- [ ] **CSP not blocking resources**: No CSP violations in browser console
- [ ] **DNS configured correctly**: Domain points to correct services
- [ ] **Error monitoring active**: Errors logged to monitoring service

### Pre-Launch Checklist

**Final checks before public launch**:

- [ ] **Content review**: All content reviewed by Terri and MSHTGA staff
- [ ] **Legal review**: Privacy policy, terms of service reviewed
- [ ] **Accessibility audit**: Run axe DevTools, WAVE, or similar tool
- [ ] **Cross-browser testing**: Test on Chrome, Firefox, Safari, Edge
- [ ] **Performance testing**: Test with slow 3G network throttling
- [ ] **Load testing**: Test with multiple concurrent users (optional)
- [ ] **Backup strategy**: Database backup scheduled
- [ ] **Rollback plan**: Document how to rollback if issues arise
- [ ] **Monitoring alerts**: Set up alerts for downtime, errors, slow responses
- [ ] **Documentation complete**: All documentation updated (this file, README, etc.)
- [ ] **Client training**: Terri and staff trained on PayloadCMS admin UI
- [ ] **Handoff meeting**: Final handoff meeting with Kevin, José, Terri

---

## Linear Integration & Workflow

**As of December 9, 2025, all active work and task tracking for this project is managed in Linear.**

### Overview

This project uses the **Linear MCP (Model Context Protocol) Server** integrated with Claude Code, allowing AI assistants to:
- Read and update issue status
- Create comments with progress updates
- Track sub-issues and dependencies
- Link Git commits to Linear issues
- Manage labels and priorities

### Linear Workspace Structure

**Team**: Shuffle Studio
- **Team ID**: `9fe49653-ca9a-4541-8eee-3b2ecbcaff5f`
- **Icon**: Dashboard

**Project**: Active Client Delivery - Q4 2025
- **Project ID**: `8497394b-d4bf-4e25-95e4-e0b1ee1cc2d5`

**Parent Issue**: SHU-9 - Client Testing Follow-up & Support
- **Issue ID**: `2269be2d-d5ca-4e6d-a88f-60c6bbe40df9`
- **URL**: https://linear.app/shuffle-studio/issue/SHU-9
- **Due Date**: December 13, 2025
- **Status**: In Progress (4/8 sub-issues complete - 50%)

### Issue Status Workflow

**Available Statuses**:
- **Backlog** (unstarted) - Issue not yet prioritized
- **Todo** (unstarted) - Ready to start, dependencies met
- **In Progress** (started) - Actively being worked on
- **In Review** (started) - Awaiting review or client feedback
- **Done** (completed) - Fully complete and deployed
- **Canceled** (canceled) - No longer needed
- **Duplicate** (canceled) - Duplicate of another issue

**Status Transitions**:
```
Backlog → Todo → In Progress → In Review → Done
                      ↓
                  Canceled (if not needed)
```

### Key Labels for HIV Connect

- `Client-Delivery` - Active client builds and fixes
- `Follow-Up` - Awaiting external response
- `This-Week` - Must complete by Friday
- `🔴 Active Client` - Paying retainer or active engagement
- `💵 MRR` - Monthly recurring revenue
- `🔄 Migration` - WordPress to modern stack
- `Cloudflare` - Uses Cloudflare infrastructure

### Daily Workflow with Linear

**1. Morning Standup** (via Linear):
   - Review "In Progress" issues
   - Add daily plan comment to active issues
   - Move priority items from "Backlog" to "Todo"

**2. During Development**:
   - Update issue status: Backlog → Todo → In Progress
   - Add progress comments with completed tasks
   - Reference Linear IDs in Git commits: `[SHU-XXX]`
   - Document blockers immediately in comments

**3. End of Day**:
   - Add progress comment with summary
   - Move completed issues to "Done"
   - Update parent issue (SHU-9) with overall progress

**4. Weekly Review** (Fridays):
   - Close completed issues
   - Review blocked issues
   - Plan next week's priorities
   - Sync with PROJECT_STATUS.md (documentation only)

### Linear MCP Tools Available

**Issue Management**:
- `mcp__linear-server__get_issue` - Get issue details by ID
- `mcp__linear-server__list_issues` - List with filters
- `mcp__linear-server__create_issue` - Create new issues
- `mcp__linear-server__update_issue` - Update status, assignee, etc.

**Comments**:
- `mcp__linear-server__list_comments` - Read issue comments
- `mcp__linear-server__create_comment` - Add progress updates

**Organization**:
- `mcp__linear-server__list_teams` - List teams
- `mcp__linear-server__list_projects` - List projects
- `mcp__linear-server__list_users` - List workspace users
- `mcp__linear-server__list_cycles` - List team cycles

**Labels & Status**:
- `mcp__linear-server__list_issue_labels` - Available labels
- `mcp__linear-server__create_issue_label` - Create labels
- `mcp__linear-server__list_issue_statuses` - Workflow statuses

**Documentation**:
- `mcp__linear-server__search_documentation` - Search Linear docs

### Git Integration with Linear

**Branch Naming** (Linear auto-generates):
```
kevin/shu-9-hiv-connect-client-testing-follow-up-support
```

**Commit Message Format** (include Linear ID):
```
[SHU-XXX] Brief description of change

Detailed explanation:
- What changed
- Why it changed
- How to test

Related: SHU-XXX (for related issues)
Part of: SHU-9 (for parent issue)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Examples**:
```
[SHU-203] Add FAQ collection and page

Backend Changes:
- Created FAQs.ts collection with 6 categories
- Added auto-rebuild hooks

Frontend Changes:
- Created /faq page with accordion UI
- Added fetchFAQs() API utility

Part of: SHU-9 (Client Testing Follow-up & Support)
```

**Auto-Linking**:
- Mention `SHU-XXX` in commit → Linear automatically links commit
- Use `Closes SHU-XXX` → Auto-closes issue on merge to main
- Use `Related SHU-XXX` → Links without closing

### Comment Templates

**Progress Update**:
```markdown
## Progress Update - [Date]

**Completed**:
- ✅ Task 1 description
- ✅ Task 2 description

**In Progress**:
- 🔄 Task 3 (50% complete)

**Blockers**:
- ⏸️ Waiting on [person/decision]

**Next Steps**:
- Start Task 4
- Follow up with [person]

**Links**:
- Commit: [hash] (auto-linked if [SHU-XXX] in message)
- Deployment: [URL]
```

**Implementation Complete**:
```markdown
## ✅ Implementation Complete

**Status**: [Feature name] fully implemented and deployed

### Backend Implementation (commit `abc123`)
- Created [collection/feature]
- Key changes: [list]

### Frontend Implementation (commit `def456`)
- Created [pages/components]
- Key changes: [list]

### ✅ Acceptance Criteria (All Met)
- ✅ Criterion 1
- ✅ Criterion 2

### Known Limitations
- [List any known issues or deferred work]

### Next Steps
- [What comes next]

### Git References
- Backend: [commit URL]
- Frontend: [commit URL]
```

### Client Communication via Linear

**SHU-9 Type Issues** (client-visible):
- Keep descriptions client-friendly
- Use checklists for transparency
- Add comments for progress updates
- Tag with `Follow-Up` when awaiting client response
- Set due dates aligned with client expectations
- Include testing URLs and access info (in secure comments)

**Internal Issues**:
- Technical descriptions are fine
- Reference code paths and files
- Include debugging notes
- Link to technical documentation

### Linear vs. Markdown Files

**Linear** (Single Source of Truth for Active Work):
- ✅ Current tasks and priorities
- ✅ Progress tracking
- ✅ Blockers and decisions
- ✅ Time estimates
- ✅ Client deliverables
- ✅ Git commit links

**Markdown Files** (Documentation Only):
- `CLAUDE.md` - Project context and technical docs
- `PROJECT_STATUS.md` - Deployment status, architecture
- `SESSION_*.md` - Historical session summaries
- `DEPLOYMENT.md` - Deployment procedures
- `PROJECT_TODO.md` - **DEPRECATED** (use Linear instead)

### Transition from MD to Linear

**Before (Pre-Dec 9, 2025)**:
- PROJECT_TODO.md had 150+ tasks across 6 phases
- Mixed tracking between MD files and Linear
- No central progress visibility

**After (Dec 9, 2025 onwards)**:
- All active tasks tracked in Linear
- MD files for documentation only
- Single source of truth in Linear
- Real-time progress visibility
- Better client communication

### Benefits of Linear Integration

**For Development**:
- ✅ Real-time progress tracking
- ✅ Automatic Git commit linking
- ✅ Dependency management (parent/child issues)
- ✅ Time tracking (estimates vs. actuals)
- ✅ Context preservation in comments

**For Client Communication**:
- ✅ Transparent progress visibility
- ✅ Clear deliverables with checklists
- ✅ Status updates in one place
- ✅ Easy handoff documentation

**For Team Collaboration**:
- ✅ Clear task ownership
- ✅ Workload visibility
- ✅ Handoff documentation
- ✅ Knowledge retention

**For Project Management**:
- ✅ Velocity tracking
- ✅ Bottleneck identification
- ✅ Scope management
- ✅ Timeline tracking

### Current SHU-9 Sub-Issues

**✅ Completed (4/8 - 50%)**:
1. SHU-203 - FAQ Collection + Page
2. SHU-205 - Navigation Restructure
3. SHU-206 - External Resources Page
4. SHU-204 - Pages Collection

**⏸️ Blocked - Need Decisions (2/8)**:
5. SHU-202 - Events/Calendar (BLOCKER - blocking launch)
6. SHU-207 - Membership Application (needs clarification)

**📅 Deferred to 2026 (2/8)**:
7. SHU-208 - Full Events System (~$2K value)
8. SHU-209 - Site Search (~$800 value)

---

## Development Workflow

### Git & GitHub Permissions

**IMPORTANT**: Kevin has granted Claude Code permission to commit and push to GitHub autonomously.

**Guidelines for Auto-Commit/Push**:

✅ **DO auto-commit and push** in these scenarios:
- Completed features with all tests passing
- Bug fixes that are ready for production
- Documentation updates
- Configuration changes that don't break functionality
- After deploying changes (keep git in sync with deployments)
- When work is at a natural stopping point and tests pass
- Migrations that have been successfully applied

❌ **ASK before committing** in these scenarios:
- Breaking changes or major refactors
- Changes that require user configuration
- Experimental or unfinished features
- When multiple implementation approaches are possible

**Commit Best Practices**:
- Use clear, descriptive commit messages with Linear IDs ([SHU-XXX])
- Follow conventional commit format
- Include "what changed" and "why" in commit body
- Reference Linear issues in commits
- Include co-authorship tag

**Push Timing**:
- Push immediately after committing (keep remote in sync)
- Don't batch up multiple commits before pushing
- Push after each logical unit of work is complete

**Auto-Commit Policy** (Effective December 11, 2025):
- Claude Code has permission to commit and push without asking
- Use judgment: commit when work is complete and stable
- Document what was committed in the response to user
- User trusts Claude Code to make good decisions on commit timing

**Time Tracking Policy** (Effective December 11, 2025):
- **ALL time spent must be documented in Linear**
- Track time from start of user's request to task completion
- Include: planning, implementation, troubleshooting, testing, deployment
- Add time tracking comment to Linear issue when task is complete
- Format: "**Time Spent**: X hours (breakdown: planning Xh, implementation Xh, fixes Xh)"
- Be accurate - include all work including research, debugging, and iterations

### Branching Model

```
main (production only)
  ├── feature/event-maps
  ├── feature/new-collection
  └── hotfix/security-patch
```

**Branch Rules**:
- `main` = production, all commits deploy to live site
- `feature/*` = feature branches, created from `main`, merged back to `main`
- `hotfix/*` = urgent fixes, created from `main`, merged back to `main`
- **No dev/staging branches** (per deployment policy)

**Workflow**:
1. Create feature branch from `main`
2. Develop and test locally
3. Commit and push feature branch (or push directly to `main` for small changes)
4. Deploy to production when ready
5. Frontend auto-rebuilds via webhook when backend content changes

### Pull Request Process

**Note**: PRs are optional for this project. Can push directly to `main` for most changes.

**When to use PRs** (optional):
- Major architectural changes
- Breaking changes
- When you want code review before deploying

**Simple workflow** (most common):
1. Make changes on `main` or feature branch
2. Test locally
3. Commit and push to `main`
4. Changes deploy to production
5. Frontend auto-rebuilds if backend content changed

**PR workflow** (when needed):
1. **Create feature branch**:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/new-feature
   ```

2. **Implement feature**:
   - Write code
   - Test locally
   - Update documentation

3. **Create PR**:
   - Push branch to GitHub
   - Create PR from `feature/new-feature` to `main`
   - Fill out PR template with description

4. **Review** (if needed):
   - Kevin reviews if significant changes
   - Approve or request changes

5. **Merge to main**:
   - Squash and merge (clean history)
   - Delete feature branch
   - Changes deploy to production

### Commit Message Format

Use conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling

**Examples**:
```
feat(providers): migrate provider data to PayloadCMS

- Export providers from TypeScript to JSON
- Create import script for Payload
- Update API utility to fetch from backend

Closes #42
```

```
fix(blog): resolve CORS error on blog listing page

- Add blog API domain to CORS whitelist
- Update CSP to allow api.hivconnectcnj.org

Fixes #56
```

### Code Review Guidelines

**For Reviewers (Kevin)**:
- Check for security vulnerabilities (XSS, SQL injection, etc.)
- Verify error handling and edge cases
- Check TypeScript types are correct
- Ensure accessibility standards met
- Verify responsive design on mobile
- Check performance (no unnecessary re-renders, API calls)
- Ensure consistent code style
- Verify documentation updated

**For Developers**:
- Self-review before requesting review
- Keep PRs focused and small (<500 lines)
- Write clear commit messages and PR description
- Add tests for new features (if applicable)
- Update documentation for API changes
- Respond to review comments promptly

### Testing Strategy

**Manual Testing**:
- Test all features locally before pushing
- Test in staging after merge to `dev`
- Test in production after merge to `main`

**Automated Testing** (future):
- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for critical user flows (Playwright)
- Visual regression tests (Percy, Chromatic)

**QA Environment**:
- Staging environment mirrors production
- Test with real data (anonymized if sensitive)
- Test on multiple devices and browsers

---

## Next Steps

**🎯 All active tasks are tracked in Linear**: https://linear.app/shuffle-studio/issue/SHU-9

The following goals provide context, but **Linear is the single source of truth** for current priorities and status.

### Immediate Tasks (This Week - Dec 9-13, 2025)

**See Linear SHU-9 for details**:

**Option A - Address Blockers** (Recommended):
- SHU-202: José + Kevin decide Events/Calendar approach
- SHU-207: José clarify Membership Application with Terri
- Implement based on decisions

**Option B - Content Population** (Can do in parallel):
- Add 10-15 FAQs to test FAQ page
- Add 10-15 external resources (POZ, HRSA, CDC, etc.)
- Create sample Planning Council page
- Client training on new features

**Option C - Production Readiness**:
- Install Lexical rich text renderer for FAQ/Pages
- Add i18n translation keys for navigation labels
- Final QA and testing
- Performance optimization

### Short-Term Goals (Next 2-3 Weeks)

**Tracked in Linear** - Major milestones:
- Complete all SHU-9 sub-issues (currently 4/8 done)
- Resolve Events/Calendar blocker
- Launch site to production
- Client handoff and training

### Medium-Term Goals (Q1 2026)

**Will create Linear issues when ready**:
- Content population (providers, resources, blog posts)
- Client self-service enablement
- Performance optimization
- Analytics implementation

### Long-Term Goals (2026+)

**Deferred Linear issues** (SHU-208, SHU-209, future):
- Full Events System with registration (~$2K value)
- Site Search with Pagefind (~$800 value)
- Volunteer/Donor Centers
- Impact Dashboard
- Advanced analytics tracking

---

## ⚠️ Important: Using Linear

**For all active work**:
1. Check Linear first: https://linear.app/shuffle-studio/issue/SHU-9
2. Update issue status as you work
3. Add progress comments daily
4. Reference Linear IDs in Git commits: `[SHU-XXX]`
5. Mark issues "Done" when complete

**This CLAUDE.md file is for**:
- Project context and background
- Technical architecture documentation
- Environment setup instructions
- Development workflow guidelines
- Historical reference

**This CLAUDE.md file is NOT for**:
- Active task tracking (use Linear)
- Progress updates (use Linear comments)
- Blockers and decisions (use Linear)
- Time estimates (use Linear)
- Current priorities (use Linear)

---

## Session Continuity

**For Future Claude Sessions**:

This section provides a quick overview of the project's current state and recent progress. **For detailed task tracking, always check Linear first** (https://linear.app/shuffle-studio/issue/SHU-9).

### Last Session: February 18, 2026

**Production Launch Sprint — ALL COMPLETE**:
- ✅ SHU-519/523/526: Linear housekeeping (marked Done, already shipped in `df81b9e`)
- ✅ SHU-524: RWJ Dental as separate provider — added to `providers.ts` AND PayloadCMS D1 via wrangler SQL
- ✅ SHU-525: Walk-in/appointment badges on ProviderCard + [id].astro
- ✅ SHU-520: Ryan White info template on provider detail pages
- ✅ Lexical rich text fix (`renderLexicalToHTML`) for FAQ, [slug], resources pages
- ✅ SHU-574: Full 26-file visual redesign (red → teal/coral, gray → stone, hero overlays lightened)

**Key Commits**:
- `2bec20b` — Main sprint commit (26 files: all features + full redesign)
- `f780f96` — Empty commit to trigger Cloudflare Pages rebuild for D1 data

**Infrastructure Connections Verified**:
- Wrangler authenticated as `kevin@shufflestudio.io` (OAuth token)
- Cloudflare account: Shuffle Studio (`77936f7f1fecd5df8504adaf96fad1fb`)
- D1 database: `hivconnect-db-production` (`4dc8866a-3444-46b8-b73a-4def21b45772`)
- Can execute SQL directly via: `cd mshtga-backend && npx wrangler d1 execute hivconnect-db-production --env production --remote --command "SQL_HERE"`
- Pages project: `hivconnect-frontend` (auto-deploys on push to `main`)
- Backend repo: `~/Desktop/ShuffleSEO/mshtga-backend` (contains `wrangler.toml` with D1/R2 bindings)

**Remaining Backlog** (see Linear for details):
- SHU-522: Update provider services data (content work for Terri)
- SHU-527: Verify & update events section
- SHU-528: Populate Bylaws/Service Standards collections in CMS
- SHU-226: Spanish language toggle (large scope)
- SHU-228: Lighthouse performance & accessibility
- SHU-209: Site search (Pagefind)

**Where to Find Active Work**:
- **Linear**: https://linear.app/shuffle-studio/project/hiv-connect-central-nj-2021-present (Single source of truth)
- **Git Commits**: Reference `[SHU-XXX]` in commit messages
- **This File**: Documentation and context only (not for active tracking)

---

## Additional Resources

### Documentation Links

**Astro**:
- [Astro Documentation](https://docs.astro.build/)
- [Astro i18n Guide](https://docs.astro.build/en/guides/internationalization/)
- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)

**PayloadCMS**:
- [Payload Documentation](https://payloadcms.com/docs)
- [Payload Collections](https://payloadcms.com/docs/configuration/collections)
- [Payload Cloud Storage Plugin](https://payloadcms.com/docs/plugins/cloud-storage)

**Cloudflare**:
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

**React & TypeScript**:
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)

### Related Documents in This Repo

- `README.md` - Basic project overview and commands
- `NETLIFY_FORMS.md` - Netlify Forms configuration and troubleshooting
- `SECURITY_HEADERS.md` - Security headers implementation details
- `TYPESCRIPT_FIX.md` - TypeScript configuration notes
- `bylaws.md` - MSHTGA organizational bylaws (reference)
- `HIV Connect Central NJ Backend.md` - Original CTO handoff document

---

## Changelog

### December 2, 2025
- Initial creation of `claude.md`
- Compiled all project information into single source of truth
- Documented current state, backend requirements, and implementation plan
- Created 6-phase implementation roadmap
- Defined all collections and their structures
- Documented technical decisions and environment setup

### February 18, 2026
- **Production Launch Sprint completed** — all 6 plan steps done
- Visual redesign: red → teal/coral across 26 files (SHU-574)
- RWJ Dental added as provider #19 (static data + PayloadCMS D1 direct insert)
- Walk-in/appointment badges added to provider cards and detail pages (SHU-525)
- Ryan White info template on provider detail pages (SHU-520)
- Lexical rich text renderer (`renderLexicalToHTML`) wired into FAQ, [slug], resources
- Wrangler D1 access verified and documented (can INSERT/SELECT production database)
- Updated Session Continuity, Current State, and infrastructure details in CLAUDE.md
- All sprint Linear issues marked Done (SHU-519/520/523/524/525/526/574)

### [Future Updates]
- Populate Bylaws/Service Standards collections (SHU-528)
- Provider services data audit (SHU-522)
- Lighthouse performance pass (SHU-228)
- Spanish language implementation (SHU-226)
- Site search with Pagefind (SHU-209)

---

**End of Document**

This file serves as the comprehensive context document for the HIV Connect Central NJ project. It should be updated regularly as the project progresses through implementation phases. Future Claude sessions should read this file first to understand the complete project context.
