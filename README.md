# Agentic Coding

A minimal, statically generated site for short technical articles. Articles are
plain Markdown files in this repository — there is no CMS, database, or backend,
and the repository is the source of truth.

Built with [Astro](https://astro.build/) and its content collections. `npm run build`
produces a fully static site in `dist/`.

## Requirements

- **Node.js 22.12 or newer** (Astro 7 requires it). There is an `.nvmrc`, so
  `nvm use` picks the right version.

## Install and run

```bash
nvm use          # optional, selects Node 22
npm install
npm run dev      # local dev server on http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the built dist/ locally
```

| Script            | What it does                                             |
| ----------------- | -------------------------------------------------------- |
| `npm run dev`     | Dev server with hot reload. **Drafts are visible here.** |
| `npm run build`   | Static build into `dist/`. Drafts are excluded.          |
| `npm run preview` | Serves the built `dist/` for a final check.              |
| `npm run check`   | Type-checks `.astro` and `.ts` files.                    |
| `npm run format`  | Formats everything with Prettier.                        |

## Where articles live

```
src/content/articles/
├── context-is-everything-1-what-is-context.md
├── context-is-everything-2-context-rot.md
├── context-is-everything-3-context-hygiene.md
└── images/
    └── working-set.png
```

**The filename becomes the URL.** `context-is-everything-2-context-rot.md` is
published at `/articles/context-is-everything-2-context-rot/`. Renaming a file
changes its URL, so treat filenames as permanent once an article is published.

## Creating a new article

Add a `.md` file to `src/content/articles/` with frontmatter:

```md
---
title: 'Context is everything #4 — Something new'
description: 'One or two sentences, shown in the article list.'
publishDate: 2026-09-16
tags:
  - coding-agents
  - context
series: 'Context is everything'
seriesOrder: 4
draft: false
---

Article body starts here.
```

That is all — the home page, the tag pages, and the article page pick it up on
the next dev reload or build.

### Frontmatter fields

| Field         | Type                | Required             | Notes                                                |
| ------------- | ------------------- | -------------------- | ---------------------------------------------------- |
| `title`       | string              | yes                  | Page heading and list entry.                         |
| `description` | string              | yes                  | Shown in the list and used as the meta description.  |
| `publishDate` | date (`YYYY-MM-DD`) | yes                  | Sorting is newest first.                             |
| `tags`        | string list         | no (default `[]`)    | Lowercase-kebab by convention. Each tag gets a page. |
| `series`      | string              | no                   | Shown above the article title.                       |
| `seriesOrder` | positive integer    | no                   | Shown as "part N" next to the series name.           |
| `draft`       | boolean             | no (default `false`) | `true` keeps it out of the production build.         |

The schema is defined and validated in `src/content.config.ts`. A typo in a field
name or a bad date fails the build with a clear message rather than silently
producing a broken page.

### Drafts

Set `draft: true`. The article stays visible in `npm run dev` (marked with a
Draft badge) and is never written to `dist/` by `npm run build`.

## Images

Two options, both fine:

1. **Alongside the article** — put the file in `src/content/articles/images/` and
   reference it relatively:

   ```md
   ![Alt text describing the image](./images/working-set.png)
   ```

   Astro optimizes these (resizing, WebP conversion, width/height attributes,
   lazy loading) and hashes the filename. This is the preferred option.

2. **Unprocessed** — put the file in `public/` and reference it by absolute path.
   Astro copies it verbatim. Use this only when you need the exact original file;
   note that these paths do **not** get the base-path prefix automatically.

## Markdown support

Headings, lists, links, images, blockquotes, tables, inline code, and fenced code
blocks with syntax highlighting (Shiki, `github-light` theme — configured in
`astro.config.mjs`).

Link between articles with a **relative** path so links keep working if the site
is served from a sub-path:

```md
See [context rot](../context-is-everything-2-context-rot/).
```

## Project structure

```
├── astro.config.mjs          # Astro config: static output, base path, Shiki theme
├── src/
│   ├── content.config.ts     # Article collection + frontmatter schema
│   ├── content/articles/     # The articles themselves (+ their images)
│   ├── lib/
│   │   ├── articles.ts       # getArticles() / getTags() — sorting and draft filtering
│   │   ├── site.ts           # Site title and description
│   │   └── url.ts            # Base-path-aware internal links
│   ├── layouts/BaseLayout.astro
│   ├── components/           # ArticleList, TagList, FormattedDate
│   ├── pages/
│   │   ├── index.astro       # Home: chronological article list
│   │   ├── articles/[...id].astro
│   │   └── tags/             # Tag index and per-tag pages
│   └── styles/global.css     # All styling, ~1 file, design tokens at the top
└── public/                   # Copied verbatim into dist/
```

## Hosting under a sub-path

The site defaults to being served from `/`, but nothing assumes it. All internal
links go through `url()` in `src/lib/url.ts`, which applies Astro's `base`.

To build for a sub-path (e.g. GitLab Pages project pages):

```bash
BASE_PATH=/your-project-name npm run build
```

`dist/` is then ready to be served at `https://<host>/your-project-name/`.

Deployment, CI, analytics, and comments are intentionally not configured here.

## Changing the site title or description

Edit `src/lib/site.ts`.
