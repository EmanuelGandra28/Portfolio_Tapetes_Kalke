import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import config from './site.config.json' with { type: 'json' };

export default defineConfig({
  site: config.urlSite,
  base: config.base,
  integrations: [react(), sitemap()],
});
