// render.mjs: the final MP4, only after the user approved the preview. Every frame at the style's full sample count,
// piped into ffmpeg. The sound score is rendered offline as two stems (effects, music bed) and mixed with the voice by
// mix.py, the only mixer (references/specs.md section 6). Neither the picture nor the voice is sped up or slowed down.
// usage: node render.mjs <P> [--samples 16]   -> P/out/<folder name>.mp4 + P/out/check-*.jpg
//        node render.mjs <P> --audio          only the mix (P/voice/mix.wav, P/mix.js) and a rebuilt preview that plays it
import fs from 'node:fs'; import path from 'node:path'; import { spawn, spawnSync, execFileSync } from 'node:child_process';
import { openPreview, grab } from './chrome.mjs';

const P = path.resolve(process.argv[2]), HERE = path.dirname(new URL(import.meta.url).pathname);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const FPS = 30, O = path.join(P, 'out'); fs.mkdirSync(O, { recursive: true });
const name = path.basename(P), silent = path.join(O, 'picture.mp4'), final = path.join(O, `${name}.mp4`), mixWav = path.join(P, 'voice', 'mix.wav');

let { browser, page, gpu } = await openPreview(P);
const D = await page.evaluate(() => window.DURATION);

// the audio first (fast, and it stops here if a level rule can't be met): two stems, then mix.py
for (const stem of ['sfx', 'bed']) {
  const b64 = await page.evaluate(async (D, stem) => {
    const r = await SOUND.renderOffline((k) => window.style.sound(k), D, 48000, { stem });
    const u8 = new Uint8Array(r.inter.buffer); let s = '';
    for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return btoa(s);
  }, D, stem);
  const raw = path.join(P, 'voice', `${stem}.f32`); fs.writeFileSync(raw, Buffer.from(b64, 'base64'));
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'f32le', '-ar', '48000', '-ac', '2', '-i', raw, '-c:a', 'pcm_f32le', path.join(P, 'voice', `${stem}.wav`)]);
  fs.rmSync(raw);
}
execFileSync('python3', [path.join(HERE, 'mix.py'), P], { stdio: 'inherit' });
if (process.argv.includes('--audio')) {
  await browser.close();
  execFileSync('node', [path.join(HERE, 'build.mjs'), P], { stdio: 'inherit' });
  process.exit(0);
}
const samples = +arg('samples', await page.evaluate(() => window.style.render.samples || 16));
const N = Math.round(D * FPS);
console.log(`rendering ${N} frames at ${samples} samples on ${gpu}`);

const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((r, j) => ff.on('close', (c) => (c ? j(new Error('ffmpeg exited ' + c)) : r())));
const t0 = Date.now();
// A heavy scene at full size can slow down frame after frame until the GPU drops the WebGL context; every frame after
// that is black. Reopen the page when a frame gets slow (before the loss) or the context is lost, and redo that frame.
const lost = () => page.evaluate(() => { const g = document.getElementById('stage').getContext('webgl2'); return !g || g.isContextLost(); });
let fresh = 0, reopens = 0;
const reopen = async (why) => { reopens++; await browser.close(); ({ browser, page } = await openPreview(P)); fresh = 0; if (why) console.log(`  reopened the page (${why})`); };
for (let i = 0; i < N; i++) {
  let jpg;
  for (let tries = 0; ; tries++) {
    const f0 = Date.now();
    jpg = Buffer.from((await grab(page, i / FPS, { samples, quality: 0.95 })).split(',')[1], 'base64');
    const ms = Date.now() - f0;
    if (!(await lost())) { if (!fresh) fresh = ms; if (ms > Math.max(2500, 2.5 * fresh)) await reopen(); break; }
    if (tries >= 3) throw new Error(`GPU context lost at frame ${i} ${tries + 1} times; render with --samples ${Math.max(4, samples >> 1)}`);
    await reopen(`GPU context lost at frame ${i}`);
  }
  if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once('drain', r));
  if (i % 90 === 89) { const el = (Date.now() - t0) / 1000; console.log(`  ${i + 1}/${N}  ~${Math.round((el / (i + 1)) * (N - i - 1))} s left`); }
}
ff.stdin.end(); await done;

await browser.close();

// the picture and mix.py's mix, as they are (no re-timing, no further processing)
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', silent, '-i', mixWav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
  '-ar', '48000', '-t', D.toFixed(3), '-movflags', '+faststart', final]);
fs.rmSync(silent);

// frames to look at before calling it done: start, quarter points, last frame
for (const [k, t] of [0.05, D * 0.25, D * 0.5, D * 0.75, D - 0.05].entries())
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-ss', t.toFixed(3), '-i', final, '-frames:v', '1', '-q:v', '3', path.join(O, `check-${k + 1}.jpg`)]);
const meter = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', final, '-af', 'ebur128', '-f', 'null', '-']).stderr.toString(); // ebur128 reports on stderr
const lufs = (meter.match(/Integrated loudness:\s*I:\s*(-?[\d.]+) LUFS/) || [])[1];
console.log(`done: ${final} (${D.toFixed(2)} s, ${lufs} LUFS, ${Math.round((Date.now() - t0) / 1000)} s to render). Check frames: ${O}/check-1..5.jpg`);
