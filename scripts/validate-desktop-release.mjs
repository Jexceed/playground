import { appendFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const stableSemverPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function parseArguments(argv) {
  const options = {
    root: process.cwd(),
    tag: process.env.RELEASE_TAG,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--") {
      continue;
    }

    if (argument === "--root" || argument === "--tag") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${argument}`);
      }

      options[argument.slice(2)] = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${argument}`);
  }

  if (!options.tag) {
    throw new Error("Missing release tag; pass --tag v<major>.<minor>.<patch>");
  }

  return options;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function readCargoPackageVersion(path) {
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  let inPackageSection = false;

  for (const line of lines) {
    if (/^\s*\[package\]\s*$/.test(line)) {
      inPackageSection = true;
      continue;
    }

    if (inPackageSection && /^\s*\[/.test(line)) {
      break;
    }

    if (inPackageSection) {
      const versionMatch = line.match(/^\s*version\s*=\s*"([^"]+)"\s*$/);
      if (versionMatch) {
        return versionMatch[1];
      }
    }
  }

  throw new Error(`Could not find [package] version in ${path}`);
}

function validateRelease({ root, tag }) {
  const absoluteRoot = resolve(root);
  const versions = {
    "package.json": readJson(resolve(absoluteRoot, "package.json")).version,
    "tauri.conf.json": readJson(
      resolve(absoluteRoot, "src-tauri", "tauri.conf.json"),
    ).version,
    "Cargo.toml": readCargoPackageVersion(
      resolve(absoluteRoot, "src-tauri", "Cargo.toml"),
    ),
  };
  const uniqueVersions = new Set(Object.values(versions));

  if (uniqueVersions.size !== 1) {
    throw new Error(
      `Version mismatch: ${Object.entries(versions)
        .map(([source, version]) => `${source}=${version}`)
        .join(", ")}`,
    );
  }

  const [version] = uniqueVersions;
  if (!stableSemverPattern.test(version)) {
    throw new Error(`Source version ${version} must be a stable semantic version`);
  }

  if (!/^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(tag)) {
    throw new Error(
      `Release tag ${tag} must use v<major>.<minor>.<patch> with no suffix`,
    );
  }

  if (tag !== `v${version}`) {
    throw new Error(`Release tag ${tag} does not match source version ${version}`);
  }

  return { tag, version, versions };
}

try {
  const result = validateRelease(parseArguments(process.argv.slice(2)));

  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `tag=${result.tag}\nversion=${result.version}\n`,
    );
  }

  console.log(`Desktop release version validated: ${result.tag}`);
  console.log(JSON.stringify(result.versions));
} catch (error) {
  console.error(`Desktop release validation failed: ${error.message}`);
  process.exitCode = 1;
}
