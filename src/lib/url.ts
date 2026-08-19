/**
 * Build an internal link that respects Astro's `base` option, so the site keeps
 * working when it is served from a sub-path instead of `/`.
 *
 * Never hard-code internal hrefs — always go through this.
 */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

/** URL-safe form of a tag, used in `/tags/<tag>/` paths. */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
