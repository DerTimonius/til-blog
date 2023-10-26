import { type CollectionEntry, getCollection } from 'astro:content';
import dayjs from 'dayjs';

export function sortPosts(posts: CollectionEntry<'blogs'>[]) {
  return posts.sort((a, b) =>
    dayjs(a.data.pubDate).isBefore(b.data.pubDate) ? 1 : -1,
  );
}

export async function getSortedPosts(): Promise<CollectionEntry<'blogs'>[]> {
  const posts = await getCollection('blogs', ({ data }) => !data.isDraft);
  return sortPosts(posts);
}

export async function getLatestPosts(
  num = 3,
): Promise<CollectionEntry<'blogs'>[]> {
  const posts = await getSortedPosts();
  return posts.slice(0, num);
}

export async function getFeaturedPosts(): Promise<CollectionEntry<'blogs'>[]> {
  return await getCollection(
    'blogs',
    ({ data }) => data.isFeatured && !data.isDraft,
  );
}
