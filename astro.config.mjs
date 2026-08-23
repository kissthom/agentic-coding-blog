// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Fully static output. `npm run build` writes to `dist/`.
  output: 'static',

  // Defaults to `/`. If the site is served from a sub-path (e.g. GitHub Pages
  // project pages at https://<user>.github.io/<repo>/), build with
  // `BASE_PATH=/<repo> npm run build` — no code changes needed, because all
  // internal links go through `url()` in `src/lib/url.ts`. The Pages workflow
  // fills this in from `actions/configure-pages`, so the repo name is not
  // hard-coded anywhere. `||`, not `??`: an empty string must fall back too.
  base: process.env.BASE_PATH || '/',

  // Deployed origin, used for absolute URLs. Also supplied by the workflow.
  site: process.env.SITE_URL || undefined,

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
