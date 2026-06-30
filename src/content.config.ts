import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    role: z.string(),
    title: z.string(),
    bio: z.string(),
    longBio: z.string(),
    expertise: z.array(z.string()),
    avatar: z.string(),
    email: z.string().email().optional(),
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    joinedYear: z.number(),
  }),
});

const articleTypeEnum = z.enum(['pillar', 'review', 'comparison', 'alternatives', 'guide']);

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().max(165),
    type: articleTypeEnum,
    tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    category: z.enum(['camping-outdoor', 'home-essentials', 'travel-edc', 'fitness-outdoor']),
    tags: z.array(z.string()).default([]),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    authorSlug: z.string(),
    reviewerSlug: z.string().optional(),
    datePublished: z.coerce.date(),
    dateUpdated: z.coerce.date(),
    editorialStatus: z.enum(['draft', 'in_review', 'edited', 'published', 'updated']).default('published'),
    factChecked: z.boolean().default(true),
    readingTime: z.number().optional(),
    featured: z.boolean().default(false),
    pillarSlug: z.string().optional(),
    relatedSlugs: z.array(z.string()).default([]),
    affiliateProducts: z
      .array(
        z.object({
          name: z.string(),
          url: z.string().url(),
          retailer: z.string(),
          ctaLabel: z.string().default('Check price'),
        }),
      )
      .default([]),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .default([]),
  }),
});

export const collections = { authors, articles };
