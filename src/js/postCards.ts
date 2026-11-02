// Shared blog-post → card/link mapping for the /blog/ listing, the home Latest Posts grid, and the
// detail page's prev/next + related sections, so they can't drift. Pure data-shaping — the runtime
// module the Astro files import; its check lives beside it (postCards.test.ts).
//
// All imports below are type-only, so `pnpm test` (Node type-stripping) erases them and this file
// runs with no bundler / no astro: virtual-module resolution. Keep them type-only.
import type { ContentCardProps } from "@components/Cards/ContentCard.astro";
import type { BadgeVariant } from "@components/ui/badge";
import type { CollectionEntry } from "astro:content";

export interface CategoryMeta {
  /** bracketed retro label, e.g. "[Quest]" (the ui/badge pixel variant uppercases it). */
  label: string;
  variant: BadgeVariant;
  /** colour override for tones with no semantic token (Lore = fixed maroon). */
  class?: string;
}

/** category (lower-cased) → tone. LORE has no semantic token, so it takes a fixed maroon `class`. */
const CATEGORY_TONES: Record<string, Pick<CategoryMeta, "variant" | "class">> = {
  quest: { variant: "success" },
  tech: { variant: "primary" },
  guide: { variant: "warning" },
  lore: { variant: "secondary", class: "bg-secondary-600 text-secondary-100" },
  "dev log": { variant: "info" },
};

/**
 * A post's `category` → its retro badge: bracketed label + a ui/badge tone. The Figma "[QUEST]" /
 * "[LORE]" / "[TECH]" / "[GUIDE]" tags. Unknown categories fall back to blue.
 *
 * @param category the entry's `category` field (case-insensitive match)
 * @returns the badge label, tone variant, and optional colour override
 */
export function categoryMeta(category: string): CategoryMeta {
  const tone = CATEGORY_TONES[category.trim().toLowerCase()] ?? { variant: "primary" };
  return { label: `[${category}]`, ...tone };
}

export interface PostCategoryGroup {
  /** stable heading id, from the category name. */
  id: string;
  /** category as written on the newest post in the group. */
  label: string;
  items: ContentCardProps[];
}

/**
 * Group already date-sorted posts by `category`. A category appears the first time a post uses it,
 * so the section order follows the newest post in each group. Matching ignores case. There is no
 * fixed category list.
 *
 * @param posts newest-first (see blogData.getSortedPosts)
 */
