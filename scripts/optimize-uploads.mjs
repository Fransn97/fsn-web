/**
 * Optimiza automáticamente las imágenes subidas por el CMS.
 * Corre antes de `astro build` (también en Vercel), así las fotos que
 * Francisco sube desde el iPhone (9MP, varios MB) se redimensionan y
 * comprimen solas. Idempotente: salta las que ya están optimizadas.
 */
import sharp from "sharp";
import { readdir, stat, rename, unlink } from "node:fs/promises";
import { join, extname } from "node:path";

const DIR = "public/assets/uploads";
const MAX_DIM = 1600; // lado máximo en px
const QUALITY = 82;
const SKIP_BELOW = 320 * 1024; // si ya pesa <320KB y es pequeña, no la toques

const exts = new Set([".jpg", ".jpeg", ".png"]);

let files;
try {
  files = await readdir(DIR);
} catch {
  console.log("[optimize-uploads] sin carpeta de uploads, nada que hacer");
  process.exit(0);
}

let optimized = 0;
for (const name of files) {
  const ext = extname(name).toLowerCase();
  if (!exts.has(ext)) continue;

  const path = join(DIR, name);
  const { size } = await stat(path);

  const meta = await sharp(path).metadata().catch(() => null);
  if (!meta) continue;

  const tooBig = Math.max(meta.width || 0, meta.height || 0) > MAX_DIM;
  const tooHeavy = size > SKIP_BELOW;
  if (!tooBig && !tooHeavy) continue; // ya está bien

  const tmp = path + ".tmp";
  const pipeline = sharp(path)
    .rotate() // aplica orientación EXIF (fotos de iPhone)
    .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true });

  if (ext === ".png") {
    await pipeline.png({ quality: QUALITY, compressionLevel: 9 }).toFile(tmp);
  } else {
    await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(tmp);
  }

  await unlink(path);
  await rename(tmp, path);
  const after = (await stat(path)).size;
  console.log(`[optimize-uploads] ${name}: ${(size / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`);
  optimized++;
}

console.log(`[optimize-uploads] hecho (${optimized} imagen/es optimizada/s)`);
