I want a short 3D motion graphic made with three.js in the "Embossed" style. Below is the complete source of a reference animation in this exact style, plus the small rendering kit and sound kit it runs on. Use them as your style guide and rebuild the animation around my content.

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
- Load these Google Fonts before building (the kit awaits the specs in style.fonts): Fraunces

HOW TO STAY IN THE STYLE
- The reference shows the look, not the story. Its objects, layout and beats belong to its own topic: do not reuse them unless my content calls for them. Work out what my content needs to show first, then build those things in this look.
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
Name: Embossed
Family: Flat content made physical
Use: title
Look: Words and one small mark pressed into thick cotton paper and filmed in macro: grey-blue letterpress sunk deep enough to see the walls of the impression and the shadow inside it, a ruler scale embossed blind (raised, no ink), and a copper foil stamp, on a deckle-edged sheet lying on a dark press bed.
Motion: You watch it being made. A brass plate with the type standing up in mirror image swings down, squeezes the sheet and lifts to show the impression; a ribbon of foil is laid over one spot, a heated die on a lever arm stamps it, and the spent foil is peeled back to leave the metal mark.
Light: One low, hard raking lamp from the side, so every impression has a bright far wall and a shadow inside, with dim warm fill. The lamp slides round at the end so the relief turns, and a glint runs across the foil.
Materials: Toothy cream cotton paper that is smoother where it was compressed, ink lying on the floor of the impression with bare paper walls and small bare specks, mirror-bright copper foil, etched brass with wet ink on the type, grey steel.
Camera: A long lens with shallow focus, one continuous move: low against the open plate, down with its edge to the paper, then a slow pass a few letters wide just above the sheet that arrives at the foil work, then up and back until the whole card fills the frame.
Finish: Real depth of field and motion blur, soft bloom only on the foil and brass glints, filmic contrast, a gentle vignette and fine grain.
Good for: Any quote, name, number or simple logo: it is drawn flat on a canvas and pressed into the material, so the statement arrives as a finished, tactile object. Best for one line that should feel permanent, with one small mark picked out in foil.

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

