# Deployment Guide

## Before you deploy — replace placeholders

Everything brand/business-identity related lives in **`src/lib/site.ts`**. Update it before going live:

- `domain` / `url` — your real domain (also update `astro.config.mjs` → `site:`)
- `business.address`, `business.phone`, `business.email*` — your real registered business contact info
- `social.*` — real social profile URLs
- `ogImage` — replace `/og/default.jpg` with a real 1200×630 image in `public/og/`
- `contactFormEndpoint` — see "Activate the contact form" below; the site won't actually receive
  submissions until this is set to a real endpoint

Also replace:
- `public/favicon.svg` / `favicon.ico` with your real logo mark
- Author avatars referenced in `src/content/authors/*.json` (currently point to `/authors/*.svg`,
  auto-generated initials avatars — swap for real headshots once you have actual contributors;
  see the note in `scripts/generate-avatars.mjs` for why we avoided stock photos here)
- The placeholder Amazon Associates tag in every `affiliateProducts[].url` — see "Activate affiliate
  links" below

## Activate affiliate links

You don't have an affiliate program or a single sale yet, which is normal at this stage — so every
`affiliateProducts[].url` across `src/content/articles/*.mdx` currently points to a **real, working**
Amazon search result for that product (not a dead placeholder domain), with a placeholder Associates
tag (`trailnestco0c-20`) appended. Nothing is broken if you deploy today; links just won't earn
commission until you have a real tag.

**Recommended path, in order:**

1. **Sign up for Amazon Associates** (associates.amazon.com) — it's the easiest program to get into
   with zero traffic; approval is close to instant, though Amazon requires 3 qualifying sales within
   180 days of approval or the account is paused (you can reapply).
2. Once approved, you get a real Associates tag (e.g. `trailnestco-20`). Find-and-replace the
   placeholder tag project-wide:
   ```bash
   # macOS/Linux
   grep -rl "trailnestco0c-20" src/content/articles | xargs sed -i '' 's/trailnestco0c-20/YOUR-REAL-TAG-20/g'
   # Windows (PowerShell)
   Get-ChildItem -Recurse src/content/articles -Filter *.mdx | ForEach-Object { (Get-Content $_.FullName) -replace 'trailnestco0c-20','YOUR-REAL-TAG-20' | Set-Content $_.FullName }
   ```
3. Build traffic for 4-8 weeks (submit your sitemap to Google Search Console immediately after
   deploy — see the post-deploy checklist below) before applying to Awin / Impact / CJ Affiliate.
   Those networks generally reject brand-new sites with no indexed content or traffic history; see
   `AWIN_IMPACT_CHECKLIST.md`.
4. Once approved by additional networks, replace individual `affiliateProducts[].url` entries with
   the specific retailer's tracking link where it makes more sense than Amazon (e.g. REI's own
   program for REI-exclusive gear, YETI's own program for YETI).

The Amazon search-link approach (`amazon.com/s?k=<product+name>`) was used instead of guessing exact
product page URLs/ASINs, which drift or 404 over time — search links stay valid even if a specific
listing changes.

## Activate the contact form

The `/contact` page (`src/components/ContactForm.astro`) is a static-site contact form — there's no
backend to receive submissions until you wire one up:

1. Sign up at [formspree.io](https://formspree.io) (free tier: 50 submissions/month).
2. Create a new form pointed at the inbox you want submissions to land in (e.g.
   `contact@trailnestco.com`).
3. Copy the form endpoint it gives you (`https://formspree.io/f/xxxxxxxx`).
4. Paste it into `contactFormEndpoint` in `src/lib/site.ts`, replacing `YOUR_FORM_ID`.
5. Submit a test message on `/contact` after deploying to confirm it arrives.

The form includes a honeypot field (`_gotcha`) for basic spam filtering and client-side validation
with inline error messages — no page reload on submit, with a visible success/error state. If you'd
rather use a different provider (Netlify Forms, Web3Forms, your own serverless function), swap the
`action` value and adjust the fetch logic in the component's `<script>` block accordingly.

## Build

```bash
npm install
npm run build
```

Output is a fully static site in `dist/` — no server runtime required.

## Hosting options

**Vercel (recommended for Astro + easy preview deploys)**
```bash
npm i -g vercel
vercel
```
Or connect the GitHub repo in the Vercel dashboard with build command `npm run build` and output dir `dist`.

**Netlify**
- Build command: `npm run build`
- Publish directory: `dist`

**Cloudflare Pages**
- Build command: `npm run build`
- Output directory: `dist`

Any static host works since there's no server-side rendering in this build (`output: 'static'`, the
Astro default).

## Post-deploy checklist

- [ ] Verify `https://trailnestco.com/sitemap-index.xml` resolves and lists all routes
- [ ] Verify `https://trailnestco.com/robots.txt` resolves and references the sitemap
- [ ] Submit the sitemap in Google Search Console and Bing Webmaster Tools
- [ ] Run the site through Google's Rich Results Test on a sample article URL to confirm Article/FAQ schema
      is valid
- [ ] Run Lighthouse / PageSpeed Insights on the homepage and one article — confirm Core Web Vitals are
      green before applying to affiliate networks (slow/broken sites are a common rejection reason)
- [ ] Confirm every legal page (`/privacy-policy`, `/terms-of-service`, `/affiliate-disclosure`, etc.)
      renders with your real business details, not placeholders
- [ ] Set up email receiving for `contact@`, `editorial@`, `writeforus@` (or update `site.ts` to addresses
      you actually monitor)

## Environment variables

This project currently has no required environment variables (no analytics or API keys wired in yet).
If you add analytics (e.g. Plausible, GA4) or a keyword-research API (see `scripts/keyword-research.md`),
use a `.env` file and `import.meta.env` — do not commit secrets.
