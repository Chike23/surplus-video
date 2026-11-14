// voice.mjs: narration for a project. ElevenLabs reads the script at a pace that already meets the spec, Whisper
// (whisper.cpp) times every word, and the words are lined up with the script. The take is never sped up, slowed down,
// cut or re-timed (owner's rule): only the silence before the first word and after the last is trimmed. Always Mark on
// Eleven v4 (config.json). v4 sets its own pace and ignores the speed setting (tested 2026-11-14: 1.0-1.2 all read
// about 3.0 words a second), so its pace comes from the script; on older models a miss means a new take at a nudged speed.
// Writes P/voice/raw.mp3 (the take), P/voice/voice.wav + voice.mp3 (final narration), P/timing.json, P/vo.js (for the player).
// usage: node voice.mjs <P>             new take(s) + timing
//        node voice.mjs <P> --retime    timing only, from the existing take (no cost)
//        --rate 3                       words a second to aim for (default: config.json rate; in range = rateMin-rateMax)
//        --tries 3                      most takes to reach the pace
//        node voice.mjs --list          list the voices on the ElevenLabs account
// Script: P/script.md, numbered lines under a "## Narration" heading, e.g.  3. [S2] Then pack it with dense calories.
// Key: env ELEVENLABS_API_KEY, else ~/.make-short-keys or ~/.surplus-video-keys (ELEVENLABS_API_KEY=... or Creator_key=...). Never printed.
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import { execFileSync } from 'node:child_process';

const SKILL = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const cfg = Object.assign({ model: 'eleven_v4', speed: 1.0, rate: 3.0, rateMin: 2.8, rateMax: 3.2, stability: 0.5, similarity: 0.8, style: 0.2, lead: 0.25, tail: 0.35,
  whisperModel: path.join(os.homedir(), '.cache/whisper-cpp/ggml-small.en.bin') }, JSON.parse(fs.readFileSync(path.join(SKILL, 'config.json'), 'utf8')));
const key = () => {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  for (const f of ['.surplus-video-keys', '.make-short-keys'].map((n) => path.join(os.homedir(), n))) {
    const m = fs.existsSync(f) && fs.readFileSync(f, 'utf8').match(/^(?:ELEVENLABS_API_KEY|Creator_key)\s*=\s*"?([^"\r\n]+)/m);
    if (m) return m[1].trim();
  }
  throw new Error('No ElevenLabs key: put ELEVENLABS_API_KEY=... in ~/.surplus-video-keys');
};
const el = async (url, init = {}) => {
  const r = await fetch('https://api.elevenlabs.io' + url, { ...init, headers: { 'xi-api-key': key(), 'Content-Type': 'application/json', ...(init.headers || {}) } });
  if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r;
};

if (process.argv[2] === '--list') {
  const { voices } = await (await el('/v1/voices')).json();
  for (const v of voices) console.log(`${v.voice_id}  ${v.name.padEnd(28)} ${Object.values(v.labels || {}).join(', ')}`);
  process.exit(0);
}

const P = path.resolve(process.argv[2]); const retime = process.argv.includes('--retime');
const argv = (k) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : undefined; };
const brief = fs.existsSync(path.join(P, 'brief.json')) ? JSON.parse(fs.readFileSync(path.join(P, 'brief.json'), 'utf8')) : {};
const voiceId = cfg.voiceId; if (!voiceId) throw new Error('no voiceId in config.json'); // always the owner's narrator, never per video
fs.mkdirSync(path.join(P, 'voice'), { recursive: true });
const V = (f) => path.join(P, 'voice', f);

