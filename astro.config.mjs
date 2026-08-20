// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Fully static output. `npm run build` writes to `dist/`.
  output: 'static',

  // Defaults to `/`. If the site is ever served from a sub-path (e.g. GitLab
  // Pages project pages at https://<group>.gitlab.io/<project>/), build with
  // `BASE_PATH=/<project> npm run build` — no code changes needed, because all
  // internal links go through `url()` in `src/lib/url.ts`.
  base: process.env.BASE_PATH ?? '/',

  // Optional. Set to the deployed origin when absolute URLs are needed.
  // site: 'https://example.gitlab.io',

  trailingSlash: 'always',

  markdown: {
    shikiConfig: {
      // Both themes are emitted as CSS variables (`--shiki-light*`/`--shiki-dark*`)
      // and picked in `global.css`; `defaultColor: false` stops Shiki from also
      // inlining one of them as a plain colour, which would win over the toggle.
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      wrap: false,
    },
  },
});
