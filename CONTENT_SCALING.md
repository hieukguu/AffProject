# Scaling to 100–1000 Articles

This site ships with 12 seed articles (3 pillar, 6 cluster, 3 support) covering the
camping-outdoor / home-essentials / travel-edc sub-niches. `fitness-outdoor` is defined in
`src/lib/site.ts` but has no articles yet — it's the natural next batch.

## Content architecture recap

- **Tier 1 — Pillar** (`src/content/articles/*.mdx`, `type: "pillar"`, `tier: 1`) → served at `/[slug]`
- **Tier 2 — Cluster** (`type: "review" | "comparison" | "alternatives"`, `tier: 2`) → served at `/reviews/[slug]`
- **Tier 3 — Support** (`type: "guide"`, `tier: 3`) → served at `/guides/[slug]`

Every cluster/support article should set `pillarSlug` to its parent pillar's slug, and list 2-4
`relatedSlugs` for internal linking. The pillar pages should link out to every cluster article under them.

## Adding articles at scale

1. **Research** — run the keyword workflow in `scripts/keyword-research.md`, output a content calendar.
2. **Draft** — copy the matching template from `/templates` (`article-pillar`, `article-review`, or
   `article-guide`), fill in frontmatter and body, save into `src/content/articles/<slug>.mdx`.
3. **Score** — run `node scripts/score-article.mjs src/content/articles/<slug>.mdx` before requesting
   review. Anything under 75/100 gets reworked, not published.
4. **Review** — a senior editor (`sarah-nguyen` or `james-carter` in `src/content/authors/`) is set as
   `reviewerSlug`; `factChecked: true` is only set once specs/pricing are verified.
5. **Publish** — `editorialStatus` moves `draft → in_review → edited → published`; `dateUpdated` is bumped
   on every substantive future edit, which is what readers and Google see as freshness.
6. **Build & deploy** — `npm run build` regenerates static pages + sitemap automatically (`@astrojs/sitemap`
   picks up every route at build time, including newly added articles).

## Author capacity planning

Each author in `src/content/authors/` carries `expertise` tags — route new article assignments to the
author whose tags match the sub-niche. At 2 staff writers + 1 senior editor doing review, a sustainable
cadence is roughly 8-12 published articles/month without sacrificing the testing-and-fact-check process.
Scaling past that requires either adding writers (use `/write-for-us` submissions) or accepting a slower
per-article review cycle — don't skip the review step to hit a volume target; that's exactly the thin-content
pattern this system is built to avoid.

## Batch production checklist (for 50-100 article pushes)

- [ ] Keyword calendar covers all 4 sub-niches, not just the ones already seeded
- [ ] No more than ~40% of new articles are Tier 2/3 without a clear Tier 1 pillar to attach to
- [ ] Every new article passes `score-article.mjs` at ≥75 before merge
- [ ] Spot-check 10% of the batch for duplicate search intent against existing articles (avoid cannibalization)
- [ ] Sitemap and internal-linking graph reviewed after the batch (broken `relatedSlugs` references will
      render an empty related-articles section, not an error — check manually)
