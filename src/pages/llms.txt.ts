import siteData from "@config/siteData.json";
import type { APIRoute } from "astro";

/**
 * /llms.txt — a machine-readable content map for AI retrieval systems (llmstxt.org).
 * Not a ranking factor; a curated index of what's worth reading. Dynamic so links stay
 * absolute and in sync with `site` + siteData. Prerenders to a static file at build.
 *
 * ponytail: hand-curated, not an auto-generated sitemap — add new top-level entry points here as
 * the site grows, or this drifts. Currently the main pages, the blog index, and the RSS feed. It's
 * an editorial content map for AI crawlers, not a ranking factor.
 */
export const GET: APIRoute = ({ site }) => {
  const { name, description } = siteData;
  const base = site ?? new URL("https://example.com/");

  const body = [
    `# ${name}`,
    "",
    `> ${description}`,
    "",
    "## Páginas",
    `- [Inicio](${base.href})`,
    `- [Sobre mí](${new URL("about/", base).href})`,
    `- [Post](${new URL("blog/", base).href})`,
    `- [Contacto](${new URL("contact/", base).href})`,
    "",
    "## Fuentes y legal",
    `- [RSS](${new URL("rss.xml", base).href})`,
    `- [Términos](${new URL("terms/", base).href})`,
    `- [Privacidad](${new URL("privacy/", base).href})`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
