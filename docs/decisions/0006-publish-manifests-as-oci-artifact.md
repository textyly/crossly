# 0006: Publish the deployment manifests as a versioned OCI artifact

**Status:** Accepted

## Context

[Decision 0003](0003-pull-based-deployment.md) has the cluster pull new versions instead of CI pushing into it. A pulling controller still needs an answer to one question: what is the latest version that is safe to run?

The obvious answers each have a flaw:

- **Follow the `main` branch.** A merge can reach the cluster before CI has built the images it refers to, or without them ever being built if the build fails. Manifests and images are published at different moments.
- **Watch the image registry and write the new tag back to Git.** This puts a write credential on the cluster, fills the history with automated commits that nobody reviewed, and only covers images. A change to the manifests themselves, such as a new service or setting, still travels the branch route above.
- **Have CI commit the new tag to `main`.** This also adds automated commits, needs permission to push to a protected branch, and must avoid triggering itself.

## Decision

When tests pass on `main`, one CI job publishes both the container images and an OCI artifact in the same registry. The artifact holds the rendered contents of `deploy/k8s`, with every image reference pinned to the tag (or digest) that job just built. It is tagged with the same version as the images, and a moving tag marks the newest one.

Consumers pull the artifact. Any OCI-aware tool can do it, for example a GitOps controller with an OCI source (Flux, Argo CD) or a plain `oras pull` followed by `kubectl apply -k`.

The manifests in the artifact stay environment-neutral. Whoever deploys them applies their own differences, such as the public hostname, as a patch on their side.

## Consequences

- Manifests and images are published together or not at all. A deployment never refers to an image that does not exist, and a failed build publishes nothing, so consumers stay on the last good version.
- The consumer needs read access to a public registry and nothing else. No credential is stored on the cluster or written into a repository, and Git history holds only reviewed changes.
- Each version is immutable and identified by a digest, so rollback is pulling an earlier version, and signatures can be added later without changing the flow.
- A cluster that is offline during a merge catches up to the newest published version when it starts, as decision 0003 describes.
- The same mechanism carries a Helm chart later, with `edge` and `stable` channels, instead of a second delivery path.
- CI gains a rendering and publishing step, and pins image references when it publishes. The default tag in `deploy/k8s/kustomization.yaml` stays a known-good value for a local trial.
