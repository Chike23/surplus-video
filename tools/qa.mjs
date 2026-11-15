// qa.mjs: the automatic part of the review. Measures every spec it can (references/specs.md), then makes contact sheets
// for the reviewer agent.
// usage: node qa.mjs <P>                          checks + sheets every 0.5 s  -> P/qa/sheet-01.jpg ... + P/qa/checks.md
//        node qa.mjs <P> --times 12.4,12.6 [--full] close look at chosen times (--full = 1080x1920) -> P/qa/t-12.40.jpg
//        node qa.mjs <P> --burst 12.4,20.1        12 frames in a row (30 fps) from each time, one strip each -> P/qa/burst-12.40.jpg
//        node qa.mjs <P> --layout                 one frame in the middle of every framing (shots + moves) -> P/qa/layout-01.jpg ...
//        options: --every 0.5  --samples 4  --cols 6 --rows 2
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
import { openPreview, grab, save } from './chrome.mjs';

const P = path.resolve(process.argv[2]);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const every = +arg('every', 0.5), samples = +arg('samples', 4), cols = +arg('cols', 6), rows = +arg('rows', 2);
const times = arg('times', null), burst = arg('burst', null), full = process.argv.includes('--full');
const Q = path.join(P, 'qa'); fs.mkdirSync(Q, { recursive: true });
const tile = (pattern, start, out, c = cols, r = rows) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-start_number', String(start), '-i', pattern,
  '-frames:v', '1', '-vf', `tile=${c}x${r}:padding=8:margin=8:color=white`, out]);

const { browser, page, errors, gpu } = await openPreview(P);
const info = await page.evaluate(() => ({ D: window.DURATION, shots: window.style.shots || null, moves: window.style.moves || null,
  payoff: window.style.payoff ?? null, T: window.TIMING || null,
  W: window.S.W, H: window.S.H, fps: window.S.R.fps, canProbe: typeof window.S.update === 'function' }));

if (times) { // close look
  for (const t of times.split(',').map(Number)) {
    const f = path.join(Q, `t-${t.toFixed(2)}.jpg`);
    save(await grab(page, t, { samples: full ? undefined : samples, w: full ? 0 : 540 }), f); console.log(f);
  }
  await browser.close(); process.exit(0);
}
if (burst) { // 12 frames in a row: anticipation, overshoot, eyes-first, impact freezes
  for (const t0 of burst.split(',').map(Number)) {
    for (let k = 0; k < 12; k++) save(await grab(page, t0 + k / 30, { samples, w: 360, quality: 0.85 }), path.join(Q, `b-${String(k).padStart(2, '0')}.jpg`));
    const f = path.join(Q, `burst-${t0.toFixed(2)}.jpg`); tile(path.join(Q, 'b-%02d.jpg'), 0, f, 6, 2);
    for (let k = 0; k < 12; k++) fs.rmSync(path.join(Q, `b-${String(k).padStart(2, '0')}.jpg`));
    console.log(f);
  }
  await browser.close(); process.exit(0);
}
if (process.argv.includes('--layout')) { // the layout check: one frame per framing, time stamped, for agents/layout-check.md
  const ts = [...(info.shots || []), ...(info.moves || [])].map((e) => e.t).sort((a, b) => a - b), per = cols * rows;
  for (const f of fs.readdirSync(Q)) if (/^(l-\d+|layout-\d+)\.jpg$/.test(f)) fs.rmSync(path.join(Q, f));
  for (let k = 0; k < ts.length; k++) save(await grab(page, (ts[k] + (ts[k + 1] ?? info.D)) / 2, { samples, w: 360, quality: 0.85 }), path.join(Q, `l-${String(k).padStart(4, '0')}.jpg`));
  await browser.close();
  for (let s = 0; s < Math.ceil(ts.length / per); s++) { const f = path.join(Q, `layout-${String(s + 1).padStart(2, '0')}.jpg`); tile(path.join(Q, 'l-%04d.jpg'), s * per, f); console.log(f); }
  for (const f of fs.readdirSync(Q)) if (/^l-\d+\.jpg$/.test(f)) fs.rmSync(path.join(Q, f));
  process.exit(0);
}

