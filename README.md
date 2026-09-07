# AM-Bench Website

This repository publishes the AM-Bench project website at
<https://ambench.github.io/>.

The repository root currently publishes a minimal coming-soon page. Public
MkDocs source is stored in `docs/` and is published at
<https://ambench.github.io/docs/>. This repository is the authoritative source
for the deployed documentation site.

GitHub Actions builds both surfaces into one Pages artifact:

- `/` contains the coming-soon page;
- `/docs/` contains generated technical documentation.

Do not commit generated `_site/` output.
