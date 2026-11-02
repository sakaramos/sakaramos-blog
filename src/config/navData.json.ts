import { type NavItemProps } from "./types/configDataTypes";

/**
 * * Primary navigation — the header's link set (Figma node 5:110).
 *
 * Labels are Title-case and uppercased in the UI (Press Start 2P). Hrefs carry the trailing slash
 * to match `astro.config.mjs` `trailingSlash: "always"`. `as const satisfies` keeps the literal
 * types while checking the shape.
 *
 * Order: SAKARAMOS · BLOG · CONTACT. The first item is the profile at `/about/`.
 * `/` redirects there too. `/contact/` is the one SSR page.
 */
export const navItems = [
  { label: "sakaramos", labelEn: "sakaramos", href: "/about/" },
  { label: "Post", labelEn: "Post", href: "/blog/" },
  { label: "Contacto", labelEn: "Contact", href: "/contact/" },
] as const satisfies readonly NavItemProps[];
