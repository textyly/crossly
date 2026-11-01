#!/usr/bin/env node
// Clones the Crossly repositories listed in repos.json into this folder.
//
//   node scripts/bootstrap.mjs               clone every repo marked "bootstrap": true
//   node scripts/bootstrap.mjs --all         clone every listed repo, including planned ones
//   node scripts/bootstrap.mjs --dry-run     only print what would be cloned
//   node scripts/bootstrap.mjs --only a,b    clone just the named repos
//
// Requires Node 18+ and git. Existing folders are never modified.

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const all = args.includes("--all");
const onlyIdx = args.indexOf("--only");
const only = onlyIdx >= 0 ? (args[onlyIdx + 1] ?? "").split(",").filter(Boolean) : undefined;

const unknown = args.filter((a, i) =>
    !["--dry-run", "--all", "--only"].includes(a) && !(onlyIdx >= 0 && i === onlyIdx + 1));
if (unknown.length > 0) {
    console.error(`Unknown argument(s): ${unknown.join(" ")}`);
    process.exit(2);
}
if (onlyIdx >= 0 && !only?.length) {
    console.error("--only needs a comma-separated list of repository names.");
    process.exit(2);
}

const manifest = JSON.parse(readFileSync(join(root, "repos.json"), "utf8"));
const safeName = /^[a-z0-9][a-z0-9._-]*$/;

for (const repo of manifest.repos) {
    if (!safeName.test(repo.name)) {
        console.error(`Refusing unsafe repository name in repos.json: ${repo.name}`);
        process.exit(2);
    }
}

if (only) {
    const known = new Set(manifest.repos.map((r) => r.name));
    const missing = only.filter((n) => !known.has(n));
    if (missing.length > 0) {
        console.error(`Not in repos.json: ${missing.join(", ")}`);
        process.exit(2);
    }
}

const selected = manifest.repos.filter((r) =>
    only ? only.includes(r.name) : all || r.bootstrap);

let failed = 0;
for (const repo of selected) {
    const target = join(root, repo.name);
    const url = `https://github.com/${manifest.organization}/${repo.name}.git`;

    if (existsSync(target)) {
        console.log(`skip   ${repo.name} (folder already exists, left untouched)`);
        continue;
    }
    if (dryRun) {
        console.log(`would  git clone --branch ${repo.branch} ${url}`);
        continue;
    }

    console.log(`clone  ${repo.name}`);
    const result = spawnSync("git", ["clone", "--branch", repo.branch, url, target], { stdio: "inherit" });
    if (result.status !== 0) {
        console.error(`failed ${repo.name}`);
        failed++;
    }
}

if (failed > 0) {
    console.error(`${failed} clone(s) failed.`);
    process.exit(1);
}
console.log(dryRun ? "Dry run complete; nothing was cloned." : "Done.");
