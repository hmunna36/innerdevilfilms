# Short 20: lust-cost (27.3 s, 1080 x 1920)

One idea: what it took, one person at a time. Built, QA'd and uploaded by the cloud routine of 1 Nov 2026:
**YouTube AGKo7ARwqIE** (https://youtu.be/AGKo7ARwqIE), public 2 Nov 2026 20:00 IST.

- **Film:** 03 LUST | It Watches Back (https://youtu.be/_UwESHNcD7A), times from `films/03-lust/film.js` (4.05-4.95,
  6.6-7.8, 9.75-10.92, 14.05-16.12, 18.2-19.2, 22.05-24.12, 26.2-27.2, 30.05-30.8, 31.3-36.0, 40.0-43.75).
- **Why more than the planned stretches:** the five planned banner stretches add up to about 9 s, so each night is a
  clock, its banner and his face after it (the queue line asked for the faces, the clocks and the room).
- **The cut** (`short.js`, 16 segments): it opens on the last of them, Maya's banner "I waited an hour. Guess you're
  busy." (slowed, a push-in), then goes back to the first night: 11:48 PM, Mom's "Call me when you can ♥" under "You
  worked hard today. You deserve this.", swiped; his face, glazed ("Shh… it's okay. Everyone does it."); 12:31 AM,
  "3 missed calls from Mom" under "She'll call again. Stay with me.", swiped; his face, tired; 1:47 AM, "Work — final
  warning: Late again. See me at 9." under "Who needs them? You have me.", swiped; his face, empty; 3:05 AM, Maya's
  banner swiped away; its claws settle on his shoulders ("She'd never understand you… not like I do."); his face,
  ashamed; the montage (its three banners framed close, "one more", 3:51-4:57 AM, its grin, his face in red, black);
  the phone dies; the end card (LUST / IT WATCHES BACK / FULL FILM ON THE CHANNEL and an arrow to the Related video).
- **How it differs from 15-19:** the only LUST Short told through his phone: every banner framed close (z 1.3, about
  38-44 px letters) and played at half speed so each reads for about 1.5 s, his four faces in order, and the person he
  lost last as its first frame. Its own sound plan and title.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the nights' loudest bars (film 41.6-42.9)
  under the hook, a boom on the jump back to 11:48 PM, the nights' pulse (film 17.0-35.9) building to the claws, a boom
  into the montage on its own bars (40.0-43.75) and the dead phone's silence, then the film's title blast (3.2-6.9) and
  a boom under the end card. Mix: -16.0 LUFS, -2.5 dBTP, 24% under 60 Hz; no phone-band gap over 2 s.
- **QA** (three sheet rounds, one on the MP4):
  - sheet 1 (automatic framings): the banners, the whole point of the Short, were tiny on the whole phone: each banner
    segment now has its own framing, slowed (`rate`) so the banner holds 1.5 s.
  - sheet 2: the swipe tails showed a screen-filling mosaic (segments now cut mid-swipe), the long Maya line ran past
    x 980 at z 1.42 (now z 1.3-1.36 centred on the line), and "She'll call again. Stay with / me." left a lone word: in
    the engine a whisper or red line that wraps in the tall frame is now balanced over its lines (checked on Short 16's
    red lines too).
  - sheet 3: every word inside the safe area, the story reads with the sound off. The first sound plan (the nights from
    film 4.0) sagged to -28 to -40 dB for 12 s with 34% of its energy under 60 Hz: rebuilt as above.
  - MP4 1 (`engine/qa.mjs`): H.264 1080x1920 30 fps, AAC 48 kHz, 27.30 s, -16.32 LUFS, true peak -2.18 dBTP; the only
    black stretch over .25 s is the phone dying (23.67-23.93, as in the film). By eye: the first frame has Maya's
    banner; whispers 66 px, banners 38-44 px held 1.3-1.5 s, clocks fitted; faces between y 400 and 1500.
- **Files:** `short.js` (the cut), `publish.json`, `short20_phone.mp4` (720p archive copy). The full render `short20.mp4`
  and `mix.wav` are rebuilt from source (`render.sh short shorts/20-lust-cost`).
- **Left by hand after upload:** Studio, the Short's Related video = the film.
