import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  // Keep the raw file name as the id: old Hexo URLs are /YYYY/MM/DD/<file name>/
  loader: glob({
    pattern: '*.{md,mdx}',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
  }),
  schema: z.object({
    title: z.coerce.string(),
    // YAML parses "2022-01-11 10:00:00" to a Date; non-padded dates stay strings
    date: z.union([z.date(), z.string()]),
    tags: z.any().optional(),
    categories: z.any().optional(),
    permalink: z.string().optional(),
    mathjax: z.boolean().optional(),
  }),
});

export const collections = { posts };
