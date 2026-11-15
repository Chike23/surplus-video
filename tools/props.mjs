// props.mjs: renders library props alone on a small lit stage, one frame per state, for the prop judge and the library.
// usage: node props.mjs <name> [<name> ...]   -> SKILL/props/<name>.jpg (its states left to right)
// Each SKILL/props/<name>.js starts with  // @prop {"what": "...", "states": [{}, ...]}  and defines <camelName>Art(s)
// (references/build.md, "Props"). It is drawn with the painting block of the style's reference.js.
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';
import { openPreview, grab, save } from './chrome.mjs';

const SKILL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), LIB = path.join(SKILL, 'props');
const names = process.argv.slice(2);
if (!names.length) throw new Error('usage: node props.mjs <name> [<name> ...]  (files in SKILL/props)');
const ref = fs.readFileSync(path.join(SKILL, 'styles/spotlight-stage/reference.js'), 'utf8');
const paint = (ref.match(/\/\/ @paint-start.*\n([\s\S]*?)\/\/ @paint-end/) || [])[1];
if (!paint) throw new Error('reference.js has no @paint-start ... @paint-end block');

const fn = (n) => n.replace(/-(\w)/g, (_, c) => c.toUpperCase()) + 'Art', code = [], cards = [], group = [], count = {};
for (const n of names) {
  const src = fs.readFileSync(path.join(LIB, n + '.js'), 'utf8');
  let head = null; try { head = JSON.parse((src.match(/^\/\/ @prop (.*)$/m) || [])[1]); } catch {}
  if (!head || !Array.isArray(head.states) || !head.states.length) throw new Error(`${n}.js needs a first line: // @prop {"what": "...", "states": [{}]}`);
  if (!new RegExp(`function ${fn(n)}\\b`).test(src)) throw new Error(`${n}.js must define function ${fn(n)}(s = {})`);
  code.push(src); count[n] = head.states.length;
  for (const s of head.states) { cards.push(`() => ${fn(n)}(${JSON.stringify(s)})`); group.push(names.indexOf(n)); }
}

// a throwaway project: the kit, no voice, a style that shows card k from t = k to k + 1, framed to fill the frame
const D = path.join(LIB, '.sheet'); fs.rmSync(D, { recursive: true, force: true });
fs.mkdirSync(path.join(D, 'src'), { recursive: true }); fs.cpSync(path.join(SKILL, 'kit'), path.join(D, 'kit'), { recursive: true });
fs.writeFileSync(path.join(D, 'vo.js'), `window.TIMING = { duration: ${cards.length}, words: [], lines: [] };\n`);
fs.writeFileSync(path.join(D, 'src/style.js'), `{
  registerStyle({ id: 'prop-sheet', name: 'Prop sheet', duration: ${cards.length},
    render: { samples: 8, shutter: 0, tone: 'filmic', exposure: 1.0, bloom: 0.2, bloomThreshold: 1.3, vignette: 0.3, grain: 0.012, fov: 30, background: '#0c0a24' },
    build(S) {
      const { THREE, K, scene, camera } = S, TAU = Math.PI * 2;
      const add = (geo, mat, pos, parent = scene, cast = true) => { const m = new THREE.Mesh(geo, mat); if (pos) m.position.set(pos[0], pos[1], pos[2]); m.castShadow = cast; m.receiveShadow = true; parent.add(m); return m; };
${paint}
${code.join('\n')}
      add(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: '#3b1a2e', roughness: 1 }), [0, 20, -0.6], scene, false);   // a velvet drop
      add(new THREE.PlaneGeometry(60, 6).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#5a3a24', roughness: 0.6 }), [0, 0, 2.4], scene, false);   // the boards
      scene.add(new THREE.HemisphereLight('#8a84c6', '#2a1a28', 2));
      const key = new THREE.SpotLight('#ffe6c4', 1, 0, 0.5, 0.6, 0); key.castShadow = true; scene.add(key, key.target);
      const cards = [${cards.join(', ')}].map((f) => { const m = cutout(f()); m.visible = false; return m; }), group = ${JSON.stringify(group)};
      const boxes = cards.map((_, i) => cards.filter((_, k) => group[k] === group[i]).map((m) => m.userData.box)   // all states of a prop share one framing
        .reduce((a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) })));
      return { update(t) {
        const i = Math.max(0, Math.min(cards.length - 1, Math.floor(t)));
        cards.forEach((m, k) => (m.visible = k === i));
        const b = boxes[i], cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
        const h = (Math.max(b.y1 - b.y0, b.x1 - b.x0) * 1.25 * 16) / 9, d = h / 2 / Math.tan((15 * Math.PI) / 180);   // fills the middle square
        K.look(camera, [cx, cy, d], [cx, cy, 0]); camera.userData.focus = d;
        key.position.set(cx - 0.4 * d, cy + 0.6 * d, d); key.target.position.set(cx, cy, 0); key.intensity = 4;
      } };
    } });
}
`);
execFileSync('node', [path.join(SKILL, 'tools/build.mjs'), D], { stdio: 'inherit' });

const { browser, page, errors } = await openPreview(D);
let k = 0;
for (const n of names) {
  for (let s = 0; s < count[n]; s++) save(await grab(page, k++ + 0.5, { samples: 8 }), path.join(D, `p-${s}.jpg`));
  const out = path.join(LIB, n + '.jpg');
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-start_number', '0', '-i', path.join(D, 'p-%d.jpg'), '-frames:v', '1',
    '-vf', `crop=iw:iw,scale=480:480,tile=${count[n]}x1:padding=8:margin=8:color=white`, out]);
  for (let s = 0; s < count[n]; s++) fs.rmSync(path.join(D, `p-${s}.jpg`));
  console.log(out);
}
await browser.close();
if (errors.length) console.log('page errors:\n  ' + errors.join('\n  '));
fs.rmSync(D, { recursive: true, force: true });
