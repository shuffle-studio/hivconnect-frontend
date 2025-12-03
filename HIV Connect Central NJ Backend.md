# **HIV Connect Central NJ Backend**

## **CTO Handoff Document**

**Prepared for:** Kevin / Shuffle SEO CTO  
**Prepared by:** José / Shuffle SEO CEO  
**Date:** November 2025

# **Purpose of This Document**

This handoff outlines the full technical plan, workflows, and deployment blueprint for the HIV Connect backend project using:

* PayloadCMS

* Cloudflare (R2 \+ D1/D3 \+ Workers/Pages)

* Astro frontend \- [https://github.com/jukeboxjay/mshtga](https://github.com/jukeboxjay/mshtga)

It is designed so a developer can execute cleanly, while Kevin oversees architecture, reviews PRs, and ensures best practices.

This document includes dual-hosting instructions for Netlify, Azure, and Cloudflare, since we may have legacy deployments in place.

# **Project Architecture (High Level)**

## **Frontend**

* Astro (already built [https://github.com/jukeboxjay/mshtga](https://github.com/jukeboxjay/mshtga))

* Hosting options (all supported):

  * Cloudflare Pages *(preferred for 2026 stack consolidation)*

  * Netlify *(legacy projects)*

  * Azure Static Web Apps *(enterprise/nonprofit credits)*

## **Backend**

* **PayloadCMS (Node.js)**

* Hosted on:

  * Cloudflare Workers/Pages with Functions *(preferred)*

  * Azure App Service *(alternative)*

  * Netlify Functions \+ Express adapter *(fallback)*

## **Storage**

* PDFs → Cloudflare R2 (public bucket, download enabled)

* Media → R2 (same bucket, separation by folder)

* Database → Cloudflare D1 *(preferred)*

* Optionally support D3 for future scaling

## **Environments**

* Staging

* Production

Both environments must have separate DB \+ buckets.

# **Collections & CMS Structure**

## **Collections (Version 1\)**

1. **Resources**

   * title

   * category

   * description

   * externalLink

   * pdfFile (upload → R2)

   * tags

2. **Blog / News**

   * title

   * slug

   * date

   * author

   * featuredImage

   * content (rich text)

3. **PDF Library**

   * file

   * title

   * description

   * versionNumber

   * category

   * createdAt

4. **Globals**

   * siteName

   * hotlineNumber

   * logo

   * footerLinks

## **Collections (Version 2 – Scaffold Only)**

*(Hidden / disabled until 2026 SOW)*

* Events

* Calendar

* Volunteer / Donor Centers

* Impact Dashboard

* Analytics Schema

**Purpose:**  
 We prebuild the structure so v2 modules "snap in" without restructuring data.

# **Deployment & Hosting Plan**

# **Option A — Cloudflare (Preferred 2026 Stack)**

## **Backend (PayloadCMS)**

* Cloudflare Pages \+ Functions

* Worker bundling via Wrangler

### **Required files:**

* `wrangler.toml`

* `functions/[[path]].ts`

* `dist/worker.js`

### **R2 Binding:**

`[[r2_buckets]]`  
`binding = "PDF_BUCKET"`  
`bucket_name = "hivconnect-pdfs"`

### **D1 Binding:**

`[[d1_databases]]`  
`binding = "DB"`  
`database_name = "hivconnect-db"`  
`database_id = "xxxx"`

## **Frontend (Astro)**

* Cloudflare Pages

* Direct API calls to Payload

# **Option B — Netlify (Legacy & Transitional Projects)**

## **Backend:**

* Deploy as Netlify Functions

* Use Express adapter for Payload

* R2 \+ D1 still managed through Cloudflare

## **Frontend:**

* Standard Astro deployment on Netlify \- [https://github.com/jukeboxjay/mshtga](https://github.com/jukeboxjay/mshtga)

# **Option C — Azure (For Nonprofit Grant Credits)**

## **Backend Options:**

* Azure App Service (Node)

* Azure Functions w/ Express wrapper

## **Frontend:**

* Azure Static Web Apps

## **Storage:**

* PDFs still in Cloudflare R2 (Azure storage is more expensive) unless we have a grant contract

# **File Storage (Cloudflare R2)**

### **Bucket Name:**

`hivconnect-pdfs`

### **Permissions:**

* Public GET

* Private PUT/DELETE

### **Upload Rules:**

* Upload path: `/pdfs/{uuid}/{filename}`

* Auto-clean old versions: **enabled**

### **Auto-clean Script (run nightly):**

* find PDFs older than X days

* check if referenced in Payload

* delete if unused

Script will run via Cloudflare Cron Trigger.

# **Database (Cloudflare D1)**

## **Staging DB**

Name:

`hivconnect-cms-staging`

## **Production DB**

Name:

`hivconnect-cms-prod`

### **Migration Workflow:**

`npm run payload:migrate`

All migrations must be PR-reviewed by Kevin.

# **Development Workflow (Step-by-Step)**

### **1\. Clone repos**

* `hivconnect-backend`

* `hivconnect-frontend`

### **2\. Install dependencies**

`npm install`

### **3\. Create `.env` files**

* STAGING env

* PROD env

* All secrets stored in Cloudflare/Netlify environment panel

### **4\. Build Collections**

* Use templates provided

* Make sure fields match the SOW

* Add scaffold for v2 collections (hidden)

### **5\. Add R2 upload configuration**

* Using Payload Cloudflare R2 plugin

### **6\. Add API keys & auth**

* CMS admin login

* JWT secret

* Public API enabled for GET access

### **7\. Connect Astro to API**

Modify Astro pages:

``const data = await fetch(`${PAYLOAD_URL}/api/resources`).then(r => r.json());``

### **8\. Test API locally**

Payload test commands:

`npm run dev`

### **9\. Push to GitHub**

* Junior dev pushes to `dev`

* Kevin reviews & merges into `main`

### **10\. Deploy automatically**

* Cloudflare Pages triggers on merge

* Netlify triggers on merge if using fallback infra

# **QA Checklist (Non-Negotiable)**

### **Backend QA**

* Can create resource

* Can upload PDF

* Can download PDF

* Can create blog post

* All endpoints return 200

* No CORS errors

* Admin UI loads correctly

* Versioning works

### **Frontend QA**

* Resources load

* Blog lists load

* Individual posts load

* PDF downloads work

* Mobile view correct

* Lighthouse score \> 90

### **Infrastructure QA**

* R2 bucket accessible publicly

* D1 migrations successful

* Staging \+ production environments tested

* Cron job for PDF cleanup works

* API keys secure

# **Final Deliverables**

### **Deliverable Set A — Repos**

* GitHub repos (backend & frontend)

* Branching model established

* Protected main branch

### **Deliverable Set B — Infrastructure**

* Cloudflare R2 bucket

* Cloudflare D1 DB

* Cloudflare Pages pipeline

* Cron job for PDF cleanup

* Staging \+ Production environments

### **Deliverable Set C — Documentation**

* `README.md`

* `.env.example`

* CMS usage guide for Terri

* Dev workflow for junior team members

### **Deliverable Set D — v2 Preparation**

* Scaffolded collections

* Architectural placeholders

* Documentation for future dashboard

# **Notes for Kevin**

* This project is a blueprint for our new 2026 full Cloudflare architecture.

* It intentionally removes Heroku/Vercel dependencies.

* It prepares for:

  * custom dashboards

  * volunteer/donor logic

  * impact/analytics

  * role-based content publishing

* This is the first nonprofit system in our new PayloadCMS \+ Astro \+ Cloudflare stack.

