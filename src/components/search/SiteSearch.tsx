import { useEffect, useMemo, useRef, useState } from 'react';
import { TYPE_LABELS, scoreDoc, type SearchDoc, type SearchType } from '../../lib/searchScore';

/**
 * Site-wide search over the prebuilt /search-index.json.
 *
 * No search library. The corpus is small enough that a hand-written scorer is
 * both faster than loading a dependency and easier to tune for this content:
 * a provider name should beat a passing mention inside an FAQ answer, and the
 * default weighting of a generic fuzzy library does not know that.
 */

const TYPE_STYLES: Record<SearchType, string> = {
  provider: 'bg-primary-100 text-primary-800',
  event: 'bg-emerald-100 text-emerald-800',
  faq: 'bg-indigo-100 text-indigo-800',
  resource: 'bg-amber-100 text-amber-900',
  page: 'bg-gray-100 text-gray-700',
  document: 'bg-violet-100 text-violet-800',
};

interface Scored {
  doc: SearchDoc;
  score: number;
}

export default function SiteSearch({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [activeType, setActiveType] = useState<SearchType | 'all'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Load the index once, on mount. It is a static file on the CDN, so this is
  // a cache hit for most visitors.
  useEffect(() => {
    let cancelled = false;
    fetch('/search-index.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { docs: SearchDoc[] }) => {
        if (!cancelled) setDocs(data.docs ?? []);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Honour ?q= so results are linkable and survive a refresh. Read on mount
  // rather than during render: this component is prerendered by Astro, where
  // window does not exist.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q && !initialQuery) setQuery(q);
    inputRef.current?.focus();
  }, [initialQuery]);

  // Keep the URL shareable without a re-render loop.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    window.history.replaceState({}, '', url);
  }, [query]);

  const results = useMemo(() => {
    if (!docs) return [];
    const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
    if (!terms.length) return [];

    return docs
      .map((doc): Scored => ({ doc, score: scoreDoc(doc, terms) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 60);
  }, [docs, query]);

  const counts = useMemo(() => {
    const c: Partial<Record<SearchType, number>> = {};
    for (const r of results) c[r.doc.type] = (c[r.doc.type] ?? 0) + 1;
    return c;
  }, [results]);

  const shown = activeType === 'all' ? results : results.filter((r) => r.doc.type === activeType);
  const searching = query.trim().length > 1;

  return (
    <div>
      <label htmlFor="site-search" className="sr-only">
        Search the site
      </label>
      <div className="relative">
        <input
          id="site-search"
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveType('all');
          }}
          placeholder="Search providers, events, resources, FAQs…"
          autoComplete="off"
          className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 text-lg focus:border-primary-500 focus:ring-primary-500"
        />
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
      </div>

      {failed && (
        <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
          Search is temporarily unavailable. You can still browse{' '}
          <a href="/find-services" className="underline">
            providers
          </a>{' '}
          and{' '}
          <a href="/resources" className="underline">
            resources
          </a>
          .
        </p>
      )}

      {searching && docs && (
        <>
          <p className="mt-4 text-sm text-gray-600" aria-live="polite">
            {results.length === 0
              ? `No results for “${query}”.`
              : `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${query}”.`}
          </p>

          {results.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveType('all')}
                aria-pressed={activeType === 'all'}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  activeType === 'all'
                    ? 'border-primary-200 bg-primary-100 text-primary-800'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                All {results.length}
              </button>
              {(Object.keys(counts) as SearchType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveType(t)}
                  aria-pressed={activeType === t}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    activeType === t
                      ? `border-transparent ${TYPE_STYLES[t]}`
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {TYPE_LABELS[t]} {counts[t]}
                </button>
              ))}
            </div>
          )}

          <ul className="mt-5 space-y-3">
            {shown.map(({ doc }) => (
              <li key={doc.id}>
                <a
                  href={doc.url}
                  className="block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_STYLES[doc.type]}`}
                  >
                    {TYPE_LABELS[doc.type]}
                  </span>
                  <h2 className="mt-2 text-lg font-semibold text-gray-900">{doc.title}</h2>
                  {doc.excerpt && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{doc.excerpt}</p>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {!searching && !failed && (
        <p className="mt-4 text-sm text-gray-500">
          Start typing to search providers, events, resources, FAQs, and posted documents.
        </p>
      )}
    </div>
  );
}