// ---- checks: each line OK / WARN / FAIL. FAIL = a spec (or a hard rule) missed; WARN = script-side or for a closer look.
const out = [], ok = (c, msg) => out.push(`${c ? 'OK  ' : 'FAIL'} ${msg}`), warn = (c, msg) => out.push(`${c ? 'OK  ' : 'WARN'} ${msg}`);
const head = (s) => out.push(`\n## ${s}`), note = (s) => out.push(`INFO ${s}`);
const within = (x, a, b) => x >= a - 1e-9 && x <= b + 1e-9, f2 = (x) => x.toFixed(2), pc = (x) => `${Math.round(x * 100)} %`;
const at = (ts) => ts.slice(0, 8).map(f2).join(', ') + (ts.length > 8 ? ` (+${ts.length - 8} more)` : '');
const { D, T, W, H, fps, payoff } = info, SIZES = ['xwide', 'wide', 'full', 'medium', 'close', 'insert'];

head('Format and voice');
ok(W === 1080 && H === 1920, `frame ${W}x${H} (spec 1080x1920)`);
ok(fps === 30, `${fps} fps (spec 30)`);
ok(within(D, 45, 60), `length ${f2(D)} s (spec 45-60)`);
let spoken = 0;
if (T) {
  const sc = [...new Set(T.words.map((w) => w.scene))];
  ok(sc.length >= 3 && sc.length <= 4, `${sc.length} story parts [S#] (want 3-4)`);
  spoken = T.words.at(-1).end - T.words[0].start; const rate = T.words.length / spoken;
  ok(within(rate, 2.8, 3.2), `speech ${f2(rate)} words/s (spec 3, 2.8-3.2; fix it in the script and take it again: v4 ignores the speed setting; never re-time the audio)`);
  const lo = 130 + ((D - 45) * 45) / 15, hi = 150 + ((D - 45) * 45) / 15;
  warn(within(T.words.length, lo * 0.97, hi * 1.03), `${T.words.length} words for ${f2(D)} s (spec about ${Math.round(lo)}-${Math.round(hi)}; rewrite a script you wrote; tell the user if it's theirs)`);
  warn(!T.misheard.length, `Whisper matched every word${T.misheard.length ? ': ' + T.misheard.join('; ') : ''}`);
  const hold = D - T.words.at(-1).end;
  ok(within(hold, 0.8, 2.0), `picture holds ${f2(hold)} s after the last word (spec: end on the payoff, no outro; 0.8-2 s)`);
  const ys = T.words.findIndex((w, i) => /^you$/i.test(w.w.replace(/[^a-z]/gi, '')) && /^see/i.test((T.words[i + 1]?.w || '').replace(/[^a-z]/gi, '')));
  note(ys >= 0 ? `"You see" at ${f2(T.words[ys].start)} s (${pc(T.words[ys].start / D)} of the way; spec: right after the hook, or about two-thirds in)` : '"You see" is not in the script (rewrite a script you wrote; tell the user if it\'s theirs)');
} else out.push('FAIL no TIMING (run voice.mjs)');
if (payoff != null) warn(within((D - payoff) / D, 0.10, 0.15), `payoff at ${f2(payoff)} s, the last ${pc((D - payoff) / D)} (spec 10-15 %; rewrite a script you wrote; tell the user if it's theirs)`);
else out.push('FAIL style has no `payoff` time (references/specs.md)');

