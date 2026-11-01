# Crossly: instructions for AI assistants

Crossly is an open-source cross-stitch pattern editor for preserving traditional embroidery as digital cultural heritage. This repository is the front door: it holds the plan, decision records and a manifest of the other repositories. Read `README.md` and `PLAN.md` first.

## Current state

Nothing runs end to end yet. The editor and three backend services run from source on a developer machine; there are no Dockerfiles, packaged releases or deployments. Do not invent run or deploy commands. Look at the `scripts` section of each repository's `package.json`, and say so if something is missing or unclear.

## Repositories

`repos.json` lists every repository, its role and its status. `node scripts/bootstrap.mjs --dry-run` previews cloning them next to this file; cloned folders are git-ignored here. Each one is its own git repository.

## Delivery work

For CI, Dockerfiles, deployment or the test instance, follow `.claude/skills/crossly-delivery/SKILL.md`. It is plain Markdown, so any assistant can read it, not only Claude. The plan is delivered in vertical slices (see `docs/decisions/0005-deliver-in-vertical-slices.md`); the current slice is in `PLAN.md`.

## Rules

- Never commit secrets: keys, tokens, `.env` files, OAuth client secrets. Describe how to supply them instead.
- **Never commit or push on your own.** Show the changes for review first (a diff or a clear summary), and commit or push only after the maintainer gives an explicit "yes" for that specific commit or push. Approval for one commit or push does not carry over to the next. Leave changes uncommitted until then.
- Ask before applying database migrations, or running anything against a developer's database. The authentication service migrates on startup.
- Read a file before deleting or replacing it. Treat utilities that look unused as intentional until proven otherwise.
- Contract packages (`@textyly/...-contracts`) are published from each service's `contracts/` folder, never from the service root. Service roots are marked `"private": true` to prevent this mistake.
- Changes to this file, to `CLAUDE.md` and to anything under `.claude/skills/` need human review like code, because they steer other people's assistants.

## Architecture rules worth knowing

- **Virtual versus drawing canvases.** In the editor, a virtual canvas holds all geometry and state and never draws. A drawing canvas only renders what the virtual canvas notifies it about and knows nothing about grid maths. Keep that separation.
- **Pattern data model.** A pattern is an ordered list of needle paths, each a sequence of integer dot indexes, not named stitches. The fine grid has `2 * columns - 1` by `2 * rows - 1` dots; even indexes are visible holes and odd indexes are hidden ones.
- **Identity.** A client has one immutable identifier, equal to the session token's `sub`. Downstream services receive only that identifier and do not know whether the client is a guest or signed in. The session is an httpOnly cookie; do not move tokens into JavaScript-readable storage.
- **APIs** live under `/api/v1/<service>`.
- **TypeScript services** use ES modules, so relative imports end in `.js`. Tests use mocha and chai.

## Keep this file short

Record durable facts and rules, not history or what the code already shows.
