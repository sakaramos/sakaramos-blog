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
  return next();
});
