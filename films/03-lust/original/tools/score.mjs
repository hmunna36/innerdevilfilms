// One continuous extreme score for LUST, its sections timed to the cut (ElevenLabs Music, composition plan).
import fs from 'node:fs'; import { api, balance } from './el.mjs';
const NO = ['vocals with words', 'lyrics', 'singing', 'rap', 'spoken word', 'narration'];
const chunks = [
  { text: '[Intro]\n{a menacing sub-bass drone and a reversed riser that slams into a massive deep brass blast on the last beat}', duration_ms: 4000,
    positive_styles: ['dark cinematic horror', 'cinematic', 'deep brass', 'sub bass', 'extreme', 'great production quality'] },
  { text: '[Nights]\n{relentless dark horror pulse: distorted 808 sub bass, pounding toms, trap hi-hats in half-time}\n{a creepy detuned music-box melody on top, a dissonant string ostinato}\n{the tension rises non-stop and hits harder every 8 bars}', duration_ms: 39000,
    positive_styles: ['dark phonk', 'horror trap', 'aggressive', 'distorted 808', 'music box', '140 bpm', 'intense'] },
  { text: '[Reveal]\n{one second of dead silence, then a colossal horror explosion}\n{huge deep brass blasts, a wordless dark choir, distorted drums, screeching strings, maximum terror}\n{a first massive hit at 5.6 seconds, a brutal hit at 12.2 seconds, then a ringing aftermath}', duration_ms: 17600,
    positive_styles: ['epic horror', 'deep brass', 'wordless dark choir', 'distorted', 'terrifying', 'extreme'] },
  { text: '[Fight back]\n{aggressive epic hybrid trailer: huge taiko and trap drums at 140 bpm, distorted bass}\n{soaring defiant strings and a wordless choir, unstoppable and triumphant}\n{a one-second drop-out at 16.6 seconds, then it slams back harder}', duration_ms: 28400,
    positive_styles: ['epic phonk', 'hybrid trailer', 'aggressive', 'triumphant', 'taiko', '140 bpm', 'extreme'] },
  { text: '[Weeks later]\n{sudden calm: a fragile warm solo piano phrase}\n{at 4.6 seconds a creeping dark drone and the detuned music-box melody return}\n{one final massive hit at 8.4 seconds, then a low ringing drone to the end}', duration_ms: 15000,
    positive_styles: ['dark ambient', 'solo piano', 'horror', 'cinematic'] }
].map(c => ({ ...c, negative_styles: NO, context_adherence: 'high' }));
const f = '../audio/music/SCORE';
if (fs.existsSync(f + '.mp3')) { console.log('cached'); process.exit(0); }
const before = await balance();
if (before.tier === 'free') throw new Error('free-tier key: refusing');
const r = await api('/v1/music?output_format=mp3_44100_192', { method: 'POST', body: JSON.stringify({ composition_plan: { chunks }, model_id: 'music_v2_5' }) });
fs.writeFileSync(f + '.mp3', Buffer.from(await r.arrayBuffer()));
fs.writeFileSync(f + '.json', JSON.stringify({ model: 'music_v2_5', song_id: r.headers.get('song-id'), chunks }, null, 1));
console.log('score saved', (chunks.reduce((s, c) => s + c.duration_ms, 0) / 1000) + ' s', 'song-id:', r.headers.get('song-id'));
