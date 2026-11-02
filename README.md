# 8-BitQuest

![The 8-BitQuest home, blog post and about pages](.github/preview.png)

**[Live demo → 8-bitquest.domidex01.workers.dev](https://8-bitquest.domidex01.workers.dev/)**

A **retro 8-bit, pixel-art developer-portfolio theme** built on **Astro 7 + Tailwind CSS v4 +
TypeScript (strict)**, with a CSS-first token architecture, typed config-driven content, and an
in-house UI, motion, icon and SEO stack. Headings are Press Start 2P on a black-bordered "pixel
panel" surface; every colour flows through a semantic token layer, so the committed light and dark
themes flip for free.

It ships as a **working site, not an empty skeleton** — a Home, About, Blog and a
server-rendered Contact page, six sample posts and six sample projects, all reproduced from the
source Figma. The one non-static route is `/contact/`, which posts to a Resend-backed Astro action.

## Quick start

```sh
pnpm install
pnpm dev          # http://localhost:4321
```

It runs with no configuration and no keys — the contact form accepts a submission and then reports a
send failure until you add its Resend keys (see [Contact form](#contact-form)). Fill in `src/config/`, swap the sample
content for your own, then work through [Before you deploy](#before-you-deploy).

## Commands

| Command        | Action                                                  |
| :------------- | :------------------------------------------------------ |
| `pnpm install` | Install dependencies                                    |
| `pnpm dev`     | Dev server at `localhost:4321`                          |
| `pnpm build`   | Production build to `dist/` (static pages + the Worker) |
| `pnpm preview` | `wrangler dev` — run the production Worker locally      |
| `pnpm deploy`  | `astro build && wrangler deploy` to Cloudflare          |
| `pnpm check`   | Type-check `.astro` / `.ts` (`astro check`)             |
| `pnpm lint`    | ESLint                                                  |
| `pnpm format`  | `eslint --fix`, then Prettier                           |
| `pnpm test`    | Every `*.test.ts` self-check under `src/`               |

## Routes

| Route                  | Source                               | Built from                             |
| :--------------------- | :----------------------------------- | :------------------------------------- |
| `/`                    | `pages/index.astro`                  | `Sections/Home/*`                      |
| `/about/`              | `pages/about.astro`                  | `Sections/About/*`                     |
| `/blog/`               | `pages/blog/index.astro`             | `Sections/Blog/*` (listing)            |
| `/blog/<slug>/`        | `pages/blog/[slug].astro`            | `Sections/Blog/BlogArticle` (per post) |
| `/contact/`            | `pages/contact.astro` (**SSR**)      | `Sections/Contact/*` + a Resend action |
| `/privacy/`, `/terms/` | `pages/privacy.astro`, `terms.astro` | `config/legalData.json.ts`             |
| `/404`                 | `pages/404.astro`                    | `Sections/NotFound/*`                  |

Every route prerenders to static HTML **except `/contact/`**, which sets `export const prerender =
false` so it can take the form POST and re-render with the result. `/examples/ui` is a `noindex`
dev-only catalog: it is excluded from the sitemap and emits no HTML in a production build.

Generated endpoints: `/robots.txt`, `/llms.txt`, `/rss.xml`, `/sitemap-index.xml`. The first three
are hand-owned dynamic routes whose absolute URLs derive from `site`, so setting that once fixes them
together.

## Content

Collections are defined in `src/content.config.ts` (Zod), so bad frontmatter fails the build with the
entry named. Entries live one folder deep and the folder name is the slug.

| Collection | Location             | Ships with     | Holds                                                                                                                                           |
| :--------- | :------------------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `blog`     | `src/data/blog/`     | **6 posts**    | `title`, `description`, `authors[]` (≥1), `pubDate`, `heroImage(+alt)`, `category`, `tags`, optional `updatedDate`, `draft`                     |
| `authors`  | `src/data/authors/`  | `admin`        | `name`, `authorLink`, optional `avatar` — referenced by posts as the byline                                                                     |

The samples are retro-flavoured placeholders; replace them with your own. A blog post's body is
free-form MDX (rendered through `.blog-prose`).

## Configuration

Site-wide facts live typed in `src/config/`. (One-off section copy — the FAQ, the tech-stack list,
the gear table — deliberately lives as a typed literal at the top of its Section component instead:
edit the section to edit the copy. The rule: used on more than one page ⇒ it belongs in config.)

- **`siteData.json.ts`** — brand name, title, description, the author block, `sameAs` (your social
  profile URLs) and the default social image. `sameAs` does double duty: it disambiguates the JSON-LD
  `Organization` **and** it is where every social link on the site resolves from.
- **`socialData.json.ts`** — one definition per social platform (label, pixel glyph, and how its URL
  resolves out of `sameAs`), shared by the footer row, the home contact chips and the contact info
  cards. Add a platform here, then reference it from whichever section should show it.
- **`siteSettings.json.ts`** — `siteLang` / `siteLocale`, plus the feature switches
  `useViewTransitions` and `useAnimations`.
- **`legalData.json.ts`** — the terms and privacy copy, section by section.
- **`portfolioData.json.ts`** — the profile identity, biography, experience/stat values, home
  intro, and contact-facing organisation copy: the facts a buyer is expected to customise, in one
  typed place.

**Theme tokens** are CSS-first, in three layers (see `src/styles/tailwind-theme.css` +
`global.css`): palette aliases (`--color-primary-*`, `--color-base-*`) feed semantic runtime vars
(`--primary`, `--foreground`, `--outline`), which feed the utilities. Markup only ever uses
`bg-primary` / `text-foreground` / `text-base-700`, so a rebrand is one edit to the alias block and
both themes follow. The signature look — a black 4px border plus a hard offset `shadow-pixel` — is
the `ui/pixel-panel` primitive; the shadow colour is itself a theme-aware token (`--pixel-shadow`).

## What's in the box

- **39 UI primitives** (`src/components/ui/`) — button, dialog, dropdown, mega-menu, combobox, tabs,
  table, pixel-panel, theme-toggle, and the rest — each a folder with a `tailwind-variants` recipe,
  built on the token layer and zero-JS unless interaction demands it. Alongside them sit **7 internal
  entries** (`_client.ts`, `_dialog.ts`, `_listbox.ts`, `_popover.ts`, `_overlay.css`, `_field.ts`,
  `_Chevron.astro`) that the primitives share. Contract: `src/components/ui/README.md`. The theme's
  own pages use about a third of the library; the rest is stock for your customisation — browse it
  all at `/examples/ui` in dev, or trim it (see [Before you deploy](#before-you-deploy), step 6).
- **Two icon systems.** The theme's own UI runs on **18 pixel-art glyphs**
  (`src/components/svg/pixel-icons/`) behind a typed `<PixelIcon name="…" />` — the theme toggle, the
  footer social row, the tech-stack and skill-tree lists, the article navigation. Alongside it sits a
  stock library of **553 inlined 24×24 line icons** (`src/components/svg/icons/`) behind
  `<Icon name="…" />`, for your own pages; it is referenced only by the `/examples/ui` catalog, so
  deleting that catalog (step 6 below) leaves it unreferenced — keep the folder or delete it. Both are
  build-time only: icons inline into HTML and nothing lands in client JS. Licensing for both is in
  [`THIRD-PARTY.md`](./THIRD-PARTY.md).
- **87 motion utilities** (`src/styles/motion/`) — a dependency-free port of tailwind-animations plus
  scroll-driven extensions, with a global `prefers-reduced-motion` guard.
- **An owned SEO layer** — every meta/OG tag emitted natively by `BaseHead`, JSON-LD (Organization +
  WebSite site-wide, plus per-post `BlogPosting` + `BreadcrumbList`) built by typed helpers in
  `@js/schema`, and dynamic `robots.txt` / `llms.txt` / `rss.xml`. No SEO package.

The owned motion, icon and SEO layers add **no runtime dependencies**. The primitives use
`tailwind-variants` + `tailwind-merge`; SSR uses `@astrojs/cloudflare`; content uses `@astrojs/mdx`;
the two fonts are self-hosted via `@fontsource`.

## Contact form

`/contact/` is the one server-driven page. A native `<form method="POST">` binds to an Astro action
(`src/actions/index.ts`), so it works with JavaScript disabled: the server re-validates with
`contactSchema`, runs two spam gates (a honeypot and a submit-time gate), and sends the mail with a
plain `fetch` to the Resend API — no SDK, no dependency, a 10-second timeout. Provider errors are
logged server-side and never shown to the visitor.

It needs two environment variables (read at **request** time, so a missing key never breaks the
build — the form answers with its generic send-failure message, and names the missing key in the
server log rather than to the visitor):

| Variable             | Required | Purpose                                                           |
| :------------------- | :------: | :---------------------------------------------------------------- |
| `RESEND_API_KEY`     |   yes    | Resend API key                                                    |
| `CONTACT_TO_EMAIL`   |   yes    | Where submissions are delivered (your inbox)                      |
| `CONTACT_FROM_EMAIL` |    no    | From address; defaults to Resend's shared `onboarding@resend.dev` |

The default sender only delivers to your own Resend account address. **To send anywhere else you must
verify a domain in Resend** and set `CONTACT_FROM_EMAIL` to an address on it. See `.env.example`.

### Demo deployments

Building with `CONTACT_DEMO_MODE=true` makes the form validate, run its spam gates, and then report
success **without sending** — so a public demo of this template needs no Resend account and no
inbox. It is read at build time and defaults to `false`; leave it unset on a real site, or your
contact form will quietly deliver nothing.

```sh
CONTACT_DEMO_MODE=true SITE_URL=https://your-demo.example.com pnpm build
```

## Structure

```text
src/
├── components/
│   ├── Sections/<Page>/   layout-free page sections (Global/ for cross-page chrome: Header, Footer)
│   ├── Cards/             content-aware card compositions (built on ui/pixel-panel)
│   ├── ui/<name>/         the primitive library (see its README for the contract)
│   └── svg/icons/         the <Icon> system
├── actions/               the contact server action (Resend)
├── config/                typed site config — the source of truth, never literals in components
├── data/<collection>/     content collections, Zod-validated
├── js/                    TypeScript utilities (schema, contact, readingTime, nav…) + their *.test.ts
├── layouts/               BaseLayout + BaseHead (all meta/SEO tags live here)
├── pages/                 file routes — thin shells owning BaseLayout + SEO
└── styles/                global.css entry, tailwind-theme.css tokens, motion/ catalog
```

Pages are thin route shells that own `BaseLayout` + SEO and compose **Sections**; Sections build on
**ui** primitives and **Cards**. The three contracts are `Sections/README.md`, `Cards/README.md` and
`ui/README.md`.

## Deployment

The site deploys to **Cloudflare Workers**: the build is static **except `/contact/`**, so
`@astrojs/cloudflare` is mounted and `astro build` emits the static pages plus one Worker
(`dist/_worker.js`) that renders the on-demand route. `wrangler.jsonc` is the Worker config — its
`main` stays the adapter's entrypoint, and the adapter injects the asset wiring and provisions its
session KV binding on first deploy.

```sh
SITE_URL=https://your.domain pnpm build   # bakes canonical/OG/sitemap URLs at build time
pnpm deploy                               # astro build && wrangler deploy (wrangler login once)
pnpm preview                              # wrangler dev — the production Worker, locally
```

The contact keys live in the Worker, not the build: set them once with
`pnpm wrangler secret put RESEND_API_KEY` / `CONTACT_TO_EMAIL` (and `CONTACT_FROM_EMAIL` for a
verified domain). Locally, `.env` keeps working for `pnpm dev`.

**To change hosts**, swap the adapter in `astro.config.mjs` for `@astrojs/node`, `@astrojs/netlify`
or `@astrojs/vercel` (a two-line change; nothing else knows which adapter is mounted — the contact
keys read through `astro:env`, which every adapter serves). **To go fully static**, remove the
contact form (or its `prerender = false`) and drop the adapter — then any static host serves `dist/`.

**One known cost of the mixed build:** because `/contact/` is on-demand, the build emits the shared
stylesheet twice — `_astro/BaseLayout.<hash>.css` and a byte-identical `_astro/contact.<hash>.css`
(84,211 B, ~14.7 KB gzip each) — so a visitor who navigates from any static page to `/contact/`
downloads it again. It is an artifact of mixing prerendered and on-demand routes, not a
misconfiguration: setting `prerender = true` on the contact route collapses the two into one file,
verified. Going fully static (above) removes it; otherwise it is the price of the server-rendered
form, and the second copy is cached from then on.

Required environment variables at **build** time: **`SITE_URL`** (your production domain — feeds
canonical, OG, JSON-LD, sitemap, `robots.txt`, `llms.txt`; a production deploy throws on the
`example.com` placeholder — set `DEPLOY_ENV=production` in your CI build env to arm that guard).
See `.env.example`.

## Before you deploy

1. **`SITE_URL`** — your production domain, in the host's environment variables. A **production**
   deploy fails if it is missing or still `example.com`; local builds and deploy previews are
   unaffected.
2. **Contact keys** — `RESEND_API_KEY` and `CONTACT_TO_EMAIL` (and, to send beyond your own inbox, a
   verified domain + `CONTACT_FROM_EMAIL`).
3. **`public/og.jpg`** — replace the placeholder with a real 1200×630 social image.
4. **`src/config/*`** — `siteData`, `portfolioData`, and the `legalData` terms/privacy copy (the last
   is placeholder text, not legal advice — have it reviewed). In `siteData`, **fill `sameAs`**: until
   you do, the footer icons and contact links point at bare platform home pages (`github.com`,
   `linkedin.com`, `discord.gg`) rather than at your profiles. Set `author.email` and, if you use it,
   `author.twitter` (empty by default, which omits `twitter:creator`).
5. **Favicons** — `public/favicon.svg` and `public/favicon.ico`.
6. **Delete the dev catalog** — `src/components/Sections/UiCatalog/` and `src/pages/examples/`, once
   you have finished picking primitives. It builds no pages in production, but Tailwind still scans its
   markup, so its demo classes sit in the stylesheet every page loads; removing it trims the shared CSS
   by roughly a quarter (re-measured on the stock catalog: 84,211 B → 64,246 B, ~11.7 KB gzip) and
   drops 75 unused `@keyframes` (90 → 15).
7. **`.claude/`** — harness settings plus two optional skills for working on the repo with Claude
   Code. Keep it if you use Claude; deleting it changes nothing at runtime.
8. **Read [`THIRD-PARTY.md`](./THIRD-PARTY.md)** — the fonts, icon sets and code ports that are *not*
   covered by [`LICENSE`](./LICENSE), including which trademarked brand marks the theme uses and the
   demo images whose provenance you need to settle before shipping commercially.

## Verifying a change

```sh
pnpm lint && pnpm check && pnpm build && pnpm test
```

The build is the real check: content-schema and config mistakes surface there. `pnpm test` runs every
`*.test.ts` under `src/` with Node's type stripping — no framework, no fixtures — and **fails if it
finds none**, so a check cannot go missing unnoticed.

## Docs

House rules live in `AGENTS.md` (which `CLAUDE.md` imports so any agent loads them). The component
contracts live next to the code they govern: `src/components/ui/README.md`,
`src/components/Sections/README.md`, `src/components/Cards/README.md`,
`src/components/svg/icons/README.md` and `src/data/README.md`. Git history records the removal of
the former i18n layer and Keystatic CMS, along with the shape to restore them if a project needs
them back.
