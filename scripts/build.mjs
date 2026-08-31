// Build the deployable site into dist/.
//
//   node scripts/build.mjs
//
// Bundles and minifies the ES modules and the stylesheet, fingerprints both so
// they can be cached forever, copies the images and the verbatim files in
// public/, and generates robots.txt, sitemap.xml and _headers from src/data/site.js
// so the domain is declared in exactly one place.

import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile, readdir, stat } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

import { SITE } from "../src/data/site.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, "src");
const dist = join(root, "dist");
const publicDir = join(root, "public");

/** Fingerprint used in built filenames, so a changed file gets a new URL. */
const fingerprint = (contents) => createHash("sha256").update(contents).digest("hex").slice(0, 8);

async function build() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  const js = await bundleScript();
  const css = await bundleStyles();
  await writeShell(js.name, css.name);

  await cp(join(src, "assets"), join(dist, "assets"), { recursive: true });
  await cp(publicDir, dist, { recursive: true });

  await writeGenerated();
  await report(js, css);
}

/** @returns {Promise<{ name: string, bytes: number }>} */
async function bundleScript() {
  const result = await esbuild.build({
    entryPoints: [join(src, "main.js")],
    bundle: true,
    minify: true,
    format: "esm",
    target: ["es2022"],
    write: false,
    legalComments: "none",
  });
  const code = result.outputFiles[0].contents;
  const name = `app.${fingerprint(code)}.js`;
  await writeFile(join(dist, name), code);
  return { name, bytes: code.byteLength };
}

/** @returns {Promise<{ name: string, bytes: number }>} */
async function bundleStyles() {
  const result = await esbuild.build({
    entryPoints: [join(src, "styles", "index.css")],
    bundle: true,
    minify: true,
    write: false,
    loader: { ".css": "css" },
  });
  const code = result.outputFiles[0].contents;
  const name = `styles.${fingerprint(code)}.css`;
  await writeFile(join(dist, name), code);
  return { name, bytes: code.byteLength };
}

/**
 * Rewrite the shell to point at the fingerprinted bundles and the real origin.
 * @param {string} jsName
 * @param {string} cssName
 */
async function writeShell(jsName, cssName) {
  const shell = await readFile(join(src, "index.html"), "utf8");
  const out = shell
    .replaceAll("%ORIGIN%", SITE.origin)
    .replace('href="styles/index.css"', `href="${cssName}"`)
    .replace('src="main.js"', `src="${jsName}"`);
  await writeFile(join(dist, "index.html"), out);
}

/** robots.txt, sitemap.xml and _headers, all derived from SITE. */
async function writeGenerated() {
  await writeFile(
    join(dist, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap.xml\n`,
  );

  // Hash routes are not separately indexable, so the sitemap lists the one URL
  // a crawler can actually fetch.
  await writeFile(
    join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE.origin}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
</urlset>
`,
  );

  // The bundle is an external file, so scripts need no 'unsafe-inline'.
  // Styles still do: templates set presentational one-offs with style="".
  const csp = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src https://fonts.gstatic.com",
    "img-src 'self' data:",
    "form-action 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
  ].join("; ");

  await writeFile(
    join(dist, "_headers"),
    `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
  Content-Security-Policy: ${csp}

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/app.*.js
  Cache-Control: public, max-age=31536000, immutable

/styles.*.css
  Cache-Control: public, max-age=31536000, immutable

/index.html
  Cache-Control: public, max-age=0, must-revalidate
`,
  );
}

/**
 * @param {{ name: string, bytes: number }} js
 * @param {{ name: string, bytes: number }} css
 */
async function report(js, css) {
  let total = 0;
  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else total += (await stat(full)).size;
    }
  };
  await walk(dist);

  const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
  console.log(`built ${relative(root, dist)}/`);
  console.log(`  ${js.name.padEnd(24)} ${kb(js.bytes)}`);
  console.log(`  ${css.name.padEnd(24)} ${kb(css.bytes)}`);
  console.log(`  total                    ${(total / 1024 / 1024).toFixed(2)} MB`);
}

await build();
