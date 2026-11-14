// Builds P/preview.html: inlines the /*@include path*/ markers of P/kit/player.src.html (paths relative to P), adds the
// Google Fonts the style lists in `fonts: [...]`, and refuses style code that would break determinism.
// An optional marker /*@include? path*/ is left out when the file is missing, or older than src/style.js or vo.js (a stale mix).
// usage: node build.mjs <project dir>
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const P = resolve(process.argv[2] || '.');
const style = readFileSync(resolve(P, 'src/style.js'), 'utf8');
const banned = style.replace(/\/\/.*$/gm, '').match(/Math\.random|new Date|Date\.now|setTimeout|setInterval|performance\.now/g);
if (banned) throw new Error(`src/style.js uses ${[...new Set(banned)].join(', ')}: use K.rng(seed) and the time t instead`);

// fonts: ['260px "Anton"', '700 150px "Caveat"'] -> family=Anton&family=Caveat:wght@700
const specs = [...((style.match(/fonts:\s*\[([^\]]*)\]/) || [])[1] || '').matchAll(/['"`]([^'"`]*?)["]([^"]+)["]/g)];
const fam = {};
for (const [, pre, name] of specs) { const w = (pre.match(/\b([1-9]00)\b/) || [, '400'])[1]; (fam[name] ||= new Set()).add(w); }
const q = Object.entries(fam).map(([n, ws]) => `family=${n.replace(/ /g, '+')}${[...ws].join() === '400' ? '' : ':wght@' + [...ws].sort().join(';')}`).join('&');
const fontLink = q ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${q}&display=swap">` : '';

const html = readFileSync(resolve(P, 'kit/player.src.html'), 'utf8')
  .replace('<!--@fonts-->', fontLink)
  .replace(/\/\*@include(\?)? ([^*]+)\*\//g, (_, opt, p) => {
    const f = resolve(P, p.trim()), age = (x) => (existsSync(resolve(P, x)) ? statSync(resolve(P, x)).mtimeMs : 0);
    if (opt && !existsSync(f)) return '';
    if (opt && age(p.trim()) < Math.max(age('src/style.js'), age('vo.js'))) { console.log(`${p.trim()} is older than style.js or vo.js: left out (run render.mjs P --audio)`); return ''; }
    const code = readFileSync(f, 'utf8');
    if (/<\/script/i.test(code)) throw new Error(`${p} contains </script and would break the page`);
    return code;
  });
writeFileSync(resolve(P, 'preview.html'), html);
console.log(`preview.html: ${(html.length / 1024).toFixed(0)} KB, fonts: ${Object.keys(fam).join(', ') || 'none'}`);
