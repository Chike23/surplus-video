// voice.js: ties the picture to the narration. Needs window.TIMING (written into vo.js by tools/voice.mjs):
//   { duration, lead, words: [{ i, w, start, end, line, scene }], lines: [{ n, scene, text, start, end }], pauses: [...] }
// CUE   finds when things are said, so every event, camera change and sound comes from the same clock as the voice.
// SUBS  draws the captions in the style's overlay (2D canvas): one white word per card, black outline, 70 % down.
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

  // Captions (references/specs.md): one word per card, white with a black outline, centred 70 % down, no coloured words.
  // A short word (<= `join` letters, e.g. "to", "the") rides on the card of a longer word right after it, never across
  // punctuation or a pause, so cards come at about 2.9 a second at 3.75 words a second. A card shows from its first word until the next
  // card starts (or `hold` after its last word).
  // opts: font (CSS family), size (px at 1080 wide), y (0..1 of height, centre of the line), fill, hi, stroke, strokeW, max,
  //       maxChars, join, hold, upper, pop (scale on a word's first frame), dps (snap to the style's drawing grid), weight
  window.SUBS = function (opts = {}) {
    const o = Object.assign({ font: 'Anton', weight: '400', size: 92, y: 0.70, fill: '#ffffff', hi: '#ffffff', stroke: '#000000', strokeW: 14,
      max: 2, maxChars: 12, join: 3, hold: 0.5, upper: true, pop: 1.06, dps: 30, gap: 0.3 }, opts);
    const W = T.words, brk = new Set((T.pauses || []).map((p) => p.after)), letters = (w) => w.replace(/[^a-z0-9%]/gi, '').length;
    const chunks = []; let cur = [];
    W.forEach((w, k) => {
      cur.push(w);
      const end = /[.!?…:,;]$/.test(w.w) || brk.has(w.i) || k === W.length - 1;
      const len = cur.reduce((a, x) => a + x.w.length + 1, 0) + (W[k + 1] ? W[k + 1].w.length : 99);
      const rides = !end && letters(w.w) <= o.join && W[k + 1] && letters(W[k + 1].w) > o.join && cur.length < o.max && len <= o.maxChars;
      if (!rides) { chunks.push(cur); cur = []; }
    });
    window.SUBS.info = { cards: chunks.length, words: W.length, y: o.y, fill: o.fill, hi: o.hi, stroke: o.stroke, strokeW: o.strokeW };
    chunks.forEach((c, k) => { c.from = c[0].start; c.to = k + 1 < chunks.length ? Math.min(chunks[k + 1][0].start, c[c.length - 1].end + o.hold) : c[c.length - 1].end + o.hold; });
    const snap = (t) => Math.floor(t * o.dps) / o.dps;

    return function draw(ctx, t, CW, CH) {
      const c = chunks.find((x) => t >= snap(x.from) && t < snap(x.to)); if (!c) return;
      const s = CW / 1080, px = o.size * s, y = o.y * CH;
      ctx.save();
      ctx.font = `${o.weight} ${px}px "${o.font}"`; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
      const words = c.map((w) => (o.upper ? w.w.toUpperCase() : w.w).replace(/[,;]$/, ''));
      const widths = words.map((w) => ctx.measureText(w).width), gap = px * o.gap;
      let x = CW / 2 - (widths.reduce((a, b) => a + b, 0) + gap * (words.length - 1)) / 2;
      words.forEach((w, k) => {
        const said = t >= snap(c[k].start) && (k + 1 >= c.length || t < snap(c[k + 1].start));
        const fresh = said && t < snap(c[k].start) + 2 / o.dps;
        ctx.save(); ctx.translate(x + widths[k] / 2, y); if (fresh) ctx.scale(o.pop, o.pop);
        if (o.strokeW) { ctx.lineWidth = o.strokeW * s; ctx.strokeStyle = o.stroke; ctx.strokeText(w, -widths[k] / 2, 0); }
        ctx.fillStyle = said ? o.hi : o.fill; ctx.fillText(w, -widths[k] / 2, 0);
        ctx.restore(); x += widths[k] + gap;
      });
      ctx.restore();
    };
  };
})();