// ---- the script: lines, scenes, words. [pause] marks are not used any more (the voice is never cut): they're dropped.
const md = fs.readFileSync(path.join(P, 'script.md'), 'utf8');
const body = (md.split(/^#+\s*narration.*$/im)[1] || '').split(/^#+\s/m)[0];
const lines = [...body.matchAll(/^\s*(\d+)\.\s+(.+)$/gm)].map(([, n, raw]) => ({ n: +n, raw: raw.trim() }));
if (!lines.length) throw new Error('no numbered lines under "## Narration" in script.md');
if (/\[pause/i.test(body)) console.log('note: [pause] marks are ignored (the voice is never cut or re-timed); remove them from script.md');
const words = []; let scene = 1;
for (const l of lines) {
  const s = l.raw.match(/^\[S(\d+)\]\s*/i); if (s) scene = +s[1];
  l.scene = scene;
  l.text = l.raw.replace(/\[(S\d+|pause[^\]]*)\]/gi, '').replace(/\s+/g, ' ').trim();
  // spoken words only: a lone dash or a tone tag for Eleven v3 ([excited]) is sent to ElevenLabs but isn't a word
  for (const tok of l.text.split(' ')) if (/[a-z0-9]/i.test(tok) && !/^\[[a-z ]+\]$/i.test(tok)) words.push({ i: words.length, w: tok, line: l.n, scene });
}
const text = lines.map((l) => l.text).join(' ');

// ---- 1. the take, at a pace that's already right (references/specs.md: 3 words a second, 2.8-3.2). Pace is
// words / (last word end - first word start) as Whisper hears it. Out of range: a new take at speed x target/measured,
// within ElevenLabs' 0.7-1.2. The audio itself is never sped up, slowed down or cut.
const ff = (args, opts) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...args], { maxBuffer: 1 << 30, ...opts });
const listen = () => {
  ff(['-i', V('raw.mp3'), '-ar', '16000', '-ac', '1', V('raw16k.wav')]);
  execFileSync('whisper-cli', ['-m', cfg.whisperModel, '-f', V('raw16k.wav'), '-ml', '1', '-sow', '-oj', '-of', V('whisper'), '-np', '-l', 'en'], { stdio: ['ignore', 'ignore', 'pipe'] });
  fs.rmSync(V('raw16k.wav'));
  return JSON.parse(fs.readFileSync(V('whisper.json'), 'utf8')).transcription
    .map((s) => ({ w: s.text.trim(), start: s.offsets.from / 1000, end: s.offsets.to / 1000 }))
    .filter((s) => /[a-z0-9]/i.test(s.w));
};
const model = cfg.model, speedWorks = !/^eleven_v4/.test(model); // always the owner's model, never per video
const rate = +(argv('rate') ?? brief.rate ?? cfg.rate), tries = speedWorks ? +(argv('tries') ?? 3) : 1;
const paceOf = (h) => words.length / (h.at(-1).end - h[0].start), inRange = (r) => r >= cfg.rateMin && r <= cfg.rateMax;
let speed = +(brief.speed || cfg.speed), heard;
if (retime) heard = listen();
else for (let k = 1; ; k++) {
  const r = await el(`/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, { method: 'POST', body: JSON.stringify({
    text, model_id: model,
    voice_settings: { stability: cfg.stability, similarity_boost: cfg.similarity, style: cfg.style, speed, use_speaker_boost: true } }) });
  fs.writeFileSync(V('raw.mp3'), Buffer.from(await r.arrayBuffer()));
  heard = listen();
  const pace = paceOf(heard), next = Math.min(1.2, Math.max(0.7, speed * rate / pace));
  console.log(`take ${k}: speed ${speed.toFixed(3)} -> ${pace.toFixed(2)} words/s`);
  if (inRange(pace)) break;
  if (k >= tries || Math.abs(next - speed) < 0.005) {
    console.log(`PACE MISSED: ${pace.toFixed(2)} words/s is outside ${cfg.rateMin}-${cfg.rateMax}` +
      (!speedWorks ? ': v4 sets its own pace, so fix it in the script (too slow: join sentences with and/but/so and cut commas; too fast: add a full stop at a turn), then take it again'
        : next >= 1.2 && pace < rate ? ' even at ElevenLabs\' top speed (1.2): tighten the script with shorter words and sentences, or ask the owner about the pace spec' : ''));
    break;
  }
  speed = next;
}
if (!retime && speedWorks) fs.writeFileSync(path.join(P, 'brief.json'), JSON.stringify({ ...brief, speed: +speed.toFixed(3) }, null, 1)); // later takes start here
fs.rmSync(path.join(P, 'mix.js'), { force: true }); // the old mix no longer matches this voice: render.mjs --audio makes a new one
const SRC = V('raw.mp3');

// ---- 3. line the heard words up with the script words, fill gaps by interpolation
// Both sides are spelled out first ("500" -> five hundred, "29%" -> twenty nine percent) and aligned piece by piece,
// so a number written either way still matches; a script word takes the times of the heard pieces it matched.
const ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' ');
const TENS = ',,twenty,thirty,forty,fifty,sixty,seventy,eighty,ninety'.split(',');
const n2w = (x) => x < 20 ? [ONES[x]] : x < 100 ? [TENS[(x / 10) | 0], ...(x % 10 ? [ONES[x % 10]] : [])]
  : x < 1000 ? [ONES[(x / 100) | 0], 'hundred', ...(x % 100 ? n2w(x % 100) : [])]
  : x < 1e6 ? [...n2w((x / 1000) | 0), 'thousand', ...(x % 1000 ? n2w(x % 1000) : [])] : [String(x)];
const spell = (tok) => {
  const s = tok.toLowerCase().replace(/[’']/g, "'").replace(/(\d),(\d)/g, '$1$2').replace(/[^a-z0-9'.%]/g, '').replace(/\.+$/, '');
  const m = s.match(/^(\d+)(?:\.(\d+))?(%?)$/);
  if (m) return [...n2w(+m[1]), ...(m[2] ? ['point', ...[...m[2]].map((d) => ONES[+d])] : []), ...(m[3] ? ['percent'] : [])];
  const w = s.replace(/[^a-z0-9']/g, ''); return w ? [w] : [];
};
const eq = (a, b) => a === b || (a.length > 3 && b.length > 3 && (a.startsWith(b) || b.startsWith(a)));
const A = words.flatMap((w, i) => spell(w.w).map((s) => ({ s, i })));
const B = heard.flatMap((h) => { const p = spell(h.w), d = (h.end - h.start) / (p.length || 1); return p.map((s, k) => ({ s, start: h.start + k * d, end: h.start + (k + 1) * d, w: h.w })); });
const n = words.length, na = A.length, nb = B.length;
const D = Array.from({ length: na + 1 }, (_, i) => Array.from({ length: nb + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
for (let i = 1; i <= na; i++) for (let j = 1; j <= nb; j++) D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + (eq(A[i - 1].s, B[j - 1].s) ? 0 : 1));
const got = words.map(() => ({ start: Infinity, end: -Infinity, exact: false, heardAs: null }));
for (let i = na, j = nb; i > 0 || j > 0;) {
  if (i > 0 && j > 0 && D[i][j] === D[i - 1][j - 1] + (eq(A[i - 1].s, B[j - 1].s) ? 0 : 1)) {
    const g = got[A[i - 1].i]; g.start = Math.min(g.start, B[j - 1].start); g.end = Math.max(g.end, B[j - 1].end);
    if (eq(A[i - 1].s, B[j - 1].s)) g.exact = true; else g.heardAs = B[j - 1].w;
    i--; j--;
  } else if (i > 0 && D[i][j] === D[i - 1][j] + 1) i--; else j--;
}
const map = got.map((g) => (g.start < Infinity ? g : null)), misheard = [];
words.forEach((w, i) => {
  if (map[i]) { w.start = map[i].start; w.end = map[i].end; }
  if (!got[i].exact) misheard.push(got[i].heardAs ? `"${w.w}" heard as "${got[i].heardAs}"` : `"${w.w}" not heard`);
});
for (let i = 0; i < n;) { // runs of unmatched words share the gap between their neighbours by length
  if (map[i]) { i++; continue; }
  let k = i; while (k < n && !map[k]) k++;
  const t0 = i ? words[i - 1].end : 0, t1 = k < n ? words[k].start : (heard.at(-1)?.end ?? t0 + 0.4);
  const run = words.slice(i, k), tot = run.reduce((a, w) => a + w.w.length, 0); let t = t0;
  for (const w of run) { w.start = t; t += ((t1 - t0) * w.w.length) / tot; w.end = t; }
  i = k;
}
for (let i = 1; i < n; i++) if (words[i].start < words[i - 1].end) words[i].start = words[i - 1].end; // keep order

// ---- 4. trim the silence before the first word (to the lead-in) and after the last; shift every time to match
const SR = 48000;
const pcm = new Float32Array(new Uint8Array(ff(['-i', SRC, '-f', 'f32le', '-ac', '1', '-ar', String(SR), '-'])).buffer);
// Whisper stretches the last words of a line into the pause after it (0.3-0.75 s late). End each line where the take
// really goes quiet (30 dB under its loud level, >= 120 ms) and squeeze the line's words into the speech before it.
// A comma, question mark or full stop inside a line is a pause too (>= 80 ms): split the line there and fit each part's words
// into its own stretch of speech, or every word after the pause lands early.
{ const win = SR / 100, rms = [];
  for (let s = 0; s + win <= pcm.length; s += win) { let e = 0; for (let k = s; k < s + win; k++) e += pcm[k] * pcm[k]; rms.push(Math.sqrt(e / win)); }
  const quiet = [...rms].sort((a, b) => a - b)[Math.floor(rms.length * 0.95)] * 10 ** (-30 / 20), sil = [], gap = [];
  for (let i = 0, s = -1; i <= rms.length; i++) { const q = i < rms.length && rms[i] < quiet; if (q && s < 0) s = i; if (!q && s >= 0) { if (i - s >= 12) sil.push(s / 100); if (i - s >= 8) gap.push([s / 100, i / 100]); s = -1; } }
  for (const l of lines) {
    const ws = words.filter((w) => w.line === l.n), nx = words.find((w) => w.line > l.n), s = ws[0].start, e = ws.at(-1).end;
    // the last pause before the next line, if it starts in the second half of the line (an earlier one is a comma, not the end)
    const end = sil.filter((a) => a > s + 0.5 * (e - s) && a < (nx ? nx.start : Infinity)).at(-1);
    const lineEnd = end != null && end < e - 0.05 ? end : e, parts = []; let i0 = 0, m0 = s;
    ws.forEach((w, i) => { if (i === ws.length - 1 || !/[,?;:!.]$/.test(w.w)) return;
      const off = ([a, b]) => (w.end < a ? a - w.end : w.end > b ? w.end - b : 0);   // how far the silence is from the word's end
      const g = gap.filter(([a, b]) => a > m0 + 0.15 && b < lineEnd - 0.1).sort((p, q) => off(p) - off(q))[0];
      if (g && off(g) < 0.8) { parts.push([i0, i, m0, g[0]]); i0 = i + 1; m0 = g[1]; } });
    parts.push([i0, ws.length - 1, m0, lineEnd]);
    for (const [a, b, t0, t1] of parts) { const r0 = ws[a].start, k = (t1 - t0) / (ws[b].end - r0);
      for (const w of ws.slice(a, b + 1)) { w.start = t0 + (w.start - r0) * k; w.end = t0 + (w.end - r0) * k; } }
  }
}
const from = Math.max(0, words[0].start - cfg.lead), pre = Math.max(0, cfg.lead - words[0].start), to = Math.min(pcm.length / SR, words[n - 1].end + cfg.tail);
const head = new Float32Array(Math.round(pre * SR)), speech = pcm.subarray(Math.round(from * SR), Math.round(to * SR));
const out = new Float32Array(head.length + speech.length); out.set(head); out.set(speech, head.length);
for (const w of words) { w.start = +(pre + w.start - from).toFixed(3); w.end = +(pre + w.end - from).toFixed(3); }
fs.writeFileSync(V('voice.f32'), Buffer.from(out.buffer));
ff(['-f', 'f32le', '-ar', String(SR), '-ac', '1', '-i', V('voice.f32'), V('voice.wav')]);
ff(['-i', V('voice.wav'), '-b:a', '128k', V('voice.mp3')]);
fs.rmSync(V('voice.f32'));

// ---- 5. timing.json + vo.js
const dur = +(out.length / SR).toFixed(3);
const T = { duration: dur, lead: cfg.lead, voiceId, model, misheard,
  lines: lines.map((l) => { const ws = words.filter((w) => w.line === l.n); return { n: l.n, scene: l.scene, text: l.text, start: ws[0].start, end: ws.at(-1).end }; }),
  words: words.map(({ i, w, start, end, line, scene }) => ({ i, w, start, end, line, scene })) };
console.assert(T.words.every((w, i) => i === 0 || w.start >= T.words[i - 1].start), 'word times in order');
fs.writeFileSync(path.join(P, 'timing.json'), JSON.stringify(T, null, 1));
fs.writeFileSync(path.join(P, 'vo.js'), `window.VO_AUDIO = "${fs.readFileSync(V('voice.mp3')).toString('base64')}";\nwindow.TIMING = ${JSON.stringify(T)};\n`);
const spoken = T.words.at(-1).end - T.words[0].start;
console.log(`${n} words, ${dur.toFixed(2)} s of voice, ${(n / spoken).toFixed(2)} words/s at ElevenLabs speed ${speed.toFixed(3)} (target ${rate}, in range ${cfg.rateMin}-${cfg.rateMax}; the take is not re-timed), scenes ${[...new Set(words.map((w) => w.scene))].join(',')}`);
if (misheard.length) console.log(`check these (Whisper heard something else; re-take if the voice really said it wrong):\n  ${misheard.reverse().join('\n  ')}`);
