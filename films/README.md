# Films

| # | Title | Length | YouTube | Public |
|---|---|---|---|---|
| 01 | TOMORROW \| He Kept Saying It | 2:32 | https://youtu.be/0GEqZ5t3Ci8 | 19 Oct 2026 20:00 IST (private since 27 Oct) |
| 02 | JUST ONE MORE \| The Phone Ate His Nights | 2:54 | https://youtu.be/GVoVv5A5kOE | 26 Oct 2026 04:30 IST (private since 27 Oct) |
| 03 | LUST \| It Watches Back | 1:50 | https://youtu.be/aqiuimf3dCg | 27 Oct 2026 22:30 IST |

Films 01-02 are the old Devil Mode style (Remotion, `anim/`; `01-tomorrow/tomorrow.mp4` is its master). From 03 on, every
film is made on the canvas engine (`engine/`, `.claude/skills/idf/reference/engine.md`): `film.js` is the film,
`music.json` what ElevenLabs made, `mix.py` the sound, and `filmNN_phone.mp4` or the like a small archive copy. A full-size
film is rebuilt from source: `python films/NN/mix.py`, then `.claude/skills/idf/bin/render.sh film films/NN-slug`.
