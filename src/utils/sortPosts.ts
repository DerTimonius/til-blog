import type { CollectionEntry } from 'astro:content';
import dayjs from 'dayjs';

export default function sortPosts(posts: CollectionEntry<'blogs'>[]) {
  return posts.sort((a, b) =>
    dayjs(a.data.pubDate).isBefore(b.data.pubDate) ? 1 : -1,
  );
}
