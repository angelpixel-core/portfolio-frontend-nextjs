#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"

file=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --file) file="$2"; shift 2 ;;
    *) echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$file" ]]; then
  echo "Usage: ops/gh/pr/create.sh --file ops/gh/pr/queue/<file>.md" >&2
  exit 1
fi

if [[ ! -f "$file" ]]; then
  echo "File not found: $file" >&2
  exit 1
fi

name="$(basename "$file")"
if [[ ! "$name" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}__[a-z0-9._-]+-to-[a-z0-9._/-]+__[a-z0-9-]+__(draft|[a-f0-9]{7})\.md$ ]]; then
  echo "Invalid file name pattern: $name" >&2
  exit 1
fi

fm_get() {
  local key="$1"
  awk -v k="$key" '
    BEGIN{in=0}
    /^---$/ { if(in==0){in=1; next} else {in=0; exit} }
    in==1 && $0 ~ "^"k":" {
      sub("^"k":[[:space:]]*", "", $0)
      print $0
      exit
    }
  ' "$file"
}

fm_set() {
  local key="$1"
  local value="$2"
  local tmp
  tmp="$(mktemp)"
  awk -v k="$key" -v v="$value" '
    BEGIN{in=0; updated=0}
    {
      if($0=="---" && in==0){in=1; print; next}
      if($0=="---" && in==1){
        if(updated==0){print k": "v}
        in=0
        print
        next
      }
      if(in==1 && $0 ~ "^"k":") { print k": "v; updated=1; next }
      print
    }
  ' "$file" > "$tmp"
  mv "$tmp" "$file"
}

base="$(fm_get base)"
head="$(fm_get head)"
title="$(fm_get title)"
draft="$(fm_get draft)"
pr_number="$(fm_get pr_number)"
pr_url="$(fm_get pr_url)"

title="${title#\"}"; title="${title%\"}"

if [[ -z "$base" || -z "$head" || -z "$title" ]]; then
  echo "Missing required frontmatter: base, head, title" >&2
  exit 1
fi

existing_json="$(gh pr list --base "$base" --head "$head" --state all --json number,url,isDraft --jq '.[0]')"
existing_number=""
existing_url=""
existing_is_draft=""
if [[ -n "$existing_json" && "$existing_json" != "null" ]]; then
  existing_number="$(echo "$existing_json" | jq -r '.number')"
  existing_url="$(echo "$existing_json" | jq -r '.url')"
  existing_is_draft="$(echo "$existing_json" | jq -r '.isDraft')"
fi

if ! git -C "$ROOT_DIR" diff --quiet -- "$file" || ! git -C "$ROOT_DIR" diff --cached --quiet -- "$file"; then
  msg="docs(pr): update PR document details"
  if [[ -n "$existing_number" ]]; then
    msg="docs(pr): update PR#${existing_number} document details"
  fi
  read -r -p "PR document has changes. Commit now with '${msg}'? (Y/N): " ans
  if [[ "$ans" != "Y" ]]; then
    echo "Aborted by user."
    exit 1
  fi
  git -C "$ROOT_DIR" add "$file"
  git -C "$ROOT_DIR" commit -m "$msg"
fi

body_file="$(mktemp)"
awk 'BEGIN{fm=0; donefm=0}
  /^---$/ { if(donefm==0){fm=1-fm; if(fm==0){donefm=1}; next} }
  donefm==1 { print }
' "$file" > "$body_file"

if [[ -n "$existing_number" ]]; then
  pr_number="$existing_number"
  pr_url="$existing_url"
  if [[ "$existing_is_draft" == "true" ]]; then
    fm_set pr_state draft
  else
    fm_set pr_state ready
  fi
else
  create_args=(pr create --base "$base" --head "$head" --title "$title" --body-file "$body_file")
  if [[ "$name" == *"__draft.md" || "$draft" == "true" ]]; then
    create_args+=(--draft)
  fi
  new_url="$(gh "${create_args[@]}")"
  pr_url="$new_url"
  pr_number="$(gh pr view "$pr_url" --json number --jq '.number')"
  if [[ "$name" == *"__draft.md" || "$draft" == "true" ]]; then
    fm_set pr_state draft
  else
    fm_set pr_state ready
  fi
fi

now_iso="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
fm_set pr_number "$pr_number"
fm_set pr_url "$pr_url"
fm_set last_synced_at "$now_iso"

echo "PR #${pr_number}: ${pr_url}"
