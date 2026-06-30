# Affiliate Network Approval Checklist (Awin / Impact / CJ Affiliate)

Manual reviewers at these networks are checking for: a real, operating business; genuine editorial content
(not a bare link farm); transparent affiliate disclosure; and working legal/contact infrastructure. This
checklist maps each requirement to what's already built and what you still need to do.

## Already built into this codebase

- [x] About Us page with named editorial team and bios (`/about`)
- [x] Editorial Policy describing the draft → review → edit → publish workflow (`/editorial-policy`)
- [x] Fact-Checking Policy (`/fact-checking-policy`)
- [x] Affiliate Disclosure, FTC-referenced (`/affiliate-disclosure`)
- [x] Contact page with consistent NAP — name, address, phone (`/contact`)
- [x] Write for Us page (`/write-for-us`)
- [x] Privacy Policy (`/privacy-policy`)
- [x] Terms of Service (`/terms-of-service`)
- [x] Consistent business address/phone/email in the footer on every page
- [x] Author bylines with name, title, bio, and expertise tags on every article
- [x] Visible "Published" / "Updated" dates and fact-checked indicator on every article
- [x] Affiliate disclosure notice repeated at the bottom of every article (not just the dedicated page)
- [x] Affiliate links use `rel="nofollow sponsored noopener"`
- [x] 12 substantive articles live (not placeholder/lorem content)
- [x] Sitemap + robots.txt generated automatically

## You must still do before applying

- [ ] **Replace every placeholder** in `src/lib/site.ts` (real domain, real phone, real email addresses
      that you actually monitor) — see `DEPLOYMENT.md`
- [ ] **Register the business** named in `business.legalName` if it isn't already a real registered entity
      at the address used — networks may verify this
- [ ] **Deploy to the real domain** with HTTPS before applying — most networks reject `localhost` or
      staging-subdomain submissions
- [ ] **Get a real Amazon Associates tag** and swap the placeholder (`trailnestco0c-20`) in every
      `affiliateProducts[].url` — see "Activate affiliate links" in `DEPLOYMENT.md`. Links already point
      to real Amazon search results, so nothing is broken pre-approval; they just won't earn commission
      until the real tag is in place
- [ ] **Swap in network-specific tracking links** (Awin/Impact/CJ/individual retailer programs) for
      products better covered by those programs once approved
- [ ] **Add real author photos** to `public/authors/` (stock-photo-obvious headshots can hurt trust signals)
- [ ] **Set up monitored inboxes** for `contact@`, `editorial@`, `writeforus@` — networks sometimes test
      these during review
- [ ] **Get a working phone line** at the number listed, or use a real forwarding number — don't list a
      number that doesn't connect
- [ ] **Build a few months of traffic/content history** if possible before applying — networks are more
      likely to approve sites with an existing publishing cadence than a same-day launch
- [ ] **Have a few articles ranking or indexed in Google** before applying — submit the sitemap to Search
      Console immediately after deploy so indexing starts accruing history

## Application tips

- Apply to each network separately; approval criteria and timelines differ (Awin and CJ tend to be the
  strictest on traffic history; Impact has historically been faster for new publishers).
- In the application's "describe your site" field, reference your editorial process explicitly — link to
  `/editorial-policy` and `/about`. Reviewers do click through.
- If rejected, the most common reasons are: thin/duplicate content, missing or inconsistent contact info,
  no visible affiliate disclosure, or a brand-new domain with no indexed content. Address whichever applies
  and reapply — most networks allow reapplication after 30-90 days.
