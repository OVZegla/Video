// Extrait toutes les répliques say('...') de main.js -> lines.json [{id, voice, text}]
import fs from 'node:fs';
const src = fs.readFileSync(new URL('./main.js', import.meta.url), 'utf8');
const lineId = (raw) => { let h = 5381; for (let i = 0; i < raw.length; i++) h = ((h * 33) ^ raw.charCodeAt(i)) >>> 0; return h.toString(16); };
const out = new Map();
for (const m of src.matchAll(/(?:say|wolfBlow)\('((?:[^'\\]|\\.)*)'/g)) {
  const raw = m[1].replace(/\\'/g, "'");
  const t = raw.match(/^\[(\w+)\]\s*/);
  out.set(lineId(raw), { id: lineId(raw), voice: t ? t[1] : 'narrateur', text: t ? raw.slice(t[0].length) : raw });
}
fs.writeFileSync(new URL('./lines.json', import.meta.url), JSON.stringify([...out.values()], null, 1));
console.log(out.size + ' répliques');
