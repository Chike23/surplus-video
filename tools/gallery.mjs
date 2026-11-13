// Builds styles/gallery.html (one self-contained page) from styles/index.json: every style with its sample clip, family,
// description and whether its prompt is saved (ready to use). The user picks by number or name in the chat.
// usage: node gallery.mjs
import fs from 'node:fs'; import path from 'node:path';

const dir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'styles');
const list = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'))
  .map((s) => ({ ...s, ready: fs.existsSync(path.join(dir, s.slug, 'card.md')), made: fs.existsSync(path.join(dir, s.slug, 'videos.txt')) ? fs.readFileSync(path.join(dir, s.slug, 'videos.txt'), 'utf8').trim().split('\n').length : 0 }))
  .sort((a, b) => a.n - b.n);
const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const families = [...new Set(list.map((s) => s.family))];

const cards = list.map((s) => `
  <article class="card" data-family="${esc(s.family)}">
    <div class="media">${s.video ? `<video src="${esc(s.video)}" poster="${esc(s.poster || '')}" muted loop playsinline preload="none"></video>` : ''}</div>
    <div class="body">
      <div class="meta"><span class="num">#${String(s.n).padStart(2, '0')}</span><span>${esc(s.family)}</span></div>
      <h2>${esc(s.name)} <span class="use">${esc(s.use || '')}</span></h2>
      <p>${esc(s.blurb)}</p>
      <div class="tags">${s.ready ? '<span class="ok">ready</span>' : '<span class="no">prompt not saved</span>'}${s.made ? `<span>${s.made} video${s.made > 1 ? 's' : ''} made</span>` : ''}</div>
    </div>
  </article>`).join('');

fs.writeFileSync(path.join(dir, 'gallery.html'), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pick a style</title>
<style>
  :root { --bg: #15111a; --card: #1f1925; --fg: #f7ecd6; --muted: #a99fae; --line: #3a3142; --accent: #ee5a36; --ok: #6fcf97; color-scheme: dark; }
  body { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.45 system-ui, -apple-system, sans-serif; }
  header { padding: 24px 16px 8px; max-width: 1280px; margin: 0 auto; }
  h1 { margin: 0 0 4px; font-size: 26px; } header p { margin: 0; color: var(--muted); }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 14px 0 4px; }
  .chips button { all: unset; cursor: pointer; padding: 6px 12px; border-radius: 999px; border: 1px solid var(--line); color: var(--muted); }
  .chips button[aria-pressed="true"] { background: var(--fg); color: var(--bg); border-color: var(--fg); }
  .chips button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  main { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; padding: 12px 16px 40px; max-width: 1280px; margin: 0 auto; }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
  .media { aspect-ratio: 16 / 9; background: #000; } video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .body { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
  .meta { display: flex; justify-content: space-between; color: var(--muted); font-size: 12px; } .num { font: 600 13px ui-monospace, Menlo, monospace; color: var(--fg); }
  h2 { margin: 0; font-size: 18px; } .use { font-size: 11px; font-weight: 500; color: var(--muted); border: 1px solid var(--line); border-radius: 999px; padding: 1px 8px; vertical-align: middle; }
  p { margin: 0; color: var(--muted); font-size: 13.5px; }
  .tags { margin-top: auto; display: flex; gap: 6px; font-size: 12px; } .tags span { padding: 2px 8px; border-radius: 6px; background: #2a2231; color: var(--muted); }
  .tags .ok { color: var(--ok); } .tags .no { color: #e0a96d; }
  .card[hidden] { display: none; }
</style>
<header><h1>Pick a style for this video</h1><p>Hover or tap a card to play its sample. Then tell Claude the number or name (e.g. "#04 Tiny Diorama").</p>
<div class="chips" role="group" aria-label="Filter by family"><button aria-pressed="true" data-f="">All ${list.length}</button>${families.map((f) => `<button aria-pressed="false" data-f="${esc(f)}">${esc(f)} ${list.filter((s) => s.family === f).length}</button>`).join('')}</div></header>
<main>${cards}</main>
<script>
  const vids = document.querySelectorAll('video');
  for (const v of vids) { const c = v.closest('.card'); c.addEventListener('pointerenter', () => v.play().catch(() => {})); c.addEventListener('pointerleave', () => v.pause()); c.addEventListener('click', () => (v.paused ? v.play() : v.pause())); }
  document.querySelector('.chips').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    for (const x of document.querySelectorAll('.chips button')) x.setAttribute('aria-pressed', x === b);
    for (const c of document.querySelectorAll('.card')) c.hidden = !!b.dataset.f && c.dataset.family !== b.dataset.f;
  });
</script>
`);
console.log(`gallery.html: ${list.length} styles, ${list.filter((s) => s.ready).length} ready`);
