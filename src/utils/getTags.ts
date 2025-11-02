import type { CollectionEntry } from 'astro:content';

import { getPostsByTag } from './sortPosts';

export interface Tag {
	name: string;
	postsCount: number;
}

export default async function getTags(
	posts: CollectionEntry<'blogs'>[],
): Promise<Tag[]> {
	const tags = new Set(posts.flatMap((post) => post.data.tags!));
	const tagObjects = await Promise.all(
		Array.from(tags).map(async (name) => {
			const postsCount = (await getPostsByTag(name)).length;

			return { name, postsCount };
		}),
	);

	return tagObjects.sort((a, b) => a.name.localeCompare(b.name));
}