// ---- the declared timeline: shots (scene changes) and moves (pans and zooms inside a shot)
const shotsOk = Array.isArray(info.shots) && info.shots.length && info.shots.every((s) => s && typeof s.t === 'number' && s.place && SIZES.includes(s.size));
const movesOk = Array.isArray(info.moves) && info.moves.every((m) => m && typeof m.t === 'number' && SIZES.includes(m.size));
const shots = shotsOk ? [...info.shots].filter((s) => s.t < D).sort((a, b) => a.t - b.t) : [];
const moves = movesOk ? [...info.moves].filter((m) => m.t < D).sort((a, b) => a.t - b.t) : [];
head('Shots and places');
if (!shotsOk) out.push('FAIL style needs `shots: [{ t, place, size, how, dur }]`, size one of ' + SIZES.join('|') + ' (references/specs.md)');
else {
  ok(shots[0].t <= 0.05, `the first shot starts at 0 (${f2(shots[0].t)})`);
  const len = shots.map((s, i) => (shots[i + 1]?.t ?? D) - s.t), n = shots.length;
  ok(within(D / n, 3.1, 5.1), `${n} shots, a new one every ${f2(D / n)} s on average (spec 4.3, 3.1-5.1: about ${Math.round(D / 4.3)} for this length)`);
  const li = len.indexOf(Math.max(...len));
  ok(len[li] <= 8.6, `longest shot ${f2(len[li])} s from ${f2(shots[li].t)} (spec none over 8.6)`);
  const short = shots.filter((_, i) => len[i] < 1.1);
  ok(within(short.length / n, 0.05, 0.2), `${short.length} of ${n} shots under 1.1 s (spec about 1 in 10, 5-20 %)${short.length ? ': ' + at(short.map((s) => s.t)) : ''}`);
  const changes = shots.slice(1), moved = changes.filter((s, i) => s.place !== shots[i].place), visits = 1 + moved.length;
  ok(changes.length && within(moved.length / changes.length, 0.55, 0.85), `${moved.length} of ${changes.length} scene changes go to a new place (spec 7 in 10, 55-85 %)`);
  ok(within(D / visits, 5, 8), `the place changes every ${f2(D / visits)} s (spec 6-7, 5-8)`);
  ok(within(visits, 7, 13), `${visits} place visits, ${new Set(shots.map((s) => s.place)).size} different places (spec about 7 at 45 s, 9 at 60 s; 7-13)`);
  const flies = moved.filter((s) => s.how === 'fly');
  ok(moved.length && within(flies.length / moved.length, 0.1, 0.35), `${flies.length} of ${moved.length} place changes are camera flights, no cut (spec about 1 in 5, 10-35 %)`);
  const badHow = changes.filter((s) => !(s.how === 'cut' && !s.dur) && !(s.how === 'fly' && within(s.dur, 0.25, 0.5)));
  ok(!badHow.length, `every scene change is a straight 'cut' or a 0.25-0.5 s 'fly' (no wipes)${badHow.length ? ': not at ' + at(badHow.map((s) => s.t)) : ''}`);
  const notWide = shots.filter((s, i) => (i === 0 || s.place !== shots[i - 1].place) && !['xwide', 'wide'].includes(s.size));
  ok(!notWide.length, `every new place opens wide${notWide.length ? ': not at ' + at(notWide.map((s) => s.t)) : ''}`);
}
head('Framing changes');
let F = [];
if (!movesOk) out.push('FAIL style needs `moves: [{ t, size }]`: every pan or zoom inside a shot (references/specs.md)');
else if (shotsOk) {
  F = [...shots.map((s) => ({ ...s, kind: 'shot' })), ...moves.map((m) => ({ ...m, kind: 'move' }))].sort((a, b) => a.t - b.t);
  const ch = F.filter((e) => e.t > 0.05), hook = ch.filter((e) => e.t < 4);
  const rest = ch.filter((e) => e.t >= 4), noWhy = moves.filter((m) => m.t >= 4 && !['follow', 'reveal', 'react'].includes(m.why));
  ok(rest.length && within((D - 4) / rest.length, 2.5, 3.5), `after the first 4 s, ${rest.length} framing changes, one every ${f2((D - 4) / Math.max(1, rest.length))} s (spec about 3, 2.5-3.5, cuts included: about ${Math.round((D - 4) / 3)} for this length)`);
  ok(!noWhy.length, `every move after 4 s has a why: follow, reveal or react${noWhy.length ? ': not at ' + at(noWhy.map((m) => m.t)) : ''}`);
  ok(within(hook.length, 4, 5), `${hook.length} framing changes in the first 4 s (spec 4-5)${hook.length ? ': ' + at(hook.map((e) => e.t)) : ''}`);
  ok(hook.filter((e) => e.kind === 'shot').length <= 2, `${hook.filter((e) => e.kind === 'shot').length} scene changes in the first 4 s (spec at most 1-2)`);
  if (T) { // a framing change should land on a word start or between words, not mid-word
    const mid = ch.filter((e) => T.words.some((w) => e.t > w.start + 0.08 && e.t < w.end - 0.08));
    warn(!mid.length, `framing changes land between words${mid.length ? ': mid-word at ' + at(mid.map((e) => e.t)) : ''}`);
  }
  head('Shot sizes (share of screen time, from the declared sizes)');
  const seg = F.map((e, i) => ({ size: e.size, t: e.t, d: (F[i + 1]?.t ?? D) - e.t })), share = (s) => seg.filter((x) => x.size === s).reduce((a, x) => a + x.d, 0) / D;
  ok(within(share('full') + share('medium'), 0.45, 0.7), `full + medium ${pc(share('full') + share('medium'))} (spec home base, 45-70 %)`);
  ok(within(share('xwide') + share('wide'), 0.15, 0.35), `extreme wide + wide ${pc(share('xwide') + share('wide'))} (spec 15-35 %)`);
  const closes = seg.filter((x) => x.size === 'close');
  ok(closes.length <= 5 && share('close') <= 0.12, `${closes.length} face close-ups, ${pc(share('close'))} (spec the 3-4 biggest reactions: at most 5, at most 12 %)${closes.length ? ': ' + at(closes.map((x) => x.t)) : ''}`);
  ok(within(share('insert'), 0.05, 0.15), `object close-ups ${pc(share('insert'))} (spec about 10 %, 5-15 %)`);
}

