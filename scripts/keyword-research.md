# Keyword Research Module (stub)

This is a manual workflow stub, not an automated API integration — no third-party SEO API key is
configured in this project. Wire one in before scaling past the seed content set.

## Recommended automation path

1. Pick a keyword data provider with an API: Ahrefs, Semrush, or DataForSEO are the common choices for an
   affiliate media operation at this scale.
2. Add the API key to `.env` (never commit it) and a small fetch wrapper in `scripts/keywords/`.
3. Build a CSV/JSON output of: keyword, monthly search volume, keyword difficulty, search intent, and the
   top 5 ranking URLs — one row per target keyword.
4. Feed that file into the content pipeline (see `CONTENT_SCALING.md`) to generate the next batch of
   pillar/cluster/support slugs.

## Manual process until that's wired up

1. Start from each pillar page's sub-niche (`src/lib/site.ts` → `SITE.niche.sub`).
2. For each sub-niche, find 8-12 "best X" and "X vs Y" queries using Google autocomplete, "People also ask",
   and a free tool (Google Keyword Planner, Ubersuggest free tier).
3. Classify each keyword by intent:
   - **Pillar** — broad "best [category] of [year]" → Tier 1
   - **Cluster** — "[product] review", "[X] vs [Y]", "[N] alternatives to [X]" → Tier 2
   - **Support** — "how to [verb]", "[topic] checklist" → Tier 3
4. Record target keyword, search intent, and tier in `content-calendar.csv` (create this file once you have
   a backlog — one row per planned article) before writing.
5. Every cluster/support article should link to exactly one pillar (`pillarSlug` in frontmatter) to keep the
   topic cluster's internal-linking graph intentional rather than ad-hoc.
