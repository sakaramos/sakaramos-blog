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
| `category` | yes | Colored badge on the card, and a link on the `/blog/` bar. A new value adds its own link. Examples: Tech, Guide, Dev Log |
| `tags` | no | Topic list. Use `[]` when there are none |
| `updatedDate` | no | Update date |
| `draft` | no | `true` hides the post from the listing |
| `lang` | no | `es` or `en`. The language this file is written in. Omit it and the post counts as the default text |
| `translationKey` | no | Same value on the Spanish file and the English file of one article |

`/blog/` lists posts newest first (`pubDate`), 9 per page. The bar has Todo, Categoría (`/blog/categoria/`), and Buscar (`/blog/buscar/`). A category page is `/blog/categoria/<category>/`. Later pages are `/blog/pagina/2/` and `/blog/categoria/<category>/pagina/2/`. Search filters by title or tag in the browser, also 9 per page.

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

The pages are not copied per language. The header **ES / EN** switch only swaps the interface text. A post stays one file, written in whatever language you used, until you add a second file for the other language.

One post, no `lang` and no `translationKey`: it is shown in both ES and EN, exactly as written.

The same article in both languages is two files. Give them the same `translationKey`. Set `lang` on each one. The switch then shows the file that matches the active language.

```mdx
---
title: "Mi nota"
lang: "es"
translationKey: "mi-nota"
---
```

```mdx
---
title: "My note"
lang: "en"
translationKey: "mi-nota"
---
```

If the active language has no file for that `translationKey`, the other file is shown as written. You do not need both languages for every post.
