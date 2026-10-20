# The cloud machine (a Claude cloud routine run)

- A fresh Ubuntu x86_64 VM every run (about 4 CPUs, 16 GB RAM, 30 GB disk, no GPU) with a full clone of this repo.
  Node 22 and Python 3 are there; ffmpeg and a browser are not. **Nothing survives except what is pushed.**
- `bin/preflight.sh` runs `bin/cloud-setup.sh`: ffmpeg (apt), a Python venv (numpy, pillow) in `~/.cache/idf`,
  `npm ci` in `anim/`, and a browser for Remotion (`npx remotion browser ensure`; if its download is blocked, the
  image's Chromium in `/opt/pw-browsers`, passed with `--browser-executable`). Then `. bin/env.sh`.
- Fonts are bundled (`anim/public/fonts`, loaded by `anim/src/fonts.ts`): the code's "Avenir Next" is Nunito Sans,
  "Chalkboard SE" is Kalam, "Menlo" is JetBrains Mono, on the Mac and in the cloud alike. Never name a system font.

## Keys (environment variables of the cloud environment; set by the owner, never by you)

| Variable | What |
|---|---|
| `YT_CLIENT_ID`, `YT_CLIENT_SECRET` | the Google OAuth client shared by the owner's channels |
| `IDF_YT_REFRESH_TOKEN` | Inner Devil Films' refresh token (`yt.mjs whoami` must say Inner Devil Films) |

Never print them: no `env`, `printenv`, `echo $VAR`, no key in a URL, commit, log or report. A missing key is a
blocker only the owner can clear: report its name and stop. (`YT_REFRESH_TOKEN` in the same environment belongs to
CurioPulse: never use it here; yt.mjs refuses a token of another channel.)

## Long commands

- A Bash call ends after 2 minutes by default (10 at most). Renders run in the background with a log:

      nohup sh -c '.claude/skills/idf/bin/render.sh Film05 /tmp/film05.mp4 > /tmp/render.log 2>&1; echo "EXIT $?" >> /tmp/render.log' >/dev/null 2>&1 &

  then wait inside one call: `until grep -q '^EXIT' /tmp/render.log; do sleep 20; done; tail -3 /tmp/render.log`.
  Keep working while it runs (README, publish.json); never end the turn with a job running.
- Measured on the Mac (8 cores): a 2:32 film is 4,560 frames in about 25 minutes; a 33 s Short is 1,000 frames in
  about 13 minutes (blur-heavy shots are slow). Expect the cloud's 4 CPUs to take about the same or up to twice that.
- Stills are fast: `bin/render.sh still <Comp> /tmp/x.png <frame>`. For a contact sheet, render the MP4 and pull
  one frame a second with `npx remotion ffmpeg -i in.mp4 -vf scale=480:-1 -r 1 /tmp/qa/f%03d.png` (this ffmpeg has
  no `fps` filter; `-r 1` works), then tile them with Pillow and LOOK at the sheet.

## Git

- Commit and push only with `bin/push.sh <msg-file> <paths...>` (to `main`; it falls back to a `claude/` branch if
  main is refused, and the report names it). No tags, no force-push to main, no branch deletions.
- What is committed: all source, the story, the score script, the thumbnail, `publish.json`, and a SMALL archive
  copy of each video (`bin/phone-copy.sh`: 720p, about 10 MB a film, 5 MB a Short). The full-size render is not
  committed (YouTube holds it; the source rebuilds it). Audio WAVs are rebuilt by the score scripts (git-ignored).
