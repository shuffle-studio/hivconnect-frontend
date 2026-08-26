import type { APIRoute } from 'astro';
import { buildSearchIndex } from '../lib/searchIndex';

/**
 * Emits /search-index.json as a static file at build time.
 *
 * Astro static endpoints prerender, so this costs nothing at runtime: it is a
 * plain file on the CDN, cached like any other asset.
 */
export const GET: APIRoute = async () => {
  const docs = await buildSearchIndex();

  return new Response(JSON.stringify({ built: new Date().toISOString(), docs }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
