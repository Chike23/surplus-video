// voice.js: ties the picture to the narration. Needs window.TIMING (written into vo.js by tools/voice.mjs):
//   { duration, lead, words: [{ i, w, start, end, line, scene }], lines: [{ n, scene, text, start, end }] }
// CUE   finds when things are said, so every event, camera change and sound comes from the same clock as the voice.
// No captions (owner's rule): nothing here draws the narration's words on screen.
(function () {
  'use strict';
  const T = window.TIMING || { duration: 0, words: [], lines: [] };
  const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9'+%]+/g, ' ').trim();

  const CUE = (window.CUE = {
    T,
    // snap a time to the drawing grid: 15 for styles on twos, 30 otherwise. Events and their sounds use the same snapped time.
    snap: (t, dps = 15) => Math.round(t * dps) / dps,
    word: (i) => T.words[Math.max(0, Math.min(T.words.length - 1, i))],
    // first word of the first match of `phrase` at or after word index `from` (or after time `from` if it has a decimal)
    find(phrase, from = 0) {
      const want = norm(phrase).split(' '), W = T.words;
      const i0 = Number.isInteger(from) ? from : W.findIndex((w) => w.start >= from);
      for (let i = Math.max(0, i0); i + want.length <= W.length; i++) {
        if (want.every((p, k) => norm(W[i + k].w) === p)) return { i, start: W[i].start, end: W[i + want.length - 1].end };
      }
      throw new Error(`CUE.find: "${phrase}" not in narration after ${from}`);
    },
    // the usual call: when does this phrase start, on the drawing at or just before the word (never after it)
    at: (phrase, from, dps = 15) => Math.floor(CUE.find(phrase, from).start * dps + 1e-6) / dps,
    end: (phrase, from, dps = 15) => Math.ceil(CUE.find(phrase, from).end * dps - 1e-6) / dps,
    line: (n) => T.lines.find((l) => l.n === n),
    scene: (s) => { const ls = T.lines.filter((l) => l.scene === s); return { start: ls[0].start, end: ls[ls.length - 1].end }; },
  });
})();
