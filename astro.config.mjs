// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind(),
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/500') &&
        !page.includes('/success'),
    }),
  ],
  site: 'https://hivconnectcentralnj.com',
  output: 'static',
  build: {
    inlineStylesheets: 'auto'
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    define: {
      'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY || 'demo-key')
    }
  }
});
