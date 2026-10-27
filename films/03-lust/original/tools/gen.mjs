// Music cues and key sound effects for LUST from ElevenLabs (paid key). Cached by prompt.
import fs from 'node:fs'; import crypto from 'node:crypto';
import { api, balance } from './el.mjs';
const MUSIC = {
  M1: [39000, 'Creepy horror lullaby. A lone music box and soft felt piano play a slow, tender lullaby melody in D minor at 76 BPM over a deep sub-bass drone. Intimate, beautiful and wrong at the same time. Over time the music box drifts slightly out of tune and the drone grows darker; a slow heartbeat pulse joins in the second half. No drums, no vocals.'],
  M2: [17000, 'Terrifying horror underscore for a monster reveal: a low dissonant string cluster swelling from silence, deep sub-bass pulses, eerie high violin harmonics, a sudden loud orchestral stinger, then tense near-silence with a thin high ringing tone. Cinematic and dark, no vocals.'],
  M3: [28000, 'Driving, determined cinematic pulse at 110 BPM: tight punchy drums, pulsing low strings and a dark synth bass, building momentum, hopeful and defiant; warm chords arrive halfway through. Trailer style, no vocals.'],
  M4: [15000, 'Calm, gentle morning piano, soft and warm, sparse notes, peaceful, with a faint unsettling undertone, 70 BPM, no vocals.'],
  RISE: [35000, 'Powerful, uplifting motivational training anthem for a comeback montage: opens on a huge impact, then hard-hitting drums at 128 BPM, driving bass, heroic strings and brass in a bright major key, rising energy, inspiring, triumphant and unstoppable. Instrumental, no vocals.']
};
const SFX = {
  scream: [2.2, 'an inhuman demonic scream, distorted and terrifying, horror movie monster'],
  shriek: [1.5, 'a short high-pitched demonic shriek that fades away into the dark'],
  smash: [1.3, 'a phone hitting a wall hard and shattering, glass and plastic breaking'],
  scare: [1.2, 'violent horror jump scare, a distorted boom with a sharp hiss'],
  stinger: [2.5, 'loud low horror movie stinger, brass and strings hit, cinematic'],
  swell: [2.5, 'deep ominous sub-bass swell rising, horror']
};
const cached = (file, key) => fs.existsSync(file + '.json') && JSON.parse(fs.readFileSync(file + '.json')).hash === key;
const hash = s => crypto.createHash('sha1').update(s).digest('hex').slice(0, 10);
const before = await balance();
if (before.tier === 'free') throw new Error('free-tier key: refusing');
for (const [id, [ms, prompt]] of Object.entries(MUSIC)) {
  const f = `../audio/music/${id}`, h = hash(ms + prompt);
  if (cached(f, h)) { console.log(id, 'cached'); continue; }
  let model = 'music_v2_5', r;
  try { r = await api('/v1/music?output_format=mp3_44100_192', { method: 'POST', body: JSON.stringify({ prompt, music_length_ms: ms, model_id: model, force_instrumental: true }) }); }
  catch (e) { console.log(id, 'v2.5 failed, trying v1:', e.message.slice(0, 120)); model = 'music_v1';
    r = await api('/v1/music?output_format=mp3_44100_192', { method: 'POST', body: JSON.stringify({ prompt, music_length_ms: ms, model_id: model, force_instrumental: true }) }); }
  fs.writeFileSync(f + '.mp3', Buffer.from(await r.arrayBuffer()));
  fs.writeFileSync(f + '.json', JSON.stringify({ id, hash: h, model, ms, prompt }));
  console.log(id, model, ms / 1000 + ' s');
}
for (const [id, [sec, text]] of Object.entries(SFX)) {
  const f = `../audio/sfx/${id}`, h = hash(sec + text);
  if (cached(f, h)) { console.log(id, 'cached'); continue; }
  const r = await api('/v1/sound-generation?output_format=mp3_44100_192', { method: 'POST', body: JSON.stringify({ text, duration_seconds: sec, prompt_influence: 0.5 }) });
  fs.writeFileSync(f + '.mp3', Buffer.from(await r.arrayBuffer()));
  fs.writeFileSync(f + '.json', JSON.stringify({ id, hash: h, sec, text }));
  console.log(id, sec + ' s');
}
const after = await balance();
console.log(`credits used: ${after.used - before.used} (lags a few minutes), left: ${after.left}`);
