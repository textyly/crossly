---
name: crossly-onboard
description: Orient a newcomer to Crossly and route them to the right next step (understand the project, run it, develop it, deploy it, or contribute a pattern). Use when someone has just cloned the Crossly repository or asks how to get started.
---

# Crossly onboarding

First be honest about where the project stands, then find out what the person wants.

## 1. State the current status

Read `PLAN.md` and tell the person the current focus and which phases are done. Crossly does not run end to end yet, so never promise a one-command start. Say what does exist: the editor and three backend services run from source on a developer machine.

## 2. Ask what they want to do

Offer these, and let them pick:

1. **Understand the project.** Walk through `README.md`, then `docs/decisions/`. For the architecture, point at the papers in the `crossly.academic.papers` repository and the data model in `crossly.data.model`.
2. **Run or develop the editor or a service.** Preview the repositories with `node scripts/bootstrap.mjs --dry-run`, and clone them with `node scripts/bootstrap.mjs` after the person agrees. Then open the chosen repository and read its `package.json` scripts and README. Do not guess commands that are not there.
3. **Deploy it, or work on CI/CD.** Not available yet. Explain the delivery slices in `PLAN.md`, and for the actual work use the `crossly-delivery` skill.
4. **Contribute a pattern.** Not available yet. Planned for phase 6.

## 3. Follow the project rules

Apply the rules in `AGENTS.md`: never commit or push without showing the changes for review and getting an explicit "yes", ask before touching databases, never put secrets in files, and read a file before deleting it.

## Not yet written

Skills for running, testing, developing and deploying will be added once the scripts they wrap exist and are exercised by CI (see decision 0004).
