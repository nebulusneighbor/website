// Converts originals in raw/img into web-sized WebP files in src/assets/img.
// Run with `npm run images` after adding a new image to raw/img.
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'raw/img';
const OUT = 'src/assets/img';
const MAX_WIDTH = 1200;

await mkdir(path.join(OUT, 'projects'), { recursive: true });

// Top-level images plus project-page figures in raw/img/projects
const files = [
  ...(await readdir(SRC)),
  ...(await readdir(path.join(SRC, 'projects'))).map((f) => `projects/${f}`),
];

for (const file of files) {
  if (!/\.(png|jpe?g|webp)$/i.test(file)) continue;
  const name = file.replace(/\.[^.]+$/, '');
  const dest = path.join(OUT, `${name}.webp`);

  const src = path.join(SRC, file);
  try {
    if ((await stat(dest)).mtimeMs > (await stat(src)).mtimeMs) continue;
  } catch {}

  const width = name === 'profile' ? 600 : MAX_WIDTH;
  await sharp(src)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(dest);

  // Social share card (Open Graph): portrait + name on the site's charcoal/maroon palette
  if (name === 'profile') await makeOgCard(src);
  console.log('optimized', file);
}

async function makeOgCard(src) {
  const size = 380;
  const circle = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`);
  const portrait = await sharp(src).resize(size, size, { fit: 'cover', position: 'top' })
    .composite([{ input: circle, blend: 'dest-in' }]).png().toBuffer();
  const text = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="14" height="630" fill="#681a1a"/>
    <text x="520" y="250" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="700" fill="#e09a9a" letter-spacing="4">TRIPLE PH.D. · CU BOULDER</text>
    <text x="520" y="330" font-family="Segoe UI, Arial, sans-serif" font-size="72" font-weight="700" fill="#ffffff">Torin Hopkins</text>
    <text x="520" y="395" font-family="Segoe UI, Arial, sans-serif" font-size="32" fill="#e6e2de">Research in Music, Computing,</text>
    <text x="520" y="440" font-family="Segoe UI, Arial, sans-serif" font-size="32" fill="#e6e2de">and Neuroscience</text>
    <text x="520" y="520" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="#a8adb5">torinhopkins.com</text>
  </svg>`);
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#313131' } })
    .composite([{ input: portrait, left: 90, top: 125 }, { input: text, left: 0, top: 0 }])
    .jpeg({ quality: 86 })
    .toFile(path.join(OUT, 'og-card.jpg'));
}
