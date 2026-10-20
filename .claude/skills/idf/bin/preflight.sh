#!/usr/bin/env bash
# The gate at the start of every run. Exit 0 = GO. Exit 2 = a blocker only the user can clear (a key, the network):
# report it and stop. Exit 1 = the toolchain is broken: fix it, then report. Never prints a key.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; REPO="$(cd "$HERE/../../../.." && pwd)"
echo "== machine"; echo "  $(uname -sm), $( (nproc 2>/dev/null || sysctl -n hw.ncpu) ) CPUs, $(df -h "$REPO" | awk 'NR==2 {print $4}') free"
echo "== toolchain"; "$HERE/cloud-setup.sh" || exit 1
. "$HERE/env.sh"; rc=0
echo "== render test (a still of the thumbnail composition)"
T="$(mktemp -d)"
if "$HERE/render.sh" still ThumbA "$T/t.png" 0 >"$T/log" 2>&1 && [ -s "$T/t.png" ]; then echo "  ok"; else echo "  FAILED:"; tail -12 "$T/log" | sed 's/^/    /'; rc=1; fi
rm -rf "$T"
echo "== keys (set or not; never printed)"
for v in YT_CLIENT_ID YT_CLIENT_SECRET IDF_YT_REFRESH_TOKEN; do
  if [ -n "${!v:-}" ]; then echo "  $v: set"; else echo "  $v: NOT SET"; [ "$(uname -s)" = "Linux" ] && rc=2; fi
done
echo "== network"
for u in https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest https://oauth2.googleapis.com/token https://registry.npmjs.org/; do
  code="$(curl -s -o /dev/null -m 20 -w '%{http_code}' "$u" || true)"
  case "$code" in 000|403|407) echo "  $u: BLOCKED ($code)"; rc=2;; *) echo "  $u: reachable ($code)";; esac
done
echo "== YouTube"; node "$HERE/yt.mjs" whoami 2>&1 | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || rc=2
[ $rc = 2 ] || node "$HERE/yt.mjs" upcoming 2>&1 | sed 's/^/  /'
echo "== git"
if git -C "$REPO" push --dry-run origin HEAD:refs/heads/main >/dev/null 2>&1; then echo "  push to main: allowed"; else echo "  push to main: NOT allowed (push.sh falls back to a claude/ branch)"; fi
case $rc in 0) echo "PREFLIGHT: GO";; 2) echo "PREFLIGHT: BLOCKED (needs the user: see NOT SET / BLOCKED above)";; *) echo "PREFLIGHT: TOOLCHAIN BROKEN";; esac
exit $rc
