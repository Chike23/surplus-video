I want a short 3D motion graphic made with three.js in the "Monument Type" style. Below is the complete source of a reference animation in this exact style, plus the small rendering kit and sound kit it runs on. Use them as your style guide and rebuild the animation around my content.

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
- Include the STAGE kit and the SOUND kit below unchanged, and the TEXT3D library (load it after the STAGE kit).
- Load these Google Fonts before building (the kit awaits the specs in style.fonts): Archivo Black

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
Name: Monument Type
Family: Spaces and journeys
Use: title
Look: Words as architecture: a short phrase stands as colossal letters on the terraces of a dark concrete monument in a flooded salt flat at sunset. One word is weathered steel and keeps the last sun; tiny people, lamps, birds and a crane give the scale.
Motion: The words never move. The camera starts at eye height against one giant letter, slides off the terrace as it turns to face the words, and sinks back over the water until the terraces close up into one block that reads top to bottom. Then the evening shadow climbs the monument and leaves only the hero word in the sun.
Light: One low sun from the front left rakes every face, picks out board marks and seams and throws long shadows; the cool sky is the only fill, so shade goes blue. At the end a far ridge shades the monument from the bottom up while lamps and windows come on.
Materials: Board-marked concrete with pour joints, tie holes and rain streaks; rusted steel plates with welded seams for the hero word; wet stone paving; plywood formwork and scaffold tubes on the unfinished letter; pale salt under a film of water that mirrors everything.
Camera: One continuous drone move with deep focus (shallow focus would turn the monument into a model): a wide lens at eye height for the start, a longer lens low over the water, looking up, for the hold.
Finish: Filmic contrast, a little bloom on the sun and the lamps, soft vignette, fine grain, a short shutter. No depth of field.
Good for: A short statement of two to five words where one word is the point: a principle, a motto, a verdict, a title. The hero word gets the top terrace, its own material and the last light; a word can be marked unfinished to put it under scaffolding.

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

