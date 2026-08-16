#!/usr/bin/env node
/**
 * Generates the placeholder PWA/install icons committed under public/icons/.
 *
 * Per docs/claude-design-agent-brief.md and ADR-128, MediFind defers a
 * custom logo/illustration until validated demand. A PWA manifest still
 * needs raster icons to be installable (especially iOS "Add to Home
 * Screen"), so this script produces a flat single-colour square using the
 * approved `primary` design token — a documented placeholder, not a
 * designed asset. It writes raw PNG bytes using only Node's built-in zlib
 * (no image-processing dependency, no native build step).
 *
 * Re-run with `pnpm --filter @medifind/web generate-icons` if the output
 * files are ever deleted; the committed PNGs in public/icons/ are the
 * source of truth used by the build and are not regenerated automatically.
 */
import { deflateSync, crc32 } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PRIMARY_TEAL = { r: 0x0f, g: 0x76, b: 0x6e }; // #0F766E, the approved `primary` light token

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function chunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBuffer, data]);
  const crcValue = crc32(crcInput);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crcValue >>> 0, 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function solidColorPng(size, color) {
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0); // width
  ihdrData.writeUInt32BE(size, 4); // height
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(2, 9); // color type: truecolor (RGB)
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const rowLength = 1 + size * 3; // filter byte + RGB per pixel
  const raw = Buffer.alloc(rowLength * size);
  for (let y = 0; y < size; y += 1) {
    const rowStart = y * rowLength;
    raw[rowStart] = 0; // filter type "none"
    for (let x = 0; x < size; x += 1) {
      const pixelStart = rowStart + 1 + x * 3;
      raw[pixelStart] = color.r;
      raw[pixelStart + 1] = color.g;
      raw[pixelStart + 2] = color.b;
    }
  }

  const idatData = deflateSync(raw);

  return Buffer.concat([
    PNG_SIGNATURE,
    chunk('IHDR', ihdrData),
    chunk('IDAT', idatData),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const iconsDir = fileURLToPath(new URL('../public/icons/', import.meta.url));
mkdirSync(iconsDir, { recursive: true });

const targets = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'icon-maskable-512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
];

for (const target of targets) {
  const png = solidColorPng(target.size, PRIMARY_TEAL);
  writeFileSync(`${iconsDir}${target.file}`, png);
  console.log(`[generate-icons] wrote ${target.file} (${target.size}x${target.size})`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" role="img" aria-label="MediFind synthetic development icon"><rect width="32" height="32" fill="#0F766E" /></svg>\n`;
writeFileSync(`${iconsDir}icon-any.svg`, svg, 'utf8');
console.log('[generate-icons] wrote icon-any.svg');
