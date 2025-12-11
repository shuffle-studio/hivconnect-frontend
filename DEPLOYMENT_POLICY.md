# HIV Connect CNJ - Deployment Policy

**Last Updated**: December 11, 2025
**Policy Owner**: Kevin (CTO)

---

## 🚨 CRITICAL POLICY: PRODUCTION ONLY - NO STAGING

**Per explicit client directive**: This project does NOT use staging environments.

### Environments

| Environment | Status | Purpose |
|-------------|--------|---------|
| **Local Development** | ✅ Active | Developer testing on `localhost:4321` (frontend) and `localhost:3000` (backend) |
| **Production** | ✅ Active | Live site at `https://hivconnectcnj.org` |
| **Staging** | ❌ REMOVED | Not used per client request |

### Production URLs

- **Frontend**: https://hivconnectcnj.org
- **Backend API**: https://hivconnect-backend-production.shuffle-seo.workers.dev
- **CMS Admin**: https://hivconnect-backend-production.shuffle-seo.workers.dev/admin
- **Database**: Cloudflare D1 (`hivconnect-db-production`)
- **Storage**: Cloudflare R2 (`hivconnect-media-production`)

---

## ⚡ Auto-Rebuild System

**IMPORTANT**: Frontend automatically rebuilds when backend content changes.

### How It Works

1. **Content Updated in PayloadCMS** (e.g., edit a provider, publish a blog post)
2. **Webhook Triggers** via `src/hooks/triggerFrontendRebuild.ts`
3. **Cloudflare Pages Rebuilds** frontend with latest data
4. **Site Live in 2-3 Minutes** with updated content

### Collections with Auto-Rebuild

These collections trigger automatic frontend rebuilds on create/update/delete:

- ✅ **Providers**
- ✅ **Resources**
- ✅ **Blog**
- ✅ **PDFLibrary**
- ✅ **FAQs**
- ✅ **Pages**
- ✅ **Events**
- ✅ **MembershipApplications**
- ✅ **SiteSettings** (global)

### Webhook Configuration

**File**: `/mshtga-backend-workers/src/hooks/triggerFrontendRebuild.ts`

**Environment Variable** (in `wrangler.jsonc`):
```json
{
  "vars": {
    "DEPLOY_HOOK_URL": "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/c0df877f-ae43-4c2a-a086-865760a8e702"
  }
}
```

**Cooldown**: 10 seconds (batches rapid changes to avoid multiple rebuilds)

### Viewing Rebuild Logs

Check Cloudflare Pages deployment history:
```bash
# View recent deployments
wrangler pages deployment list --project-name=hivconnect-frontend | head -20

# View live logs (when editing content)
wrangler pages deployment tail --project-name=hivconnect-frontend
```

---

## 🚀 Deployment Workflow

### Local Development → Production

```bash
# 1. Develop locally
cd /Users/kevincan/Desktop/ShuffleSEO/mshtga
pnpm dev  # http://localhost:4321

# 2. Test changes
# - Make sure frontend fetches from production backend API
# - Test all features work correctly

# 3. Commit changes
git add .
git commit -m "[SHU-XXX] Description"
git push origin main

# 4. Deploy frontend to production
pnpm run build
CLOUDFLARE_ACCOUNT_ID=77936f7f1fecd5df8504adaf96fad1fb npx wrangler pages deploy dist --project-name=hivconnect-frontend

# Frontend is now live at https://hivconnectcnj.org
```

### Backend Changes

```bash
# 1. Make changes to PayloadCMS collections/config
cd /Users/kevincan/Desktop/ShuffleSEO/mshtga-backend-workers

# 2. Generate migration (if schema changed)
NODE_ENV=production PAYLOAD_SECRET=ignore pnpm payload migrate:create

# 3. Run migration on production
CLOUDFLARE_ENV=production pnpm run deploy:database

# 4. Deploy backend to production
CLOUDFLARE_ENV=production pnpm run deploy:app

# Backend is now live at https://hivconnect-backend-production.shuffle-seo.workers.dev
```

### Content Updates (No Code Changes)

**Just edit in PayloadCMS admin** - frontend rebuilds automatically!

1. Go to https://hivconnect-backend-production.shuffle-seo.workers.dev/admin
2. Edit content (provider, blog post, FAQ, etc.)
3. Click "Save" or "Publish"
4. **Wait 2-3 minutes** for automatic frontend rebuild
5. Changes live at https://hivconnectcnj.org

---

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] All changes tested locally
- [ ] Code reviewed (if significant changes)
- [ ] Database migrations tested locally first
- [ ] No console errors in browser
- [ ] Mobile responsive (test on phone)
- [ ] Accessibility check (keyboard navigation works)
- [ ] Performance check (Lighthouse score >90)

---

## 🔧 Infrastructure Details

### Cloudflare Pages (Frontend)

**Project**: `hivconnect-frontend`
**Build Command**: `pnpm run build`
**Output Directory**: `dist`
**Framework**: Astro 5
**Node Version**: 18

**Custom Domain**: hivconnectcnj.org
**SSL**: Full (strict)

### Cloudflare Workers (Backend)

**Worker Name**: `hivconnect-backend-production`
**Database**: `hivconnect-db-production` (D1)
**Storage**: `hivconnect-media-production` (R2)
**Framework**: PayloadCMS 3.65.0

### Auto-Rebuild Webhook

**URL**: `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/c0df877f-ae43-4c2a-a086-865760a8e702`
**Project**: `hivconnect-frontend`
**Trigger**: POST request from PayloadCMS hooks

---

## 🚨 Troubleshooting

### Frontend Not Updating After Content Change

**Check if rebuild was triggered**:
```bash
wrangler pages deployment list --project-name=hivconnect-frontend | head -5
```

Look for deployment within last 2-3 minutes.

**If no rebuild triggered**:
1. Check backend logs: `wrangler tail hivconnect-backend-production --format pretty`
2. Look for: `🚀 Triggering frontend rebuild...` and `✅ Frontend rebuild triggered successfully!`
3. If missing, check `DEPLOY_HOOK_URL` is set in `wrangler.jsonc`

**Manually trigger rebuild**:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/c0df877f-ae43-4c2a-a086-865760a8e702"
```

### Changes Not Visible After Rebuild

**Clear browser cache**:
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Or open in incognito/private mode

**Verify deployment completed**:
- Go to Cloudflare Pages dashboard
- Check deployment status is "Success"
- Note the deployment timestamp

---

## 📚 Related Documentation

- **Auto-Rebuild Implementation**: `/mshtga-backend-workers/DEPLOYMENT.md` (Section: Webhook System)
- **Backend Deployment**: `/mshtga-backend-workers/PRODUCTION_DEPLOYMENT.md`
- **Project Context**: `/mshtga/CLAUDE.md`
- **Linear Project**: https://linear.app/shuffle-studio/issue/SHU-9

---

## ✅ Policy Summary

**What We DO**:
- ✅ Develop locally on `localhost`
- ✅ Deploy directly to production
- ✅ Use auto-rebuild webhook for content changes
- ✅ Test thoroughly before deploying

**What We DON'T DO**:
- ❌ **NO staging environments** (per client directive)
- ❌ NO separate staging databases
- ❌ NO staging URLs
- ❌ NO multi-environment complexity

**Why This Works**:
- Production database handles all content
- Auto-rebuild keeps frontend in sync automatically
- PayloadCMS admin is user-friendly enough for direct production editing
- Rollback via git history if needed

---

**Questions?** Check Linear issue SHU-9 or contact Kevin.
