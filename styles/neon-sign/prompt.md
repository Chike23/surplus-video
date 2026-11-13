I want a short 3D motion graphic made with three.js in the "Neon Sign" style. Below is the complete source of a reference animation in this exact style, plus the small rendering kit and sound kit it runs on. Use them as your style guide and rebuild the animation around my content.

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
- Include the STAGE kit and the SOUND kit below unchanged, and the STROKEFONT library.

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
Name: Neon Sign
Family: Flat content made physical
Use: explainer
Look: A line drawing bent out of real glass tube and mounted on a painted brick wall at night: bright cores, coloured gas, black-painted returns into rubber boots, clear standoffs, every unlit tube waiting as milky glass. Small tube lettering for captions. Wet ground at the foot of the wall mirrors the end of it.
Motion: Neon never fades and never slides. A section snaps on, drops out and snaps again before it holds a touch over-bright and settles; one tube buzzes with the glow crawling along the glass before it catches. Things move the way real animated signs do it: by swapping between sets of tubes (pose A, pose B, pose C) and by lighting the segments of a path one after another, so light appears to travel.
Light: The tubes are the only real light: each one throws its own colour on the brick, hot right behind the glass and falling off across the wall, and every flicker moves the whole scene. A faint cold street light keeps the unlit glass readable.
Materials: Milky glass tube, semi-gloss paint over rough brick with soot and rain streaks, black rubber and matte blockout paint, clear acrylic standoffs, galvanised conduit, wet asphalt with puddles.
Camera: Long lens, one slow continuous crane. It starts a little oblique so the glass stands off the wall, drifts in on the part of the drawing that is lighting, then follows the light down the wall and settles low and square on the result, over its reflection in the wet ground. It is still drifting on the last frame.
Finish: Wide soft bloom from the over-bright cores, filmic contrast with deep blacks, slight depth of field, light vignette, fine grain, a trace of chromatic aberration.
Good for: How something works, as a diagram that switches on in the order it happens: light, electricity, signals, water, traffic, money, a recipe, a journey. A beat is a group of tubes that strikes on because the one before it did. Outlines are the things, a chase of short segments is whatever flows between them, alternating poses are whatever repeats (rain, flames, wheels, a heartbeat), and colour carries meaning, so use it for the part of the idea that really is about colour, state or category. One small tube caption per beat names what just lit; the last thing to light is the result, and it holds.

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

