import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'zod';

const blogCollection = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blogs/' }),
	schema: z.object({
		title: z.string(),
		pubDate: z.date(),
		tags: z.array(z.string()),
		isDraft: z.boolean().optional(),
		description: z.string(),
		updatedAt: z.date().optional(),
		relatedPosts: z.array(z.string()).optional(),
		isFeatured: z.boolean().optional(),
		bskyPostId: z.string().optional(),
	}),
});

export const collections = {
	blogs: blogCollection,
};
