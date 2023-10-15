import type { CollectionEntry } from 'astro:content';
import slugify from 'slugify';

export default function getTags(posts: CollectionEntry<'blogs'>[]): string[] {
  const tags = new Set(posts.flatMap((post) => post.data.tags!));
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}
