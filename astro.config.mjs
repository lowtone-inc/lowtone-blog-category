// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Actions(configure-pages)가 주입하는 값 우선, 로컬은 기본값 사용
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