TEXT3D (lib/text3d.js: solid 3D letters from any loaded font)
```js
// TEXT3D: solid 3D letters from any CSS font, with no font-parsing library. Classic script; needs the globals THREE
// (core only) and K (lib/stage.js). The font must already be loaded by the page (await document.fonts.load(font)).
//
//   K.textShapes(text, opts)    -> { letters: [{ char, index, line, shapes: THREE.Shape[], x, y, w }], width, height, bounds }
//   K.text3d(text, opts)        -> one merged BufferGeometry (position, normal, uv, uv1, index) for the whole text
//   K.text3dLetters(text, opts) -> [{ char, index, line, geometry, x, y, w }], one geometry per letter, origin at its centre
//
// opts (all optional):
//   font           CSS font with a px size, default '800 200px "Inter"' (the px size itself does not matter)
//   size           world height of the font's em, default 1
//   align          'left' | 'center' | 'right', default 'center': where the origin sits on every line (start, middle, end)
//   lineHeight     line pitch in em, default 1.1; lines split on '\n'; the block is centred on y = 0, y is up
//   letterSpacing  extra space between letters in em, default 0
//   detail         tracing resolution in pixels per em, default 320
//   curveSegments  least number of segments a full circle gets, default 48 (curves get more where they are big)
//   depth          thickness in world units, default 0.2 * size (the bevels are inside it); centred on z = 0
//   bevel          bevel width in world units, default 0.02 * size, 0 = none; at most depth / 2
//   bevelSegments  steps of the bevel's quarter-round, default 3
//
// How it works: every glyph is drawn once on a 2D canvas with the CSS font, the outline of its alpha channel is traced
// at sub-pixel accuracy (marching squares on the anti-aliased coverage), corners are found and rebuilt sharp, the rest
// is smoothed and reduced to as few points as the curve allows. The extruder here (not THREE.ExtrudeGeometry) gives
// smooth normals on curves, hard edges at corners and a rounded bevel that narrows where a stroke is too thin for it.
// Glyph outlines and glyph solids are cached, so a letter that repeats costs almost nothing.
(function (root) {
  const THREE = root.THREE, K = root.K || (root.K = {});

  // ---------------------------------------------------------------- tuning (pixels are tracing pixels: `detail` per em)
  const STEP = 0.5;          // spacing of the dense outline samples, px
  const SIGMA = 1.0;         // smoothing of the dense outline, px (removes pixel noise; corners are rebuilt separately)
  const TRIM = 2.0;          // dense samples closer than this to a corner are dropped (anti-aliasing rounds them off)
  const FIT0 = 3.0, FIT1 = 11.0;   // a corner is the meeting point of two curves fitted to the outline this far from it
  const TOL_EM = 0.0004;     // how far a straight segment may cut inside the true curve, in em (at curveSegments 48)
  const LIN_DEG = 1.2;       // a segment may not mix a straight part and a bend: tangent must turn evenly within this
  const rad = Math.PI / 180;

  // ---------------------------------------------------------------- 1. draw a glyph and read its coverage
  let rcv = null, rctx = null, mctx = null;
  const measureCtx = (font) => { if (!mctx) mctx = document.createElement('canvas').getContext('2d'); mctx.font = font; mctx.textBaseline = 'alphabetic'; mctx.textAlign = 'left'; return mctx; };
  const fontPx = (font) => { const m = /(\d*\.?\d+)px/.exec(font); if (!m) throw new Error('K.text3d: the font needs a px size, like \'800 200px "Inter"\''); return +m[1]; };

  function raster(font, px, ch, detail) {
    const mt = measureCtx(font).measureText(ch), k = detail / px;
    const l = mt.actualBoundingBoxLeft, r = mt.actualBoundingBoxRight, a = mt.actualBoundingBoxAscent, d = mt.actualBoundingBoxDescent;
    if (!(l + r > 0) || !(a + d > 0)) return null;                      // a space, or a glyph with no ink
    for (let pad = Math.ceil(detail * 0.1) + 6, tries = 0; tries < 3; tries++, pad *= 3) {
      const W = Math.ceil((l + r) * k) + 2 * pad, H = Math.ceil((a + d) * k) + 2 * pad, ox = pad + Math.ceil(l * k), oy = pad + Math.ceil(a * k);
      if (!rcv) { rcv = document.createElement('canvas'); rcv.width = 16; rcv.height = 16; }
      if (rcv.width < W || rcv.height < H || !rctx) { rcv.width = Math.max(rcv.width, W); rcv.height = Math.max(rcv.height, H); rctx = rcv.getContext('2d', { willReadFrequently: true }); }   // CPU canvas: exact analytic coverage
      rctx.setTransform(1, 0, 0, 1, 0, 0); rctx.clearRect(0, 0, rcv.width, rcv.height);
      rctx.setTransform(k, 0, 0, k, ox, oy);                             // the font keeps its own px size (and optical size); the canvas is scaled
      rctx.font = font; rctx.textBaseline = 'alphabetic'; rctx.textAlign = 'left'; rctx.fillStyle = '#000';
      rctx.fillText(ch, 0, 0);
      const data = rctx.getImageData(0, 0, W, H).data, A = new Uint8Array(W * H);
      let edge = false;
      for (let i = 0, n = W * H; i < n; i++) A[i] = data[4 * i + 3];
      for (let i = 0; i < W && !edge; i++) edge = A[i] > 0 || A[(H - 1) * W + i] > 0;
      for (let j = 0; j < H && !edge; j++) edge = A[j * W] > 0 || A[j * W + W - 1] > 0;
      if (!edge) return { A, W, H, ox, oy };                             // ink reached the border: the font's bounding box lied, try with more room
    }
    return null;
  }

  // Marching squares on the coverage, threshold one half, crossing points placed by linear interpolation. Returns
  // closed loops [x0, y0, x1, y1, ...] in glyph pixels (origin on the baseline at the pen position, y up), each
  // walked with the ink on its left: outer contours come out counter-clockwise, holes clockwise.
  function traceLoops(R) {
    const { A, W, H, ox, oy } = R, TH = 127.5, next = new Int32Array(2 * W * H).fill(-1);
    for (let j = 0; j < H - 1; j++) for (let i = 0; i < W - 1; i++) {
      const p = j * W + i, c = (A[p] > TH ? 8 : 0) | (A[p + 1] > TH ? 4 : 0) | (A[p + W + 1] > TH ? 2 : 0) | (A[p + W] > TH ? 1 : 0);
      if (c === 0 || c === 15) continue;
      const T = 2 * p, B = 2 * (p + W), L = 2 * p + 1, Rt = 2 * (p + 1) + 1;      // ids of the four cell edges
      const mid = c === 5 || c === 10 ? A[p] + A[p + 1] + A[p + W] + A[p + W + 1] > 4 * TH : false;
      switch (c) {
        case 1: next[L] = B; break; case 2: next[B] = Rt; break; case 4: next[Rt] = T; break; case 8: next[T] = L; break;
        case 3: next[L] = Rt; break; case 6: next[B] = T; break; case 12: next[Rt] = L; break; case 9: next[T] = B; break;
        case 7: next[L] = T; break; case 11: next[T] = Rt; break; case 13: next[Rt] = B; break; case 14: next[B] = L; break;
        case 5: if (mid) { next[L] = T; next[Rt] = B; } else { next[L] = B; next[Rt] = T; } break;
        case 10: if (mid) { next[T] = Rt; next[B] = L; } else { next[T] = L; next[B] = Rt; } break;
      }
    }
    const loops = [];
    for (let e0 = 0; e0 < next.length; e0++) {
      if (next[e0] < 0) continue;
      const pts = [];
      for (let e = e0, guard = 0; e >= 0 && next[e] >= 0 && guard < next.length; guard++) {
        // Where the outline crosses the line between two pixel centres. Coverage is an area, so across a clean edge the
        // sum of the coverage along that line IS the edge position, exactly, for any straight edge up to 45 degrees
        // from square to the line. Steeper crossings are less exact and the other axis has better ones: skip them.
        const p = e >> 1, i = p % W, j = (p - i) / W, d = e & 1 ? W : 1, o = e & 1 ? 1 : W, a0 = A[p - d], a1 = A[p], a2 = A[p + d], a3 = A[p + 2 * d];
        let t = null;
        if (a1 > a2 ? a0 >= 254 && a3 <= 1 : a0 <= 1 && a3 >= 254) t = a1 > a2 ? (a0 + a1 + a2 + a3) / 255 - 1.5 : 2.5 - (a0 + a1 + a2 + a3) / 255;
        else if (Math.abs(A[p + o] + A[p + d + o] - A[p - o] - A[p + d - o]) <= 6 * Math.abs(a2 - a1)) t = (TH - a1) / (a2 - a1);
        if (t !== null) { if (e & 1) pts.push(i + 0.5 - ox, oy - (j + 0.5 + t)); else pts.push(i + 0.5 + t - ox, oy - (j + 0.5)); }
        const n = next[e]; next[e] = -2; e = n;
        if (e === e0) break;
      }
      if (pts.length < 6) continue;
      const rev = new Array(pts.length);                                 // the walk above keeps the ink on its right: turn it round
      for (let i = 0, n = pts.length; i < n; i += 2) { rev[i] = pts[n - 2 - i]; rev[i + 1] = pts[n - 1 - i]; }
      loops.push(rev);
    }
    return loops;
  }

  // ---------------------------------------------------------------- 2. from a pixel-noisy loop to a clean outline
  const loopArea = (p) => { let a = 0; for (let i = 0, n = p.length; i < n; i += 2) { const j = (i + 2) % n; a += p[i] * p[j + 1] - p[j] * p[i + 1]; } return a / 2; };

  function resample(pts) {                       // closed polyline -> n points evenly spaced along it
    const m = pts.length / 2, len = new Float64Array(m); let P = 0;
    for (let i = 0; i < m; i++) { const j = (i + 1) % m; len[i] = Math.hypot(pts[2 * j] - pts[2 * i], pts[2 * j + 1] - pts[2 * i + 1]); P += len[i]; }
    const n = Math.max(12, Math.round(P / STEP)), step = P / n, X = new Float64Array(n), Y = new Float64Array(n);
    for (let k = 0, seg = 0, acc = 0; k < n; k++) {
      const s = k * step;
      while (seg < m - 1 && acc + len[seg] < s) { acc += len[seg]; seg++; }
      const j = (seg + 1) % m, t = len[seg] > 0 ? Math.min(1, (s - acc) / len[seg]) : 0;
      X[k] = pts[2 * seg] + (pts[2 * j] - pts[2 * seg]) * t; Y[k] = pts[2 * seg + 1] + (pts[2 * j + 1] - pts[2 * seg + 1]) * t;
    }
    return { X, Y, n, step };
  }
  function smoothLoop(X, n, sig) {               // circular Gaussian
    const r = Math.ceil(sig * 3), w = []; let sum = 0;
    for (let k = -r; k <= r; k++) { const g = Math.exp(-k * k / (2 * sig * sig)); w.push(g); sum += g; }
    const out = new Float64Array(n);
    for (let i = 0; i < n; i++) { let a = 0; for (let k = -r; k <= r; k++) a += w[k + r] * X[((i + k) % n + n) % n]; out[i] = a / sum; }
    return out;
  }
  // A corner is where the outline turns sharply within a pixel or two. Two scales tell a corner from a tight curve:
  // across a real corner the turn measured over 2 px is almost the turn measured over 4 px, on a curve it is half.
  function findCorners(X, Y, n, step) {
    const k2 = Math.max(2, Math.round(2 / step)), k4 = 2 * k2;
    if (n < 5 * k4) return [];
    const turn = (i, k) => { const a = (i - k + n) % n, b = (i + k) % n, ux = X[i] - X[a], uy = Y[i] - Y[a], vx = X[b] - X[i], vy = Y[b] - Y[i]; return Math.abs(Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)); };
    const cand = [];
    for (let i = 0; i < n; i++) {
      const t2 = turn(i, k2); if (t2 < 15 * rad) continue;
      if (t2 >= 45 * rad) { cand.push([t2, i]); continue; }
      const t4 = turn(i, k4); if (t4 >= 20 * rad && t2 >= 0.72 * t4) cand.push([t2, i]);
    }
    cand.sort((a, b) => b[0] - a[0] || a[1] - b[1]);
    const taken = [], gap = Math.round(2.5 / step);
    for (const [, i] of cand) if (taken.every((j) => { const d = Math.abs(i - j); return Math.min(d, n - d) >= gap; })) taken.push(i);
    return taken.sort((a, b) => a - b);
  }
  // least-squares line or parabola v(s); returned centred on the mean of s for stability
  function polyFit(s, v, deg) {
    const n = s.length; let sm = 0; for (const a of s) sm += a; sm /= n;
    let S2 = 0, S3 = 0, S4 = 0, b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < n; i++) { const t = s[i] - sm, t2 = t * t; S2 += t2; S3 += t2 * t; S4 += t2 * t2; b0 += v[i]; b1 += t * v[i]; b2 += t2 * v[i]; }
    if (deg < 2) return { sm, c: [b0 / n, b1 / S2, 0] };
    const c2 = (b2 - S3 * b1 / S2 - S2 * b0 / n) / (S4 - S3 * S3 / S2 - S2 * S2 / n);
    return { sm, c: [(b0 - S2 * c2) / n, (b1 - S3 * c2) / S2, c2] };
  }
  const ev = (f, s) => { const t = s - f.sm; return f.c[0] + f.c[1] * t + f.c[2] * t * t; }, dv = (f, s) => f.c[1] + 2 * f.c[2] * (s - f.sm);

  // Reduce a dense run of points (with tangent angles PHI and arc lengths S) to the fewest vertices such that every
  // segment stays within eps of the run, turns less than maxTurn, and its tangent turns evenly (so one segment never
  // covers a straight part plus the start of a bend, which would shade the straight part wrongly).
  function simplifyRun(PX, PY, PHI, S, M, eps, maxTurn) {
    const lin = LIN_DEG * rad;
    const ok = (i, j) => {
      if (j === i + 1) return true;
      const dphi = PHI[j] - PHI[i]; if (Math.abs(dphi) > maxTurn) return false;
      const dx = PX[j] - PX[i], dy = PY[j] - PY[i], L = Math.hypot(dx, dy), ds = S[j] - S[i]; if (L < 1e-9) return false;
      for (let k = i + 1; k < j; k++) {
        if (Math.abs((PX[k] - PX[i]) * dy - (PY[k] - PY[i]) * dx) > eps * L) return false;
        if (Math.abs(PHI[k] - PHI[i] - dphi * (S[k] - S[i]) / ds) > lin) return false;
      }
      return true;
    };
    const keep = [0];
    for (let i = 0; i < M - 1;) {
      let lo = i + 1, hi = M;
      for (let g = 2; ; g *= 2) { const j = Math.min(M - 1, i + g); if (j <= lo) break; if (ok(i, j)) { lo = j; if (j === M - 1) break; } else { hi = j; break; } }
      while (hi < M && hi - lo > 1) { const mid = (lo + hi) >> 1; if (ok(i, mid)) lo = mid; else hi = mid; }
      keep.push(lo); i = lo;
    }
    return keep;
  }

  // One traced loop -> outline vertices { x, y, tangent in, tangent out, corner flag } in glyph pixels.
  function processLoop(pts, eps, maxTurn, dbg, raw) {
    if (Math.abs(loopArea(pts)) < 1.5) return null;                      // a stray speck
    const { X: RX, Y: RY, n, step } = resample(pts);
    const SX = smoothLoop(RX, n, SIGMA / step), SY = smoothLoop(RY, n, SIGMA / step);
    const corners = findCorners(RX, RY, n, step), m = corners.length;
    const D = Math.max(1, Math.round(TRIM / step)), k0 = Math.round(FIT0 / step), kmax = Math.round(FIT1 / step), kq = Math.round(4 / step);
    const o = { x: [], y: [], tix: [], tiy: [], tox: [], toy: [], corner: [], cid: [] };
    const push = (x, y, ax, ay, bx, by, c, id) => { o.x.push(x); o.y.push(y); o.tix.push(ax); o.tiy.push(ay); o.tox.push(bx); o.toy.push(by); o.corner.push(c); o.cid.push(c ? id : -1); };
    const wrap = (i) => ((i % n) + n) % n;
    const run = (PX, PY, TX, TY, M) => {                                 // tangent angles (unwrapped), arc length, then reduce
      const PHI = new Float64Array(M), S = new Float64Array(M);
      for (let q = 0; q < M; q++) {
        let a = Math.atan2(TY[q], TX[q]);
        if (q) { while (a - PHI[q - 1] > Math.PI) a -= 2 * Math.PI; while (a - PHI[q - 1] < -Math.PI) a += 2 * Math.PI; S[q] = S[q - 1] + Math.hypot(PX[q] - PX[q - 1], PY[q] - PY[q - 1]); }
        PHI[q] = a;
      }
      return simplifyRun(PX, PY, PHI, S, M, eps, maxTurn);
    };
    if (dbg) dbg.push({ RX, RY, SX, SY, corners });

    if (!m) {                                                            // a smooth closed loop (an O): start at its top
      let s0 = 0; for (let i = 1; i < n; i++) if (SY[i] > SY[s0] || (SY[i] === SY[s0] && SX[i] < SX[s0])) s0 = i;
      const M = n + 1, PX = new Float64Array(M), PY = new Float64Array(M), TX = new Float64Array(M), TY = new Float64Array(M), w = Math.max(1, Math.min(6, (n - 1) >> 1));
      for (let q = 0; q < M; q++) { const i = wrap(s0 + q), a = wrap(i - w), b = wrap(i + w); PX[q] = SX[i]; PY[q] = SY[i]; TX[q] = SX[b] - SX[a]; TY[q] = SY[b] - SY[a]; }
      const keep = run(PX, PY, TX, TY, M);
      for (let q = 0; q < keep.length - 1; q++) { const i = keep[q], L = Math.hypot(TX[i], TY[i]) || 1; push(PX[i], PY[i], TX[i] / L, TY[i] / L, TX[i] / L, TY[i] / L, 0); }
      return o.x.length >= 3 ? o : null;
    }

    // rebuild each corner: fit a curve to the clean outline on both sides (away from the rounded tip) and intersect.
    // Near a sharp tip the two edges are so close that pixels see both, so the clean part starts further out: `from`.
    const fit = (c, dir, gap, from) => {
      const f0 = Math.round(from / step), k1 = Math.min(f0 + kmax - k0, gap - D), cnt = k1 - f0 + 1;
      if (cnt >= 3) {
        const s = [], vx = [], vy = [];
        for (let k = f0; k <= k1; k++) { const i = wrap(c + dir * k); s.push(k * step); vx.push(SX[i]); vy.push(SY[i]); }
        // a straight line if the side is straight (so straight edges stay exactly straight), a parabola if it bends
        const lx = polyFit(s, vx, 1), ly = polyFit(s, vy, 1); if (cnt < 9) return { fx: lx, fy: ly, k1 };
        let r = 0; for (let q = 0; q < cnt; q++) r += Math.pow(ev(lx, s[q]) - vx[q], 2) + Math.pow(ev(ly, s[q]) - vy[q], 2);
        const w = Math.min(1, Math.max(0, (Math.sqrt(r / cnt) - 0.01) / 0.02)); if (w === 0) return { fx: lx, fy: ly, k1 };
        const qx = polyFit(s, vx, 2), qy = polyFit(s, vy, 2), mix = (a, b) => ({ sm: a.sm, c: a.c.map((v, q) => v + (b.c[q] - v) * w) });
        return { fx: mix(lx, qx), fy: mix(ly, qy), k1 };
      }
      const e = wrap(c + dir * gap), dx = RX[e] - RX[c], dy = RY[e] - RY[c], L = Math.hypot(dx, dy) || 1;   // next corner is very close: a straight line to it
      return { fx: { sm: 0, c: [RX[c], dx / L, 0] }, fy: { sm: 0, c: [RY[c], dy / L, 0] }, k1: 0 };
    };
    const C = corners.map((c, j) => {
      const gp = ((c - corners[(j + m - 1) % m] + n) % n) || n, gn = ((corners[(j + 1) % m] - c + n) % n) || n;
      const solve = (from) => {
        const A = fit(c, -1, gp, from), B = fit(c, 1, gn, from);
        let s = 0, u = 0, good = false;
        for (let it = 0; it < 14; it++) {
          const f0 = ev(A.fx, s) - ev(B.fx, u), f1 = ev(A.fy, s) - ev(B.fy, u), a = dv(A.fx, s), b = -dv(B.fx, u), cc = dv(A.fy, s), d = -dv(B.fy, u), det = a * d - b * cc;
          if (Math.abs(det) < 1e-6) break;
          const ds = (f0 * d - b * f1) / det, du = (a * f1 - cc * f0) / det; s -= ds; u -= du;
          if (Math.abs(ds) + Math.abs(du) < 1e-8) { good = true; break; }
          if (!(Math.abs(s) < 50 && Math.abs(u) < 50)) break;
        }
        const tan = (ss, uu) => { const ax = -dv(A.fx, ss), ay = -dv(A.fy, ss), bx = dv(B.fx, uu), by = dv(B.fy, uu), la = Math.hypot(ax, ay) || 1, lb = Math.hypot(bx, by) || 1; return [ax / la, ay / la, bx / lb, by / lb]; };
        let t = tan(s, u), px = ev(A.fx, s), py = ev(A.fy, s);
        const half = (Math.PI - Math.abs(Math.atan2(t[0] * t[3] - t[1] * t[2], t[0] * t[2] + t[1] * t[3]))) / 2, lim = 0.7 / Math.max(0.1, Math.sin(half)) + 1.2;
        if (!(good && s > -16 && s < 3 && u > -16 && u < 3 && Math.hypot(px - RX[c], py - RY[c]) <= lim) || (raw && raw.has(c))) { s = 0; u = 0; t = tan(0, 0); px = RX[c]; py = RY[c]; good = false; }
        return { c, px, py, t, A, B, s, u, gn, half, good, from, Dk: Math.max(D, Math.round((from - 1) / step)) };
      };
      let r = solve(FIT0);
      const need = Math.min(14, 1.75 / Math.max(0.05, Math.tan(r.half)) + 1.5);       // where both edges are clear of each other
      if (need > FIT0 + 0.5) { const r2 = solve(need); if (r2.good || !r.good) r = r2; }
      return r;
    });
    for (let j = 0; j < m; j++) {
      const c0 = C[j], c1 = C[(j + 1) % m], gap = c0.gn;
      const PX = [c0.px], PY = [c0.py], TX = [c0.t[2]], TY = [c0.t[3]];
      for (let k = c0.Dk; k <= gap - c1.Dk; k++) {
        const k2 = gap - k; if (k * step <= c0.u + 0.75 || k2 * step <= c1.s + 0.75) continue;
        const i = wrap(c0.c + k); let tx, ty;
        if (c0.B.k1 > 0 && k <= Math.min(c0.B.k1, c0.Dk + kq)) { tx = dv(c0.B.fx, k * step); ty = dv(c0.B.fy, k * step); }
        else if (c1.A.k1 > 0 && k2 <= Math.min(c1.A.k1, c1.Dk + kq)) { tx = -dv(c1.A.fx, k2 * step); ty = -dv(c1.A.fy, k2 * step); }
        else { const w = Math.max(1, Math.min(6, k - c0.Dk, k2 - c1.Dk)), a = wrap(i - w), b = wrap(i + w); tx = SX[b] - SX[a]; ty = SY[b] - SY[a]; }
        PX.push(SX[i]); PY.push(SY[i]); TX.push(tx); TY.push(ty);
      }
      PX.push(c1.px); PY.push(c1.py); TX.push(c1.t[0]); TY.push(c1.t[1]);
      const keep = run(PX, PY, TX, TY, PX.length);
      push(c0.px, c0.py, c0.t[0], c0.t[1], c0.t[2], c0.t[3], 1, c0.c);
      for (let q = 1; q < keep.length - 1; q++) { const i = keep[q], L = Math.hypot(TX[i], TY[i]) || 1; push(PX[i], PY[i], TX[i] / L, TY[i] / L, TX[i] / L, TY[i] / L, 0); }
    }
    return o.x.length >= 3 ? o : null;
  }

  // ---------------------------------------------------------------- 3. glyphs (cached) and layout
  const glyphs = new Map();
  let DBG = null;
  const pointIn = (c, x, y) => { let inside = false; for (let i = 0, n = c.x.length, j = n - 1; i < n; j = i++) if ((c.y[i] > y) !== (c.y[j] > y) && x < (c.x[j] - c.x[i]) * (y - c.y[i]) / (c.y[j] - c.y[i]) + c.x[i]) inside = !inside; return inside; };
  // A glyph: contours in em units (origin on the baseline at the pen position, y up) grouped into shapes = one outer
  // contour plus the holes directly inside it. Parts of a letter (the dot of an i, both rings of a %) are separate shapes.
  function getGlyph(font, px, ch, detail, cs) {
    const key = font + '|' + detail + '|' + cs + '|' + ch; let g = glyphs.get(key);
    if (g && !DBG) return g;
    g = { key, contours: [], shapes: [], bbox: [0, 0, 0, 0], points: 0 };
    const R = raster(font, px, ch, detail);
    if (R) {
      const eps = Math.max(0.05, TOL_EM * detail * Math.pow(48 / cs, 2)), maxTurn = 2 * Math.PI / cs, loops = traceLoops(R), raw = loops.map(() => new Set());
      const build = (li) => {
        const c = processLoop(loops[li], eps, maxTurn, DBG, raw[li]); if (!c) return null;
        for (let i = c.x.length - 1; i >= 0; i--) {                      // drop repeated points
          const j = i + 1; if (j < c.x.length && Math.hypot(c.x[j] - c.x[i], c.y[j] - c.y[i]) < 1e-4) { c.tox[i] = c.tox[j]; c.toy[i] = c.toy[j]; if (c.corner[j] && !c.corner[i]) { c.corner[i] = 1; c.cid[i] = c.cid[j]; } for (const k in c) c[k].splice(j, 1); }
        }
        return c.x.length >= 3 ? c : null;
      };
      let cs0 = loops.map((_, li) => build(li));
      // Rebuilt corners can overshoot where two parts of a letter only just touch (the arm of a K against its stem,
      // the petals of an asterisk). Wherever the outline then crosses or touches itself, those corners go back to
      // where the pixels put them, which never crosses.
      for (let round = 0; round < 4; round++) {
        const S = []; cs0.forEach((c, li) => { if (c) for (let i = 0, n = c.x.length; i < n; i++) S.push([c.x[i], c.y[i], c.x[(i + 1) % n], c.y[(i + 1) % n], li, i, n]); });
        const redo = new Set(), near = 0.2, flag = (a) => { const c = cs0[a[4]]; for (const i of [a[5], (a[5] + 1) % a[6]]) if (c.corner[i] && !raw[a[4]].has(c.cid[i])) { raw[a[4]].add(c.cid[i]); redo.add(a[4]); } };
        const dps = (px, py, a) => { const ex = a[2] - a[0], ey = a[3] - a[1], t = Math.max(0, Math.min(1, ((px - a[0]) * ex + (py - a[1]) * ey) / (ex * ex + ey * ey || 1))); return Math.hypot(px - a[0] - t * ex, py - a[1] - t * ey); };
        const side = (a, px, py) => (a[2] - a[0]) * (py - a[1]) - (a[3] - a[1]) * (px - a[0]);
        for (let p = 0; p < S.length; p++) for (let q = p + 1; q < S.length; q++) {
          const a = S[p], b = S[q];
          if (a[4] === b[4]) { const d = b[5] - a[5]; if (d === 1 || d === a[6] - 1) continue; }
          if (Math.max(a[0], a[2]) + near < Math.min(b[0], b[2]) || Math.max(b[0], b[2]) + near < Math.min(a[0], a[2]) || Math.max(a[1], a[3]) + near < Math.min(b[1], b[3]) || Math.max(b[1], b[3]) + near < Math.min(a[1], a[3])) continue;
          const cross = side(a, b[0], b[1]) * side(a, b[2], b[3]) < 0 && side(b, a[0], a[1]) * side(b, a[2], a[3]) < 0;
          if (cross || Math.min(dps(a[0], a[1], b), dps(a[2], a[3], b), dps(b[0], b[1], a), dps(b[2], b[3], a)) < near) { flag(a); flag(b); }
        }
        if (!redo.size) break;
        for (const li of redo) cs0[li] = build(li);
      }
      for (const c of cs0) {
        if (!c) continue;
        for (let i = 0; i < c.x.length; i++) { c.x[i] /= detail; c.y[i] /= detail; }
        let a = 0; for (let i = 0, n = c.x.length; i < n; i++) { const j = (i + 1) % n; a += c.x[i] * c.y[j] - c.x[j] * c.y[i]; }
        c.area = a / 2; if (Math.abs(c.area) < 1e-7) continue;
        g.contours.push(c); g.points += c.x.length;
      }
      const outers = g.contours.filter((c) => c.area > 0);
      const bb = [Infinity, Infinity, -Infinity, -Infinity];
      for (const c of outers) { g.shapes.push({ outer: c, holes: [] }); for (let i = 0; i < c.x.length; i++) { bb[0] = Math.min(bb[0], c.x[i]); bb[1] = Math.min(bb[1], c.y[i]); bb[2] = Math.max(bb[2], c.x[i]); bb[3] = Math.max(bb[3], c.y[i]); } }
      for (const h of g.contours) if (h.area < 0) {                      // a hole belongs to the smallest outer contour around it
        let best = null; for (const s of g.shapes) if (pointIn(s.outer, h.x[0], h.y[0]) && (!best || s.outer.area < best.outer.area)) best = s;
        if (best) best.holes.push(h);
      }
      g.contours = []; for (const s of g.shapes) g.contours.push(s.outer, ...s.holes);
      if (outers.length) g.bbox = bb;
    }
    if (!DBG) glyphs.set(key, g);
    return g;
  }

  const clampN = (v, a, b) => Math.min(b, Math.max(a, v));
  function layout(text, o = {}) {
    const font = o.font || '800 200px "Inter"', px = fontPx(font), size = o.size == null ? 1 : o.size, align = o.align || 'center';
    const lh = (o.lineHeight == null ? 1.1 : o.lineHeight) * size, ls = (o.letterSpacing || 0) * px, unit = size / px;
    const detail = Math.round(clampN(o.detail || 320, 48, 1200)), cs = Math.round(clampN(o.curveSegments || 48, 6, 256));
    if (document.fonts && !document.fonts.check(font)) console.warn('K.text3d: font not loaded yet, the fallback font will be traced: ' + font);
    const m = measureCtx(font), fm = m.measureText('Hg');
    const asc = (fm.fontBoundingBoxAscent == null ? fm.actualBoundingBoxAscent : fm.fontBoundingBoxAscent) * unit, desc = (fm.fontBoundingBoxDescent == null ? fm.actualBoundingBoxDescent : fm.fontBoundingBoxDescent) * unit;
    const lines = String(text).split('\n'), H = lines.length * lh, letters = [], B = [Infinity, Infinity, -Infinity, -Infinity];
    let width = 0, index = 0;
    lines.forEach((line, li) => {
      const chars = Array.from(line), row = []; let acc = '', lw = 0;
      // pen positions come from the widths of the growing string, so kerning between neighbours is included
      chars.forEach((ch, i) => { acc += ch; const W = m.measureText(acc).width, adv = m.measureText(ch).width; row.push({ char: ch, index: index++, line: li, px: W - adv + i * ls, adv }); lw = W + i * ls; });
      index++;                                                           // the line break counts as a character
      const x0 = align === 'left' ? 0 : align === 'right' ? -lw * unit : -lw * unit / 2;
      const y = H / 2 - li * lh - (lh - asc - desc) / 2 - asc;           // baseline: the font's ascent + descent box sits centred in its line
      width = Math.max(width, lw * unit);
      for (const r of row) {
        const g = /\s/.test(r.char) ? null : getGlyph(font, px, r.char, detail, cs), x = x0 + r.px * unit;
        if (g && g.shapes.length) { B[0] = Math.min(B[0], x + g.bbox[0] * size); B[1] = Math.min(B[1], y + g.bbox[1] * size); B[2] = Math.max(B[2], x + g.bbox[2] * size); B[3] = Math.max(B[3], y + g.bbox[3] * size); }
        letters.push({ char: r.char, index: r.index, line: r.line, x, y, w: r.adv * unit, glyph: g });
      }
    });
    const bounds = B[0] <= B[2] ? { minX: B[0], minY: B[1], maxX: B[2], maxY: B[3] } : { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    return { letters, width, height: H, bounds, size };
  }

  // K.textShapes(text, { font, size, align, lineHeight, letterSpacing, detail, curveSegments })
  // -> { letters: [{ char, index, line, shapes, x, y, w }], width, height, bounds }. Shapes are THREE.Shape with holes,
  // already placed in block coordinates (y up). x = left edge of the letter's advance box, y = its baseline, w = advance.
  K.textShapes = (text, opts) => {
    const L = layout(text, opts), s = L.size, V = (c, x, y) => c.x.map((_, i) => new THREE.Vector2(x + c.x[i] * s, y + c.y[i] * s));
    return {
      letters: L.letters.map((l) => ({ char: l.char, index: l.index, line: l.line, x: l.x, y: l.y, w: l.w,
        shapes: l.glyph ? l.glyph.shapes.map((sh) => { const S = new THREE.Shape(V(sh.outer, l.x, l.y)); S.holes = sh.holes.map((h) => new THREE.Path(V(h, l.x, l.y))); return S; }) : [] })),
      width: L.width, height: L.height, bounds: L.bounds,
    };
  };

  // ---------------------------------------------------------------- 4. extrude one glyph (em units, cached)
  // Walls get the outline's true tangents as normals (smooth curves, hard corners). The bevel is a quarter-round that
  // insets the outline. Every outline point gets its own bevel width: the asked one where the stroke is wide enough,
  // 80% of the way to the middle of the stroke where it is not, changing gently in between, so the two sides of a thin
  // stroke never run into each other. Outward corners are mitered: nearby points follow the corner's miter line.
  const solids = new Map();
  function buildSolid(g, depth, bevel, segs) {
    const key = g.key + '|' + depth.toFixed(6) + '|' + bevel.toFixed(6) + '|' + segs; let out = solids.get(key); if (out) return out;
    const src = g.contours, hd = depth / 2; bevel = Math.min(bevel, hd);
    let NS = 0; for (const c of src) NS += c.x.length;
    const SA = new Float64Array(4 * NS);
    for (let ci = 0, s = 0; ci < src.length; ci++) { const c = src[ci]; for (let i = 0, n = c.x.length; i < n; i++, s++) { const j = (i + 1) % n; SA[4 * s] = c.x[i]; SA[4 * s + 1] = c.y[i]; SA[4 * s + 2] = c.x[j]; SA[4 * s + 3] = c.y[j]; } }
    // How deep can the point p be inset along m before it meets the middle of the stroke? Picture a disc that starts
    // at p and travels inwards along m, growing so that it always just touches p's own edges (radius own * depth).
    // The depth at which it first touches any other part of the outline is the answer: an exact, noise-free
    // "half-width of the stroke as seen from p". skipA / skipB = the outline segments that p itself sits on.
    const nearSeg = new Uint8Array(NS);                                  // set for the few segments next to p on the same smooth curve
    const contact = (px, py, mx, my, own, skipA, skipB) => {
      const e = Math.max(0, mx * mx + my * my - own * own), se = Math.sqrt(e), reach = Math.hypot(mx, my) + own; let best = Infinity;
      const at = (x, y) => { const dx = x - px, dy = y - py, X = dx * dx + dy * dy, Y = dx * mx + dy * my, g = Y - se * Math.sqrt(X); return g <= 0 || Y <= 0 ? 1e9 - g : X / (Y + Math.sqrt(Math.max(0, Y * Y - e * X))); };
      for (let k = 0; k < NS; k++) {
        if (k === skipA || k === skipB) continue;
        const s = 4 * k, ax = SA[s], ay = SA[s + 1], ex = SA[s + 2] - ax, ey = SA[s + 3] - ay;
        const u0 = Math.max(0, Math.min(1, ((px - ax) * ex + (py - ay) * ey) / (ex * ex + ey * ey || 1)));
        if (Math.hypot(ax + u0 * ex - px, ay + u0 * ey - py) >= best * reach) continue;      // too far away to matter
        // p's close neighbours on a curve stand for the true curve through their end points (their chords cut inside
        // it and would make a round end look tighter than it is): end points only
        if (nearSeg[k]) { const t = Math.min(at(ax, ay), at(ax + ex, ay + ey)); if (t < best) best = t; continue; }
        let lo = 0, hi = 1;                                               // the depth is quasi-convex along a segment: ternary search
        for (let it = 0; it < 16; it++) { const u1 = lo + (hi - lo) / 3, u2 = hi - (hi - lo) / 3; if (at(ax + u1 * ex, ay + u1 * ey) <= at(ax + u2 * ex, ay + u2 * ey)) hi = u2; else lo = u1; }
        const um = (lo + hi) / 2, t = Math.min(at(ax, ay), at(ax + ex, ay + ey), at(ax + um * ex, ay + um * ey));
        if (t < best) best = t;
      }
      return best;
    };
    const limit = (rho) => (rho >= bevel * 1.25 ? bevel : Math.min(bevel, 0.8 * rho));       // keep 80% of the way to the middle
    // The direction an inset moves an outline point: the miter of its two edges (limited at very sharp corners).
    // `own` = how far the moved point then is from its own edges, per unit of inset.
    const miter = (c, i) => {
      const n = c.x.length, p = (i + n - 1) % n, q = (i + 1) % n;
      let e1x = c.x[i] - c.x[p], e1y = c.y[i] - c.y[p], e2x = c.x[q] - c.x[i], e2y = c.y[q] - c.y[i];
      const l1 = Math.hypot(e1x, e1y) || 1, l2 = Math.hypot(e2x, e2y) || 1; e1x /= l1; e1y /= l1; e2x /= l2; e2y /= l2;
      if (!c.corner[i]) return [-c.toy[i], c.tox[i], 1, l2, Math.atan2(e1x * e2y - e1y * e2x, e1x * e2x + e1y * e2y)];   // a smooth point moves along the curve's true normal
      let bx = -e1y - e2y, by = e1x + e2x, L = Math.hypot(bx, by); const dot = e1x * e2x + e1y * e2y;
      if (L < 1e-3) { bx = e2x - e1x; by = e2y - e1y; L = Math.hypot(bx, by) || 1; }
      const cr = e1x * e2y - e1y * e2x, ml = Math.min(cr < 0 ? 2.5 : 60, Math.sqrt(2 / Math.max(1e-6, 1 + dot)));
      return [bx / L * ml, by / L * ml, cr < 0 ? ml : ml * Math.sqrt(Math.max(0, (1 + dot) / 2)), l2, Math.atan2(cr, dot)];
    };
    // Around a narrow place the bevel opens up again gently: flat at first, then no faster than G (a parabola running
    // into a straight line), so the inner edge of the bevel has no kinks.
    const G = 0.4, R = 2 * Math.max(bevel, 1e-6), D0 = G * R, rise = (d) => (d < D0 ? d * d / (2 * R) : G * d - G * G * R / 2), DMAX = (bevel + G * G * R / 2) / G;
    // Working outline: the glyph's points plus, on long straight edges, extra points wherever the bevel has to narrow
    // part-way along (under the notch of a V, beside a nearby stroke).
    // Points close to an outward corner are special: their own inset runs into the corner's miter line before it is
    // complete, and from there they simply follow the corner (`hip` = that corner, `join` = the depth where they meet).
    const KEYS = ['x', 'y', 'tix', 'tiy', 'tox', 'toy', 'corner'], LONG = Math.min(0.06, Math.max(0.02, bevel));
    const base = []; { let k = 0; for (const c of src) { base.push(k); k += c.x.length; } }
    const cons = src.map((c, ci) => {
      const n = c.x.length, o = { x: [], y: [], tix: [], tiy: [], tox: [], toy: [], corner: [], b: [], hip: [], join: [] };
      if (!(bevel > 0)) { for (const k of KEYS) o[k] = c[k].slice(); o.b = new Array(n).fill(0); o.hip = new Array(n).fill(-1); o.join = new Array(n).fill(Infinity); return o; }
      const M = c.x.map((_, i) => miter(c, i)), isHip = M.map((m, i) => !!c.corner[i] && m[4] > 20 * rad);
      // depth at which the inset of point (x, y), moving along (nx, ny), reaches the miter line of corner h
      const meet = (x, y, nx, ny, h) => {
        const mx = M[h][0], my = M[h][1], dx = c.x[h] - x, dy = c.y[h] - y, det = -nx * my + ny * mx; if (Math.abs(det) < 1e-9) return Infinity;
        const r = (-dx * my + dy * mx) / det, l = (nx * dy - ny * dx) / det;
        return r > 0 && l > 0 && Math.abs(r - l) < 0.25 * Math.max(r, l) ? Math.min(r, l) : Infinity;   // both must agree: only true close to the corner
      };
      const nearHip = (i, x, y, nx, ny, skipSelf) => {                    // the outward corner (before or after point i) that this point runs into first
        let best = -1, join = Infinity;
        for (const dir of [1, -1]) {
          let d = 0;
          for (let k = skipSelf ? 1 : 0, j = dir > 0 ? (skipSelf ? i + 1 : i + 1) % n : i; k < n; k++) {
            j = ((dir > 0 ? i + (skipSelf ? k : k + 1) : i - k) % n + n) % n;
            if (c.corner[j] || isHip[j]) { if (isHip[j]) { const r = meet(x, y, nx, ny, j); if (r < join) { join = r; best = j; } } break; }
            d += M[j][3]; if (d > 14 * bevel) break;
          }
        }
        return [best, join];
      };
      const B = new Float64Array(n), H = new Int32Array(n).fill(-1), J = new Float64Array(n).fill(Infinity);
      for (let i = 0; i < n; i++) {
        if (!c.corner[i]) { const h = nearHip(i, c.x[i], c.y[i], M[i][0], M[i][1], true); if (h[1] < bevel) { H[i] = h[0]; J[i] = h[1]; } }
        const near = [];
        if (!c.corner[i]) {
          for (let k = 1; k <= 5; k++) { const j = (i + k) % n; if (c.corner[j]) break; near.push(base[ci] + j); if (c.corner[(j + 1) % n]) break; }
          for (let k = 2; k <= 6; k++) { const j = (i - k + 2 * n) % n; if (c.corner[(j + 1) % n]) break; near.push(base[ci] + j); if (c.corner[j]) break; }
        }
        for (const k of near) nearSeg[k] = 1;
        const rho = contact(c.x[i], c.y[i], M[i][0], M[i][1], M[i][2], base[ci] + i, base[ci] + (i + n - 1) % n);
        for (const k of near) nearSeg[k] = 0;
        B[i] = rho >= 0.97 * J[i] ? bevel : limit(rho);                  // meeting the corner's miter line first is fine: it will follow the corner
      }
      const map = new Int32Array(n);
      for (let i = 0; i < n; i++) {
        map[i] = o.x.length; for (const k of KEYS) o[k].push(c[k][i]); o.b.push(B[i]); o.hip.push(H[i]); o.join.push(J[i]);
        const j = (i + 1) % n, ex = c.x[j] - c.x[i], ey = c.y[j] - c.y[i], L = Math.hypot(ex, ey);
        const cand = [], keep = [], nx = -ey / L, ny = ex / L;
        const probe = (f) => {
          const x = c.x[i] + ex * f, y = c.y[i] + ey * f, ri = isHip[i] ? meet(x, y, nx, ny, i) : Infinity, rj = isHip[j] ? meet(x, y, nx, ny, j) : Infinity, r = Math.min(ri, rj), rho = contact(x, y, nx, ny, 1, base[ci] + i, -1);
          return [f, r < bevel && rho >= 0.97 * r ? bevel : limit(rho), r < bevel ? (ri < rj ? i : j) : -1, r < bevel ? r : Infinity];
        };
        // look inside the edge wherever it is long, or wherever the bevel differs a lot between two samples (halving
        // towards the place where a thin stroke opens into a thick one)
        const scan = (f0, b0, f1, b1) => {
          const len = (f1 - f0) * L; if (!(len > LONG * 1.5 || (Math.abs(b0 - b1) > 0.15 * bevel && len > 0.005))) return;
          const m = probe((f0 + f1) / 2); scan(f0, b0, m[0], m[1]); cand.push(m); scan(m[0], m[1], f1, b1);
        };
        scan(0, B[i], 1, B[j]);
        if (!cand.length) continue;
        // Keep the candidates that matter: work out roughly what the bevel will be along this edge once it has been
        // smoothed (see relax below) and keep the points a straight ramp between its neighbours would miss.
        const pts = [[0, B[i]], ...cand, [1, B[j]]], env = pts.map((p) => { let e = p[1]; for (const q of pts) e = Math.min(e, q[1] + rise(Math.abs(p[0] - q[0]) * L)); return e; });
        const pick = (lo, hi) => {
          let worst = -1, wv = 0.03 * bevel;
          for (let q = lo + 1; q < hi; q++) { const v = Math.abs(env[lo] + (env[hi] - env[lo]) * (pts[q][0] - pts[lo][0]) / (pts[hi][0] - pts[lo][0]) - env[q]); if (v > wv) { wv = v; worst = q; } }
          if (worst < 0) return;
          pick(lo, worst); keep.push(worst - 1); pick(worst, hi);
        };
        pick(0, pts.length - 1);
        for (let guard = 0; guard < cand.length; guard++) {              // and never let a ramp between kept points climb over a dropped point's limit
          const kk = [0, ...keep.map((q) => q + 1).sort((a, b) => a - b), pts.length - 1], e2 = kk.map((a) => { let e = pts[a][1]; for (const q of kk) e = Math.min(e, pts[q][1] + rise(Math.abs(pts[a][0] - pts[q][0]) * L)); return e; });
          let worst = -1, wv = 0.02 * bevel;
          for (let t = 0; t + 1 < kk.length; t++) for (let q = kk[t] + 1; q < kk[t + 1]; q++) { const v = e2[t] + (e2[t + 1] - e2[t]) * (pts[q][0] - pts[kk[t]][0]) / (pts[kk[t + 1]][0] - pts[kk[t]][0]) - pts[q][1]; if (v > wv) { wv = v; worst = q; } }
          if (worst < 0) break;
          keep.push(worst - 1);
        }
        keep.sort((a, b) => a - b);
        for (const q of keep) { const f = cand[q][0]; o.x.push(c.x[i] + ex * f); o.y.push(c.y[i] + ey * f); o.tix.push(ex / L); o.tiy.push(ey / L); o.tox.push(ex / L); o.toy.push(ey / L); o.corner.push(0); o.b.push(cand[q][1]); o.hip.push(cand[q][2]); o.join.push(cand[q][3]); }
      }
      for (let i = 0; i < o.hip.length; i++) if (o.hip[i] >= 0) o.hip[i] = map[o.hip[i]];
      return o;
    });
    const info = cons.map((c) => {
      const n = c.x.length, mx = new Float64Array(n), my = new Float64Array(n), lim = Float64Array.from(c.b), b = Float64Array.from(c.b), len = new Float64Array(n), fx = Float64Array.from(c.x), fy = Float64Array.from(c.y), on = new Uint8Array(n);
      for (let i = 0; i < n; i++) { const m = miter(c, i); mx[i] = m[0]; my[i] = m[1]; len[i] = m[3]; }
      const settle = () => {                                             // who follows a corner, given the corner's bevel
        for (let i = 0; i < n; i++) { const h = c.hip[i]; if (h >= 0 && c.join[i] < b[h] && c.b[i] < b[h]) b[h] = Math.max(c.b[i], c.join[i]); }
        for (let i = 0; i < n; i++) { const h = c.hip[i]; on[i] = h >= 0 && c.join[i] < b[h] ? 1 : 0; }
        for (let h = 0; h < n; h++) if (c.corner[h]) for (const dir of [1, -1]) {      // followers form one unbroken run next to their corner
          let live = true;
          for (let k = 1; k < n; k++) { const i = ((h + dir * k) % n + n) % n; if (c.corner[i]) break; if (c.hip[i] !== h || !on[i]) live = false; if (!live && c.hip[i] === h) on[i] = 0; }
        }
        // the others stop short of the miter line: level with the corner's bevel where that fits, 80% of the way otherwise
        for (let i = 0; i < n; i++) { const h = c.hip[i]; if (h >= 0) b[i] = on[i] ? b[h] : Math.min(b[i], Math.max(0.8 * c.join[i], Math.min(0.97 * c.join[i], b[h]))); }
      };
      const same = (i, q) => (on[i] && (c.hip[i] === q || (on[q] && c.hip[q] === c.hip[i]))) || (on[q] && c.hip[q] === i);
      const place = () => { for (let i = 0; i < n; i++) { const h = on[i] ? c.hip[i] : i; fx[i] = c.x[h] + mx[h] * b[h]; fy[i] = c.y[h] + my[h] * b[h]; } };
      const snap = new Float64Array(n);
      const relax = () => {
        if (!(bevel > 0)) return;
        b.set(lim); settle(); snap.set(b);
        for (let i = 0; i < n; i++) {
          let v = snap[i];
          for (let k = 1, d = 0; k < n; k++) { const j = (i + k) % n; d += len[(j + n - 1) % n]; if (d > DMAX) break; v = Math.min(v, snap[j] + rise(d)); }
          for (let k = 1, d = 0; k < n; k++) { const j = (i - k + n) % n; d += len[j]; if (d > DMAX) break; v = Math.min(v, snap[j] + rise(d)); }
          b[i] = v;
        }
        settle();
        for (let it = 0; it < 12; it++) {                                // no edge may flip over when inset
          let bad = false; place();
          for (let i = 0; i < n; i++) { const q = (i + 1) % n; if (same(i, q)) continue; const ex = c.x[q] - c.x[i], ey = c.y[q] - c.y[i]; if ((fx[q] - fx[i]) * ex + (fy[q] - fy[i]) * ey <= 0.02 * (ex * ex + ey * ey)) { const gi = on[i] ? c.hip[i] : i, gq = on[q] ? c.hip[q] : q; if (!c.corner[gq] || c.corner[gi]) b[gi] *= 0.6; if (!c.corner[gi] || c.corner[gq]) b[gq] *= 0.6; bad = true; } }
          if (!bad) break;
          for (let i = 0; i < n; i++) if (on[i]) b[i] = b[c.hip[i]];
        }
        place();
      };
      relax();
      const pinch = (i) => { const g = on[i] ? c.hip[i] : i; lim[g] = Math.min(lim[g], b[g]) * 0.5; };   // used below when two insets still collide: narrow the bevel just there
      const scale = (k) => { for (let i = 0; i < n; i++) lim[i] *= k; };
      return { mx, my, b, len, fx, fy, on, relax, pinch, scale };
    });
    // safety net: if two inset outlines still cross (strokes a pixel or two wide), narrow the bevel at that spot and
    // try again; as a last resort shrink the whole letter's bevel
    let NV = 0; for (const c of cons) NV += c.x.length;
    const crossing = () => {
      const Q = new Float64Array(4 * NV), id = new Int32Array(3 * NV);
      for (let ci = 0, s = 0; ci < cons.length; ci++) { const f = info[ci], n = f.fx.length; for (let i = 0; i < n; i++, s++) { const j = (i + 1) % n; Q[4 * s] = f.fx[i]; Q[4 * s + 1] = f.fy[i]; Q[4 * s + 2] = f.fx[j]; Q[4 * s + 3] = f.fy[j]; id[3 * s] = ci; id[3 * s + 1] = n; id[3 * s + 2] = i; } }
      const side = (ax, ay, bx, by, px, py) => (bx - ax) * (py - ay) - (by - ay) * (px - ax);
      for (let s = 0; s < NV; s++) {
        for (let r = s + 1; r < NV; r++) {
          if (id[3 * r] === id[3 * s]) { const d = r - s, n = id[3 * s + 1]; if (d === 1 || d === n - 1) continue; }
          const a = 4 * s, c = 4 * r;
          if (Math.max(Q[a], Q[a + 2]) < Math.min(Q[c], Q[c + 2]) || Math.max(Q[c], Q[c + 2]) < Math.min(Q[a], Q[a + 2]) || Math.max(Q[a + 1], Q[a + 3]) < Math.min(Q[c + 1], Q[c + 3]) || Math.max(Q[c + 1], Q[c + 3]) < Math.min(Q[a + 1], Q[a + 3])) continue;
          if (side(Q[a], Q[a + 1], Q[a + 2], Q[a + 3], Q[c], Q[c + 1]) * side(Q[a], Q[a + 1], Q[a + 2], Q[a + 3], Q[c + 2], Q[c + 3]) < 0 && side(Q[c], Q[c + 1], Q[c + 2], Q[c + 3], Q[a], Q[a + 1]) * side(Q[c], Q[c + 1], Q[c + 2], Q[c + 3], Q[a + 2], Q[a + 3]) < 0) return [[id[3 * s], id[3 * s + 2], id[3 * s + 1]], [id[3 * r], id[3 * r + 2], id[3 * r + 1]]];
        }
      }
      return null;
    };
    let shrunk = 0, pinched = 0, hit = null;
    if (bevel > 0) while ((hit = crossing())) {
      if (pinched < 24) { pinched++; for (const [ci, i, n] of hit) { info[ci].pinch(i); info[ci].pinch((i + 1) % n); } for (const ci of new Set(hit.map((h) => h[0]))) info[ci].relax(); continue; }
      if (shrunk >= 9) break;
      shrunk++;
      info.forEach((f) => { f.scale(shrunk < 9 ? 0.7 : 0); f.relax(); });
    }

    const P = [], N = [], UV = [], UM = [], I = [];
    const vert = (x, y, z, nx, ny, nz, u, v, m) => { P.push(x, y, z); N.push(nx, ny, nz); UV.push(u, v); UM.push(m); return UM.length - 1; };
    const quad = (a, b, c, d) => { I.push(a, b, c, a, c, d); };
    const n = bevel > 0 ? segs : 0, capF = [], capB = [];
    cons.forEach((c, ci) => {
      const { mx, my, b, len, on } = info[ci], nv = c.x.length;
      // a column = all vertices above one outline point that share a wall normal: wall bottom and top, then the bevel rings
      const column = (i, tx, ty, u) => {
        const nx = ty, ny = -tx, x = c.x[i], y = c.y[i], bi = b[i], bz = Math.min(bi, hd);
        const col = { wb: vert(x, y, -hd + bz, nx, ny, 0, u, -hd + bz, 0), wt: vert(x, y, hd - bz, nx, ny, 0, u, hd - bz, 0), f: [], k: [] };
        if (!n) return col;
        const ins = [], zz = [], rem = new Array(n + 1).fill(0);
        for (let k = 0; k <= n; k++) { const a = k / n * Math.PI / 2; ins.push(bi * (1 - Math.cos(a))); zz.push(bz * Math.sin(a)); }
        for (let k = n - 1; k >= 0; k--) rem[k] = rem[k + 1] + Math.hypot(ins[k + 1] - ins[k], zz[k + 1] - zz[k]);
        const h = on[i] ? c.hip[i] : i, ex = c.x[h] + mx[h] * bi, ey = c.y[h] + my[h] * bi;
        for (let k = 0; k <= n; k++) {
          const g = h !== i && ins[k] >= c.join[i] ? h : i;                // past the join depth this point rides on its corner's miter line
          const a = k / n * Math.PI / 2, ca = k === n ? 0 : Math.cos(a), sa = Math.sin(a), px = c.x[g] + mx[g] * ins[k], py = c.y[g] + my[g] * ins[k], u2 = ex + nx * rem[k], v2 = ey + ny * rem[k];   // uv: the bevel unrolled outwards from the face
          col.f.push(vert(px, py, hd - bz + zz[k], nx * ca, ny * ca, sa, u2, v2, 1));
          col.k.push(vert(px, py, -hd + bz - zz[k], nx * ca, ny * ca, -sa, u2, v2, 1));
        }
        return col;
      };
      const outCol = new Array(nv), inCol = new Array(nv); let u = 0;
      for (let i = 0; i < nv; i++) {
        const split = c.corner[i] || c.tix[i] * c.tox[i] + c.tiy[i] * c.toy[i] < 0.9998;
        if (i === 0) outCol[0] = column(0, c.tox[0], c.toy[0], 0);
        else if (split) { inCol[i] = column(i, c.tix[i], c.tiy[i], u); outCol[i] = column(i, c.tox[i], c.toy[i], u); }
        else inCol[i] = outCol[i] = column(i, c.tox[i], c.toy[i], u);
        u += len[i];
      }
      inCol[0] = column(0, c.tix[0], c.tiy[0], u);                       // the seam: the first point again, at the end of the wall's u
      for (let i = 0; i < nv; i++) {
        const A = outCol[i], B = inCol[(i + 1) % nv];
        quad(A.wb, B.wb, B.wt, A.wt);
        for (let k = 0; k < n; k++) { quad(A.f[k], B.f[k], B.f[k + 1], A.f[k + 1]); quad(A.k[k + 1], B.k[k + 1], B.k[k], A.k[k]); }
      }
      const f = [], k = [];
      for (let i = 0; i < nv; i++) { if (n) { f.push(outCol[i].f[n]); k.push(outCol[i].k[n]); } else { f.push(vert(c.x[i], c.y[i], hd, 0, 0, 1, c.x[i], c.y[i], 1)); k.push(vert(c.x[i], c.y[i], -hd, 0, 0, -1, c.x[i], c.y[i], 1)); } }
      capF.push(f); capB.push(k);
    });
    // faces: triangulate each shape (with its holes) on the inset outline
    let capErr = 0;
    for (const sh of g.shapes) {
      const list = [sh.outer, ...sh.holes], F = [], Bk = [], rings = []; let want = 0, got = 0;
      for (const c of list) {                                           // points that share a position (corner followers) go in once
        const ci = src.indexOf(c), f = info[ci], m = f.fx.length, r = [], ids = [];
        for (let i = 0; i < m; i++) { const l = r[r.length - 1]; if (l && Math.abs(l.x - f.fx[i]) < 1e-9 && Math.abs(l.y - f.fy[i]) < 1e-9) continue; r.push(new THREE.Vector2(f.fx[i], f.fy[i])); ids.push(i); }
        while (r.length > 1 && Math.abs(r[0].x - r[r.length - 1].x) < 1e-9 && Math.abs(r[0].y - r[r.length - 1].y) < 1e-9) { r.pop(); ids.pop(); }
        for (let i = 0, q = r.length; i < q; i++) { const j = (i + 1) % q; want += (r[i].x * r[j].y - r[j].x * r[i].y) / 2; }
        if (r.length < 3 && c !== sh.outer) continue;
        rings.push(r); for (const i of ids) { F.push(capF[ci][i]); Bk.push(capB[ci][i]); }
      }
      if (rings[0].length < 3) continue;
      const all = [].concat(...rings), faces = THREE.ShapeUtils.triangulateShape(rings[0].slice(), rings.slice(1).map((r) => r.slice()));
      for (const [a, b, c] of faces) {
        const ar = (all[b].x - all[a].x) * (all[c].y - all[a].y) - (all[b].y - all[a].y) * (all[c].x - all[a].x);
        if (ar === 0) continue; got += Math.abs(ar) / 2;
        if (ar > 0) { I.push(F[a], F[b], F[c], Bk[a], Bk[c], Bk[b]); } else { I.push(F[a], F[c], F[b], Bk[a], Bk[b], Bk[c]); }
      }
      capErr = Math.max(capErr, Math.abs(got - want) / Math.max(1e-9, Math.abs(want)));
    }
    out = { pos: new Float32Array(P), nrm: new Float32Array(N), uv: new Float32Array(UV), um: new Uint8Array(UM), idx: new Uint32Array(I), nv: UM.length, capErr, shrunk, pinched };
    if (K.text3d.keepInset) out.inset = cons.map((c, ci) => ({ x: c.x, y: c.y, corner: c.corner, hip: c.hip, fx: info[ci].fx, fy: info[ci].fy, b: info[ci].b, on: info[ci].on }));
    solids.set(key, out);
    return out;
  }

  // ---------------------------------------------------------------- 5. geometry (merged by hand)
  function assemble(parts, size, bounds) {
    let nv = 0, ni = 0; for (const p of parts) { nv += p.solid.nv; ni += p.solid.idx.length; }
    const pos = new Float32Array(nv * 3), nrm = new Float32Array(nv * 3), uv = new Float32Array(nv * 2), uv1 = new Float32Array(nv * 2), idx = new Uint32Array(ni);
    const bw = Math.max(1e-9, bounds.maxX - bounds.minX), bh = Math.max(1e-9, bounds.maxY - bounds.minY);
    let v0 = 0, i0 = 0;
    for (const p of parts) {
      const s = p.solid;
      for (let k = 0; k < s.nv; k++) {
        const x = s.pos[3 * k] * size, y = s.pos[3 * k + 1] * size, v = v0 + k;
        pos[3 * v] = x + p.dx; pos[3 * v + 1] = y + p.dy; pos[3 * v + 2] = s.pos[3 * k + 2] * size;
        uv[2 * v] = s.uv[2 * k] + s.um[k] * p.ox / size; uv[2 * v + 1] = s.uv[2 * k + 1] + s.um[k] * p.oy / size;
        uv1[2 * v] = (x + p.ox - bounds.minX) / bw; uv1[2 * v + 1] = (y + p.oy - bounds.minY) / bh;
      }
      nrm.set(s.nrm, v0 * 3);
      for (let k = 0; k < s.idx.length; k++) idx[i0 + k] = s.idx[k] + v0;
      p.start = i0; p.count = s.idx.length; v0 += s.nv; i0 += s.idx.length;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.setAttribute('uv1', new THREE.BufferAttribute(uv1, 2));
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    geo.computeBoundingBox(); geo.computeBoundingSphere();
    return geo;
  }
  const solidOf = (g, o, size) => {
    const depth = Math.max(1e-4, (o.depth == null ? 0.2 * size : o.depth) / size), bevel = Math.max(0, (o.bevel == null ? 0.02 * size : o.bevel) / size);
    return buildSolid(g, depth, bevel, bevel > 0 ? Math.round(clampN(o.bevelSegments == null ? 3 : o.bevelSegments, 1, 16)) : 0);
  };

  // K.text3d(text, { ...textShapes options, depth, bevel, bevelSegments }) -> BufferGeometry of the whole text, centred
  // in z. uv: 1 unit = 1 em (faces and bevels planar, walls = distance along the outline x depth); uv1: 0..1 across the
  // text's bounding box. geometry.userData = { width, height, bounds, letters: [{ char, index, line, x, y, w, start, count }] }.
  K.text3d = (text, opts = {}) => {
    const L = layout(text, opts), parts = [], meta = [];
    for (const l of L.letters) if (l.glyph && l.glyph.shapes.length) { const p = { solid: solidOf(l.glyph, opts, L.size), ox: l.x, oy: l.y, dx: l.x, dy: l.y }; parts.push(p); meta.push([l, p]); }
    const geo = assemble(parts, L.size, L.bounds);
    geo.userData = { width: L.width, height: L.height, bounds: L.bounds, letters: meta.map(([l, p]) => ({ char: l.char, index: l.index, line: l.line, x: l.x, y: l.y, w: l.w, start: p.start, count: p.count })) };
    return geo;
  };
  // K.text3dLetters(text, opts) -> [{ char, index, line, geometry, x, y, w }]: one geometry per visible letter with its
  // origin at the centre of the letter's own bounding box; (x, y) is where that centre sits in the block.
  K.text3dLetters = (text, opts = {}) => {
    const L = layout(text, opts), out = [];
    for (const l of L.letters) if (l.glyph && l.glyph.shapes.length) {
      const bb = l.glyph.bbox, cx = (bb[0] + bb[2]) / 2 * L.size, cy = (bb[1] + bb[3]) / 2 * L.size;
      out.push({ char: l.char, index: l.index, line: l.line, geometry: assemble([{ solid: solidOf(l.glyph, opts, L.size), ox: l.x, oy: l.y, dx: -cx, dy: -cy }], L.size, L.bounds), x: l.x + cx, y: l.y + cy, w: l.w });
    }
    return out;
  };
  // for tests: K.text3d.debug(font, char, detail, curveSegments) -> { glyph, dense } without touching the caches
  K.text3d.debug = (font, ch, detail = 320, cs = 48) => { DBG = []; let g; try { g = getGlyph(font, fontPx(font), ch, detail, cs); } finally { var d = DBG; DBG = null; } return { glyph: g, dense: d }; };
  K.text3d.solid = (font, ch, o = {}) => { const g = getGlyph(font, fontPx(font), ch, o.detail || 320, o.curveSegments || 48); return { glyph: g, solid: solidOf(g, o, 1) }; };
  K.text3d.clearCache = () => { glyphs.clear(); solids.clear(); };
})(typeof window !== 'undefined' ? window : globalThis);
```

