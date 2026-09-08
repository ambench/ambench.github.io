# AM-Bench Website

The React/TypeScript homepage and public documentation live in this repository.
GitHub Pages builds the homepage with Vite and the authoritative `docs/` source
with Zensical, serving them at `/` and `/docs/` respectively.

```bash
npm ci
npm run dev
npm run verify:build
```

For a complete local preview, build the homepage, then run the documentation
build using the versions pinned in `.github/workflows/pages.yml`:

```bash
python -m pip install "zensical==0.0.58"
zensical build --strict
mv site dist/docs
npm run preview
```

The Vite development server serves only the homepage. Use the complete build
above to verify documentation routing. Do not commit generated `dist/` output.

Website clips and posters live in `public/static/publication/`; figures and
identity assets live in `public/static/images/`. Asset attribution and media
qualifications are recorded in `ASSET_SOURCES.md`.

Validate the public media references with:

```bash
node scripts/verify-publication-media.mjs
```
