# Content collections

Schemas live in `src/content.config.ts`. Posts live one folder deep so an entry can keep its
images beside it. Authors are flat:

```
src/data/
├── blog/<slug>/index.mdx       # entry id => "<slug>", published at /blog/<slug>/
└── authors/<name>.md           # entry id => "<name>", e.g. authors/admin.md
```

Format post dates with `formatDate(date)` from `@js/textUtils`.

## Creating a post

1. Create `src/data/blog/<slug>/`.
2. Add `index.mdx` in that folder. Frontmatter, then the body:

```mdx
---
title: "Title"
description: "Short summary. Used on the card and as the page description."
authors: ["admin"]
pubDate: "2026-11-01"
heroImage: "./cover.png"
heroImageAlt: "What the image shows"
category: "Tech"
tags: ["topic"]
draft: true
---

The article body goes here, in Markdown.
```

3. Put the cover image in the same folder (for example `cover.png`) and point `heroImage` at it.
4. Remove `draft: true` when the post should appear in the listing.
5. A production deploy needs a rebuild. The dev server picks the file up on save.

## Fields

| Field | Required | Used for |
| :-- | :-- | :-- |
| `title` | yes | Card title and article heading |
| `description` | yes | Card excerpt |
| `authors` | yes | Byline. Each id must exist under `src/data/authors/`. `admin` is the current one |
| `pubDate` | yes | Date. Sorts the listing, newest first. Format `YYYY-MM-DD` |
| `heroImage` | yes | Cover. Path to a file next to the post |
| `heroImageAlt` | yes | Image alt text |
| `category` | yes | Colored badge on the card. Examples: Tech, Guide, Dev Log |
| `tags` | no | Topic list. Use `[]` when there are none |
| `updatedDate` | no | Update date |
| `draft` | no | `true` hides the post from the listing |

The `admin` author is `src/data/authors/admin.md` (`name`, `authorLink`, optional `avatar`).

## Deleting entries

**Clear the content-layer cache after deleting entries.** Astro's content layer keeps a persistent
store at `node_modules/.astro/data-store.json`, and it survives `rm -rf .astro`. If you delete an
entry without clearing it, the next build still tries to render the deleted route and fails with
`UnknownContentCollectionError: Unexpected error while rendering → <slug>` — naming a file you
already removed. Fix:

```sh
rm -rf node_modules/.astro .astro dist && pnpm build
```

**Order doesn't matter, and deleting the author is safe.** A post's byline resolves with a fallback
(`src/pages/blog/[slug].astro`) — delete `authors/admin.md` and posts still build, showing
`siteData.author.name` with no avatar instead. So you can empty the collections in any order. With
both emptied, the build succeeds and `/blog/` renders `CardGrid`'s empty state; you will see a
`The collection "blog" does not exist or is empty` warning, which is expected until you add an entry.

## Spanish and English

The site is one language today. `siteLang` and `siteLocale` in `src/config/siteSettings.json.ts` are `en` and `en-US`. There is no language switch and no per-locale route. A post at `src/data/blog/<slug>/index.mdx` is published at `/blog/<slug>/` no matter which language the body is written in.

To keep a Spanish version and an English version of the same post, nest one folder per language. The folder name becomes part of the entry id:

```
src/data/blog/
├── es/mi-nota/index.mdx        # id "es/mi-nota"  → /blog/es/mi-nota/
└── en/my-note/index.mdx        # id "en/my-note"  → /blog/en/my-note/
```

Use `es` and `en`. Each file still has its own frontmatter (`title`, `description`, `pubDate`, `heroImage`, and the rest). Write the Spanish body in the `es` file and the English body in the `en` file. They are two entries, not one entry with two bodies.

That folder layout does not filter the listing by itself. `/blog/` would show both languages together until a language filter is added back. The old i18n helpers (a locales list, per-locale data, and the `i18n` block in `astro.config.mjs`) were removed. Their shape is in git history. Restoring them is what makes the site serve `/es/...` and `/en/...` and show only the posts for the active language.
