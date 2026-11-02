# sakaramos

Personal site of Andres Ramos, a software developer from Pitalito, Huila.

Astro 7, Tailwind CSS v4, and TypeScript, hosted on Cloudflare Workers. The header switches the site between Spanish and English.

```sh
pnpm install
pnpm dev
```

Open http://localhost:4321. `/` goes to `/about/`.

Posts live in `src/data/blog/`. How to write one, in Spanish, English, or both, is in `src/data/README.md`.

Deploy with `SITE_URL` set, then `pnpm deploy`. The contact form sends mail through Resend. Keys go in `.env` locally and as Worker secrets in production. See `.env.example`.
