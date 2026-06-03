import { defineCollection, z } from "astro:content";

const insights = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.string(),
    readTime: z.string(),
    publishedAt: z.string(),
    image: z.string().optional(),
  }),
});

const cases = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    category: z.string(),
    context: z.string(),
    role: z.string(),
    approach: z.string(),
    result: z.string(),
    stack: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

export const collections = { insights, cases };
