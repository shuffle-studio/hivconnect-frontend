import {
  fetchProviders,
  fetchEvents,
  fetchFAQs,
  fetchResources,
  fetchPages,
  extractTextFromLexical,
} from './api';
import type { SearchDoc } from './searchScore';

export * from './searchScore';

/**
 * Site-wide search index, built at build time.
 *
 * Closes the thread Terri opened on Dec 12, 2025 ("what about a search bar?"),
 * which was answered "we're working on that integration still" and never came
 * back. Until now the only search on the site was ProviderSearch, scoped to the
 * provider directory on /find-services.
 *
 * WHY A PREBUILT INDEX RATHER THAN A SEARCH ENDPOINT
 * The frontend is astro output:'static' on Cloudflare Pages, so there is no
 * server route to query. The alternatives were a client fetch against the
 * backend Worker on every keystroke, or a static index shipped with the site.
 * The index wins here: this is a small site (roughly 20 providers, a handful of
 * events, FAQs, resources and pages), so the whole corpus is smaller than one
 * hero image. It also means search keeps working if the Worker is down, costs
 * nothing per query, and needs no CSP change.
 *
 * Rebuilt on every deploy, and the CMS already triggers a rebuild on content
 * change via triggerFrontendRebuild, so the index does not go stale.
 */

/** Keep the index small. Nobody matches on the 400th word of a description. */
function trim(text: string, max = 400): string {
  const clean = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length > max ? clean.slice(0, max) : clean;
}

const PAYLOAD_URL =
  import.meta.env.PUBLIC_PAYLOAD_URL || 'https://login.hivconnectcentralnj.com';

/**
 * Fetch a collection directly for the types api.ts has no helper for.
 * Never throws: one unreachable collection must not fail the whole build.
 */
async function fetchRaw(slug: string): Promise<any[]> {
  try {
    const res = await fetch(
      `${PAYLOAD_URL}/api/${slug}?where[status][equals]=published&limit=200`,
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { docs?: any[] };
    return data.docs ?? [];
  } catch {
    return [];
  }
}

/** Run a source, but never let one failure take the build down. */
async function safely(label: string, fn: () => Promise<SearchDoc[]>): Promise<SearchDoc[]> {
  try {
    return await fn();
  } catch (err) {
    console.warn(`[search-index] skipped ${label}:`, (err as Error).message);
    return [];
  }
}

export async function buildSearchIndex(): Promise<SearchDoc[]> {
  const groups = await Promise.all([
    safely('providers', async () => {
      const providers = await fetchProviders();
      return providers.map((p: any) => {
        const services = [p.services?.medical, p.services?.support, p.services?.prevention]
          .flat()
          .filter(Boolean)
          .map((s: any) => s?.service ?? s)
          .join(' ');
        const counties = (p.location?.county ? [p.location.county] : []).join(' ');
        const languages = (p.languages ?? []).map((l: any) => l?.language ?? l).join(' ');

        return {
          id: `provider-${p.id}`,
          type: 'provider' as const,
          title: p.name,
          url: `/providers/${p.slug ?? p.id}`,
          excerpt: trim(p.description),
          keywords: trim(
            [services, counties, languages, p.location?.city, p.type].filter(Boolean).join(' '),
            300,
          ),
        };
      });
    }),

    safely('events', async () => {
      const events = await fetchEvents(true, true);
      return events.map((e) => ({
        id: `event-${e.id}`,
        type: 'event' as const,
        title: e.title,
        url: `/events/${e.slug}`,
        excerpt: trim(extractTextFromLexical(e.description)),
        keywords: trim(
          [e.category, e.location?.venueName, e.location?.city, e.location?.type]
            .filter(Boolean)
            .join(' '),
          200,
        ),
      }));
    }),

    safely('faqs', async () => {
      const faqs = await fetchFAQs('both');
      return faqs.map((f: any) => ({
        id: `faq-${f.id}`,
        type: 'faq' as const,
        title: f.question,
        url: `/faq#faq-${f.id}`,
        excerpt: trim(
          typeof f.answer === 'string' ? f.answer : extractTextFromLexical(f.answer),
        ),
        keywords: trim(f.category ?? '', 100),
      }));
    }),

    safely('resources', async () => {
      // First arg is linkType, second is language. Passing undefined keeps
      // both internal PDFs and external links in the index.
      const resources = await fetchResources(undefined, 'both');
      return resources.map((r: any) => ({
        id: `resource-${r.id}`,
        type: 'resource' as const,
        title: r.title,
        url: r.externalLink || r.pdfFile?.url || '/resources',
        excerpt: trim(
          typeof r.description === 'string'
            ? r.description
            : extractTextFromLexical(r.description),
        ),
        keywords: trim(r.category ?? '', 100),
      }));
    }),

    safely('pages', async () => {
      const pages = await fetchPages('both');
      return pages.map((p: any) => ({
        id: `page-${p.id}`,
        type: 'page' as const,
        title: p.title,
        url: `/${p.slug}`,
        excerpt: trim(extractTextFromLexical(p.content)),
        keywords: '',
      }));
    }),

    // Governing documents. These are what people actually hunt for, and they
    // were the subject of the April "service standards must be posted" thread.
    safely('documents', async () => {
      const [bylaws, standards] = await Promise.all([
        fetchRaw('bylaws'),
        fetchRaw('service-standards'),
      ]);
      const toDoc = (d: any, section: string): SearchDoc => ({
        id: `document-${section}-${d.id}`,
        type: 'document',
        title: d.title ?? d.name ?? 'Document',
        url: `/${section}`,
        excerpt: trim(
          typeof d.description === 'string'
            ? d.description
            : extractTextFromLexical(d.description),
        ),
        keywords: section === 'bylaws' ? 'bylaws governance' : 'service standards',
      });
      return [
        ...bylaws.map((d) => toDoc(d, 'bylaws')),
        ...standards.map((d) => toDoc(d, 'service-standards')),
      ];
    }),
  ]);

  return groups.flat().filter((d) => d.title);
}
