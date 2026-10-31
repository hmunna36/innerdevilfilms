# Film 03: LUST | It Watches Back

- **YouTube:** https://youtu.be/aqiuimf3dCg, uploaded 27 Oct 2026, public 27 Oct 2026 at 22:30 IST (moved from 28 Oct
  20:00 by the owner), and the channel trailer for new visitors.
- **What it is:** 1:50, 16:9, a devil-horror short with no narration, the reference film of the channel's style.
  - An extreme ElevenLabs score carries it; the horror score turns into a training anthem (RISE) at 6:00 AM.
  - The devil's words are on screen: kind pink whispers, then red slammed capitals.
  - The story reads from the pictures alone.
- **The thumbnail** (`thumb.jpg`, live since 27 Oct 21:05 IST) is ChatGPT's second version (`thumb/chatgpt_v2.png`), drawn
  in the owner's Chrome from the three frames in `thumb/` (`ref_*.png`), with the topic word biggest; the first one
  (`thumb_v1_itwatches.jpg`, from `chatgpt_v1.png`, "IT WATCHES" biggest) was replaced. `film.js`'s `thumb` draws the
  code fallback.
- **Files:**
  - `film.js`: the film on the engine (`engine/`): its cut, the devil's words, his faces, the XXX screen. It matches the
    uploaded film frame for frame (checked 27 Oct 2026 against the original page, system fonts); with the engine's
    bundled fonts the letters differ slightly.
  - `music.json`: what ElevenLabs made (`engine/audio/music.mjs`); the mp3s and their prompts are in `audio/music`,
    `audio/sfx` (and the unused narration takes in `audio/takes`).
  - `mix.py`: the sound, rebuilt from the mp3s into `audio/mix.wav` (git-ignored). Until 31 Oct 2026 it rebuilt the uploaded
    -14 LUFS mix bit for bit; since then `master()` makes the channel's quieter mix (-18 LUFS, less rumble; SKILL.md rule 14).
  - `SCREENPLAY.md`: the shot-by-shot timeline and the music plan. `lust_phone.mp4`: a 720p copy.
  - `original/`: the single-file page that rendered the uploaded film (`lust.html`), the devil look test
    (`devil_test.html`) and the first tools (`original/tools`: el.mjs, score.mjs, gen.mjs, tts.mjs, mix.py,
    mix_voice_version.py, render.mjs, qc.sh, set_thumb.mjs). The channel's banner and picture (`channel/brand/brand.mjs`) draw on
    `original/lust.html`.
- **Rebuild:** `python films/03-lust/mix.py`, then `.claude/skills/idf/bin/render.sh film films/03-lust`.
- **Shorts:** 15-21 in `.claude/skills/idf/shorts.md`; Short 15 (lust-hook) is built and passed QA.
