#!/usr/bin/env node
// A film's music and sound effects from ElevenLabs, as its music.json says (the paid account only; never prints a key).
//   node engine/audio/music.mjs status                     the account: tier, credits left, reset date
//   node engine/audio/music.mjs films/04-gambling --dry-run check the plan and estimate the credits; nothing is made
//   node engine/audio/music.mjs films/04-gambling           make what is missing (cached by prompt: a re-run is free)
// music.json: { "model": "music_v2_5",
//   "score": { "id": "SCORE", "chunks": [{ "text", "duration_ms", "positive_styles", "negative_styles" }] },  composition plan
//   "cues":  { "RISE": { "ms": 35000, "prompt": "…" } },                                                  one prompt each
//   "sfx":   { "coins": { "sec": 1.5, "text": "…" } },                                                    film-specific hits
//   "shared_sfx": ["scream", "smash"] }                         taken from engine/audio/sfx (free; made for LUST)
// Files land in <film>/audio/music/<id>.mp3 and <film>/audio/sfx/<id>.mp3 with a .json beside each (prompt, hash, model).
// Rules learnt on LUST: every line of a direction under 200 characters; never name an artist, a film or a franchise,
// and avoid trademark-like sound words ("braam" got a plan refused as "copyrighted"; "deep brass blasts" passed).
// Credits: music about 900 a minute, a sound effect about 200. The account is shared with the daily channels, so the run
// refuses when it would leave less than IDF_EL_RESERVE credits (default 5000) and says so.
// Key: IDF_ELEVENLABS_API_KEY or ELEVENLABS_API_KEY (the cloud), else ~/.config/va/elevenlabs.env (the Mac:
// ELEVENLABS_API_KEY_2 first). A key on the free tier is never used (its audio is not licensed for commercial use).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

const HERE = path.dirname(new URL(import.meta.url).pathname), REPO = path.resolve(HERE, '../..');
const args = process.argv.slice(2), DRY = args.includes('--dry-run'), target = args.find(a => !a.startsWith('--'));
const RESERVE = +(process.env.IDF_EL_RESERVE || 5000);
const die = (m, code = 1) => { console.error('music: ' + m); process.exit(code); };
const hash = s => crypto.createHash('sha1').update(s).digest('hex').slice(0, 10);
const BANNED = /\b(braa+m|bwa+m|inception|interstellar|zimmer|john williams|batman|joker|stranger things|carpenter|star wars|marvel|in the style of)\b/i;