// ---- the camera itself, every frame, no rendering: how fast the picture moves (frame heights a second) and its angle
head('Camera (measured every frame)');
if (!info.canProbe) out.push('FAIL kit/stage.js has no S.update (copy the current kit into P/kit)');
else {
  const cam = await page.evaluate((D) => {
    const { S, THREE } = window, c = S.camera, n = Math.round(D * 30), pts = [[0, 0], [-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]];
    const speed = [], angle = [], q = new THREE.Quaternion(), v = new THREE.Vector3(); let prev = null;
    for (let i = 0; i <= n; i++) {
      S.update(Math.min(i / 30, D)); c.updateMatrixWorld(); c.updateProjectionMatrix();
      if (prev) { let s = 0; for (const p of prev) { v.copy(p.w).project(c); s += Math.hypot(((v.x - p.x) / 2) * c.aspect, (v.y - p.y) / 2); } speed.push((s / prev.length) * 30); }
      const th = Math.tan((c.fov * Math.PI) / 360), d = Math.max(0.5, c.userData.focus || 8);   // points at the focus distance
      prev = pts.map(([x, y]) => ({ x, y, w: c.localToWorld(new THREE.Vector3(x * th * c.aspect * d, y * th * d, -d)) }));
      v.set(0, 0, -1).applyQuaternion(c.getWorldQuaternion(q)); angle.push((Math.acos(Math.max(-1, Math.min(1, -v.z))) * 180) / Math.PI);
    }
    return { speed, angle };
  }, D);
  const sp = cam.speed, N = sp.length, tAt = (i) => (i + 1) / 30;
  const fast = sp.filter((s) => s >= 0.5).length / N;
  ok(fast <= 0.12, `fast moves on ${pc(fast)} of frames (spec at most about 1 in 8, 12 %)`);
  const inChange = (t) => shots.some((s) => t >= s.t - 0.04 && t <= s.t + (s.how === 'cut' ? 0 : s.dur || 0.5) + 0.04); // a cut's jump is one frame
  const smear = sp.map((s, i) => [s, tAt(i)]).filter(([s, t]) => s > 4 && !inChange(t)).map(([, t]) => t);
  ok(!smear.length, `no smeared whip: the picture never moves over 4 frame heights a second${smear.length ? ': at ' + at(smear) + ' (look closer)' : ''}`);
  let runs = 0; for (let i = 0, gap = 9; i < N; i++) { if (sp[i] >= 0.5) { if (gap >= 2) runs++; gap = 0; } else gap++; }
  if (moves.length) warn(runs >= 0.7 * moves.length, `${runs} fast moves measured for ${moves.length} declared moves (a declared move with no fast camera move doesn't count)`);
  const mx = Math.max(...cam.angle), mi = cam.angle.indexOf(mx);
  ok(mx <= 30, `camera angle from straight-on at most ${mx.toFixed(1)}° at ${f2(mi / 30)} (spec within about 25°; over 30 fails)`);
  warn(mx <= 25, `camera within 25° of straight-on`);
}

