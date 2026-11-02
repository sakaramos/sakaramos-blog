import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";

/**
 * Blog — the "Latest Posts" listing (Figma node 76:4) + per-post article pages (node 5:128).
 * Entries live at src/data/blog/<slug>/index.mdx (entry id => "<slug>").
 *
 * The blog article body is genuine free-form prose
 * — headings, lists, blockquotes, code — so it IS the MDX body (rendered via `render()` → `<Content />`,
 * styled by the `.blog-prose` class). Frontmatter carries only what the layout lays out in slots:
 * the byline (`authors`), the retro `category` tag (drives the card + article badge tone via
 * postCards.categoryMeta), the footer `tags`, and the hero image. `pubDate` sorts the listing.
 */
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(), // card title + article H1 + SEO title
      description: z.string(), // card excerpt + SEO meta description
      // byline (avatar + name); referenced ids must exist, and every post needs at least one
      authors: z.array(reference("authors")).min(1, "a post needs at least one author reference"),
      // coerce.date validates: it runs `new Date(value)` then rejects an Invalid Date at build time
      pubDate: z.coerce.date(), // sorts the listing + article:published_time
      updatedDate: z.coerce.date().optional(), // drives article:modified_time only when present
      // required, not optional: it is both the card thumbnail AND the article hero banner, and a
      // post without one degrades the listing and the OG image at once
      heroImage: image(),
      heroImageAlt: z.string(),
      // the retro category tag ("Quest" / "Lore" / "Tech" / "Guide" / "Dev Log") — see categoryMeta
      category: z.string(),
      tags: z.array(z.string()).default([]), // footer hashtags (#pixel, #gamedev)
      draft: z.boolean().optional(),
    }),
});

const authorsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/authors" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      avatar: image().optional(),
      authorLink: z.string(), // author's public URL — becomes the JSON-LD Article author.url
    }),
});

export const collections = {
  blog: blogCollection,
  authors: authorsCollection,
};
