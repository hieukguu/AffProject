// Central brand / business identity config.
// Swap every placeholder here before going live or submitting to affiliate networks.

export const SITE = {
  name: 'TrailNestCo',
  tagline: 'Explore More. Live Better.',
  domain: 'www.trailnestco.com',
  url: 'https://www.trailnestco.com',
  description:
    'TrailNestCo is an independent gear review publication covering camping, outdoor, travel, and everyday home essentials — tested by real editors, never pay-to-play.',
  logo: '/logo.png',
  logoIcon: '/icon-mark.png',
  niche: {
    primary: 'Everyday & Outdoor Gear',
    sub: [
      { slug: 'camping-outdoor', label: 'Camping & Outdoor Gear' },
      { slug: 'home-essentials', label: 'Everyday Home Essentials' },
      { slug: 'travel-edc', label: 'Travel & EDC' },
      { slug: 'fitness-outdoor', label: 'Fitness & Outdoor Accessories' },
    ],
  },
  business: {
    legalName: 'TrailNestCo Media LLC',
    address: {
      line1: '1201 N Market St, Suite 111',
      city: 'Wilmington',
      region: 'DE',
      postalCode: '19801',
      country: 'USA',
    },
    addressFull: '1201 N Market St, Suite 111, Wilmington, DE 19801, USA',
    phone: '+1 (302) 600-4298',
    phoneHref: 'tel:+13026004298',
    email: 'contact@trailnestco.com',
    contactEmail: 'contact@trailnestco.com',
    editorialEmail: 'contact@trailnestco.com',
    pitchEmail: 'contact@trailnestco.com',
  },
  social: {
    twitter: 'https://twitter.com/trailnestco',
    facebook: 'https://facebook.com/trailnestco',
    pinterest: 'https://pinterest.com/trailnestco',
    youtube: 'https://youtube.com/@trailnestco',
  },
  editors: {
    editorInChief: 'james-carter',
    seniorEditor: 'sarah-nguyen',
  },
  founded: 2022,
  ogImage: '/og/default.jpg',
  // Temporary kill switch: no Amazon Associates account yet, so affiliate links are disabled
  // site-wide. Product mentions still render (name + retailer), just without a clickable link
  // or "Check price" button. Flip back to true once you have a real Associates tag — see
  // DEPLOYMENT.md "Activate affiliate links". No content files need to change either way.
  affiliateLinksEnabled: false,
  // Static site, no backend — contact form submissions post to Formspree (free tier: 50/mo).
  // Sign up at https://formspree.io, create a form pointed at your contact inbox, and replace
  // this with your real endpoint (https://formspree.io/f/xxxxxxxx) before going live.
  contactFormEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
} as const;

export type NicheSlug = (typeof SITE.niche.sub)[number]['slug'];