REFERENCE STYLE SOURCE (styles/embossed.js; its sample topic was "The saying "Measure twice, cut once." letterpressed into paper, with a foil-stamped carpenter's square")
```js
{
  // ---------------------------------------------------------------- content (change this for a new topic)
  // Everything on the card is drawn flat, white on black, on a 2D canvas, in three layers. Each layer is pressed
  // differently: `ink` is letterpress (pressed deep and inked), `blind` is embossed with no ink (raised, it only shows
  // in raking light), `foil` is hot-stamped metal. A new topic only needs new drawing code here.
  const LINES = [
    { text: 'Measure twice,', font: 'italic 400 {px}px "Fraunces"' },
    { text: 'cut once.', font: '500 {px}px "Fraunces"' },
  ];
  const PAPER = '#efe5d0', INK = '#3e5173', FOIL = '#f2a56b';   // cotton paper, grey-blue ink (light enough to show the relief under it), copper foil
  const CARD_W = 15, CARD_H = 8.2;                 // the sheet, world units (think centimetres)
  const ART_W = 4096, ART_H = Math.round(ART_W * CARD_H / CARD_W), U = ART_W / CARD_W;   // art canvas, pixels per unit

  // where things sit on the art canvas (pixels). Both lines are centred; the foil mark rides at the end of the last line.
  function layout() {
    const m = document.createElement('canvas').getContext('2d');
    const width = (ln, px) => { m.font = ln.font.replace('{px}', px); return m.measureText(ln.text).width; };
    const px = Math.round(11.3 * U / width(LINES[0], 1000) * 1000);          // the first line spans 11.3 units
    const mark = 1.5 * U, gap = 0.75 * U, w = LINES.map((ln) => width(ln, px));
    const base = [3.02 * U, 5.0 * U];
    const x = [ART_W / 2 - w[0] / 2, ART_W / 2 - (w[1] + gap + mark) / 2];
    return { px, base, x, w, rule: [x[0], x[0] + w[0], 5.98 * U], mark: { x: x[1] + w[1] + gap + mark / 2, y: base[1] - 0.6 * U, s: mark } };
  }
  // a carpenter's square inside a ring: the "one small logo". Drawn in a box of size s centred on (0, 0).
  function drawMark(ctx, s) {
    ctx.lineWidth = s * 0.04; ctx.beginPath(); ctx.arc(0, 0, s * 0.48, 0, Math.PI * 2); ctx.stroke();
    const bx = -s * 0.2, by = -s * 0.27, bw = s * 0.15, bh = s * 0.52, tl = s * 0.43, th = s * 0.12;
    ctx.fillRect(bx, by, bw, bh); ctx.fillRect(bx, by + bh - th, tl, th);     // blade and tongue
    ctx.fillStyle = '#000';                                                   // graduations, knocked out of the metal
    for (let i = 1; i < 9; i++) ctx.fillRect(bx + bw * (i % 2 ? 0.55 : 0.3), by + i * (bh - th) / 9, bw, s * 0.014);
    for (let i = 1; i < 6; i++) ctx.fillRect(bx + bw + i * (tl - bw) / 6, by + bh - th - 1, s * 0.014, th * (i % 2 ? 0.45 : 0.7));
    ctx.fillStyle = '#fff';
  }
  function drawArt(ctx, layer, L) {
    if (layer === 'ink') LINES.forEach((ln, i) => { ctx.font = ln.font.replace('{px}', L.px); ctx.textBaseline = 'alphabetic'; ctx.fillText(ln.text, L.x[i], L.base[i]); });
    if (layer === 'blind') {   // a ruler scale under the words, raised without ink
      const [x0, x1, y] = L.rule, step = (x1 - x0) / 64;
      ctx.fillRect(x0, y, x1 - x0, 0.075 * U);
      for (let i = 0; i <= 64; i++) ctx.fillRect(x0 + i * step - 0.026 * U, y, 0.052 * U, (i % 8 === 0 ? 0.4 : i % 4 === 0 ? 0.29 : 0.19) * U);
    }
    if (layer === 'foil') { ctx.save(); ctx.translate(L.mark.x, L.mark.y); drawMark(ctx, L.mark.s); ctx.restore(); }
  }

  // ---------------------------------------------------------------- timing, shared by picture and sound
  const T = {
    hit: 1.0, lift: 1.4, open: 2.5,                   // the plate closes on the sheet, dwells, swings open
    strip: 3.3, laid: 3.85,                           // a ribbon of foil is laid over the spot
    stamp: 4.25, stampLift: 4.6, stampGone: 5.1,      // the hot die comes down on it, dwells, leaves
    peel: 5.15, peeled: 6.15,                         // the spent foil is peeled back
    sweep: 6.1, flash: 7.0, rest: 7.4,                // the light slides round the finished card and the foil flashes
  };

  // ---------------------------------------------------------------- flat art -> relief maps
  // Three small textures carry the whole impression. `shape`: the crisp artwork (where ink and foil sit). `soft`: the
  // same art blurred a few pixels, which is the height of the impression with soft shoulders. `halo`: a wide blur, the
  // shallow dish of compressed paper around every mark. Channels are R ink, G foil, B blind.
  function reliefMaps(K, W, H, draw) {
    const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
    const layers = ['ink', 'foil', 'blind'].map((name) => { const c = mk(W, H), x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, W, H); x.fillStyle = x.strokeStyle = '#fff'; draw(x, name); return c; });
    const tmp = mk(W, H), tx = tmp.getContext('2d');
    const pack = (w, h, blur) => K.canvasTex(w, h, (ctx) => {
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
      layers.forEach((src, i) => {
        tx.globalCompositeOperation = 'source-over'; tx.filter = 'none'; tx.fillStyle = '#000'; tx.fillRect(0, 0, W, H);
        tx.filter = `blur(${blur}px)`; tx.drawImage(src, 0, 0, w, h); tx.filter = 'none';
        tx.globalCompositeOperation = 'multiply'; tx.fillStyle = ['#f00', '#0f0', '#00f'][i]; tx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(tmp, 0, 0, w, h, 0, 0, w, h);
      });
    }, { data: true });
    return { shape: pack(W, H, 0.7), soft: pack(W, H, 4.2), halo: pack(W >> 2, H >> 2, 10) };
  }
  // Tiling paper fibre: R,G = surface normal of the felted fibres, B = their height, A = slow cloudy variation.
  function fibreMaps(THREE, K) {
    const N = 1024, r = K.rng(3);
    const bump = K.canvasTex(N, N, (ctx) => {
      ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, N, N); ctx.lineCap = 'round';
      const wrap = (x, y, pad, fn) => { for (const ox of [-N, 0, N]) for (const oy of [-N, 0, N]) if (x + ox > -pad && x + ox < N + pad && y + oy > -pad && y + oy < N + pad) fn(x + ox, y + oy); };   // keeps the tile seamless
      for (let i = 0; i < 52000; i++) {      // felt: soft light and dark grains
        const v = r.chance(0.5) ? 255 : 0, rad = r.range(1.2, 4.5);
        ctx.fillStyle = `rgba(${v},${v},${v},${r.range(0.05, 0.22)})`;
        wrap(r.range(0, N), r.range(0, N), 6, (x, y) => { ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.283); ctx.fill(); });
      }
      for (let i = 0; i < 2600; i++) {       // a few single fibres lying on top
        const a = r.range(0, 6.283), len = r.range(8, 44), b = a + r.range(-1, 1), v = r.chance(0.6) ? 255 : 0;
        ctx.strokeStyle = `rgba(${v},${v},${v},${r.range(0.08, 0.3)})`; ctx.lineWidth = r.range(0.7, 1.8);
        wrap(r.range(0, N), r.range(0, N), 50, (x, y) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.cos(b) * len * 0.5, y + Math.sin(b) * len * 0.5, x + Math.cos(a) * len, y + Math.sin(a) * len); ctx.stroke(); });
      }
    }, { data: true, repeat: [1, 1] });
    const src = bump.ctx.getImageData(0, 0, N, N).data, out = new Uint8Array(N * N * 4), h = (x, y) => src[(((y + N) % N) * N + ((x + N) % N)) * 4] / 255;
    const waves = Array.from({ length: 14 }, () => [r.int(-5, 5), r.int(-5, 5), r.range(0, 6.283), r.range(0.4, 1)]);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const o = ((N - 1 - y) * N + x) * 4;   // DataTexture rows run bottom-up
      out[o] = K.clamp(0.5 + (h(x - 1, y) - h(x + 1, y)) * 1.6) * 255; out[o + 1] = K.clamp(0.5 + (h(x, y + 1) - h(x, y - 1)) * 1.6) * 255; out[o + 2] = h(x, y) * 255;
      let c = 0; for (const [kx, ky, ph, am] of waves) c += am * Math.cos((kx * x + ky * y) / N * 6.283 + ph);
      out[o + 3] = K.clamp(0.5 + c * 0.085) * 255;
    }
    const tex = new THREE.DataTexture(out, N, N, THREE.RGBAFormat);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.magFilter = THREE.LinearFilter; tex.anisotropy = 8; tex.needsUpdate = true;
    return { tex, bump };
  }

  // ---------------------------------------------------------------- the relief material
  // Turns a standard material into pressed relief with real depth. The surface lies in the mesh's local XY plane, facing
  // +Z. `height` is GLSL for `float reliefH(vec2 p)`, the height at local point p, between `low` and `top` (the mesh
  // itself is the `top` level). `surface` is GLSL that runs per pixel with `p` (the point actually seen), the relief
  // normal `n`, the height `h0` and the three map samples ready, and may set diffuseColor, roughnessFactor,
  // metalnessFactor and rSpec. Per pixel the shader
  //   1. walks the eye ray down through the height field (parallax occlusion), so the near wall of an impression hides
  //      part of its floor, the far wall is seen in full, and everything shifts correctly when the camera moves;
  //   2. takes the normal from the height by differences;
  //   3. walks from that point toward the key light, so the relief throws its own shadow and it turns with the light.
  function reliefMaterial(THREE, mat, o) {
    const uniforms = Object.assign({ tShape: { value: o.maps.shape }, tSoft: { value: o.maps.soft }, tHalo: { value: o.maps.halo }, tFibre: { value: o.fibre },
      uSize: { value: new THREE.Vector2(o.size[0], o.size[1]) }, uTop: { value: o.top }, uLow: { value: o.low }, uLightL: { value: new THREE.Vector3(0, 0, 10) } }, o.uniforms);
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, uniforms);
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vRl, vRt, vRb, vRn;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvRl = position; vRt = normalMatrix * vec3(1.0, 0.0, 0.0); vRb = normalMatrix * vec3(0.0, 1.0, 0.0); vRn = normalMatrix * vec3(0.0, 0.0, 1.0);');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
        uniform sampler2D tShape, tSoft, tHalo, tFibre; uniform vec2 uSize; uniform float uTop, uLow; uniform vec3 uLightL;
        varying vec3 vRl, vRt, vRb, vRn;
        float rShadow = 1.0, rSpec = 1.0;   // the relief's own shadow, and how much mirror-like reflection the surface keeps
        vec2 rPx, rPy;                      // how p changes per screen pixel on the flat mesh: keeps texture filtering steady after the trace
        #define ART(tex, p) textureGrad(tex, (p) / uSize + 0.5, rPx / uSize, rPy / uSize)
        vec4 fibre(vec2 q, vec2 s) { return textureGrad(tFibre, q * s, rPx * s, rPy * s); }
        ${o.height}
        vec2 reliefTrace(vec2 p, vec3 V) {   // V points to the eye; returns the point of the height field the eye really sees
          vec2 slide = -V.xy / max(V.z, 0.15); float range = uTop - uLow, d0 = 0.0, g0 = uTop - reliefH(p), d = range;
          for (int i = 1; i <= 24; i++) {
            float di = range * float(i) / 24.0, g = uTop - reliefH(p + slide * di) - di;
            if (g <= 0.0) { d = mix(d0, di, g0 / max(g0 - g, 1e-5)); break; }
            d0 = di; g0 = g;
          }
          return p + slide * d;
        }
        vec3 reliefNormal(vec2 p, float e) {
          return normalize(vec3(reliefH(p - vec2(e, 0.0)) - reliefH(p + vec2(e, 0.0)), reliefH(p - vec2(0.0, e)) - reliefH(p + vec2(0.0, e)), 2.0 * e));
        }
        float reliefShadow(vec2 p, float h0, vec3 L, float reach, float soft) {
          if (L.z <= 0.0) return 1.0;
          float slope = L.z / max(length(L.xy), 1e-4), occ = 0.0; vec2 dir = normalize(L.xy);
          for (int i = 1; i <= 14; i++) { float d = reach * float(i) / 14.0; occ = max(occ, reliefH(p + dir * d) - h0 - d * slope); }
          return 1.0 - smoothstep(0.0, soft, occ);
        }`)
        .replace('#include <normal_fragment_maps>', `{
          rPx = dFdx(vRl.xy); rPy = dFdy(vRl.xy);
          vec2 p = reliefTrace(vRl.xy, normalize(vec3(dot(vViewPosition, vRt), dot(vViewPosition, vRb), dot(vViewPosition, vRn))));
          vec3 shape = ART(tShape, p).rgb, soft = ART(tSoft, p).rgb, halo = ART(tHalo, p).rgb;
          float h0 = reliefH(p); vec3 n = reliefNormal(p, 0.006), toLight = normalize(uLightL - vec3(p, h0 - uTop));
          ${o.surface}
          normal = normalize(vRt * n.x + vRb * n.y + vRn * n.z);
        }`)
        .replace('#include <lights_fragment_end>', '#include <lights_fragment_end>\nreflectedLight.directDiffuse *= rShadow; reflectedLight.directSpecular *= rShadow * rSpec; reflectedLight.indirectSpecular *= rSpec;');
    };
    mat.customProgramCacheKey = () => o.height + o.surface;   // two relief materials must not share one compiled shader
    mat.userData.u = uniforms;
    return mat;
  }

  registerStyle({
    id: 'embossed',
    name: 'Embossed',
    family: 'Flat content made physical',
    look: 'Words and one small mark pressed into thick cotton paper and filmed in macro: grey-blue letterpress sunk deep enough to see the walls of the impression and the shadow inside it, a ruler scale embossed blind (raised, no ink), and a copper foil stamp, on a deckle-edged sheet lying on a dark press bed.',
    motion: 'You watch it being made. A brass plate with the type standing up in mirror image swings down, squeezes the sheet and lifts to show the impression; a ribbon of foil is laid over one spot, a heated die on a lever arm stamps it, and the spent foil is peeled back to leave the metal mark.',
    light: 'One low, hard raking lamp from the side, so every impression has a bright far wall and a shadow inside, with dim warm fill. The lamp slides round at the end so the relief turns, and a glint runs across the foil.',
    materials: 'Toothy cream cotton paper that is smoother where it was compressed, ink lying on the floor of the impression with bare paper walls and small bare specks, mirror-bright copper foil, etched brass with wet ink on the type, grey steel.',
    camera: 'A long lens with shallow focus, one continuous move: low against the open plate, down with its edge to the paper, then a slow pass a few letters wide just above the sheet that arrives at the foil work, then up and back until the whole card fills the frame.',
    post: 'Real depth of field and motion blur, soft bloom only on the foil and brass glints, filmic contrast, a gentle vignette and fine grain.',
    explains: 'Any quote, name, number or simple logo: it is drawn flat on a canvas and pressed into the material, so the statement arrives as a finished, tactile object. Best for one line that should feel permanent, with one small mark picked out in foil.',
    topic: 'The saying "Measure twice, cut once." letterpressed into paper, with a foil-stamped carpenter\'s square',
    duration: 8,
    fonts: ['italic 400 300px "Fraunces"', '500 300px "Fraunces"'],
    render: { samples: 48, shutter: 0.4, tone: 'filmic', exposure: 1.0, bloom: 0.4, bloomThreshold: 1.3, vignette: 0.36, grain: 0.028, fov: 24, background: '#050403' },

    build(S) {
      const { THREE, K, scene, camera } = S;
      const L = layout(), maps = reliefMaps(K, ART_W, ART_H, (ctx, layer) => drawArt(ctx, layer, L)), fibre = fibreMaps(THREE, K);
      const MARK = [(L.mark.x / ART_W - 0.5) * CARD_W, (0.5 - L.mark.y / ART_H) * CARD_H], MARK_S = L.mark.s / U;   // the foil mark, in page units
      const PAPER_T = 0.09;
      // Everything is laid out like the artwork: X to the right, Y up the page, Z off the paper. `table` lays that
      // flat on the floor, and world() converts a point given in page coordinates for the kit's camera and lights.
      const table = new THREE.Group(); table.rotation.x = -Math.PI / 2; scene.add(table);
      const world = (p) => [p[0], p[2], -p[1]];

      // ---- light: one low lamp from the left does all the modelling and slides round during the clip. The environment
      // is dim fill plus soft boxes for the metal to reflect. A weak second lamp is kept on the mirror line between the
      // camera and the foil mark and swept across it at the end: too weak to light the paper, but the foil flashes.
      K.env(S, { top: '#1d1915', horizon: '#3a332b', bottom: '#0c0a08', intensity: 0.75, panels: [
        { pos: world([0, 34, 22]), size: [56, 16], color: '#ffe9cf', power: 1.7 },     // across the table: a low camera sees it in the foil and the wet ink
        { pos: world([-8, -40, 9]), size: [46, 12], color: '#ffe9cf', power: 3 },      // behind the camera, for the metal edges that face it
        { pos: world([0, 8, 40]), size: [22, 22], color: '#ffe6c4', power: 0.5 },      // overhead, so the foil is never dead from above
        { pos: world([-5, -22, -30]), size: [22, 30], color: '#ffd9a6', power: 3.2 },   // below: stands in for the lit paper under the open plate
        { pos: world([30, -8, 14]), size: [14, 20], color: '#9db4d6', power: 1.2 },    // cool kick from the right
      ] });
      const key = K.spot(S, { target: world([1.5, 0, 0]), color: '#ffe3bf', power: 28000, angle: 0.2, penumbra: 1, soft: 1.3, far: 100 });
      const keyPos = K.path([[0, [-43, -16, 8.4]], [T.sweep, [-45, -13, 8.6]], [T.rest, [-41, 15, 9.0]], [8.6, [-40, 18, 9.0]]]);
      const glint = K.spot(S, { color: '#fff0da', power: 400, angle: 0.3, penumbra: 1, shadow: false });
      const glintOff = K.path([[T.sweep, -10], [T.flash, -0.3], [T.rest + 0.2, 1.5], [8.6, 1.9]]);   // sideways distance from the mirror line

      // ---- the sheet: a deckle-edged slab whose top face is the relief material
      const paper = reliefMaterial(THREE, new THREE.MeshStandardMaterial({ color: PAPER, roughness: 0.94 }), {
        maps, fibre: fibre.tex, size: [CARD_W, CARD_H], top: 0.03, low: -0.05,
        uniforms: { uInkIn: { value: 0 }, uFoilIn: { value: 0 }, uWet: { value: 0 }, uInk: { value: new THREE.Color(INK) }, uFoil: { value: new THREE.Color(FOIL) } },
        height: `uniform float uInkIn, uFoilIn, uWet; uniform vec3 uInk, uFoil;
          float reliefH(vec2 p) {   // type pressed 0.05 deep, the blind ruler raised 0.03, the foil die pressed 0.03 deep
            vec3 s = ART(tSoft, p).rgb;
            return (0.03 * smoothstep(0.1, 0.9, s.b) - 0.05 * smoothstep(0.08, 0.92, s.r)) * uInkIn - 0.03 * smoothstep(0.08, 0.92, s.g) * uFoilIn;
          }`,
        surface: `
          vec4 fine = fibre(p, vec2(0.3)), coarse = fibre(p.yx + 2.8, vec2(0.11));
          float cloud = coarse.a, pressed = smoothstep(0.15, 0.85, max(soft.r * uInkIn, soft.g * uFoilIn));
          float dip = max(halo.r * uInkIn, halo.g * uFoilIn);                                          // the halo of compressed paper round a mark
          vec2 rim = 0.5 * uSize - abs(p); float edge = smoothstep(0.4, 0.0, min(rim.x, rim.y));     // the sheet thins and fluffs toward the deckle
          vec2 tooth = (fine.rg - 0.5) * 0.4 + (coarse.rg - 0.5) * 0.38;
          n = normalize(vec3(n.xy + tooth * mix(0.5, 0.1, pressed) * (1.0 + 2.0 * edge) + sign(p) * step(rim, rim.yx) * edge * edge * 0.5, n.z));
          rShadow = reliefShadow(p, h0, toLight, 0.34, 0.005);
          diffuseColor.rgb *= (0.95 + 0.1 * cloud) * (1.0 - 0.07 * dip) * (1.0 - 0.07 * smoothstep(0.62, 0.8, coarse.b)) + 0.05 * edge;
          roughnessFactor = 0.95 - 0.16 * pressed; rSpec = 0.6;
          // letterpress ink lies on the floor of the impression; the upper walls stay bare paper, which is what shows
          // the depth. It is thinner in the middle of a stroke and missing where a fibre sat low.
          float salt = smoothstep(0.36, 0.30, fibre(p + 3.3, vec2(0.21)).b) + 0.4 * smoothstep(0.35, 0.29, fine.b);
          float ink = smoothstep(0.6, 0.72, soft.r) * (1.0 - 0.4 * min(salt, 1.0)) * uInkIn;
          vec3 inkC = uInk * (0.6 + 0.8 * cloud) * (1.0 + 0.5 * smoothstep(0.85, 1.0, soft.r));
          diffuseColor.rgb = mix(diffuseColor.rgb, inkC, ink);
          roughnessFactor = mix(roughnessFactor, mix(0.8, 0.34, uWet) + 0.14 * (cloud - 0.5), ink); rSpec = mix(rSpec, mix(0.25, 1.0, uWet), ink);
          // foil: metal lying in its own shallower impression
          float foil = smoothstep(0.4, 0.6, shape.g) * uFoilIn;
          diffuseColor.rgb = mix(diffuseColor.rgb, uFoil, foil); metalnessFactor = foil; roughnessFactor = mix(roughnessFactor, 0.17 + 0.1 * cloud, foil); rSpec = mix(rSpec, 1.0, foil);`,
      });
      {
        const n = K.noise(7), pts = [], hw = CARD_W / 2, hh = CARD_H / 2, per = 2 * (CARD_W + CARD_H), step = 0.012;
        for (let s = 0; s < per; s += step) {
          const q = s < CARD_W ? [-hw + s, -hh, 0, 1] : s < CARD_W + CARD_H ? [hw, -hh + s - CARD_W, -1, 0] : s < 2 * CARD_W + CARD_H ? [hw - (s - CARD_W - CARD_H), hh, 0, -1] : [-hw, hh - (s - 2 * CARD_W - CARD_H), 1, 0];
          const off = 0.12 + 0.08 * n.fbm(s * 0.8, 1.3) + 0.04 * n.fbm(s * 3.5, 4.1, 0, 3) + 0.06 * Math.max(0, n.n2(s * 1.9, 9.2) - 0.4);
          pts.push(new THREE.Vector2(q[0] + q[2] * off, q[1] + q[3] * off));
        }
        for (let pass = 0; pass < 3; pass++) { const c = pts.map((v) => v.clone()), N = c.length; pts.forEach((v, i) => v.copy(c[(i + N - 2) % N]).add(c[(i + N - 1) % N]).add(c[i]).add(c[(i + 1) % N]).add(c[(i + 2) % N]).multiplyScalar(0.2)); }   // soften corners and nicks
        // the bevel thins the sheet to a soft feathered rim instead of a cut cliff
        const geo = new THREE.ExtrudeGeometry(new THREE.Shape(pts), { depth: PAPER_T - 0.07, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.05, bevelSegments: 3 }); geo.translate(0, 0, -PAPER_T + 0.035);
        const side = new THREE.MeshStandardMaterial({ color: '#f4ecdc', roughness: 1, bumpMap: fibre.bump, bumpScale: 3 });
        const sheet = new THREE.Mesh(geo, [paper, side]); sheet.castShadow = true; sheet.receiveShadow = true; table.add(sheet);
      }
      // the press bed: dark, matte, slightly grained, so the sheet is the only bright thing in the room
      const bedTex = fibre.bump.clone(); bedTex.repeat.set(26, 26); bedTex.needsUpdate = true;
      const bed = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshStandardMaterial({ color: '#1b1612', roughness: 0.82, bumpMap: bedTex, bumpScale: 1.5 }));
      bed.position.z = -PAPER_T; bed.receiveShadow = true; table.add(bed);

      // ---- the plate: a brass die with the type standing up in mirror image, on a steel platen hinged at the far edge
      const DIE_W = 13.7, DIE_H = 7.0, HINGE = [CARD_H / 2 + 1.5, 0.75];   // hinge line: y and z
      const hinge = new THREE.Group(); hinge.position.set(0, HINGE[0], HINGE[1]); table.add(hinge);
      const forme = new THREE.Group(); forme.position.set(0, -HINGE[0], -HINGE[1]); hinge.add(forme);
      const steel = new THREE.MeshStandardMaterial({ color: '#4a4d52', roughness: 0.5, metalness: 0.6 });
      const brassMat = new THREE.MeshStandardMaterial({ color: '#d9ac5f', roughness: 0.36, metalness: 1 });
      const part = (parent, geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };
      part(forme, K.roundedBox(DIE_W, DIE_H, 0.34, 0.03, 3), brassMat, 0, 0, 0.174);
      part(forme, K.roundedBox(DIE_W + 0.5, DIE_H + 1.4, 0.6, 0.07, 4), steel, 0, 0.9, 0.64);                                 // platen
      for (const y of [-1.9, 0.3, 2.5]) part(forme, K.roundedBox(DIE_W + 0.5, 0.5, 0.3, 0.06, 4), steel, 0, y, 1.05);          // stiffening ribs on its back
      for (const sx of [-1, 1]) for (const y of [-1.1, 1.1]) part(forme, new THREE.CylinderGeometry(0.2, 0.2, 0.14, 24), brassMat, sx * (DIE_W / 2 - 0.6), y, 1.0).rotation.x = Math.PI / 2;
      part(hinge, new THREE.CylinderGeometry(0.3, 0.3, DIE_W + 3, 32), steel, 0, 0, 0).rotation.z = Math.PI / 2;
      const plate = reliefMaterial(THREE, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3, metalness: 1 }), {
        maps, fibre: fibre.tex, size: [CARD_W, -CARD_H], top: 0.07, low: -0.03,   // the face looks down, so the art is mirrored: negative height flips it
        uniforms: { uUsed: { value: 0 }, uInk: { value: new THREE.Color(INK) } },
        height: `uniform float uUsed; uniform vec3 uInk;
          float reliefH(vec2 p) { vec3 s = ART(tSoft, p).rgb; return 0.07 * smoothstep(0.3, 0.7, s.r) - 0.03 * smoothstep(0.3, 0.7, s.b); }   // type stands up, the ruler is cut in`,
        surface: `
          vec4 lines = fibre(p, vec2(0.017, 0.8)), pit = fibre(p, vec2(0.31));
          float up = smoothstep(0.4, 0.6, shape.r);
          n = normalize(vec3(n.xy + mix((pit.rg - 0.5) * 0.4, vec2(0.0, (lines.g - 0.5) * 0.2), up), n.z));   // etched floor is pitted, faces are ground flat
          rShadow = reliefShadow(p, h0, toLight, 0.4, 0.012);
          diffuseColor.rgb = mix(vec3(0.62, 0.40, 0.16), vec3(0.98, 0.76, 0.38), up) * (1.0 - 0.5 * smoothstep(0.4, 0.6, shape.b)); roughnessFactor = mix(0.42, 0.24 + 0.1 * lines.b, up);
          float film = up * mix(1.0, 0.25 + 0.6 * pit.a, uUsed);                                             // ink on the type, patchy once it has printed
          diffuseColor.rgb = mix(diffuseColor.rgb, uInk * 0.5, film); metalnessFactor = 1.0 - film; roughnessFactor = mix(roughnessFactor, 0.22, film); rSpec = 1.0 - 0.6 * film;`,
      });
      const face = part(forme, new THREE.PlaneGeometry(DIE_W, DIE_H), plate, 0, 0, 0.003); face.rotation.x = Math.PI; face.castShadow = false;
      const OPEN0 = 1.0, OPEN1 = 1.42;   // opening angle on frame one and after the print, radians
      const plateAngle = (t) => (t < T.hit ? OPEN0 * (1 - Math.pow(K.clamp(t / T.hit), 2.3)) : OPEN1 * K.seg(t, T.lift, T.open, K.ease.inOut));

      // ---- hot foil: a strip of copper foil, and the heated die on a lever arm that stamps it
      const ROLL = -0.09, SL = 5.6, SW = 1.9, S0 = 1.3, NS = 64, NW = 12;   // strip: angle on the page, length, width, where the mark sits along it
      const stripGeo = new THREE.PlaneGeometry(SL, SW, NS, NW);
      const hole = K.canvasTex(1024, Math.round(1024 * SW / SL), (ctx, w, h) => {      // spent foil: the mark has left the strip
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); ctx.translate(S0 / SL * w, h / 2); ctx.rotate(-ROLL);
        ctx.globalCompositeOperation = 'difference'; ctx.fillStyle = ctx.strokeStyle = '#fff'; drawMark(ctx, MARK_S / SL * w);
      }, { data: true });
      // the carrier side is bright metal, the side that touched the paper is paler and duller, so the peel reads
      const foilMat = (top, spent) => new THREE.MeshStandardMaterial(Object.assign({ color: top ? '#d6844a' : '#b98a6c', metalness: top ? 1 : 0.3, roughness: top ? 0.24 : 0.6, side: top ? THREE.FrontSide : THREE.BackSide }, spent ? { alphaMap: hole, alphaTest: 0.5 } : {}));
      const strips = [true, false].map((top) => { const m = new THREE.Mesh(stripGeo, null); m.userData.mats = [foilMat(top, false), foilMat(top, true)]; m.position.set(MARK[0], MARK[1], 0); m.rotation.z = ROLL; m.castShadow = top; m.receiveShadow = true; m.frustumCulled = false; table.add(m); return m; });
      // the strip's shape at time t: slid in from the right, lying flat, then peeled from its near left corner. The
      // peel line travels across the strip at an angle; everything behind it is rolled back over a small radius.
      const CURL = 0.45, TURN = 2.5, PEEL = 0.55, pc = Math.cos(PEEL), ps = Math.sin(PEEL);
      const Q0 = -S0 * pc - SW / 2 * ps, Q1 = (SL - S0) * pc + SW / 2 * ps;
      function poseStrip(t) {
        const p = stripGeo.attributes.position, laid = K.seg(t, T.strip, T.laid, K.ease.outQuint), off = K.seg(t, T.peeled - 0.3, T.peeled + 0.4, K.ease.in);
        const u = K.seg(t, T.peel, T.peeled), front = K.lerp(Q0 - 0.1, Q1 + 0.5, 0.6 * u + 0.4 * u * u * (3 - 2 * u));   // a steady pull
        for (let j = 0; j <= NW; j++) for (let i = 0; i <= NS; i++) {
          const x0 = i / NS * SL - S0, y0 = SW / 2 - j * SW / NW, r = -x0 * ps + y0 * pc, d = front - (x0 * pc + y0 * ps);
          let q = x0 * pc + y0 * ps, z = 0.04 + 0.012 * Math.sin(x0 * 2.1 + y0 * 1.7) + 0.016 * Math.sin(y0 * 6.5 + x0 * 0.7) + 0.05 * y0 * y0 * (1 - laid) + (1 - laid) * (0.7 + 0.35 * Math.sin(x0 * 0.9));   // foil is never quite flat
          if (d > 0) { const a = Math.min(d / CURL, TURN), ex = Math.max(0, d - CURL * TURN); q = front - CURL * Math.sin(a) - ex * Math.cos(TURN); z += CURL * (1 - Math.cos(a)) + ex * Math.sin(TURN); }
          p.setXYZ(j * (NS + 1) + i, q * pc - r * ps + (1 - laid) * 11 + off * 12, q * ps + r * pc + off * 3, z + off * 6);
        }
        p.needsUpdate = true; stripGeo.computeVertexNormals();
        for (const m of strips) { m.visible = t > T.strip && t < T.peeled + 0.4; m.material = m.userData.mats[t >= T.stamp ? 1 : 0]; }
      }
      const ARM = 10.5, ARM_Z = 1.25, ARM_UP = 0.9;   // lever length, pivot height, raised angle
      const arm = new THREE.Group(); arm.position.set(MARK[0] + ARM, MARK[1], ARM_Z); table.add(arm);
      part(arm, K.roundedBox(1.8, 1.8, 0.75, 0.06, 4), brassMat, -ARM, 0, 0.405 - ARM_Z);                      // the heated die holder
      part(arm, new THREE.CylinderGeometry(0.66, 0.66, 0.24, 40), steel, -ARM, 0, 0.9 - ARM_Z).rotation.x = Math.PI / 2;
      part(arm, K.roundedBox(ARM + 2.2, 0.9, 0.5, 0.1, 4), steel, -ARM / 2 + 0.3, 0, 0);
      for (const y of [-0.3, 0.3]) part(arm, new THREE.CylinderGeometry(0.13, 0.13, 0.1, 20), brassMat, -ARM, y, 0.28).rotation.x = Math.PI / 2;

      // ---- camera: one move. From the plate's face down to its edge on the paper; then, as the plate lifts, a slow
      // low pass along the lettering (about 27 degrees above the paper, close enough for three or four letters) that
      // arrives at the foil work; then up and back until the whole card fills the frame.
      const cam = {
        pos: K.path([[0, [-5.0, -13.4, 2.6]], [T.hit, [-4.4, -11.4, 3.0]], [2.4, [-1.0, -7.4, 3.6]], [4.3, [1.6, -7.6, 3.6]], [5.5, [2.9, -7.9, 3.9]], [6.6, [1.0, -7.9, 17.0]], [8.6, [0.15, -6.8, 21.2]]]),
        aim: K.path([[0, [-0.6, 1.6, 4.5]], [T.hit, [-1.0, -3.6, 0.2]], [2.4, [-0.2, -0.2, 0]], [4.3, [2.0, -0.35, 0]], [5.5, [3.0, -0.4, 0]], [6.6, [0.4, -0.2, 0]], [8.6, [0.15, -0.4, 0]]]),
        ap: K.track([[0, 0.1], [T.hit, 0.13], [2.4, 0.06], [5.5, 0.06], [8.6, 0.05]]),
      };
      const v = new THREE.Vector3();

      return {
        update(t) {
          key.position.set(...world(keyPos(t)));
          // the plate
          hinge.rotation.x = -plateAngle(t); table.updateMatrixWorld(true);
          plate.userData.u.uLightL.value.copy(face.worldToLocal(v.copy(key.position)));
          plate.userData.u.uUsed.value = t >= T.hit ? 1 : 0;
          hinge.visible = t < 3.3;   // by now the low camera cannot see it, and it must not shade the card when the lamp moves round
          // the sheet: each impression exists from the moment its die is down (the die hides the change)
          const pu = paper.userData.u;
          table.worldToLocal(pu.uLightL.value.copy(key.position));
          pu.uInkIn.value = t >= T.hit ? 1 : 0; pu.uFoilIn.value = t >= T.stamp ? 1 : 0;
          pu.uWet.value = 1 - K.seg(t, T.lift, T.lift + 3.5);
          // foil strip and stamp
          poseStrip(t);
          arm.rotation.y = ARM_UP * (1 - K.seg(t, T.laid - 0.3, T.stamp, K.ease.in) + K.seg(t, T.stampLift, T.stampGone, K.ease.inOut));
          arm.visible = t > T.laid - 0.3 && t < T.stampGone;
          const c = cam.pos(t), a = cam.aim(t);
          K.look(camera, world(c), world(a)); K.focus(camera, world(a), cam.ap(t));
          // the glint lamp: mirror the camera in the paper at the mark, go 30 units out along that line, then step aside
          const m = [MARK[0] - c[0], MARK[1] - c[1], c[2]], k = 30 / Math.hypot(...m);
          glint.position.set(...world([MARK[0] + m[0] * k + glintOff(t), MARK[1] + m[1] * k, m[2] * k])); glint.target.position.set(...world([MARK[0], MARK[1], 0]));
          glint.visible = t > T.sweep;
        },
      };
    },

    sound(k) {
      k.bed('room', 0, 8, { gain: 1.0 });
      k.play('whoosh', T.hit - 0.6, { gain: 0.4, dur: 0.6, top: 900 });                                          // the plate swings down
      k.play('press', T.hit, { gain: 1.0 }); k.play('thud', T.hit + 0.01, { gain: 0.6, f: 70 }); k.play('paper', T.hit + 0.03, { gain: 0.35, dur: 0.2 });
      k.play('tock', T.lift, { gain: 0.5, f: 300 }); k.play('paper', T.lift + 0.05, { gain: 0.5, dur: 0.5 });     // it unsticks and lifts
      k.play('swish', T.strip + 0.05, { gain: 0.5, dur: 0.35 }); k.play('paper', T.laid - 0.15, { gain: 0.3, dur: 0.15 });   // the foil ribbon
      k.play('stamp', T.stamp, { gain: 0.9 }); k.play('tock', T.stamp + 0.02, { gain: 0.4, f: 520 });             // the lever lands
      k.noise(T.stamp + 0.04, { dur: T.stampLift - T.stamp, filter: 'highpass', f: 6500, gain: 0.05, a: 0.02 });  // the hot die hisses on the foil
      k.play('tick', T.stampLift, { gain: 0.5, f: 2600 });
      k.play('tape', T.peel, { gain: 0.9, dur: T.peeled - T.peel - 0.1 }); k.play('swish', T.peeled - 0.15, { gain: 0.35, dur: 0.3 });
      k.play('sparkle', T.flash - 0.2, { gain: 0.7, n: 5 }); k.play('ding', T.flash, { gain: 0.45, f: 'E6' });    // the glint crosses the foil
      k.music('pad', T.sweep - 0.3, 8, { bpm: 60, chords: [['D3', 'A3', 'F#4', 'A4']], gain: 0.8 });
    },
  });
}
```
