# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Component and routing tests (`Index`, `FilterPanel`, `TopProducts`, `AppRoutes`,
  `ErrorBoundary`) and a contract fixture `src/test/fixtures/relatorio.json`;
  43 tests, ~90% statement coverage with an 80% threshold enforced in CI (#1).
- Dependabot (npm weekly, GitHub Actions monthly), a weekly `npm audit`
  workflow, CodeQL default setup and secret scanning with push protection (#1).
- `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1), `AGENTS.md` and the `docs/`
  guides: architecture, development, testing, release process, maintenance.
- `npm run typecheck` and `npm run test:coverage` scripts.

### Changed

- TypeScript `strict` mode enabled across the app (#1).
- Vendor code (React, Recharts, Framer Motion) is split into cacheable chunks;
  the application chunk went from 919 kB to 46 kB (#1).
- Toolchain upgraded: Vite 8, Vitest 5, react-router-dom 7,
  `@vitejs/plugin-react` (#1).
- `NotFound` uses the router link and no longer logs to the console.
- CONTRIBUTING rewritten with branch, commit and review rules.

### Removed

- 41 unused shadcn/ui components, the toast/tooltip/sonner providers, the
  react-query provider, `NavLink` and unused hooks; 36 unused runtime
  dependencies (#1).

### Security

- `npm audit`: 25 findings (1 critical, 17 high) fixed; 0 remaining (#1).

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

[Unreleased]: https://github.com/grupomg-tech/dashreforma/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/grupomg-tech/dashreforma/releases/tag/v0.1.0
