# CODEOWNERS

**Location:** .github/CODEOWNERS.md

**Purpose:**

- Defines the default code owners for the repository. GitHub uses this file to automatically request reviews from the specified owners when changes touch the matching paths.

**Current content:**

- `* @bcgov/digital-engagement-solutions-custom-web`
    - The `*` pattern means the `@bcgov/digital-engagement-solutions-custom-web` team is set as the owner for all files in this repository.

**How it works:**

- Each line has the format: `<pattern> <owner> [<owner> ...]`.
- `<pattern>` can be a file, directory, or glob pattern. Patterns are matched against changed files.
- `<owner>` is either a GitHub username (`octocat`) or a GitHub team (`@org/team-name`).
- When a pull request modifies files that match a pattern, GitHub will automatically request reviews from the listed owners.

**Examples:**

- `docs/ @some-team` — all files under `docs/` are owned by `@some-team`.
- `*.js @frontend-team` — all `.js` files are owned by `@frontend-team`.

**To change owners:**

1. Edit `.github/CODEOWNERS` and add or update patterns and owners.
2. Commit and push your branch; open a PR to have the change reviewed.
3. Ensure the owner you add exists in the GitHub organization (teams must be in the same org).

**Notes & best practices:**

- Use team handles (e.g., `@org/team`) when possible so membership is managed centrally.
- Keep patterns specific when you want different owners for different areas.
- Consider adding per-package or per-plugin entries to make review assignment more focused.

**Reference:** <https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners>
