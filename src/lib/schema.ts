import { SITE } from './site';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.business.legalName,
    url: SITE.url,
    logo: `${SITE.url}/logo.png`,
    foundingDate: String(SITE.founded),
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.business.address.line1,
      addressLocality: SITE.business.address.city,
      addressRegion: SITE.business.address.region,
      postalCode: SITE.business.address.postalCode,
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE.business.phone,
      email: SITE.business.contactEmail,
      contactType: 'customer support',
    },
    sameAs: Object.values(SITE.social),
  };
}

export function authorSchema(author: {
  name: string;
  slug: string;
  title: string;
  bio: string;
  avatar: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE.url}/authors/${author.slug}#person`,
    name: author.name,
    jobTitle: author.title,
    description: author.bio,
    image: new URL(author.avatar, SITE.url).toString(),
    url: `${SITE.url}/authors/${author.slug}`,
    worksFor: {
      '@id': `${SITE.url}/#organization`,
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.path, SITE.url).toString(),
    })),
  };
}

export function articleSchema(article: {
  title: string;
  description: string;
  slug: string;
  path: string;
  heroImage: string;
  datePublished: Date;
  dateUpdated: Date;
  author: { name: string; slug: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE.url}${article.path}#article`,
    headline: article.title,
    description: article.description,
    image: [new URL(article.heroImage, SITE.url).toString()],
    datePublished: article.datePublished.toISOString(),
    dateModified: article.dateUpdated.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: `${SITE.url}/authors/${article.author.slug}`,
    },
    publisher: {
      '@id': `${SITE.url}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE.url}${article.path}`,
    },
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  if (!items.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
