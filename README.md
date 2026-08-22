# AM-Bench Website

This repository publishes the AM-Bench project website at
<https://ambench.github.io/>.

The project homepage is maintained at the repository root. Public MkDocs source
is stored in `documentation/` and is published at
<https://ambench.github.io/docs/>. During pre-release development,
`documentation/` is synchronized from the current documentation branch in the
private development repository. The future `ambench/am_bench` release
repository will become the long-term source of truth.

GitHub Actions builds both surfaces into one Pages artifact:

- `/` contains the project homepage;
- `/docs/` contains generated technical documentation.

Do not commit generated `_site/` or `docs/` output.
