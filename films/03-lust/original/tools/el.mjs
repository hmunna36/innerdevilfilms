// ElevenLabs helper for LUST. Uses only the PAID key (ELEVENLABS_API_KEY_2); never prints it.
import fs from 'node:fs';
const env = Object.fromEntries(fs.readFileSync(process.env.HOME + '/.config/va/elevenlabs.env', 'utf8')
  .split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]));
export const KEY = env.ELEVENLABS_API_KEY_2;
export async function api(path, opts = {}) {
  const r = await fetch('https://api.elevenlabs.io' + path, { ...opts, headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  if (!r.ok) throw new Error(`${path} → ${r.status} ${(await r.text()).slice(0, 300)}`);
  return r;
}
export async function balance() {
  const s = await (await api('/v1/user/subscription')).json();
  return { tier: s.tier, used: s.character_count, limit: s.character_limit, left: s.character_limit - s.character_count, resets: new Date(s.next_character_count_reset_unix * 1000).toISOString() };
}
if (process.argv[2] === 'status') {
  console.log(JSON.stringify(await balance()));
  const v = await (await api('/v1/voices')).json();
  const want = /^(Brian|Callum|Bill|Adam|George|Daniel|Eric|Liam|Will|Chris|Roger|Charlie)\b/;
  console.log(JSON.stringify(v.voices.filter(x => want.test(x.name)).map(x => ({ id: x.voice_id, name: x.name, cat: x.category, desc: x.labels && (x.labels.description || x.labels.descriptive), age: x.labels && x.labels.age, accent: x.labels && x.labels.accent }))));
}
