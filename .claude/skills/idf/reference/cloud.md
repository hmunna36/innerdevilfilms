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
- `preflight.sh` also renders one still of film 07 through the stage (`stage/`, the look every new film and Short is
  made in): it proves the browser draws it and the bundled handwriting loaded.
- The fonts are bundled (`stage/fonts`: Balsamiq Sans as "IDF Hand"; `engine/fonts` for the old films): the Mac and the
  cloud draw the same letters. Never name a system font, and draw symbols as shapes, never emoji.
- The stage's commands (`reference/engine.md`) read the same environment: `. bin/env.sh` first, or use `bin/stage.sh
  build|render|make|mix`. `stage/make.sh` uses `RENDER_JOBS` browsers on Linux and 2 on the Mac.

## Keys (environment variables of the cloud environment; set by the owner, never by you)

| Variable | What | Needed by |
|---|---|---|
| `YT_CLIENT_ID`, `YT_CLIENT_SECRET` | the Google OAuth client shared by the owner's channels | both jobs |
| `IDF_YT_REFRESH_TOKEN` | this channel's refresh token (`yt.mjs whoami` checks the channel id UCMWgThNed--oMhcPwyDKceA) | both jobs |
| `ELEVENLABS_API_KEY` (or `IDF_ELEVENLABS_API_KEY`) | the paid ElevenLabs account's key (the film's music); already in the environment (CurioPulse's long-form uses it too: Creator tier, checked 27 Oct 2026) | the film job |

Never print them: no `env`, `printenv`, `echo $VAR`, no key in a URL, commit, log or report. A missing key is a blocker
only the owner can clear: report its name and stop. `YT_REFRESH_TOKEN` in the same environment belongs to CurioPulse:
never use it here (yt.mjs refuses a token of another channel). `music.mjs` never uses a free-tier ElevenLabs key.
The environment's network must reach www.googleapis.com, oauth2.googleapis.com, registry.npmjs.org, pypi.org and, for
films, api.elevenlabs.io (`preflight.sh film` checks it).

## Long commands

- A Bash call ends after 2 minutes by default (10 at most). Renders run in the background with a log:

      nohup sh -c '.claude/skills/idf/bin/stage.sh make films/08-envy > /tmp/render.log 2>&1; echo "EXIT $?" >> /tmp/render.log' >/dev/null 2>&1 &

  then wait inside one call: `until grep -q '^EXIT' /tmp/render.log; do sleep 20; done; tail -3 /tmp/render.log`.
  Keep working while it runs (README, publish.json); never end the turn with a job running.
- `stage/make.sh` renders JPEG frames into `<folder>/out/frames` and then joins them: if it is cut off, run it again
  (or `stage.sh make <folder> encode` if all the frames are there).
- Speed. The stage on the Mac (17 Nov 2026, 2 browsers): a 28 s Short (838 frames) in about 1.5 minutes, the 86 s film
  in about 5. The stage has NOT been timed in the cloud yet (the old engine there drew about 60 ms a frame with 4
  browsers): note the time in the first report. The setup (preflight) takes about 40 s and a fresh clone about 2
  minutes. The Mac has only 8 GB: never more than 2 browsers there. Sheets and stills take seconds: use them for every
  look before a full render.

## Git

- Commit and push only with `bin/push.sh <msg-file> <paths...>` (to `main`; it falls back to a `claude/` branch if main is
  refused, and the report names it). No tags, no force-push to main, no branch deletions. End messages with
  the `Co-Authored-By:` line for the model that did the run.
- Committed: all source (`cues.js`, `src/`, the built `film.js` and `cues_edit.json`, `short.js`, `music.json`, `mix.py`), the story, the ElevenLabs mp3s (they cost
  credits), the thumbnail, `publish.json`, README, and a SMALL archive copy of each video (`bin/phone-copy.sh`: 720p, about
  7 MB a film and 6 MB a Short). Not committed (git-ignored, rebuilt from source): full-size renders, decoded WAVs, mixes,
  `out/` (frames, sheets, stills).
- Push checkpoints during a film (after the story, after the music, after the build, before every full render), so a
  cut-off run can be resumed by the next one.
