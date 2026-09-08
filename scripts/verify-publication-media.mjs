import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = 'public/static/publication';
const files = await readdir(root, { recursive: true });
const clips = files.filter(name => name.endsWith('.mp4'));
if (!clips.length) throw new Error('No publication clips found');
const sourceFiles = ['src/data/benchmark.ts', 'src/data/effectSources.ts', 'src/data/rolloutSources.ts'];
const source = (await Promise.all(sourceFiles.map(name => readFile(name, 'utf8')))).join('\n');
const references = new Set([...source.matchAll(/\/static\/publication\/[^"'`\s]+\.mp4/g)].map(match => match[0]).filter(reference => !reference.includes("${")));
for (const reference of references) {
  for (const name of [reference, reference.replace(/\.mp4$/, '.jpg')]) {
    if (!(await stat(path.join('public', name))).size) throw new Error(`Empty media: ${name}`);
  }
}
for (const clip of clips) {
  if (!references.has(`/static/publication/${clip}`)) throw new Error(`Unreferenced clip: ${clip}`);
}
console.log(`Verified ${references.size} referenced clips and matching posters`);
