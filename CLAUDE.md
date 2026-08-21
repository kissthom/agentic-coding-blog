# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A statically generated Astro 7 site for short technical articles. Articles are Markdown
files in `src/content/articles/` — no CMS, database, or backend. Deployment, CI, analytics,
and comments are intentionally not configured.

Requires **Node.js >= 22.12** (see `.nvmrc`; `nvm use` picks it). Switch Node
before `npm install`: on an older Node, npm silently skips the platform-native
`@rolldown/binding-*` optional dependency and every `astro` command then dies with
`Cannot find module './rolldown-binding.wasi.cjs'`. The fix is
`rm -rf node_modules && npm install` on Node 22.

## Commands

```bash
npm run dev      # dev server on :4321 — drafts ARE visible here
npm run build    # static build into dist/ — drafts are excluded
npm run preview  # serve the built dist/
npm run check    # astro check — type-checks .astro and .ts
npm run format   # prettier --write .
```

There is no test suite. `npm run check` plus a successful `npm run build` is the full
verification loop; the content schema turns frontmatter mistakes into build failures.

`.astro/` holds generated types (`astro:content` among them) and is gitignored, but
`tsconfig.json` includes it. After a fresh clone, editor/TS errors about `astro:content`
just mean nothing has generated it yet — run `npm run check`, `dev`, or `build` once.

To build for a sub-path (e.g. GitLab Pages project pages):
`BASE_PATH=/your-project-name npm run build`.

## Architecture

**Content pipeline.** `src/content.config.ts` defines the single `articles` collection via
Astro's `glob` loader over `src/content/articles/**/*.md`, with a Zod frontmatter schema
(`title`, `description`, `publishDate` required; `tags`, `series`, `seriesOrder`, `draft`
optional). The loader's entry `id` is the filename without extension, and every route
derives its URL from that id — **renaming a published article file changes its URL**.

**`src/lib/articles.ts` is the only content entry point.** `getArticles()` sorts newest
first and filters drafts with `import.meta.env.DEV || !data.draft`, which is what makes
drafts dev-only. Never call `getCollection('articles')` directly from a page or component —
doing so leaks drafts into production and loses the sort order. `getTags()` builds the
alphabetical tag list with counts from the same source.

**Base-path safety.** `astro.config.mjs` sets `base` from `BASE_PATH`, so no internal href
may be hard-coded. Every link goes through `url()` in `src/lib/url.ts`, including asset
paths like the favicon. `trailingSlash: 'always'`, so internal paths must end with `/`.
Files served from `public/` do _not_ get the base prefix — prefer relative image imports
from `src/content/articles/images/` so Astro processes and hashes them.

**Tag routing.** `tagSlug()` (also in `src/lib/url.ts`) produces the URL form; the original
tag string stays the display value and the filter key. `src/pages/tags/[tag].astro` maps
slug → params but filters articles by the raw tag, so the two must stay paired.

**Pages** are all statically prerendered through `getStaticPaths`: `index.astro` (all
articles), `articles/[...id].astro` (rest param, matches the loader id), `tags/index.astro`
and `tags/[tag].astro`.

**Styling** lives entirely in `src/styles/global.css` — one file, design tokens at the top.
There are no `<style>` blocks in any component; add class names there and rules to
`global.css` rather than introducing scoped styles. `BaseLayout.astro` imports the
stylesheet and owns `<head>`, header, and footer; site title/description come from
`src/lib/site.ts`.

**Theming.** Both themes come from one token list: every colour token is
`light-dark(<light>, <dark>)`, resolved against the `color-scheme` on `:root`. So a new
colour needs one declaration, not a second dark block — but it must be a _colour_,
since `light-dark()` accepts nothing else. `color-scheme: light dark` follows the OS;
`ThemeToggle.astro` narrows it by setting `<html data-theme="light|dark">` and storing
the choice in `localStorage.theme`. An `is:inline` script in `BaseLayout`'s `<head>`
re-applies that before first paint — keep it inline and in `<head>`, or the wrong theme
flashes. Code blocks follow the same switch: `shikiConfig` emits `github-light` and
`github-dark` as `--shiki-light*`/`--shiki-dark*` variables with `defaultColor: false`,
and `.astro-code` rules pick one.

## Conventions

- Prettier: 100 cols, single quotes, semicolons, `prettier-plugin-astro`. Run `npm run format`.
- Tags are lowercase-kebab.
- Cross-article links use relative paths (`../other-article/`) so they survive a base path.
- Astro's TS config is `strict`; pages type `getStaticPaths` with `satisfies GetStaticPaths`.
- Commit straight to `master` — this is a single-author site, so do not branch or open MRs.
