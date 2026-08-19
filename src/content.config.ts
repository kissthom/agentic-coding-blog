import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
  schema: z.object({
    /** Shown as the page heading and in the article list. */
    title: z.string().min(1),
    /** One or two sentences. Shown in the article list and as the meta description. */
    description: z.string().min(1),
    /** `YYYY-MM-DD` in frontmatter. Sorting is newest first. */
    publishDate: z.coerce.date(),
    /** Optional, lowercase-kebab by convention. Each tag gets its own page. */
    tags: z.array(z.string().min(1)).default([]),
    /** Optional series this article belongs to. */
    series: z.string().min(1).optional(),
    /** Position within the series, starting at 1. */
    seriesOrder: z.number().int().positive().optional(),
    /** Drafts are visible in `npm run dev` but excluded from the build. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