export function groupPostsByCategory(
  posts: readonly CollectionEntry<"blog">[],
): PostCategoryGroup[] {
  const groups: PostCategoryGroup[] = [];
  const index = new Map<string, PostCategoryGroup>();
  for (const post of posts) {
    const label = post.data.category.trim() || "Sin categoría";
    const key = label.toLocaleLowerCase("es");
    let group = index.get(key);
    if (!group) {
      const slug =
        key
          .normalize("NFD")
          .replace(/\p{M}/gu, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "categoria";
      group = { id: slug, label, items: [] };
      index.set(key, group);
      groups.push(group);
    }
    group.items.push(toPostCard(post));
  }
  return groups;
}

/**
 * Map a `blog` entry to the shared ContentCard props used by every post grid.
 *
 * @param entry a `blog` collection entry
 * @returns props ready to spread into `<ContentCard />`
 * @example toPostCard(entry).href; // "/blog/history-of-the-floppy-disk/"
 */
export function toPostCard(entry: CollectionEntry<"blog">): ContentCardProps {
  const { data } = entry;
  const { label, variant, class: badgeClass } = categoryMeta(data.category);
  return {
    href: `/blog/${entry.id}/`,
    image: data.heroImage,
    imageAlt: data.heroImageAlt,
    badgeLabel: label,
    badgeVariant: variant,
    badgeClass,
    title: data.title,
    description: data.description,
    cta: "Leer",
    lang: data.lang ?? "es",
    tkey: data.translationKey ?? entry.id,
  };
}

/** Cards shown in the Todos section before the next page. */
export const ALL_PAGE_SIZE = 9;
/** Cards shown in one category section before the next page. */
export const CATEGORY_PAGE_SIZE = 9;

/**
 * Rank posts for the search box. An empty query keeps the current order. A query prefers a title
 * that matches more closely, then a tag that contains it.
 */
export function searchRank<T extends { title: string; tags?: readonly string[] }>(
  items: readonly T[],
  query: string,
): T[] {
  const q = query.trim().toLocaleLowerCase("es");
  if (!q) return [...items];
  return items
    .map((item, index) => ({ item, index, score: searchScore(item.title, item.tags ?? [], q) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((row) => row.item);
}

function searchScore(title: string, tags: readonly string[], query: string): number {
  const name = title.toLocaleLowerCase("es");
  let score = 0;
  if (name === query) score += 100;
  else if (name.startsWith(query)) score += 80;
  else if (name.includes(query)) score += 60 + Math.max(0, 20 - name.indexOf(query));
  else {
    let at = 0;
    let hits = 0;
    for (const char of query) {
      const next = name.indexOf(char, at);
      if (next === -1) break;
      at = next + 1;
      hits += 1;
    }
    if (hits >= Math.ceil(query.length * 0.6)) score += hits;
  }
  if (tags.some((tag) => tag.toLocaleLowerCase("es").includes(query))) score += 50;
  return score;
}

/**
 * One page of an already date-sorted list. Page numbers start at 1. Out-of-range pages clamp.
 */
export function pageWindow<T>(
  items: readonly T[],
  page: number,
  size: number,
): { page: number; pages: number; items: T[] } {
  const pages = Math.max(1, Math.ceil(items.length / size) || 1);
  const current = Number.isFinite(page) ? Math.min(Math.max(1, Math.floor(page)), pages) : 1;
  const start = (current - 1) * size;
  return { page: current, pages, items: items.slice(start, start + size) };
}

/**
 * Listing URL. Each view and page is its own path, so the client router fetches it instead of
 * reusing `/blog/`. Page 1 has no `pagina` segment.
 */
export function listingHref(view: string, page: number): string {
  if (view === "todos") return page > 1 ? `/blog/pagina/${page}/` : "/blog/";
  return page > 1 ? `/blog/categoria/${view}/pagina/${page}/` : `/blog/categoria/${view}/`;
}

export interface AdjacentLink {
  href: string;
  title: string;
}

/**
 * Prev (newer) / next (older) neighbours of a post in the date-sorted list — the Figma "◄PREV NEXT►"
 * footer nav. Undefined at the ends so the caller can omit the missing side.
 *
 * @param sorted posts newest-first (see blogData.getSortedPosts)
 * @param id the current entry id
 */
export function getAdjacentPosts(
  sorted: readonly CollectionEntry<"blog">[],
  id: string,
): { prev?: AdjacentLink; next?: AdjacentLink } {
  const i = sorted.findIndex((e) => e.id === id);
  if (i === -1) return {};
  const link = (e?: CollectionEntry<"blog">): AdjacentLink | undefined =>
    e ? { href: `/blog/${e.id}/`, title: e.data.title } : undefined;
  return { prev: link(sorted[i - 1]), next: link(sorted[i + 1]) };
}

/**
 * Up to `limit` "More Quests" related posts — same category first, then most-recent, excluding the
 * current post. Keeps the section fully dynamic (every link resolves), rather than transcribing the
 * mock's two fixed placeholder titles.
 *
 * @param sorted posts newest-first
 * @param id the current entry id
 * @param limit max related posts (default 2, the mock count)
 */
export function getRelatedPosts(
  sorted: readonly CollectionEntry<"blog">[],
  id: string,
  limit = 2,
): CollectionEntry<"blog">[] {
  const others = sorted.filter((e) => e.id !== id);
  const current = sorted.find((e) => e.id === id);
  if (!current) return others.slice(0, limit);
  const key = current.data.category.toLowerCase();
  const sameCat = others.filter((e) => e.data.category.toLowerCase() === key);
  const rest = others.filter((e) => e.data.category.toLowerCase() !== key);
  return [...sameCat, ...rest].slice(0, limit);
}
