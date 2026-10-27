// Records the devil's lines on the paid ElevenLabs account. Caches by text, so re-runs cost nothing.
// usage: node tts.mjs [VOxx ...]   (no ids = all lines)
import fs from 'node:fs'; import crypto from 'node:crypto';
import { api, balance } from './el.mjs';
const VOICE = 'nPczCjzI2devNBz1zQrb';            // Brian: deep, resonant, comforting (the mask)
const OUT = '../audio/takes/';
const lines = JSON.parse(fs.readFileSync('lines.json', 'utf8'));
const only = process.argv.slice(2);
const before = await balance();
if (before.tier === 'free') throw new Error('free-tier key: refusing (no commercial licence)');
for (const [id, , text] of lines) {
  if (only.length && !only.includes(id)) continue;
  const hash = crypto.createHash('sha1').update(VOICE + text).digest('hex').slice(0, 10), meta = OUT + id + '.json';
  if (fs.existsSync(meta) && JSON.parse(fs.readFileSync(meta)).hash === hash) { console.log(id, 'cached'); continue; }
  const r = await api(`/v1/text-to-speech/${VOICE}/with-timestamps?output_format=mp3_44100_192`, {
    method: 'POST', body: JSON.stringify({ text, model_id: 'eleven_v3', voice_settings: { stability: 0.5 } }) });
  const j = await r.json(), al = j.alignment;
  fs.writeFileSync(OUT + id + '.mp3', Buffer.from(j.audio_base64, 'base64'));
  const end = al.character_end_times_seconds[al.character_end_times_seconds.length - 1];
  fs.writeFileSync(meta, JSON.stringify({ id, text, hash, voice: VOICE, end }));
  console.log(id, `${end.toFixed(2)} s`, JSON.stringify(text));
}
const after = await balance();
console.log(`credits used: ${after.used - before.used}, left: ${after.left}`);
