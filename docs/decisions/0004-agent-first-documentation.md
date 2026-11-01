# 0004: Agent-first documentation, with scripts as the source of truth

**Status:** Accepted

## Context

Newcomers should be able to clone Crossly and be guided through running, testing and developing it. Long prose documentation goes stale, and instructions that an AI assistant improvises step by step are unreliable.

## Decision

- Keep the README short and readable by people.
- Put project rules and architecture notes in `AGENTS.md` (with `CLAUDE.md` importing it), so the content is not tied to one assistant.
- Write onboarding as skills that wrap real scripts. The scripts do the work and can be run by hand; the skills say when to run them and how to check the result.
- Exercise those scripts in CI, so the instructions fail loudly when they rot.
- Review changes to `AGENTS.md` and skill files like code, because they influence what contributors' assistants run.

## Consequences

- Everything works without an AI assistant; the assistant is an accelerator, not a dependency.
- Skills are written after the scripts they wrap exist, so early versions are intentionally minimal.
- Skill content that merely repeats what the code already shows is avoided.
