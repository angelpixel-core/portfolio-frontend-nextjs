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

sed -i '' "s/^base:.*/base: ${base}/" "$file_path"
sed -i '' "s/^head:.*/head: ${head}/" "$file_path"
sed -i '' "s/^title:.*/title: \"chore: ${slug}\"/" "$file_path"
sed -i '' "s/^draft:.*/draft: ${draft_value}/" "$file_path"
sed -i '' "s/^pr_state:.*/pr_state: ${pr_state}/" "$file_path"
now_iso="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
sed -i '' "s/^created_at:.*/created_at: ${now_iso}/" "$file_path"
sed -i '' "s/^last_synced_at:.*/last_synced_at: ${now_iso}/" "$file_path"

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
