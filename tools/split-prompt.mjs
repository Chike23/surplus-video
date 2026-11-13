// Splits one atlas "Copy prompt" text into the parts the skill uses, inside styles/<slug>/:
//   prompt.md     the whole prompt, as copied (for the record)
//   card.md       the STYLE CARD (look, motion, light, materials, camera, finish, good for)
//   reference.js  the REFERENCE STYLE SOURCE (a full registerStyle(...) block in this look)
//   stage.js / sound.js  only when that style ships a kit that differs from SKILL/kit (otherwise the shared kit is used)
// usage: node split-prompt.mjs <prompt.txt> <styles/slug>
import fs from 'node:fs'; import path from 'node:path';

const [src, dir] = process.argv.slice(2);
if (!src || !dir) { console.error('usage: node split-prompt.mjs <prompt.txt> <styles/slug>'); process.exit(1); }
const kitDir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'kit');
let txt = fs.readFileSync(src, 'utf8').replace(/\r\n/g, '\n');
txt = txt.replace(/^.*<\/?pasted_content[^>]*>.*$/gm, '').trim(); // a prompt saved from a chat paste

const HEADS = ['STYLE CARD', 'STAGE KIT', 'SOUND KIT', 'REFERENCE STYLE SOURCE'];
const at = HEADS.map((h) => { const m = new RegExp('^' + h + '\\b[^\\n]*$', 'm').exec(txt); return m ? { h, i: m.index, body: m.index + m[0].length } : null; }).filter(Boolean);
const sec = (head) => { // text between this heading line and the next of the four headings
  const k = at.findIndex((a) => a.h === head); if (k < 0) return null;
  const end = at.filter((a) => a.i > at[k].i).map((a) => a.i).sort((a, b) => a - b)[0] ?? txt.length;
  return txt.slice(at[k].body, end).trim();
};
const code = (s) => (s && (s.match(/```(?:js|javascript)?\n([\s\S]*?)\n```/) || [])[1]) || null;

const card = sec('STYLE CARD'), stage = code(sec('STAGE KIT')), sound = code(sec('SOUND KIT')), ref = code(sec('REFERENCE STYLE SOURCE'));
const refHead = (txt.match(/^REFERENCE STYLE SOURCE[^\n]*/m) || [''])[0];
if (!card || !stage || !sound || !ref) throw new Error(`missing part(s): ${[!card && 'card', !stage && 'stage', !sound && 'sound', !ref && 'reference'].filter(Boolean)}`);

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'prompt.md'), txt + '\n');
fs.writeFileSync(path.join(dir, 'card.md'), card + '\n');
fs.writeFileSync(path.join(dir, 'reference.js'), `// ${refHead}\n${ref}\n`);
const same = (name, body) => {
  const shared = fs.readFileSync(path.join(kitDir, name), 'utf8').trim();
  if (shared === body.trim()) { fs.rmSync(path.join(dir, name), { force: true }); return 'shared'; }
  fs.writeFileSync(path.join(dir, name), body + '\n'); return 'OWN COPY (differs from kit)';
};
console.log(`${path.basename(dir)}: card ${card.length} chars, reference ${ref.length} chars, stage ${same('stage.js', stage)}, sound ${same('sound.js', sound)}`);
