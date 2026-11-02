import { getSortedPosts } from "@js/blogData";
import type { APIRoute } from "astro";

// Dev-only freshness check for the open Todo / Categoría / Buscar page. Each request reads the
// collection again, so a saved post changes this body without a manual browser reload.
export const GET: APIRoute = async () => {
  const posts = await getSortedPosts();
  const body = posts.map((post) => ({
    id: post.id,
    title: post.data.title,
    category: post.data.category,
    lang: post.data.lang ?? "es",
    tkey: post.data.translationKey ?? post.id,
  }));
  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
};
