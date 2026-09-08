import { access, readFile, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const indexPath = path.join(dist, "index.html");
const budgets = {
  html: 20 * 1024,
  css: 70 * 1024,
  javascript: 240 * 1024,
  initialGzip: 90 * 1024,
};

await access(indexPath);
const html = await readFile(indexPath, "utf8");
const referencedAssets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((reference) => reference.startsWith("/assets/"));

if (referencedAssets.length === 0) {
  throw new Error("No built CSS or JavaScript assets were referenced by dist/index.html.");
}

if (/\.(?:mp4|webm|mov)(?:[?#]|$)/i.test(html)) {
  throw new Error("dist/index.html eagerly references video media.");
}

const totals = { html: Buffer.byteLength(html), css: 0, javascript: 0, initialGzip: 0 };
totals.initialGzip += gzipSync(html).byteLength;

for (const reference of referencedAssets) {
  const assetPath = path.join(dist, reference.slice(1));
  await access(assetPath);
  const assetStats = await stat(assetPath);
  const contents = await readFile(assetPath);
  totals.initialGzip += gzipSync(contents).byteLength;
  if (reference.endsWith(".css")) totals.css += assetStats.size;
  if (reference.endsWith(".js")) totals.javascript += assetStats.size;
}

for (const [name, budget] of Object.entries(budgets)) {
  const actual = totals[name];
  if (actual > budget) {
    throw new Error(`${name} budget exceeded: ${actual} bytes > ${budget} bytes.`);
  }
}

const kib = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;
console.log("Initial page budgets passed");
console.log(`  HTML: ${kib(totals.html)} / ${kib(budgets.html)}`);
console.log(`  CSS: ${kib(totals.css)} / ${kib(budgets.css)}`);
console.log(`  JavaScript: ${kib(totals.javascript)} / ${kib(budgets.javascript)}`);
console.log(`  Initial gzip: ${kib(totals.initialGzip)} / ${kib(budgets.initialGzip)}`);
