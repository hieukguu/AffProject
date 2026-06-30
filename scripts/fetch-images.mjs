#!/usr/bin/env node
// Downloads real, openly-licensed photos from Wikimedia Commons for article hero images.
// Commons hosts only freely-licensed or public-domain media, so every result is legally reusable;
// this script also writes attribution to public/images/CREDITS.md as good practice.

import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = join(process.cwd(), 'public', 'images');
const CREDITS_FILE = join(OUT_DIR, 'CREDITS.md');

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// slug -> Commons search query, hand-picked to bias toward relevant outdoor/home photography
const TARGETS = [
  { slug: 'best-camping-gear', query: 'camping tent', pick: 7 },
  { slug: 'best-everyday-carry-gear', query: 'rucksack', pick: 3 },
  { slug: 'best-home-organization-products', query: 'pantry shelves organized jars', pick: 0 },
  { slug: 'best-camping-tents-review', query: 'dome tent campsite', pick: 0 },
  { slug: 'yeti-vs-rtic-coolers', query: 'cooler ice beverages', pick: 0 },
  { slug: 'best-portable-power-stations', query: 'portable solar panel', pick: 7 },
  { slug: 'best-water-filters-camping', query: 'hiker filtering water stream', pick: 5 },
  { slug: 'best-budget-backpacking-stoves', query: 'camping stove', pick: 1 },
  { slug: 'best-alternatives-to-nalgene-bottles', query: 'reusable water bottle', pick: 1 },
  { slug: 'how-to-choose-a-sleeping-bag', query: 'sleeping bag tent camping inside', pick: 3 },
  { slug: 'car-camping-checklist', query: 'campground tent car', pick: 0 },
  { slug: 'how-to-waterproof-gear', query: 'rain jacket hiking', pick: 2 },
];

async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
    'filetype:bitmap ' + query,
  )}&gsrlimit=10&iiprop=url|size|mime|extmetadata&iiurlwidth=1600`;
  const res = await fetch(url, { headers: { 'User-Agent': 'TrailNest-ImageFetch/1.0 (editorial@trailnestco.com)' } });
  const data = await res.json();
  const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
  return pages
    .filter((p) => p.imageinfo?.[0]?.mime?.startsWith('image/'))
    .filter((p) => {
      const w = p.imageinfo[0].width ?? p.imageinfo[0].thumbwidth ?? 0;
      const h = p.imageinfo[0].height ?? p.imageinfo[0].thumbheight ?? 0;
      return w >= 1200 && h >= 700;
    });
}

async function downloadTo(url, filePath) {
  const res = await fetch(url, { headers: { 'User-Agent': 'TrailNest-ImageFetch/1.0 (editorial@trailnestco.com)' } });
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(filePath, buf);
  return buf.length;
}

const LIST_MODE = process.argv.includes('--list');

async function main() {
  if (LIST_MODE) {
    for (const target of TARGETS) {
      console.log(`\n=== ${target.slug} ("${target.query}") ===`);
      const candidates = await searchCommons(target.query);
      candidates.slice(0, 8).forEach((c, i) => console.log(`  [${i}] ${c.title.replace('File:', '')}`));
    }
    return;
  }
  writeFileSync(
    CREDITS_FILE,
    '# Image Credits\n\nAll hero images are sourced from Wikimedia Commons (freely licensed media).\nVerify the license terms on each description page before commercial use, and add attribution\nin your site footer/image caption if the license requires it (most CC-BY / CC-BY-SA do).\n\n',
  );

  for (const target of TARGETS) {
    process.stdout.write(`Searching: ${target.slug} ("${target.query}")... `);
    let candidates;
    try {
      candidates = await searchCommons(target.query);
    } catch (err) {
      console.log(`FAILED (${err.message})`);
      continue;
    }
    if (!candidates.length) {
      console.log('no results');
      continue;
    }
    const pickIndex = target.pick ?? 0;
    const pick = candidates[pickIndex] ?? candidates[0];
    const info = pick.imageinfo[0];
    const ext = info.url.split('.').pop().split('?')[0].toLowerCase();
    const filename = `${target.slug}.${ext === 'jpeg' ? 'jpg' : ext}`;
    const filePath = join(OUT_DIR, filename);

    try {
      const bytes = await downloadTo(info.thumburl ?? info.url, filePath);
      console.log(`OK -> ${filename} (${(bytes / 1024).toFixed(0)} KB)`);
      const license = info.extmetadata?.LicenseShortName?.value ?? 'see description page';
      const artist = (info.extmetadata?.Artist?.value ?? '').replace(/<[^>]+>/g, '').trim() || 'Unknown';
      appendFileSync(
        CREDITS_FILE,
        `- **${filename}** — "${pick.title.replace('File:', '')}" by ${artist}, license: ${license}\n  Source: ${info.descriptionurl}\n`,
      );
    } catch (err) {
      console.log(`DOWNLOAD FAILED (${err.message})`);
    }
  }
}

main();
