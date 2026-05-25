#!/usr/bin/env node

/**
 * Validates a version string against semantic versioning (Composer-compatible)
 * Uses JavaScript RegExp (ECMAScript syntax)
 */

const version = process.argv[2];

if (!version) {
  console.error('Usage: validate-semver.mjs <version>');
  process.exit(1);
}

// Composer-compatible semver regex (ECMAScript-compatible)
const semverRegex = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-((?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

if (!semverRegex.test(version)) {
  console.error(`Invalid semver: '${version}'`);
  console.error('Version must follow semantic versioning (Composer-compatible).');
  process.exit(1);
}

console.log(`Valid semver: ${version}`);
process.exit(0);
