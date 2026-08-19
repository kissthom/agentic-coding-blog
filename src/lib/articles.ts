import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

/**
 * All articles, newest first.
 *
 * Drafts are kept in `astro dev` so they can be previewed, and dropped from the
 * production build so they never reach `dist/`.
 */
export async function getArticles(): Promise<Article[]> {
  const articles = await getCollection(
    'articles',
    ({ data }) => import.meta.env.DEV || !data.draft,
  );

  return articles.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

/** Every tag in use, alphabetical, with how many articles carry it. */
export async function getTags(): Promise<{ tag: string; count: number }[]> {
  const articles = await getArticles();
  const counts = new Map<string, number>();

  for (const article of articles) {
    for (const tag of article.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}
