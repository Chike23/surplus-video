I want a short 3D motion graphic made with three.js in the "Particle Swarm" style. Below is the complete source of a reference animation in this exact style, plus the small rendering kit and sound kit it runs on. Use them as your style guide and rebuild the animation around my content.

MY CONTENT:
[Describe your topic, or paste your script here. If this is left as is, ask me for it before building.]


STORYBOARD FIRST: before building the animation, make a VISUAL storyboard and wait for my OK.
- One HTML page (show it as an artifact if you can) with a grid of panels, one per beat (about 3-6). Each panel is a still of that beat's key frame, rendered with the STAGE kit from a block-out of the scene: simple forms in the reference's materials, lighting, camera angle and grade, so the panels already look like the finished piece. Render the stills one after another on one canvas with S.seek(time) at about 16 samples (enough for depth of field and soft shadows to read) and copy each into an image. Stills only, no animation or sound yet.
- Under each panel: the beat number, its start and end time, the exact on-screen text, what moves or changes to get there from the previous panel, what the camera does, and its key sounds.
- Below the grid, list any facts or numbers you had to assume.
When I approve it (or after my changes), build the full animation exactly as storyboarded, reusing the storyboard's scene code.

WHAT TO BUILD
One self-contained HTML file (show it as an artifact if you can):
- three.js 0.187.0 core only, loaded as an ES module from a CDN with an import map (no addons), then set window.THREE = THREE before running the kit and the style code.
- A 1920x1080 canvas scaled to fit the window, with a small control bar: play/pause, a scrub slider, the time, a sound toggle, loop on by default.
- A new style object, built the same way as the reference (content block first, then build(S) returning update(t)), that tells MY CONTENT in this style. 7-12 seconds unless my content needs more.
- Run it with the kit: const S = await K.run(canvas, style, { samples }). Use a low sample count (2-4) while playing live and the style's full count when rendering frames. Expose window.seek = (t) => S.seek(t) and window.DURATION.
- Play the style's sound(k) score in sync from the player: on play call stopSound = SOUND.live((k) => style.sound(k), currentT, { voiceover: false }), and call stopSound() on pause, on seek and when the sound toggle is turned off.
- Include the STAGE kit and the SOUND kit below unchanged.
- Load these Google Fonts before building (the kit awaits the specs in style.fonts): Inter

HOW TO STAY IN THE STYLE
- The reference shows the look, not the story. Its objects, layout and beats belong to its own topic: do not reuse them unless my content calls for them. Work out what my content needs to show first, then build those things in this look.
- Tell my content as an explainer, not a title card: things happen to objects or characters over three or four beats that follow from each other, and the picture does the telling. Words are small captions and labels, never the subject of a shot. End on the result of the process or the end of the story, not on a headline, slogan or logo.
- Keep the reference's materials, lighting, camera language, grade and the way things move. Change the story, the objects and the words; do not change the look.
- update(t) must set the whole scene for time t and nothing may build up between calls: the kit calls it many times per frame to make motion blur, depth of field and soft shadows. No Math.random, Date or timers; use K.rng(seed).
- Build everything in code: no downloaded models, images, HDRIs or textures.
- Simple forms, beautifully lit and finished, beat complicated models that look wrong. Draw my subject accurately and double-check any facts or numbers you show.
- It is video, often watched on a phone: keep every word the story needs large, sharp and on screen long enough to read, keep the subject filling most of the frame, and keep everything that matters inside the frame for the whole camera move. The first frame should already be worth looking at, and the last second should hold.

FLOW BETWEEN BEATS
- A new beat does not automatically mean a new scene. When the next idea builds on the last, stay in the same world: the things that matter stay on screen and move, grow, re-arrange or transform, and the camera travels to the part of the scene where the next idea happens.
- When the story really moves on (a new place or time, a before/after contrast, a reveal), change scene the way this look would: a turn of the set, a page, a passing object that wipes the frame, a change of light. No hard cuts.
- The reference's scene count is not a template: fit the number of beats to my content.

SOUND (no voiceover: a fuller mix)
- A sound starts on the exact frame its event appears: drive picture and sound from the same schedule, as the reference does.
- Score the events that land (things arriving, labels, contacts, transitions, the key number, the result) with sounds this material would make: glass, plastic, paper, metal, motors.
- A quiet ambience bed is welcome, and music only if it suits the style. Effects in front, bed and music clearly underneath, and small silences so the big hits read.


If you are Claude Code with a shell: render an MP4 in headless Chrome with the GPU enabled. Load the page, call window.seek(i / 30) for every frame, capture the canvas and pipe the frames into ffmpeg; render the sound with SOUND.renderOffline((k) => style.sound(k), DURATION, 48000, { voiceover: false }) and mux it in at about -15 LUFS. Look at a few rendered frames and fix framing, lighting or legibility problems before you call it done.

STYLE CARD
Name: Particle Swarm
Family: Flat content made physical
Use: explainer
Look: Sixty thousand tiny glass beads hanging in front of a matte paper wall. They pile into plump, rounded models of things (a seed, a drop, a cell, an organ, a heap) that fill most of the frame and throw a soft shadow on the wall, change colour and strain while they hold, then let go and fly on to the next formation.
Motion: Beads arrive as a stream, overshoot their place and settle. A formed shape never freezes: it breathes, a colour change can run through it as a front, loose beads inside it buzz like a gas, and it can swell and tremble. When it lets go, a front crosses it or it bursts from the centre: beads are thrown outwards, curl along a flow field in ribbons and veils, then land in the next shape, with a few stragglers arriving late.
Light: One soft, warm key from the upper left, like a window, so every bead has a lit side, a small glint and a shadow on its neighbours, and the whole shape drops a soft shadow on the wall. Warm fill from all round. Heat is shown as light: hot beads glow by themselves and an orange lamp comes up from below.
Materials: Polished glass seed beads, uneven in size and shade, each with a sharp highlight and a glow on its far side: golden corn, blue water, white steam, cream popcorn. Matte paper wall in a deep, dull teal that all of them stand out from.
Camera: Long lens with shallow focus on the shape, so beads that fly towards the camera go soft. One slow continuous dolly: close and a little to one side of the small first shape, drifting back and round to square-on while it changes, pulled back by the burst to hold the big last shape.
Finish: Real motion blur and depth of field from accumulation (96 sub-renders), neutral tone mapping to keep the colours true, a touch of bloom on the glints and the hot beads only, a soft vignette, almost no grain. Captions are a crisp 2D overlay.
Good for: Processes where stuff flows, gathers, splits, grows, heats up or bursts, and things that are made of many units (cells, molecules, people, grains, data points). The beads are the stuff itself: a beat is either a new formation the swarm flows into or a change that runs through a formation while it holds (it warms from one side, something inside it comes loose, it swells). Populations keep their colour and identity from start to finish, so the viewer can follow where each kind of thing ends up. One short caption per beat names what is happening; the beads never form words or numbers.