STROKEFONT (lib/strokefont.js)
```js
/*
 * strokefont.js - a single-stroke (centre-line) rounded sans for tube lettering.
 *
 * Classic script, no dependencies. Sets a global `STROKEFONT` (browser and Node).
 *
 *   STROKEFONT.layout(text, opts) -> { strokes, width, height, glyphs }
 *     opts.size     cap height in output units (1)
 *     opts.spacing  extra gap between letters, fraction of size (0.18)
 *     opts.lineGap  gap between lines, fraction of size (0.45)
 *     opts.align    'left' | 'center' | 'right' ('center'); x = 0 is the left
 *                   edge, the centre or the right edge of the block. The block
 *                   is always centred on y = 0. y is up.
 *     opts.round    corner fillet radius, fraction of size (0.09)
 *     opts.step     max distance between output points, fraction of size (0.03)
 *     strokes[i] = { points: [[x, y], ...], closed, glyph, char }
 *                   points are centre-line samples, evenly spaced by arc length
 *                   between corner tips, corners already filleted. A closed
 *                   stroke does not repeat its first point. `glyph` is the
 *                   index of the character in `text`.
 *     glyphs[i]  = { char, x, y, w, strokeIndexes }  one per character of
 *                   `text` (line breaks included, so glyphs[stroke.glyph]
 *                   works); x, y = left end of the baseline, w = ink width.
 *     width, height = size of the block of centre lines (add the tube width).
 *   STROKEFONT.length(stroke) -> arc length of a stroke (or of a points array)
 *   STROKEFONT.glyphs -> { 'A': { d, w, strokes }, ... }  d = path in the DSL
 *                   below, w = ink width, strokes = number of strokes
 *
 * Characters: A-Z (lowercase maps to uppercase), 0-9, . , ! ? - + : ' / & % # @ =
 * and space. Anything else leaves a space.
 *
 * Glyphs live on a grid where the cap height is 1 and the baseline is y = 0
 * (y up). Every glyph is a few centre-line strokes written in a small DSL:
 *
 *   M x y                 start a new stroke at a point
 *   L x y                 line to a point (the corner there gets filleted)
 *   A cx cy rx ry a0 a1   elliptical arc, degrees, a1 > a0 = counter-clockwise
 *   CW  cx cy rx ry       wrap around an ellipse clockwise / counter-clockwise,
 *   CCW cx cy rx ry       like a belt round a pulley: it is entered and left
 *                         along tangents worked out from its neighbours
 *   FROM a / TO a         start / end a wrapped ellipse at a fixed angle
 *   X x y                 join two wrapped ellipses at their crossing nearest
 *                         (x, y) instead of along a tangent (the waist of a 3)
 *   R k                   scale the fillet of the corner just drawn (0 = sharp)
 *   Z                     close the stroke
 *   ;                     end the stroke (the next arc starts a new one)
 */
(function (root) {
  'use strict';

  var DEG = Math.PI / 180, TAU = Math.PI * 2;

  // Letter fitting, in cap heights. `target` is the gap between two straight
  // stems before the caller's `spacing` is added.
  var FIT = { target: 0.27, depth: 0.36, min: 0.19, bands: 21, band: 0.06, space: 0.46, round: 0.09 };

  var DEFS = {
    'A': 'M 0 0 L .41 1.03 L .82 0  M .119 .3 L .701 .3',
    'B': 'M 0 .53 CW .37 .265 .25 .265 L 0 0 L 0 1 CW .335 .765 .225 .235 TO -90',
    'C': 'A .44 .5 .44 .512 46 314',
    'D': 'M 0 .5 L 0 1 CW .30 .5 .46 .5 L 0 0 Z',
    'E': 'M .56 1 L 0 1 L 0 0 L .56 0  M 0 .52 L .47 .52',
    'F': 'M .54 1 L 0 1 L 0 0  M 0 .5 L .44 .5',
    'G': 'A .44 .5 .44 .512 46 356 R .4 L .46 .464',
    'H': 'M 0 0 L 0 1  M .70 0 L .70 1  M 0 .51 L .70 .51',
    'I': 'M 0 0 L 0 1',
    'J': 'M .44 1 CW .215 .258 .225 .27 TO 200',
    'K': 'M 0 0 L 0 1  M .60 1 L 0 .47 L .66 0',
    'L': 'M 0 1 L 0 0 L .52 0',
    'M': 'M 0 0 L 0 1.03 L .46 .18 L .92 1.03 L .92 0',
    'N': 'M 0 0 L 0 1.03 L .74 -.03 L .74 1',
    'O': 'A .44 .5 .44 .512 90 450 Z',
    'P': 'M 0 0 L 0 1 CW .345 .735 .255 .265 L 0 .47',
    'Q': 'A .44 .5 .44 .512 90 450 Z  M .54 .27 L .88 -.07',
    'R': 'M 0 0 L 0 1 CW .345 .745 .255 .255 L 0 .49  M .30 .49 L .62 0',
    'S': 'CCW .30 .786 .262 .226 FROM 38 CW .30 .238 .30 .25 TO 218',
    'T': 'M 0 1 L .72 1  M .36 1 L .36 0',
    'U': 'M 0 1 CCW .35 .338 .35 .35 L .70 1',
    'V': 'M 0 1 L .40 -.03 L .80 1',
    'W': 'M 0 1 L .30 -.03 L .60 1.03 L .90 -.03 L 1.20 1',
    'X': 'M 0 0 L .72 1  M 0 1 L .72 0',
    'Y': 'M 0 1 L .38 .44 L .76 1  M .38 .44 L .38 0',
    'Z': 'M 0 1 L .68 1 L 0 0 L .68 0',
    '0': 'A .31 .5 .31 .512 90 450 Z',
    '1': 'M 0 .77 L .24 1.01 L .24 0',
    '2': 'CW .29 .715 .29 .297 FROM 155 L 0 0 L .60 0',
    '3': 'CW .28 .765 .26 .247 FROM 150 X .2 .52 CW .29 .263 .30 .275 TO 210',
    '4': 'M .50 0 L .50 1.03 L 0 .3 L .70 .3',
    '5': 'M .55 1 L .085 1 L .071 .538 CW .29 .31 .31 .322 TO 210',
    '6': 'A .35 .312 .35 .70 48 180 A .31 .312 .31 .324 180 540',
    '7': 'M 0 1 L .60 1 L .20 0',
    '8': 'A .30 .771 .25 .241 -90 270 A .30 .259 .30 .271 90 -270 Z',
    '9': 'A .27 .688 .35 .70 228 360 A .31 .688 .31 .324 0 360',
    '.': 'A .03 .03 .03 .03 0 360 Z',
    ',': 'M .08 .05 L 0 -.16',
    '!': 'M .03 1 L .03 .36 ; A .03 .03 .03 .03 0 360 Z',
    '?': 'CW .245 .767 .245 .245 FROM 160 CCW .395 .40 .15 .15 L .245 .37 ; A .245 .03 .03 .03 0 360 Z',
    '-': 'M 0 .44 L .34 .44',
    '+': 'M 0 .46 L .50 .46  M .25 .71 L .25 .21',
    ':': 'A .03 .03 .03 .03 0 360 Z  A .03 .60 .03 .03 0 360 Z',
    '\'': 'M 0 1 L 0 .76',
    '/': 'M 0 0 L .38 1',
    '&': 'M .72 0 CW .31 .812 .17 .20 CCW .29 .258 .29 .27 L .70 .50',
    '%': 'A .155 .815 .155 .185 90 450 Z  A .895 .185 .155 .185 90 450 Z  M .31 0 L .74 1',
    '#': 'M .17 0 L .29 1  M .53 0 L .65 1  M .03 .33 L .75 .33  M .07 .67 L .79 .67',
    '@': 'M .6796 .69 L .6796 .5 A .4896 .5 .19 .19 0 -360 L .6796 .33 A .8296 .33 .15 .15 180 332 A .51 .5 .512 .512 -28 300',
    '=': 'M 0 .64 L .50 .64  M 0 .30 L .50 .30'
  };

  var ALIAS = { '’': '\'', '‘': '\'', '–': '-', '—': '-', '−': '-', '×': 'X' };

  // ---------------------------------------------------------------- parser

  function parse(d) {
    var tok = d.trim().split(/[\s,]+/), i = 0, strokes = [], cur = null, last = null;
    function num() { return parseFloat(tok[i++]); }
    function add(node) {
      if (!cur) { cur = { nodes: [], closed: false }; strokes.push(cur); }
      node.k = 1; cur.nodes.push(node); last = node;
    }
    while (i < tok.length) {
      var c = tok[i++];
      if (c === 'M') { cur = null; add({ t: 'P', x: num(), y: num() }); }
      else if (c === 'L') add({ t: 'P', x: num(), y: num() });
      else if (c === 'A') add({ t: 'A', cx: num(), cy: num(), rx: num(), ry: num(), a0: num() * DEG, a1: num() * DEG });
      else if (c === 'CW' || c === 'CCW') add({ t: 'B', cx: num(), cy: num(), rx: num(), ry: num(), dir: c === 'CCW' ? 1 : -1 });
      else if (c === 'FROM') last.from = num() * DEG;
      else if (c === 'TO') last.to = num() * DEG;
      else if (c === 'X') last.cusp = [num(), num()];
      else if (c === 'R') last.k = num();
      else if (c === 'Z') { cur.closed = true; cur = null; }
      else if (c === ';') cur = null;
      else if (c !== '') throw new Error('strokefont: bad token "' + c + '" in "' + d + '"');
    }
    return strokes;
  }

  // -------------------------------------------------------------- geometry

  function ept(e, a) { return [e.cx + e.rx * Math.cos(a), e.cy + e.ry * Math.sin(a)]; }

  // Angle at which a tangent through point p touches ellipse e, for a path that
  // runs round e in direction dir and is arriving from p (entering) or leaving
  // towards p.
  function tangentAngle(e, p, dir, entering) {
    var ux = (p[0] - e.cx) / e.rx, uy = (p[1] - e.cy) / e.ry;
    var D = Math.sqrt(ux * ux + uy * uy), beta = D > 1 ? Math.acos(1 / D) : 0;
    return Math.atan2(uy, ux) + (entering ? dir : -dir) * beta;
  }

  // Common tangent from ellipse e1 (leaving) to ellipse e2 (arriving).
  function mutual(e1, e2) {
    var a2 = Math.atan2(e1.cy - e2.cy, e1.cx - e2.cx), a1 = 0;
    for (var i = 0; i < 80; i++) {
      a1 = tangentAngle(e1, ept(e2, a2), e1.dir, false);
      a2 = tangentAngle(e2, ept(e1, a1), e2.dir, true);
    }
    return [a1, a2];
  }

  // Crossing of two ellipses nearest to a hint point, as an angle on each.
  function crossing(e1, e2, hint) {
    function f(a) {
      var p = ept(e1, a), u = (p[0] - e2.cx) / e2.rx, v = (p[1] - e2.cy) / e2.ry;
      return u * u + v * v - 1;
    }
    var N = 720, best = null, bestD = Infinity;
    for (var i = 0; i < N; i++) {
      var lo = i * TAU / N, hi = (i + 1) * TAU / N, flo = f(lo);
      if (flo * f(hi) > 0) continue;
      for (var j = 0; j < 50; j++) {
        var mid = (lo + hi) / 2;
        if (flo * f(mid) <= 0) hi = mid; else { lo = mid; flo = f(lo); }
      }
      var p = ept(e1, lo), d = Math.pow(p[0] - hint[0], 2) + Math.pow(p[1] - hint[1], 2);
      if (d < bestD) { bestD = d; best = [lo, Math.atan2((p[1] - e2.cy) / e2.ry, (p[0] - e2.cx) / e2.rx)]; }
    }
    if (!best) throw new Error('strokefont: ellipses do not cross');
    return best;
  }

  function nodeEnd(n) { return n.t === 'P' ? [n.x, n.y] : ept(n, n.a1); }
  function nodeStart(n) { return n.t === 'P' ? [n.x, n.y] : ept(n, n.a0); }

  // Turn one parsed stroke into line / arc segments.
  function segments(stroke) {
    var nodes = stroke.nodes, n = nodes.length, closed = stroke.closed, i, nd;
    for (i = 0; i < n; i++) {
      nd = nodes[i];
      if (nd.t !== 'B') continue;
      var prev = i > 0 ? nodes[i - 1] : (closed ? nodes[n - 1] : null);
      var next = i < n - 1 ? nodes[i + 1] : (closed ? nodes[0] : null);
      var a0, a1;
      if (nd.from != null) a0 = nd.from;
      else if (prev.t === 'B') a0 = (prev.cusp ? crossing(prev, nd, prev.cusp) : mutual(prev, nd))[1];
      else a0 = tangentAngle(nd, nodeEnd(prev), nd.dir, true);
      if (nd.to != null) a1 = nd.to;
      else if (next.t === 'B') a1 = (nd.cusp ? crossing(nd, next, nd.cusp) : mutual(nd, next))[0];
      else a1 = tangentAngle(nd, next.t === 'P' ? [next.x, next.y] : ept(next, next.a0), nd.dir, false);
      if (nd.dir > 0) { while (a1 < a0 - 1e-9) a1 += TAU; while (a1 > a0 + TAU + 1e-9) a1 -= TAU; }
      else { while (a1 > a0 + 1e-9) a1 -= TAU; while (a1 < a0 - TAU - 1e-9) a1 += TAU; }
      nd.a0 = a0; nd.a1 = a1;
    }
    var segs = [], pen = null, start = null, prevK = 1;
    function line(p, q, k) {
      if (Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) > 2e-3) segs.push({ p0: p, p1: q, k: k });
      else if (segs.length) segs[segs.length - 1].k = k;
    }
    for (i = 0; i < n; i++) {
      nd = nodes[i];
      if (nd.t === 'P') {
        var p = [nd.x, nd.y];
        if (pen) line(pen, p, nd.k); else start = p;
        pen = p;
      } else {
        var s = nodeStart(nd);
        if (pen) line(pen, s, prevK); else start = s;
        segs.push({ e: nd, a0: nd.a0, a1: nd.a1, k: nd.k });
        pen = nodeEnd(nd);
      }
      prevK = nd.k;
    }
    if (closed) line(pen, start, nodes[0].k);
    return segs;
  }

  function segTangent(s, atEnd) {
    var x, y;
    if (s.e) {
      var a = atEnd ? s.a1 : s.a0, sg = s.a1 >= s.a0 ? 1 : -1;
      x = -s.e.rx * Math.sin(a) * sg; y = s.e.ry * Math.cos(a) * sg;
    } else { x = s.p1[0] - s.p0[0]; y = s.p1[1] - s.p0[1]; }
    var l = Math.sqrt(x * x + y * y) || 1;
    return [x / l, y / l];
  }

  // Segments -> fine polyline plus the list of corners that need a fillet.
  function flatten(segs, closed) {
    var pts = [], corners = [];
    function push(p) {
      var q = pts[pts.length - 1];
      if (!q || Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]) > 1e-7) pts.push(p);
    }
    for (var j = 0; j < segs.length; j++) {
      var s = segs[j];
      if (s.e) {
        var sweep = s.a1 - s.a0, m = Math.max(4, Math.ceil(Math.abs(sweep) / (1.5 * DEG)));
        for (var i = 0; i <= m; i++) push(ept(s.e, s.a0 + sweep * i / m));
      } else { push(s.p0); push(s.p1); }
      var nx = j < segs.length - 1 ? segs[j + 1] : (closed ? segs[0] : null);
      if (!nx) continue;
      var din = segTangent(s, true), dout = segTangent(nx, false);
      var dot = Math.max(-1, Math.min(1, din[0] * dout[0] + din[1] * dout[1]));
      if (Math.acos(dot) > 1.5 * DEG) corners.push({ i: j < segs.length - 1 ? pts.length - 1 : 0, k: s.k, phi: Math.acos(dot) });
    }
    if (closed && pts.length > 1) {
      var a = pts[0], b = pts[pts.length - 1];
      if (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) < 1e-7) pts.pop();
    }
    corners.sort(function (p, q) { return p.i - q.i; });
    return { pts: pts, corners: corners };
  }

  // Round the corners of a polyline. Right-angle and open corners get radius
  // `round`; sharper ones get a smaller radius chosen so the tip never pulls
  // back further than a right-angle corner does, which keeps A, V, M, N crisp.
  function fillet(pts, corners, round, closed) {
    var i, anchors = [];
    if (closed) {
      if (corners.length && corners[0].i === 0) {          // never start on a corner
        var mid = [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2];
        pts = [mid].concat(pts.slice(1), [pts[0]]);
        corners = corners.map(function (c) { return { i: c.i === 0 ? pts.length - 1 : c.i, k: c.k, phi: c.phi }; });
        corners.sort(function (a, b) { return a.i - b.i; });
      }
      pts = pts.concat([pts[0]]);
    }
    var n = pts.length, S = [0];
    for (i = 1; i < n; i++) S.push(S[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    function at(s, before) {
      var j = 1;
      while (j < n - 1 && (before ? S[j] < s - 1e-12 : S[j] <= s + 1e-12)) j++;
      var l = S[j] - S[j - 1] || 1, u = (s - S[j - 1]) / l;
      var a = pts[j - 1], b = pts[j];
      return { p: [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], d: [(b[0] - a[0]) / l, (b[1] - a[1]) / l] };
    }
    var out = [];
    function push(p) {
      var q = out[out.length - 1];
      if (!q || Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]) > 1e-7) out.push(p);
    }
    function copy(s0, s1) {
      push(at(s0, false).p);
      for (var j = 0; j < n; j++) if (S[j] > s0 + 1e-9 && S[j] < s1 - 1e-9) push(pts[j]);
      push(at(s1, true).p);
    }
    var cursor = 0;
    for (var c = 0; c < corners.length; c++) {
      var cr = corners[c], sc = S[cr.i];
      var before = sc - (c > 0 ? S[corners[c - 1].i] : 0), after = (c < corners.length - 1 ? S[corners[c + 1].i] : S[n - 1]) - sc;
      var limIn = c > 0 ? before / 2 : before * (closed ? 1 : 0.9);
      var limOut = c < corners.length - 1 ? after / 2 : after * (closed ? 1 : 0.9);
      var theta = Math.PI - cr.phi, r = round * cr.k, t = 0;
      if (r > 0) {
        if (theta < Math.PI / 2) r = Math.min(r, r * (Math.SQRT2 - 1) / (1 / Math.sin(theta / 2) - 1));
        t = Math.min(r / Math.tan(theta / 2), limIn, limOut);
      }
      if (t < 1e-4) { copy(cursor, sc); anchors.push(out.length - 1); cursor = sc; continue; }
      var A = at(sc - t, true), B = at(sc + t, false);
      copy(cursor, sc - t);
      var cross = A.d[0] * B.d[1] - A.d[1] * B.d[0], X = pts[cr.i];
      if (Math.abs(cross) > 1e-6) {
        var u = ((B.p[0] - A.p[0]) * B.d[1] - (B.p[1] - A.p[1]) * B.d[0]) / cross;
        if (u > 0) X = [A.p[0] + A.d[0] * u, A.p[1] + A.d[1] * u];
      }
      var psi = Math.acos(Math.max(-1, Math.min(1, A.d[0] * B.d[0] + A.d[1] * B.d[1])));
      var w = Math.cos(psi / 2), m = 2 * Math.ceil(psi / (8 * DEG)) + 1;
      for (i = 1; i <= m; i++) {
        var v = i / (m + 1), b0 = (1 - v) * (1 - v), b1 = 2 * v * (1 - v) * w, b2 = v * v, q = b0 + b1 + b2;
        push([(b0 * A.p[0] + b1 * X[0] + b2 * B.p[0]) / q, (b0 * A.p[1] + b1 * X[1] + b2 * B.p[1]) / q]);
        if (i === (m + 1) / 2) anchors.push(out.length - 1);
      }
      cursor = sc + t;
    }
    copy(cursor, S[n - 1]);
    if (closed) out.pop();
    return { pts: out, anchors: anchors, closed: closed };
  }

  // Evenly spaced points by arc length, never more than `step` apart. Corner
  // tips (anchors) are always kept, so spacing is even between corners.
  function resample(st, step) {
    var P = st.closed ? st.pts.concat([st.pts[0]]) : st.pts, last = P.length - 1;
    var bounds = [0].concat(st.anchors.filter(function (a) { return a > 0 && a < last; }), [last]), res = [];
    for (var b = 0; b < bounds.length - 1; b++) {
      var i0 = bounds[b], i1 = bounds[b + 1], S = [0], i;
      for (i = i0 + 1; i <= i1; i++) S.push(S[S.length - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
      var len = S[S.length - 1];
      if (len < 1e-9) continue;
      var cnt = Math.max(1, Math.ceil(len / step - 1e-9)), j = 1;
      for (i = 0; i < cnt; i++) {
        var s = len * i / cnt;
        while (j < S.length - 1 && S[j] < s) j++;
        var u = (s - S[j - 1]) / (S[j] - S[j - 1] || 1), a = P[i0 + j - 1], c = P[i0 + j];
        res.push([a[0] + (c[0] - a[0]) * u, a[1] + (c[1] - a[1]) * u]);
      }
    }
    if (!st.closed) res.push(P[last].slice());
    return res;
  }

  // ---------------------------------------------------------- glyph caches

  var parsed = {}, built = {}, sampled = {}, profiles = {}, pairs = {};

  function buildGlyph(ch, round) {
    var key = ch + '|' + round;
    if (built[key]) return built[key];
    if (!parsed[ch]) parsed[ch] = parse(DEFS[ch]);
    var strokes = parsed[ch].map(function (st) {
      var f = flatten(segments(st), st.closed);
      return fillet(f.pts, f.corners, round, st.closed);
    });
    // ink box comes from the unrounded outline so metrics do not move with `round`
    var x0 = Infinity, x1 = -Infinity;
    parsed[ch].forEach(function (st) {
      flatten(segments(st), st.closed).pts.forEach(function (p) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; });
    });
    strokes.forEach(function (st) { st.pts.forEach(function (p) { p[0] -= x0; }); });
    return (built[key] = { strokes: strokes, w: x1 - x0 });
  }

  function sampleGlyph(ch, round, step) {
    var key = ch + '|' + round + '|' + step;
    if (sampled[key]) return sampled[key];
    var g = buildGlyph(ch, round);
    return (sampled[key] = { w: g.w, strokes: g.strokes.map(function (st) { return { pts: resample(st, step), closed: st.closed }; }) });
  }

  // How far the ink sits in from the glyph's left and right edges, per height band.
  function profile(ch) {
    if (profiles[ch]) return profiles[ch];
    var g = sampleGlyph(ch, FIT.round, 0.01), n = FIT.bands, L = [], R = [], i;
    for (i = 0; i < n; i++) { L.push(Infinity); R.push(Infinity); }
    g.strokes.forEach(function (st) {
      st.pts.forEach(function (p) {
        var y = Math.max(0, Math.min(1, p[1]));
        for (i = 0; i < n; i++) {
          if (Math.abs(y - i / (n - 1)) > FIT.band) continue;
          if (p[0] < L[i]) L[i] = p[0];
          if (g.w - p[0] < R[i]) R[i] = g.w - p[0];
        }
      });
    });
    return (profiles[ch] = { L: L, R: R });
  }

  // Gap between the ink boxes of glyph a and the glyph b that follows it.
  // Open shapes (A V, L T, T .) are drawn together by averaging how deep the
  // white space runs between the pair; a clearance oval around every point of
  // the centre lines then stops anything getting closer than FIT.min sideways
  // or twice that vertically.
  function pairGap(a, b) {
    var key = a + b;
    if (pairs[key] != null) return pairs[key];
    var A = profile(a).R, B = profile(b).L, sum = 0, i, j;
    for (i = 0; i < FIT.bands; i++) sum += Math.min(A[i] + B[i], FIT.depth);
    var d = FIT.target - sum / FIT.bands;
    var ga = sampleGlyph(a, FIT.round, 0.02), gb = sampleGlyph(b, FIT.round, 0.02), pa = [], pb = [];
    ga.strokes.forEach(function (st) { st.pts.forEach(function (p) { pa.push(p); }); });
    gb.strokes.forEach(function (st) { st.pts.forEach(function (p) { pb.push(p); }); });
    var m = FIT.min, my = FIT.min * 2;
    for (i = 0; i < pa.length; i++) {
      for (j = 0; j < pb.length; j++) {
        var dy = (pa[i][1] - pb[j][1]) / my;
        if (dy > -1 && dy < 1) {
          var need = m * Math.sqrt(1 - dy * dy) - (ga.w - pa[i][0]) - pb[j][0];
          if (need > d) d = need;
        }
      }
    }
    return (pairs[key] = d);
  }

  function glyphKey(c) {
    if (ALIAS[c]) c = ALIAS[c];
    c = c.toUpperCase();
    return DEFS.hasOwnProperty(c) ? c : null;
  }

  // ------------------------------------------------------------------ API

  function layout(text, opts) {
    opts = opts || {};
    text = String(text == null ? '' : text);
    var size = opts.size != null ? opts.size : 1;
    var spacing = opts.spacing != null ? opts.spacing : 0.18;
    var lineGap = opts.lineGap != null ? opts.lineGap : 0.45;
    var align = opts.align || 'center';
    var round = Math.max(0, opts.round != null ? opts.round : 0.09);
    var step = Math.max(1e-3, opts.step != null ? opts.step : 0.03);

    // pass 1: place every character on its line, in cap heights
    var lines = [], line = { items: [], width: 0 }, prev = null, x = 0, i;
    lines.push(line);
    var chars = [];
    for (i = 0; i < text.length; i++) {
      var raw = text[i];
      if (raw === '\n') {
        chars.push({ char: '\n', nl: true, line: lines.length - 1 });
        line = { items: [], width: 0 }; lines.push(line); prev = null; x = 0;
        continue;
      }
      var key = glyphKey(raw), w = key ? buildGlyph(key, round).w : FIT.space;
      if (line.items.length) x += (key && prev ? pairGap(prev, key) : 0) + spacing;
      var item = { char: key || ' ', key: key, x: x, w: w, line: lines.length - 1 };
      chars.push(item); line.items.push(item);
      x += w; line.width = x; prev = key;
    }
    var width = 0;
    lines.forEach(function (l) { if (l.width > width) width = l.width; });
    var height = lines.length + (lines.length - 1) * lineGap;

    // pass 2: emit strokes
    var strokes = [], glyphs = [];
    for (i = 0; i < chars.length; i++) {
      var c = chars[i];
      var ln = lines[c.line];
      var ox = align === 'left' ? 0 : align === 'right' ? -ln.width : -ln.width / 2;
      var oy = height / 2 - 1 - c.line * (1 + lineGap);
      if (c.nl) {
        glyphs.push({ char: '\n', x: (ox + ln.width) * size, y: oy * size, w: 0, strokeIndexes: [] });
        continue;
      }
      var rec = { char: c.char, x: (ox + c.x) * size, y: oy * size, w: c.w * size, strokeIndexes: [] };
      if (c.key) {
        var g = sampleGlyph(c.key, round, step);
        for (var s = 0; s < g.strokes.length; s++) {
          var src = g.strokes[s].pts, pts = new Array(src.length);
          for (var p = 0; p < src.length; p++) pts[p] = [(ox + c.x + src[p][0]) * size, (oy + src[p][1]) * size];
          rec.strokeIndexes.push(strokes.length);
          strokes.push({ points: pts, closed: g.strokes[s].closed, glyph: i, char: c.char });
        }
      }
      glyphs.push(rec);
    }
    return { strokes: strokes, width: width * size, height: height * size, glyphs: glyphs };
  }

  function length(stroke) {
    var pts = stroke && stroke.points ? stroke.points : stroke, len = 0;
    if (!pts || pts.length < 2) return 0;
    for (var i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (stroke.closed) len += Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]);
    return len;
  }

  var glyphs = { ' ': { d: '', w: FIT.space, strokes: 0 } };
  Object.keys(DEFS).forEach(function (ch) {
    var g = buildGlyph(ch, FIT.round);
    glyphs[ch] = { d: DEFS[ch], w: Math.round(g.w * 1e4) / 1e4, strokes: g.strokes.length };
  });

  var STROKEFONT = { glyphs: glyphs, layout: layout, length: length };

  root.STROKEFONT = STROKEFONT;
  if (typeof module !== 'undefined' && module.exports) module.exports = STROKEFONT;
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
```

