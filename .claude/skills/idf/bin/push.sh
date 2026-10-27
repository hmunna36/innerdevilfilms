#!/usr/bin/env bash
# Commit and push the paths given (plus the skill's records) to main:  push.sh <commit-message-file> <path>...
# Refuses files over 95 MB and anything shaped like a key. If main is refused (the cloud proxy may restrict a session
# to claude/ branches), pushes claude/idf-<date> instead and says so.
set -euo pipefail
MSG="${1:-}"; shift || true
if [ ! -f "$MSG" ] || [ $# = 0 ]; then echo "usage: push.sh <commit-message-file> <path>..."; exit 2; fi
SKILL="$(cd "$(dirname "$0")/.." && pwd)"; REPO="$(cd "$SKILL/../../.." && pwd)"; cd "$REPO"
git config user.name >/dev/null 2>&1 || git config user.name "Inner Devil Films routine"
git config user.email >/dev/null 2>&1 || git config user.email "innerdevilfilms-routine@users.noreply.github.com"
big="$(find "$@" -type f -size +95M ! -path '*/.work/*' 2>/dev/null | head -3)"
[ -n "$big" ] && { echo "refusing: files over 95 MB:"; echo "$big"; exit 1; }
if grep -rIl -E 'sk_[a-f0-9]{32,}|GOCSPX-|1//0[A-Za-z0-9_-]{30,}|"refresh_token"' "$@" .claude/skills/idf 2>/dev/null | grep -v 'bin/push.sh$' | grep -v 'bin/yt.mjs$' | head -3 | grep -q .; then
  echo "refusing: something that looks like a key is in the files to commit"; exit 1; fi
git add --sparse "$@" .claude/skills/idf     # --sparse: the Mac's light clone may not have these folders checked out
if git diff --cached --quiet; then echo "nothing to commit"; else git commit -q -F "$MSG"; fi
push_main() { git pull -q --rebase --autostash origin main && git push -q origin HEAD:refs/heads/main; }
if push_main || { sleep 5; push_main; }; then echo "pushed to main: $(git log --oneline -1 | cut -c1-80)"
else git rebase --abort 2>/dev/null || true; BR="claude/idf-$(date -u +%Y%m%d-%H%M)"; git push -q -f origin "HEAD:refs/heads/$BR" && echo "main was refused: pushed to $BR (the user merges it)"; fi
