# HIV Connect Central NJ - Project Context & Implementation Guide

**Last Updated**: December 2, 2025
**Project Repository**: https://github.com/jukeboxjay/mshtga
**Prepared for**: Kevin / Shuffle SEO CTO
**Purpose**: Complete context document for AI assistants and developers

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Current Implementation](#current-implementation)
3. [Backend Requirements](#backend-requirements)
4. [Collections Architecture](#collections-architecture)
5. [Implementation Phases](#implementation-phases)
6. [Technical Decisions](#technical-decisions)
7. [Environment Setup](#environment-setup)
8. [File Location Reference](#file-location-reference)
9. [QA Checklists](#qa-checklists)
10. [Development Workflow](#development-workflow)
11. [Next Steps](#next-steps)

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

### Current State (as of Dec 2025)
✅ **Production Astro Frontend**: 17 pages built and deployed on Netlify
✅ **Provider Directory**: 15 providers with comprehensive data (hardcoded in TypeScript)
✅ **Forms**: Contact form and multi-step Planning Council application (Netlify Forms)
✅ **i18n**: Full bilingual support (English/Spanish)
✅ **Accessibility**: WCAG-compliant with comprehensive a11y features
✅ **Security**: Proper HTTP headers, CSP, HTTPS enforcement
⏳ **Backend**: Not yet implemented (this document outlines the plan)

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

**Databases**:
- **Staging**: `hivconnect-cms-staging`
- **Production**: `hivconnect-cms-prod`

**Migration Workflow**:
```bash
# Payload handles migrations
npm run payload:migrate

# Review migrations before production
# All migrations must be PR-reviewed by Kevin
```

**Why Separate DBs?**
- Staging for testing new features, data imports
- Production for live site
- Prevents accidental data corruption

### Environments

| Environment | Purpose | Database | R2 Bucket | URL |
|-------------|---------|----------|-----------|-----|
| **Local** | Development | Local SQLite | Local filesystem | `localhost:3000` |
| **Staging** | Testing, QA | `hivconnect-cms-staging` | `hivconnect-pdfs-staging` | `staging-api.hivconnectcnj.org` |
| **Production** | Live site | `hivconnect-cms-prod` | `hivconnect-pdfs` | `api.hivconnectcnj.org` |

**Environment Separation**:
- Staging and production MUST have separate databases and buckets
- No cross-contamination of data
- Staging can be reset and reseeded without affecting production

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

## Development Workflow

### Branching Model

```
main (production)
  ├── dev (staging)
  │   ├── feature/provider-migration
  │   ├── feature/blog-pages
  │   └── feature/resource-library
  └── hotfix/security-patch
```

**Branch Rules**:
- `main` = production, protected, requires PR review by Kevin
- `dev` = staging, auto-deploys to staging environment
- `feature/*` = feature branches, created from `dev`, merged back to `dev`
- `hotfix/*` = urgent fixes, created from `main`, merged to both `main` and `dev`

### Pull Request Process

1. **Developer creates feature branch**:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/provider-migration
   ```

2. **Developer implements feature**:
   - Write code
   - Write tests (if applicable)
   - Update documentation
   - Test locally

3. **Developer creates PR**:
   - Push branch to GitHub
   - Create PR from `feature/provider-migration` to `dev`
   - Fill out PR template:
     - What changed?
     - Why did it change?
     - How to test?
     - Screenshots (if UI changes)

4. **Kevin reviews PR**:
   - Check code quality
   - Check adherence to best practices
   - Test functionality in review environment
   - Approve or request changes

5. **Merge to dev**:
   - Squash and merge (clean history)
   - Auto-deploy to staging
   - Test in staging environment

6. **Merge to main** (for production release):
   - Create PR from `dev` to `main`
   - Kevin reviews and approves
   - Merge to `main`
   - Auto-deploy to production

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

### Immediate Tasks (This Week)

1. **Backend Repository Setup**:
   - [ ] Create new GitHub repository: `mshtga-backend`
   - [ ] Initialize PayloadCMS project
   - [ ] Set up Cloudflare account and resources

2. **Cloudflare Infrastructure**:
   - [ ] Create R2 buckets (staging + production)
   - [ ] Create D1 databases (staging + production)
   - [ ] Configure wrangler.toml

3. **Collection Definition**:
   - [ ] Define Providers collection (match TypeScript types)
   - [ ] Define Resources collection
   - [ ] Define Blog collection
   - [ ] Define PDF Library collection
   - [ ] Define Globals collection

### Short-Term Goals (Next 2-3 Weeks)

- [ ] Complete Phase 1: Backend Setup
- [ ] Complete Phase 2: Data Migration
- [ ] Start Phase 3: Frontend Integration
- [ ] Deploy backend to staging environment
- [ ] Test API endpoints thoroughly

### Medium-Term Goals (Next 1-2 Months)

- [ ] Complete Phase 3: Frontend Integration
- [ ] Complete Phase 4: New Features (blog, resources)
- [ ] Complete Phase 5: Infrastructure & Deployment
- [ ] Launch to production

### Long-Term Goals (2026)

- [ ] Complete Phase 6: v2 Scaffolding
- [ ] Implement Events and Calendar features
- [ ] Implement Volunteer/Donor Centers
- [ ] Implement Impact Dashboard
- [ ] Implement Analytics tracking

---

## Session Continuity

**For Future Claude Sessions**:

This section will be updated after each major session to document progress and blockers.

### Last Session: December 2, 2025

**Completed**:
- ✅ Comprehensive project scan
- ✅ Analyzed all existing documentation
- ✅ Created this `claude.md` file with complete project context

**Current Status**:
- Frontend is production-ready on Netlify
- Backend has not been started yet
- Ready to begin Phase 1: Backend Setup

**Next Tasks**:
- Create backend repository
- Set up Cloudflare infrastructure
- Define PayloadCMS collections

**Blockers**:
- None currently

**Questions for Kevin**:
1. Confirm repository structure preference (monorepo vs. separate repos)
2. Confirm Cloudflare as primary hosting platform
3. Confirm timeline expectations for Phase 1-2

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

### [Future Updates]
- Update after each major phase completion
- Document new features added
- Update blockers and next steps
- Track progress against original plan

---

**End of Document**

This file serves as the comprehensive context document for the HIV Connect Central NJ project. It should be updated regularly as the project progresses through implementation phases. Future Claude sessions should read this file first to understand the complete project context.
