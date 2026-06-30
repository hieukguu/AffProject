#!/usr/bin/env node
// Generates simple initials-based SVG avatars for authors.
// We deliberately avoid using real stock photos of strangers paired with the fictional
// author names in src/content/authors/ — that risks misappropriating a real person's
// likeness. Swap these for real staff headshots once you have actual contributors.

import { writeFileSync, mkdirSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const AUTHORS_DIR = join(process.cwd(), 'src', 'content', 'authors');
const OUT_DIR = join(process.cwd(), 'public', 'authors');
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const PALETTE = ['#2a634c', '#397d60', '#c4440a', '#5b9a7c'];

function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function hashColor(slug) {
  let hash = 0;
  for (const c of slug) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

const files = readdirSync(AUTHORS_DIR).filter((f) => f.endsWith('.json'));

for (const file of files) {
  const data = JSON.parse(readFileSync(join(AUTHORS_DIR, file), 'utf-8'));
  const color = hashColor(data.slug);
  const text = initials(data.name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" rx="100" fill="${color}" />
  <text x="100" y="115" font-family="Inter, Arial, sans-serif" font-size="76" font-weight="700" fill="#ffffff" text-anchor="middle">${text}</text>
</svg>`;
  const outPath = join(OUT_DIR, `${data.slug}.svg`);
  writeFileSync(outPath, svg);
  console.log(`Generated ${outPath}`);
}
