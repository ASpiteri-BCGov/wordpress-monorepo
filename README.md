# WordPress Monorepo

This repository contains WordPress themes and plugins managed within a single Git monorepo.
The primary goals are consistency, shared tooling, and safer long-term maintenance while preserving historical context.

## Getting started

### Requirements

The following should be installed before starting the next section:

- [Node.js](https://nodejs.org/en/download/current)
- [pnpm](https://pnpm.io/installation#using-other-package-managers)
- [PHP 7.4](https://www.php.net/downloads.php)
- [Composer](https://getcomposer.org/doc/00-intro.md#installation-linux-unix-macos)
- Docker (preferably [Rancher Desktop](https://rancherdesktop.io/))

### Steps

1. Clone this repository: `git clone https://github.com/bcgov/wordpress-monorepo`.
1. Navigate to the repository: `cd wordpress-monorepo`.
1. Install npm dependencies: `pnpm i`.
1. Install monorepo-level Composer dependencies: `composer i`.
1. Install project-level Composer dependencies and build autoload files: `pnpm composer-install`.
1. Build all projects: `pnpm build`.
1. Serve the desired project(s) by running `npx nx wp-env-start` from their subdirectories.

## Usage

### Monorepo-level scripts

Monorepo-level scripts are found in the root `package.json` file. These scripts run on the entire monorepo, rather than on a specific project and are run using `pnpm`, eg. `pnpm build` runs the build script on all projects. These fall into two categories:

1. Scripts that wrap an nx target. These are using nx targets (see [below for information about nx targets/scripts](#project-level-scripts)) to run the same script on all targets simultaneously. The underlying command typically has the format: `npx nx run-many -t <target>`. This says: use `npx` to run `nx`'s `run-many` command (causes the command to be run on all projects that support the target) on the given `<target>`.
1. npm-native scripts. These are npm-native scripts that are used to run monorepo-wide scripts that don't use nx at all, mainly linting scripts as linting is performed at the monorepo-level as opposed to the project-level.

#### List of monorepo-level scripts

Usage example:

- `pnpm build` from monorepo root. Runs the `build` target on all projects.

| Script | Description | Type |
| --- | --- | --- |
| composer-install | Installs Composer dependencies and builds autoload files for all projects. | nx |
| build | Builds all projects using [`wp-scripts build`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#build). | nx |
| start | Starts all projects using [`wp-scripts start`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#start). | nx |
| test-e2e | Runs e2e tests on all projects using [`wp-scripts test-playwright`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#test-playwright). | nx |
| test-integration | Runs PHP integration tests on all projects through `wp-env`, running the `composer test` script from each project's `composer.json`. These tests use `phpunit`. | nx |
| test-screenshot | Runs regression/screenshot tests on all projects using [`wp-scripts test-playwright`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#test-playwright). This currently generates and saves new screenshots as it's not yet possible to generate consistent screenshots between local dev machines and GitHub runners. In the future, this should only perform the tests comparing screenshots, not save new ones. | nx |
| test-unit-js | Currently unimplemented as we don't yet have any unit tests to run. In the future, this should run JavaScript unit tests on all projects using [`wp-scripts test-unit-js`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#test-unit-js). | nx |
| test-unit-php | Currently unimplemented as we don't yet have any unit tests to run. In the future, this should run PHP unit tests on all projects using `phpunit`. | nx |
| lint | Convenience script to run all lint scripts below sequentially. | npm |
| lint-js | Lints all JS and TS code across the monorepo using [`wp-scripts lint-js`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#lint-js). | npm |
| fix-js | Runs the above script with the `--fix` flag to fix any automatically fixable linting issues. | npm |
| lint-css | Lints all SCSS and CSS code across the monorepo using [`wp-scripts lint-style`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#lint-style). | npm |
| fix-css | Runs the above script with the `--fix` flag to fix any automatically fixable linting issues. | npm |
| lint-php | Lints all PHP code across the monorepo using the root `composer.json`'s `lint-php` script. This linting uses `phpcs`. | npm |
| fix-php | Runs the above script with using `phpcbf` to fix any automatically fixable linting issues. | npm |
| fix-html | Fixes all HTML linting issues across the monorepo using `js-beautify`. Note that there is no equivalent linting script for HTML currently. | npm |
| lint-md | Lints all JS and TS code across the monorepo using [`wp-scripts lint-md-docs`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#lint-md-docs). | npm |
| fix-md | Runs the above script with the `--fix` flag to fix any automatically fixable linting issues.| npm |
| lint-pkg-json | Lints all `package.json` files across the monorepo using [`wp-scripts lint-pkg-json`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#lint-pkg-json). | npm |
| check-engines | Runs [`wp-scripts check-engines`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#check-engines). Note that this is currently failing to execute. | npm |
| check-licenses | Runs [`wp-scripts check-licenses`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#check-licenses). | npm |
| wp-env-clean | Runs [`wp-env reset`](https://github.com/WordPress/gutenberg/tree/HEAD/packages/env#wp-env-reset-environment) on all projects. | nx |

### Project-level scripts

Project-level scripts are defined in the root-level `nx.json` file's `defaultTargets` array and are run on a specific project. These scripts (will be referred to as targets going forward to match nx terminology) are run using nx, eg. `npx nx build` will run the build target on the current project (if the current working directory is an nx project). Generally, all of the information about a target is found in `nx.json` and plugins and themes implement a subset of those `defaultTargets`. The targets that a specific project has implemented is defined in its `project.json` file's `targets` array.

Note that in most cases if a project does not have a particular target defined in its `targets` array, it will simply not run the target for that project and will not cause any errors.

#### List of project-level targets

Usage examples:

- `npx nx build` from inside an nx project directory, runs the `build` target on the current project only.
- `npx nx run <project name>:build` from anywhere in the monorepo. Runs on the specified `<project name>` only. See [nx run documentation](https://nx.dev/docs/reference/nx-commands#nx-run).
- `npx nx run-many -t build` from anywhere in the monorepo. This runs on all projects, similar to the `pnpm build` script above. See [nx run-many documentation](https://nx.dev/docs/reference/nx-commands#nx-run-many).
- `npx nx affected -t build` from anywhere in the monorepo. This runs on only "affected" projects. This is used, for example, in the `pr.yml` workflow. See [nx affected documentation](https://nx.dev/docs/reference/nx-commands#nx-affected).

| Target | Description | Plugins | Themes |
| --- | --- | --- | --- |
| composer-install | Installs Composer dependencies and builds autoload files for all projects. | ☑️ | ☑️ |
| build | Builds the project using [`wp-scripts build`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#build). | ☑️ | ☑️ |
| start | Starts the project using [`wp-scripts start`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#start). | ☑️ | ☑️ |
| test-e2e | Runs e2e tests on the project using [`wp-scripts test-playwright`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#test-playwright). | ☑️ | |
| test-integration | Runs PHP integration tests on the project through `wp-env`, running the `composer test` script from the project's `composer.json`. These tests use `phpunit`. | ☑️ | |
| test-screenshot | Runs regression/screenshot tests on the project using [`wp-scripts test-playwright`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#test-playwright). This currently generates and saves new screenshots as it's not yet possible to generate consistent screenshots between local dev machines and GitHub runners. In the future, this should only perform the tests comparing screenshots, not save new ones. | ☑️ | ☑️ |
| wp-env-start | Runs [`wp-env start`](https://github.com/WordPress/gutenberg/tree/HEAD/packages/env#wp-env-start) on the project. | ☑️ | ☑️ |
| wp-env-clean | Runs [`wp-env reset`](https://github.com/WordPress/gutenberg/tree/HEAD/packages/env#wp-env-reset-environment) on the project. | ☑️ | ☑️ |

## Documentation Site

This monorepo uses a single VitePress site rooted at `docs/`.

- Start local docs: `pnpm docs:dev`
- Build docs: `pnpm docs:build`
- Preview build: `pnpm docs:preview`

Package-level docs should live close to code:

- `plugins/<slug>/docs/`
- `themes/<slug>/docs/`

Those docs are synchronized into the VitePress site before dev/build runs.

## Nx

This repository uses `nx` for various monorepo-related tasks:

1. Calculating project graph and affected projects
   - A project dependency graph is automatically calculated by `nx`, for example, child themes would be dependent on their parent theme such that any change to the parent theme code causes its child themes to have the build/test pipeline run on them (see `.github/workflows/`). We can use the `nx show projects --affected` command to get the list of projects affected by changes in the current branch.
2. Task orchestration and caching
   - Tasks (eg. `npm` scripts) can be run easily for many projects using commands like `nx run-many -t build` which will cause all projects with an `npm` `build` script to run in parallel. Results of the above command will also be cached and stored in `.nx/cache` so that if the same command is run again without changes to the underlying source files, the command will finish immediately using the cached result.
3. Repository importing
   - The process of importing a new plugin or theme into the monorepo can be done using the `nx import` command, given a repository and a monorepo path.
4. Release process (eventually)
   - The process of releasing a version of a plugin or theme may be able to be automated using the `nx release` command. More research is needed to determine how this might work.

See the [nx documentation](https://nx.dev/docs/getting-started/intro) for more information.

### Generating a new theme

Using the `nx generator` feature, we can easily create a new theme in the monorepo using the command:

```shell
npx nx generate monorepo-plugin:theme
pnpm install
```

Follow the on-screen instructions to generate a standalone or child theme that adheres to the current theme standards.

---

### Generating a new WordPress Block plugin

From the monorepo root, run the plugin generator and then install dependencies:

```shell
npx nx generate monorepo-plugin:plugin
pnpm install
```

During generation, the CLI will prompt for the plugin name and, optionally, a description.
Use those prompts to configure the plugin you want to scaffold.

The generator creates a new Block Plugin that follows the current monorepo plugin standards.

If `wp-env start` fails with `port is already allocated` (for example `8888`), run:

```shell
pnpm run wp-env:cleanup
```

---

## Contributing

### Adding an Existing Repository to the Monorepo

The example below assumes you are adding a theme and uses `example-theme` as a placeholder for the existing repository name.

> ⚠️ **Important**
> This process rewrites Git history. **Do not run it directly on the original repository.**

---

### Migration Process

#### Nx steps

##### 1. Run nx import command

```bash
npx nx import <git repo url> <destination path>
```

Then follow the on-screen wizard to finish the import.

Example:

```bash
npx nx import https://github.com/bcgov/design-system-wordpress-theme themes/design-system-wordpress-theme
```

---

#### Updating migrated plugins/themes to monorepo standard

1. Temporarily rename the directory of the new project, for example adding a `_` to the beginning.
    - This is so that the next step can run without causing issues with the directory already existing.
1. Run the relevant generator for the project type, for example `npx nx generator monorepo-plugin:theme` (or `monorepo-plugin:plugin`).
1. Provide the values to the generator that match the project, for example if the project's slug is `design-system-child-example`, provide that value to the generator as the slug.
1. Copy the contents of the directory the generator created into the imported project directory (the one we renamed in step 1).
    - We want the files to be overwritten with changes from the generator files.
    - You may need to do this outside of VSCode as it doesn't seem to allow overwriting of files by default.
1. Delete the generator-created directory.
1. Rename the imported directory back to its original name.
1. Go through the files changed using git and individually revert any changes that should not be overwritten, for example plugin/theme version should not be overwritten with the default `1.0.0` set by the generator, any sample files can be deleted.
1. Delete any unnecessary files, like files used for linting. List of files to be deleted:
    - .github/
    - dist/
    - .gitignore
    - .markdownlint*
    - CODEOWNERS
    - composer.lock
    - package.lock
1. Commit the above changes.
1. Run all relevant nx targets to ensure they are functioning. See `project.json` for the full list of targets.
1. Run linting to ensure linting passes for the imported project (`pnpm lint`).

---

## Release Policy

### Release Process

1. Push a tag conforming to the format: `<project name>/<semver>`
    - For example, `bcgov-wordpress-blocks/v1.1.0-a1` is valid because it contains a correct project name and a valid semver compatible with Composer.
    - `bcgov-fake-theme/v1.0.1` is not valid because `bcgov-fake-theme` is not a monorepo project.
    - `bcgov-wordpress-blocks/v100-testing-tag` is not valid because `v100-testing-tag` is not a valid semver.
1. The `tag.yml` workflow packages and indexes the new version. See the [workflows README for details](.github/workflows/README.md).
1. The package is now able to be consumed via Composer. The required `composer.json` configuration:

    ```json
    "repositories": [
        ...
        {
            "type": "composer",
            "url": "https://bcgov.github.io/wordpress-monorepo"
        }
    ],
    "require": {
        ...
        "<package name>": "<semver>"
    }
    ```

---

## Package Management

### npm Workspaces

This repository uses **npm workspaces** to manage JavaScript dependencies across themes and plugins.

```json
{
  "workspaces": ["themes/*", "plugins/*"]
}
```

This configuration:

- Treats each theme and plugin as an independent package
- Hoists compatible dependencies to a shared root `node_modules`
- Enables running scripts across all packages from the repository root

### Installing Dependencies

From the repository root:

```bash
pnpm install
```

This installs root tooling and all workspace dependencies. There is no need to run `pnpm install` inside individual packages.

---

### Plugins or Themes with Multiple Packages

Each directory containing a `package.json` is a separate workspace package and must be explicitly included.

Example:

```json
{
  "workspaces": [
    "themes/*",
    "plugins/*",
    "packages/*",
    // This would only be necessary if there were another nested package.json inside example-plugin/blocks/ but this should be avoided.
    "plugins/example-plugin/blocks/*"
  ]
}
```

---

## Shared Configuration and Tooling

To reduce duplication and configuration drift, this monorepo centralizes common tooling and configuration files at the repository root wherever possible. Themes and plugins consume these shared configurations rather than maintaining their own copies.

The goal is to keep packages lightweight while enforcing consistent standards across the ecosystem.

---

### What Is Centralized

The following files and directories are intended to live at the **monorepo root** and be reused by all themes and plugins:

#### Linting and Formatting

- `.eslint.*`
- `.markdownlint.*`
- `.prettierrc.js`
- `.stylelintrc`
- `phpcs.xml`

---

#### JavaScript / Build Tooling

- Shared `@wordpress/scripts` expectations
- Common overrides
- Root-level `package.json` scripts
- All linting (PHP, JS, CSS, etc.) is performed via the root `package.json` scripts

Themes and plugins should only add package-local build configuration when they have legitimate, product-specific needs.

---

#### Testing Infrastructure

- PHPUnit configuration
- Playwright configuration (`packages/e2e/playwright.config.js`)
- wp-env configuration (`.wp-env.json`)
- Shared test utilities and bootstrap files (under `packages/e2e/`)

Individual packages may define **minimal wrapper configs** that reference the shared setup.

---

#### Git Ignore

- Root `.gitignore` contains common patterns (e.g., `node_modules`, `vendor`, `build`, `dist` logs)
- Packages keep only `.gitattributes` files which control which files get exported during releases.
