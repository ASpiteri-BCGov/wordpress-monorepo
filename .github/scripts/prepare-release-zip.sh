#!/usr/bin/env bash
set -euo pipefail

PROJECT_PATH="${1:?project path required}"
PROJECT_NAME="${2:?project name required}"
VERSION="${3:-}"

REPO_ROOT="$(git rev-parse --show-toplevel)"
OUTPUT_ZIP="${REPO_ROOT}/${PROJECT_PATH}/dist.zip"

cd "${REPO_ROOT}"

# Stage build output so git archive can include dist/ (respects .gitattributes export-ignore).
# This temporary commit is never pushed.
if [[ -d "${PROJECT_PATH}/dist" ]]; then
  git add -f "${PROJECT_PATH}/dist/"
  git config user.name "github-actions[bot]"
  git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
  if ! git diff --staged --quiet; then
    git commit -m "ci: commit build files"
  fi
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

(
  cd "${PROJECT_PATH}"
  git archive HEAD . | tar -x -C "${TMP}"
)

if [[ "${VERSION}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  set_wordpress_version() {
    local file="$1"
    local pattern="$2"
    sed "${pattern}" "${file}" > "${file}.tmp"
    mv "${file}.tmp" "${file}"
  }

  if [[ -f "${TMP}/style.css" ]]; then
    set_wordpress_version "${TMP}/style.css" "s/^Version:[[:space:]]*.*/Version:      ${VERSION}/"
    echo "Set theme version to ${VERSION} in release style.css"
  elif [[ -f "${TMP}/${PROJECT_NAME}.php" ]]; then
    set_wordpress_version "${TMP}/${PROJECT_NAME}.php" "s/^\([[:space:]]*\*[[:space:]]*Version:\)[[:space:]]*.*/\\1           ${VERSION}/"
    echo "Set plugin version to ${VERSION} in release ${PROJECT_NAME}.php"
  else
    echo "No style.css or ${PROJECT_NAME}.php in release tree — skipping version update."
  fi
else
  echo "Version '${VERSION}' is not X.Y.Z — skipping WordPress version update in release artifact."
fi

rm -f "${OUTPUT_ZIP}"
(
  cd "${TMP}"
  zip -rq "${OUTPUT_ZIP}" .
)

echo "Created ${OUTPUT_ZIP}"
