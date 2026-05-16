#!/usr/bin/env bash
set -euo pipefail

file=""
method="squash"
delete_branch="false"
admin_override="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --file) file="$2"; shift 2 ;;
    --method) method="$2"; shift 2 ;;
    --delete-branch) delete_branch="$2"; shift 2 ;;
    --admin) admin_override="true"; shift ;;
    *) echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$file" || ! -f "$file" ]]; then
  echo "Usage: ops/gh/pr/merge.sh --file ops/gh/pr/queue/<file>.md [--method squash|merge|rebase] [--delete-branch true|false] [--admin]" >&2
  exit 1
fi

if [[ "$method" != "squash" && "$method" != "merge" && "$method" != "rebase" ]]; then
  echo "Invalid merge method: $method" >&2
  exit 1
fi

if [[ "$delete_branch" != "true" && "$delete_branch" != "false" ]]; then
  echo "Invalid --delete-branch value: $delete_branch (expected true|false)" >&2
  exit 1
fi

fm_get() {
  local key="$1"
  awk -v k="$key" '
    BEGIN{in_fm=0}
    /^---$/ { if(in_fm==0){in_fm=1; next} else {in_fm=0; exit} }
    in_fm==1 && $0 ~ "^"k":" { sub("^"k":[[:space:]]*", "", $0); print $0; exit }
  ' "$file"
}

fm_set() {
  local key="$1"
  local value="$2"
  local tmp
  tmp="$(mktemp)"
  awk -v k="$key" -v v="$value" '
    BEGIN{in_fm=0; updated=0}
    {
      if($0=="---" && in_fm==0){in_fm=1; print; next}
      if($0=="---" && in_fm==1){ if(updated==0){print k": "v}; in_fm=0; print; next }
      if(in_fm==1 && $0 ~ "^"k":") { print k": "v; updated=1; next }
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
  existing_json="$(gh pr list --base "$base" --head "$head" --state open --json number,url --jq '.[0]')"
  if [[ -z "$existing_json" || "$existing_json" == "null" ]]; then
    echo "No PR found for base/head and no PR metadata in file." >&2
    exit 1
  fi
  pr_number="$(echo "$existing_json" | jq -r '.number')"
  pr_url="$(echo "$existing_json" | jq -r '.url')"
fi

pr_state="$(gh pr view "$pr_number" --json state,isDraft --jq '.state + ":" + (if .isDraft then "draft" else "ready" end)')"
gh_state="${pr_state%%:*}"
draft_state="${pr_state##*:}"

if [[ "$gh_state" == "MERGED" ]]; then
  echo "PR #${pr_number} is already merged."
  exit 0
fi

if [[ "$gh_state" != "OPEN" ]]; then
  echo "PR #${pr_number} is not open (state: ${gh_state})." >&2
  exit 1
fi

if [[ "$draft_state" == "draft" ]]; then
  echo "PR #${pr_number} is still draft. Promote it before merge." >&2
  exit 1
fi

if [[ "$admin_override" != "true" ]]; then
  if ! gh pr checks "$pr_number" --required >/dev/null 2>&1; then
    echo "Required checks are not green for PR #${pr_number}. Use --admin to override manually." >&2
    exit 1
  fi
fi

echo "About to merge PR #${pr_number} (${pr_url})"
echo "base=${base} head=${head} method=${method} delete_branch=${delete_branch} admin_override=${admin_override}"
read -r -p "Confirm merge? (Y/N): " ans
if [[ "$ans" != "Y" ]]; then
  echo "Merge aborted by user."
  exit 1
fi

merge_args=(pr merge "$pr_number")
if [[ "$method" == "squash" ]]; then
  merge_args+=(--squash)
elif [[ "$method" == "merge" ]]; then
  merge_args+=(--merge)
else
  merge_args+=(--rebase)
fi

if [[ "$delete_branch" == "true" ]]; then
  merge_args+=(--delete-branch)
fi

if [[ "$admin_override" == "true" ]]; then
  merge_args+=(--admin)
fi

gh "${merge_args[@]}"

merged_sha="$(gh pr view "$pr_number" --json mergeCommit --jq '.mergeCommit.oid // ""')"
now_iso="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

fm_set pr_number "$pr_number"
fm_set pr_url "$pr_url"
fm_set pr_state merged
fm_set merge_method "$method"
fm_set merged_at "$now_iso"
fm_set merge_commit_sha "$merged_sha"
fm_set last_synced_at "$now_iso"

echo "Merged PR #${pr_number} with method '${method}'."
