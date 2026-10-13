// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Two deployment scenarios, both driven by environment variables so no code
 * change is needed to switch between them:
 *
 * 1. Custom domain (e.g. https://grintbyte.com):
 *      SITE_URL=https://grintbyte.com   BASE_PATH=/
 * 2. GitHub project page (e.g. https://<user>.github.io/<repo>):
 *      SITE_URL=https://<user>.github.io   BASE_PATH=/<repo>
 *
 * Set these in .github/workflows/deploy.yml (or repo variables).
 * Every internal link and image path in the code goes through
 * `withBase()` (src/lib/paths.ts), which reads import.meta.env.BASE_URL,
 * so links keep working when BASE_PATH changes.
 */
const SITE_URL = process.env.SITE_URL ?? 'https://grintbyte.com';
const BASE_PATH = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
