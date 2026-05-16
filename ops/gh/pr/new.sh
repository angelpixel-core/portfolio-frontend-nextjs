#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
PR_DIR="${ROOT_DIR}/ops/gh/pr"
QUEUE_DIR="${PR_DIR}/queue"
TEMPLATE="${PR_DIR}/template.md"

slug=""
base="main"
head="develop"
mode="draft"
sha_override=""

fm_set() {
  local file_path="$1"
  local key="$2"
  local value="$3"
  local tmp
  tmp="$(mktemp)"
  awk -v k="$key" -v v="$value" '
    BEGIN { in_fm=0; updated=0 }
    {
      if ($0 == "---" && in_fm == 0) { in_fm=1; print; next }
      if ($0 == "---" && in_fm == 1) {
        if (updated == 0) { print k ": " v }
        in_fm=0
        print
        next
      }
      if (in_fm == 1 && $0 ~ "^" k ":") {
        print k ": " v
        updated=1
        next
      }
      print
    }
  ' "$file_path" > "$tmp"
  mv "$tmp" "$file_path"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --slug) slug="$2"; shift 2 ;;
    --base) base="$2"; shift 2 ;;
    --head) head="$2"; shift 2 ;;
    --draft) mode="draft"; shift ;;
    --ready) mode="ready"; shift ;;
    --sha) sha_override="$2"; shift 2 ;;
    *) echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$slug" ]]; then
  echo "Usage: ops/gh/pr/new.sh --slug <slug> [--base main] [--head branch] [--draft|--ready] [--sha abc1234]" >&2
  exit 1
fi

if [[ ! "$slug" =~ ^[a-z0-9-]+$ ]]; then
  echo "Slug must match [a-z0-9-]+" >&2
  exit 1
fi

mkdir -p "$QUEUE_DIR"
date_part="$(date +%F)"
branch_part="${base}-to-${head}"

if [[ "$mode" == "ready" ]]; then
  sha_part="${sha_override:-$(git -C "$ROOT_DIR" rev-parse --short=7 HEAD)}"
else
  sha_part="draft"
fi

file_name="${date_part}__${branch_part}__${slug}__${sha_part}.md"
file_path="${QUEUE_DIR}/${file_name}"

if [[ -e "$file_path" ]]; then
  echo "File already exists: $file_path" >&2
  exit 1
fi

cp "$TEMPLATE" "$file_path"

draft_value="true"
pr_state="draft"
if [[ "$mode" == "ready" ]]; then
  draft_value="false"
  pr_state="ready"
fi

fm_set "$file_path" base "$base"
fm_set "$file_path" head "$head"
fm_set "$file_path" title "\"chore: ${slug}\""
fm_set "$file_path" draft "$draft_value"
fm_set "$file_path" pr_state "$pr_state"
now_iso="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
fm_set "$file_path" created_at "$now_iso"
fm_set "$file_path" last_synced_at "$now_iso"

{
  echo
  echo "### ${base}..${head}"
  git -C "$ROOT_DIR" log --reverse --pretty=format:'- `%h` %s%n%n  %b%n' "${base}..${head}" || true
} >> "$file_path"

git -C "$ROOT_DIR" add "$file_path"
if [[ "$mode" == "draft" ]]; then
  git -C "$ROOT_DIR" commit -m "docs(pr): add PR draft document ${slug}"
else
  git -C "$ROOT_DIR" commit -m "docs(pr): add PR document ${slug}"
fi

echo "Created: ${file_path}"
