#!/usr/bin/env node
// Replaces placeholder example-retailer.com affiliate links with real, working Amazon
// search links (no dead links once the site goes live). Each URL carries a placeholder
// Associates tag (?tag=trailnestco0c-20) — once you have a real Amazon Associates tag,
// find-and-replace "trailnestco0c-20" project-wide with your real tag, in one pass.
//
// Usage: node scripts/replace-affiliate-links.mjs

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ARTICLES_DIR = join(process.cwd(), 'src', 'content', 'articles');
const AMAZON_TAG = 'trailnestco0c-20'; // placeholder — swap for your real Associates tag

const PRODUCT_QUERIES = {
  'hydroflask-32oz': 'Hydro Flask 32oz Wide Mouth Water Bottle',
  'platypus-platy-2l': 'Platypus Platy 2L Collapsible Water Bottle',
  'brs-3000t': 'BRS-3000T Ultralight Backpacking Stove',
  'soto-windmaster': 'Soto WindMaster Stove',
  'rei-half-dome-sl2': 'REI Co-op Half Dome SL 2 Plus Tent',
  'big-agnes-sidewinder-sl20': 'Big Agnes Sidewinder SL 20 Sleeping Bag',
  'msr-hubba-hubba-nx2': 'MSR Hubba Hubba NX 2-Person Tent',
  'coleman-sundome-4': 'Coleman Sundome 4-Person Tent',
  'iris-weathertight-44qt': 'IRIS USA Weathertight Storage Box 44 Quart',
  'jackery-explorer-300plus': 'Jackery Explorer 300 Plus Portable Power Station',
  'ecoflow-river-2': 'EcoFlow RIVER 2 Portable Power Station',
  'sawyer-squeeze': 'Sawyer Squeeze Water Filter',
  'platypus-gravityworks-4l': 'Platypus GravityWorks 4L Water Filter System',
  'yeti-tundra-45': 'YETI Tundra 45 Hard Cooler',
  'rtic-45': 'RTIC 45 Hard Cooler',
};

function amazonUrl(query) {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`;
}

const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'));
let totalReplacements = 0;

for (const file of files) {
  const filePath = join(ARTICLES_DIR, file);
  let content = readFileSync(filePath, 'utf-8');
  let fileReplacements = 0;

  for (const [slug, query] of Object.entries(PRODUCT_QUERIES)) {
    const oldUrl = `https://www.example-retailer.com/${slug}`;
    const newUrl = amazonUrl(query);
    const before = content;
    content = content.split(oldUrl).join(newUrl);
    if (content !== before) {
      const occurrences = before.split(oldUrl).length - 1;
      fileReplacements += occurrences;
    }
  }

  if (fileReplacements > 0) {
    writeFileSync(filePath, content);
    console.log(`${file}: ${fileReplacements} link(s) replaced`);
    totalReplacements += fileReplacements;
  }
}

console.log(`\nDone. ${totalReplacements} affiliate link(s) replaced across ${files.length} article files.`);
console.log(`Placeholder Amazon tag in use: ${AMAZON_TAG}`);
console.log(`Once you have a real Amazon Associates tag, find-and-replace "${AMAZON_TAG}" project-wide.`);
