# 0001: A hub repository in front of separate service repositories

**Status:** Accepted

## Context

Crossly is several independently versioned pieces: an editor, backend services, a data model specification and research papers. Each already lives in its own repository. A visitor opening the organisation page sees a flat list of repositories with no entry point, and several are still empty scaffolds.

## Decision

Keep one repository per component, and add this repository (`crossly`) as the front door. It holds the overview, the plan, decision records, the repository manifest (`repos.json`), a bootstrap script that clones the family, and instructions for AI assistants. It is also the place that publications and citations point to.

## Consequences

- Components keep separate histories, versions and release cycles.
- A newcomer clones one repository and finds everything from there.
- The status shown in the README must be kept honest as components change; `repos.json` is the single source for that table.
