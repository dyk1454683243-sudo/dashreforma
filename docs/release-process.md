# Release process

Versions follow [Semantic Versioning](https://semver.org). While the project is
on `0.x`, minor versions may include breaking changes to the API contract; they
are always listed under **Changed** or **Removed** in the changelog.

## Checklist

1. `main` is green (CI, Security and CodeQL workflows).
2. Move the entries from `[Unreleased]` in `CHANGELOG.md` to a new section
   `## [x.y.z] - YYYY-MM-DD` and add the compare link at the bottom.
3. Bump `version` in `package.json`.
4. Open a PR named `release: vx.y.z` with those two files; merge it.
5. Tag the merge commit and push the tag:

   ```sh
   git checkout main && git pull
   git tag -a vx.y.z -m "vx.y.z"
   git push origin vx.y.z
   ```

6. Create the GitHub release from the tag, pasting the changelog section as the
   description and linking the live demo:

   ```sh
   gh release create vx.y.z --title "vx.y.z" --notes-file <(sed -n '/^## \[x.y.z\]/,/^## \[/p' CHANGELOG.md)
   ```

7. Verify that the Pages workflow redeployed the demo.

## What goes in a release

- **Patch (`0.1.x`)**: dependency updates, bug fixes, documentation.
- **Minor (`0.x.0`)**: new features, contract changes, removed options.
- **Major (`1.0.0`)**: when the API contract is considered stable.

## Changelog rules

- Written for users of the dashboard and of the contract, not for the author.
- Group entries under Added / Changed / Deprecated / Removed / Fixed / Security.
- Reference the PR number when there is one, e.g. `(#12)`.
