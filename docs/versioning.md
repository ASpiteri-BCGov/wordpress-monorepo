# Tagging and versioning conventions

## Tag format

Release tags must match the workflow filter in `tag.yml` (`**/v*`) and encode both the **Nx project name** and **semver**:

```text
<nx-project-name>/v<semver>
```

**Rules:**

- `<nx-project-name>` must be the **exact** Nx project name (`npx nx show projects`). Example: `bcgov-wordpress-blocks`.
- `<semver>` is prefixed with `v` in the tag. Examples: `v1.0.0`, `v1.1.0-a1` (Composer-compatible prerelease segments are allowed when `tag.yml` and Composer both accept them).
- Invalid examples:
    - Wrong project slug not in Nx graph
    - Non-semver suffixes such as `v100-testing-tag` for production consumption

The workflow strips the leading `v` for the version recorded in `packages.json` while keeping the full tag for GitHub Release URLs.

## Branch naming

Use descriptive, lowercase, hyphenated branches:

| Prefix | Use |
| --- | --- |
| `feature/` | New functionality |
| `fix/` or `bugfix/` | Defect fixes |
| `chore/` | Tooling, housekeeping |
| `docs/` | Documentation only |

Examples: `feature/add-hero-block`, `fix/wp-env-port-conflict`.

**Default branch:** `main` — PRs usually target `main`; `nx.json` sets `defaultBase` to `origin/main` for local `nx affected` comparisons.

## Releases and prereleases

`tag.yml` currently marks GitHub Releases as **prerelease** (`prerelease: true` in the workflow). Adjust workflow YAML when the program moves to stable release semantics.

## WordPress version on release

When **`tag.yml`** runs for a tag like `bcew-theme-2/v1.4.0`:

1. The workflow parses the tag into project name (`bcew-theme-2`) and version (`1.4.0`).
2. Source files in the repository are **not** modified.
3. The release **`dist.zip`** gets the version field updated to match the tag (including prerelease segments such as `1.0.0-alpha.5`):
   - **Theme** — `Version:` line in `style.css`
   - **Plugin** — `* Version:` line in `<nx-project-name>.php`
4. That updated file exists only inside **`dist.zip`** attached to the GitHub Release.

You do not need to edit the version by hand before tagging. The placeholder in source (e.g. `1.0.0`) can stay as-is.

**Requirement:** The tagged commit must include `.github/scripts/prepare-release-zip.sh` and the updated `tag.yml` **Zip Artifacts** step. Tags pushed before that workflow landed (for example from `main` without merging the auto-version change) still produce a zip, but the WordPress header stays at the source placeholder.

## Communicating version bumps

- Document breaking changes in package `docs/` or changelog files as agreed by the team.
