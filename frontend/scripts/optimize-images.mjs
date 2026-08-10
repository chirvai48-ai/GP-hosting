// One-off recompression pass for oversized static images.
// Run: node scripts/optimize-images.mjs
import sharp from "sharp";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

// file -> max long-edge px. Full-bleed panel/hero photos get more headroom
// than small avatars/thumbnails.
const TARGETS = {
  "News3.jpg": 1800,
  "News2.jpg": 1800,
  "News1.jpg": 1800,
  "panel03.jpg": 1800,
  "2panel01.jpg": 1800,
  "Panel01.jpg": 1800,
  "Seminar3.jpg": 1800,
  "Seminar4.jpg": 1800,
  "Philosophy2.jpg": 1800,
  "Philosophy3.jpg": 1800,
  "UenkaGO.jpg": 800,
};

for (const [file, maxEdge] of Object.entries(TARGETS)) {
  const filePath = path.join(PUBLIC_DIR, file);
  const before = statSync(filePath).size;

  const buf = readFileSync(filePath);
  const out = await sharp(buf)
    .resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();

  writeFileSync(filePath, out);

  const after = statSync(filePath).size;
  console.log(
    `${file}: ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB`
  );
}
