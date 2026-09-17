# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] - 2026-09-17

First tagged release.

### Added

- Demo mode with a built-in fictional dataset (`?demo=1` or `VITE_DEMO=true`),
  so the dashboard runs without a backend; the rates chosen in the filter panel
  recalculate the simulation.
- "Ver com dados de exemplo" fallback when the API is unreachable.
- Live demo on GitHub Pages, deployed by CI.
- Typed API contract (`src/lib/api-types.ts`) and pure data-mapping functions
  (`src/lib/report.ts`) with unit tests.
- Configuration through environment variables (`VITE_API_URL`, `VITE_BASE`,
  `VITE_ROUTER_BASENAME`, `VITE_DEMO`).
- CI workflow (lint, type check, tests, build), contributing guide, security
  policy, issue and pull request templates.
- MIT license and project documentation.

### Changed

- Page title and metadata now describe the project instead of the template.
- Dashboard components are fully typed (no `any`).

[0.1.0]: https://github.com/grupomg-tech/dashreforma/releases/tag/v0.1.0
