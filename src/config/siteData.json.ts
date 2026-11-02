import { type SiteDataProps } from "./types/configDataTypes";

// Site metadata. Edit with your project's details.
const siteData = {
  name: "sakaramos",
  title: "sakaramos — Andres Ramos",
  description:
    "Andres Ramos, desarrollador de software de Pitalito, Huila. Backend, productos e inteligencia artificial.",

  author: {
    name: "Andres Ramos",
    email: "andfera201@gmail.com",
    // Ships EMPTY on purpose: BaseHead only emits `twitter:creator` when this is set, so an unfilled
    // template omits the tag rather than attributing every page to a handle that doesn't exist.
    twitter: "",
  },

  defaultImage: {
    src: "/og.jpg",
    alt: "sakaramos",
  },

  // Social/profile URLs, surfaced as the Organization `sameAs` in JSON-LD (see @js/schema) AND used
  // by @config/socialData to point the footer row, the home contact chips and the contact InfoCards
  // at your real profiles. **Fill this before launch:** while it is empty those links fall back to
  // bare platform home pages (github.com, linkedin.com, discord.gg, …).
  // e.g. ["https://x.com/yourhandle", "https://github.com/yourorg"]
  sameAs: [],
} satisfies SiteDataProps;

export default siteData;
