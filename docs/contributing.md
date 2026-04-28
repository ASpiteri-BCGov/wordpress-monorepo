# Contributing Docs

This page explains where to put docs and what your changes do in the site UI.

Run docs commands from the monorepo root:
`/Users/aspiteri/Development/wordpress-monorepo`

## Where to write docs

Keep docs beside the code they describe:

- Plugin docs: `plugins/<plugin-slug>/docs/`
- Theme docs: `themes/<theme-slug>/docs/`

Minimum per package:

- `index.md` (required)
- Optional extra pages such as `usage.md`, `faq.md`, `api.md`

Example:

```text
plugins/example-plugin/
  docs/
    index.md
    usage.md
```

## What changes appear where

- Add `docs/index.md` in a plugin or theme -> package appears in the left sidebar under `Plugins` or `Themes`.
- Add another markdown file (example `usage.md`) -> creates another page route for that package.
- Add a heading like `## Setup` in a page -> appears in the right-side "On this page" links as `Setup`.
- Rename a heading -> right-side "On this page" link text also changes.
- Remove a heading -> its right-side link disappears.

Note: only headings in page content (`##`, `###`, etc.) create "On this page" links. A normal bold line is not a heading.

## Do not edit generated docs

`docs/content/` is generated output.
Do not edit files there directly because they are replaced during sync.

## How `docs:sync` works

`pnpm docs:sync` runs `tools/sync-docs.mjs`.

It:

- deletes `docs/content/` (generated output)
- recreates `docs/content/`
- copies package docs from:
    - `plugins/<slug>/docs/**` -> `docs/content/plugins/<slug>/`
    - `themes/<slug>/docs/**` -> `docs/content/themes/<slug>/`

Why this exists:

- VitePress builds one site from `docs/`
- package docs are owned inside package folders
- sync combines both into one build input

## Safe workflow (step-by-step)

1. Edit docs only in `plugins/.../docs` or `themes/.../docs`
2. Start docs: `pnpm docs:dev` (runs sync automatically)
3. Check your package in the left sidebar
4. Open your page and check right-side "On this page" links
5. Commit source docs only (not generated `docs/content`)