REFERENCE STYLE SOURCE (styles/monument-type.js; its sample topic was "Done beats perfect")
```js
{
  // ---------------------------------------------------------------- content (change this for a new phrase)
  // Words in reading order. The first word stands on the highest terrace at the back and the last one at the front by
  // the water, so from the hold position the phrase reads top to bottom. The first word also gets the opening shot and
  // the last of the sun, so phrase it with the point first when you can.
  const WORDS = [
    { text: 'DONE', hero: true },            // hero: weathered steel instead of concrete, the one warm thing in the set
    { text: 'BEATS', width: 0.56 },          // width = the share of the block's width this word takes at the hold (default 1)
    { text: 'PERFECT', unfinished: true },   // unfinished: its last letter is still in formwork, with scaffold and a crane
  ];
  const FONT = '400 200px "Archivo Black"';  // a heavy, wide face: every letter is a slab that can stand as a building
  const SPACING = 0.05;                      // extra letter spacing in em: room to walk between the letters

  // ---------------------------------------------------------------- the set is laid out FROM the hold camera
  // Scale: 1 unit is about 4 m, a person is 0.45 tall. Every word is sized so that it has the same width on screen at
  // the hold (far words are really much bigger), and every terrace is just high enough that the word on it clears the
  // top of the word in front. Change HOLD or the words and the whole monument re-plans itself.
  const HOLD = { pos: [0, 2.2, 44.5], aim: [0, 8.5, -10], fov: 31 };   // low over the water, looking up: the reading position
  const FRONT_WIDTH = 30;     // world width of the front word
  const WALK = 5.2;           // terrace in front of each word, where people walk
  const BACK = 0.9;           // space between the back of a word and the wall of the next terrace
  const PLINTH = 0.5;         // height of the lowest terrace
  const GAP = 0.55;           // strip of terrace wall that stays visible between two words at the hold
  const PERSON = 0.45;
  function layout(K) {
    const H = HOLD.pos[1], d = (z) => HOLD.pos[2] - z, rows = [];
    for (let i = WORDS.length - 1; i >= 0; i--) {                       // front to back
      const w = WORDS[i], prev = rows[0];                                // prev = the word in front of this one
      const b = K.textShapes(w.text, { font: FONT, size: 1, letterSpacing: SPACING }).bounds, emW = b.maxX - b.minX, emH = b.maxY - b.minY;
      const z = prev ? prev.z - prev.depth - BACK - WALK : 0;            // z of the letters' front faces
      const width = FRONT_WIDTH * (w.width || 1) * d(z) / d(0), size = width / emW, cap = emH * size, depth = Math.min(3.4, cap * 0.44);
      let base = PLINTH;
      if (prev) { const top = prev.base + prev.cap; base = H - (H - top) * d(z) / (d(prev.z) + (H > top ? prev.depth : 0)) + GAP; }
      const edge = prev ? prev.z - prev.depth - BACK : 4.6;             // z of the front wall of the terrace it stands on
      rows.unshift({ ...w, share: w.width || 1, z, width, size, cap, depth, base, edge, tierW: (FRONT_WIDTH + 7) * d(edge) / d(0) });
    }
    return rows;
  }

  // ---------------------------------------------------------------- generated surfaces
  // Everything big is textured in world space (see surface()), so one 4 x 4 unit tile covers letters of any size and
  // the marks keep their real size: a board is 25 cm, a pour is 4 m, a tie hole is a hand wide. That is what makes
  // the letters read as huge.
  const TILE = 4, TN = 2048;
  const around = (ctx, x, y, r, fn) => { for (const dx of [-TN, 0, TN]) for (const dy of [-TN, 0, TN]) if (x + dx > -r && x + dx < TN + r && y + dy > -r && y + dy < TN + r) { ctx.save(); ctx.translate(dx, dy); fn(); ctx.restore(); } };

  // board-marked concrete: planks of the formwork printed into the wall, a joint at every pour, rows of tie holes
  function concreteTex(K) {
    const r = K.rng(7), LIFTS = 4, BOARDS = 16, bh = TN / (LIFTS * BOARDS);
    const hgt = K.canvasTex(TN, TN, null, { data: true, repeat: [1, 1] }), h = hgt.ctx;
    const alb = K.canvasTex(TN, TN, (c) => {
      c.fillStyle = '#b3afa6'; c.fillRect(0, 0, TN, TN); h.fillStyle = 'rgb(128,128,128)'; h.fillRect(0, 0, TN, TN);
      for (let b = 0; b < LIFTS * BOARDS; b++) {
        let x = r.range(0, 700); const x0 = x, y = b * bh;
        while (x < x0 + TN) {
          const w = Math.min(r.range(420, 1150), x0 + TN - x), tone = r.range(-1, 1), level = r.range(-1, 1);
          for (const dx of [0, -TN]) {
            const v = 176 + tone * 13; c.fillStyle = `rgb(${v + 3 | 0},${v | 0},${v - 6 | 0})`; c.fillRect(x + dx, y, w, bh);
            const l = 128 + level * 16 | 0; h.fillStyle = `rgb(${l},${l},${l})`; h.fillRect(x + dx, y, w, bh);
            c.fillStyle = 'rgba(46,43,40,0.55)'; c.fillRect(x + dx - 1, y, 2, bh); h.fillStyle = 'rgb(70,70,70)'; h.fillRect(x + dx - 1.5, y, 3, bh);   // butt joint
          }
          for (let k = 0; k < 6; k++) {                                   // wood grain, printed into the face
            const gy = y + r.range(3, bh - 3), amp = r.range(0.5, 2.5), ph = r.range(0, 9), dark = r.chance(0.6), al = r.range(0.05, 0.16);
            for (const dx of [0, -TN]) for (const cx of [c, h]) {
              cx.strokeStyle = cx === c ? (dark ? `rgba(60,56,52,${al})` : `rgba(240,236,228,${al})`) : (dark ? 'rgba(96,96,96,0.8)' : 'rgba(156,156,156,0.8)');
              cx.lineWidth = cx === c ? 1.2 : 1.6; cx.beginPath();
              for (let px = 0; px <= w; px += 24) cx[px ? 'lineTo' : 'moveTo'](x + dx + px, gy + Math.sin(px * 0.012 + ph) * amp);
              cx.stroke();
            }
          }
          x += w;
        }
        c.fillStyle = 'rgba(52,49,45,0.5)'; c.fillRect(0, y - 0.9, TN, 1.8); h.fillStyle = 'rgb(64,64,64)'; h.fillRect(0, y - 1.2, TN, 2.4);            // joint between two boards
      }
      for (let i = 0; i < 520; i++) {                                     // cloudy patches from the pour
        const x = r.range(0, TN), y = r.range(0, TN), rad = r.range(30, 150), dark = r.chance(0.55);
        around(c, x, y, rad, () => { const g = c.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, dark ? 'rgba(70,66,62,0.10)' : 'rgba(250,246,238,0.09)'); g.addColorStop(1, 'rgba(128,128,128,0)'); c.fillStyle = g; c.fillRect(x - rad, y - rad, rad * 2, rad * 2); });
      }
      for (let L = 0; L < LIFTS; L++) {
        const y = L * TN / LIFTS;
        for (const dy of [0, TN]) {                                       // the pour joint: a dark groove with a pale lip of leaked cement under it
          c.fillStyle = 'rgba(40,37,34,0.62)'; c.fillRect(0, y + dy - 3, TN, 6); h.fillStyle = 'rgb(30,30,30)'; h.fillRect(0, y + dy - 4, TN, 8);
          for (let x = 0; x < TN; x += 16) { c.fillStyle = `rgba(238,234,226,${r.range(0.05, 0.3)})`; c.fillRect(x, y + dy + 3, 16, r.range(3, 16)); }
        }
        for (const ry of [0.25, 0.75]) for (let k = 0; k < 6; k++) {      // tie holes, on a strict grid
          const x = (k + 0.5) * TN / 6, hy = y + ry * TN / LIFTS;
          if (r.chance(0.45)) { const len = r.range(70, 300), g = c.createLinearGradient(0, hy, 0, hy + len); g.addColorStop(0, 'rgba(120,84,56,0.26)'); g.addColorStop(1, 'rgba(120,84,56,0)'); c.fillStyle = g; c.fillRect(x - 5, hy, 10, len); }
          let g = c.createRadialGradient(x, hy, 0, x, hy, 12); g.addColorStop(0, 'rgba(28,26,24,0.95)'); g.addColorStop(0.62, 'rgba(34,32,30,0.9)'); g.addColorStop(0.8, 'rgba(225,221,212,0.35)'); g.addColorStop(1, 'rgba(180,176,168,0)');
          c.fillStyle = g; c.beginPath(); c.arc(x, hy, 12, 0, 7); c.fill();
          g = h.createRadialGradient(x, hy, 0, x, hy, 11); g.addColorStop(0, 'rgb(0,0,0)'); g.addColorStop(0.6, 'rgb(10,10,10)'); g.addColorStop(1, 'rgba(128,128,128,0)');
          h.fillStyle = g; h.beginPath(); h.arc(x, hy, 11, 0, 7); h.fill();
        }
      }
      for (let i = 0; i < 3600; i++) {                                    // bug holes: air bubbles against the formwork
        const x = r.range(0, TN), y = r.range(0, TN), rad = r.range(0.6, 2.6) * (r.chance(0.04) ? 2.2 : 1), a = r.range(0.25, 0.7);
        c.fillStyle = `rgba(48,45,42,${a})`; c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill(); h.fillStyle = `rgba(20,20,20,${a})`; h.beginPath(); h.arc(x, y, rad + 0.5, 0, 7); h.fill();
      }
    }, { repeat: [1, 1] });
    hgt.needsUpdate = true;
    return { alb, hgt };
  }

  // weathered steel: tall welded plates under a velvet rust skin, with runs of brighter and darker rust
  function steelTex(K) {
    const r = K.rng(21), ROWS = 2, ph = TN / ROWS, pw = TN / 3;
    const hgt = K.canvasTex(TN, TN, null, { data: true, repeat: [1, 1] }), h = hgt.ctx;
    const alb = K.canvasTex(TN, TN, (c) => {
      c.fillStyle = '#73391f'; c.fillRect(0, 0, TN, TN); h.fillStyle = 'rgb(128,128,128)'; h.fillRect(0, 0, TN, TN);
      const tones = ['140,74,36', '98,46,24', '164,92,44', '80,38,22', '182,106,54', '116,58,32'];
      for (let i = 0; i < 2600; i++) {                                    // blooms of rust
        const x = r.range(0, TN), y = r.range(0, TN), rad = r.range(8, 110), col = r.pick(tones), a = r.range(0.05, 0.2);
        around(c, x, y, rad, () => { const g = c.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); c.fillStyle = g; c.fillRect(x - rad, y - rad, rad * 2, rad * 2); });
      }
      for (let i = 0; i < 520; i++) {                                     // rain runs
        const x = r.range(0, TN), y = r.range(0, TN), len = r.range(200, 1100), w = r.range(2, 14), light = r.chance(0.55), a = r.range(0.05, 0.17);
        around(c, x, y + len / 2, len, () => { const g = c.createLinearGradient(0, y, 0, y + len); const col = light ? '208,128,62' : '54,24,14'; g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(0.12, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); c.fillStyle = g; c.fillRect(x - w / 2, y, w, len); });
      }
      for (let i = 0; i < 26000; i++) {                                   // grain of the rust
        const x = r.range(0, TN), y = r.range(0, TN), s = r.range(0.8, 2.6), dark = r.chance(0.5), a = r.range(0.08, 0.3);
        c.fillStyle = dark ? `rgba(52,24,14,${a})` : `rgba(206,134,72,${a})`; c.fillRect(x, y, s, s);
        h.fillStyle = dark ? `rgba(84,84,84,${a * 2})` : `rgba(170,170,170,${a * 2})`; h.fillRect(x, y, s + 1, s + 1);
      }
      for (let j = 0; j < ROWS; j++) {                                    // seams: a hairline with a weld bead beside it
        const y = j * ph, off = (j % 2) * pw / 2;
        for (const dy of [0, TN]) { c.fillStyle = 'rgba(30,13,8,0.7)'; c.fillRect(0, y + dy - 1.5, TN, 3); c.fillStyle = 'rgba(200,124,68,0.35)'; c.fillRect(0, y + dy - 3.5, TN, 2); h.fillStyle = 'rgb(40,40,40)'; h.fillRect(0, y + dy - 2, TN, 4); h.fillStyle = 'rgb(176,176,176)'; h.fillRect(0, y + dy - 5, TN, 3); }
        for (let k = 0; k < 4; k++) { const x = (off + k * pw) % TN; c.fillStyle = 'rgba(30,13,8,0.65)'; c.fillRect(x - 1.5, y, 3, ph); c.fillStyle = 'rgba(200,124,68,0.3)'; c.fillRect(x + 1.5, y, 2, ph); h.fillStyle = 'rgb(40,40,40)'; h.fillRect(x - 2, y, 4, ph); h.fillStyle = 'rgb(170,170,170)'; h.fillRect(x + 2, y, 3, ph); }
      }
    }, { repeat: [1, 1] });
    hgt.needsUpdate = true;
    return { alb, hgt };
  }

  // three channels of soft tiling noise for the big stains (drawn once, sampled at several scales in the shader)
  function noiseTex(K) {
    const N = 256;
    return K.canvasTex(N, N, (c) => {
      const img = c.createImageData(N, N), ch = [];
      for (let k = 0; k < 3; k++) {
        const f = new Float32Array(N * N); let amp = 0.5;
        for (const p of [4, 8, 16, 32, 64]) {
          const r = K.rng(100 + k * 10 + p), lat = Float32Array.from({ length: p * p }, () => r()), g = (i, j) => lat[(j % p) * p + (i % p)];
          for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
            const u = x / N * p, v = y / N * p, i = Math.floor(u), j = Math.floor(v), fx = u - i, fy = v - j, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
            f[y * N + x] += amp * (K.lerp(K.lerp(g(i, j), g(i + 1, j), sx), K.lerp(g(i, j + 1), g(i + 1, j + 1), sx), sy));
          }
          amp *= 0.5;
        }
        ch.push(f);
      }
      for (let i = 0; i < N * N; i++) { for (let k = 0; k < 3; k++) img.data[4 * i + k] = K.clamp((ch[k][i] / 0.97 - 0.5) * 1.7 + 0.5) * 255; img.data[4 * i + 3] = 255; }
      c.putImageData(img, 0, 0);
    }, { data: true, repeat: [1, 1] });
  }

  // the lake bed: pale salt crust in polygons, seen through a film of water
  function saltTex(K, repeat) {
    const N = 1024, CELLS = 11;
    return K.canvasTex(N, N, (c) => {
      const r = K.rng(3), pts = Float32Array.from({ length: CELLS * CELLS * 2 }, () => r()), img = c.createImageData(N, N), nz = K.noise(5);
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const u = x / N * CELLS, v = y / N * CELLS, ci = Math.floor(u), cj = Math.floor(v); let f1 = 9, f2 = 9;
        for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
          const k = (((cj + dj) % CELLS + CELLS) % CELLS * CELLS + ((ci + di) % CELLS + CELLS) % CELLS) * 2, px = ci + di + 0.15 + 0.7 * pts[k], py = cj + dj + 0.15 + 0.7 * pts[k + 1], dd = Math.hypot(u - px, v - py);
          if (dd < f1) { f2 = f1; f1 = dd; } else if (dd < f2) f2 = dd;
        }
        const ridge = 1 - K.smooth(0.0, 0.07, f2 - f1), a = x / N * Math.PI * 2, b = y / N * Math.PI * 2;
        const cloud = nz.fbm(Math.cos(a) * 1.3, Math.sin(a) * 1.3, Math.cos(b) * 1.3 + Math.sin(b) * 2.1, 4);   // tiles, because it is sampled around two circles
        const g = 0.74 + 0.16 * cloud + 0.14 * ridge - 0.05 * K.smooth(0.07, 0.3, f2 - f1) * 0;
        img.data[4 * (y * N + x)] = K.clamp(g * 1.0) * 255; img.data[4 * (y * N + x) + 1] = K.clamp(g * 0.955) * 255; img.data[4 * (y * N + x) + 2] = K.clamp(g * 0.89) * 255; img.data[4 * (y * N + x) + 3] = 255;
      }
      c.putImageData(img, 0, 0);
    }, { repeat });
  }

  // stone paving for the terrace tops: long slabs in a running bond
  function paveTex(K) {
    const N = 1024, r = K.rng(31), RW = 8, sh = N / RW, sw = N / 4;
    return K.canvasTex(N, N, (c) => {
      c.fillStyle = '#3d3a37'; c.fillRect(0, 0, N, N);
      for (let j = 0; j < RW; j++) for (let i = -1; i < 4; i++) {
        const x = i * sw + (j % 2) * sw / 2, y = j * sh, v = 132 + r.range(-16, 16);
        c.fillStyle = `rgb(${v + 4 | 0},${v | 0},${v - 6 | 0})`; c.fillRect(x + 2.5, y + 2.5, sw - 5, sh - 5);
      }
      for (let i = 0; i < 5000; i++) { c.fillStyle = r.chance(0.5) ? `rgba(40,38,35,${r.range(0.05, 0.25)})` : `rgba(235,230,220,${r.range(0.04, 0.18)})`; c.fillRect(r.range(0, N), r.range(0, N), r.range(1, 3), r.range(1, 3)); }
      for (let i = 0; i < 90; i++) { const x = r.range(0, N), y = r.range(0, N), rad = r.range(30, 140), g = c.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, 'rgba(50,46,42,0.2)'); g.addColorStop(1, 'rgba(50,46,42,0)'); c.fillStyle = g; c.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
    }, { repeat: [1, 1] });
  }

  // A material textured in WORLD space, so it needs no UVs and never stretches: the tile is projected from the front,
  // the side and the top and blended by the normal (walls share the vertical axis, so boards and seams run level
  // around every corner and curve). On top of the tile come the stains no tile can give: big blotches, rain streaks
  // that start at the top edge, a damp dark foot, a different shade for every pour. The bump is real relief worked out
  // from the height tile, so raking sun picks out every joint.
  function surface(THREE, tex, noise, o) {
    const m = new THREE.MeshStandardMaterial({ color: o.color || '#ffffff', roughness: o.roughness == null ? 0.9 : o.roughness, metalness: o.metalness || 0 });
    const U = { uAlb: { value: tex.alb }, uHgt: { value: tex.hgt }, uNz: { value: noise }, uTile: { value: TILE }, uBump: { value: o.bump == null ? 0.012 : o.bump },
      uBase: { value: o.base || 0 }, uTop: { value: o.top || 10 }, uStreak: { value: new THREE.Color(o.streak || '#6a6661') }, uStain: { value: o.stain == null ? 1 : o.stain },
      uPour: { value: o.pour == null ? 0.1 : o.pour }, uGrime: { value: o.grime == null ? 0.25 : o.grime }, uPlyY: { value: o.plyY == null ? 1e6 : o.plyY }, uPly: { value: new THREE.Color(o.ply || '#c4a06a') } };
    m.userData.u = U;
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vWPos; varying vec3 vWNrm;')
        .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvWNrm = normalize(mat3(modelMatrix) * objectNormal);')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\n#ifdef USE_INSTANCING\nvWPos = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;\n#else\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\n#endif');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
          varying vec3 vWPos; varying vec3 vWNrm;
          uniform sampler2D uAlb, uHgt, uNz; uniform float uTile, uBump, uBase, uTop, uStain, uPour, uGrime, uPlyY; uniform vec3 uStreak, uPly;
          vec3 triW; vec2 uvF, uvS, uvT; float damp;`)
        .replace('#include <map_fragment>', `
          vec3 wn = normalize(vWNrm);
          triW = pow(abs(wn), vec3(8.0)); triW /= triW.x + triW.y + triW.z;
          uvF = vWPos.xy / uTile; uvS = vWPos.zy / uTile + vec2(0.31, 0.0); uvT = vWPos.xz / uTile + vec2(0.17, 0.43);
          vec3 alb = texture2D(uAlb, uvF).rgb * triW.z + texture2D(uAlb, uvS).rgb * triW.x + texture2D(uAlb, uvT).rgb * triW.y;
          float wall = 1.0 - triW.y, along = vWPos.x * 0.92 + vWPos.z * 0.71;
          vec3 big = texture2D(uNz, vec2(along, vWPos.y) / 14.0).rgb;
          float up = clamp((vWPos.y - uBase) / max(uTop - uBase, 0.01), 0.0, 1.0);
          float run = texture2D(uNz, vec2(along * 0.33, vWPos.y * 0.012 + 0.3)).g * 0.6 + texture2D(uNz, vec2(along * 1.1, vWPos.y * 0.03)).r * 0.4;
          float streak = smoothstep(0.50, 0.72, run) * (0.15 + 0.85 * up * up) * wall;
          damp = (1.0 - smoothstep(0.0, 0.5 + big.b * 1.6, vWPos.y - uBase)) * wall;
          float pour = fract(sin(floor(vWPos.y / (uTile * 0.25)) * 12.9898) * 43758.5453) - 0.5;
          alb *= mix(0.78, 1.14, big.r) * (1.0 + uPour * pour * wall);
          alb = mix(alb, alb * uStreak * 2.0, uStain * 0.75 * streak);
          alb *= 1.0 - uGrime * wall * smoothstep(0.35, 0.75, texture2D(uNz, vec2(along * 0.19, vWPos.y * 0.035 + 0.6)).b) * (0.4 + 0.6 * up);
          alb *= 1.0 - uStain * 0.42 * damp;
          float ply = step(uPlyY, vWPos.y);
          alb = mix(alb, uPly * (0.55 + 0.75 * dot(alb, vec3(0.34))), ply);
          diffuseColor.rgb *= alb;`)
        .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor - 0.3 * damp * uStain, 0.25, 1.0);')
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
          {
            float e = 1.5 / ${TN}.0;
            float f0 = texture2D(uHgt, uvF).r, s0 = texture2D(uHgt, uvS).r, t0 = texture2D(uHgt, uvT).r;
            vec3 g = triW.z * vec3(texture2D(uHgt, uvF + vec2(e, 0.0)).r - f0, texture2D(uHgt, uvF + vec2(0.0, e)).r - f0, 0.0)
                   + triW.x * vec3(0.0, texture2D(uHgt, uvS + vec2(0.0, e)).r - s0, texture2D(uHgt, uvS + vec2(e, 0.0)).r - s0)
                   + triW.y * vec3(texture2D(uHgt, uvT + vec2(e, 0.0)).r - t0, 0.0, texture2D(uHgt, uvT + vec2(0.0, e)).r - t0);
            g *= uBump / (e * uTile);
            vec3 n0 = normalize(vWNrm), nW = normalize(n0 - (g - dot(g, n0) * n0));
            normal = normalize((viewMatrix * vec4(nW, 0.0)).xyz);
          }`);
    };
    return m;
  }

  // ---------------------------------------------------------------- timing (shared by picture and sound)
  const T = { leave: 1.8, hold: 6.3, end: 9.0 };   // drift along the hero letters until `leave`, arrive at the reading position at `hold`

  registerStyle({
    id: 'monument-type',
    name: 'Monument Type',
    family: 'Spaces and journeys',
    look: 'Words as architecture: a short phrase stands as colossal letters on the terraces of a dark concrete monument in a flooded salt flat at sunset. One word is weathered steel and keeps the last sun; tiny people, lamps, birds and a crane give the scale.',
    motion: 'The words never move. The camera starts at eye height against one giant letter, slides off the terrace as it turns to face the words, and sinks back over the water until the terraces close up into one block that reads top to bottom. Then the evening shadow climbs the monument and leaves only the hero word in the sun.',
    light: 'One low sun from the front left rakes every face, picks out board marks and seams and throws long shadows; the cool sky is the only fill, so shade goes blue. At the end a far ridge shades the monument from the bottom up while lamps and windows come on.',
    materials: 'Board-marked concrete with pour joints, tie holes and rain streaks; rusted steel plates with welded seams for the hero word; wet stone paving; plywood formwork and scaffold tubes on the unfinished letter; pale salt under a film of water that mirrors everything.',
    camera: 'One continuous drone move with deep focus (shallow focus would turn the monument into a model): a wide lens at eye height for the start, a longer lens low over the water, looking up, for the hold.',
    post: 'Filmic contrast, a little bloom on the sun and the lamps, soft vignette, fine grain, a short shutter. No depth of field.',
    explains: 'A short statement of two to five words where one word is the point: a principle, a motto, a verdict, a title. The hero word gets the top terrace, its own material and the last light; a word can be marked unfinished to put it under scaffolding.',
    topic: 'Done beats perfect',
    duration: T.end,
    fonts: [FONT],
    render: { samples: 48, shutter: 0.35, tone: 'filmic', exposure: 0.95, contrast: 1.06, saturation: 1.06, bloom: 0.3, bloomThreshold: 1.2, vignette: 0.32, grain: 0.03, fov: 33, near: 0.1, far: 2600, background: '#d8b8a2' },

    build(S) {
      const { THREE, K, scene, camera } = S;
      const rows = layout(K), top = rows[0], front = rows[rows.length - 1];
      const SUN = new THREE.Vector3(-0.85, 0.2, 0.48).normalize();          // low, front left: it rakes across every face
      const SHADOW = { len: 1 / Math.tan(Math.asin(SUN.y)), ry: Math.atan2(-SUN.z, SUN.x) + Math.PI };   // shadow length per unit of height, and its heading on the ground
      const fogColor = new THREE.Color('#d9b39a'), fogDay = fogColor.clone(), fogEve = new THREE.Color('#a9959f');
      scene.fog = new THREE.FogExp2(fogColor, 0.0068);

      // ---- sky, sun and distance
      K.env(S, { top: '#35609f', horizon: '#aeaac6', bottom: '#5a6274', intensity: 1.7 });      // the fill is the cool sky: shadows go blue, the sun stays the only warm light
      const sun = K.sun(S, { pos: [SUN.x * 170, 6 + SUN.y * 170, -8 + SUN.z * 170], target: [0, 6, -8], color: '#ffbf85', power: 11.5, size: 58, soft: 1.5, mapSize: 4096, far: 420, normalBias: 0.05 });
      const sky = new THREE.Mesh(new THREE.SphereGeometry(1300, 48, 24), new THREE.ShaderMaterial({
        side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { uSun: { value: SUN }, uFog: { value: fogColor }, uEve: { value: 0 } },
        vertexShader: 'varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader: `varying vec3 vD; uniform vec3 uSun, uFog; uniform float uEve;
          float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
          float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
          float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * vn(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }
          void main(){
            vec3 d = normalize(vD); float y = max(d.y, 0.0);
            float az = dot(normalize(uSun.xz), normalize(d.xz + 1e-5)) * 0.5 + 0.5, sd = max(dot(d, uSun), 0.0);   // az: 1 toward the sun, 0 away from it
            vec3 low = mix(vec3(0.95, 0.54, 0.42), vec3(0.95, 0.52, 0.20), pow(az, 1.6));                          // rose away from the sun, amber toward it
            vec3 mid = mix(vec3(0.30, 0.38, 0.64), vec3(0.60, 0.44, 0.40), az);
            vec3 c = mix(mix(low, mid, smoothstep(0.0, 0.24, y)), vec3(0.06, 0.16, 0.44), smoothstep(0.16, 0.9, y));
            c += vec3(1.0, 0.45, 0.12) * pow(sd, 5.0) * 0.3 + vec3(1.6, 0.85, 0.3) * pow(sd, 90.0) + vec3(30.0, 20.0, 9.0) * smoothstep(0.99988, 0.99996, sd);
            vec2 p = d.xz / (d.y + 0.1);                                                                          // a flat layer of high cloud, lit from below
            float n = fbm(p * vec2(0.42, 1.7) + 3.0) * 0.7 + fbm(p * vec2(1.3, 4.6) + 11.0) * 0.3;
            float cl = smoothstep(0.46, 0.70, n) * smoothstep(0.015, 0.16, d.y);
            vec3 lit = mix(vec3(1.3, 0.64, 0.50), vec3(1.35, 0.72, 0.32), az * az);
            c = mix(c, mix(lit, mid * 0.75, smoothstep(0.60, 0.86, n) * 0.6), cl * 0.8);
            c = mix(c, c * vec3(0.74, 0.74, 0.90) + vec3(0.04, 0.0, 0.01), uEve * 0.75);                         // evening: deeper and cooler
            c = mix(uFog, c, smoothstep(-0.005, 0.07, d.y));                                                       // the horizon dissolves into the haze
            gl_FragColor = vec4(c, 1.0);
          }`,
      }));
      sky.frustumCulled = false; scene.add(sky);
      const nzr = K.noise(9);
      [[150, 8, '#4b4658'], [205, 14, '#544c5c'], [270, 22, '#5a5262']].forEach(([R, h0, color], k) => {     // three ridges, each paler in the haze
        const n = 420, pos = [], idx = [];
        for (let i = 0; i <= n; i++) {
          const a = i / n * Math.PI * 2, h = h0 * (0.25 + 1.6 * Math.max(0, 0.45 + nzr.fbm(Math.cos(a) * 2.4 + k * 7, Math.sin(a) * 2.4, k * 3, 5)));
          pos.push(Math.cos(a) * R, -2, Math.sin(a) * R, Math.cos(a) * R, h, Math.sin(a) * R);
          if (i < n) idx.push(2 * i, 2 * i + 1, 2 * i + 2, 2 * i + 1, 2 * i + 3, 2 * i + 2);
        }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
        scene.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })));
      });

      // ---- the water: a real mirror over the salt
      // The water takes no sunlight of its own (a film of water shows the sky and the reflection, not cast shadows): its pale
      // salt colour is a constant glow, so the evening shadow can climb the monument without drawing an edge on the lake.
      K.mirrorFloor(S, { y: 0, size: 2400, color: '#100f0e', surfaceRoughness: 0.5, roughness: 0.03, strength: 1.0, fresnel: true, material: { emissive: new THREE.Color('#958a90'), emissiveMap: saltTex(K, [80, 80]), emissiveIntensity: 0.55, envMapIntensity: 0.2 } });

      // ---- the turn: evening. A far ridge (never seen, it only casts) puts the monument in shade from the bottom up,
      // until the hero word alone still has the sun. dusk(t) is the height of the shadow's edge on the plane z = 0; the
      // edge climbs toward the camera and drops toward the back, because the sun is in front.
      const dusk = K.track([[0, -9], [T.hold - 0.3, -1.5, 'linear'], [T.end - 0.5, 13.4, (u) => u * u * (3 - 2 * u)]]);
      let ridge;
      const shadeAt = (y, z, t) => K.smooth(-1.1, 1.1, dusk(t) + (SUN.y / SUN.z) * z - y);            // 0 in the sun, 1 in the shade
      {
        const h = new THREE.Vector3(SUN.x, 0, SUN.z).normalize(), D = 100, pos = [], idx = [], nzs = K.noise(12), n = 120;
        for (let i = 0; i <= n; i++) {
          const x = (i / n - 0.5) * 520, lam = (D - x * h.x) / SUN.dot(h), y = lam * SUN.y + 1.1 * nzs.fbm(x * 0.045, 0.3, 0, 3);
          pos.push(x + lam * SUN.x, y, lam * SUN.z, x + lam * SUN.x, y - 160, lam * SUN.z);
          if (i < n) idx.push(2 * i, 2 * i + 1, 2 * i + 2, 2 * i + 1, 2 * i + 3, 2 * i + 2);
        }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
        ridge = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide }));
        ridge.castShadow = true; ridge.frustumCulled = false; scene.add(ridge);
      }

      // ---- surfaces
      const noise = noiseTex(K), concrete = concreteTex(K), steel = steelTex(K);
      const concreteMat = (o) => surface(THREE, concrete, noise, Object.assign({ roughness: 0.92, bump: 0.014, stain: 0.85 }, o));
      const darkMat = (o) => concreteMat(Object.assign({ color: '#3f4a55', stain: 0.7, pour: 0.25 }, o));          // the mass of the monument: dark, so the pale words stand off it
      const steelMat = (o) => surface(THREE, steel, noise, Object.assign({ roughness: 0.8, metalness: 0.2, bump: 0.008, streak: '#9a5a2c', pour: 0, grime: 0.5, color: '#e6d8cc' }, o));
      const add = (geo, mat, x, y, z, cast = true) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = true; scene.add(m); return m; };
      const pave = (w, d) => { const t = paveTex(K); t.repeat.set(w / TILE, d / TILE); return t; };
      const paved = (w, d, x, y, z) => { const m = add(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: pave(w, d), roughness: 0.7 }), x, y, z, false); m.rotation.x = -Math.PI / 2; return m; };
      // thin members (scaffold tubes, crane lattice): unit boxes stretched between two points, [from, to, thickness]
      const beams = (segs, mat) => {
        const m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat, segs.length), a = new THREE.Vector3(), b = new THREE.Vector3(), o = new THREE.Object3D(), up = new THREE.Vector3(0, 1, 0);
        segs.forEach(([p, q, th], i) => { a.set(...p); b.set(...q); o.position.copy(a).add(b).multiplyScalar(0.5); o.quaternion.setFromUnitVectors(up, b.clone().sub(a).normalize()); o.scale.set(th, a.distanceTo(b), th); o.updateMatrix(); m.setMatrixAt(i, o.matrix); });
        m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; scene.add(m); return m;
      };

      // ---- terraces: plain dark blocks that run to the back of the monument, each with a pale coping and a paved top
      const zBack = top.z - top.depth - 3;
      rows.forEach((w, i) => {
        const f = w.edge, last = i === rows.length - 1, W = w.tierW + (last ? 2 : 0), zEnd = i ? rows[i - 1].edge : zBack;
        add(new THREE.BoxGeometry(W, w.base, f - zBack), last ? concreteMat({ base: 0, top: w.base * 3, stain: 0.6 }) : darkMat({ base: 0, top: w.base }), 0, w.base / 2, (f + zBack) / 2);
        if (!last) add(new THREE.BoxGeometry(W + 0.3, 0.2, 0.7), concreteMat({ base: w.base - 1, top: w.base, stain: 0.3 }), 0, w.base - 0.085, f - 0.2);
        if (w !== top) paved(W, f - zEnd, 0, w.base + 0.012, (f + zEnd) / 2);
      });
      // the top terrace is wet: a second mirror, so the opening shot has the hero letters standing on their reflection
      const wet = K.mirrorFloor(S, { y: top.base + 0.012, size: 10, color: '#c9c3b9', surfaceRoughness: 0.42, roughness: 0.09, strength: 0.62, fresnel: true, material: { map: pave(top.tierW, top.edge - zBack), envMapIntensity: 0.3 } });
      wet.geometry = new THREE.PlaneGeometry(top.tierW, top.edge - zBack); wet.position.z = (top.edge + zBack) / 2;
      // the way in: a causeway across the water, straight at the middle of the block
      const CAUSE = { w: 1.5, y: 0.16, z0: front.edge + 0.5, z1: HOLD.pos[2] + 30 };
      add(new THREE.BoxGeometry(CAUSE.w, CAUSE.y, CAUSE.z1 - CAUSE.z0), concreteMat({ base: -1, top: 3, stain: 0.3 }), 0, CAUSE.y / 2, (CAUSE.z0 + CAUSE.z1) / 2);
      paved(CAUSE.w - 0.1, CAUSE.z1 - CAUSE.z0, 0, CAUSE.y + 0.006, (CAUSE.z0 + CAUSE.z1) / 2);

      // ---- the words
      rows.forEach((w) => {
        const g = K.text3d(w.text, { font: FONT, size: w.size, depth: w.depth, bevel: w.size * 0.012, bevelSegments: 1, letterSpacing: SPACING, curveSegments: 96 });
        g.computeBoundingBox(); const bb = g.boundingBox, sx = -(bb.min.x + bb.max.x) / 2, sy = -bb.min.y;
        g.translate(sx, sy, -w.depth / 2);
        w.letters = g.userData.letters.map((l) => ({ char: l.char, x0: l.x + sx, x1: l.x + l.w + sx, start: l.start, count: l.count }));
        const o = { base: w.base, top: w.base + w.cap }, mat = w.hero ? steelMat(o) : concreteMat(o);
        if (w.unfinished) {                                                // the last letter gets its own material: bare concrete below, formwork still on above
          const l = w.letters[w.letters.length - 1];
          g.addGroup(0, l.start, 0); g.addGroup(l.start, l.count, 1);
          w.mesh = add(g, [mat, concreteMat(Object.assign({ plyY: w.base + w.cap * 0.5 }, o))], 0, w.base - 0.02, w.z);
        } else w.mesh = add(g, mat, 0, w.base - 0.02, w.z);
      });

      // ---- scale: lamps, people and birds. Their shadows are drawn as long soft streaks on the ground (a shadow map
      // that covers the whole monument cannot resolve a lamp post), which is what makes them read from far away.
      const lamps = [], people = [], r = K.rng(4), LAMP_H = 1.0;
      rows.forEach((w) => { const n = Math.round(w.tierW / 2.7); for (let k = 0; k <= n; k++) lamps.push([(k / n - 0.5) * (w.tierW - 1.2), w.base, w.edge - 0.75, LAMP_H]); });
      for (let z = CAUSE.z0 + 1; z < CAUSE.z1; z += 2) lamps.push([-CAUSE.w / 2 + 0.06, CAUSE.y, z, 0.2], [CAUSE.w / 2 - 0.06, CAUSE.y, z, 0.2]);   // low lights along the causeway
      const poles = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.016, 1, 6).translate(0, 0.5, 0), new THREE.MeshStandardMaterial({ color: '#23211f', roughness: 0.6, metalness: 0.5 }), lamps.length);
      const bulbs = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 10, 8), new THREE.MeshBasicMaterial({ fog: false }), lamps.length);
      lamps.forEach((p, i) => { K.place(poles, i, p, null, [1, p[3], 1]); K.place(bulbs, i, [p[0], p[1] + p[3] + 0.02, p[2]]); });
      scene.add(poles, bulbs);
      // a soft halo round every lamp, so they carry once the shade arrives
      const haloTex = K.canvasTex(64, 64, (c) => { const g = c.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 64, 64); });
      const halos = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(lamps.flatMap((p) => [p[0], p[1] + p[3] + 0.02, p[2]]), 3)), new THREE.PointsMaterial({ map: haloTex, size: 0.85, sizeAttenuation: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
      halos.frustumCulled = false; scene.add(halos);

      // people: person(x, floor, z, heading, speed, tint, aloft). heading 0 faces +z (the hold camera); they walk where they
      // face; aloft = standing on something thin, so no shadow streak on the ground.
      const cloth = ['#23262d', '#34322f', '#473f36', '#22313f', '#5d4e3f', '#b9a98f', '#2d3a2e', '#a3351f'];
      const person = (x, y, z, heading, speed = 0, tint, aloft = false) => people.push({ x, y, z, heading, speed, aloft, ph: r.range(0, 6.28), tint: tint == null ? r.int(0, 5) : tint, s: r.range(0.92, 1.06) });
      const y0 = top.base, z0 = top.z, hw = top.width / 2;
      person(hw * 0.47, y0, z0 + 1.9, -Math.PI * 0.62, 0, 7); person(hw * 0.47 - 0.34, y0, z0 + 2.1, -Math.PI * 0.45, 0, 5);  // two at the foot of the hero, looking along it
      person(hw * 0.2, y0, z0 + 3.6, Math.PI / 2, 0.36, 1); person(hw * 0.02, y0, z0 + 4.2, -Math.PI / 2, 0.33, 3);
      person(-hw * 0.3, y0, z0 + 2.6, Math.PI * 0.6, 0, 0); person(-hw * 0.33, y0, z0 + 3.0, -Math.PI * 0.4, 0, 4); person(-hw * 0.62, y0, z0 + 3.8, Math.PI / 2, 0.34, 2);
      rows.forEach((w, i) => {                                                                                              // a few on every terrace, some at the edge
        for (let k = 0; k < 5 + (i === rows.length - 1 ? 4 : 0); k++) {
          const atEdge = r.chance(0.5), walk = r.chance(0.6), dir = r.sign();
          person(r.range(-0.46, 0.46) * w.tierW, w.base, atEdge ? w.edge - r.range(0.25, 0.5) : w.edge - r.range(1.2, WALK - 1.6), walk ? dir * Math.PI / 2 : r.range(-0.6, 0.6), walk ? r.range(0.3, 0.4) : 0);
        }
      });
      for (let k = 0; k < 7; k++) person(r.range(-0.4, 0.4), CAUSE.y, K.lerp(CAUSE.z0 + 2, HOLD.pos[2] - 19, (k + r()) / 7), r.chance(0.7) ? Math.PI : 0, r.range(0.3, 0.4), k === 2 ? 7 : null);

      // ---- a narrow word leaves bare wall beside it: a scatter of small deep-set windows, a few of them lit
      const frames = [], panes = [], lit = [];
      rows.forEach((w, i) => {
        if (!i || w.share > 0.8) return;
        const up = rows[i - 1], q = K.rng(40 + i), xa = w.width / 2 + 2.2, xb = up.tierW / 2 - 1.2, n = Math.round((xb - xa) * 0.9);
        for (const side of [-1, 1]) for (let k = 0; k < n; k++) {
          const big = q.chance(0.25), ww = big ? 0.42 : 0.24, wh = big ? 0.62 : 0.34, x = side * K.lerp(xa, xb, (k + q.range(0.15, 0.85)) / n), y = K.lerp(w.base + 1.1, up.base - 1.0, q());
          frames.push([x, y, up.edge + 0.03, ww + 0.12, wh + 0.12]); (q.chance(0.22) ? lit : panes).push([x, y, up.edge + 0.07, ww, wh]);
        }
      });
      const boxes = (list, mat, d) => { if (!list.length) return; const m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat, list.length); list.forEach((b, k) => K.place(m, k, [b[0], b[1], b[2]], null, [b[3], b[4], d])); m.castShadow = true; m.receiveShadow = true; scene.add(m); };
      boxes(frames, darkMat({ base: 0, top: 30, stain: 0.2, bump: 0.004, color: '#5b6068' }), 0.14); boxes(panes, new THREE.MeshStandardMaterial({ color: '#0b0d11', roughness: 0.25 }), 0.08); const glass = new THREE.MeshBasicMaterial(); boxes(lit, glass, 0.08);

      // ---- the unfinished word: scaffold round its last letter, and a tower crane lowering the next formwork panel
      let crane = null; const unfinished = rows.find((w) => w.unfinished);
      if (unfinished) {
        const w = unfinished, l = w.letters[w.letters.length - 1], x0 = l.x0 - 0.15, x1 = l.x1 + 0.3, zA = w.z + 0.3, zB = w.z + 0.78, yb = w.base, tubes = [], LIFT = 0.5;
        const nx = Math.round((x1 - x0) / 0.62), ny = Math.floor((w.cap + 0.7) / LIFT), yt = yb + ny * LIFT + 0.45;
        for (let i = 0; i <= nx; i++) { const x = K.lerp(x0, x1, i / nx); tubes.push([[x, yb, zA], [x, yt, zA], 0.026], [[x, yb, zB], [x, yt, zB], 0.026]); for (let j = 1; j <= ny; j++) tubes.push([[x, yb + j * LIFT, zA], [x, yb + j * LIFT, zB], 0.02]); }
        for (let j = 1; j <= ny; j++) { const y = yb + j * LIFT; tubes.push([[x0, y, zA], [x1, y, zA], 0.022], [[x0, y, zB], [x1, y, zB], 0.022], [[x0, y + 0.22, zB], [x1, y + 0.22, zB], 0.016]); }
        for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) if ((i + j) % 3 === 0) tubes.push([[K.lerp(x0, x1, i / nx), yb + j * LIFT, zB], [K.lerp(x0, x1, (i + 1) / nx), yb + (j + 1) * LIFT, zB], 0.016]);
        beams(tubes, new THREE.MeshStandardMaterial({ color: '#9a9c9d', roughness: 0.45, metalness: 0.8 }));
        const plank = new THREE.MeshStandardMaterial({ color: '#a8845a', roughness: 0.9 });
        for (let j = 1; j <= ny; j++) add(new THREE.BoxGeometry(x1 - x0, 0.022, zB - zA - 0.04), plank, (x0 + x1) / 2, yb + j * LIFT + 0.02, (zA + zB) / 2);
        for (const [s, j] of [[0.3, 3], [0.7, 6], [0.45, ny]]) if (j <= ny) person(K.lerp(x0, x1, s), yb + j * LIFT + 0.03, (zA + zB) / 2, r.range(2.6, 3.6), 0, 5, true);   // workers on the decks

        // tower crane on the right of the word
        const cx = Math.min(l.x1 + 2.3, w.tierW / 2 + 0.4), cz = w.z - w.depth / 2, m = 0.2, yJ = yb + w.cap + 2.6, xT = (l.x0 + l.x1) / 2, jl = cx - xT + 1.6, cl = 2.3, lat = [], BAY = 0.4;
        const C = [[-m, -m], [m, -m], [m, m], [-m, m]];
        C.forEach(([a, b]) => lat.push([[cx + a, yb, cz + b], [cx + a, yJ, cz + b], 0.034]));
        for (let y = yb, k = 0; y < yJ - 0.01; y += BAY, k++) C.forEach(([a, b], q) => { const [c, d] = C[(q + 1) % 4], y1 = Math.min(y + BAY, yJ); lat.push([[cx + a, y1, cz + b], [cx + c, y1, cz + d], 0.016], k % 2 ? [[cx + a, y, cz + b], [cx + c, y1, cz + d], 0.016] : [[cx + c, y, cz + d], [cx + a, y1, cz + b], 0.016]); });
        const jy = yJ + 0.3, ja = jy + 0.36, apex = [cx, yJ + 1.55, cz];
        for (const s of [-0.13, 0.13]) lat.push([[cx + cl, jy, cz + s], [cx - jl, jy, cz + s], 0.026], [[cx, yJ, cz + s], apex, 0.03]);
        lat.push([[cx - 0.2, ja, cz], [cx - jl, ja, cz], 0.026]);
        for (let x = 0.2, k = 0; x < jl - 0.01; x += BAY, k++) { const xa = cx - x, xb = cx - Math.min(x + BAY, jl); lat.push([[xa, jy, cz - 0.13], [xa, jy, cz + 0.13], 0.012], [[xa, ja, cz], [xb, jy, cz + (k % 2 ? 0.13 : -0.13)], 0.014], [[xa, jy, cz + (k % 2 ? -0.13 : 0.13)], [xb, ja, cz], 0.014]); }
        lat.push([apex, [cx - jl * 0.62, ja, cz], 0.012], [apex, [cx - jl * 0.3, ja, cz], 0.012], [apex, [cx + cl, jy, cz], 0.014]);
        beams(lat, new THREE.MeshStandardMaterial({ color: '#d39a1c', roughness: 0.55, metalness: 0.2 }));
        const grey = new THREE.MeshStandardMaterial({ color: '#55585b', roughness: 0.7 });
        add(new THREE.BoxGeometry(0.5, 0.3, 0.5), grey, cx, yJ + 0.15, cz); add(new THREE.BoxGeometry(0.28, 0.3, 0.24), new THREE.MeshStandardMaterial({ color: '#e9e2d2', roughness: 0.5 }), cx - 0.3, yJ + 0.05, cz + 0.36);
        add(new THREE.BoxGeometry(0.7, 0.5, 0.36), concreteMat({ base: jy - 1, top: jy, stain: 0.2 }), cx + cl - 0.45, jy - 0.25, cz);                       // counterweight
        add(new THREE.BoxGeometry(0.8, 0.12, 0.8), grey, cx, yb + 0.06, cz);
        const cable = add(new THREE.BoxGeometry(0.012, 1, 0.012), new THREE.MeshStandardMaterial({ color: '#1b1b1c', roughness: 0.6 }), xT, 0, cz + 0.05, false);
        const panel = add(new THREE.BoxGeometry(0.95, 0.62, 0.035), new THREE.MeshStandardMaterial({ color: '#b98a45', roughness: 0.8 }), xT, 0, cz + 0.05);
        add(new THREE.BoxGeometry(0.2, 0.08, 0.3), grey, xT, jy - 0.05, cz);                                                                                    // trolley
        crane = { cable, panel, jy, y0: yJ - 0.9, y1: yb + w.cap + 0.75 };
      }

      const P = PERSON, NP = people.length;
      const mkPart = (geo, n) => { const m = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.85 }), n); m.frustumCulled = false; m.receiveShadow = true; scene.add(m); return m; };
      const legs = mkPart(new THREE.CapsuleGeometry(0.036 * P, 0.41 * P, 3, 8).translate(0, -0.24 * P, 0), NP * 2), arms = mkPart(new THREE.CapsuleGeometry(0.027 * P, 0.3 * P, 3, 6).translate(0, -0.175 * P, 0), NP * 2);
      const torsos = mkPart(new THREE.CylinderGeometry(0.092 * P, 0.062 * P, 0.35 * P, 12).scale(1, 1, 0.6), NP), heads = mkPart(new THREE.SphereGeometry(0.06 * P, 12, 10), NP);
      const col = new THREE.Color();
      people.forEach((p, i) => {
        col.set(cloth[p.tint]); torsos.setColorAt(i, col); arms.setColorAt(2 * i, col); arms.setColorAt(2 * i + 1, col);
        col.set(cloth[(p.tint * 3 + 1) % 5]); legs.setColorAt(2 * i, col); legs.setColorAt(2 * i + 1, col);
        col.set(i % 3 ? '#3a2c24' : '#6e5546'); heads.setColorAt(i, col);
      });
      // streak shadows: one quad per person and per lamp, lying on the ground, pointing away from the sun
      const streakTex = K.canvasTex(256, 32, (c) => { const g = c.createLinearGradient(0, 0, 256, 0); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.7, 'rgba(255,255,255,0.75)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 256, 32); const v = c.createLinearGradient(0, 0, 0, 32); v.addColorStop(0, 'rgba(0,0,0,1)'); v.addColorStop(0.35, 'rgba(0,0,0,0)'); v.addColorStop(0.65, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,1)'); c.globalCompositeOperation = 'destination-out'; c.fillStyle = v; c.fillRect(0, 0, 256, 32); });
      const streaks = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2).translate(0.5, 0, 0), new THREE.MeshBasicMaterial({ map: streakTex, color: '#141a2a', transparent: true, opacity: 0.55, depthWrite: false }), NP + lamps.length);
      streaks.frustumCulled = false; scene.add(streaks);
      const dummy = new THREE.Object3D(); dummy.rotation.order = 'YXZ';
      const put = (mesh, i, x, y, z, heading, pitch, roll, s) => { dummy.position.set(x, y, z); dummy.rotation.set(pitch, heading, roll || 0); dummy.scale.setScalar(s == null ? 1 : s); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix); };

      // birds: two small flocks, one in the first shot and one that crosses the sky at the hold
      const birds = [];
      const flock = (n, c, v, seed) => { const q = K.rng(seed); for (let i = 0; i < n; i++) birds.push({ p: [c[0] + q.range(-2.2, 2.2), c[1] + q.range(-0.7, 0.7), c[2] + q.range(-2.2, 2.2)], v, f: q.range(3.2, 4.4), ph: q.range(0, 6.28) }); };
      flock(9, [hw * 0.1, y0 + 6.5, z0 + 14], [-2.6, 0.12, -0.5], 1); flock(11, [-22 + 2.8 * T.hold, y0 + top.cap + 2.2, z0 + 9], [-2.8, 0.1, 0.3], 2);
      const wings = new THREE.InstancedMesh(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.05, 0, 0, -0.05, 0.19, 0, -0.03], 3)), new THREE.MeshBasicMaterial({ color: '#1d1a1c', side: THREE.DoubleSide }), birds.length * 2);
      wings.frustumCulled = false; scene.add(wings);

      // ---- camera: one move. It starts at eye height against the hero, slides off the terrace while it turns to face
      // the words, and sinks back over the water to the hold, where the terraces close up into one block.
      const cam = {
        pos: K.path([[0, [hw * 0.80, y0 + 0.42, z0 + 3.1]], [T.leave, [hw * 0.66, y0 + 0.6, z0 + 4.2]], [T.leave + 2, [3.5, y0 + 0.2, z0 + 22]], [T.hold, HOLD.pos]]),
        aim: K.path([[0, [-hw * 0.25, y0 + 3.3, z0 + 0.3]], [T.leave, [-hw * 0.2, y0 + 3.8, z0]], [T.leave + 2, [0, y0 + 2.0, z0]], [T.hold, HOLD.aim]]),
        fov: K.path([[0, 50], [T.leave, 48], [T.leave + 2, 40], [T.hold, HOLD.fov]]),
      };
      const creep = (t) => { const u = Math.max(0, t - (T.hold - 1.2)); return u * u / (u + 1.2); };   // the move never quite stops: a slow push carries the hold
      const pos = [0, 0, 0];

      return {
        update(t) {
          const c = cam.pos(t), k = creep(t);
          pos[0] = c[0]; pos[1] = c[1] + 0.02 * k; pos[2] = c[2] - 0.5 * k;
          K.look(camera, pos, cam.aim(t), cam.fov(t)); K.focus(camera, 40, 0);

          people.forEach((p, i) => {
            const dx = Math.sin(p.heading), dz = Math.cos(p.heading), go = p.speed * t, x = p.x + dx * go, z = p.z + dz * go, h = P * p.s;
            const step = p.ph + go * 17, sw = p.speed ? Math.sin(step) * 0.55 : 0, y = p.y + (p.speed ? Math.abs(Math.cos(step)) * 0.012 : 0);
            const ox = Math.cos(p.heading), oz = -Math.sin(p.heading);                                  // the person's right
            put(legs, 2 * i, x + ox * 0.04 * h, y + 0.485 * h, z + oz * 0.04 * h, p.heading, sw, 0.09, p.s); put(legs, 2 * i + 1, x - ox * 0.04 * h, y + 0.485 * h, z - oz * 0.04 * h, p.heading, -sw, -0.09, p.s);
            put(arms, 2 * i, x + ox * 0.11 * h, y + 0.82 * h, z + oz * 0.11 * h, p.heading, -sw * 0.7, 0.1, p.s); put(arms, 2 * i + 1, x - ox * 0.11 * h, y + 0.82 * h, z - oz * 0.11 * h, p.heading, sw * 0.7, -0.1, p.s);
            put(torsos, i, x, y + 0.665 * h, z, p.heading, p.speed ? 0.06 : 0, 0, p.s); put(heads, i, x, y + 0.93 * h, z, p.heading, 0, 0, p.s);
            K.place(streaks, i, [x, p.y + 0.02, z], [0, SHADOW.ry, 0], p.aloft ? [0, 0, 0] : [h * SHADOW.len, 1, 0.17 * (1 - shadeAt(p.y, z, t))]);
          });
          lamps.forEach((p, i) => K.place(streaks, NP + i, [p[0], p[1] + 0.022, p[2]], [0, SHADOW.ry, 0], [p[3] * SHADOW.len, 1, 0.05 * (1 - shadeAt(p[1], p[2], t))]));
          for (const m of [legs, arms, torsos, heads, streaks, wings]) m.instanceMatrix.needsUpdate = true;
          // evening: the shadow climbs, and the lamps and windows come up as it does
          ridge.position.y = dusk(t);
          const eve = K.seg(t, T.hold - 1.0, T.end - 0.5, K.ease.inOut);
          bulbs.material.color.setRGB(6.0, 3.0, 1.0).multiplyScalar(0.3 + 1.2 * eve); halos.material.color.setRGB(1.0, 0.5, 0.17).multiplyScalar(0.06 + 0.75 * eve); glass.color.setRGB(2.2, 1.0, 0.3).multiplyScalar(0.1 + 0.9 * eve);
          sun.color.setRGB(1.0, 0.52 - 0.07 * eve, 0.24 - 0.07 * eve); sky.material.uniforms.uEve.value = eve; fogColor.lerpColors(fogDay, fogEve, eve); scene.fog.color.copy(fogColor);
          birds.forEach((b, i) => {
            const x = b.p[0] + b.v[0] * t, y = b.p[1] + b.v[1] * t + Math.sin(t * 0.9 + b.ph) * 0.15, z = b.p[2] + b.v[2] * t, hd = Math.atan2(b.v[0], b.v[2]);
            const flap = Math.sin(t * b.f * 6.283 + b.ph) * 0.75 + 0.15;
            put(wings, 2 * i, x, y, z, hd, 0, flap, 1); put(wings, 2 * i + 1, x, y, z, hd + Math.PI, 0, flap, 1);
          });
          if (crane) {                                                     // the panel comes down slowly and swings a little on its cable
            const y = K.lerp(crane.y0, crane.y1, K.seg(t, 2, T.end + 1.5, K.ease.inOut)), swing = Math.sin(t * 1.3) * 0.035;
            crane.panel.position.y = y; crane.panel.rotation.set(0, 0.5 + Math.sin(t * 0.7) * 0.25, swing);
            crane.cable.position.y = (crane.jy + y + 0.3) / 2; crane.cable.scale.y = crane.jy - y - 0.3;
          }
        },
      };
    },

    sound(k) {
      // wind over open water, a low drone that opens into a chord when the block lines up, and the site still at work
      k.noise(0, { dur: T.end, color: 'pink', filter: 'bandpass', f: [[0, 360], [T.leave + 1.8, 1000], [T.hold, 400], [T.end, 460]], q: 0.7, gain: 0.05, a: 0.5, hold: T.end - 1.4, bus: 'amb' });
      k.noise(0, { dur: T.end, color: 'brown', filter: 'lowpass', f: 220, gain: 0.05, a: 0.4, hold: T.end - 1.2, bus: 'amb' });
      for (const [f, g, pan] of [['D2', 0.05, 0], ['A2', 0.03, -0.3]]) k.tone(0, { f, type: 'sine', dur: T.end, gain: g, a: 3.5, hold: T.end - 4.5, pan, bus: 'music', verb: 0.3 });
      k.play('whoosh', T.leave + 0.3, { dur: 3.8, top: 1500, gain: 1.1 });                                   // the air as the camera leaves the terrace and falls back
      k.play('impact', T.hold - 0.15, { gain: 1.0, f: 62 });                                                // the terraces close up into one block
      for (const [f, g, pan] of [['D3', 0.09, 0], ['F#3', 0.06, -0.4], ['A3', 0.055, 0.4], ['D4', 0.04, 0.15]]) k.tone(T.hold - 0.15, { f, type: 'triangle', dur: T.end - T.hold + 0.15, gain: g, a: 0.02, hold: 0.5, pan, bus: 'music', filter: 'lowpass', f2: 1300, verb: 0.5 });   // a struck steel plate, ringing in D
      k.tone(T.end - 1.5, { f: 'F#4', type: 'sine', dur: 1.5, gain: 0.03, a: 0.5, hold: 0.3, verb: 0.6 });   // the last light on the hero word
      k.tone(T.end - 1.5, { f: 'A4', type: 'sine', dur: 1.5, gain: 0.022, a: 0.6, hold: 0.3, pan: 0.3, verb: 0.6 });
      k.withMinor(() => {
        for (const [t, f] of [[0.35, 3100], [0.62, 3500], [1.05, 2900], [1.5, 3300]]) k.tone(t, { f: [[0, f], [0.06, f * 1.25], [0.14, f * 0.9]], dur: 0.16, gain: 0.03, pan: -0.5, verb: 0.4 });   // birds
        for (const [t, f] of [[T.hold + 0.8, 520], [T.hold + 1.05, 640], [T.hold + 1.9, 480]]) { k.play('tock', t, { gain: 0.2, f, pan: 0.6 }); k.tone(t, { f: f * 3.1, dur: 0.5, gain: 0.014, pan: 0.6, verb: 0.6 }); }   // scaffold and crane, far off
      });
    },
  });
}
```
