# The cloud machine (a Claude cloud routine run)

- A fresh Ubuntu x86_64 VM every run (4 CPUs, 16 GB RAM, about 30 GB disk, no GPU), running as root, with a full clone
  of this repo at `/home/user/innerdevilfilms` (a fresh clone takes about 2 minutes: the old films' masters are in it). Node 22, Python 3.11 and ffmpeg 6.1 are there. **Nothing survives
  except what is pushed.**
- `bin/preflight.sh short|film` runs `bin/cloud-setup.sh`: a Python venv in `~/.cache/idf` (numpy, scipy, soundfile,
  pillow), `npm ci` in `engine/` (playwright-core), and a Chromium that really renders the engine (the image's own Playwright
  browsers in `/opt/pw-browsers` first, whatever their folder layout; else Remotion's headless shell through `anim/`;
  else Chrome for Testing's), saved in
  `~/.cache/idf/chrome-path`. Then `. bin/env.sh` before any manual command: it sets `PYTHON`, `FFMPEG`,
  `PLAYWRIGHT_MODULE`, `IDF_CHROME` and `RENDER_JOBS`.
- The fonts are bundled (`engine/fonts`, Inter and Gelasio): the Mac and the cloud draw the same letters. Never name a
  system font, and draw symbols as shapes (`icon()`), never emoji.

## Keys (environment variables of the cloud environment; set by the owner, never by you)

| Variable | What | Needed by |
|---|---|---|
| `YT_CLIENT_ID`, `YT_CLIENT_SECRET` | the Google OAuth client shared by the owner's channels | both jobs |
| `IDF_YT_REFRESH_TOKEN` | this channel's refresh token (`yt.mjs whoami` checks the channel id UCMWgThNed--oMhcPwyDKceA) | both jobs |
| `ELEVENLABS_API_KEY` (or `IDF_ELEVENLABS_API_KEY`) | the paid ElevenLabs account's key (the film's music) | the film job |

Never print them: no `env`, `printenv`, `echo $VAR`, no key in a URL, commit, log or report. A missing key is a blocker
only the owner can clear: report its name and stop. `YT_REFRESH_TOKEN` in the same environment belongs to CurioPulse:
never use it here (yt.mjs refuses a token of another channel). `music.mjs` never uses a free-tier ElevenLabs key.
The environment's network must reach www.googleapis.com, oauth2.googleapis.com, registry.npmjs.org, pypi.org and, for
films, api.elevenlabs.io (`preflight.sh film` checks it).

## Long commands

- A Bash call ends after 2 minutes by default (10 at most). Renders run in the background with a log:

      nohup sh -c '.claude/skills/idf/bin/render.sh film films/04-gambling > /tmp/render.log 2>&1; echo "EXIT $?" >> /tmp/render.log' >/dev/null 2>&1 &

  then wait inside one call: `until grep -q '^EXIT' /tmp/render.log; do sleep 20; done; tail -3 /tmp/render.log`.
  Keep working while it runs (README, publish.json); never end the turn with a job running.
- The renderer writes `<name>.rendering.mp4` and renames it when it is done, so a cut-off render leaves no broken file.
- Speed: the Mac renders a Short (933 frames) in about 5 minutes with 4 browsers (about 340 ms a frame all in); expect
  the cloud's 4 CPUs to be about the same, and a 1:50 film (3,300 frames) in 20-35 minutes. Sheets and stills take
  seconds: use them for every look before a full render.

## Git

- Commit and push only with `bin/push.sh <msg-file> <paths...>` (to `main`; it falls back to a `claude/` branch if main is
  refused, and the report names it). No tags, no force-push to main, no branch deletions. End messages with
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Committed: all source (`film.js`, `short.js`, `music.json`, `mix.py`), the story, the ElevenLabs mp3s (they cost
  credits), the thumbnail, `publish.json`, README, and a SMALL archive copy of each video (`bin/phone-copy.sh`: 720p, about
  7 MB a film and 6 MB a Short). Not committed (git-ignored, rebuilt from source): full-size renders, decoded WAVs, mixes.
- Push checkpoints during a film (after the story, after the music, after the build, before every full render), so a
  cut-off run can be resumed by the next one.
