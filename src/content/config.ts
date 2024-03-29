import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
    isDraft: z.boolean().optional(),
    description: z.string(),
    updatedAt: z.date().optional(),
    relatedPosts: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
  }),
});

export const collections = {
  blogs: blogCollection,
};
