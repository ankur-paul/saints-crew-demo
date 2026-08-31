// Regenerate the web-ready images in src/assets/ from the masters in assets/.
//
//   npm run images
//
// assets/ holds the full-resolution photography and is never deployed.
// src/assets/ holds the derivatives the site actually loads, and is committed so
// that building the site needs nothing but Node.
//
// Requires ImageMagick 7 (`magick`). Re-run it after adding or replacing a photo.

import { execFile } from "node:child_process";
import { mkdir, readdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const from = join(root, "assets");
const to = join(root, "src", "assets");

/**
 * How each family of images is resized. Photographs are served at roughly twice
 * their largest CSS size so they stay sharp on dense screens, and no larger.
 *
 * `>` only ever shrinks; `^` fits the shorter edge, for images used as covers.
 */
const RULES = [
  { match: /^card-/, resize: "800x1000>" },  // product cards, 4:5
  { match: /^tex-/, resize: "900x900^>" },   // category tiles, cropped
  { match: /^wide-/, resize: "1800x1800>" }, // full-bleed bands
];

/** Quality 80 is the point where these photographs stop losing anything visible. */
const JPEG = ["-strip", "-quality", "80", "-interlace", "Plane", "-sampling-factor", "4:2:0"];

await mkdir(to, { recursive: true });

let converted = 0;
let saved = 0;

for (const name of (await readdir(from)).sort()) {
  const rule = RULES.find((r) => r.match.test(name));

  if (name.endsWith(".png")) {
    await run("magick", [join(from, name), "-strip", join(to, name)]);
    converted += 1;
    continue;
  }

  // Anything not covered by a rule is a master we do not ship (the photo-* set).
  if (!rule || !name.endsWith(".jpg")) continue;

  await run("magick", [join(from, name), ...JPEG, "-resize", rule.resize, join(to, name)]);
  saved += (await stat(join(from, name))).size - (await stat(join(to, name))).size;
  converted += 1;
}

console.log(`${converted} images written to src/assets/ (${(saved / 1024 / 1024).toFixed(1)} MB smaller)`);
