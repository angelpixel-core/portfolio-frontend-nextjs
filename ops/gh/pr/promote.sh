#!/usr/bin/env bash
set -euo pipefail

file=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --file) file="$2"; shift 2 ;;
    *) echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$file" || ! -f "$file" ]]; then
  echo "Usage: ops/gh/pr/promote.sh --file ops/gh/pr/queue/<file>.md" >&2
  exit 1
fi

fm_get() {
  local key="$1"
  awk -v k="$key" '
    BEGIN{in=0}
    /^---$/ { if(in==0){in=1; next} else {in=0; exit} }
    in==1 && $0 ~ "^"k":" { sub("^"k":[[:space:]]*", "", $0); print $0; exit }
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
      if($0=="---" && in==1){ if(updated==0){print k": "v}; in=0; print; next }
      if(in==1 && $0 ~ "^"k":") { print k": "v; updated=1; next }
      print
    }
  ' "$file" > "$tmp"
  mv "$tmp" "$file"
}

base="$(fm_get base)"
head="$(fm_get head)"
pr_number="$(fm_get pr_number)"
pr_url="$(fm_get pr_url)"

if [[ -z "$pr_number" || -z "$pr_url" ]]; then
  existing_json="$(gh pr list --base "$base" --head "$head" --state open --json number,url,isDraft --jq '.[0]')"
  if [[ -z "$existing_json" || "$existing_json" == "null" ]]; then
    echo "No PR found for base/head and no PR metadata in file." >&2
    exit 1
  fi
  pr_number="$(echo "$existing_json" | jq -r '.number')"
  pr_url="$(echo "$existing_json" | jq -r '.url')"
fi

is_draft="$(gh pr view "$pr_number" --json isDraft --jq '.isDraft')"
if [[ "$is_draft" == "false" ]]; then
  echo "PR #${pr_number} is already ready for review."
else
  gh pr ready "$pr_number"
  echo "PR #${pr_number} promoted to ready for review."
fi

now_iso="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
fm_set pr_number "$pr_number"
fm_set pr_url "$pr_url"
fm_set pr_state ready
fm_set last_synced_at "$now_iso"
