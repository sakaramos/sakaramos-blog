import { listingHref } from "@js/postCards";
import { defineMiddleware } from "astro:middleware";

// `trailingSlash: "always"` makes `/about` a different URL from `/about/`. In dev, Astro answers the
// slashless form with its own 404 screen. Send it to the slashed URL instead: a real page loads, and
// a missing one falls through to src/pages/404.astro.
export const onRequest = defineMiddleware((context, next) => {
  const { pathname, search } = context.url;
  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  if (pathname !== "/" && !pathname.endsWith("/") && !lastSegment.includes(".")) {
    return context.redirect(`${pathname}/${search}`);
  }
  if (pathname === "/blog/" && (context.url.searchParams.has("page") || context.url.searchParams.has("ver"))) {
    const view = context.url.searchParams.get("ver") ?? "todos";
    const page = Number(context.url.searchParams.get("page") ?? "1");
    return context.redirect(listingHref(view, Number.isFinite(page) ? page : 1));
  }
  return next();
});
