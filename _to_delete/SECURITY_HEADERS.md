# Security Headers Configuration

This document explains the security headers and Content Security Policy (CSP) implemented for HIV Connect Central NJ.

## Issues Fixed

### 1. CSS 404 Error ✅

**Problem:** CSS was incorrectly linked as `/src/styles/global.css` in HTML
**Solution:** Import CSS in Astro frontmatter (`import '../styles/global.css'`)

### 2. X-Frame-Options Error ✅  

**Problem:** Security headers set as meta tags instead of HTTP headers
**Solution:** Moved to proper HTTP headers via Netlify configuration

### 3. Missing CSP ✅

**Problem:** No Content Security Policy for XSS protection
**Solution:** Comprehensive CSP implemented via HTTP headers

## Security Headers Implemented

### Core Security Headers

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Content Security Policy (CSP)

```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
img-src 'self' data: https: blob:
font-src 'self' https://fonts.gstatic.com
connect-src 'self' https://api.netlify.com
frame-ancestors 'none'
base-uri 'self'
form-action 'self'
object-src 'none'
```

### Privacy Headers

```
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```

## Performance Headers

### Static Asset Caching

- **CSS/JS Files:** 1 year cache (`max-age=31536000, immutable`)
- **Images:** 30 days cache (`max-age=2592000`)
- **Fonts:** 1 year cache (`max-age=31536000, immutable`)
- **Favicon:** 1 week cache (`max-age=604800`)
- **HTML Pages:** No cache for fresh content (`max-age=0, must-revalidate`)

## Configuration Files

### 1. `public/_headers`

Primary headers configuration for Netlify deployment.

### 2. `netlify.toml`  

Comprehensive Netlify configuration including:

- Build settings
- Security headers (backup)
- Cache optimization
- Redirect rules
- Form processing
- Performance optimizations

## Testing Security Headers

Once deployed, test your security headers:

### Online Security Scanners

1. **Mozilla Observatory**: <https://observatory.mozilla.org/>
2. **Security Headers**: <https://securityheaders.com/>
3. **SSL Labs**: <https://www.ssllabs.com/ssltest/>

### Browser Developer Tools

1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Click on main HTML request
5. Check Response Headers section

### Expected Headers

You should see all the security headers listed above in the response.

## CSP Policy Explanation

### Why These Directives?

- **`default-src 'self'`**: Only allow resources from same origin by default
- **`script-src 'unsafe-inline' 'unsafe-eval'`**: Required for Astro and interactive components
- **`style-src 'unsafe-inline'`**: Required for component styling and Google Fonts
- **`img-src https: data: blob:`**: Allow images from HTTPS, data URLs, and blobs
- **`font-src https://fonts.gstatic.com`**: Allow Google Fonts
- **`connect-src https://api.netlify.com`**: Allow form submissions to Netlify
- **`frame-ancestors 'none'`**: Prevent clickjacking attacks
- **`object-src 'none'`**: Block dangerous plugins like Flash

## Monitoring & Maintenance

### CSP Violation Reports

Monitor browser console for CSP violations during development:

```javascript
// CSP violations appear as console errors
Refused to load ... because it violates CSP directive
```

### Updating CSP

If you add new external services:

1. Update the appropriate CSP directive in both configuration files
2. Test thoroughly
3. Deploy and verify with security scanners

## HTTPS & SSL

Netlify automatically provides:

- SSL certificates via Let's Encrypt
- Automatic HTTPS redirects
- HTTP/2 support
- TLS 1.3 support

## Compliance Benefits

These security headers help with:

- **OWASP Security Guidelines**
- **HIPAA Technical Safeguards** (relevant for HIV/health data)
- **PCI DSS Requirements** (if processing payments)
- **General Web Security Best Practices**
- **Google Lighthouse Security Scores**

## Emergency CSP Bypass

If CSP blocks legitimate functionality:

### Temporary Fix (Development)

Add to specific directive:

```
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://trusted-domain.com
```

### Permanent Fix (Production)

1. Identify specific resource causing issue
2. Add specific domain to appropriate directive
3. Remove broad permissions like 'unsafe-eval' if possible
4. Test thoroughly before deployment

## Support Resources

- **Netlify Headers Documentation**: <https://docs.netlify.com/routing/headers/>
- **MDN CSP Guide**: <https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP>
- **OWASP Security Headers**: <https://owasp.org/www-project-secure-headers/>
