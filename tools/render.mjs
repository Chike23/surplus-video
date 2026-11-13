// render.mjs: the final MP4, only after the user approved the preview. Every frame at the style's full sample count,
// piped into ffmpeg; the effects score rendered offline in voiceover mode, mixed under the narration at about -15 LUFS.
// usage: node render.mjs <P> [--samples 16] [--sfx -4]   -> P/out/<folder name>.mp4 + P/out/check-*.jpg
import fs from 'node:fs'; import path from 'node:path'; import { spawn, spawnSync, execFileSync } from 'node:child_process';
import { openPreview, grab } from './chrome.mjs';

const P = path.resolve(process.argv[2]);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const FPS = 30, O = path.join(P, 'out'); fs.mkdirSync(O, { recursive: true });
const name = path.basename(P), silent = path.join(O, 'picture.mp4'), sfx = path.join(O, 'sfx.f32'), final = path.join(O, `${name}.mp4`);

let { browser, page, gpu } = await openPreview(P);
const D = await page.evaluate(() => window.DURATION);
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

// effects score, offline, voiceover mode (beds and music drop out, minor sounds sit lower)
const b64 = await page.evaluate(async (D) => {
  const r = await SOUND.renderOffline((k) => window.style.sound(k), D, 48000, { voiceover: !!window.VO_AUDIO });
  const u8 = new Uint8Array(r.inter.buffer); let s = '';
  for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return btoa(s);
}, D);
await browser.close();
fs.writeFileSync(sfx, Buffer.from(b64, 'base64'));

const voice = path.join(P, 'voice', 'voice.wav'), hasVoice = fs.existsSync(voice);
const inputs = ['-i', silent, '-f', 'f32le', '-ar', '48000', '-ac', '2', '-i', sfx, ...(hasVoice ? ['-i', voice] : [])];
const mix = hasVoice
  ? `[1:a]volume=${arg('sfx', -4)}dB[s];[2:a]aresample=48000,aformat=channel_layouts=stereo[v];[s][v]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=11[a]`
  : '[1:a]loudnorm=I=-15:TP=-1.5:LRA=11[a]';
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...inputs, '-filter_complex', mix, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
  '-ar', '48000', '-t', D.toFixed(3), '-movflags', '+faststart', final]);
fs.rmSync(sfx); fs.rmSync(silent);

// frames to look at before calling it done: start, quarter points, last frame
for (const [k, t] of [0.05, D * 0.25, D * 0.5, D * 0.75, D - 0.05].entries())
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-ss', t.toFixed(3), '-i', final, '-frames:v', '1', '-q:v', '3', path.join(O, `check-${k + 1}.jpg`)]);
const meter = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', final, '-af', 'ebur128', '-f', 'null', '-']).stderr.toString(); // ebur128 reports on stderr
const lufs = (meter.match(/Integrated loudness:\s*I:\s*(-?[\d.]+) LUFS/) || [])[1];
console.log(`done: ${final} (${D.toFixed(2)} s, ${lufs} LUFS, ${Math.round((Date.now() - t0) / 1000)} s to render). Check frames: ${O}/check-1..5.jpg`);
