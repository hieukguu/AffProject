#!/usr/bin/env node
// Crops the icon mark out of the full TrailNestCo logo (which includes wordmark + tagline)
// and generates favicon-sized square assets. The full logo (with wordmark) is also copied
// as-is for use in the header / footer / og image.

import sharp from 'sharp';
import { join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

const SRC = join(process.cwd(), 'bd2a8f67-4464-43e1-a19a-a3c422726409.png');
const OUT_DIR = join(process.cwd(), 'public');
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

async function main() {
  const meta = await sharp(SRC).metadata();
  console.log('source size', meta.width, meta.height);

  // 1. Full logo (wordmark + icon) — used in header/footer.
  await sharp(SRC).toFile(join(OUT_DIR, 'logo.png'));

  // 2. Crop just the circular mountain icon (top portion, above the wordmark),
  //    then trim whitespace so it's tightly bounded, then pad to a square.
  const iconCropHeight = Math.round(meta.height * 0.56);
  const cropped = await sharp(SRC)
    .extract({ left: 0, top: 0, width: meta.width, height: iconCropHeight })
    .flatten({ background: '#ffffff' })
    .toBuffer();
  await sharp(cropped).toFile(join(OUT_DIR, 'debug-crop.png'));

  let iconBuffer;
  try {
    iconBuffer = await sharp(cropped).trim({ background: '#ffffff', threshold: 10 }).toBuffer();
  } catch (err) {
    console.log('trim failed, using untrimmed crop:', err.message);
    iconBuffer = cropped;
  }

  const iconMeta = await sharp(iconBuffer).metadata();
  const side = Math.max(iconMeta.width, iconMeta.height) + 40; // small padding

  const squareIcon = sharp(iconBuffer).resize({
    width: side,
    height: side,
    fit: 'contain',
    background: '#ffffff',
  });

  await squareIcon.clone().toFile(join(OUT_DIR, 'icon-mark.png'));
  await squareIcon.clone().resize(512, 512).toFile(join(OUT_DIR, 'favicon-512.png'));
  await squareIcon.clone().resize(180, 180).toFile(join(OUT_DIR, 'apple-touch-icon.png'));
  await squareIcon.clone().resize(32, 32).toFile(join(OUT_DIR, 'favicon-32.png'));
  await squareIcon.clone().resize(1200, 1200, { fit: 'contain', background: '#ffffff' }).toFile(join(OUT_DIR, 'og', 'default.jpg'));

  console.log('Done. Generated logo.png, icon-mark.png, favicon-512.png, apple-touch-icon.png, favicon-32.png, og/default.jpg');
}

main();