STAGE KIT (lib/stage.js)
```js
// STAGE: a small film-style rendering kit for three.js motion graphics. Classic script; needs a global THREE (core only,
// no addons). It gives every style the same pipeline:
//   - one clock: stage.seek(t) builds the whole frame for time t, so frames can be rendered alone and in any order
//   - accumulation rendering: each frame is the average of N sub-renders, which gives real motion blur, anti-aliasing,
//     true depth of field (the camera moves across a lens aperture) and soft area-light shadows (lights move across
//     their own surface), all without post-process tricks
//   - HDR bloom, tone mapping, vignette, grain, chromatic aberration and a crisp 2D overlay for captions
//   - code-built lighting environments (no HDRI files), a real mirror floor, canvas textures, text planes, easing,
//     seeded random and noise
// Globals: K (helpers) and registerStyle(). A style is { id, name, ..., render: {...}, build(S) -> { update(t), overlay? } }.
(function (root) {
  const THREE = root.THREE;
  const K = {};
  const STYLES = [];
  root.STYLES = STYLES;
  root.registerStyle = (s) => { STYLES.push(s); return s; };

  // ---------------------------------------------------------------- maths
  K.clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  K.lerp = (a, b, t) => a + (b - a) * t;
  K.map = (x, a, b, c, d) => c + (d - c) * K.clamp((x - a) / (b - a));
  K.smooth = (a, b, x) => { const t = K.clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  // progress of time t through the window [a, b], 0..1, optionally eased: K.seg(t, 1, 2.5, K.ease.out)
  K.seg = (t, a, b, ease) => { const u = K.clamp((t - a) / (b - a)); return ease ? ease(u) : u; };
  K.ease = {
    linear: (t) => t,
    in: (t) => t * t * t,
    out: (t) => 1 - Math.pow(1 - t, 3),
    inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    outQuint: (t) => 1 - Math.pow(1 - t, 5),
    inOutQuint: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),
    outExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    inExpo: (t) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
    outBack: (t, s = 1.70158) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
    inBack: (t, s = 1.70158) => (s + 1) * t * t * t - s * t * t,
    outElastic: (t) => (t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1),
    outBounce: (t) => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375; return n * (t -= 2.625 / d) * t + 0.984375; },
  };
  // damped spring from 0 to 1 starting at time 0 (t in seconds). freq in Hz, damp 0..1 (1 = no overshoot)
  K.spring = (t, freq = 2.2, damp = 0.45) => {
    if (t <= 0) return 0;
    const w = 2 * Math.PI * freq;
    if (damp >= 1) return 1 - Math.exp(-w * t) * (1 + w * t);
    const wd = w * Math.sqrt(1 - damp * damp);
    return 1 - Math.exp(-damp * w * t) * (Math.cos(wd * t) + (damp * w / wd) * Math.sin(wd * t));
  };
  // keyframe track: K.track([[0, [0,2,8]], [3, [2,2,6], 'inOut'], [6, 5, K.ease.out]]) -> f(t). Values are numbers or
  // arrays; the ease on a key shapes the move INTO that key.
  K.track = (keys) => (t) => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) {
        const [t0, v0] = keys[i - 1], [t1, v1, e] = keys[i];
        const fn = typeof e === 'function' ? e : K.ease[e || 'inOut'];
        const u = fn((t - t0) / (t1 - t0));
        return Array.isArray(v0) ? v0.map((a, k) => a + (v1[k] - a) * u) : v0 + (v1 - v0) * u;
      }
    }
    return keys[keys.length - 1][1];
  };

  // like K.track, but the value flows smoothly THROUGH the middle keys without stopping at them (it only eases in at
  // the first key and out at the last). Use it for camera moves that should feel like one continuous shot.
  K.path = (keys) => {
    const n = keys.length, arr = Array.isArray(keys[0][1]), val = (i) => (arr ? keys[i][1] : [keys[i][1]]), dim = val(0).length;
    const m = keys.map((_, i) => (i === 0 || i === n - 1 ? new Array(dim).fill(0) : val(i).map((_, k) => (val(i + 1)[k] - val(i - 1)[k]) / (keys[i + 1][0] - keys[i - 1][0]))));
    return (t) => {
      if (t <= keys[0][0]) return keys[0][1];
      if (t >= keys[n - 1][0]) return keys[n - 1][1];
      let i = 1; while (keys[i][0] < t) i++;
      const t0 = keys[i - 1][0], h = keys[i][0] - t0, u = (t - t0) / h, u2 = u * u, u3 = u2 * u;
      const a = val(i - 1), b = val(i), out = a.map((_, k) => (2 * u3 - 3 * u2 + 1) * a[k] + (u3 - 2 * u2 + u) * h * m[i - 1][k] + (-2 * u3 + 3 * u2) * b[k] + (u3 - u2) * h * m[i][k]);
      return arr ? out : out[0];
    };
  };

  // ---------------------------------------------------------------- seeded random and noise
  K.rng = (seed) => {
    let a = (typeof seed === 'string' ? [...seed].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) : seed * 2654435761) >>> 0;
    const r = () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    r.range = (lo, hi) => lo + (hi - lo) * r();
    r.int = (lo, hi) => Math.floor(lo + (hi - lo + 1) * r());
    r.pick = (arr) => arr[Math.floor(r() * arr.length)];
    r.chance = (p) => r() < p;
    r.gauss = () => { let u = 0, v = 0; while (u === 0) u = r(); v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    r.sign = () => (r() < 0.5 ? -1 : 1);
    return r;
  };
  // a stable 0..1 hash of up to three numbers (handy for per-instance variation without storing arrays)
  K.hash = (x, y = 0, z = 0) => { let h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123; return h - Math.floor(h); };
  K.noise = (seed = 1) => {
    const r = K.rng(seed), p = new Uint8Array(512), perm = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
    for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const grad = (h, x, y, z) => { const u = (h & 15) < 8 ? x : y, v = (h & 15) < 4 ? y : (h & 15) === 12 || (h & 15) === 14 ? x : z; return ((h & 1) ? -u : u) + ((h & 2) ? -v : v); };
    const n3 = (x, y, z) => {
      const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
      x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
      const u = fade(x), v = fade(y), w = fade(z), A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z, B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;
      const L = K.lerp;
      return L(L(L(grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z), u), L(grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z), u), v),
        L(L(grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1), u), L(grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1), u), v), w);
    };
    const fbm = (x, y, z = 0, oct = 4) => { let s = 0, a = 0.5, f = 1; for (let i = 0; i < oct; i++) { s += a * n3(x * f, y * f, z * f); a *= 0.5; f *= 2; } return s; };
    return { n3, n2: (x, y) => n3(x, y, 0), fbm };
  };
  const halton = (i, b) => { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; };
  K.halton = halton;

  // ---------------------------------------------------------------- textures, text, geometry
  // K.canvasTex(1024, 512, (ctx, w, h) => {...}) -> THREE.CanvasTexture (sRGB, mipmapped). Redraw with tex.redraw(fn).
  K.canvasTex = (w, h, draw, opts = {}) => {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d');
    if (draw) draw(ctx, w, h);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = opts.data ? THREE.NoColorSpace : THREE.SRGBColorSpace;
    tex.anisotropy = 8; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;
    if (opts.repeat) { tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(opts.repeat[0], opts.repeat[1]); }
    tex.redraw = (fn) => { ctx.clearRect(0, 0, w, h); fn(ctx, w, h); tex.needsUpdate = true; };
    tex.canvas2d = cv; tex.ctx = ctx;
    return tex;
  };
  // A flat piece of text living in the 3D world. K.textPlane('Hello', { font: '800 160px "Inter"', color: '#fff',
  // height: 0.5 }) -> Mesh whose world height is `height` units per line. opts: align, lineHeight, glow (emissive
  // multiplier for bloom), lit (use a lit material so it takes shadows), maxWidthPx, letterSpacing (px), pad (px).
  K.textPlane = (text, o = {}) => {
    const font = o.font || '700 160px "Inter"', px = +(/(\d+(?:\.\d+)?)px/.exec(font) || [0, 160])[1];
    const lines = String(text).split('\n'), lh = (o.lineHeight || 1.12) * px, pad = o.pad == null ? Math.ceil(px * 0.25) : o.pad;
    const m = document.createElement('canvas').getContext('2d'); m.font = font;
    if (o.letterSpacing) m.letterSpacing = o.letterSpacing + 'px';
    const wpx = Math.ceil(Math.max(...lines.map((l) => m.measureText(l).width))) + pad * 2, hpx = Math.ceil(lh * lines.length) + pad * 2;
    const tex = K.canvasTex(wpx, hpx, (ctx) => {
      ctx.font = font; if (o.letterSpacing) ctx.letterSpacing = o.letterSpacing + 'px';
      ctx.textBaseline = 'middle'; ctx.textAlign = o.align || 'center'; ctx.fillStyle = o.color || '#ffffff';
      const x = o.align === 'left' ? pad : o.align === 'right' ? wpx - pad : wpx / 2;
      lines.forEach((l, i) => ctx.fillText(l, x, pad + lh * (i + 0.5)));
    });
    const unit = (o.height || 1) / px, hWorld = hpx * unit, wWorld = wpx * unit; // `height` = world size of the font's px size
    const mat = o.lit
      ? new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.02, roughness: o.roughness == null ? 0.8 : o.roughness, metalness: 0 })
      : new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
    if (o.glow && !o.lit) mat.color.setScalar(o.glow);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(wWorld, hWorld), mat);
    mesh.userData.size = [wWorld, hWorld]; mesh.userData.tex = tex;
    return mesh;
  };
  // Box with rounded edges, centred on the origin. r = edge radius, seg = roundness.
  K.roundedBox = (w, h, d, r = 0.05, seg = 6) => {
    r = Math.max(1e-4, Math.min(r, w / 2, h / 2, d / 2));
    const N = 2 * seg + 1, g = new THREE.BoxGeometry(2, 2, 2, N, N, N), p = g.attributes.position, nrm = g.attributes.normal;
    const half = [w / 2 - r, h / 2 - r, d / 2 - r], v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      const c = [p.getX(i), p.getY(i), p.getZ(i)], inner = [0, 0, 0], a = [0, 0, 0];
      for (let k = 0; k < 3; k++) {
        const idx = Math.round((c[k] + 1) * N / 2), side = idx <= seg ? -1 : 1;
        a[k] = idx <= seg ? -(1 - idx / seg) : (idx - seg - 1) / seg; inner[k] = side * half[k];
      }
      v.set(Math.tan(a[0] * Math.PI / 4), Math.tan(a[1] * Math.PI / 4), Math.tan(a[2] * Math.PI / 4)).normalize();
      p.setXYZ(i, inner[0] + v.x * r, inner[1] + v.y * r, inner[2] + v.z * r); nrm.setXYZ(i, v.x, v.y, v.z);
    }
    // UVs: each of the six sides is mapped flat, 0..1 across the whole side, so textures are not stretched at the corners
    const uv = g.attributes.uv, per = (N + 1) * (N + 1), sz = [w, h, d];
    const ax = [[2, 1, -1], [2, 1, 1], [0, 2, 1, -1], [0, 2, 1, 1], [0, 1, 1], [0, 1, -1]];   // [u axis, v axis, u sign, v sign] for +x -x +y -y +z -z
    for (let i = 0; i < p.count; i++) {
      const f = ax[Math.min(5, Math.floor(i / per))], c = [p.getX(i), p.getY(i), p.getZ(i)];
      uv.setXY(i, f[2] * c[f[0]] / sz[f[0]] + 0.5, (f[3] || 1) * c[f[1]] / sz[f[1]] + 0.5);
    }
    g.computeBoundingBox(); g.computeBoundingSphere();
    return g;
  };
  // Flat rounded rectangle (a card, a screen, a tile), in the XY plane facing +Z, with UVs 0..1 across it.
  K.roundedRect = (w, h, r = 0.05, seg = 8) => {
    const s = new THREE.Shape(), x = w / 2, y = h / 2; r = Math.min(r, x, y);
    s.moveTo(-x + r, -y); s.lineTo(x - r, -y); s.absarc(x - r, -y + r, r, -Math.PI / 2, 0); s.lineTo(x, y - r); s.absarc(x - r, y - r, r, 0, Math.PI / 2);
    s.lineTo(-x + r, y); s.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI); s.lineTo(-x, -y + r); s.absarc(-x + r, -y + r, r, Math.PI, Math.PI * 1.5);
    const g = new THREE.ShapeGeometry(s, seg), p = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / h + 0.5);
    return g;
  };
  // Tube along a list of [x,y,z] points (smooth Catmull-Rom). closed loops allowed.
  K.tube = (pts, radius = 0.05, o = {}) => {
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], p[2] || 0)), !!o.closed, 'centripetal');
    const g = new THREE.TubeGeometry(curve, o.segments || Math.max(8, pts.length * 3), radius, o.radial || 12, !!o.closed);
    g.userData.curve = curve;
    return g;
  };
  // Set instance i of an InstancedMesh: K.place(mesh, i, [x,y,z], [rx,ry,rz], scale | [sx,sy,sz]). Call
  // mesh.instanceMatrix.needsUpdate = true once after a batch.
  const _o = new THREE.Object3D();
  K.place = (mesh, i, p, r, s) => {
    _o.position.set(p[0], p[1], p[2]); if (r) _o.rotation.set(r[0], r[1], r[2]); else _o.rotation.set(0, 0, 0);
    if (s == null) _o.scale.set(1, 1, 1); else if (typeof s === 'number') _o.scale.set(s, s, s); else _o.scale.set(s[0], s[1], s[2]);
    _o.updateMatrix(); mesh.setMatrixAt(i, _o.matrix);
  };
  // Camera: position, look-at target, optional fov and roll. K.focus sets the lens: focus distance (or a point to
  // focus on) and aperture radius in world units (0 = everything sharp).
  const _v = new THREE.Vector3();
  K.look = (cam, pos, target, fov, roll) => {
    cam.position.set(pos[0], pos[1], pos[2]); cam.up.set(0, 1, 0); cam.lookAt(target[0], target[1], target[2]);
    if (roll) cam.rotateZ(roll);
    if (fov && fov !== cam.fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
  };
  K.focus = (cam, at, aperture) => {
    cam.userData.focus = typeof at === 'number' ? at : _v.set(at[0], at[1], at[2]).distanceTo(cam.position);
    if (aperture != null) cam.userData.aperture = aperture;
  };

  // ---------------------------------------------------------------- lighting
  // Code-built lighting environment for reflections and soft fill (replaces an HDRI). K.env(S, { top, horizon,
  // bottom: sky gradient colours; panels: [{ pos:[x,y,z], size:[w,h], color, power }] bright rectangles that face the
  // origin (softboxes, windows, a sun); intensity; background: true to also show it behind the scene; blur }).
  // Metal and glass can only shine if the environment has something bright in it.
  K.env = (S, o = {}) => {
    const es = new THREE.Scene();
    const sky = new THREE.Mesh(new THREE.SphereGeometry(60, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      uniforms: { top: { value: new THREE.Color(o.top || '#0b0d12') }, hor: { value: new THREE.Color(o.horizon || o.top || '#14171f') }, bot: { value: new THREE.Color(o.bottom || o.horizon || '#050506') }, gain: { value: o.skyPower == null ? 1 : o.skyPower } },
      vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'varying vec3 vD; uniform vec3 top, hor, bot; uniform float gain; void main(){ float y = normalize(vD).y; vec3 c = y > 0.0 ? mix(hor, top, pow(y, 0.6)) : mix(hor, bot, pow(-y, 0.5)); gl_FragColor = vec4(c * gain, 1.0); }',
    }));
    es.add(sky);
    for (const p of o.panels || []) {
      const c = new THREE.Color(p.color || '#ffffff').multiplyScalar(p.power == null ? 5 : p.power);
      const m = new THREE.Mesh(p.round ? new THREE.CircleGeometry((p.size ? p.size[0] : 4) / 2, 40) : new THREE.PlaneGeometry(p.size ? p.size[0] : 4, p.size ? p.size[1] : 4), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));
      m.position.set(p.pos[0], p.pos[1], p.pos[2]); m.lookAt(0, p.aimY || 0, 0); es.add(m);
    }
    const pm = new THREE.PMREMGenerator(S.renderer);
    const rt = pm.fromScene(es, o.blur == null ? 0.02 : o.blur, 0.1, 200);
    pm.dispose();
    S.scene.environment = rt.texture;
    S.scene.environmentIntensity = o.intensity == null ? 1 : o.intensity;
    if (o.background) { S.scene.background = rt.texture; S.scene.backgroundBlurriness = o.backgroundBlur == null ? 0.5 : o.backgroundBlur; S.scene.backgroundIntensity = o.backgroundIntensity == null ? 1 : o.backgroundIntensity; }
    return rt.texture;
  };
  // A shadow-casting spot light with a real size: `soft` is the radius of the light's surface in world units, which
  // gives true soft-edged shadows (bigger = softer). o: pos, target, color, power, angle, penumbra, soft, mapSize, near, far.
  K.spot = (S, o = {}) => {
    const l = new THREE.SpotLight(o.color || '#ffffff', o.power == null ? 80 : o.power, o.distance || 0, o.angle == null ? 0.5 : o.angle, o.penumbra == null ? 0.6 : o.penumbra, o.decay == null ? 2 : o.decay);
    l.position.set(...(o.pos || [3, 6, 4])); l.target.position.set(...(o.target || [0, 0, 0]));
    l.castShadow = o.shadow !== false; l.shadow.mapSize.setScalar(o.mapSize || 2048); l.shadow.bias = o.bias == null ? -0.0004 : o.bias; l.shadow.normalBias = o.normalBias == null ? 0.02 : o.normalBias;
    l.shadow.camera.near = o.near || 0.5; l.shadow.camera.far = o.far || 60;
    S.scene.add(l, l.target);
    if (o.soft) S.softLights.push({ light: l, radius: o.soft });
    return l;
  };
  // A sun: parallel light with shadows. `size` is the half-width of the area that gets shadows, `soft` the blur of
  // shadow edges in world units at the light (0.3-1.5 looks natural). o: pos, target, color, power, size, soft, mapSize.
  K.sun = (S, o = {}) => {
    const l = new THREE.DirectionalLight(o.color || '#ffffff', o.power == null ? 3 : o.power);
    l.position.set(...(o.pos || [6, 10, 5])); l.target.position.set(...(o.target || [0, 0, 0]));
    const s = o.size || 8, c = l.shadow.camera;
    l.castShadow = o.shadow !== false; c.left = -s; c.right = s; c.top = s; c.bottom = -s; c.near = 0.5; c.far = o.far || 80;
    l.shadow.mapSize.setScalar(o.mapSize || 2048); l.shadow.bias = o.bias == null ? -0.0004 : o.bias; l.shadow.normalBias = o.normalBias == null ? 0.02 : o.normalBias;
    S.scene.add(l, l.target);
    if (o.soft) S.softLights.push({ light: l, radius: o.soft });
    return l;
  };
  // Sky light with real occlusion: light arrives from the whole dome and is blocked by objects, so creases, contact
  // points and the ground under things darken softly (ambient occlusion, but physically made). o: color, power,
  // size (half-width covered), center, mapSize, spread (1 = full dome, lower = more from above).
  K.skyLight = (S, o = {}) => {
    const l = new THREE.DirectionalLight(o.color || '#ffffff', o.power == null ? 1.5 : o.power);
    const s = o.size || 8, c = l.shadow.camera;
    l.castShadow = true; c.left = -s; c.right = s; c.top = s; c.bottom = -s; c.near = 0.5; c.far = (o.dist || 30) * 2;
    l.shadow.mapSize.setScalar(o.mapSize || 1024); l.shadow.bias = o.bias == null ? -0.0006 : o.bias; l.shadow.normalBias = o.normalBias == null ? 0.03 : o.normalBias;
    l.target.position.set(...(o.center || [0, 0, 0]));
    S.scene.add(l, l.target);
    S.skyLights.push({ light: l, dist: o.dist || 30, spread: o.spread == null ? 1 : o.spread });
    return l;
  };
  // A real mirror floor at height y: reflects the scene, and still takes light and shadows like a normal material.
  // o: y, size, color, roughness (0 = perfect mirror, 0.3 = soft blurred reflection), strength (0..1), metalness,
  // fresnel (true = reflects more at grazing angles, like polished stone or wet ground), map/normalMap etc via `material`.
  K.mirrorFloor = (S, o = {}) => {
    const y = o.y || 0, W = S.W, H = S.H, scale = o.resolution || 1;
    const rt = new THREE.WebGLRenderTarget(Math.round(W * scale), Math.round(H * scale), { type: THREE.HalfFloatType, samples: S.msaa, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
    const mat = new THREE.MeshStandardMaterial(Object.assign({ color: o.color || '#111114', roughness: o.surfaceRoughness == null ? 0.35 : o.surfaceRoughness, metalness: o.metalness || 0 }, o.material || {}));
    const u = { tMirror: { value: rt.texture }, uMirrorMatrix: { value: new THREE.Matrix4() }, uMirrorStrength: { value: o.strength == null ? 0.6 : o.strength }, uMirrorFresnel: { value: o.fresnel === false ? 0 : 1 }, uMirrorFade: { value: o.fade || 0 }, uMirrorBlur: { value: (o.roughness || 0) * 7 } };
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, u);
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform mat4 uMirrorMatrix; varying vec4 vMirrorCoord; varying vec3 vMirrorWorld;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvec4 mw = modelMatrix * vec4(transformed, 1.0); vMirrorWorld = mw.xyz; vMirrorCoord = uMirrorMatrix * mw;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform sampler2D tMirror; uniform float uMirrorStrength, uMirrorFresnel, uMirrorFade, uMirrorBlur; varying vec4 vMirrorCoord; varying vec3 vMirrorWorld;')
        .replace('#include <opaque_fragment>', `vec3 mRefl = min(texture2DProj(tMirror, vMirrorCoord, uMirrorBlur).rgb, vec3(12.0));
          float mF = pow(1.0 - saturate(dot(normalize(vViewPosition), normal)), 5.0);
          float mK = uMirrorStrength * mix(1.0, 0.06 + 0.94 * mF, uMirrorFresnel);
          if (uMirrorFade > 0.0) mK *= exp(-length(vMirrorWorld.xz) / uMirrorFade);
          outgoingLight += mRefl * mK;
          #include <opaque_fragment>`);
    };
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(o.size || 80, o.size || 80), mat);
    mesh.rotation.x = -Math.PI / 2; mesh.position.y = y; mesh.receiveShadow = true;
    S.scene.add(mesh);
    S.mirrors.push({ mesh, rt, u, y, rough: o.roughness || 0, cam: new THREE.PerspectiveCamera() });
    return mesh;
  };

  // ---------------------------------------------------------------- the stage
  const QUAD_VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
  const TONE = `
    vec3 tmFilmic(vec3 c){ // ACES fitted (Stephen Hill)
      mat3 a = mat3(0.59719,0.07600,0.02840, 0.35458,0.90834,0.13383, 0.04823,0.01566,0.83777);
      mat3 b = mat3(1.60475,-0.10208,-0.00327, -0.53108,1.10813,-0.07276, -0.07367,-0.00605,1.07602);
      c = a * (c / 0.6); vec3 x = c * (c + 0.0245786) - 0.000090537; vec3 y = c * (0.983729 * c + 0.4329510) + 0.238081;
      return clamp(b * (x / y), 0.0, 1.0);
    }
    vec3 tmNeutral(vec3 c){ // Khronos PBR neutral: keeps colours true, only compresses highlights
      float x = min(c.r, min(c.g, c.b)); float off = x < 0.08 ? x - 6.25 * x * x : 0.04; c -= off;
      float peak = max(c.r, max(c.g, c.b)); if (peak < 0.76) return c;
      float d = 1.0 - 0.76; float np = 1.0 - d * d / (peak + d - 0.76); c *= np / peak;
      float g = 1.0 - 1.0 / (0.15 * (peak - np) + 1.0); return mix(c, vec3(np), g);
    }
    vec3 tmAgx(vec3 c){ // AgX (minimal, Benjamin Wrensch): soft, filmic, desaturates bright colours gracefully
      mat3 m = mat3(0.842479062253094,0.0423282422610123,0.0423756549057051, 0.0784335999999992,0.878468636469772,0.0784336, 0.0792237451477643,0.0791661274605434,0.879142973793104);
      mat3 mi = mat3(1.19687900512017,-0.0528968517574562,-0.0529716355144438, -0.0980208811401368,1.15190312990417,-0.0980434501171241, -0.0990297440797205,-0.0989611768448433,1.15107367264116);
      c = m * c; c = clamp((log2(max(c, 1e-10)) + 12.47393) / 16.5, 0.0, 1.0);
      vec3 x2 = c * c, x4 = x2 * x2;
      c = 15.5 * x4 * x2 - 40.14 * x4 * c + 31.96 * x4 - 6.868 * x2 * c + 0.4298 * x2 + 0.1191 * c - 0.00232;
      c = mi * c; return pow(max(c, 0.0), vec3(2.2));
    }`;

  function pass(frag, uniforms) {
    return new THREE.ShaderMaterial({ vertexShader: QUAD_VS, fragmentShader: 'precision highp float; varying vec2 vUv;\n' + frag, uniforms, depthTest: false, depthWrite: false });
  }

  // createStage(canvas, style, { samples }) -> S. S.seek(t) renders one finished frame.
  K.createStage = (canvas, style, opts = {}) => {
    const R = Object.assign({ samples: 32, preview: 3, shutter: 0.5, fps: 30, exposure: 1, tone: 'filmic', bloom: 0.25, bloomThreshold: 1.0, bloomRadius: 1, vignette: 0.25, grain: 0.03, ca: 0, saturation: 1, contrast: 1, lift: 0, fov: 35, near: 0.1, far: 200, background: '#000000', shadows: true }, style.render || {});
    const W = opts.width || 1920, H = opts.height || 1080;
    const N = Math.max(1, opts.samples || R.samples);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false);
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.shadowMap.enabled = !!R.shadows; renderer.shadowMap.type = R.shadowType === 'vsm' ? THREE.VSMShadowMap : THREE.PCFShadowMap;
    const scene = new THREE.Scene(); scene.background = new THREE.Color(R.background);
    const camera = new THREE.PerspectiveCamera(R.fov, W / H, R.near, R.far);
    camera.position.set(0, 1.5, 8); camera.userData.aperture = 0; camera.userData.focus = 8;
    const msaa = N >= 8 ? 0 : 4;
    const S = { THREE, K, renderer, scene, camera, W, H, style, R, samples: N, msaa, softLights: [], skyLights: [], mirrors: [], duration: style.duration || 6 };

    const HF = { type: THREE.HalfFloatType, depthBuffer: false };
    const sceneRT = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: msaa });
    const accRT = new THREE.WebGLRenderTarget(W, H, HF);
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    const qScene = new THREE.Scene(); qScene.add(quad);
    const qCam = new THREE.Camera();
    const draw = (mat, target) => { quad.material = mat; renderer.setRenderTarget(target); renderer.render(qScene, qCam); };

    const mAcc = pass('uniform sampler2D tex; uniform float w; void main(){ gl_FragColor = vec4(min(texture2D(tex, vUv).rgb, vec3(64.0)) * w, w); }', { tex: { value: sceneRT.texture }, w: { value: 1 } });
    mAcc.blending = THREE.CustomBlending; mAcc.blendEquation = THREE.AddEquation; mAcc.blendSrc = THREE.OneFactor; mAcc.blendDst = THREE.OneFactor; mAcc.transparent = true;

    // bloom: threshold, then a chain of down-samples and smooth up-samples (wide, soft, no blockiness)
    const LV = 7, bl = [];
    for (let i = 0, w = W >> 1, h = H >> 1; i < LV && w > 4 && h > 4; i++, w >>= 1, h >>= 1) bl.push({ d: new THREE.WebGLRenderTarget(w, h, HF), u: new THREE.WebGLRenderTarget(w, h, HF), w, h });
    const mPre = pass('uniform sampler2D tex; uniform float thr; void main(){ vec3 c = min(texture2D(tex, vUv).rgb, vec3(60.0)); float l = max(c.r, max(c.g, c.b)); float k = clamp((l - thr) / max(thr * 0.5, 1e-3), 0.0, 1.0); gl_FragColor = vec4(c * k * k * (3.0 - 2.0 * k), 1.0); }', { tex: { value: accRT.texture }, thr: { value: R.bloomThreshold } });
    const mDown = pass(`uniform sampler2D tex; uniform vec2 px;
      void main(){ vec3 a = texture2D(tex, vUv + px * vec2(-2, 2)).rgb, b = texture2D(tex, vUv + px * vec2(0, 2)).rgb, c = texture2D(tex, vUv + px * vec2(2, 2)).rgb,
        d = texture2D(tex, vUv + px * vec2(-2, 0)).rgb, e = texture2D(tex, vUv).rgb, f = texture2D(tex, vUv + px * vec2(2, 0)).rgb,
        g = texture2D(tex, vUv + px * vec2(-2, -2)).rgb, h = texture2D(tex, vUv + px * vec2(0, -2)).rgb, i = texture2D(tex, vUv + px * vec2(2, -2)).rgb,
        j = texture2D(tex, vUv + px * vec2(-1, 1)).rgb, k = texture2D(tex, vUv + px * vec2(1, 1)).rgb, l = texture2D(tex, vUv + px * vec2(-1, -1)).rgb, m = texture2D(tex, vUv + px * vec2(1, -1)).rgb;
        gl_FragColor = vec4(e * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + (j + k + l + m) * 0.125, 1.0); }`, { tex: { value: null }, px: { value: new THREE.Vector2() } });
    const mUp = pass(`uniform sampler2D tex, add; uniform vec2 px; uniform float r;
      void main(){ vec2 o = px * r; vec3 s = texture2D(tex, vUv).rgb * 4.0 + (texture2D(tex, vUv + vec2(o.x, 0)).rgb + texture2D(tex, vUv - vec2(o.x, 0)).rgb + texture2D(tex, vUv + vec2(0, o.y)).rgb + texture2D(tex, vUv - vec2(0, o.y)).rgb) * 2.0
        + texture2D(tex, vUv + o).rgb + texture2D(tex, vUv - o).rgb + texture2D(tex, vUv + vec2(o.x, -o.y)).rgb + texture2D(tex, vUv + vec2(-o.x, o.y)).rgb;
        gl_FragColor = vec4(s / 16.0 + texture2D(add, vUv).rgb, 1.0); }`, { tex: { value: null }, add: { value: null }, px: { value: new THREE.Vector2() }, r: { value: R.bloomRadius } });

    const ovCanvas = document.createElement('canvas'); ovCanvas.width = W; ovCanvas.height = H;
    const ovCtx = ovCanvas.getContext('2d');
    const ovTex = new THREE.CanvasTexture(ovCanvas); ovTex.colorSpace = THREE.NoColorSpace; ovTex.premultiplyAlpha = true; ovTex.generateMipmaps = false; ovTex.minFilter = THREE.LinearFilter;
    const mOut = pass(TONE + `
      uniform sampler2D tex, bloom; uniform float exposure, bloomK, vig, ca, sat, con, lift, levels; uniform int tone; uniform vec2 res;
      void main(){
        vec2 d = vUv - 0.5; float r2 = dot(d, d);
        vec3 c;
        if (ca > 0.0) { c.r = texture2D(tex, 0.5 + d * (1.0 + ca * r2)).r; c.g = texture2D(tex, vUv).g; c.b = texture2D(tex, 0.5 + d * (1.0 - ca * r2)).b; }
        else c = texture2D(tex, vUv).rgb;
        c += texture2D(bloom, vUv).rgb * bloomK / levels;
        c = max(c * exposure, 0.0);
        c = tone == 0 ? tmFilmic(c) : tone == 1 ? tmNeutral(c) : tone == 2 ? tmAgx(c) : clamp(c, 0.0, 1.0);
        float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
        c = mix(vec3(l), c, sat); c = (c - 0.5) * con + 0.5; c = c + lift * (1.0 - c);
        c *= 1.0 - vig * smoothstep(0.22, 0.8, length(d * vec2(1.0, 0.82)));
        c = clamp(c, 0.0, 1.0);
        c = mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
        gl_FragColor = vec4(c, 1.0);
      }`, { tex: { value: accRT.texture }, bloom: { value: null }, exposure: { value: R.exposure }, bloomK: { value: R.bloom }, vig: { value: R.vignette }, ca: { value: R.ca }, sat: { value: R.saturation }, con: { value: R.contrast }, lift: { value: R.lift }, levels: { value: 1 }, tone: { value: { filmic: 0, neutral: 1, agx: 2, linear: 3 }[R.tone] ?? 0 }, res: { value: new THREE.Vector2(W, H) } });

    // after grading the picture is 8-bit display colour: optional style filters run here (painterly, dither, halftone...),
    // then grain and the 2D overlay go on top
    const LD = { depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
    const ldA = new THREE.WebGLRenderTarget(W, H, LD), ldB = new THREE.WebGLRenderTarget(W, H, LD);
    const mFin = pass(`uniform sampler2D tex, ov; uniform float grain, seed, useOv;
      float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      void main(){ vec3 c = texture2D(tex, vUv).rgb; float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
        float g = (h21(gl_FragCoord.xy + seed) + h21(gl_FragCoord.xy * 1.37 + seed * 1.7) - 1.0);
        c += g * grain * (0.55 + 0.45 * (1.0 - l));
        if (useOv > 0.5) { vec4 o = texture2D(ov, vUv); c = o.rgb + c * (1.0 - o.a); }
        gl_FragColor = vec4(c, 1.0); }`, { tex: { value: ldA.texture }, ov: { value: ovTex }, grain: { value: R.grain }, seed: { value: 0 }, useOv: { value: 0 } });
    const filters = [];
    // S.addFilter(fragmentShaderBody, uniforms): a full-screen pass over the graded picture. The shader gets
    // `uniform sampler2D tex; uniform vec2 res; uniform float time; varying vec2 vUv;` and must set gl_FragColor.
    S.addFilter = (frag, uniforms = {}) => { const m = pass('uniform sampler2D tex; uniform vec2 res; uniform float time;\n' + frag, Object.assign({ tex: { value: null }, res: { value: new THREE.Vector2(W, H) }, time: { value: 0 } }, uniforms)); filters.push(m); return m; };

    let api = null;
    const cp = new THREE.Vector3(), right = new THREE.Vector3(), up = new THREE.Vector3(), tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(), nrm = new THREE.Vector3();
    const rot = new THREE.Matrix4(), plane = new THREE.Plane(), clip = new THREE.Vector4(), q = new THREE.Vector4(), saved = [];

    function renderMirrors(i) {
      for (const m of S.mirrors) {
        const cam = m.cam;
        // roughness: tilt the mirror plane a little differently on each sub-render, which blurs the reflection
        const a = m.rough * 0.12, th = 2 * Math.PI * halton(i + 1, 7), rr = Math.sqrt(halton(i + 1, 11)) * a;
        nrm.set(Math.cos(th) * rr, 1, Math.sin(th) * rr).normalize();
        const origin = tmp2.set(0, m.y, 0);
        camera.getWorldPosition(cp);
        const view = tmp.copy(origin).sub(cp);
        if (view.dot(nrm) > 0) continue;
        view.reflect(nrm).negate().add(origin);
        rot.extractRotation(camera.matrixWorld);
        const look = new THREE.Vector3(0, 0, -1).applyMatrix4(rot).add(cp);
        const target = origin.clone().sub(look).reflect(nrm).negate().add(origin);
        cam.position.copy(view); cam.up.set(0, 1, 0).applyMatrix4(rot).reflect(nrm); cam.lookAt(target);
        cam.near = camera.near; cam.far = camera.far; cam.updateMatrixWorld(); cam.projectionMatrix.copy(camera.projectionMatrix);
        m.u.uMirrorMatrix.value.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1).multiply(cam.projectionMatrix).multiply(cam.matrixWorldInverse);
        // clip everything below the mirror (oblique near plane)
        plane.setFromNormalAndCoplanarPoint(nrm, origin).applyMatrix4(cam.matrixWorldInverse);
        clip.set(plane.normal.x, plane.normal.y, plane.normal.z, plane.constant);
        const pm = cam.projectionMatrix.elements;
        q.x = (Math.sign(clip.x) + pm[8]) / pm[0]; q.y = (Math.sign(clip.y) + pm[9]) / pm[5]; q.z = -1; q.w = (1 + pm[10]) / pm[14];
        clip.multiplyScalar(2 / clip.dot(q));
        pm[2] = clip.x; pm[6] = clip.y; pm[10] = clip.z + 1 - 0.003; pm[14] = clip.w;
        m.mesh.visible = false;
        renderer.setRenderTarget(m.rt); renderer.render(scene, cam);
        m.mesh.visible = true;
      }
    }

    function subRender(t, i, n) {
      api.update(t);
      saved.length = 0;
      // lights with a size: sample a different point on the light each sub-render
      S.softLights.forEach((s, k) => {
        const l = s.light; saved.push([l, l.position.clone()]);
        if (n === 1) return;
        const u = (halton(i + 1, 3) + k * 0.37) % 1, v = (halton(i + 1, 5) + k * 0.61) % 1, r = Math.sqrt(u) * s.radius, a = 2 * Math.PI * v;
        tmp.copy(l.position).sub(l.target ? l.target.position : tmp2.set(0, 0, 0)).normalize();
        right.set(0, 1, 0).cross(tmp); if (right.lengthSq() < 1e-6) right.set(1, 0, 0); right.normalize(); up.crossVectors(tmp, right);
        l.position.addScaledVector(right, Math.cos(a) * r).addScaledVector(up, Math.sin(a) * r);
      });
      S.skyLights.forEach((s, k) => {
        const u = (halton(i + 1, 2) + k * 0.31) % 1, v = (halton(i + 1, 3) + k * 0.53) % 1;
        const sinT = Math.sqrt(u) * s.spread, cosT = Math.sqrt(Math.max(0, 1 - sinT * sinT)), a = 2 * Math.PI * v;
        const c = s.light.target.position;
        if (n === 1) s.light.position.set(c.x + 0.15 * s.dist, c.y + s.dist, c.z + 0.1 * s.dist);
        else s.light.position.set(c.x + Math.cos(a) * sinT * s.dist, c.y + cosT * s.dist, c.z + Math.sin(a) * sinT * s.dist);
      });
      // lens: move the camera across the aperture and shear the view so the focus plane stays put (true depth of field)
      camera.updateMatrixWorld(); camera.updateProjectionMatrix();
      const camPos = camera.position.clone(), e = camera.projectionMatrix.elements;
      if (n > 1) {
        const ap = camera.userData.aperture || 0, fd = Math.max(0.05, camera.userData.focus || 8);
        if (ap > 0) {
          const r = Math.sqrt(halton(i + 1, 2)) * ap, a = 2 * Math.PI * halton(i + 1, 3), dx = Math.cos(a) * r, dy = Math.sin(a) * r;
          right.setFromMatrixColumn(camera.matrixWorld, 0); up.setFromMatrixColumn(camera.matrixWorld, 1);
          camera.position.addScaledVector(right, dx).addScaledVector(up, dy); camera.updateMatrixWorld();
          e[8] -= e[0] * dx / fd; e[9] -= e[5] * dy / fd;
        }
        e[8] += (halton(i + 1, 5) - 0.5) * 2 / W; e[9] += (halton(i + 1, 7) - 0.5) * 2 / H;
        camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
      }
      if (S.mirrors.length) renderMirrors(i);
      renderer.setRenderTarget(sceneRT); renderer.render(scene, camera);
      camera.position.copy(camPos); camera.updateMatrixWorld(); camera.updateProjectionMatrix();
      for (const [l, p] of saved) l.position.copy(p);
    }

    S.seek = (t, sampleOverride) => {
      const n = sampleOverride || S.samples;
      renderer.setRenderTarget(accRT); renderer.setClearColor(0x000000, 0); renderer.clear();
      mAcc.uniforms.w.value = 1 / n;
      for (let i = 0; i < n; i++) {
        const ts = n > 1 ? t + ((i + 0.5) / n - 0.5) * R.shutter / R.fps : t;
        subRender(K.clamp(ts, 0, S.duration), i, n);
        renderer.autoClear = false; draw(mAcc, accRT); renderer.autoClear = true;
      }
      api.update(t); // leave the scene at the exact frame time (for the overlay and anything that reads it)
      let bloomTex = null;
      if (R.bloom > 0) {
        mPre.uniforms.thr.value = R.bloomThreshold; draw(mPre, bl[0].d);
        for (let i = 1; i < bl.length; i++) { mDown.uniforms.tex.value = bl[i - 1].d.texture; mDown.uniforms.px.value.set(1 / bl[i - 1].w, 1 / bl[i - 1].h); draw(mDown, bl[i].d); }
        let prev = bl[bl.length - 1].d;
        for (let i = bl.length - 2; i >= 0; i--) { mUp.uniforms.tex.value = prev.texture; mUp.uniforms.add.value = bl[i].d.texture; mUp.uniforms.px.value.set(1 / prev.width, 1 / prev.height); draw(mUp, bl[i].u); prev = bl[i].u; }
        bloomTex = prev.texture;
      }
      const o = mOut.uniforms;
      o.bloom.value = bloomTex; o.bloomK.value = bloomTex ? R.bloom : 0; o.levels.value = bl.length; o.exposure.value = R.exposure; o.vig.value = R.vignette; o.ca.value = R.ca; o.sat.value = R.saturation; o.con.value = R.contrast; o.lift.value = R.lift;
      draw(mOut, ldA);
      let src = ldA, dst = ldB;
      for (const f of filters) { f.uniforms.tex.value = src.texture; f.uniforms.time.value = t; draw(f, dst); [src, dst] = [dst, src]; }
      const fu = mFin.uniforms;
      fu.tex.value = src.texture; fu.grain.value = R.grain; fu.seed.value = Math.round(t * R.fps) * 17.0 % 1000;
      if (api.overlay) { ovCtx.clearRect(0, 0, W, H); ovCtx.save(); api.overlay(ovCtx, t, W, H); ovCtx.restore(); ovTex.needsUpdate = true; fu.useOv.value = 1; } else fu.useOv.value = 0;
      draw(mFin, null);
    };
    S.setApi = (a) => { api = typeof a === 'function' ? { update: a } : a; };
    return S;
  };

  // Load fonts, build the style and return its stage. `K.run(canvas, style, { samples })`.
  K.run = async (canvas, style, opts) => {
    if (style.fonts && document.fonts) await Promise.all(style.fonts.map((f) => document.fonts.load(f).catch(() => null)));
    const S = K.createStage(canvas, style, opts);
    S.setApi(await style.build(S));
    return S;
  };

  root.K = K;
})(typeof window !== 'undefined' ? window : globalThis);
```

SOUND KIT (lib/sound.js)
```js
// sound.js: a small synthesized sound kit for the style explainers. Plain Web Audio, no audio files.
// Voiceover mode: SOUND.kit(ctx, { voiceover: true }) drops beds and music, plays anything marked minor
// (play(..., { minor: true }), tone/noise { minor: true }, or scheduled inside k.withMinor(() => ...)) at about 60%
// volume instead of full, and sits all effects a little lower, so the narration stays on top while the piece still
// sounds alive. In the full mix, minor sounds play at full volume. Scores can read k.vo to branch further.
// A style adds   explainerSound(k) { k.bed('room', 0, D); k.play('pop', 1.25); ... }   and the same
// call schedules into a live AudioContext (the player) or an OfflineAudioContext (the video render).
// Times are seconds on the explainer's own clock. Randomness is seeded, so every render is identical.
(function () {
  'use strict';
  const SOUND = (window.SOUND = {});
  const TINY = 1e-4;

  // seeded random in [0,1), keyed by any string
  function rand(key) {
    let h = 2166136261;
    for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619); }
    let a = h >>> 0 || 1;
    return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  // note names to Hz: 'A4' = 440, 'C#5', 'Eb3'
  const STEP = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function hz(n) {
    if (typeof n === 'number') return n;
    const m = /^([A-G])([#b]?)(-?\d)$/.exec(n);
    const semis = STEP[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (Number(m[3]) - 4) * 12 - 9;
    return 440 * Math.pow(2, semis / 12);
  }
  SOUND.hz = hz;

  SOUND.kit = function (ctx, opts) {
    const o = opts || {};
    const VO = !!o.voiceover;
    const MINOR = 0.6; // voiceover-mode volume for minor sounds
    let inMinor = false;
    const gainOf = (p, d) => (p.gain == null ? d : p.gain) * (VO && (p.minor || inMinor) ? MINOR : 1);
    const T0 = (o.start || 0) - 0; // explainer time that maps to ctx time `base`
    const base = ctx.currentTime + (o.delay || 0);
    // Start times snap to the sample grid (+ a quarter sample): in Chrome a source started a hair off the grid can
    // spike to about twice its set level.
    const SR = ctx.sampleRate;
    const at = (t) => (Math.round((base + (t - T0)) * SR) + 0.25) / SR;

    // ---- buses: sfx, amb, music -> compressor -> master; one shared reverb send
    const master = ctx.createGain(); master.gain.value = o.master == null ? 0.9 : o.master;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 8; comp.ratio.value = 3; comp.attack.value = 0.004; comp.release.value = 0.18;
    comp.connect(master); master.connect(o.dest || ctx.destination);
    const bus = {};
    for (const [name, g] of Object.entries({ sfx: VO ? 0.7 : 0.85, amb: 0.5, music: 0.45 })) { bus[name] = ctx.createGain(); bus[name].gain.value = g; bus[name].connect(comp); }

    // generated room reverb: decaying stereo noise, darker toward the tail
    const verb = ctx.createConvolver();
    {
      const secs = 1.6, n = Math.floor(secs * ctx.sampleRate), ir = ctx.createBuffer(2, n, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const r = rand('verb' + c), d = ir.getChannelData(c); let lp = 0;
        for (let i = 0; i < n; i++) { const u = i / n; lp += (0.6 - 0.45 * u) * ((r() * 2 - 1) - lp); d[i] = lp * Math.pow(1 - u, 3); }
      }
      verb.buffer = ir;
    }
    const verbIn = ctx.createGain(); verbIn.gain.value = 0.9; verbIn.connect(verb); verb.connect(comp);

    // seeded noise buffers: white, pink-ish and brown
    const noiseBuf = {};
    {
      const n = Math.floor(2.5 * ctx.sampleRate);
      for (const kind of ['white', 'pink', 'brown']) {
        const b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0), r = rand('noise-' + kind);
        let p0 = 0, p1 = 0, p2 = 0, br = 0;
        for (let i = 0; i < n; i++) {
          const w = r() * 2 - 1;
          if (kind === 'white') d[i] = w;
          else if (kind === 'pink') { p0 = 0.997 * p0 + 0.029 * w; p1 = 0.985 * p1 + 0.032 * w; p2 = 0.95 * p2 + 0.048 * w; d[i] = (p0 + p1 + p2 + w * 0.05) * 2.2; }
          else { br = (br + 0.02 * w) / 1.02; d[i] = br * 3.2; }
        }
        noiseBuf[kind] = b;
      }
    }

    // ---- automation helpers
    // a value or [[dt, value], ...] from the voice start; ramps are exponential (frequencies)
    function sweep(param, v, t) {
      if (!Array.isArray(v)) { param.setValueAtTime(v, t); return; }
      param.setValueAtTime(v[0][1], t + v[0][0]);
      for (let i = 1; i < v.length; i++) param.exponentialRampToValueAtTime(Math.max(v[i][1], 1), t + v[i][0]);
    }
    // amplitude: linear attack to `gain`, optional hold, exponential release to silence by `dur`
    function shape(param, t, gain, dur, a, hold) {
      a = Math.min(a == null ? 0.004 : a, dur * 0.9);
      hold = Math.min(hold || 0, dur - a);
      param.setValueAtTime(0, t);
      param.linearRampToValueAtTime(gain, t + a);
      if (hold > 0) param.setValueAtTime(gain, t + a + hold);
      param.exponentialRampToValueAtTime(TINY, t + dur);
      param.setValueAtTime(0, t + dur + 0.001);
    }
    function out(node, p) {
      const pan = ctx.createStereoPanner(); pan.pan.value = Math.max(-1, Math.min(1, p.pan || 0));
      node.connect(pan); pan.connect(bus[p.bus || 'sfx']);
      if (p.verb) { const s = ctx.createGain(); s.gain.value = p.verb; pan.connect(s); s.connect(verbIn); }
    }
    function filterNode(p, t) {
      if (!p.filter) return null;
      const f = ctx.createBiquadFilter(); f.type = p.filter; f.Q.value = p.q == null ? 1 : p.q;
      sweep(f.frequency, p.f == null ? 1000 : p.f, t);
      return f;
    }

    // Live playback from the middle of a piece: a long sound (a bed, a pad) that began before that point has a start
    // time in the past, which Web Audio refuses. Pick it up now, at its held level, for the time it has left.
    function late(t, dur, p) {
      if (t >= ctx.currentTime) return null;   // never true in an offline render, so rendered sound is unchanged
      const now = ctx.currentTime + 0.01;
      const cut = now - t, left = dur - cut;
      if (left < 0.08) return { skip: true };
      const a = Math.min(0.05, left / 2);
      return { t: now, dur: left, p: Object.assign({}, p, { a, hold: Math.max(0, Math.min(left - a - 0.02, (p.a == null ? 0.004 : p.a) + (p.hold || 0) - cut)) }) };
    }

    // ---- primitives
    // tone(t, { f, type, dur, gain, a, hold, pan, verb, bus, filter, f2 (filter freq), q, detune })
    function tone(time, p) {
      let t = at(time), dur = p.dur || 0.2;
      if (t + dur < ctx.currentTime || (time < T0 - 0.001 && dur < 1.5)) return;
      const lt = late(t, dur, p); if (lt) { if (lt.skip) return; t = lt.t; dur = lt.dur; p = lt.p; }
      const osc = ctx.createOscillator(); osc.type = p.type || 'sine';
      sweep(osc.frequency, Array.isArray(p.f) ? p.f.map(([d, v]) => [d, hz(v)]) : hz(p.f || 440), t);
      if (p.detune) osc.detune.value = p.detune;
      const g = ctx.createGain(); shape(g.gain, t, gainOf(p, 0.3), dur, p.a, p.hold);
      let node = osc;
      if (p.filter) { const f = ctx.createBiquadFilter(); f.type = p.filter; f.Q.value = p.q == null ? 0.8 : p.q; sweep(f.frequency, p.f2 || 2000, t); osc.connect(f); node = f; }
      node.connect(g); out(g, p);
      osc.start(t); osc.stop(t + dur + 0.02);
    }
    // noise(t, { dur, color, filter, f, q, gain, a, hold, pan, verb, bus, rate })
    function noise(time, p) {
      let t = at(time), dur = p.dur || 0.2;
      if (t + dur < ctx.currentTime || (time < T0 - 0.001 && dur < 1.5)) return;
      const lt = late(t, dur, p); if (lt) { if (lt.skip) return; t = lt.t; dur = lt.dur; p = lt.p; }
      const src = ctx.createBufferSource(); src.buffer = noiseBuf[p.color || 'white']; src.loop = true;
      if (p.rate) src.playbackRate.value = p.rate;
      const g = ctx.createGain(); shape(g.gain, t, gainOf(p, 0.3), dur, p.a, p.hold);
      const f = filterNode(p, t);
      if (f) { src.connect(f); f.connect(g); } else src.connect(g);
      out(g, p);
      const off = rand('off' + time + (p.f || ''))() * 2;
      src.start(t, off); src.stop(t + dur + 0.02);
    }

    // ---- named sounds. play(name, t, opts): opts.gain scales the whole sound, opts.pan places it.
    const S = {
      // UI / motion graphics
      pop: (t, o) => { tone(t, { f: [[0, o.f || 620], [0.07, (o.f || 620) * 0.45]], dur: 0.1, gain: 0.32 * o.g, pan: o.pan }); noise(t, { dur: 0.012, filter: 'highpass', f: 3000, gain: 0.12 * o.g, pan: o.pan }); },
      tick: (t, o) => noise(t, { dur: 0.018, filter: 'bandpass', f: o.f || 4200, q: 2.5, gain: 0.3 * o.g, pan: o.pan }),
      click: (t, o) => { tone(t, { f: o.f || 1900, type: 'square', dur: 0.02, gain: 0.08 * o.g, filter: 'lowpass', f2: 3000, pan: o.pan }); noise(t, { dur: 0.01, filter: 'highpass', f: 2500, gain: 0.15 * o.g, pan: o.pan }); },
      tock: (t, o) => { tone(t, { f: o.f || 820, dur: 0.07, gain: 0.25 * o.g, pan: o.pan }); noise(t, { dur: 0.05, filter: 'bandpass', f: o.f || 820, q: 9, gain: 0.35 * o.g, pan: o.pan }); },
      blip: (t, o) => tone(t, { f: o.f || 'E6', type: o.type || 'square', dur: o.dur || 0.07, gain: 0.07 * o.g, a: 0.002, hold: (o.dur || 0.07) * 0.6, pan: o.pan }),
      whoosh: (t, o) => { const d = o.dur || 0.45; noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 350], [d * 0.55, o.top || 2600], [d, 700]], q: 0.9, gain: 0.32 * o.g, a: d * 0.5, pan: o.pan, verb: 0.15 }); },
      swish: (t, o) => { const d = o.dur || 0.18; noise(t, { dur: d, filter: 'highpass', f: [[0, 1800], [d, 5200]], q: 0.7, gain: 0.22 * o.g, a: d * 0.35, pan: o.pan }); },
      riser: (t, o) => { const d = o.dur || 0.8; noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 300], [d, 4000]], q: 1.2, gain: 0.25 * o.g, a: d * 0.95, pan: o.pan, verb: 0.2 }); tone(t, { f: [[0, 180], [d, 720]], type: 'triangle', dur: d, gain: 0.06 * o.g, a: d * 0.9 }); },
      thud: (t, o) => { tone(t, { f: [[0, o.f || 130], [0.16, 42]], dur: 0.26, gain: 0.55 * o.g, pan: o.pan }); noise(t, { dur: 0.09, color: 'brown', filter: 'lowpass', f: 500, gain: 0.35 * o.g, pan: o.pan }); },
      impact: (t, o) => { S.thud(t, o); noise(t, { dur: 0.7, color: 'pink', filter: 'lowpass', f: [[0, 2400], [0.6, 300]], gain: 0.3 * o.g, verb: 0.35, pan: o.pan }); },
      stamp: (t, o) => { S.thud(t, { ...o, f: 160 }); noise(t, { dur: 0.05, filter: 'bandpass', f: 1300, q: 1.2, gain: 0.4 * o.g, pan: o.pan }); noise(t + 0.004, { dur: 0.012, filter: 'highpass', f: 3500, gain: 0.25 * o.g, pan: o.pan }); },
      ding: (t, o) => { const f = hz(o.f || 'E6'); tone(t, { f, dur: 1.3, gain: 0.2 * o.g, verb: 0.3, pan: o.pan }); tone(t, { f: f * 2.76, dur: 0.5, gain: 0.05 * o.g, verb: 0.3, pan: o.pan }); },
      success: (t, o) => { S.ding(t, { ...o, f: o.f || 'C6' }); S.ding(t + 0.09, { ...o, f: hz(o.f || 'C6') * 1.5, g: o.g * 0.9 }); },
      error: (t, o) => { tone(t, { f: o.f || 'A3', type: 'square', dur: 0.13, gain: 0.09 * o.g, hold: 0.08, filter: 'lowpass', f2: 1400, pan: o.pan }); tone(t + 0.15, { f: hz(o.f || 'A3') * 0.8, type: 'square', dur: 0.22, gain: 0.09 * o.g, hold: 0.14, filter: 'lowpass', f2: 1200, pan: o.pan }); },
      buzz: (t, o) => { const d = o.dur || 0.3; tone(t, { f: o.f || 110, type: 'sawtooth', dur: d, gain: 0.12 * o.g, hold: d * 0.7, filter: 'lowpass', f2: 900, pan: o.pan }); tone(t, { f: (o.f || 110) * 1.01, type: 'sawtooth', dur: d, gain: 0.1 * o.g, hold: d * 0.7, filter: 'lowpass', f2: 900, pan: o.pan }); },
      sparkle: (t, o) => { const r = rand('sparkle' + t), notes = ['C6', 'D6', 'E6', 'G6', 'A6', 'C7']; for (let i = 0; i < (o.n || 6); i++) { const ti = t + i * 0.04 + r() * 0.01, f = hz(notes[Math.floor(r() * notes.length)]), pan = r() * 1.2 - 0.6; tone(ti, { f, dur: 0.6, gain: 0.04 * o.g, a: 0.002, verb: 0.35, pan }); tone(ti, { f: f * 2.76, dur: 0.2, gain: 0.012 * o.g, a: 0.002, pan }); } },
      glitch: (t, o) => { const r = rand('glitch' + t); for (let i = 0; i < 7; i++) tone(t + i * 0.022, { f: 200 + r() * 1800, type: 'square', dur: 0.02, gain: 0.07 * o.g, a: 0.001, hold: 0.015, pan: r() * 1.4 - 0.7 }); noise(t, { dur: 0.16, filter: 'bandpass', f: 2500, q: 0.6, gain: 0.12 * o.g }); },
      shutter: (t, o) => { S.click(t, o); noise(t + 0.06, { dur: 0.04, filter: 'bandpass', f: 2200, q: 1, gain: 0.2 * o.g, pan: o.pan }); },
      count: (t, o) => S.tick(t, { ...o, f: o.f || 5200, g: o.g * 0.7 }),

      // hand-made media
      // stroke: a pen/marker/chalk/pencil stroke over `dur` seconds. material sets the surface sound.
      stroke: (t, o) => {
        const d = o.dur || 0.4, m = o.material || 'marker', r = rand('stroke' + m + t);
        const M = {
          marker: { f: 2900, q: 2.2, g: 0.16, grain: 0.05 },
          chalk: { f: 1700, q: 0.6, g: 0.22, grain: 0.028 },
          pencil: { f: 4600, q: 0.8, g: 0.16, grain: 0.04, filter: 'highpass' },
          pen: { f: 4200, q: 1.6, g: 0.08, grain: 0.06 },
          brush: { f: 900, q: 0.5, g: 0.1, grain: 0.09, color: 'pink' },
          sharpie: { f: 2400, q: 1.4, g: 0.2, grain: 0.045 },
        }[m];
        for (let x = 0; x < d; x += M.grain * (0.7 + r() * 0.6)) {
          const gd = M.grain * (0.8 + r() * 0.9);
          noise(t + x, { dur: gd, color: M.color, filter: M.filter || 'bandpass', f: M.f * (0.8 + r() * 0.4), q: M.q, gain: M.g * o.g * (0.6 + r() * 0.5), a: gd * 0.3, pan: (o.pan || 0) + (r() - 0.5) * 0.2 });
        }
      },
      // paper: picking up / slapping down / turning a sheet
      paper: (t, o) => { const d = o.dur || 0.35, r = rand('paper' + t); for (let x = 0; x < d; x += 0.025 + r() * 0.03) noise(t + x, { dur: 0.05, filter: 'bandpass', f: 1200 + r() * 2600, q: 0.9, gain: 0.12 * o.g * (1 - x / d * 0.5), pan: o.pan }); },
      slap: (t, o) => { noise(t, { dur: 0.07, filter: 'highpass', f: 900, gain: 0.45 * o.g, a: 0.001, pan: o.pan }); tone(t, { f: [[0, 180], [0.06, 70]], dur: 0.1, gain: 0.25 * o.g, pan: o.pan }); },
      tape: (t, o) => { noise(t, { dur: o.dur || 0.5, filter: 'bandpass', f: [[0, 900], [o.dur || 0.5, 2200]], q: 1.8, gain: 0.18 * o.g, a: 0.02, pan: o.pan }); },
      press: (t, o) => { S.thud(t, { ...o, f: 95, g: o.g * 0.9 }); noise(t + 0.01, { dur: 0.25, color: 'brown', filter: 'lowpass', f: 700, gain: 0.25 * o.g, pan: o.pan }); },
      roller: (t, o) => { const d = o.dur || 0.6; noise(t, { dur: d, color: 'brown', filter: 'bandpass', f: 380, q: 1.5, gain: 0.3 * o.g, a: 0.05, hold: d * 0.6, pan: o.pan }); for (let x = 0; x < d; x += 0.07) S.tock(t + x, { f: 300, g: o.g * 0.15, pan: o.pan }); },
      erase: (t, o) => { const d = o.dur || 0.6, r = rand('erase' + t); for (let x = 0; x < d; x += 0.06 + r() * 0.04) noise(t + x, { dur: 0.08, color: 'pink', filter: 'bandpass', f: 700 + r() * 500, q: 0.8, gain: 0.22 * o.g, a: 0.03, pan: (r() - 0.5) * 0.5 }); },

      // machines and screens
      key: (t, o) => { const r = rand('key' + t); noise(t, { dur: 0.025, filter: 'bandpass', f: 2600 + r() * 1200, q: 2, gain: 0.25 * o.g, a: 0.001, pan: o.pan }); tone(t, { f: 160 + r() * 40, dur: 0.04, gain: 0.12 * o.g, pan: o.pan }); },
      typing: (t, o) => { const r = rand('typing' + t), n = o.n || 8, rate = o.rate || 0.09; for (let i = 0; i < n; i++) S.key(t + i * rate * (0.75 + r() * 0.5), { g: o.g * (0.7 + r() * 0.4), pan: o.pan }); },
      typebar: (t, o) => { S.key(t, o); noise(t + 0.008, { dur: 0.03, filter: 'bandpass', f: 1100, q: 4, gain: 0.35 * o.g, pan: o.pan }); },
      bell: (t, o) => S.ding(t, { ...o, f: o.f || 'A6' }),
      boot: (t, o) => { tone(t, { f: [[0, 80], [0.35, 1600]], type: 'sine', dur: 0.5, gain: 0.08 * o.g, a: 0.3 }); S.blip(t + 0.45, { ...o, f: 'C6', dur: 0.12 }); },
      crtOn: (t, o) => { noise(t, { dur: 0.25, filter: 'highpass', f: 2000, gain: 0.2 * o.g, a: 0.001 }); tone(t, { f: 15700, dur: 1.5, gain: 0.02 * o.g, a: 0.1, hold: 1 }); S.thud(t, { ...o, f: 90, g: o.g * 0.5 }); },
      neon: (t, o) => { const d = o.dur || 0.25, r = rand('neon' + t); for (let x = 0; x < d; x += 0.035 + r() * 0.04) tone(t + x, { f: 120, type: 'sawtooth', dur: 0.03, gain: 0.3 * o.g * (0.5 + r() * 0.5), filter: 'bandpass', f2: 1200, q: 1.2, pan: o.pan }); },
      // chip (8-bit console) sounds: raw square/triangle, no filtering
      coin: (t, o) => { tone(t, { f: 'B5', type: 'square', dur: 0.07, gain: 0.07 * o.g, a: 0.001, hold: 0.06 }); tone(t + 0.07, { f: 'E6', type: 'square', dur: 0.3, gain: 0.07 * o.g, a: 0.001, hold: 0.1 }); },
      jump: (t, o) => tone(t, { f: [[0, 260], [0.16, 820]], type: 'square', dur: 0.18, gain: 0.07 * o.g, a: 0.001, hold: 0.12 }),
      hurt: (t, o) => { tone(t, { f: [[0, 600], [0.25, 90]], type: 'square', dur: 0.28, gain: 0.08 * o.g, a: 0.001, hold: 0.2 }); noise(t, { dur: 0.2, filter: 'lowpass', f: 1800, gain: 0.15 * o.g, rate: 0.25 }); },
      powerup: (t, o) => ['C5', 'E5', 'G5', 'C6', 'E6', 'G6', 'C7'].forEach((n, i) => tone(t + i * 0.045, { f: n, type: 'square', dur: 0.06, gain: 0.06 * o.g, a: 0.001, hold: 0.05 })),
      select: (t, o) => { S.blip(t, { ...o, f: 'A5', dur: 0.04 }); S.blip(t + 0.05, { ...o, f: 'E6', dur: 0.05 }); },
      text: (t, o) => { const n = o.n || 10, rate = o.rate || 0.05; for (let i = 0; i < n; i++) tone(t + i * rate, { f: i % 2 ? 'C6' : 'G5', type: 'square', dur: 0.025, gain: 0.04 * o.g, a: 0.001, hold: 0.015 }); },
    };

    function play(name, t, opts) {
      const fn = S[name];
      if (!fn) throw new Error('unknown sound: ' + name);
      const o2 = Object.assign({}, opts); o2.g = o2.gain == null ? 1 : o2.gain;
      if (opts && opts.minor) withMinor(() => fn(t, o2)); else fn(t, o2);
    }

    // everything scheduled inside fn counts as minor (quieter in voiceover mode)
    function withMinor(fn) { const was = inMinor; inMinor = true; try { fn(); } finally { inMinor = was; } }

    // ---- beds: continuous sound under a stretch of time. bed(name, t0, t1, opts)
    function bed(name, t0, t1, p) {
      if (VO) return;
      p = p || {}; const g = p.gain == null ? 1 : p.gain, d = t1 - t0, fade = Math.min(0.4, d / 4);
      const long = (q) => Object.assign({ dur: d, a: fade, hold: d - fade * 2, bus: 'amb' }, q);
      if (name === 'room') noise(t0, long({ color: 'brown', filter: 'lowpass', f: 320, gain: 0.12 * g }));
      else if (name === 'hiss') noise(t0, long({ color: 'pink', filter: 'highpass', f: 5000, gain: 0.02 * g }));
      else if (name === 'hum') { tone(t0, long({ f: 60, gain: 0.05 * g })); tone(t0, long({ f: 120, gain: 0.025 * g })); tone(t0, long({ f: 180, type: 'triangle', gain: 0.012 * g })); }
      else if (name === 'rain') { noise(t0, long({ color: 'pink', filter: 'bandpass', f: 2500, q: 0.4, gain: 0.08 * g })); const r = rand('rain'); for (let x = 0; x < d; x += 0.04 + r() * 0.08) noise(t0 + x, { dur: 0.01, filter: 'highpass', f: 4000, gain: 0.04 * g * r(), bus: 'amb', pan: r() * 1.6 - 0.8 }); }
      else if (name === 'projector') { noise(t0, long({ color: 'pink', filter: 'highpass', f: 3000, gain: 0.03 * g })); for (let x = 0; x < d; x += 1 / 24) S.tock(t0 + x, { f: 700, g: 0.04 * g, pan: 0.3 }); }
      else if (name === 'vinyl') { noise(t0, long({ color: 'pink', filter: 'bandpass', f: 1500, q: 0.5, gain: 0.025 * g })); const r = rand('vinyl'); for (let x = 0; x < d; x += 0.08 + r() * 0.4) noise(t0 + x, { dur: 0.006, filter: 'highpass', f: 2500, gain: 0.08 * g * r(), bus: 'amb' }); }
      else throw new Error('unknown bed: ' + name);
    }

    // ---- music: optional light beds that sit under the effects. music(name, t0, t1, { bpm, chords, gain })
    // chords: list of note arrays, one per bar, cycled. e.g. [['C4','E4','G4','B4'], ['A3','C4','E4','G4']]
    function music(name, t0, t1, p) {
      if (VO) return;
      p = p || {}; const g = p.gain == null ? 1 : p.gain, bpm = p.bpm || 100, beat = 60 / bpm, bar = beat * 4;
      const chords = p.chords || [['C4', 'E4', 'G4', 'B4'], ['A3', 'C4', 'E4', 'G4'], ['F3', 'A3', 'C4', 'E4'], ['G3', 'B3', 'D4', 'F4']];
      let i = 0;
      for (let t = t0; t < t1 - 0.05; t += bar, i++) {
        const ch = chords[i % chords.length], len = Math.min(bar, t1 - t);
        if (name === 'pad' || name === 'pulse') ch.forEach((n, k) => { tone(t, { f: n, type: 'triangle', dur: len + 0.3, gain: 0.035 * g, a: 0.25, hold: len - 0.3, bus: 'music', filter: 'lowpass', f2: 1400, pan: (k - 1.5) * 0.25, verb: 0.25 }); tone(t, { f: hz(n) * 1.004, type: 'sine', dur: len + 0.3, gain: 0.03 * g, a: 0.3, hold: len - 0.3, bus: 'music' }); });
        if (name === 'pulse') for (let b = 0; b < 4 && t + b * beat < t1 - 0.05; b++) {
          const tb = t + b * beat;
          tone(tb, { f: [[0, 110], [0.1, 50]], dur: 0.18, gain: (b % 2 ? 0.16 : 0.26) * g, bus: 'music' });
          noise(tb + beat / 2, { dur: 0.04, filter: 'highpass', f: 7000, gain: 0.05 * g, bus: 'music' });
          tone(tb + beat / 2, { f: hz(ch[0]) / 2, type: 'triangle', dur: beat * 0.45, gain: 0.08 * g, bus: 'music' });
        }
        if (name === 'chip') for (let s = 0; s < 8 && t + s * beat / 2 < t1 - 0.05; s++) {
          const ts = t + s * beat / 2;
          tone(ts, { f: hz(ch[0]) / 2, type: 'triangle', dur: beat * 0.45, gain: 0.12 * g, a: 0.001, hold: beat * 0.35, bus: 'music' });
          tone(ts, { f: ch[[0, 1, 2, 3, 2, 1, 2, 3][s]], type: 'square', dur: beat * 0.4, gain: 0.03 * g, a: 0.001, hold: beat * 0.25, bus: 'music' });
        }
      }
    }

    return { play, bed, music, tone, noise, withMinor, hz, vo: VO, sounds: Object.keys(S) };
  };

  // Live playback for a player: SOUND.live(scoreFn, fromT, { voiceover, master }) starts the score from explainer time
  // fromT right now and returns stop(). Call stop() on pause or seek, and SOUND.live again on play.
  SOUND.live = function (fn, fromT, opts) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    fn(SOUND.kit(ctx, Object.assign({}, opts, { start: fromT || 0, delay: 0.03 })));
    return () => { try { ctx.close(); } catch (e) {} };
  };

  // Render a style's explainerSound into an OfflineAudioContext; returns interleaved float stereo.
  SOUND.renderOffline = async function (fn, duration, sampleRate, kitOpts) {
    const sr = sampleRate || 48000, len = Math.ceil(duration * sr);
    const ctx = new OfflineAudioContext(2, len, sr);
    fn(SOUND.kit(ctx, kitOpts || {}));
    const buf = await ctx.startRendering();
    const L = buf.getChannelData(0), R = buf.getChannelData(1), inter = new Float32Array(len * 2);
    let peak = 0;
    for (let i = 0; i < len; i++) { inter[2 * i] = L[i]; inter[2 * i + 1] = R[i]; peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
    return { inter, peak, frames: len, sr };
  };
})();
```

REFERENCE STYLE SOURCE (styles/particle-swarm.js; its sample topic was "Why popcorn pops")
```js
{
  // ---------------------------------------------------------------- content (change this for a new topic)
  // The swarm acts out a process. It never spells anything: the beads ARE the stuff the story is about, and each beat
  // is a formation they flow into, or a change that runs through a formation while it holds (it heats up, strains,
  // lets something loose inside). The words are four small captions.
  //
  // Each target is a drawing on a 960 x 540 canvas (the frame): where the drawing is opaque the beads settle, and the
  // paint colour there becomes the bead colour. A swarm can be several populations that keep their identity through
  // the whole clip (here the corn and the water inside it): SHARE says how the beads are split, and every target gives
  // one drawing per population under `parts`. Parts stack like thick paint: a later part lies on top of the earlier ones.
  //   puff          the drawing is blown up like a balloon: every separate patch of paint becomes a smooth bulge.
  //                 1 = as thick as half its width (a round blob), less = flatter, 0 = flat
  //   body          also blow the part up as one mass underneath (gaps of a few pixels between patches are bridged),
  //                 so the patches become bumps on a heap instead of separate blobs lying side by side
  //   float         beads hover up to this far above the surface (a haze instead of a skin)
  //   restless      how far each bead buzzes around its place, times the `shake` dial
  //   glow          how strongly the beads light up by themselves, 0..1 (a number, or (x, y) => number in canvas pixels)
  //   cloud         no drawing: a loose cloud { at, size } to arrive from or to leave into
  //   swell         (per target) how much the whole shape follows the `swell` dial
  // A part drawn with the same outline in two targets gets the same bead places in both, so across that flight its
  // beads stay where they are and only change colour. That is how a formation heats up without falling apart.
  const DURATION = 10;
  const WALL = '#2a5a63';                          // the paper behind the swarm: pick one every bead colour stands out from
  const SHARE = { corn: 0.96, water: 0.04 };
  const T = { heat: 1.9, press: 4.5, pop: 6.8 };   // the three turns of the story (seconds); picture and sound both use them

  // the kernel: a round crown on top, a pointed tip at the bottom, leaning a little. s < 1 gives the space inside the hull
  const KX = 480, KY = 236, TILT = -0.16;
  const kernelPath = (ctx, s = 1) => {
    ctx.beginPath();
    for (let i = 0; i <= 160; i++) { const a = i / 160 * Math.PI * 2, c = Math.cos(a); ctx.lineTo(s * 188 * Math.sin(a) * Math.pow(Math.sin(a / 2), 0.6), s * (c > 0 ? 226 : 170) * c); }
    ctx.closePath();
  };
  const tilted = (ctx, fn) => { ctx.save(); ctx.translate(KX, KY); ctx.rotate(TILT); fn(); ctx.restore(); };
  const ramp = (ctx, y0, y1, colors) => { const g = ctx.createLinearGradient(0, y0, 0, y1); colors.forEach((c, i) => g.addColorStop(i / (colors.length - 1), c)); return g; };
  // the whole kernel: body colours from crown to tip, the paler germ rising from the tip (what makes a seed look like
  // corn), a darker band just inside the outline (the hull) and the pale tip cap
  const kernel = (body, hull, cap, germ) => (ctx) => tilted(ctx, () => {
    kernelPath(ctx); ctx.fillStyle = ramp(ctx, -170, 226, body); ctx.fill();
    ctx.save(); ctx.translate(0, 113); ctx.fillStyle = germ; kernelPath(ctx, 0.5); ctx.fill(); ctx.restore();
    kernelPath(ctx); ctx.clip(); ctx.strokeStyle = hull; ctx.lineWidth = 44; ctx.stroke();
    ctx.fillStyle = cap; ctx.beginPath(); ctx.arc(0, 232, 54, 0, 7); ctx.fill();
  });
  const drop = (ctx, cx, cy, r) => {               // the water: one drop, point up
    ctx.fillStyle = ramp(ctx, cy - 2 * r, cy + r, ['#7cc4ff', '#1d7fe6', '#1463c8']); ctx.beginPath(); ctx.moveTo(cx, cy - 1.9 * r);
    ctx.bezierCurveTo(cx + 0.35 * r, cy - 1.1 * r, cx + r, cy - 0.55 * r, cx + r, cy); ctx.arc(cx, cy, r, 0, Math.PI);
    ctx.bezierCurveTo(cx - r, cy - 0.55 * r, cx - 0.35 * r, cy - 1.1 * r, cx, cy - 1.9 * r); ctx.fill();
  };
  const steam = (inner, outer) => (ctx) => tilted(ctx, () => {   // steam fills the hull, or (inner > 0) crowds against it
    ctx.fillStyle = '#f2f8ff'; kernelPath(ctx, outer); ctx.fill();
    if (inner) { ctx.globalCompositeOperation = 'destination-out'; kernelPath(ctx, inner); ctx.fill(); }
  });
  // the popped corn: fat, wobbly lobes [x, y, rx, ry, turn], drawn back to front. Each lobe first rubs out a thin ring
  // around itself, so every lobe keeps its own edge and becomes its own bulge, with a crease where two of them meet.
  const LOBES = [[212, 262, 66, 58, 0], [742, 248, 72, 62, 0], [476, 102, 78, 62, 0], [466, 404, 84, 58, 0],
    [330, 172, 114, 84, 0.49], [636, 154, 122, 88, -0.56], [304, 348, 108, 80, -0.51], [646, 358, 104, 76, 0.57],
    [410, 256, 122, 106, -0.2], [566, 246, 116, 110, 0.3], [498, 346, 54, 46, 0.2]];
  const lobe = (ctx, [x, y, rx, ry, turn], k, grow) => {
    ctx.beginPath();
    for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, w = 1 + 0.09 * Math.sin(3 * a + k * 2.4) + 0.06 * Math.sin(5 * a + k * 4.1), c = Math.cos(turn), s = Math.sin(turn), px = (rx * w + grow) * Math.cos(a), py = (ry * w + grow) * Math.sin(a); ctx.lineTo(x + px * c - py * s, y + px * s + py * c); }
    ctx.closePath(); ctx.fill();
  };
  const popcorn = (ctx) => {
    LOBES.forEach((l, k) => {
      ctx.globalCompositeOperation = 'destination-out'; lobe(ctx, l, k, 3);
      ctx.globalCompositeOperation = 'source-over';
      const [x, y, rx, ry] = l, g = ctx.createRadialGradient(x - rx * 0.15, y - ry * 0.2, ry * 0.25, x, y, rx * 1.05); g.addColorStop(0, '#ffffff'); g.addColorStop(0.8, '#fff6dc'); g.addColorStop(1, '#f5d88c');
      ctx.fillStyle = g; lobe(ctx, l, k, 0);
    });
    // what is left of the hull: two curled amber shards caught in the crease where the big lobes meet
    ctx.lineCap = 'round';
    for (const [x, y, r, a0, a1, w, c] of [[566, 246, 104, 2.75, 3.4, 13, '#a04e0a'], [410, 256, 112, -0.62, -0.3, 10, '#c06c14']]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); }
  };
  const hotGlow = (lo, hi) => (x, y) => lo + (hi - lo) * Math.min(1, Math.max(0, (y - 60) / 400));   // hotter towards the tip, where the heat comes from

  const TARGETS = [
    { id: 'cloud', cloud: { at: [2.5, 0.8, 4.5], size: [5.5, 3.0, 3.5] } },
    { id: 'kernel', swell: 1, parts: {
      corn: { puff: 0.62, draw: kernel(['#e69612', '#f3b422', '#f8cc4c'], '#bd680e', '#f6e6b4', '#fadc80') },
      water: { puff: 0.6, restless: 0.012, draw: (ctx) => drop(ctx, KX + 12, KY - 30, 43) } } },
    { id: 'hot', swell: 1, parts: {
      corn: { puff: 0.62, glow: hotGlow(0.0, 0.8), draw: kernel(['#eb9c18', '#ee7410', '#e8440c'], '#b84a0a', '#f7a860', '#f6b040') },
      water: { puff: 0, float: 0.4, restless: 0.06, draw: steam(0, 0.8) } } },
    { id: 'strained', swell: 1, parts: {
      corn: { puff: 0.62, glow: hotGlow(0.4, 1), draw: kernel(['#f08a14', '#ee5c0e', '#e2340a'], '#b83808', '#ffb470', '#f89a30') },
      water: { puff: 0, float: 0.3, restless: 0.05, draw: steam(0.62, 0.86) } } },
    { id: 'popcorn', parts: {
      corn: { puff: 0.48, body: 0.42, glow: 0.4, draw: popcorn },
      water: { cloud: { at: [0.8, 8.5, 1.0], size: [3.0, 0.9, 0.8] } } } },      // the steam is free: up and out of the frame
  ];

  // The edit: which target the swarm goes to, and when it lets go of the one before (t0, seconds).
  //   dur      flight time of one bead. Each bead also waits its turn, so the whole move takes about spread + dur
  //   spread   how long the front takes to cross the old shape; waves > 1 lifts the beads off in that many batches
  //   wave     [dx, dy, radial]: the front travels along (dx, dy), or outwards from the centre when radial = 1.
  //            Beads that stay put change colour as the front passes: [0, 1, 0] warms a shape from below
  //   push     how far the front throws the beads downwind, flow = how far the flow field then carries them,
  //            lift = how far a few of them come towards the lens, swirl = turn of the swarm around the centre (radians)
  //   scatter  extra random wait per bead, so they leave one by one (water boiling off) instead of as a front
  //   late     extra wait of the last stragglers. Everything must have landed before the next t0.
  const FLIGHTS = [
    { to: 'kernel', t0: -1.45, dur: 1.2, spread: 0.6, waves: 3, wave: [-1, 0.3, 0], push: 1.2, flow: 1.4, lift: 5, swirl: 0.5, late: 0.5 },
    { to: 'hot', t0: T.heat, dur: 0.9, spread: 1.1, waves: 1, wave: [0, 1, 0], push: 0, flow: 0.25, lift: 0, swirl: 0, scatter: 0.6, late: 0 },
    { to: 'strained', t0: T.press, dur: 0.9, spread: 0.7, waves: 1, wave: [0, 1, 0], push: 0, flow: 0.15, lift: 0, swirl: 0, scatter: 0.5, late: 0 },
    { to: 'popcorn', t0: T.pop, dur: 1.05, spread: 0.14, waves: 1, wave: [0, 0, 1], push: 0.9, flow: 0.45, lift: 2, swirl: 0.2, late: 0.4 },
  ];

  // Dials: things that change over time while a formation holds. All are plain functions of t.
  const DIALS = {
    // strain: the shape grows from its centre, trembling harder and harder, with one last heave before it gives
    swell: (t) => { const u = K.seg(t, T.press, T.pop); return 0.075 * Math.pow(u, 1.4) + 0.011 * u * u * Math.sin(t * 2 * Math.PI * 9) + 0.05 * K.seg(t, T.pop - 0.22, T.pop, K.ease.in); },
    shake: (t) => K.seg(t, T.heat - 0.3, T.heat + 0.8) * (1 + 1.3 * K.seg(t, T.press, T.pop)),       // calm, simmering, frantic
    heat: (t) => K.seg(t, T.heat - 0.4, T.heat + 1.2, K.ease.inOut) * (1 + 0.5 * K.seg(t, T.press, T.pop)) * (1 - 0.8 * K.seg(t, T.pop, T.pop + 1.6, K.ease.out)),   // the glow from below
  };

  // One short line per beat. They name what the picture is doing and are never the subject.
  const CAPTIONS = [
    { t0: 0.25, t1: T.heat - 0.05, text: 'Every popcorn kernel holds a little water' },
    { t0: T.heat + 0.2, t1: T.press - 0.05, text: 'Heat turns that water into steam' },
    { t0: T.press + 0.2, t1: T.pop - 0.1, text: 'The hard hull holds it in, so pressure builds' },
    { t0: T.pop + 0.8, t1: 99, text: 'At about 180 °C the hull bursts and the starch puffs out' },
  ];

  registerStyle({
    id: 'particle-swarm',
    name: 'Particle Swarm',
    family: 'Flat content made physical',
    look: 'Sixty thousand tiny glass beads hanging in front of a matte paper wall. They pile into plump, rounded models of things (a seed, a drop, a cell, an organ, a heap) that fill most of the frame and throw a soft shadow on the wall, change colour and strain while they hold, then let go and fly on to the next formation.',
    motion: 'Beads arrive as a stream, overshoot their place and settle. A formed shape never freezes: it breathes, a colour change can run through it as a front, loose beads inside it buzz like a gas, and it can swell and tremble. When it lets go, a front crosses it or it bursts from the centre: beads are thrown outwards, curl along a flow field in ribbons and veils, then land in the next shape, with a few stragglers arriving late.',
    light: 'One soft, warm key from the upper left, like a window, so every bead has a lit side, a small glint and a shadow on its neighbours, and the whole shape drops a soft shadow on the wall. Warm fill from all round. Heat is shown as light: hot beads glow by themselves and an orange lamp comes up from below.',
    materials: 'Polished glass seed beads, uneven in size and shade, each with a sharp highlight and a glow on its far side: golden corn, blue water, white steam, cream popcorn. Matte paper wall in a deep, dull teal that all of them stand out from.',
    camera: 'Long lens with shallow focus on the shape, so beads that fly towards the camera go soft. One slow continuous dolly: close and a little to one side of the small first shape, drifting back and round to square-on while it changes, pulled back by the burst to hold the big last shape.',
    post: 'Real motion blur and depth of field from accumulation (96 sub-renders), neutral tone mapping to keep the colours true, a touch of bloom on the glints and the hot beads only, a soft vignette, almost no grain. Captions are a crisp 2D overlay.',
    explains: 'Processes where stuff flows, gathers, splits, grows, heats up or bursts, and things that are made of many units (cells, molecules, people, grains, data points). The beads are the stuff itself: a beat is either a new formation the swarm flows into or a change that runs through a formation while it holds (it warms from one side, something inside it comes loose, it swells). Populations keep their colour and identity from start to finish, so the viewer can follow where each kind of thing ends up. One short caption per beat names what is happening; the beads never form words or numbers.',
    topic: 'Why popcorn pops',
    duration: DURATION,
    fonts: ['600 50px "Inter"'],
    render: { samples: 96, shutter: 0.45, tone: 'neutral', exposure: 1.0, bloom: 0.25, bloomThreshold: 1.3, vignette: 0.4, grain: 0.004, fov: 30, background: WALL },

    build(S) {
      const { THREE, K, scene, camera, renderer } = S;
      const TW = 256, TH = 240, N = TW * TH;     // 61,440 beads; bead i lives at texel (i % TW, i / TW) of every data texture
      const FW = 32 / 3, FH = 6, UNIT = 90;      // the 960 x 540 drawing covers 10.67 x 6 world units
      const RADIUS = 0.026;
      const PARTS = Object.keys(SHARE), COUNT = PARTS.map((id) => Math.round(N * SHARE[id]));
      COUNT[0] += N - COUNT.reduce((a, b) => a + b, 0);

      // ---------------------------------------------------------------- 1. drawings -> bead positions
      // For every part: read the drawing back, blow it up into a bulge (that becomes thickness), spread the part's
      // beads evenly over the ink, and sort them left to right so a bead keeps roughly its place from one target to
      // the next: neighbours stay neighbours, which is what makes the swarm move in ribbons, not as static. The
      // random numbers depend only on the part, so the same outline gives the same places.
      const W = 960, H = 540, HW = W / 2, HH = H / 2;
      // Inflation: solve "curvature = constant, height 0 at the edge" on the inked pixels (at half resolution, by
      // over-relaxation) and take the square root. A disc becomes exactly half a ball, any other patch a smooth
      // balloon of the same kind, without the ridges a distance-to-edge profile would leave. World units.
      function inflate(px, bridge = 0) {
        let m = new Uint8Array(HW * HH), x0 = HW, x1 = 0, y0 = HH, y1 = 0; const u = new Float32Array(HW * HH);
        for (let y = 1; y < HH - 1; y++) for (let x = 1; x < HW - 1; x++) {
          const i = (2 * y * W + 2 * x) * 4 + 3;
          if (px[i] > 127 && px[i + 4] > 127 && px[i + W * 4] > 127 && px[i + W * 4 + 4] > 127) { m[y * HW + x] = 1; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
        }
        for (let b = 0; b < bridge; b++) {            // grow the mask by a pixel: closes thin gaps, so the patches count as one
          const g = m.slice(); x0 = Math.max(1, x0 - 1); y0 = Math.max(1, y0 - 1); x1 = Math.min(HW - 2, x1 + 1); y1 = Math.min(HH - 2, y1 + 1);
          for (let y = y0; y <= y1; y++) for (let x = x0, i = y * HW + x0; x <= x1; x++, i++) if (m[i - 1] || m[i + 1] || m[i - HW] || m[i + HW]) g[i] = 1;
          m = g;
        }
        for (let n = 0; n < 500; n++) for (let y = y0; y <= y1; y++) for (let x = x0, i = y * HW + x0; x <= x1; x++, i++) if (m[i]) u[i] += 1.93 * ((u[i - 1] + u[i + 1] + u[i - HW] + u[i + HW]) / 4 + 1 - u[i]);
        return (i) => 2 * Math.sqrt(u[(Math.floor(i / W) >> 1) * HW + ((i % W) >> 1)]) / UNIT;
      }
      function sample(tg) {
        const top = new Float32Array(W * H), box = [1e9, 1e9, -1e9, -1e9], all = [];
        PARTS.forEach((id, pi) => {
          const part = tg.parts ? tg.parts[id] : tg, n = COUNT[pi], r = K.rng(20 + pi), pts = [];
          if (part.cloud) {
            const { at, size } = part.cloud;
            for (let i = 0; i < n; i++) pts.push({ x: at[0] + r.gauss() * size[0], y: at[1] + r.gauss() * size[1], z: at[2] + r.gauss() * size[2], w: -r.range(0.3, 0.9), c: null, g: 0 });
          } else {
            const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
            const ctx = cv.getContext('2d', { willReadFrequently: true }); part.draw(ctx, W, H);
            const px = ctx.getImageData(0, 0, W, H).data, ink = [];
            for (let i = 0; i < W * H; i++) if (px[i * 4 + 3] > 127) ink.push(i);
            const bulge = part.puff ? inflate(px) : () => 0, whole = part.body ? inflate(px, 3) : () => 0, height = (i) => (part.puff || 0) * bulge(i) + (part.body || 0) * whole(i);
            // an even spread: every inked pixel gets n / ink.length beads, the fraction decided by a low-discrepancy dither
            const per = n / ink.length, picks = [];
            for (const i of ink) { let m = Math.floor(per + ((i % W) * 0.7548776662 + Math.floor(i / W) * 0.5698402909) % 1); while (m-- > 0) picks.push(i); }
            for (let i = picks.length - 1; i > 0; i--) { const j = r.int(0, i); [picks[i], picks[j]] = [picks[j], picks[i]]; }
            while (picks.length < n) picks.push(r.pick(ink));
            for (let k = 0; k < n; k++) {
              const i = picks[k], x = (i % W) + r(), y = Math.floor(i / W) + r(), h = height(i);
              // most beads sit in the skin of the bulge (the part you see), the rest fill it in behind. `top` is the
              // surface of the parts drawn before this one, so this part lies on them
              const z = top[i] + h - Math.min(h, 0.5) * Math.pow(r(), 3) + (part.float || 0) * r();
              pts.push({ x: x / UNIT - FW / 2, y: FH / 2 - y / UNIT, z, w: part.restless || 0, c: [px[i * 4], px[i * 4 + 1], px[i * 4 + 2]], g: typeof part.glow === 'function' ? part.glow(x, y) : part.glow || 0 });
            }
            for (const i of ink) { top[i] += height(i); const x = i % W, y = Math.floor(i / W); box[0] = Math.min(box[0], x); box[1] = Math.min(box[1], y); box[2] = Math.max(box[2], x); box[3] = Math.max(box[3], y); }
          }
          for (const p of pts) p.key = p.x + 0.45 * r.gauss();
          all.push(...pts.sort((a, b) => a.key - b.key));
        });
        // the shape's middle and half-size in world units (fronts and the swell are measured from them); a cloud counts as the whole frame
        const drawn = box[2] > box[0], cx = drawn ? (box[0] + box[2]) / 2 : W / 2, cy = drawn ? (box[1] + box[3]) / 2 : H / 2;
        const hx = drawn ? (box[2] - box[0]) / 2 / UNIT : FW / 2, hy = drawn ? (box[3] - box[1]) / 2 / UNIT : FH / 2;
        return { pts: all, centre: [(cx - W / 2) / UNIT, (H / 2 - cy) / UNIT, 0], half: [hx, hy, drawn ? Math.max(hx, hy) : 3] };
      }
      const pos = new Float32Array(N * TARGETS.length * 4), col = new Uint8Array(N * TARGETS.length * 4);
      const sets = TARGETS.map(sample);
      sets.forEach((set, k) => set.pts.forEach((p, i) => {
        const o = (k * N + i) * 4, c = p.c || (k + 1 < sets.length && sets[k + 1].pts[i].c) || sets[k - 1].pts[i].c;   // a cloud borrows the colours of the next target (or the one before)
        pos[o] = p.x; pos[o + 1] = p.y; pos[o + 2] = p.z; pos[o + 3] = p.w;
        col[o] = c[0]; col[o + 1] = c[1]; col[o + 2] = c[2]; col[o + 3] = Math.round(255 * Math.min(1, Math.max(0, p.g)));
      }));
      // both textures stack the targets: target k is rows k * TH .. (k + 1) * TH. Places: xyz, w = restless (or, negative,
      // the drift of a cloud bead). Colours: rgb = paint, a = glow.
      const posTex = new THREE.DataTexture(pos, TW, TH * TARGETS.length, THREE.RGBAFormat, THREE.FloatType); posTex.needsUpdate = true;
      const colTex = new THREE.DataTexture(col, TW, TH * TARGETS.length, THREE.RGBAFormat, THREE.UnsignedByteType); colTex.colorSpace = THREE.SRGBColorSpace; colTex.needsUpdate = true;
      const index = (id) => TARGETS.findIndex((tg) => tg.id === id);

      // ---------------------------------------------------------------- 2. the motion: where bead i is at time t
      // A small render pass writes every bead's position into a float texture, once per sub-frame. It is a pure
      // function of (bead, time): nothing is stepped or remembered, so any frame can be rendered alone, and motion
      // blur falls out of the stage calling update() at many sub-frame times.
      const U = {
        uTargets: { value: posTex }, uColors: { value: colTex }, uFrom: { value: 0 }, uTo: { value: 1 }, uTime: { value: 0 },
        uT0: { value: 0 }, uDur: { value: 1 }, uSpread: { value: 0.3 }, uWave: { value: new THREE.Vector3() }, uFlow: { value: 1 }, uLift: { value: 1 }, uSwirl: { value: 0 }, uLate: { value: 0.5 }, uScatter: { value: 0 }, uPush: { value: 1 }, uWaves: { value: 3 }, uSeed: { value: 0 },
        uCa: { value: new THREE.Vector3() }, uCb: { value: new THREE.Vector3() }, uHalfA: { value: new THREE.Vector3() }, uSwellA: { value: 0 }, uSwellB: { value: 0 }, uShake: { value: 0 },
      };
      const motion = new THREE.ShaderMaterial({ uniforms: U, depthTest: false, depthWrite: false, vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }', fragmentShader: `
        precision highp float; precision highp int; precision highp sampler2D;
        uniform sampler2D uTargets; uniform int uFrom, uTo;
        uniform float uTime, uT0, uDur, uSpread, uFlow, uLift, uSwirl, uLate, uScatter, uPush, uWaves, uSeed, uSwellA, uSwellB, uShake; uniform vec3 uWave, uCa, uCb, uHalfA;
        float hash(float n){ return fract(sin(n * 12.9898) * 43758.5453); }
        // simplex noise with its gradient (Ian McEwan / Stefan Gustavson, MIT), used to build a swirling flow field
        vec4 permute(vec4 x){ x = ((x * 34.0) + 1.0) * x; return x - floor(x / 289.0) * 289.0; }
        float snoise(vec3 v, out vec3 grad){
          const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i = floor(v + dot(v, C.yyy)), x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz), l = 1.0 - g, i1 = min(g.xyz, l.zxy), i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx, x2 = x0 - i2 + C.yyy, x3 = x0 - D.yyy;
          i = i - floor(i / 289.0) * 289.0;
          vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          vec3 ns = 0.142857142857 * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z), x_ = floor(j * ns.z), y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy, y = y_ * ns.x + ns.yyyy, h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy), b1 = vec4(x.zw, y.zw), s0 = floor(b0) * 2.0 + 1.0, s1 = floor(b1) * 2.0 + 1.0, sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy, a1 = b1.xzyw + s1.xzyw * sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x), p1 = vec3(a0.zw, h.y), p2 = vec3(a1.xy, h.z), p3 = vec3(a1.zw, h.w);
          vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0), m2 = m * m, m4 = m2 * m2;
          vec4 pdx = vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)), tmp = m2 * m * pdx;
          grad = 42.0 * (-8.0 * (tmp.x * x0 + tmp.y * x1 + tmp.z * x2 + tmp.w * x3) + m4.x * p0 + m4.y * p1 + m4.z * p2 + m4.w * p3);
          return 42.0 * dot(m4, pdx);
        }
        // curl of a noise potential: a field without sources or sinks, so beads swirl along it instead of bunching up
        vec3 curl(vec3 p){
          vec3 a, b, c; snoise(p, a); snoise(p + vec3(31.4, 17.2, 47.9), b); snoise(p + vec3(-23.7, 61.1, 9.3), c);
          return vec3(c.y - b.z, a.z - c.x, b.x - a.y);
        }
        // where a bead rests while it belongs to a target: its place, pushed out from the centre when the shape swells,
        // riding a slow wave so the shape breathes, buzzing around if it is restless, and shivering a little on its own
        vec3 rest(vec4 T, vec3 c, float swell, float t, vec4 rnd){
          vec3 p = T.xyz;
          if (T.w < 0.0) return p - T.w * sin(t * vec3(0.37, 0.29, 0.23) + rnd.xyz * 6.283);   // a cloud bead just drifts
          p += (p - c) * swell;
          p.z += 0.035 * sin(dot(p.xy, vec2(0.9, 0.6)) - t * 1.3);
          p.xy += 0.012 * sin(p.yx * 1.7 + t * vec2(0.9, 1.1));
          p += T.w * uShake * (sin(t * (4.0 + 6.0 * rnd.xyz) + rnd.yzw * 40.0) + 0.6 * sin(t * (10.0 + 7.0 * rnd.zxy) + rnd.wxy * 23.0));
          return p + 0.003 * sin(t * (2.0 + 3.0 * rnd.xyz) + rnd.yzw * 40.0);
        }
        void main(){
          ivec2 px = ivec2(gl_FragCoord.xy);
          float id = float(px.x + px.y * ${TW});
          vec4 rnd = vec4(hash(id * 1.31 + uSeed), hash(id * 2.17 + 13.0 + uSeed), hash(id * 3.71 + 29.0), hash(id * 5.03 + 41.0));
          vec4 TA = texelFetch(uTargets, ivec2(px.x, px.y + uFrom * ${TH}), 0), TB = texelFetch(uTargets, ivec2(px.x, px.y + uTo * ${TH}), 0);
          vec3 a = rest(TA, uCa, uSwellA, uTime, rnd), b = rest(TB, uCb, uSwellB, uTime, rnd);
          float moves = smoothstep(0.0, 0.04, distance(TA.xyz, TB.xyz));   // 0 for a bead that has the same place in both targets

          // when this bead's turn comes: a front crosses the old shape (in a few waves if asked), with some disorder,
          // and a few stragglers hang back
          vec2 dir = normalize(uWave.xy + 1e-5), out2 = TA.xy - uCa.xy;
          float front = mix(clamp(dot(out2, dir) / (2.0 * dot(abs(dir), uHalfA.xy)) + 0.5, 0.0, 1.0), clamp(length(out2) / uHalfA.z, 0.0, 1.0), uWave.z);
          vec3 wind = normalize(mix(vec3(dir, 0.35), vec3(out2, 1.3), uWave.z));   // downwind: along the front, or out from behind the centre
          front += 0.06 * sin(dot(TA.xy, vec2(2.3, 1.7)) + uSeed) + 0.08 * rnd.x;
          if (uWaves > 1.5) front = (floor(front * uWaves) + smoothstep(0.0, 0.45, fract(front * uWaves))) / uWaves;
          float wait = uSpread * front + moves * uScatter * rnd.x + (rnd.y > 0.975 ? uLate * (0.4 + 0.6 * rnd.z) : 0.0);
          float u = clamp((uTime - uT0 - wait) / (uDur * mix(0.75, 1.0, rnd.w)), 0.0, 1.0);

          // along the straight line it starts slowly, then behaves like a spring: it shoots past its place and settles
          float w = pow(u, 2.2), s = 1.0 - exp(-6.5 * w) * (cos(8.67 * w) + 0.75 * sin(8.67 * w));
          s = mix(s, 1.0, smoothstep(0.85, 1.0, u));
          vec3 p = mix(a, b, s);

          // off the line: thrown downwind by the front (fast, then slowing), then carried along the streamlines of the
          // flow field. Each bead goes a different distance, so neighbours string out into ribbons. E lets go again
          // before the landing.
          float E = moves * (u < 0.3 ? 1.0 - pow(1.0 - u / 0.3, 3.0) : 1.0 - smoothstep(0.3, 0.68, u));
          float far = 0.5 + 0.5 * rnd.z, hero = pow(rnd.w, 6.0);
          float sw = uSwirl * E * far, cs = cos(sw), sn = sin(sw);
          p.xy = mat2(cs, sn, -sn, cs) * p.xy;
          p += E * wind * (uPush * far + uLift * hero);
          vec3 q = p;
          for (int i = 0; i < 3; i++) q += E * uFlow * far * 0.33 * curl(q * 0.22 + vec3(uSeed * 7.0, 0.0, uTime * 0.15));
          p = q;
          gl_FragColor = vec4(p, smoothstep(0.03, 0.45, u));   // w: how far the colour has changed to the new target's
        }` });
      const posRT = new THREE.WebGLRenderTarget(TW, TH, { type: THREE.FloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: false });
      const pass = new THREE.Scene(), passCam = new THREE.Camera(); pass.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), motion));

      // ---------------------------------------------------------------- 3. the beads
      // One low-poly sphere drawn N times. The vertex shader only looks up where its bead is and what colour it has;
      // the shadow pass uses the same lookup, so beads shade each other and the wall.
      const geo = new THREE.InstancedBufferGeometry().copy(new THREE.SphereGeometry(1, 8, 6)); geo.instanceCount = N;
      const KEY = [-8.5, 8.5, 8.5];
      const BU = { uPos: { value: posRT.texture }, uColors: U.uColors, uFrom: U.uFrom, uTo: U.uTo, uRadius: { value: RADIUS }, uKey: { value: new THREE.Vector3(...KEY).normalize() }, uGlow: { value: 0.4 }, uHot: { value: 0.45 } };
      const head = `uniform sampler2D uPos, uColors; uniform int uFrom, uTo; uniform float uRadius; varying vec3 vBead; varying float vHot;
        float beadHash(float n){ return fract(sin(n * 78.233) * 43758.5453); }`;
      const body = `ivec2 bt = ivec2(gl_InstanceID % ${TW}, gl_InstanceID / ${TW}); vec4 bp = texelFetch(uPos, bt, 0);
        vec3 transformed = position * uRadius * mix(0.65, 1.0, beadHash(float(gl_InstanceID))) * (1.0 + 0.6 * pow(beadHash(float(gl_InstanceID) + 0.25), 8.0)) + bp.xyz;
        vec4 ca = texelFetch(uColors, ivec2(bt.x, bt.y + uFrom * ${TH}), 0), cb = texelFetch(uColors, ivec2(bt.x, bt.y + uTo * ${TH}), 0);
        vBead = mix(ca.rgb, cb.rgb, bp.w) * mix(0.7, 1.12, beadHash(float(gl_InstanceID) + 0.5)); vHot = mix(ca.a, cb.a, bp.w);
        vBead.g += 0.012 * pow(beadHash(float(gl_InstanceID) + 0.75), 3.0);   // a few lean towards orange`;
      const beadify = (mat, lit) => {
        mat.onBeforeCompile = (sh) => {
          Object.assign(sh.uniforms, BU);
          sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\n' + head).replace('#include <begin_vertex>', body);
          if (!lit) return;
          // glass, not clay: the paint colour tints the bead, light that enters it comes out as a glow on the side away
          // from the lamp, and the highlight stays a sharp glint. Hot beads also glow all over. (three.js roughens tiny
          // curved surfaces to stop them sparkling; here the sparkle is the point and the sub-renders already
          // anti-alias it, so that is taken out.)
          sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vBead; varying float vHot; uniform vec3 uKey; uniform float uGlow, uHot;')
            .replace('#include <color_fragment>', 'diffuseColor.rgb *= vBead;')
            .replace('#include <emissivemap_fragment>', 'totalEmissiveRadiance += vBead * (uGlow * pow(saturate(-dot(normal, normalize((viewMatrix * vec4(uKey, 0.0)).xyz))), 1.5) + uHot * vHot);')
            .replace('#include <lights_physical_fragment>', THREE.ShaderChunk.lights_physical_fragment.replaceAll('+= geometryRoughness', '+= 0.0'));
        };
        return mat;
      };
      const beads = new THREE.Mesh(geo, beadify(new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.07 }), true));
      beads.customDepthMaterial = beadify(new THREE.MeshDepthMaterial(), false);
      beads.castShadow = beads.receiveShadow = true; beads.frustumCulled = false; scene.add(beads);

      // ---------------------------------------------------------------- 4. the room: paper wall and light
      const paper = K.canvasTex(1024, 1024, (ctx, w, h) => {
        ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, w, h); const r = K.rng(3);
        for (let i = 0; i < 26000; i++) { const v = r.int(96, 160); ctx.strokeStyle = `rgba(${v},${v},${v},0.5)`; ctx.lineWidth = r.range(0.5, 1.4); const x = r.range(0, w), y = r.range(0, h), a = r.range(0, 6.28), l = r.range(3, 16); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke(); }
      }, { data: true, repeat: [10, 6] });
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(80, 48), new THREE.MeshStandardMaterial({ color: WALL, roughness: 0.93, bumpMap: paper, bumpScale: 0.6 }));
      wall.position.z = -0.4; wall.receiveShadow = true; scene.add(wall);

      K.env(S, { top: '#c9b499', horizon: '#9c8468', bottom: '#4f3f30', intensity: 0.32, panels: [
        { pos: [-9, 8, 11], size: [11, 8], color: '#fff2df', power: 7 },      // the window the beads reflect
        { pos: [12, -2, 6], size: [1.5, 9], color: '#dfe9ff', power: 14 },       // a thin cool strip for a rim glint
      ] });
      K.spot(S, { pos: KEY, target: [-0.8, 0.8, 0], color: '#fff0dc', power: 1150, angle: 0.56, penumbra: 1, soft: 1.3, mapSize: 4096, near: 4, far: 40, bias: -0.0002, normalBias: 0.006 });
      K.skyLight(S, { color: '#ffdfbd', power: 0.5, size: 7.5, mapSize: 4096, bias: -0.0003, normalBias: 0.006 });   // soft light from everywhere, blocked in the gaps between beads
      const stove = K.spot(S, { pos: [0.4, -6.5, 4.5], target: [0, -0.6, 0], color: '#ff6a1c', power: 0, angle: 0.75, penumbra: 1, shadow: false });   // the heat, as light from below

      // ---------------------------------------------------------------- 5. camera: one slow dolly
      const cam = {
        pos: K.path([[0, [-3.4, -1.0, 10.2]], [T.heat, [-2.4, -0.8, 10.5]], [T.press, [-1.3, -0.6, 10.9]], [T.pop, [-0.2, -0.4, 11.9]], [T.pop + 1.0, [0.5, -0.2, 13.0]], [DURATION, [0.2, -0.15, 12.3]]]),
        aim: K.path([[0, [0.0, -0.2, 0.4]], [T.pop, [0.0, -0.2, 0.4]], [T.pop + 1.0, [0, -0.08, 0.3]], [DURATION, [0, -0.08, 0.3]]]),
        ap: K.track([[0, 0.1], [T.pop, 0.085], [T.pop + 1.5, 0.065], [DURATION, 0.065]]),
      };

      return {
        update(t) {
          // the flight that is under way (or the last one that finished): from the target before it to its own
          let k = 0; while (k < FLIGHTS.length - 1 && FLIGHTS[k + 1].t0 <= t) k++;
          const f = FLIGHTS[k], from = k ? index(FLIGHTS[k - 1].to) : 0, to = index(f.to), swell = DIALS.swell(t);
          U.uTime.value = t; U.uFrom.value = from; U.uTo.value = to; U.uSeed.value = k + 1;
          U.uT0.value = f.t0; U.uDur.value = f.dur; U.uSpread.value = f.spread; U.uWave.value.fromArray(f.wave); U.uFlow.value = f.flow; U.uLift.value = f.lift; U.uSwirl.value = f.swirl; U.uLate.value = f.late; U.uScatter.value = f.scatter || 0; U.uPush.value = f.push; U.uWaves.value = f.waves;
          U.uCa.value.fromArray(sets[from].centre); U.uCb.value.fromArray(sets[to].centre); U.uHalfA.value.fromArray(sets[from].half);
          U.uSwellA.value = swell * (TARGETS[from].swell || 0); U.uSwellB.value = swell * (TARGETS[to].swell || 0); U.uShake.value = DIALS.shake(t);
          renderer.setRenderTarget(posRT); renderer.render(pass, passCam); renderer.setRenderTarget(null);   // every bead's place at time t
          stove.intensity = 110 * DIALS.heat(t);
          K.look(camera, cam.pos(t), cam.aim(t)); K.focus(camera, cam.aim(t), cam.ap(t));
        },
        // captions: small, crisp, bottom centre. Each fades up with a short rise and fades out before the next one
        overlay(ctx, t, W, H) {
          ctx.font = '600 50px "Inter"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          for (const c of CAPTIONS) {
            const up = K.seg(t, c.t0, c.t0 + 0.35, K.ease.out), a = up * (1 - K.seg(t, c.t1 - 0.25, c.t1));
            if (a <= 0) continue;
            ctx.globalAlpha = a; ctx.shadowColor = 'rgba(6, 22, 26, 0.6)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 2;
            ctx.fillStyle = '#f8eeda'; ctx.fillText(c.text, W / 2, H - 84 + (1 - up) * 16);
          }
        },
      };
    },

    sound(k) {
      const K = globalThis.K, r = K.rng(8);
      k.bed('room', 0, DURATION, { gain: 0.9 });
      // every flight in which the swarm really travels: a breath of air as the beads lift off, the hiss of glass in
      // the air, then a rain of tiny clicks as they land
      FLIGHTS.filter((f) => f.push > 0).forEach((f, i) => {
        const start = Math.max(0, f.t0), len = f.t0 + f.spread + f.dur - start, land0 = f.t0 + 0.4 * f.dur, land1 = f.t0 + f.spread + 0.7 * f.dur;
        k.noise(start, { dur: len, color: 'pink', filter: 'bandpass', f: [[0, 1200], [len * 0.45, 4200], [len, 2200]], q: 0.7, gain: 0.3, a: len * 0.35, verb: 0.1 });
        k.withMinor(() => {
          for (let j = 0; j < 220; j++) {
            const t = land0 + (land1 - land0) * Math.pow(r(), 0.8) + (r() < 0.12 ? r.range(0.1, f.late + 0.2) : 0);
            if (t < 0 || t > DURATION - 0.1) continue;
            if (j % 3) k.noise(t, { dur: 0.012, filter: 'bandpass', f: r.range(4500, 9000), q: 3, gain: r.range(0.12, 0.4), pan: r.range(-0.7, 0.7) });
            else k.tone(t, { f: r.range(2600, 5200), dur: 0.035, gain: r.range(0.03, 0.08), a: 0.001, pan: r.range(-0.7, 0.7), verb: 0.15 });
          }
        });
      });
      // heat: a low burner hum comes up, and the water starts to sizzle as its beads boil off one by one
      const cook = T.pop - T.heat;
      k.tone(T.heat - 0.3, { f: [[0, 55], [cook, 78]], type: 'triangle', dur: cook + 0.3, gain: 0.045, a: cook * 0.8, hold: cook * 0.2, filter: 'lowpass', f2: 300 });
      k.noise(T.heat + 0.4, { dur: cook - 0.4, color: 'pink', filter: 'highpass', f: [[0, 5200], [cook - 0.4, 3200]], gain: 0.055, a: cook * 0.7, hold: cook * 0.3 - 0.45 });
      k.withMinor(() => { for (let j = 0; j < 46; j++) { const t = T.heat + 0.6 + 2.0 * r(); k.play('pop', t, { gain: r.range(0.1, 0.22), f: r.range(900, 1900), pan: r.range(-0.4, 0.4) }); } });
      // pressure: the hull creaks, faster and faster, under a rising whine; then a breath of nothing before it gives
      const strain = T.pop - T.press;
      k.tone(T.press, { f: [[0, 190], [strain, 620]], type: 'sine', dur: strain - 0.06, gain: 0.05, a: strain * 0.8, verb: 0.2 });
      k.play('riser', T.press + 0.5, { gain: 0.42, dur: strain - 0.58 });
      for (let t = T.press + 0.25, gap = 0.34; t < T.pop - 0.1; t += gap, gap = Math.max(0.07, gap * 0.86)) k.play('tock', t, { gain: 0.2 + 0.3 * K.seg(t, T.press, T.pop), f: r.range(240, 380), pan: r.range(-0.3, 0.3) });
      // pop: a sharp crack with body under it and a burst of steam
      k.play('pop', T.pop, { gain: 2.2, f: 420 }); k.play('thud', T.pop, { gain: 0.8, f: 150 });
      k.noise(T.pop, { dur: 0.05, filter: 'highpass', f: 1800, gain: 0.7, a: 0.001 });
      k.noise(T.pop + 0.02, { dur: 0.9, color: 'pink', filter: 'highpass', f: [[0, 2600], [0.9, 6500]], gain: 0.2, a: 0.03, verb: 0.3 });   // steam getting away
      k.play('whoosh', T.pop + 0.02, { gain: 0.5, dur: 0.75, top: 2400 });
      const last = FLIGHTS[FLIGHTS.length - 1];
      k.play('ding', last.t0 + last.spread + 0.8 * last.dur, { gain: 0.3, f: 'D5' });   // the popcorn has set
    },
  });
}
```