REFERENCE STYLE SOURCE (styles/neon-sign.js; its sample topic was "How a rainbow forms")
```js
{
  // ---------------------------------------------------------------- content (change this block for a new topic)
  // A neon explainer is a line drawing on a wall, made of SECTIONS. A section is everything that switches together:
  // one outline, one pose of an animation, one segment of a path, one caption. The story is the order they light in.
  const CAPTIONS = ['SUNLIGHT MEETS RAIN', 'IT BENDS GOING IN', 'REFLECTS, THEN SPLITS', ['RED AT 42°', 'VIOLET AT 40°']];   // one short line per beat
  const DURATION = 11.5;
  const SPECTRUM = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];
  const COLORS = {              // [gas colour at the glass, hot core, colour of the light it throws on the wall]
    sun: ['#ff8a00', '#ffc46a', '#ffab26'],      // amber
    cloud: ['#6aa8ff', '#d4e6ff', '#8cc0ff'],    // cold white
    rain: ['#0a84ff', '#8ccaff', '#2a98ff'],
    drop: ['#00c8a8', '#8dffe4', '#18e6c6'],     // argon turquoise
    white: ['#ffe2b8', '#ffffff', '#fff0da'],    // sunlight
    note: ['#ffb070', '#ffe0c0', '#ffc898'],     // captions: warm white, run dimmer than the drawing
    red: ['#ff1403', '#ff3a1c', '#ff3414'],      // the six bands keep their cores close to the gas colour: here colour is the content
    orange: ['#ff5200', '#ff7a20', '#ff7214'],
    yellow: ['#ffbe00', '#ffd83a', '#ffd21e'],
    green: ['#0cd030', '#40f060', '#28e84c'],
    blue: ['#0b56ff', '#3c84ff', '#2a78ff'],
    violet: ['#8220ff', '#a050ff', '#9a40ff'],
  };
  // when things happen, in seconds. Picture and sound both read this.
  const T = {
    shine: 0.45,                                   // the sun's two sets of rays swap this often (pose A, pose B)
    cloud: 0.45, rain: 1.15, rainStep: 0.14,       // beat 1: the cloud struggles on like lightning, then three sets of drops chase downward
    drop: 2.6, ray: 3.1, rayStep: 0.14,            // beat 2: one drop, and a white ray that travels into it segment by segment
    bounce: 5.2, fan: 5.75, fanStep: 0.11,         // beat 3: off the back of the drop, out as six colours
    land: 8.0, bow: 8.5, bowStep: 0.26,            // beat 4: the bow, band by band, red first; its two labels light with their bands
    notes: [1.3, 4.3, 6.5],
    pulse: 6.6, pulseStep: 0.06, pulseLoop: 30,    // afterwards a brighter pulse keeps running along the light path
  };
  // where things are on the wall (x right, y up, wall at z = 0, ground at y = 0). The drawing is taller than one frame:
  // the camera cranes down it, following the light from the sky to the ground.
  const DROP = { x: 1.9, y: 8.0, r: 1.3 }, CLOUD = { x: 1.9, y: 11.2, s: 1.15 }, SUN = { x: -3.8, r: 0.72 }, BOW = { x: 0, y: 0.62, r: 3.9, gap: 0.24 };
  const NOTE = 0.24, FAN_STEP = 2.8 * Math.PI / 180, FAN_LEN = 2.4;

  // The rainbow ray through a round drop, by Snell's law, for sunlight travelling along +x. It bends going in at p1,
  // reflects once off the back at p2 and bends again leaving at p3. `out` is the direction it leaves in: back toward
  // the sun, turned 4r - 2i from the incoming line. For water that is 42.4 degrees in red (n = 1.331) and about 40.5 in
  // violet (n = 1.344), which is why red is the outer band. The drawing uses n = 1.333 for the path and then spreads
  // the six colours 2.8 degrees apart (about eight times wider than life) so that six tubes fit side by side.
  function rainbowRay(c, R, n = 1.333) {
    const i = Math.acos(Math.sqrt((n * n - 1) / 3)), r = Math.asin(Math.sin(i) / n);   // incidence of least deviation, and its refraction
    const at = (a) => [c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)], a1 = Math.PI - i, chord = Math.PI - 2 * r;
    return { p1: at(a1), p2: at(a1 - chord), p3: at(a1 - 2 * chord), out: Math.PI + 4 * r - 2 * i };
  }

  // ---------------------------------------------------------------- the drawing, as flat centre-lines
  function drawing(K) {
    const sections = [], tubes = [];
    // sec(name, colour, { on: strike time (-1 = already burning) | cycle: [start, step, poses, pose], r: tube radius,
    //   lift: distance off the wall, gain: brightness, snap: no stutter, lamp: which point light it feeds, ... })
    const sec = (name, color, o = {}) => { const s = Object.assign({ name, color, tubes: [], r: 0.05, lift: 0.18, gain: 1, on: 1e9, lamp: null }, o); sections.push(s); return s; };
    const tube = (s, pts, o = {}) => { const tb = Object.assign({ sec: s, pts, closed: false, radius: s.r, lift: s.lift }, o); tubes.push(tb); s.tubes.push(tb); };
    const arc = (cx, cy, r, a0, a1, n = 48) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
    const ring = (cx, cy, r, n = 72) => arc(cx, cy, r, 0, Math.PI * 2 * (1 - 1 / n), n - 1);
    const poly = (corners, closed) => {   // straight runs with a point every few centimetres, so the glass keeps its corners
      const out = [], n = corners.length;
      for (let i = 0; i < (closed ? n : n - 1); i++) { const a = corners[i], b = corners[(i + 1) % n], m = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.07)); for (let k = 0; k < m; k++) out.push([K.lerp(a[0], b[0], k / m), K.lerp(a[1], b[1], k / m)]); }
      if (!closed) out.push(corners[n - 1]);
      return out;
    };
    const along = (a, b, u) => [K.lerp(a[0], b[0], u), K.lerp(a[1], b[1], u)];
    const C = [DROP.x, DROP.y], ray = rainbowRay(C, DROP.r), sunY = ray.p1[1];

    // ---- beat 1: sun, cloud, rain
    const sun = sec('sun', 'sun', { on: -1, r: 0.055, lamp: 'sun' });
    tube(sun, ring(SUN.x, sunY, SUN.r), { closed: true, cut: [SUN.x - SUN.r, sunY] });
    for (let k = 0; k < 2; k++) {          // two sets of rays on the same eight spokes, inner and outer: lit in turn, the sun radiates
      const s = sec('shine' + k, 'sun', { cycle: [0, T.shine, 2, k], r: 0.042, lamp: 'sun' });
      for (let j = 0; j < 8; j++) { const a = j / 8 * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a), r0 = 0.97 + k * 0.33; tube(s, [[SUN.x + c * r0, sunY + sn * r0], [SUN.x + c * (r0 + 0.26), sunY + sn * (r0 + 0.26)]]); }
    }
    const puffs = [[-1.15, -0.15, 0.55], [-0.35, 0.3, 0.72], [0.62, 0.14, 0.62], [1.32, -0.25, 0.45]].map(([x, y, r]) => [CLOUD.x + x * CLOUD.s, CLOUD.y + y * CLOUD.s, r * CLOUD.s]);
    const meet = (a, b) => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]), l = (a[2] * a[2] - b[2] * b[2] + d * d) / (2 * d), h = Math.sqrt(a[2] * a[2] - l * l), ux = (b[0] - a[0]) / d, uy = (b[1] - a[1]) / d; return [a[0] + ux * l - uy * h, a[1] + uy * l + ux * h]; };   // upper crossing of two circles
    const cloudPts = [];
    puffs.forEach((p, i) => {               // over the top of each puff from left to right; the flat base closes the loop
      const from = i ? meet(puffs[i - 1], p) : [p[0], p[1] - p[2]], to = i < puffs.length - 1 ? meet(p, puffs[i + 1]) : [p[0], p[1] - p[2]];
      let a0 = Math.atan2(from[1] - p[1], from[0] - p[0]), a1 = Math.atan2(to[1] - p[1], to[0] - p[0]);
      if (i === 0) a0 = Math.PI * 1.5; if (i === puffs.length - 1) a1 = -Math.PI / 2;
      while (a1 > a0) a1 -= Math.PI * 2;
      cloudPts.push(...arc(p[0], p[1], p[2], a0, a1, Math.ceil((a0 - a1) * 9)).slice(i ? 1 : 0));
    });
    const baseY = puffs[0][1] - puffs[0][2];
    cloudPts.push(...poly([[puffs[3][0], baseY], [puffs[0][0], baseY]]).slice(1, -1));
    tube(sec('cloud', 'cloud', { on: T.cloud, struggle: 0.55, r: 0.055, lamp: 'cloud', thump: 0.5 }), cloudPts, { closed: true });
    // rain: every column holds three sets of short tubes. Lit in turn (0, 1, 2, 0, ...) the drops fall.
    const fanMid = [ray.p3[0] + Math.cos(ray.out) * 1.5, ray.p3[1] + Math.sin(ray.out) * 1.5];
    const keepOut = (x, y) => Math.hypot(x - C[0], y - C[1]) < DROP.r + 0.3 || (Math.abs(y - sunY) < 0.3 && x < C[0]) || Math.hypot(x - fanMid[0], y - fanMid[1]) < 1.75;
    const rain = [0, 1, 2].map((k) => sec('rain' + k, 'rain', { cycle: [T.rain, T.rainStep, 3, k], r: 0.032, lift: 0.14, lamp: 'cloud' }));
    for (let col = 0; col < 8; col++) {
      const x = CLOUD.x - 1.925 + col * 0.55, phase = K.hash(col, 3) * 0.96;
      for (let y = baseY - 0.22 - phase, n = 0; y > 6.2; y -= 0.32, n++) if (!keepOut(x, y) && !keepOut(x, y - 0.22)) tube(rain[n % 3], [[x, y], [x, y - 0.22]]);
    }

    // ---- beat 2: one drop (round, as small raindrops are) and the white ray that travels into it
    tube(sec('drop', 'drop', { on: T.drop, r: 0.06, lamp: 'drop', thump: 0.5 }), ring(C[0], C[1], DROP.r, 96), { closed: true, cut: [C[0] + DROP.r * 0.57, C[1] + DROP.r * 0.82] });
    const light = (name, pts, on, order, lamp) => tube(sec(name, 'white', { on, snap: true, order, r: 0.04, lift: 0.26, lamp, tick: true }), pts);
    const x0 = SUN.x + 1.66, x1 = ray.p1[0] - 0.13, N = 5, len = (x1 - x0) / N;
    for (let j = 0; j < N; j++) light('ray' + j, [[x0 + j * len, sunY], [x0 + (j + 1) * len - 0.07, sunY]], T.ray + j * T.rayStep, j, 'ray');
    const inA = along(ray.p1, ray.p2, 0.07), inB = along(ray.p1, ray.p2, 0.66), backA = along(ray.p1, ray.p2, 0.7), back = along(ray.p2, C, 0.07), backB = along(ray.p2, ray.p3, 0.34), outA = along(ray.p2, ray.p3, 0.38), outB = along(ray.p2, ray.p3, 0.93);
    light('bend', poly([inA, inB]), T.ray + N * T.rayStep + 0.05, N, 'drop');                 // the first leg inside: the bend is the kink between this and the ray

    // ---- beat 3: one reflection off the back, then out, fanned from red to violet
    light('bounce', poly([backA, back, backB]), T.bounce, N + 1, 'drop');                      // one bent tube: the reflection
    light('leave', poly([outA, outB]), T.bounce + 0.16, N + 2, 'drop');
    const apex = [ray.p3[0] - Math.cos(ray.out) * 2, ray.p3[1] - Math.sin(ray.out) * 2];         // the six rays spread from one point behind the exit
    SPECTRUM.forEach((name, k) => {
      const a = ray.out + (2.5 - k) * FAN_STEP, d = [Math.cos(a), Math.sin(a)], w = [apex[0] - C[0], apex[1] - C[1]], wd = w[0] * d[0] + w[1] * d[1];
      const s0 = -wd + Math.sqrt(wd * wd - (w[0] * w[0] + w[1] * w[1] - (DROP.r + 0.13) ** 2));   // where this ray clears the glass of the drop
      tube(sec('fan:' + name, name, { on: T.fan + k * T.fanStep, snap: true, order: N + 3, r: 0.032, lift: 0.22, lamp: 'fan', chime: ['C5', 'D5', 'E5', 'G5', 'A5', 'C6'][k], chimeGain: 0.35 }),
        [[apex[0] + d[0] * s0, apex[1] + d[1] * s0], [apex[0] + d[0] * (s0 + FAN_LEN), apex[1] + d[1] * (s0 + FAN_LEN)]]);
    });

    // ---- beat 4: the bow over a small landscape, red on the outside
    const hill = (x) => BOW.y + 0.3 + 0.5 * Math.cos(K.clamp((x + 1.25) / 1.5, -1, 1) * Math.PI / 2) ** 2 + 0.34 * Math.cos(K.clamp((x - 1.1) / 1.3, -1, 1) * Math.PI / 2) ** 2;
    const land = sec('land', 'drop', { on: T.land, r: 0.04, lift: 0.14, gain: 0.7, lamp: 'land', thump: 0.3 });
    tube(land, Array.from({ length: 61 }, (_, i) => { const x = -2.3 + i * 4.6 / 60; return [x, hill(x)]; }));
    const hx = 1.25, hy = hill(1.25) + 0.12;
    tube(sec('house', 'sun', { on: T.land + 0.25, r: 0.03, lift: 0.14, gain: 0.8, lamp: 'land' }), poly([[hx - 0.24, hy], [hx + 0.24, hy], [hx + 0.24, hy + 0.3], [hx, hy + 0.52], [hx - 0.24, hy + 0.3]], true), { closed: true });
    SPECTRUM.forEach((name, k) => tube(sec('bow:' + name, name, { on: T.bow + k * T.bowStep, r: 0.06, lift: 0.2, lamp: 'bow', thump: 0.22, chime: ['A3', 'C#4', 'E4', 'A4', 'C#5', 'E5'][k], chimeGain: 0.7, feet: true }),
      arc(BOW.x, BOW.y, BOW.r - k * BOW.gap, 0, Math.PI, 64)));

    // ---- captions: small tube lettering. '°' is not in the stroke font, so it is added as a small ring.
    const note = (text, x, y, align, on, off) => {     // `off`: a caption goes dark when the next one lights, so one line is burning at a time
      const s = sec('note:' + text, 'note', { on, off, r: 0.018, lift: 0.1, gain: 0.62, note: true });
      const L = STROKEFONT.layout(text.replace(/°/g, ' '), { size: NOTE, align, step: 0.07 });
      for (const st of L.strokes) tube(s, st.points.map((p) => [p[0] + x, p[1] + y]), { closed: st.closed });
      [...text].forEach((ch, i) => { if (ch === '°') tube(s, ring(x + L.glyphs[i].x + NOTE * 0.06, y + L.glyphs[i].y + NOTE * 0.82, NOTE * 0.2, 16), { closed: true, loop: true }); });
    };
    note(CAPTIONS[0], -2.9, sunY + 2.1, 'center', T.notes[0], T.notes[1]);
    note(CAPTIONS[1], -0.4, sunY - 1.78, 'right', T.notes[1], T.notes[2]);
    note(CAPTIONS[2], 0.3, 6.0, 'right', T.notes[2]);
    CAPTIONS[3].forEach((line, i) => note(line, 0.1, 2.78 - i * 0.58, 'center', T.bow + i * 5 * T.bowStep + 0.12));

    for (const s of sections) {
      const xs = s.tubes.flatMap((tb) => tb.pts.map((p) => p[0])), ys = s.tubes.flatMap((tb) => tb.pts.map((p) => p[1]));
      s.box = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
      s.x = (s.box[0] + s.box[2]) / 2; s.y = (s.box[1] + s.box[3]) / 2;
      s.length = s.tubes.reduce((a, tb) => a + STROKEFONT.length(tb.pts), 0);
    }
    return { sections, tubes };
  }

  // ---------------------------------------------------------------- how neon comes on
  // Each section gets a list of [time, brightness] steps (it holds each value until the next), then `hold`: the moment
  // it finally catches, flashes a little over-bright and settles. A cold tube never fades up: it snaps, drops, snaps.
  function schedule(K) {
    const plan = drawing(K), r = K.rng(7), zaps = [];
    const strikes = [[[0, 0.9], [0.05, 0]], [[0, 0.6], [0.04, 0], [0.09, 1.0], [0.13, 0.1]], [[0, 1.0], [0.06, 0.15]], [[0, 0.5], [0.05, 0]]];
    plan.sections.forEach((s, i) => {
      s.steps = []; s.hold = 1e9; s.worm = [0, 0];
      if (s.cycle) return;                         // a pose of an animation: plain on and off, see level()
      if (s.on < 0) { s.hold = -9; return; }       // has been on all night
      if (s.snap) s.hold = s.on;                   // a segment of a chase just switches, driven by the flasher
      else if (s.struggle) {                       // tries, buzzes with the glow crawling along the glass, dies, then catches
        s.steps = [[s.on, 0.9], [s.on + 0.06, 0]];
        let t = s.on + 0.14; const end = s.on + s.struggle - 0.1;
        while (t < end) { const on = r.range(0.035, 0.085); s.steps.push([t, r.range(0.35, 0.95)], [t + on, r.range(0, 0.12)]); t += on + r.range(0.03, 0.07); }
        s.steps.push([end, 0]); s.worm = [s.on + 0.12, end]; s.hold = s.on + s.struggle;
      } else { const pat = strikes[(i * 3 + 1) % strikes.length]; s.steps = pat.map(([dt, v]) => [s.on + dt, v]); s.hold = s.on + pat[pat.length - 1][0] + 0.07 + r.range(0, 0.03); }
      // every time a tube snaps on it makes a noise: collect those moments for the score
      let was = 0;
      for (let k = 0; k < s.steps.length; k++) { const [ts, v] = s.steps[k]; if (v > 0.3 && was <= 0.3) zaps.push({ t: ts, dur: (s.steps[k + 1] ? s.steps[k + 1][0] : s.hold) - ts, x: s.x, v, s }); was = v; }
      zaps.push({ t: s.hold, dur: 0.14, x: s.x, v: 1, hold: true, s });
    });
    return Object.assign(plan, { zaps });
  }
  function level(s, t) {
    if (s.cycle) { const [t0, step, n, k] = s.cycle; return t >= t0 && Math.floor((t - t0) / step) % n === k ? 1 : 0; }
    if (t >= s.off) return 0.5 * Math.exp(-(t - s.off) / 0.04);
    if (t >= s.hold) {
      // once the whole light path is lit, a brighter pulse keeps running along it, segment after segment
      const p = s.order != null && t >= T.pulse ? 0.55 * Math.max(0, 1 - Math.abs(((t - T.pulse) / T.pulseStep) % T.pulseLoop - s.order * 1.4) / 1.6) : 0;
      return 1 + 0.4 * Math.exp(-(t - s.hold) / 0.28) + p;
    }
    let v = 0; for (const st of s.steps) { if (t < st[0]) break; v = st[1]; }
    return v;
  }

  registerStyle({
    id: 'neon-sign',
    name: 'Neon Sign',
    family: 'Flat content made physical',
    look: 'A line drawing bent out of real glass tube and mounted on a painted brick wall at night: bright cores, coloured gas, black-painted returns into rubber boots, clear standoffs, every unlit tube waiting as milky glass. Small tube lettering for captions. Wet ground at the foot of the wall mirrors the end of it.',
    motion: 'Neon never fades and never slides. A section snaps on, drops out and snaps again before it holds a touch over-bright and settles; one tube buzzes with the glow crawling along the glass before it catches. Things move the way real animated signs do it: by swapping between sets of tubes (pose A, pose B, pose C) and by lighting the segments of a path one after another, so light appears to travel.',
    light: 'The tubes are the only real light: each one throws its own colour on the brick, hot right behind the glass and falling off across the wall, and every flicker moves the whole scene. A faint cold street light keeps the unlit glass readable.',
    materials: 'Milky glass tube, semi-gloss paint over rough brick with soot and rain streaks, black rubber and matte blockout paint, clear acrylic standoffs, galvanised conduit, wet asphalt with puddles.',
    camera: 'Long lens, one slow continuous crane. It starts a little oblique so the glass stands off the wall, drifts in on the part of the drawing that is lighting, then follows the light down the wall and settles low and square on the result, over its reflection in the wet ground. It is still drifting on the last frame.',
    post: 'Wide soft bloom from the over-bright cores, filmic contrast with deep blacks, slight depth of field, light vignette, fine grain, a trace of chromatic aberration.',
    explains: 'How something works, as a diagram that switches on in the order it happens: light, electricity, signals, water, traffic, money, a recipe, a journey. A beat is a group of tubes that strikes on because the one before it did. Outlines are the things, a chase of short segments is whatever flows between them, alternating poses are whatever repeats (rain, flames, wheels, a heartbeat), and colour carries meaning, so use it for the part of the idea that really is about colour, state or category. One small tube caption per beat names what just lit; the last thing to light is the result, and it holds.',
    topic: 'How a rainbow forms',
    duration: DURATION,
    fonts: [],
    render: { samples: 36, shutter: 0.4, tone: 'filmic', exposure: 1.0, bloom: 0.75, bloomThreshold: 1.25, vignette: 0.4, grain: 0.011, ca: 0.0012, fov: 30, background: '#020203' },

    build(S) {
      const { THREE, K, scene, camera, renderer } = S;
      const plan = schedule(K), { sections, tubes } = plan, rnd = K.rng(3);
      const col = (hex) => new THREE.Color(hex);
      const add = (geo, mat, x = 0, y = 0, z = 0, cast = true) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = true; scene.add(m); return m; };

      // ------------------------------------------------------------ night: almost nothing but the sign
      K.env(S, { top: '#05070b', horizon: '#0a0d13', bottom: '#020203', intensity: 0.7, panels: [
        { pos: [-16, 9, 14], size: [2, 2], color: '#ffd9a8', power: 9 },      // a far street lamp, only there to glint on glass and water
        { pos: [10, 12, 16], size: [8, 3], color: '#8fa9d6', power: 1.2 },
      ] });
      K.spot(S, { pos: [-9, 13, 11], target: [0, 5.5, 0], color: '#93a9cf', power: 400, angle: 0.72, penumbra: 1, soft: 0.5 });
      scene.fog = new THREE.FogExp2('#020203', 0.012);

      // ------------------------------------------------------------ the wall: semi-gloss paint over brick
      const TW = 4096, TH = 2048, NX = 18, NY = 26, BW = TW / NX, BH = TH / NY, MORTAR = 10;
      const bricks = [];
      for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) bricks.push({ x: (i + (j % 2) * 0.5) * BW, y: j * BH, tone: rnd.range(-1, 1), lift: rnd.range(-1, 1) });
      const eachBrick = (ctx, fn) => bricks.forEach((b) => { for (const dx of [0, -TW]) { ctx.save(); ctx.translate(b.x + dx, b.y); fn(b); ctx.restore(); } });
      const brickPath = (ctx, inset) => { ctx.beginPath(); ctx.roundRect(MORTAR / 2 + inset, MORTAR / 2 + inset, BW - MORTAR - inset * 2, BH - MORTAR - inset * 2, 5); };
      const wallMap = K.canvasTex(TW, TH, (ctx) => {
        ctx.fillStyle = '#35322f'; ctx.fillRect(0, 0, TW, TH);                                   // mortar, painted over and dirty
        eachBrick(ctx, (b) => { ctx.fillStyle = `hsl(${24 + b.tone * 8}, 5%, ${27 + b.tone * 2.6}%)`; brickPath(ctx, 0); ctx.fill(); });
        for (let i = 0; i < 260; i++) {                                                          // patchy repaints and soot
          const x = rnd() * TW, y = rnd() * TH, s = rnd.range(80, 420), g = ctx.createRadialGradient(x, y, 0, x, y, s);
          g.addColorStop(0, rnd.chance(0.6) ? 'rgba(10,9,8,0.16)' : 'rgba(120,112,100,0.07)'); g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g; ctx.fillRect(x - s, y - s, s * 2, s * 2);
        }
        for (let i = 0; i < 70; i++) {                                                           // rain streaks running down
          const x = rnd() * TW, y = rnd() * TH, h = rnd.range(200, 700), w = rnd.range(8, 30), g = ctx.createLinearGradient(0, y, 0, y + h);
          g.addColorStop(0, 'rgba(8,8,8,0.22)'); g.addColorStop(1, 'rgba(8,8,8,0)'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
        }
        for (let i = 0; i < 26000; i++) { ctx.fillStyle = rnd.chance(0.5) ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.035)'; ctx.fillRect(rnd() * TW, rnd() * TH, rnd.range(1, 4), rnd.range(1, 4)); }
      }, { repeat: [3, 3] });
      const wallBump = K.canvasTex(TW, TH, (ctx) => {
        ctx.fillStyle = '#3a3a3a'; ctx.fillRect(0, 0, TW, TH);
        ctx.filter = 'blur(3px)';
        eachBrick(ctx, (b) => { const v = 150 + b.lift * 34; ctx.fillStyle = `rgb(${v},${v},${v})`; brickPath(ctx, 1); ctx.fill(); });
        ctx.filter = 'none';
        for (let i = 0; i < 60000; i++) { const v = rnd.chance(0.5) ? 0 : 255; ctx.fillStyle = `rgba(${v},${v},${v},0.07)`; ctx.fillRect(rnd() * TW, rnd() * TH, rnd.range(1, 5), rnd.range(1, 5)); }   // pitted brick under the paint
      }, { data: true, repeat: [3, 3] });
      const wallRough = K.canvasTex(TW / 2, TH / 2, (ctx) => {   // roughness lives in the green channel: paint is satin, mortar is dull
        ctx.scale(0.5, 0.5); ctx.fillStyle = 'rgb(0,225,0)'; ctx.fillRect(0, 0, TW, TH);
        eachBrick(ctx, (b) => { ctx.fillStyle = `rgb(0,${118 + b.tone * 22},0)`; brickPath(ctx, 2); ctx.fill(); });
      }, { data: true, repeat: [3, 3] });
      const wallMat = new THREE.MeshStandardMaterial({ map: wallMap, bumpMap: wallBump, bumpScale: 2.2, roughnessMap: wallRough, roughness: 1, metalness: 0 });

      // Light on the wall right behind the glass. Point lights cannot draw the shape of a tube, so the near glow is a
      // light map: every section has a blurred picture of its own tubes (a sprite), and on every update the sprites
      // are added up, each times its section's colour and current brightness, into one float texture that the wall
      // adds to its diffuse light. Any number of sections can flicker for the price of one texture read.
      const GLOW = { x: -8, y: -1, w: 16, h: 14, px: 48, res: 72, pad: 1.7, gain: 20 };
      const glowRT = new THREE.WebGLRenderTarget(GLOW.w * GLOW.res, GLOW.h * GLOW.res, { type: THREE.HalfFloatType, depthBuffer: false });
      const glowScene = new THREE.Scene(), glowCam = new THREE.OrthographicCamera(GLOW.x, GLOW.x + GLOW.w, GLOW.y + GLOW.h, GLOW.y, -1, 1);
      glowScene.background = new THREE.Color(0x000000);
      for (const s of sections) {
        const bx = s.box[0] - GLOW.pad, by = s.box[1] - GLOW.pad, bw = s.box[2] - s.box[0] + GLOW.pad * 2, bh = s.box[3] - s.box[1] + GLOW.pad * 2, k = s.r / 0.055;   // thin tubes throw less light
        const tex = K.canvasTex(Math.ceil(bw * GLOW.px), Math.ceil(bh * GLOW.px), (ctx, w, h) => {
          const line = document.createElement('canvas'); line.width = w; line.height = h; const lc = line.getContext('2d');
          ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); ctx.globalCompositeOperation = 'lighter';
          for (const [sigma, width, alpha] of [[0.07, 0.13, 0.5], [0.2, 0.32, 0.34], [0.5, 0.85, 0.22]]) {   // tight core, soft shoulder, wide skirt
            lc.clearRect(0, 0, w, h); lc.strokeStyle = '#fff'; lc.lineCap = lc.lineJoin = 'round'; lc.lineWidth = width * GLOW.px * Math.max(0.5, k);
            for (const tb of s.tubes) { lc.beginPath(); tb.pts.forEach((p, i) => lc[i ? 'lineTo' : 'moveTo']((p[0] - bx) * GLOW.px, (by + bh - p[1]) * GLOW.px)); if (tb.closed) lc.closePath(); lc.stroke(); }
            ctx.filter = `blur(${sigma * GLOW.px}px)`; ctx.globalAlpha = alpha * Math.min(1, k); ctx.drawImage(line, 0, 0);
          }
        }, { data: true });
        s.spill = new THREE.Vector3();
        const sprite = new THREE.Mesh(new THREE.PlaneGeometry(bw, bh), new THREE.ShaderMaterial({
          uniforms: { map: { value: tex }, uColor: { value: s.spill } }, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, transparent: true,
          vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
          fragmentShader: 'uniform sampler2D map; uniform vec3 uColor; varying vec2 vUv; void main(){ float a = texture2D(map, vUv).r; gl_FragColor = vec4(uColor * a * a, 1.0); }',   // stored as a square root: finer steps in the dark
        }));
        sprite.position.set(bx + bw / 2, by + bh / 2, 0); glowScene.add(sprite);
      }
      wallMat.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, { tGlow: { value: glowRT.texture }, uGlowBox: { value: new THREE.Vector4(GLOW.x, GLOW.y, GLOW.w, GLOW.h) } });
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vWallXY;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvWallXY = (modelMatrix * vec4(transformed, 1.0)).xy;');
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform sampler2D tGlow; uniform vec4 uGlowBox; varying vec2 vWallXY;')
          .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
          { vec2 g = (vWallXY - uGlowBox.xy) / uGlowBox.zw;
            if (g.x > 0.0 && g.x < 1.0 && g.y > 0.0 && g.y < 1.0) reflectedLight.directDiffuse += diffuseColor.rgb * texture2D(tGlow, g).rgb; }`);
      };
      add(new THREE.PlaneGeometry(48, 24), wallMat, 0, 10, 0, false);

      // ------------------------------------------------------------ wet ground: a real mirror, crisp in the puddles, dull between them
      const pn = K.noise(4);
      const puddles = K.canvasTex(768, 768, (ctx, w, h) => {   // r = standing water, g/b = small ripple offsets for the damp asphalt
        const im = ctx.createImageData(w, h);
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          const u = x / w * 24, v = y / h * 24, i = (y * w + x) * 4;
          im.data[i] = 255 * K.smooth(-0.04, 0.1, pn.fbm(u * 0.33, v * 0.22, 0, 4) + 0.1 * pn.n2(u * 1.7, v * 1.7));
          im.data[i + 1] = 128 + 127 * pn.fbm(u * 3.1, v * 3.1, 5, 3) * 1.6; im.data[i + 2] = 128 + 127 * pn.fbm(u * 3.1, v * 3.1, 9, 3) * 1.6; im.data[i + 3] = 255;
        }
        ctx.putImageData(im, 0, 0);
      }, { data: true });
      puddles.flipY = false;
      const grit = K.canvasTex(512, 512, (ctx, w, h) => { ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, w, h); for (let i = 0; i < 9000; i++) { const v = rnd.chance(0.5) ? 0 : 255; ctx.fillStyle = `rgba(${v},${v},${v},${rnd.range(0.05, 0.3)})`; ctx.beginPath(); ctx.arc(rnd() * w, rnd() * h, rnd.range(0.6, 2.6), 0, 7); ctx.fill(); } }, { data: true, repeat: [44, 44] });
      const floor = K.mirrorFloor(S, { y: 0, color: '#0d0e10', roughness: 0.12, strength: 1, fresnel: true, surfaceRoughness: 0.42, material: { bumpMap: grit, bumpScale: 0.6 } });
      // Puddles. K.mirrorFloor reflects with one strength everywhere, so this adds a correction right after the kit's
      // own mirror code: it reads the mirror again, rippled and blurred where the ground is only damp, and swaps that in.
      // It depends on names the kit's mirror shader declares (tMirror, vMirrorCoord, vMirrorWorld, uMirrorBlur, mRefl, mK)
      // and on three's '#include <common>' and '#include <opaque_fragment>'. If any of them is gone the patch is skipped
      // and the floor stays the kit's plain mirror, turned down a little so it still reads as wet ground.
      const kitCompile = floor.material.onBeforeCompile, mirror = S.mirrors[S.mirrors.length - 1];
      floor.material.onBeforeCompile = (sh, rdr) => {
        kitCompile(sh, rdr);
        const frag = sh.fragmentShader, names = ['tMirror', 'vMirrorCoord', 'vMirrorWorld', 'uMirrorBlur', 'mRefl', 'mK'];
        if (!names.every((n) => new RegExp('\\b' + n + '\\b').test(frag)) || !frag.includes('#include <common>') || !frag.includes('#include <opaque_fragment>')) {
          if (mirror && mirror.u && mirror.u.uMirrorStrength) mirror.u.uMirrorStrength.value = 0.6;
          console.warn('neon-sign: the kit mirror shader changed, puddles skipped (plain mirror floor)');
          return;
        }
        sh.uniforms.tPuddle = { value: puddles };
        sh.fragmentShader = frag.replace('#include <common>', '#include <common>\nuniform sampler2D tPuddle;').replace('#include <opaque_fragment>', `{
          vec4 pud = texture2D(tPuddle, (vMirrorWorld.xz + vec2(12.0, 4.0)) / 24.0);
          vec4 mc = vMirrorCoord; mc.xy += (pud.gb - 0.5) * mc.w * 0.02 * (1.0 - pud.r);
          vec3 damp = min(texture2DProj(tMirror, mc, uMirrorBlur + (1.0 - pud.r) * 2.6).rgb, vec3(12.0));
          outgoingLight += (damp * mix(0.34, 1.0, pud.r) - mRefl) * mK; }
          #include <opaque_fragment>`);
      };

      // ------------------------------------------------------------ glass
      // One material per section. Unlit it is milky coated glass; lit, the middle of the tube burns hot and the rim
      // keeps the gas colour. uWorm makes bands of glow crawl along the glass (a tube that will not catch).
      const glass = (key) => {
        const [gas, core] = COLORS[key], hot = SPECTRUM.includes(key) ? 1.6 : 2.4;   // a white-hot core would bleach the six colours
        const m = new THREE.MeshPhysicalMaterial({ color: '#a39f98', roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.12 });
        const u = m.userData.u = { uOn: { value: 0 }, uWorm: { value: 0 }, uPhase: { value: 0 }, uGas: { value: col(gas).multiplyScalar(1.9) }, uCore: { value: col(core).multiplyScalar(hot) } };
        m.onBeforeCompile = (sh) => {
          Object.assign(sh.uniforms, u);
          sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying float vAlong;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvAlong = uv.x;');
          sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uOn, uWorm, uPhase; uniform vec3 uGas, uCore; varying float vAlong;')
            .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
            float facing = saturate(dot(normal, normalize(vViewPosition)));
            float crawl = 1.0 - uWorm * (0.5 + 0.5 * sin(vAlong * 24.0 - uPhase)) * 0.92;
            totalEmissiveRadiance += mix(uGas, uCore, pow(facing, 2.6)) * uOn * crawl;`);
        };
        return m;
      };
      // a flat centre-line becomes glass: lifted off the wall, both ends turned back toward it. A closed loop is cut
      // (at its lowest point, or nearest to `cut`), because a real tube needs two ends.
      const bend = (tb) => {
        const rb = tb.radius * (tb.radius < 0.03 ? 1.15 : 1.5), zt = tb.lift;
        let P = tb.pts.map((p) => [p[0], p[1]]);
        if (tb.loop) return { pts: P.map((p) => [p[0], p[1], zt]), ends: [[P[0][0], P[0][1], zt - tb.radius]], at: () => P[0], s0: 0, s1: 0, L: STROKEFONT.length(P) };   // a ring too small to cut: one leg behind it
        if (tb.closed) { let k = 0; const d = (p) => (tb.cut ? Math.hypot(p[0] - tb.cut[0], p[1] - tb.cut[1]) : p[1]); P.forEach((p, i) => { if (d(p) < d(P[k])) k = i; }); P = P.slice(k).concat(P.slice(0, k)); P.push(P[0].slice()); }
        const cum = [0]; for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
        const L = cum[cum.length - 1];
        const at = (s) => { s = K.clamp(s, 0, L); let i = 1; while (i < P.length - 1 && cum[i] < s) i++; const u = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1); return [K.lerp(P[i - 1][0], P[i][0], u), K.lerp(P[i - 1][1], P[i][1], u)]; };
        const s0 = Math.min(rb + (tb.closed ? tb.radius * 1.2 : 0), L * 0.2), s1 = L - s0;
        const body = [at(s0)]; for (let i = 0; i < P.length; i++) if (cum[i] > s0 + 0.012 && cum[i] < s1 - 0.012) body.push(P[i]); body.push(at(s1));
        const dir = (p, q) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [(q[0] - p[0]) / d, (q[1] - p[1]) / d]; };
        const arc = (p, d) => [1, 2, 3, 4].map((k) => { const a = k * Math.PI / 8; return [p[0] + d[0] * rb * Math.sin(a), p[1] + d[1] * rb * Math.sin(a), zt - rb * (1 - Math.cos(a))]; });
        const e = Math.min(0.03, L * 0.05), head = arc(body[0], dir(at(s0 + e), at(s0))).reverse(), tail = arc(body[body.length - 1], dir(at(s1 - e), at(s1)));
        return { pts: [...head, ...body.map((p) => [p[0], p[1], zt]), ...tail], ends: [head[0], tail[3]], at, s0, s1, L };
      };
      const ends = [], posts = [];   // where the electrode boots and the standoffs go
      for (const s of sections) s.mat = glass(s.color);
      for (const tb of tubes) {
        const b = tb.bent = bend(tb), g = K.tube(b.pts, tb.radius, { segments: Math.min(400, b.pts.length * 2), radial: tb.radius < 0.03 ? 8 : 12, closed: !!tb.loop });
        const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * b.L);   // uv.x in world units along the glass, for the crawling bands
        add(g, tb.sec.mat);
        b.ends.forEach((e) => ends.push({ p: e, r: tb.radius }));
        const n = b.L < 0.9 ? 0 : Math.max(1, Math.round(b.L / 1.25));
        for (let i = 0; i < n; i++) { const sp = b.s0 + (b.s1 - b.s0) * (i + 0.5) / n, p = b.at(sp), q = b.at(sp + 0.02); posts.push({ p, a: Math.atan2(q[1] - p[1], q[0] - p[0]), z: tb.lift, r: tb.radius }); }
      }
      // black-painted returns into rubber boots at the wall (the wiring runs behind it), and clear standoffs with a clip round the glass
      const inst = (geo, mat, n) => { const m = new THREE.InstancedMesh(geo, mat, n); m.castShadow = m.receiveShadow = true; m.frustumCulled = false; scene.add(m); return m; };
      const zCyl = (r, seg = 14) => new THREE.CylinderGeometry(r, r, 1, seg).rotateX(Math.PI / 2).translate(0, 0, 0.5);   // unit length along +z from the wall
      const paint = new THREE.MeshStandardMaterial({ color: '#070707', roughness: 0.85 }), rubber = new THREE.MeshStandardMaterial({ color: '#0d0d0e', roughness: 0.55 });
      const legs = inst(zCyl(1), paint, ends.length), boots = inst(zCyl(1), rubber, ends.length), collars = inst(zCyl(1), rubber, ends.length);
      ends.forEach((e, i) => {
        K.place(legs, i, [e.p[0], e.p[1], 0.03], null, [e.r * 1.07, e.r * 1.07, Math.max(0.01, e.p[2] - 0.025)]);
        K.place(boots, i, [e.p[0], e.p[1], 0], null, [e.r * 1.75, e.r * 1.75, Math.min(0.075, e.p[2] * 0.8)]);
        K.place(collars, i, [e.p[0], e.p[1], Math.min(0.07, e.p[2] * 0.75)], null, [e.r * 1.35, e.r * 1.35, 0.03]);
      });
      const acrylic = new THREE.MeshPhysicalMaterial({ color: '#8f9aa0', roughness: 0.2, clearcoat: 1, transparent: true, opacity: 0.8 });
      const stems = inst(zCyl(1, 10), acrylic, posts.length), bases = inst(zCyl(1, 16), acrylic, posts.length), clips = inst(new THREE.TorusGeometry(1, 0.22, 8, 20).rotateY(Math.PI / 2), acrylic, posts.length);
      posts.forEach((q, i) => {
        K.place(stems, i, [q.p[0], q.p[1], 0], null, [0.017, 0.017, q.z - q.r]);
        K.place(bases, i, [q.p[0], q.p[1], 0], null, [0.05, 0.05, 0.02]);
        K.place(clips, i, [q.p[0], q.p[1], q.z], [0, 0, q.a], q.r * 1.12);
      });

      // ------------------------------------------------------------ conduit along the foot of the wall, and the leads that drop into it
      const PIPE_Y = 0.3, zinc = new THREE.MeshStandardMaterial({ color: '#4a4e52', roughness: 0.5, metalness: 0.8 }), cableMat = new THREE.MeshStandardMaterial({ color: '#0a0a0b', roughness: 0.5 });
      add(new THREE.CylinderGeometry(0.045, 0.045, 24, 16).rotateZ(Math.PI / 2), zinc, 0, PIPE_Y, 0.06);
      for (let x = -11.2; x < 12; x += 1.55) add(K.roundedBox(0.07, 0.19, 0.07, 0.015, 2), zinc, x, PIPE_Y, 0.085);
      for (const tb of tubes) if (tb.sec.feet) for (const e of tb.bent.ends) {
        const j = rnd.range(-0.03, 0.03);
        add(K.tube([[e[0], e[1], 0.06], [e[0] + j, (e[1] + PIPE_Y) / 2 + 0.04, 0.024], [e[0] + j, PIPE_Y + 0.03, 0.06]], 0.015, { segments: 14, radial: 7 }), cableMat);
        add(new THREE.CylinderGeometry(0.028, 0.028, 0.07, 10), zinc, e[0] + j, PIPE_Y + 0.06, 0.06);
      }

      // ------------------------------------------------------------ the light the tubes throw further out
      // Far glow, the ground and every glint come from real point lights. Sections share them: each lamp takes the
      // summed colour and brightness of the sections that name it, so thirty tubes cost a handful of lights.
      const lamps = {};
      for (const s of sections) if (s.lamp) { const g = lamps[s.lamp] = lamps[s.lamp] || { box: [1e9, 1e9, -1e9, -1e9], sum: new THREE.Color(), lights: [] }; g.box = [Math.min(g.box[0], s.box[0]), Math.min(g.box[1], s.box[1]), Math.max(g.box[2], s.box[2]), Math.max(g.box[3], s.box[3])]; }
      for (const g of Object.values(lamps)) {
        const n = g.box[2] - g.box[0] > 5 ? 3 : 1;
        for (let i = 0; i < n; i++) { const l = new THREE.PointLight(0xffffff, 0, 0, 2); l.position.set(K.lerp(g.box[0], g.box[2], (i + 0.5) / n), K.lerp(g.box[1], g.box[3], 0.55), 1.4); scene.add(l); g.lights.push(l); }
      }

      // ------------------------------------------------------------ camera: one continuous crane
      // A little oblique and high on the wall at first, drifting in on the drop while the ray travels, then down the
      // wall after the coloured rays to the bow and the wet ground. The last key lies after the end of the clip, so
      // the camera is still moving on the final frame.
      const cam = {
        pos: K.path([[0, [-3.2, 9.9, 11.0]], [3.3, [-1.1, 9.05, 10.2]], [6.4, [0.75, 7.3, 9.75]], [8.7, [0.6, 3.5, 10.5]], [10.0, [0.45, 1.6, 11.35]], [14.5, [0.1, 1.45, 11.0]]]),
        aim: K.path([[0, [-0.85, 9.65, 0]], [3.3, [-0.45, 8.95, 0]], [6.4, [0.2, 7.38, 0]], [8.7, [0.1, 4.3, 0]], [10.0, [0, 2.2, 0]], [14.5, [0, 2.08, 0]]]),
      };
      const tint = new THREE.Color();

      return {
        update(t) {
          for (const g of Object.values(lamps)) g.sum.setRGB(0, 0, 0);
          sections.forEach((s, i) => {
            const worm = t >= s.worm[0] && t < s.worm[1] ? 1 : 0;
            let lv = level(s, t) * s.gain * (worm ? 0.6 : 1);
            lv *= 1 + 0.035 * Math.sin(t * 41 + i * 1.7) * Math.sin(t * 13.3 + i);            // the gas never burns perfectly steady
            const u = s.mat.userData.u;
            u.uOn.value = lv; u.uWorm.value = worm; u.uPhase.value = t * 34;
            tint.set(COLORS[s.color][2]);
            s.spill.set(tint.r, tint.g, tint.b).multiplyScalar(GLOW.gain * lv);
            if (s.lamp) { const w = lv * s.length * s.r / 0.055; lamps[s.lamp].sum.r += tint.r * w; lamps[s.lamp].sum.g += tint.g * w; lamps[s.lamp].sum.b += tint.b * w; }
          });
          for (const g of Object.values(lamps)) {
            const peak = Math.max(g.sum.r, g.sum.g, g.sum.b, 1e-6);
            for (const l of g.lights) { l.color.copy(g.sum).multiplyScalar(1 / peak); l.intensity = 1.1 * Math.pow(peak, 0.8) / g.lights.length; }   // a little compressed: thirty metres of glass must not wash the wall out
          }
          // add the glow sprites up into the wall's light map for this instant
          const target = renderer.getRenderTarget(), auto = renderer.autoClear;
          renderer.autoClear = true; renderer.setRenderTarget(glowRT); renderer.render(glowScene, glowCam); renderer.setRenderTarget(target); renderer.autoClear = auto;
          const aim = cam.aim(t);
          K.look(camera, cam.pos(t), aim); K.focus(camera, aim, 0.025);
        },
      };
    },

    sound(k) {
      const K = globalThis.K, plan = schedule(K), D = DURATION, pan = (x) => K.clamp(x / 6, -0.8, 0.8);
      k.bed('room', 0, D, { gain: 1.0 });
      // the transformer hum gets a layer thicker with every section that holds
      const hum = (t, g) => { k.tone(t, { f: 120, type: 'sawtooth', dur: D - t, a: 0.06, hold: D - t - 0.5, gain: 0.008 * g, filter: 'lowpass', f2: 520, bus: 'amb' }); k.tone(t, { f: 60, dur: D - t, a: 0.06, hold: D - t - 0.5, gain: 0.03 * g, bus: 'amb' }); };
      hum(0, 1);
      for (const z of plan.zaps) {
        const s = z.s, p = pan(z.x);
        if (!z.hold) k.withMinor(() => { k.play('neon', z.t, { dur: K.clamp(z.dur, 0.04, 0.2), gain: (0.5 + 0.6 * z.v) * (s.note ? 0.4 : 1), pan: p }); k.play('tick', z.t, { gain: s.note ? 0.2 : 0.35, f: 6400, pan: p }); });
        else if (s.tick) k.play(s.name === 'bounce' ? 'tock' : 'tick', z.t, { gain: s.name === 'bounce' ? 0.9 : 0.75, f: s.name === 'bounce' ? 1500 : 2600 + s.order * 260, pan: p });   // the flasher relay stepping the ray along
        else if (s.note) k.withMinor(() => k.play('tick', z.t, { gain: 0.3, f: 5200, pan: p }));
        else {                                                  // caught: a crack, a glass tick, a low thump from the transformer
          k.play('neon', z.t, { dur: 0.1, gain: s.chime ? 0.3 : 0.5, pan: p }); k.play('tick', z.t + 0.01, { gain: 0.5, f: 5200, pan: p });
          if (s.thump) { k.play('thud', z.t, { gain: s.thump, f: 95, pan: p }); hum(z.t, s.thump); }
          if (s.chime) k.play('ding', z.t, { f: s.chime, gain: s.chimeGain, pan: p });   // each colour rings its own note
        }
      }
      const cloud = plan.sections.find((s) => s.struggle);
      k.play('buzz', cloud.worm[0], { dur: cloud.worm[1] - cloud.worm[0], gain: 0.6, f: 118, pan: pan(cloud.x) });   // the cloud's tube struggling to catch
      k.withMinor(() => { for (let n = 0, t = T.rain; t < 8.2; n++, t += T.rainStep) k.play('tick', t, { gain: 0.2 * K.clamp((8.2 - t) / 2.5), f: 3000 + (n % 3) * 180, pan: 0.4 }); });   // the relay that steps the rain, fading as the camera leaves it
      k.music('pad', T.bow, D, { bpm: 60, chords: [['A2', 'E3', 'A3', 'C#4']], gain: 1.0 });   // the bow: let the room breathe out
    },
  });
}
```