head('Sound and code');
// sound(k) only runs on Play or in the render, so a broken score hides from the picture checks: run it on a stub
const snd = await page.evaluate((D) => { const bad = []; let n = 0; const k = new Proxy({}, { get: (_, f) => (...a) => { n++; if (typeof a[1] === 'number' && !(a[1] >= 0 && a[1] <= D)) bad.push(`${f} ${a[0]} at ${a[1]}`); return k; } });
  if (!window.style.sound) return { n: 0, bad, err: null }; try { window.style.sound(k); return { n, bad, err: null }; } catch (e) { return { n, bad, err: String(e) }; } }, D);
ok(!snd.err && !snd.bad.length, `sound score runs (${snd.n} calls)${snd.err ? ': ' + snd.err : ''}${snd.bad.length ? ': times outside the film: ' + snd.bad.slice(0, 5).join(', ') : ''}`);
ok(!errors.length, `no page errors${errors.length ? ':\n     ' + errors.slice(0, 8).join('\n     ') : ''}`);
note(`GPU: ${gpu}`);

// ---- contact sheets: every `every` s, 360 px wide, time stamped; cols x rows per sheet. Each frame's light stats too.
for (const f of fs.readdirSync(Q)) if (/^(s-\d+\.jpg|sheet-\d+\.jpg)$/.test(f)) fs.rmSync(path.join(Q, f));
const ts = []; for (let t = 0; t < D - 1e-6; t += every) ts.push(+t.toFixed(3)); ts.push(+(D - 1 / 30).toFixed(3));
const st = [];
for (let k = 0; k < ts.length; k++) {
  save(await grab(page, ts[k], { samples, w: 360, quality: 0.85 }), path.join(Q, `s-${String(k).padStart(4, '0')}.jpg`));
  st.push(await page.evaluate(() => window.__stats));
}
head('Lamps (measured on the sheet frames, without the caption band)');
const mean = (k) => st.reduce((a, s) => a + s[k], 0) / st.length, med = [...st.map((s) => s.luma)].sort((a, b) => a - b)[st.length >> 1];
ok(within(mean('luma'), 0.36, 0.44), `average brightness ${pc(mean('luma'))} (spec about 40 %, 36-44 %)`);
ok(within(mean('sat'), 0.42, 0.53), `colour strength ${pc(mean('sat'))} (spec 45-50 %, 42-53 %)`);
ok(mean('black') <= 0.01, `pure black on ${(mean('black') * 100).toFixed(1)} % of the picture (spec at most 1 %; unlit areas deep indigo)`);
const gaps = st.filter((s) => s.black > 0.05);
warn(!gaps.length, `no frame with a black gap over 5 % of the picture${gaps.length ? ': ' + at(gaps.map((s) => s.t)) : ''}`);
ok(st[0].black <= 0.01 && st[0].luma >= 0.75 * med, `first frame fully lit: brightness ${pc(st[0].luma)} (video median ${pc(med)}), black ${(st[0].black * 100).toFixed(1)} %`);
const dips = [];
for (const s of shots.slice(1)) { // the middle of each scene change: never a dip to black
  const t = Math.min(D - 0.02, s.t + (s.how === 'cut' ? 2 / 30 : (s.dur || 0.4) / 2)); await grab(page, t, { samples: 1, w: 120 });
  const x = await page.evaluate(() => window.__stats); if (x.luma < 0.6 * med || x.black > 0.05) dips.push(t);
}
if (shots.length > 1) ok(!dips.length, `no scene change dips to black (middle of each change)${dips.length ? ': at ' + at(dips) : ''}`);
await browser.close();

const per = cols * rows, sheets = Math.ceil(ts.length / per);
for (let s = 0; s < sheets; s++) tile(path.join(Q, 's-%04d.jpg'), s * per, path.join(Q, `sheet-${String(s + 1).padStart(2, '0')}.jpg`));
for (const f of fs.readdirSync(Q)) if (/^s-\d+\.jpg$/.test(f)) fs.rmSync(path.join(Q, f));
const fails = out.filter((l) => l.startsWith('FAIL')).length, warns = out.filter((l) => l.startsWith('WARN')).length;
const report = `# QA checks (references/specs.md)\n\n${fails} FAIL, ${warns} WARN.\n${out.join('\n')}\n\nSheets: ${sheets} (qa/sheet-01.jpg ...), ${per} frames each, one every ${every} s, time stamped top-left.\n`;
fs.writeFileSync(path.join(Q, 'checks.md'), report); console.log(report);
