import { type CollectionEntry, getCollection } from 'astro:content';
import dayjs from 'dayjs';
import { checkReleaseDate } from './formatDate';

export function sortPosts(posts: CollectionEntry<'blogs'>[]) {
	return posts.sort((a, b) =>
		dayjs(a.data.pubDate).isBefore(b.data.pubDate) ? 1 : -1,
	);
}

export async function getSortedPosts(): Promise<CollectionEntry<'blogs'>[]> {
	const posts = await getCollection(
		'blogs',
		({ data }) => !data.isDraft && checkReleaseDate(data.pubDate),
	);
	return sortPosts(posts);
}

export async function getLatestPosts(
	num = 3,
): Promise<CollectionEntry<'blogs'>[]> {
	const posts = await getSortedPosts();
	return posts.slice(0, num);
}

export async function getRelatedPosts(
	slugs: string[],
): Promise<CollectionEntry<'blogs'>[]> {
	const posts = await getCollection(
		'blogs',
		(post) => slugs.includes(post.id) && checkReleaseDate(post.data.pubDate),
	);
	return sortPosts(posts);
}

export async function getPostsByTag(tag: string) {
	const posts = await getCollection(
		'blogs',
		({ data }) =>
			data.tags.includes(tag) &&
			!data.isDraft &&
			checkReleaseDate(data.pubDate),
	);
	return sortPosts(posts);
}
