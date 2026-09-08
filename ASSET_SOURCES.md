# Website asset sources

This file records the provenance of third-party identity assets used by the
AM-Bench project website. The files are kept local so the public site does not
depend on third-party image hosting.

## Typefaces

| Local files | Source | License |
| --- | --- | --- |
| `public/static/fonts/manrope-*.woff2` | [Manrope in Google Fonts](https://github.com/google/fonts/tree/main/ofl/manrope) | SIL Open Font License 1.1; copied to `public/static/fonts/LICENSE-manrope.txt`. |
| `public/static/fonts/dm-mono-*.woff2` | [DM Mono in Google Fonts](https://github.com/google/fonts/tree/main/ofl/dmmono) | SIL Open Font License 1.1; copied to `public/static/fonts/LICENSE-dm-mono.txt`. |

The font files are self-hosted to avoid a runtime dependency on Google Fonts.

## Simulator media

The 46 clips and matching posters in `public/static/publication/` illustrate
AM-Bench tasks, embodiments, physical effects, and policy comparisons.

The ACT Lemon Harvesting clip is a failed execution. DP and π₀.₅ Lemon Harvesting
clips show successful policy-generated trajectory replays. Policy–control demos
cover DP; the Push Slider MPC clip is a command-trace controller proxy.
Demonstration clips are illustrative and separate from the paper's aggregate statistics.

The twelve `*_variant_*.jpg` images illustrate task appearance, geometry, and
placement randomization.

## AM-Bench identity

`public/static/images/ambench-logo.svg` is the editable square master;
`favicon.svg` uses the same artwork, and `ambench-logo.png` is its 512-pixel
raster export for social-preview compatibility. Header and footer use the SVG.

- `public/static/images/system-architecture.png`: Figure 2 from AM-Bench, arXiv:2609.00641v1, https://arxiv.org/html/2609.00641v1/pipeline_6.png (CC BY 4.0). Display framing omits the source image’s blank lower margin; original file retained.
