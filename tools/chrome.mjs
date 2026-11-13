// Opens P/preview.html in headless Chrome with the GPU on and waits for the player. Shared by qa.mjs and render.mjs.
import puppeteer from 'puppeteer-core';
import path from 'node:path'; import fs from 'node:fs';

const CHROME = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));

export async function openPreview(P) {
  if (!CHROME) throw new Error('Google Chrome not found');
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', protocolTimeout: 0,
    args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl', '--autoplay-policy=no-user-gesture-required', '--allow-file-access-from-files'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message || e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.setViewport({ width: 600, height: 1100 });
  await page.goto('file://' + path.join(P, 'preview.html'), { waitUntil: 'load', timeout: 120000 });
  await page.waitForFunction('window.playerReady === true || window.__err', { timeout: 120000 }).catch(() => {});
  const ready = await page.evaluate(() => window.playerReady === true);
  if (!ready) { await browser.close(); throw new Error('player did not start:\n  ' + (errors.join('\n  ') || 'no error message (check fonts/CDN)')); }
  const gpu = await page.evaluate(() => { const g = document.getElementById('stage').getContext('webgl2'); const d = g && g.getExtension('WEBGL_debug_renderer_info'); return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'unknown'; });
  return { browser, page, errors, gpu };
}

// grab the canvas after seeking to t: full size, or scaled to width w with the time stamped top-left (for review sheets);
// a scaled grab also leaves its brightness, colour strength and black share in window.__stats
export const grab = (page, t, { samples, w, quality = 0.92 } = {}) => page.evaluate(async (t, samples, w, quality) => {
  await window.seek(t, samples);
  const src = document.getElementById('stage');
  if (!w) return src.toDataURL('image/jpeg', quality);
  const c = document.createElement('canvas'); c.width = w; c.height = Math.round((w * src.height) / src.width);
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(src, 0, 0, c.width, c.height);
  { // picture stats for the lamp specs, before the time stamp, without the caption band (64-76 % of the height)
    const d = g.getImageData(0, 0, c.width, c.height).data, H = c.height, W = c.width; let n = 0, L = 0, S = 0, k0 = 0;
    for (let y = 0; y < H; y++) { if (y > 0.64 * H && y < 0.76 * H) continue;
      for (let x = 0; x < W; x++) { const i = (y * W + x) * 4, r = d[i], gg = d[i + 1], b = d[i + 2], mx = Math.max(r, gg, b);
        L += 0.2126 * r + 0.7152 * gg + 0.0722 * b; S += mx ? (mx - Math.min(r, gg, b)) / mx : 0; if (mx <= 10) k0++; n++; } }
    window.__stats = { t, luma: L / n / 255, sat: S / n, black: k0 / n };
  }
  const m = Math.floor(t / 60), s = (t - m * 60).toFixed(2).padStart(5, '0'), label = `${String(m).padStart(2, '0')}:${s}`;
  g.font = `600 ${Math.round(w / 14)}px ui-monospace, Menlo, monospace`; const tw = g.measureText(label).width;
  g.fillStyle = 'rgba(0,0,0,0.75)'; g.fillRect(0, 0, tw + w / 20, w / 10); g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.fillText(label, w / 40, w / 20);
  return c.toDataURL('image/jpeg', quality);
}, t, samples, w, quality);

export const save = (dataUrl, file) => fs.writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
