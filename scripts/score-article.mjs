#!/usr/bin/env node
// Quality-control scorer for articles before publish.
// Usage: node scripts/score-article.mjs src/content/articles/some-article.mdx
// Scoring: Structure /20, Depth /30, SEO /20, Trust /30. Minimum to publish: 75/100.

import { readFileSync } from 'node:fs';
import { argv } from 'node:process';

const file = argv[2];
if (!file) {
  console.error('Usage: node scripts/score-article.mjs <path-to-article.mdx>');
  process.exit(1);
}

const raw = readFileSync(file, 'utf-8');
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
const frontmatter = fmMatch ? fmMatch[1] : '';
const body = raw.slice(fmMatch ? fmMatch[0].length : 0);

const wordCount = body
  .replace(/```[\s\S]*?```/g, '')
  .replace(/<[^>]+>/g, '')
  .split(/\s+/)
  .filter(Boolean).length;

const h2Count = (body.match(/^##\s/gm) || []).length;
const h3Count = (body.match(/^###\s/gm) || []).length;
const hasFaqSection = /## Frequently asked questions/i.test(body);
const hasTable = /^\|.+\|$/m.test(body);
const internalLinkCount = (body.match(/\]\(\/(?!\/)[^)]*\)/g) || []).length;
const hasFrontmatterFaq = /faq:\s*\n\s*-\s*question:/.test(frontmatter);
const hasAuthor = /authorSlug:\s*"[\w-]+"/.test(frontmatter);
const hasReviewer = /reviewerSlug:\s*"[\w-]+"/.test(frontmatter);
const factChecked = /factChecked:\s*true/.test(frontmatter);
const hasDescription = /description:\s*"(.{20,165})"/.test(frontmatter);

let structure = 0;
if (h2Count >= 3) structure += 8;
else if (h2Count >= 1) structure += 4;
if (h3Count >= 1) structure += 3;
if (hasTable) structure += 5;
if (hasFaqSection && hasFrontmatterFaq) structure += 4;
structure = Math.min(structure, 20);

let depth = 0;
if (wordCount >= 1500) depth += 18;
else if (wordCount >= 1000) depth += 10;
else if (wordCount >= 600) depth += 5;
if (wordCount >= 2200) depth += 4;
if (hasTable) depth += 4;
if (/Testing methodology|How we (chose|test)/i.test(body)) depth += 4;
depth = Math.min(depth, 30);

let seo = 0;
if (hasDescription) seo += 6;
if (internalLinkCount >= 3) seo += 8;
else if (internalLinkCount >= 1) seo += 4;
if (h2Count >= 1) seo += 3;
if (hasFaqSection) seo += 3;
seo = Math.min(seo, 20);

let trust = 0;
if (hasAuthor) trust += 8;
if (hasReviewer) trust += 8;
if (factChecked) trust += 8;
if (/affiliate disclosure/i.test(body) || /AffiliateCTA/.test(body) === false) trust += 0;
if (/nofollow sponsored/i.test(raw) || !/AffiliateCTA/.test(raw)) trust += 6;
trust = Math.min(trust, 30);

const total = structure + depth + seo + trust;
const pass = total >= 75;

console.log(`\nQC Score: ${file}`);
console.log('─'.repeat(50));
console.log(`Word count:        ${wordCount}`);
console.log(`H2 / H3 sections:  ${h2Count} / ${h3Count}`);
console.log(`Internal links:    ${internalLinkCount}`);
console.log(`Has table:         ${hasTable}`);
console.log(`Has FAQ section:   ${hasFaqSection && hasFrontmatterFaq}`);
console.log('─'.repeat(50));
console.log(`Structure:  ${structure}/20`);
console.log(`Depth:      ${depth}/30`);
console.log(`SEO:        ${seo}/20`);
console.log(`Trust:      ${trust}/30`);
console.log('─'.repeat(50));
console.log(`TOTAL:      ${total}/100  ${pass ? '✓ PASS (min 75)' : '✗ REJECT (min 75)'}\n`);

process.exit(pass ? 0 : 1);