function candidates() {
  const out = [];
  for (const k of ['IDF_ELEVENLABS_API_KEY', 'ELEVENLABS_API_KEY']) if (process.env[k]) out.push(process.env[k]);
  const f = path.join(os.homedir(), '.config/va/elevenlabs.env');
  if (fs.existsSync(f)) {
    const env = Object.fromEntries(fs.readFileSync(f, 'utf8').split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#'))
      .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]));
    for (const k of ['ELEVENLABS_API_KEY_2', 'ELEVENLABS_API_KEY', 'ELEVENLABS_API_KEY_3']) if (env[k]) out.push(env[k]);
  }
  return [...new Set(out)];
}
async function call(key, p, opts = {}) {
  const r = await fetch('https://api.elevenlabs.io' + p, { ...opts, headers: { 'xi-api-key': key, 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  if (!r.ok) throw new Error(`${p.split('?')[0]} -> ${r.status} ${(await r.text()).slice(0, 300)}`);
  return r;
}
async function account() {           // the first key that is not on the free tier, with its balance
  const keys = candidates();
  if (!keys.length) die('no ElevenLabs key: the cloud needs ELEVENLABS_API_KEY in its environment (the owner adds it)', 2);
  for (const key of keys) {
    try {
      const s = await (await call(key, '/v1/user/subscription')).json();
      if (s.tier === 'free') continue;
      return { key, tier: s.tier, left: s.character_limit - s.character_count, resets: new Date(s.next_character_count_reset_unix * 1000).toISOString().slice(0, 10) };
    } catch (e) { if (/fetch failed|ENOTFOUND|ECONNREFUSED|403/.test(String(e))) die('api.elevenlabs.io is not reachable from here: ' + String(e).slice(0, 120), 2); }
  }
  die('no paid ElevenLabs key (only free-tier keys were found; their audio is not licensed for commercial use)', 2);
}

if (target === 'status') {
  const a = await account();
  console.log(JSON.stringify({ tier: a.tier, credits_left: a.left, resets: a.resets, reserve: RESERVE }));
  process.exit(0);
}
if (!target) die('usage: music.mjs status | <film folder> [--dry-run]');
const dir = path.resolve(REPO, target), specFile = path.join(dir, 'music.json');
if (!fs.existsSync(specFile)) die(`no music.json in ${target}`);
const spec = JSON.parse(fs.readFileSync(specFile, 'utf8')), model = spec.model || 'music_v2_5';

// ---------- check the plan ----------
const problems = [], jobs = [];
const lines = s => String(s).split('\n').map(l => l.replace(/^\{|\}$/g, '').trim()).filter(Boolean);
const checkText = (where, s, plan = true) => {     // the 200-character limit is the composition plan's, per line
  if (plan) for (const l of lines(s)) if (l.length >= 200) problems.push(`${where}: a line is ${l.length} characters (under 200): "${l.slice(0, 60)}…"`);
  if (BANNED.test(s)) problems.push(`${where}: "${s.match(BANNED)[0]}" names something protected or trips the copyright filter`);
};
const cached = (file, h) => fs.existsSync(file + '.mp3') && fs.existsSync(file + '.json') && JSON.parse(fs.readFileSync(file + '.json', 'utf8')).hash === h;
if (spec.score) {
  const c = spec.score.chunks, h = hash(JSON.stringify(c)), f = path.join(dir, 'audio/music', spec.score.id || 'SCORE');
  c.forEach((k, i) => { checkText(`score chunk ${i + 1}`, k.text); (k.positive_styles || []).forEach(s => checkText(`score chunk ${i + 1} style`, s)); });
  const sec = c.reduce((s, k) => s + k.duration_ms, 0) / 1000;
  jobs.push({ kind: 'score', id: spec.score.id || 'SCORE', file: f, h, sec, credits: Math.ceil(sec / 60 * 900), done: cached(f, h) });
}
for (const [id, cue] of Object.entries(spec.cues || {})) {
  const f = path.join(dir, 'audio/music', id), h = hash(cue.ms + cue.prompt);
  checkText(`cue ${id}`, cue.prompt, false);
  if (cue.prompt.length > 2000) problems.push(`cue ${id}: the prompt is ${cue.prompt.length} characters (keep it under 2000)`);
  jobs.push({ kind: 'cue', id, file: f, h, sec: cue.ms / 1000, credits: Math.ceil(cue.ms / 60000 * 900), done: cached(f, h), cue });
}
for (const [id, s] of Object.entries(spec.sfx || {})) {
  const f = path.join(dir, 'audio/sfx', id), h = hash(s.sec + s.text);
  checkText(`sfx ${id}`, s.text, false);
  jobs.push({ kind: 'sfx', id, file: f, h, sec: s.sec, credits: 200, done: cached(f, h), s });
}
for (const id of spec.shared_sfx || []) {
  const from = path.join(HERE, 'sfx', id + '.mp3');
  if (!fs.existsSync(from)) problems.push(`shared_sfx: no engine/audio/sfx/${id}.mp3`);
  else jobs.push({ kind: 'shared', id, from, file: path.join(dir, 'audio/sfx', id), credits: 0, done: fs.existsSync(path.join(dir, 'audio/sfx', id + '.mp3')) });
}
const todo = jobs.filter(j => !j.done), need = todo.reduce((s, j) => s + j.credits, 0);
for (const j of jobs) console.log(`${j.done ? 'have' : 'make'}  ${j.kind.padEnd(6)} ${j.id.padEnd(10)} ${j.sec ? (j.sec + ' s').padEnd(8) : ''.padEnd(8)} ~${j.credits} credits`);
console.log(`to make: ${todo.length}, about ${need} credits`);
if (problems.length) { problems.forEach(p => console.error('problem: ' + p)); die('fix the plan first', 1); }
if (DRY) { console.log('dry run: plan OK, nothing made'); process.exit(0); }
if (!todo.length) { console.log('everything is made'); process.exit(0); }

// ---------- make what is missing ----------
let acc = null;
if (todo.some(j => j.credits > 0)) {
  acc = await account();
  console.log(`account: ${acc.tier}, ${acc.left} credits left (resets ${acc.resets}), keeping ${RESERVE} for the other channels`);
  if (acc.left - need < RESERVE) die(`not enough credits: this needs about ${need} and would leave ${acc.left - need} (< ${RESERVE}). Report it; the owner tops up.`, 3);
}
for (const j of todo) {
  fs.mkdirSync(path.dirname(j.file), { recursive: true });
  if (j.kind === 'shared') { fs.copyFileSync(j.from, j.file + '.mp3'); fs.copyFileSync(j.from.replace(/\.mp3$/, '.json'), j.file + '.json'); console.log('copied', j.id); continue; }
  let r, used = model;
  if (j.kind === 'score') {
    r = await call(acc.key, '/v1/music?output_format=mp3_44100_192', { method: 'POST', body: JSON.stringify({ composition_plan: { chunks: spec.score.chunks }, model_id: model }) });
  } else if (j.kind === 'cue') {
    const body = m => JSON.stringify({ prompt: j.cue.prompt, music_length_ms: j.cue.ms, model_id: m, force_instrumental: true });
    try { r = await call(acc.key, '/v1/music?output_format=mp3_44100_192', { method: 'POST', body: body(model) }); }
    catch (e) { console.log(`${j.id}: ${model} failed (${e.message.slice(0, 100)}), trying music_v1`); used = 'music_v1'; r = await call(acc.key, '/v1/music?output_format=mp3_44100_192', { method: 'POST', body: body(used) }); }
  } else {
    r = await call(acc.key, '/v1/sound-generation?output_format=mp3_44100_192', { method: 'POST', body: JSON.stringify({ text: j.s.text, duration_seconds: j.s.sec, prompt_influence: .5 }) });
  }
  fs.writeFileSync(j.file + '.mp3', Buffer.from(await r.arrayBuffer()));
  const meta = j.kind === 'score' ? { id: j.id, hash: j.h, model: used, song_id: r.headers.get('song-id'), chunks: spec.score.chunks }
    : j.kind === 'cue' ? { id: j.id, hash: j.h, model: used, ms: j.cue.ms, prompt: j.cue.prompt } : { id: j.id, hash: j.h, sec: j.s.sec, text: j.s.text };
  fs.writeFileSync(j.file + '.json', JSON.stringify(meta, null, 1));
  console.log(`made ${j.kind} ${j.id}`);
}
const after = await account();
console.log(`credits left now: ${after.left} (the count lags a few minutes)`);
