/**
 * Search types and ranking. Deliberately free of imports.
 *
 * Split out of searchIndex.ts because that module pulls in api.ts, which reads
 * `import.meta.env` at module scope. That is fine inside Vite and Astro, but it
 * means anything importing it cannot run under plain node, so the ranking logic
 * could not be unit tested. Pure scoring belongs on its own anyway: the build
 * time index builder and the browser both need it, and neither needs the other.
 */

export type SearchType =
  | 'provider'
  | 'event'
  | 'faq'
  | 'resource'
  | 'page'
  | 'document';

export interface SearchDoc {
  id: string;
  type: SearchType;
  title: string;
  url: string;
  /** Shown under the title in results. */
  excerpt: string;
  /** Extra matchable text: categories, counties, services, languages. */
  keywords: string;
}

export const TYPE_LABELS: Record<SearchType, string> = {
  provider: 'Provider',
  event: 'Event',
  faq: 'FAQ',
  resource: 'Resource',
  page: 'Page',
  document: 'Document',
};

/**
 * Every query term must appear somewhere in the document, so "medicare newark"
 * does not return everything mentioning Medicare. Within that, matches in the
 * title count for far more than matches in body text.
 */
export function scoreDoc(doc: SearchDoc, terms: string[]): number {
  // No terms means no query. Without this the short-title bonus below returns
  // a positive score for every document, so an empty search matches the whole
  // site. Callers happen to guard for this today; the function should not rely
  // on that.
  if (!terms.length) return 0;

  const title = doc.title.toLowerCase();
  const keywords = doc.keywords.toLowerCase();
  const excerpt = doc.excerpt.toLowerCase();

  let total = 0;

  for (const term of terms) {
    let best = 0;
    if (title === term) best = 100;
    else if (title.startsWith(term)) best = 40;
    else if (new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(title)) best = 25;
    else if (title.includes(term)) best = 15;
    else if (keywords.includes(term)) best = 8;
    else if (excerpt.includes(term)) best = 3;

    // A term nothing matched means this is not a result, however well the
    // other terms scored.
    if (best === 0) return 0;
    total += best;
  }

  // Nudge shorter titles up: an exact provider beats a long page that happens
  // to contain the same words.
  return total + Math.max(0, 20 - doc.title.length / 4);
}
