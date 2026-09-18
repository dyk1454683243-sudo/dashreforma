# Maintenance

Routine that keeps the project healthy between feature work.

## Weekly

- **Dependabot PRs** (Mondays, `dependencies` label): read the grouped
  changelogs, let CI run, merge when green. For major bumps of Vite, Vitest,
  React or react-router-dom, run the demo locally before merging. `react`,
  `react-dom`, `@types/react` and `@types/react-dom` must move together:
  Dependabot may bump only one of them, which breaks `npm ci` (see #15).
- **Security workflow**: `npm audit --audit-level=high` runs every Monday and on
  every PR. A failure blocks merging until the dependency is updated or the
  advisory is assessed and documented in the PR.
- **CodeQL**: default setup scans JavaScript/TypeScript on every push to `main`.
  Triage alerts under *Security → Code scanning*.

## On every pull request

- CI must pass: lint, type check, tests with coverage thresholds, build.
- Review the diff against the design rules in [architecture.md](architecture.md).
- Contract changes (`src/lib/api-types.ts`) require an updated fixture and
  README section.

## Issue triage

Labels in use: `bug`, `enhancement`, `documentation`, `tests`, `security`,
`dependencies`, `ci`, `tax-rules`, `good first issue`, `help wanted`.

- Reproduce bugs in demo mode first (`?demo=1`); if it does not reproduce, ask
  for a redacted sample of the backend response.
- Tax-rule questions are labelled `tax-rules` and need a legal reference before
  implementation.

## Secrets and data

The repository has no secrets. Secret scanning and push protection are enabled.
Never commit real company data: fixtures must be fictional (see
`src/lib/demo.ts`).
