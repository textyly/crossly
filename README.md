# Crossly

**An open-source editor for designing and sharing cross-stitch patterns, built to help preserve traditional embroidery, in particular Bulgarian embroidery, as digital cultural heritage.**

> **Status: early development. Crossly is not runnable end to end yet.**
> The pieces below exist and run from source on a developer machine, but nothing is packaged, deployed or published. [`PLAN.md`](PLAN.md) shows what is done and what comes next.

Crossly is part of [textyly](https://github.com/textyly), a home for open-source projects about textile arts.

## What makes it different

- **Dots, not symbols.** Most pattern tools paint coloured squares or symbols on a grid. In Crossly you connect dots, each one a needle puncture point, so a pattern records how the thread actually moves through the fabric.
- **Front and back at once.** Because thread paths are recorded, the editor can show the front of the fabric and the back (where the thread travels between stitches) side by side while you work.
- **Stitch-agnostic data model.** A pattern stores ordered needle paths as coordinates, not named stitches. The same data can drive front and back rendering, animation and later analysis, and it is not tied to one embroidery tradition.

The ideas are described in the papers in [`crossly.academic.papers`](https://github.com/textyly/crossly.academic.papers) and the data model in [`crossly.data.model`](https://github.com/textyly/crossly.data.model).

## Repositories

Crossly is a family of repositories. Status key: 🚧 in progress (runs from source, not yet packaged), 📋 planned (scaffold only), 📄 reference (specification, papers or a superseded implementation).

| Repository | What it is | Status |
|---|---|---|
| [`crossly.ui`](https://github.com/textyly/crossly.ui) | Web editor with dual front and back view | 🚧 |
| [`crossly.client.auth.service`](https://github.com/textyly/crossly.client.auth.service) | Guest sessions and Google sign-in; issues the stable client identity | 🚧 |
| [`crossly.client.preferences.service`](https://github.com/textyly/crossly.client.preferences.service) | Per-client UI preferences | 🚧 |
| [`crossly.private.persistence.service`](https://github.com/textyly/crossly.private.persistence.service) | Saves and loads each client's own patterns | 🚧 |
| [`crossly.data.model`](https://github.com/textyly/crossly.data.model) | JSON pattern data model | 📄 |
| [`crossly.academic.papers`](https://github.com/textyly/crossly.academic.papers) | Research papers | 📄 |
| [`crossly.persistence.service`](https://github.com/textyly/crossly.persistence.service) | Original .NET patterns service, superseded | 📄 |
| [`crossly.ai.chat.service`](https://github.com/textyly/crossly.ai.chat.service) | AI guidance for embroidery | 📋 |
| [`crossly.feedback.publishing.service`](https://github.com/textyly/crossly.feedback.publishing.service) | Pattern publication and moderation | 📋 |
| [`crossly.system.settings.service`](https://github.com/textyly/crossly.system.settings.service) | Global settings and feature flags | 📋 |

The machine-readable list is [`repos.json`](repos.json). To clone the active repositories next to this README:

```bash
node scripts/bootstrap.mjs --dry-run   # preview
node scripts/bootstrap.mjs             # clone them
```

## Roadmap

In short: make every service container-ready, publish images, package Crossly so it runs with one command on a laptop or on any Kubernetes cluster, then put a public test instance online. Details and progress are in [`PLAN.md`](PLAN.md); the reasoning behind major choices is in [`docs/decisions/`](docs/decisions/).

## Working with AI assistants

This repository is meant to be explored with an AI coding assistant. [`AGENTS.md`](AGENTS.md) holds the project rules and architecture notes, and guided onboarding skills will be added as the project becomes runnable. Everything is plain Markdown, so you can read it without any assistant. Assistants working on this project must never commit or push without showing you the changes and getting your explicit "yes".

## Research and funding

Crossly is developed as part of doctoral research at the Technical University of Gabrovo, Bulgaria, with support from the Bulgarian Ministry of Education and Science. See [`CITATION.cff`](CITATION.cff) to cite the project.

## Contributing

Issues and discussion are welcome. A contribution guide will be added once the project can be run end to end.

## License

[Apache License 2.0](LICENSE)
