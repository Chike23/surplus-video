I want a short 3D motion graphic made with three.js in the "LED Wall" style. Below is the complete source of a reference animation in this exact style, plus the small rendering kit and sound kit it runs on. Use them as your style guide and rebuild the animation around my content.

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

HOW TO STAY IN THE STYLE
- The reference shows the look, not the story. Its objects, layout and beats belong to its own topic: do not reuse them unless my content calls for them. Work out what my content needs to show first, then build those things in this look.
- Tell my content as a story, not a title card: things happen to objects or characters over three or four beats that follow from each other, and the picture does the telling. Words are small captions and labels, never the subject of a shot. End on the result of the process or the end of the story, not on a headline, slogan or logo.
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
Name: LED Wall
Family: Flat content made physical
Use: story
Look: A giant outdoor screen made of real lamps: thousands of frosted round LEDs in black louvred cabinets on a steel gantry at night. From far away it is a crisp bright picture; close up it falls apart into single glowing lamps, each with a red, a green and a blue chip under its lens.
Motion: The wall plays pixel animation at one pixel per lamp and 30 pictures a second: characters built from a few flat colours with a dark outline walk, run, stop and react in real cycles, the ground scrolls under them lamp by lamp with slower hills behind, and one short caption per beat pushes up into a ticker strip along the bottom. The camera does the opposite of the content: one slow continuous pull from a single lamp to the whole wall, still drifting at the end.
Light: The wall is the light. Its own colours spill onto the louvres and the black plastic between the lamps, glow in the haze around it, tint the steel and paint the wet ground, and all of it changes when the picture changes. One cold floodlight from behind gives the steel a rim; everything else is night.
Materials: Frosted dome lenses in black collars, satin black louvres and cabinet faces with seams and screws, galvanised lattice steel, rubber cable, wet tarmac with dry patches and a painted line.
Camera: Long lens. Starts as a macro shot at a low angle across the lamps with very shallow focus, pulls back and swings round to face the wall while the story waits on its opening pose, has the wall in frame by the time the first story event happens, and then keeps drifting back and across, low over the wet ground, to the last frame.
Finish: Soft bloom from the lamps, true-colour (neutral) tone mapping so the LED colours stay saturated, light vignette, very little grain. No scanline or pixel filters: the dots are real geometry.
Good for: Any 2D animation, diagram or story that can be drawn at lamp resolution: a fable with two characters, a process with parts that move along a track, a chart that grows, a map with a route, a game-like sequence. Draw it on a small canvas with one pixel per lamp. A beat is something happening in that picture (a character sets off, stops, is overtaken, arrives); a label is one short dot-font line in the ticker strip; what moves is the pixel picture, while the wall, its housing and the light it throws stay the same and take their colour from whatever is playing.

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

REFERENCE STYLE SOURCE (styles/led-wall.js; its sample topic was "The Tortoise and the Hare, as a pixel cartoon playing on the lamp wall")
```js
{
  // ---------------------------------------------------------------- content (change this for a new topic)
  // The picture is a tiny canvas with ONE PIXEL PER LAMP. Whatever drawContent() paints on it, the wall plays.
  // Here it plays a pixel cartoon: The Tortoise and the Hare, on a two-lane running track that scrolls sideways.
  const K = globalThis.K;
  const COLS = 180, ROWS = 72, CAB = 18;       // lamps across and down, and the size of one cabinet (18 x 18 lamps)
  const REFRESH = 30;                          // the wall shows 30 pictures a second, like real hardware
  // the story: times in seconds, places in lamps along the track (the track is longer than the wall, so the view scrolls)
  const T_GO = 2.2;                                                    // the flag drops
  const T_STOP = 3.5, T_LOOK = 3.8, T_YAWN = 4.8, T_DOWN = 5.6, T_SLEEP = 6.3;   // the hare brakes at the tree, looks back, yawns, lies down, sleeps
    const X_START = 80, X_NAP = 215, X_FINISH = 267;                     // start line, the hare's spot under the tree, finish line
  const PLOD = 29;                                                     // the tortoise's speed, lamps a second: never changes
  const T_WIN = T_GO + 0.35 + (X_FINISH - (X_START - 4)) / PLOD;       // his nose reaches the line (about 9.1 s)
  const T_WAKE = T_WIN - 0.2, T_DASH = T_WAKE + 0.42;                  // the hare wakes with a start as the tortoise reaches the line, and dashes: too late
  // one short line per beat: [start time, text, optional times at which its words appear one by one]
  const CAPTIONS = [[0, 'READY... SET... GO!', [0, T_GO - 0.9, T_GO]], [T_GO + 0.7, 'THE HARE SHOOTS AHEAD'], [T_YAWN - 0.1, 'HE STOPS FOR A NAP'], [7.0, 'THE TORTOISE PLODS PAST'], [T_WIN, 'SLOW AND STEADY WINS']];
  const HERO = [68, 17];                       // the lamp the clip opens on: column, row (the pink inside of the hare's ear)
  // rows of the picture, top to bottom: sky and hills, grass verge, the hare's lane, the tortoise's lane, caption strip
  const HORIZON = 25, TRACK = 30, LANE = 45, TRACK_END = 60, STRIP = 61, HARE_Y = 39, TORT_Y = 58;

  // how far the tortoise has walked by time t: slow off the mark, then dead steady, and a short stop past the line
  const WALK_END = X_FINISH + 38 - (X_START - 4);
  function plodded(t) {
    const s = t - T_GO - 0.2;
    if (s <= 0) return 0;
    const d = s < 0.3 ? PLOD * s * s / 0.6 : PLOD * (s - 0.15), brake = WALK_END - PLOD * 0.25;
    if (d <= brake) return d;
    const u = Math.min(0.5, (d - brake) / PLOD); return brake + PLOD * (u - u * u);
  }
  // where the hare's nose is: two sprints that start flat out and end in a skid
  const sprint = (t, t0, t1, x0, x1) => x0 + (x1 - x0) * (1 - (1 - K.seg(t, t0, t1)) ** 2);
  const hareNose = (t) => (t < T_DASH ? sprint(t, T_GO + 0.08, T_STOP, X_START - 3, X_NAP) : sprint(t, T_DASH, T_DASH + 0.6, X_NAP, X_FINISH - 16));
  // the view: follows the hare to his tree, waits there, then travels with the tortoise to the finish
  const scrollAt = K.track([[T_GO + 0.1, 0], [T_STOP + 0.15, 92, 'inOut'], [6.4, 92], [T_WIN + 0.8, 162, 'inOut']]);

  // ---------------------------------------------------------------- pixel tools: everything lands on whole lamps
  // (canvas circles and lines are anti-aliased, which turns to mush at this size, so shapes are filled lamp by lamp)
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const mixHex = (a, b, u) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * u)).join(',')})`; };
  const wrap = (x, n) => ((x % n) + n) % n;
  function blob(ctx, cx, cy, rx, ry, color) {            // a filled ellipse
    ctx.fillStyle = color;
    for (let y = Math.ceil(cy - ry); y <= cy + ry; y++) { const hw = rx * Math.sqrt(Math.max(0, 1 - ((y - cy) / ry) ** 2)), x0 = Math.round(cx - hw), x1 = Math.round(cx + hw); if (x1 > x0) ctx.fillRect(x0, y, x1 - x0, 1); }
  }
  function pixmap(ctx, rows, x, y, colors) {             // a little picture typed as text, one character per lamp
    rows.forEach((row, j) => [...row].forEach((ch, i) => { if (colors[ch]) { ctx.fillStyle = colors[ch]; ctx.fillRect(x + i, y + j, 1, 1); } }));
  }
  // Small type: web fonts turn to mush under about 9 lamps, so text uses the classic 5 x 7 dot font
  // (five column bytes per character, lowest bit on top), one lamp per dot.
  const DOTS = Object.fromEntries(("A7E1111117E B7F49494936 C3E41414122 D7F4141221C E7F49494941 F7F09090901 G3E4149497A H7F0808087F I00417F4100 J2040413F01 K7F08142241 L7F40404040 M7F020C027F " +
    "N7F0408107F O3E4141413E P7F09090906 Q3E4151215E R7F09192946 S4649494931 T01017F0101 U3F4040403F V1F2040201F W3F4038403F X6314081463 Y0708700807 Z6151494543 " +
    "03E5149453E 100427F4000 24261514946 32141454B31 41814127F10 52745454539 63C4A494930 70171090503 83649494936 90649291E00 :0036360000 -0808080808 .0060600000 !00005F0000 '0005030000").split(' ').map((s) => [s[0], s.slice(1).match(/../g).map((h) => parseInt(h, 16))]));
  function dotText(ctx, text, x, y, color, size = 1) {
    ctx.fillStyle = color;
    for (const ch of text) { const g = DOTS[ch]; if (g) for (let c = 0; c < 5; c++) for (let r = 0; r < 7; r++) if ((g[c] >> r) & 1) ctx.fillRect(x + c * size, y + r * size, size, size); x += 6 * size; }
  }
  const dotWidth = (text) => text.length * 6 - 1;

  // ---------------------------------------------------------------- puppets
  // A character is a puppet: a few ovals and limbs filled into a small grid of colour numbers, posed by a handful of
  // values (body height, lean, where each foot is, ear angle). Because a pose is only numbers, poses can be blended
  // and cycled, which gives real walk and run cycles without drawing frames by hand. The grid is then stamped on the
  // wall with a one-lamp dark outline: that outline is what keeps a character readable from across the car park.
  function makeSprite(w, h) {
    const g = new Uint8Array(w * h);
    const fill = (x0, y0, x1, y1, test, c) => { for (let y = Math.max(0, Math.floor(y0)); y <= Math.min(h - 1, Math.ceil(y1)); y++) for (let x = Math.max(0, Math.floor(x0)); x <= Math.min(w - 1, Math.ceil(x1)); x++) if (test(x, y)) g[y * w + x] = c; };
    return {
      g, w, h,
      clear() { g.fill(0); },
      fill,
      dot(x, y, c) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < w && y < h) g[y * w + x] = c; },
      // an ellipse; `a` tips its long axis up at the front
      oval(cx, cy, rx, ry, c, a = 0) { const co = Math.cos(a), si = Math.sin(a), r = Math.max(rx, ry); fill(cx - r, cy - r, cx + r, cy + r, (x, y) => { const dx = x - cx, dy = y - cy; return ((dx * co - dy * si) / rx) ** 2 + ((dx * si + dy * co) / ry) ** 2 <= 1; }, c); },
      // a round-ended stroke from one point to another (legs, ears, necks)
      limb(x0, y0, x1, y1, r, c) { const dx = x1 - x0, dy = y1 - y0, L = dx * dx + dy * dy || 1; fill(Math.min(x0, x1) - r, Math.min(y0, y1) - r, Math.max(x0, x1) + r, Math.max(y0, y1) + r, (x, y) => { const k = K.clamp(((x - x0) * dx + (y - y0) * dy) / L); return Math.hypot(x - x0 - k * dx, y - y0 - k * dy) <= r; }, c); },
    };
  }
  // stamp a sprite so that its foot point (ax, ay in the sprite) lands on lamp (x, y). pal[0] is the outline colour
  function stamp(ctx, sp, ax, ay, x, y, pal, flip) {
    const { g, w, h } = sp;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const c = g[j * w + i];
      if (!c && !((i > 0 && g[j * w + i - 1]) || (i < w - 1 && g[j * w + i + 1]) || (j > 0 && g[j * w + i - w]) || (j < h - 1 && g[j * w + i + w]))) continue;
      ctx.fillStyle = pal[c]; ctx.fillRect(x + (flip ? ax - i : i - ax), y + j - ay, 1, 1);
    }
  }
  const mixPose = (A, B, u) => Object.fromEntries(Object.keys(A).map((k) => [k, Array.isArray(A[k]) ? A[k].map((v, i) => v + (B[k][i] - v) * u) : A[k] + (B[k] - A[k]) * u]));

  // ---- the hare: long ears, a white puff of a tail and big hind legs carry the likeness
  const HARE_PAL = ['#2b1206', '#fff3da', '#cdb99b', '#ff6f9c', '#1a0e16', '#ffffff', '#2b1206'], FUR = 1, FAR = 2, PINK = 3, DARK = 4, TAIL = 5, EDGE = 6;
  const hareSprite = makeSprite(54, 42), HARE_AX = 24, HARE_AY = 39;
  // a pose: h body height, pitch lean (front up), len/fat body size, head offset from the chest, ear angle from upright
  // (positive = laid back) and the spread between the two ears, hind [heel forward of the hip, heel height, toe angle],
  // fore [paw forward of the shoulder, paw height], eye (0 open, 1 shut, 2 wide), mouth (1 open)
  const HARE = {
    ready: { h: 9.5, pitch: -0.12, len: 9.5, fat: 6.3, head: [3, -4], ear: 0.15, spread: 0.45, hind: [3, 0, 0], fore: [1, 0], eye: 0, mouth: 0 },
    set: { h: 8, pitch: -0.32, len: 9, fat: 6.5, head: [3.5, -2.5], ear: 0.6, spread: 0.25, hind: [4, 0, 0], fore: [2, 0], eye: 0, mouth: 0 },          // rump up, ears flat
    skid: { h: 9, pitch: 0.45, len: 9.5, fat: 6.3, head: [2, -4], ear: -0.75, spread: 0.3, hind: [8, 0, 0.3], fore: [8, 1], eye: 2, mouth: 0 },        // leaning back, ears thrown forward
    sit: { h: 10.5, pitch: 0.95, len: 9, fat: 6.3, head: [2, -3.5], ear: 0.05, spread: 0.45, hind: [2, 0, 0], fore: [4, 7], eye: 0, mouth: 0 },
    yawn: { h: 11, pitch: 1.05, len: 9.5, fat: 6, head: [1, -4.5], ear: 0.5, spread: 0.3, hind: [2, 0, 0], fore: [6, 17], eye: 1, mouth: 1 },
    sleep: { h: 5, pitch: 0, len: 11.5, fat: 4.6, head: [5, -1], ear: 1.3, spread: 0.28, hind: [-7, 0, 3.1], fore: [8, 0], eye: 1, mouth: 0 },                // flat out, legs stretched, ears along his back
    alarm: { h: 11, pitch: 0.95, len: 9.5, fat: 6, head: [2, -4], ear: -0.05, spread: 0.3, hind: [2, 0, 0], fore: [6, 12], eye: 2, mouth: 1 },
    aghast: { h: 10.5, pitch: 0.95, len: 9, fat: 6.3, head: [2.5, -3], ear: 0.7, spread: 0.8, hind: [2, 0, 0], fore: [4, 6], eye: 2, mouth: 1 },        // sitting, jaw dropped, ears sagging apart
  };
  // the bound, p = 0..1: stretched out in the air, fore paws land, gathered up, hind feet push off
  function hareRun(p) {
    const a = 2 * Math.PI * p, c = Math.cos(a), s = Math.sin(a);
    return { h: 11.5 + 1.5 * c, pitch: -0.22 * s, len: 10.5 + 1.2 * c, fat: 6 - 0.4 * c, head: [4, -3], ear: 0.95 + 0.2 * s, spread: 0.3,
      hind: [-0.5 - 8.5 * c, Math.max(0, 2.75 + 3 * c + 2.5 * s), 1.3 * (1 + c)], fore: [2.5 + 7.5 * c, Math.max(0, 4 - 4 * s + 2 * c)], eye: 0, mouth: 0 };
  }
  function drawHare(sp, P) {
    sp.clear();
    const G = HARE_AY, cx = HARE_AX, cy = G - P.h, co = Math.cos(P.pitch), si = Math.sin(P.pitch), L = P.len;
    const front = [cx + (L - 2) * co, cy - (L - 2) * si], rear = [cx - (L - 3) * co, cy + (L - 3) * si];
    const hip = [rear[0] + 1, rear[1] + 1], sh = [front[0] - 1, front[1] + 2], head = [front[0] + P.head[0], front[1] + P.head[1]], ear = [head[0] - 2, head[1] - 3];
    const legs = (o, c) => {
      const heel = [hip[0] + P.hind[0] + o, G - 1.4 - P.hind[1]];
      sp.limb(hip[0] + o, hip[1], heel[0], heel[1], 2.2, c); sp.limb(heel[0], heel[1], heel[0] + 6 * Math.cos(P.hind[2]), heel[1] - 6 * Math.sin(P.hind[2]), 1.4, c);
      sp.limb(sh[0] + o, sh[1], sh[0] + P.fore[0] + o, G - 1.5 - P.fore[1], 1.5, c);
    };
    const earAt = (a, c, r = 1.7) => { const tip = [ear[0] - 13 * Math.sin(a), ear[1] - 13 * Math.cos(a)]; sp.limb(ear[0], ear[1], tip[0], tip[1], r, c); return tip; };
    earAt(P.ear + P.spread, FAR); legs(2.5, FAR);
    sp.oval(rear[0] - 2.5, rear[1] - 3, 2.6, 2.6, TAIL);
    sp.oval(cx, cy, L, P.fat, FUR, P.pitch); sp.oval(hip[0], hip[1], 5, 5.2, FUR);
    legs(0, FUR);
    sp.limb(front[0], front[1], head[0], head[1], 3.6, FUR);
    earAt(P.ear, EDGE, 2.7);                                          // a dark rim, so the near ear still shows when it lies across the body
    sp.oval(head[0], head[1], 5, 4.3, FUR); sp.oval(head[0] + 4, head[1] + 1.5, 2.6, 2.3, FUR);
    const tip = earAt(P.ear, FUR); sp.limb(K.lerp(ear[0], tip[0], 0.3), K.lerp(ear[1], tip[1], 0.3), K.lerp(ear[0], tip[0], 0.85), K.lerp(ear[1], tip[1], 0.85), 0.5, PINK);
    sp.dot(head[0] + 6.4, head[1] + 0.6, PINK);
    const ex = Math.round(head[0] + 1.5), ey = Math.round(head[1] - 1), eye = Math.round(P.eye);
    if (eye === 1) { sp.dot(ex - 1, ey, DARK); sp.dot(ex, ey, DARK); sp.dot(ex + 1, ey, DARK); }
    else { sp.dot(ex, ey, DARK); sp.dot(ex, ey - 1, DARK); if (eye === 2) { sp.dot(ex + 1, ey, DARK); sp.dot(ex + 1, ey - 1, DARK); } }
    if (P.mouth > 0.5) { sp.dot(head[0] + 4, head[1] + 3, DARK); sp.dot(head[0] + 5, head[1] + 3, DARK); }
  }
  // what the hare is doing at time t
  function hareNow(t) {
    const H = HARE, run = (t0) => hareRun((t - t0) / 0.2);          // one bound = 6 wall pictures
    let P, flip = false, lift = 0;
    if (t < T_GO + 0.08) {
      P = mixPose(H.ready, H.set, K.seg(t, T_GO - 0.9, T_GO - 0.5, K.ease.inOut));
      if (t < T_GO - 0.9) { const k = t % 1.1; if (k > 0.75 && k < 0.95) P = { ...P, ear: 0.5, spread: 0.1 }; }      // an ear flicks while he waits
      if (t > 0.3 && t < 1.2) lift = Math.round(2.5 * Math.abs(Math.sin((t - 0.3) * Math.PI / 0.3)));                 // and he cannot keep still: three little hops
    } else if (t < T_STOP - 0.38) P = run(T_GO);
    else if (t < T_STOP + 0.1) P = H.skid;
    else if (t < T_DOWN) {
      P = mixPose(H.skid, H.sit, K.seg(t, T_STOP + 0.1, T_STOP + 0.3));
      flip = t > T_LOOK && t < T_LOOK + 0.7;                         // he turns round to look for the tortoise, and laughs
      if (flip) lift = Math.round(Math.abs(Math.sin((t - T_LOOK) * 13)));
      const y = K.seg(t, T_YAWN, T_YAWN + 0.2) - K.seg(t, T_DOWN - 0.15, T_DOWN);
      if (y > 0) P = mixPose(P, H.yawn, y);
    } else if (t < T_WAKE) {
      P = mixPose(H.sit, H.sleep, K.seg(t, T_DOWN, T_SLEEP, K.ease.inOut));
      if (t > T_SLEEP) P = { ...P, fat: P.fat + 0.9 * K.smooth(-0.2, 0.6, Math.sin((t - T_SLEEP) * 2 * Math.PI)) };   // breathing
    } else if (t < T_DASH) { P = mixPose(H.sleep, H.alarm, K.seg(t, T_WAKE, T_WAKE + 0.1)); lift = Math.round(5 * Math.sin(Math.PI * K.seg(t, T_WAKE, T_WAKE + 0.3))); }
    else if (t < T_DASH + 0.4) P = run(T_DASH);
    else if (t < T_DASH + 0.7) P = H.skid;
    else P = mixPose(H.skid, H.aghast, K.seg(t, T_DASH + 0.7, T_DASH + 1.1));
    return { P, flip, lift };
  }

  // ---- the tortoise: a domed shell with plates, a small head on a neck, four stumpy legs
  const TORT_PAL = ['#06200c', '#178f3a', '#7fdc3c', '#f0b92a', '#e8ea7a', '#a7ab45', '#10160c'], SHELL = 1, PLATE = 2, RIM = 3, SKIN = 4, SKINFAR = 5, TEYE = 6;
  const tortSprite = makeSprite(50, 26), TORT_AX = 19, TORT_AY = 23;
  const STEP = 20;                              // lamps walked per leg cycle: feet stay planted while the body passes over them
  // P: walk (leg cycle 0..1), moving (0 standing .. 1 walking), head [stretch forward, up], eye (0 open, 1 shut), smile
  function drawTortoise(sp, P) {
    sp.clear();
    const G = TORT_AY, cx = TORT_AX, by = G - 5 - (Math.sin(4 * Math.PI * P.walk) > 0.3 ? Math.round(P.moving) : 0);
    const leg = (hx, off, c) => {
      const u = wrap(P.walk + off, 1), fx = u < 0.6 ? 6 - 12 * u / 0.6 : -6 + 12 * (u - 0.6) / 0.4, up = u < 0.6 ? 0 : 2.4 * Math.sin(Math.PI * (u - 0.6) / 0.4);
      sp.limb(hx, by - 1, hx + fx * P.moving, G - 2.3 - up * P.moving, 2.3, c);
    };
    leg(cx - 5, 0.5, SKINFAR); leg(cx + 11, 0, SKINFAR);
    sp.limb(cx - 13, by - 2.5, cx - 17.5, by - 0.5, 1.1, SKIN);
    const hc = [cx + 19 + P.head[0], by - 8 - P.head[1]];
    sp.limb(cx + 11, by - 3, hc[0], hc[1], 2.2, SKIN); sp.oval(hc[0], hc[1], 4, 3.3, SKIN);
    leg(cx - 8, 0, SKIN); leg(cx + 8, 0.5, SKIN);
    sp.fill(cx - 15, by - 12, cx + 15, by, (x, y) => ((x - cx) / 14.5) ** 2 + ((y - by) / 11.5) ** 2 <= 1, SHELL);
    sp.oval(cx, by - 7.5, 4.4, 2.6, PLATE); sp.oval(cx - 8.5, by - 4.6, 3, 2.3, PLATE); sp.oval(cx + 8.5, by - 4.6, 3, 2.3, PLATE);
    sp.fill(cx - 15, by - 1, cx + 15, by, () => true, RIM);
    const ex = Math.round(hc[0] + 1.5), ey = Math.round(hc[1] - 1);
    if (P.eye > 0.5) { sp.dot(ex - 1, ey, TEYE); sp.dot(ex, ey, TEYE); sp.dot(ex + 1, ey, TEYE); } else { sp.dot(ex, ey, TEYE); sp.dot(ex, ey - 1, TEYE); }
    if (P.smile > 0.5) { sp.dot(hc[0] + 2, hc[1] + 1.6, TEYE); sp.dot(hc[0] + 3, hc[1] + 1.2, TEYE); }
  }
  function tortoiseNow(t) {
    const d = plodded(t), moving = K.seg(t, T_GO + 0.2, T_GO + 0.45) * (1 - K.smooth(WALK_END - 3, WALK_END, d)), won = K.seg(t, T_WIN + 0.5, T_WIN + 0.8, K.ease.outBack);
    const blink = t < T_GO ? t % 1.7 > 1.55 : false;
    return { walk: d / STEP, moving, head: [1.5 * Math.sin(d / STEP * 4 * Math.PI) * moving + (t < T_GO ? Math.round(K.smooth(0.8, 1.2, t) - K.smooth(1.6, 1.9, t)) * 2 : 0), 3 * won], eye: blink || won > 0.5 ? 1 : 0, smile: won };
  }

  // ---------------------------------------------------------------- the world
  const CUP = ['..YYYYYYYYY..', 'YYYYWYYYYYYYY', 'Y.YYWYYYYYY.Y', 'Y.YYWYYYYYY.Y', 'YYYYWYYYYYYYY', '..YYWYYYYYY..', '...YYYYYYY...', '....YYYYY....', '.....YYY.....', '.....YYY.....', '...YYYYYYY...', '..YYYYYYYYY..'];
  const cupSprite = makeSprite(15, 14);
  const ZS = [['####', '..#.', '.#..', '####'], ['#####', '...#.', '..#..', '.#...', '#####'], ['#######', '.....#.', '....#..', '...#...', '..#....', '.#.....', '#######']];
  const CONFETTI = ['#ff3b30', '#ffd400', '#35d0ff', '#ffffff', '#ff7ad1', '#7dff5a'];

  function scenery(ctx, t, scroll) {
    const f = Math.round(t * REFRESH), late = K.smooth(T_SLEEP, T_WIN, t);      // the afternoon wears on while the hare sleeps
    ctx.fillStyle = mixHex('#0f4fc8', '#1b3da6', late); ctx.fillRect(0, 0, COLS, HORIZON);
    ctx.fillStyle = '#2f80ee'; ctx.fillRect(0, 17, COLS, HORIZON - 17);
    const glow = Math.round(late * 11);                                           // evening comes up from the horizon a row at a time
    if (glow > 0) { ctx.fillStyle = '#ffd34a'; ctx.fillRect(0, HORIZON - glow - 1, COLS, 1); ctx.fillStyle = '#ff8a3a'; ctx.fillRect(0, HORIZON - glow, COLS, glow); }
    blob(ctx, 24, 6 + 11 * late, 5.5, 5.5, mixHex('#fff27a', '#ffd23a', late));
    for (const [x, y, s] of [[30, 7, 9], [118, 4, 7], [215, 9, 10]]) {           // clouds, far away so they barely move
      const cx = wrap(x - scroll * 0.12, 250) - 30, col = mixHex('#eaf2ff', '#ffd9c2', late);
      blob(ctx, cx, y, s, s * 0.34, col); blob(ctx, cx - s * 0.35, y - 2, s * 0.45, s * 0.3, col); blob(ctx, cx + s * 0.4, y - 1, s * 0.4, s * 0.25, col);
    }
    for (let x = 0; x < COLS; x++) {                                             // two ranges of hills, moving slower than the track
      const a = x + scroll * 0.3, b = x + scroll * 0.55;
      ctx.fillStyle = '#0c6f58'; let h = Math.round(7 + 4 * Math.sin(a * 0.043) + 2 * Math.sin(a * 0.11 + 1)); ctx.fillRect(x, HORIZON - h, 1, h);
      ctx.fillStyle = '#12913f'; h = Math.round(3 + 2.5 * Math.sin(b * 0.06 + 2) + 1.5 * Math.sin(b * 0.17)); ctx.fillRect(x, HORIZON - h, 1, h);
    }
    ctx.fillStyle = '#35c842'; ctx.fillRect(0, HORIZON, COLS, TRACK - HORIZON); ctx.fillStyle = '#1f9a30'; ctx.fillRect(0, TRACK_END, COLS, STRIP - TRACK_END);
    ctx.fillStyle = '#b54d1c'; ctx.fillRect(0, TRACK, COLS, TRACK_END - TRACK);
    ctx.save(); ctx.beginPath(); ctx.rect(0, TRACK + 1, COLS, LANE - TRACK - 1); ctx.clip(); blob(ctx, X_NAP - 12 - scroll, TRACK + 6, 30, 7, '#86380f'); ctx.restore();                // the shade of the tree
    for (let x = 0; x < COLS; x++) {                                             // everything fixed to the ground scrolls with the track
      const w = x + scroll;
      if (K.hash(w, 3) < 0.06) { ctx.fillStyle = '#1f9a30'; ctx.fillRect(x, HORIZON + 1 + Math.floor(K.hash(w, 5) * 4), 1, 1); }                       // tufts
      if (K.hash(w, 7) < 0.09) { ctx.fillStyle = '#8f3a12'; ctx.fillRect(x, TRACK + 2 + Math.floor(K.hash(w, 9) * (TRACK_END - TRACK - 4)), 2, 1); }   // grit
      ctx.fillStyle = '#ffe7c4'; ctx.fillRect(x, TRACK, 1, 1); ctx.fillRect(x, TRACK_END - 1, 1, 1); if (wrap(w, 12) < 6) ctx.fillRect(x, LANE, 1, 1);   // lane lines
      if (wrap(w, 60) < 2) { ctx.fillStyle = '#f4f4f4'; ctx.fillRect(x, HORIZON + 1, 1, 4); }                                                          // marker posts
    }
    // start line, and the starter's flag on its post: up before the off, down at the off
    ctx.fillStyle = '#ffffff'; ctx.fillRect(X_START - scroll, TRACK, 2, TRACK_END - TRACK);
    const px = X_START + 5 - scroll, drop = K.seg(t, T_GO, T_GO + 0.28, K.ease.outBack), a = K.lerp(1.15, -0.55, drop) + (t < T_GO ? 0.1 * Math.sin(t * 7) : 0), fs = flagSprite;
    ctx.fillStyle = '#aab3bd'; ctx.fillRect(px, 11, 2, TRACK - 11);
    fs.clear(); const co = Math.cos(a), si = Math.sin(a), fx = 6 + 15 * co, fy = 21 - 15 * si;
    fs.limb(6, 21, fx, fy, 0.6, 2);
    fs.fill(0, 0, fs.w, fs.h, (x, y) => { const u = (x - 6) * co - (y - 21) * si, v = -(x - 6) * si - (y - 21) * co; return u > 6 && u <= 15.5 && v < -0.5 && v >= -7; }, 1);
    stamp(ctx, fs, 6, 21, px, 12, ['#2b0a06', '#ff2a1a', '#e8e8e8']);
    // the tree
    const tx = X_NAP + 4 - scroll;
    ctx.fillStyle = '#8a5220'; ctx.fillRect(tx, 12, 6, TRACK - 12 + 1); ctx.fillRect(tx - 1, TRACK - 1, 8, 2); ctx.fillStyle = '#5f3512'; ctx.fillRect(tx + 4, 12, 2, TRACK - 12 + 1);
    blob(ctx, tx + 3, 9, 22, 8.5, '#0d7a2c'); blob(ctx, tx - 12, 12, 11, 6, '#0d7a2c'); blob(ctx, tx + 17, 12, 11, 6, '#0d7a2c');
    blob(ctx, tx - 2, 5, 10, 3.5, '#2fb544'); blob(ctx, tx + 13, 8, 5, 2.5, '#2fb544'); blob(ctx, tx - 13, 10, 5, 2, '#2fb544');
    // the finish: a chequered line across both lanes and a chequered flag that waves
    const qx = X_FINISH - scroll;
    for (let y = TRACK; y < TRACK_END; y++) for (let x = 0; x < 4; x++) { ctx.fillStyle = ((x >> 1) + ((y - TRACK) >> 1)) % 2 ? '#101010' : '#ffffff'; ctx.fillRect(qx + x, y, 1, 1); }
    ctx.fillStyle = '#aab3bd'; ctx.fillRect(qx + 5, 5, 2, TRACK - 5);
    for (let x = 0; x < 12; x++) { const dy = Math.round(1.2 * Math.sin(x * 0.7 - f * 0.35) * (x / 11)); for (let y = 0; y < 8; y++) { ctx.fillStyle = ((x >> 1) + (y >> 1)) % 2 ? '#101010' : '#ffffff'; ctx.fillRect(qx + 7 + x, 5 + y + dy, 1, 1); } }
  }
  const flagSprite = makeSprite(28, 38);

  // one finished picture for time t
  function drawContent(ctx, t) {
    const f = Math.round(t * REFRESH), scroll = Math.round(scrollAt(t));
    scenery(ctx, t, scroll);
    // the hare, with whatever he is kicking up
    const hare = hareNow(t), hx = Math.round(hareNose(t) - 17 - scroll), fast = (t > T_GO + 0.1 && t < T_STOP - 0.38) || (t > T_DASH + 0.03 && t < T_DASH + 0.4);
    const skid = (t > T_STOP - 0.38 && t < T_STOP + 0.15) ? T_STOP - 0.38 : (t > T_DASH + 0.4 && t < T_DASH + 0.85) ? T_DASH + 0.4 : 0;
    if (fast) for (let k = 0; k < 4; k++) { const len = 6 + Math.floor(K.hash(f, k) * 12); ctx.fillStyle = '#ffffff'; ctx.fillRect(hx - 22 - len - Math.floor(K.hash(f, k + 9) * 10), HARE_Y - 4 - k * 5, len, 1); }   // speed lines
    for (const [t0, x0, dir] of [[T_GO + 0.08, X_START - 22, -1], [skid, hareNose(skid) + 2, 1], [T_DASH, X_NAP - 22, -1]]) {     // dust at every start and stop
      const u = K.seg(t, t0, t0 + 0.45);
      if (t0 && u > 0 && u < 1) for (let k = 0; k < 3; k++) blob(ctx, x0 - scroll + dir * (2 + k * 4 + u * 6), HARE_Y - 1 - k * 2 - u * 4, 1.2 + u * 2.2 - k * 0.3, 1 + u * 1.6, u < 0.6 ? '#ffe2b8' : '#e08a4a');
    }
    drawHare(hareSprite, hare.P); stamp(ctx, hareSprite, HARE_AX, HARE_AY, hx, HARE_Y - hare.lift, HARE_PAL, hare.flip);
    // Zzz while he sleeps, an exclamation mark when he wakes
    for (let k = 0; k < 8; k++) {
      const born = T_SLEEP + 0.1 + k * 0.55, u = (t - born) / 1.5;
      if (u > 0 && u < 1 && born < T_WAKE - 0.3 && t < T_WAKE + 0.1) pixmap(ctx, ZS[Math.min(2, Math.floor(u * 3))], X_NAP - 4 - scroll + Math.round(u * 9 + 2 * Math.sin(u * 7 + k)), HARE_Y - 16 - Math.round(u * 17), { '#': u > 0.85 ? '#7fa8e8' : '#ffffff' });
    }
    if (t > T_WAKE && t < T_DASH && (t - T_WAKE < 0.3 || f % 4 < 3)) dotText(ctx, '!', hx - 12, HARE_Y - 37, '#ffe000', 2);
    // the tortoise, in the near lane, in front of everything
    const d = plodded(t), tx = Math.round(X_START - 4 - 23 + d - scroll);
    drawTortoise(tortSprite, tortoiseNow(t)); stamp(ctx, tortSprite, TORT_AX, TORT_AY, tx, TORT_Y, TORT_PAL);
    // he wins: a cup pops up over his shell, and confetti comes down
    if (t > T_WIN) {
      for (let k = 0; k < 60; k++) {
        const age = t - T_WIN - K.hash(k, 1) * 1.2, y = -3 + age * (16 + 14 * K.hash(k, 2));
        if (age > 0 && y < STRIP - 2) { ctx.fillStyle = CONFETTI[k % CONFETTI.length]; ctx.fillRect(Math.round(X_FINISH - 70 + K.hash(k, 3) * 130 - scroll + 2 * Math.sin(age * 5 + k)), Math.round(y), K.hash(k, 4) < 0.5 ? 2 : 1, 1); }
      }
      const up = K.seg(t, T_WIN + 0.45, T_WIN + 0.8, K.ease.outBack);
      if (up > 0) { cupSprite.clear(); CUP.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== '.') cupSprite.dot(i + 1, j + 1, ch === 'Y' ? 1 : 2); })); stamp(ctx, cupSprite, 7, 13, tx + 1, TORT_Y - 19 - Math.round(up * 5) - (f % 16 < 8 ? 1 : 0), ['#3a2200', '#ffd91a', '#fffbd0']); }
    }
    // caption strip: one short line per beat; a new line pushes the old one up and out
    ctx.fillStyle = '#000000'; ctx.fillRect(0, STRIP, COLS, ROWS - STRIP); ctx.fillStyle = '#4a2f00'; ctx.fillRect(3, STRIP, COLS - 6, 1);
    let i = 0; while (i < CAPTIONS.length - 1 && t >= CAPTIONS[i + 1][0]) i++;
    const push = i ? K.seg(t, CAPTIONS[i][0], CAPTIONS[i][0] + 0.3, K.ease.out) : 1, line = (k, dy) => { const [, text, words] = CAPTIONS[k]; dotText(ctx, words ? text.split(' ').filter((_, n) => t >= words[n]).join(' ') : text, Math.round(COLS / 2 - dotWidth(text) / 2), STRIP + 2 + dy, '#ffb000'); };
    ctx.save(); ctx.beginPath(); ctx.rect(0, STRIP + 1, COLS, ROWS - STRIP - 1); ctx.clip();
    line(i, Math.round((1 - push) * 10)); if (push < 1) line(i - 1, -Math.round(push * 10));
    ctx.restore();
    // switch-on: each column of cabinets scans on downwards, slowly at first; the line being written runs hot.
    // On the first frame the scan is just passing the lamp the camera starts on
    const lag = (k) => (k * 7) % 5;
    for (let k = 0; k < COLS / CAB; k++) {
      const row = Math.floor(HERO[1] + 0.1 + lag(k) - lag(Math.floor(HERO[0] / CAB)) + 3.4 * t + 60 * t * t * t * t);
      if (row < ROWS) { ctx.fillStyle = '#000000'; ctx.fillRect(k * CAB, row + 1, CAB, ROWS); ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillRect(k * CAB, row, CAB, 1); }
    }
  }

  registerStyle({
    id: 'led-wall',
    name: 'LED Wall',
    family: 'Flat content made physical',
    look: 'A giant outdoor screen made of real lamps: thousands of frosted round LEDs in black louvred cabinets on a steel gantry at night. From far away it is a crisp bright picture; close up it falls apart into single glowing lamps, each with a red, a green and a blue chip under its lens.',
    motion: 'The wall plays pixel animation at one pixel per lamp and 30 pictures a second: characters built from a few flat colours with a dark outline walk, run, stop and react in real cycles, the ground scrolls under them lamp by lamp with slower hills behind, and one short caption per beat pushes up into a ticker strip along the bottom. The camera does the opposite of the content: one slow continuous pull from a single lamp to the whole wall, still drifting at the end.',
    light: 'The wall is the light. Its own colours spill onto the louvres and the black plastic between the lamps, glow in the haze around it, tint the steel and paint the wet ground, and all of it changes when the picture changes. One cold floodlight from behind gives the steel a rim; everything else is night.',
    materials: 'Frosted dome lenses in black collars, satin black louvres and cabinet faces with seams and screws, galvanised lattice steel, rubber cable, wet tarmac with dry patches and a painted line.',
    camera: 'Long lens. Starts as a macro shot at a low angle across the lamps with very shallow focus, pulls back and swings round to face the wall while the story waits on its opening pose, has the wall in frame by the time the first story event happens, and then keeps drifting back and across, low over the wet ground, to the last frame.',
    post: 'Soft bloom from the lamps, true-colour (neutral) tone mapping so the LED colours stay saturated, light vignette, very little grain. No scanline or pixel filters: the dots are real geometry.',
    explains: 'Any 2D animation, diagram or story that can be drawn at lamp resolution: a fable with two characters, a process with parts that move along a track, a chart that grows, a map with a route, a game-like sequence. Draw it on a small canvas with one pixel per lamp. A beat is something happening in that picture (a character sets off, stops, is overtaken, arrives); a label is one short dot-font line in the ticker strip; what moves is the pixel picture, while the wall, its housing and the light it throws stay the same and take their colour from whatever is playing.',
    topic: 'The Tortoise and the Hare, as a pixel cartoon playing on the lamp wall',
    duration: 12,
    fonts: [],
    render: { samples: 80, shutter: 0.5, tone: 'neutral', exposure: 1.0, bloom: 0.46, bloomThreshold: 1.0, vignette: 0.3, grain: 0.018, fov: 30, far: 400, background: '#020304' },

    build(S) {
      const { THREE, K, scene, camera } = S;
      const PITCH = 0.1, CABW = CAB * PITCH, WALL_W = COLS * PITCH, WALL_H = ROWS * PITCH, GROUND = -4.9;
      const fl = (x) => x.toFixed(5);
      const add = (geo, mat, x = 0, y = 0, z = 0, cast = true) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = true; scene.add(m); return m; };

      // ------------------------------------------------------------ the content canvas, shared by everything
      // One texture feeds the lamps (read at its exact pixels) and, read blurred through its mip levels, every
      // surface the wall lights: louvres, cabinet faces and the haze. So the spill always matches the picture.
      const cv = document.createElement('canvas'); cv.width = COLS; cv.height = ROWS;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      const content = new THREE.CanvasTexture(cv);
      content.colorSpace = THREE.SRGBColorSpace; content.generateMipmaps = true; content.minFilter = THREE.LinearMipmapLinearFilter;
      const U = { uContent: { value: content }, uGain: { value: 1 } };
      // a standard material with extra emitted light that is read from the content texture
      const wallMat = (params, vDecl, vBody, fDecl, fBody) => {
        const m = new THREE.MeshStandardMaterial(params);
        m.onBeforeCompile = (sh) => {
          Object.assign(sh.uniforms, U);
          sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform sampler2D uContent;\n' + vDecl).replace('#include <begin_vertex>', '#include <begin_vertex>\n' + vBody);
          sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform sampler2D uContent; uniform float uGain;\n' + fDecl).replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n' + fBody);
        };
        m.customProgramCacheKey = () => vBody + fBody;
        return m;
      };

      // ------------------------------------------------------------ night, haze and two floodlights
      K.env(S, { top: '#04060a', horizon: '#0a0e15', bottom: '#020203', intensity: 0.7, panels: [
        { pos: [-18, 20, -24], size: [6, 4], color: '#cfe0ff', power: 26 },
        { pos: [16, 12, 26], size: [10, 5], color: '#b9c9e6', power: 2.2 },
      ] });
      scene.fog = new THREE.FogExp2('#04060a', 0.009);
      K.spot(S, { pos: [-18, 20, -24], target: [2, -4, 5], color: '#cfe0ff', power: 900, angle: 0.5, penumbra: 1, soft: 0.8, far: 90 });   // rim from behind
      K.spot(S, { pos: [16, 12, 26], target: [0, 0, 0], color: '#c9d6ee', power: 160, angle: 0.5, penumbra: 1, shadow: false });            // just enough to see the hardware

      // ------------------------------------------------------------ cabinets: 18 x 18 lamps each, never perfectly aligned
      const NCX = COLS / CAB, NCY = ROWS / CAB, rnd = K.rng(7), cabs = [];
      const o = new THREE.Object3D();
      for (let j = 0; j < NCY; j++) for (let i = 0; i < NCX; i++) {
        o.position.set((i - (NCX - 1) / 2) * CABW, ((NCY - 1) / 2 - j) * CABW, rnd.range(-0.006, 0.006));
        o.rotation.set(rnd.range(-0.004, 0.004), rnd.range(-0.004, 0.004), rnd.range(-0.0012, 0.0012)); o.updateMatrix();
        const odd = i === 6 && j === 1;                      // one cabinet was replaced: a little dimmer and cooler than its neighbours
        cabs.push({ i, j, m: o.matrix.clone(), tint: odd ? [0.82, 0.9, 0.98] : new Array(3).fill(rnd.range(0.95, 1.03)) });
      }
      const DEAD = [[HERO[0] - 2, HERO[1] + 1], [21, 9], [22, 9], [139, 31], [101, 47]];   // lamps that have failed

      // lamps: a black collar and a frosted dome. The light is added in the shader from the lamp's own content pixel
      const R = 0.042;
      const lampGeo = (seg, steps) => {
        const pts = [[R, 0], [R, 0.011], [R * 0.84, 0.014], [R * 0.79, 0.014]];
        for (let i = 1; i <= steps; i++) { const a = (i / steps) * Math.PI / 2; pts.push([R * 0.79 * Math.cos(a), 0.014 + 0.03 * Math.sin(a)]); }
        const g = new THREE.LatheGeometry(pts.map((p) => new THREE.Vector2(p[0], p[1])), seg); g.rotateX(Math.PI / 2);
        const p = g.attributes.position, lens = new Float32Array(p.count);
        for (let i = 0; i < p.count; i++) lens[i] = Math.hypot(p.getX(i), p.getY(i)) < R * 0.8 ? 1 : 0;
        g.setAttribute('aLens', new THREE.BufferAttribute(lens, 1));
        return g;
      };
      const lampMat = wallMat({ color: '#3e4146', roughness: 0.42 },
        'attribute vec2 aCell; attribute vec3 aTint; attribute float aLens; varying vec3 vLamp, vSpill; varying vec2 vDisc; varying float vLens;',
        `vLamp = texture2D(uContent, aCell).rgb * aTint; vSpill = textureLod(uContent, aCell, 2.0).rgb; vDisc = position.xy / ${fl(R)}; vLens = aLens;`,
        'varying vec3 vLamp, vSpill; varying vec2 vDisc; varying float vLens;',
        `{ // three chips under one frosted lens: red, green and blue sit side by side and only mix in the diffuser,
           // so a white lamp seen close has three coloured hearts. The dome is brightest where it faces the viewer.
          vec2 cr = vDisc - vec2(-0.23, -0.13), cg = vDisc - vec2(0.23, -0.13), cb = vDisc - vec2(0.0, 0.26);
          vec3 d2 = vec3(dot(cr, cr), dot(cg, cg), dot(cb, cb)), chips = 2.8 * exp(-d2 / 0.013) + 0.2 * exp(-d2 / 0.07);   // a hot point and its halo
          float facing = 0.06 + 0.94 * pow(saturate(dot(normal, normalize(vViewPosition))), 2.0);
          totalEmissiveRadiance += vLens * uGain * (vLamp * (0.42 + chips) * facing + vSpill * 0.03);   // + a little light from the neighbours
          diffuseColor.rgb *= mix(0.06, 1.0, vLens);                                                           // the collar is black plastic
        }`);
      const cellsHi = [], cellsLo = [];
      for (const cab of cabs) for (let r = 0; r < CAB; r++) for (let c = 0; c < CAB; c++) {
        const cx = cab.i * CAB + c, cy = cab.j * CAB + r, vary = 0.86 + 0.22 * K.hash(cx, cy), dead = DEAD.some((d) => d[0] === cx && d[1] === cy);
        const p = new THREE.Vector3((c - (CAB - 1) / 2) * PITCH, ((CAB - 1) / 2 - r) * PITCH, 0).applyMatrix4(cab.m);
        (Math.abs(cx - HERO[0]) < 20 && Math.abs(cy - HERO[1]) < 13 ? cellsHi : cellsLo).push({ p, uv: [(cx + 0.5) / COLS, 1 - (cy + 0.5) / ROWS], tint: cab.tint.map((v) => (dead ? 0 : v * vary)) });
      }
      // full detail only around the lamp the camera starts on; the rest of the wall never fills more than a few pixels
      for (const [cells, geo] of [[cellsHi, lampGeo(36, 8)], [cellsLo, lampGeo(14, 4)]]) {
        const mesh = new THREE.InstancedMesh(geo, lampMat, cells.length); mesh.frustumCulled = false;
        geo.setAttribute('aCell', new THREE.InstancedBufferAttribute(new Float32Array(cells.flatMap((q) => q.uv)), 2));
        geo.setAttribute('aTint', new THREE.InstancedBufferAttribute(new Float32Array(cells.flatMap((q) => q.tint)), 3));
        cells.forEach((q, i) => K.place(mesh, i, [q.p.x, q.p.y, q.p.z]));
        scene.add(mesh);
      }

      // louvres: a black fin above every row of lamps. Its underside is lit by the row below it, in pools under each lamp
      const FINW = CABW - 0.016, finGeo = new THREE.BoxGeometry(FINW, 0.014, 0.07);
      const finMat = wallMat({ color: '#0b0b0c', roughness: 0.7 },
        'attribute vec3 aRow; varying vec2 vRowUv; varying vec3 vFin;',
        `vRowUv = vec2(aRow.x + (position.x / ${fl(FINW)} + 0.5) * aRow.z, aRow.y); vFin = vec3(normal.y, position.z / 0.07 + 0.5, 0.0);`,
        'varying vec2 vRowUv; varying vec3 vFin;',
        `{ float pool = 0.55 + 0.45 * cos(6.2832 * (vRowUv.x * ${fl(COLS)} - 0.5)), under = smoothstep(0.4, -0.4, vFin.x);
          vec3 below = textureLod(uContent, vRowUv, 0.6).rgb, above = textureLod(uContent, vRowUv + vec2(0.0, ${fl(1 / ROWS)}), 0.6).rgb;
          totalEmissiveRadiance += uGain * (below * under * pool * (0.1 - 0.05 * vFin.y) + above * (1.0 - under) * 0.012); }`);
      const fins = new THREE.InstancedMesh(finGeo, finMat, cabs.length * CAB); fins.frustumCulled = false;
      const finRow = new Float32Array(cabs.length * CAB * 3), m4 = new THREE.Matrix4();
      cabs.forEach((cab, k) => { for (let r = 0; r < CAB; r++) {
        const n = k * CAB + r;
        o.position.set(0, ((CAB - 1) / 2 - r) * PITCH + 0.05, 0.034); o.rotation.set(0.16, 0, 0); o.scale.set(1, 1, 1); o.updateMatrix();
        fins.setMatrixAt(n, m4.multiplyMatrices(cab.m, o.matrix));
        finRow.set([cab.i * CAB / COLS, 1 - (cab.j * CAB + r + 0.5) / ROWS, CAB / COLS], n * 3);
      } });
      finGeo.setAttribute('aRow', new THREE.InstancedBufferAttribute(finRow, 3)); scene.add(fins);

      // cabinet faces: black moulded plastic in four tiles, screws at the corners; lit in a ring round every lamp
      const faceMap = K.canvasTex(1024, 1024, (c, w) => {
        const r = K.rng(3); c.fillStyle = '#17171a'; c.fillRect(0, 0, w, w);
        for (let i = 0; i < 9000; i++) { c.fillStyle = `rgba(${r.chance(0.5) ? '255,255,255' : '0,0,0'},${r.range(0.02, 0.07)})`; c.fillRect(r() * w, r() * w, r.range(1, 3), r.range(1, 3)); }
        c.strokeStyle = '#050506'; c.lineWidth = 5; c.strokeRect(2, 2, w - 4, w - 4); c.beginPath(); c.moveTo(w / 2, 0); c.lineTo(w / 2, w); c.moveTo(0, w / 2); c.lineTo(w, w / 2); c.stroke();
        for (const x of [0.25, 0.75]) for (const y of [0.25, 0.75]) for (const [dx, dy] of [[-0.222, -0.222], [0.222, -0.222], [-0.222, 0.222], [0.222, 0.222]]) {
          const sx = (x + dx) * w, sy = (y + dy) * w; c.fillStyle = '#2c2d31'; c.beginPath(); c.arc(sx, sy, 7, 0, 7); c.fill(); c.strokeStyle = '#08080a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(sx - 5, sy); c.lineTo(sx + 5, sy); c.stroke();
        }
      });
      const FACE = CABW - 0.012, faceGeo = new THREE.BoxGeometry(FACE, FACE, 0.3); faceGeo.translate(0, 0, -0.15);
      const faceMat = wallMat({ map: faceMap, bumpMap: faceMap, bumpScale: 0.6, roughness: 0.55 },
        'attribute vec4 aRect; varying vec2 vWallUv, vCabUv; varying float vFront;',
        `vCabUv = position.xy / ${fl(CABW)} + 0.5; vWallUv = aRect.xy + vCabUv * aRect.zw; vFront = normal.z;`,
        'varying vec2 vWallUv, vCabUv; varying float vFront;',
        `{ float d = length(fract(vCabUv * ${fl(CAB)}) - 0.5);
          totalEmissiveRadiance += step(0.5, vFront) * uGain * (texture2D(uContent, vWallUv).rgb * 0.025 * smoothstep(0.7, 0.3, d) + textureLod(uContent, vWallUv, 2.5).rgb * 0.006); }`);
      const faces = new THREE.InstancedMesh(faceGeo, faceMat, cabs.length); faces.frustumCulled = false; faces.receiveShadow = true;
      cabs.forEach((cab, k) => faces.setMatrixAt(k, cab.m));
      faceGeo.setAttribute('aRect', new THREE.InstancedBufferAttribute(new Float32Array(cabs.flatMap((cab) => [cab.i * CAB / COLS, 1 - (cab.j + 1) * CAB / ROWS, CAB / COLS, CAB / ROWS])), 4));
      scene.add(faces);

      // ------------------------------------------------------------ the gantry
      // Steel and paint take the colour of the nearest part of the picture (read very blurred), as if lit through the haze
      const litByWall = (params, k) => wallMat(params, 'varying vec3 vWp;',
        'vec4 wp = vec4(transformed, 1.0);\n#ifdef USE_INSTANCING\nwp = instanceMatrix * wp;\n#endif\nvWp = (modelMatrix * wp).xyz;',
        'varying vec3 vWp;',
        `{ vec2 w = vWp.xy / vec2(${fl(WALL_W)}, ${fl(WALL_H)}) + 0.5, q = clamp(w, 0.0, 1.0);
          totalEmissiveRadiance += textureLod(uContent, q, 4.6).rgb * uGain * ${fl(k)} * exp(-length((w - q) * vec2(${fl(WALL_W)}, ${fl(WALL_H)})) * 0.45); }`);
      const steel = litByWall({ color: '#7d8288', roughness: 0.5, metalness: 0.85 }, 0.05);
      const paint = litByWall({ color: '#0d0e10', roughness: 0.5, metalness: 0.3 }, 0.012);
      const rubber = new THREE.MeshStandardMaterial({ color: '#070708', roughness: 0.6 });
      add(new THREE.BoxGeometry(WALL_W + 0.2, WALL_H + 0.2, 0.3), paint, 0, 0, -0.42);                                  // back box
      const BZ = 0.16, HW = WALL_W / 2, HH = WALL_H / 2;
      for (const s of [-1, 1]) {                                                                                         // painted frame round the cabinets
        add(K.roundedBox(WALL_W + BZ * 2, BZ, 0.5, 0.02, 2), paint, 0, s * (HH + BZ / 2 + 0.01), -0.16);
        add(K.roundedBox(BZ, WALL_H + 0.02, 0.5, 0.02, 2), paint, s * (HW + BZ / 2 + 0.01), 0, -0.16);
      }
      const struts = [];                                                       // every steel member: [from, to, thickness]
      const mast = (x, z, w, y0, y1) => {                                      // a square lattice mast with zig-zag bracing
        const h = w / 2, n = Math.round((y1 - y0) / (w * 1.15)), dy = (y1 - y0) / n, cs = [[-h, -h], [h, -h], [h, h], [-h, h]];
        cs.forEach(([a, b]) => struts.push([[x + a, y0, z + b], [x + a, y1, z + b], 0.07]));
        for (let k = 0; k < n; k++) cs.forEach(([a, b], q) => { const [c, d] = cs[(q + 1) % 4], ya = y0 + k * dy, yb = ya + dy, flip = (k + q) % 2;
          struts.push([[x + a, flip ? yb : ya, z + b], [x + c, flip ? ya : yb, z + d], 0.035]); struts.push([[x + a, yb, z + b], [x + c, yb, z + d], 0.035]); });
      };
      const MX = HW + 0.62, TOP = HH + 1.25;
      for (const s of [-1, 1]) {
        mast(s * MX, -0.36, 0.62, GROUND, TOP);
        add(K.roundedBox(1.05, 0.07, 1.05, 0.015, 2), steel, s * MX, GROUND + 0.035, -0.36);                             // base plate
        for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) add(new THREE.CylinderGeometry(0.035, 0.035, 0.1, 6), steel, s * MX + a * 0.42, GROUND + 0.09, -0.36 + b * 0.42);
      }
      for (const z of [-0.05, -0.67]) for (const y of [HH + 0.4, TOP]) struts.push([[-MX, y, z], [MX, y, z], 0.07]);     // top truss
      for (let k = 0, n = 22; k < n; k++) for (const z of [-0.05, -0.67]) { const xa = -MX + (k / n) * MX * 2, xb = xa + MX * 2 / n; struts.push([[xa, k % 2 ? TOP : HH + 0.4, z], [xb, k % 2 ? HH + 0.4 : TOP, z], 0.04]); }
      for (const s of [-1, 1]) for (const y of [-HH - 0.28, HH + 0.29]) struts.push([[s * (HW - 0.4), y, -0.36], [s * (MX + 0.3), y, -0.36], 0.12]);   // the frame hangs on stubs
      struts.push([[-MX, -HH - 0.28, -0.36], [MX, -HH - 0.28, -0.36], 0.1]);
      const strutMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), steel, struts.length), up = new THREE.Vector3(0, 1, 0), dir = new THREE.Vector3();
      struts.forEach(([a, b, w], i) => {
        dir.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]); const len = dir.length();
        o.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2); o.quaternion.setFromUnitVectors(up, dir.normalize()); o.scale.set(w, len, w); o.updateMatrix(); strutMesh.setMatrixAt(i, o.matrix);
      });
      strutMesh.castShadow = strutMesh.receiveShadow = true; strutMesh.frustumCulled = false; scene.add(strutMesh);
      // cables: three runs out of the bottom corner, down the mast and across the ground to a floor box
      for (let k = 0; k < 3; k++) {
        const e = k * 0.07, g = GROUND + 0.035;
        add(K.tube([[HW - 0.6 - e, -HH - 0.2, -0.3], [HW - 0.2, -HH - 0.62 - e, -0.2], [HW + 0.28, -HH - 0.3 + e, -0.02], [HW + 0.3 + e, GROUND + 0.5, 0.02], [HW + 0.1, g, 0.5 + e], [HW - 1.2, g, 1.3 + e * 2], [HW - 2.6, g, 1.1 + e], [HW - 3.6, g, 1.75 + e]], 0.028, { segments: 90, radial: 8 }), rubber);
      }
      add(K.roundedBox(0.7, 0.34, 0.5, 0.03, 3), paint, HW - 3.9, GROUND + 0.17, 1.8);

      // ------------------------------------------------------------ wet ground: a mirror (the water) under dry tarmac patches
      const grit = K.canvasTex(512, 512, (c, w) => { const r = K.rng(9); c.fillStyle = '#808080'; c.fillRect(0, 0, w, w); for (let i = 0; i < 26000; i++) { const v = r.int(40, 215); c.fillStyle = `rgb(${v},${v},${v})`; c.fillRect(r() * w, r() * w, r.range(1, 3), r.range(1, 3)); } }, { repeat: [40, 40], data: true });
      K.mirrorFloor(S, { y: GROUND, size: 200, color: '#07080a', roughness: 0.14, strength: 1, fresnel: true, surfaceRoughness: 0.5, material: { bumpMap: grit, bumpScale: 0.5 } });
      const nz = K.noise(21);
      const dry = K.canvasTex(512, 512, (c, w) => {            // white = dry, black = standing water, soft edges
        const img = c.createImageData(w, w);
        for (let y = 0; y < w; y++) for (let x = 0; x < w; x++) { const v = 255 * K.smooth(0.02, 0.2, nz.fbm(x / 40, y / 40, 0, 4) + 0.1 * nz.n2(x / 6, y / 6)); img.data.set([v, v, v, 255], (y * w + x) * 4); }
        c.putImageData(img, 0, 0);
      }, { data: true });
      const tarmac = new THREE.MeshStandardMaterial({ color: '#2c2e33', roughness: 0.85, map: grit, alphaMap: dry, transparent: true, opacity: 0.45 });
      const patches = add(new THREE.PlaneGeometry(70, 70), tarmac, 0, GROUND + 0.004, 8, false); patches.rotation.x = -Math.PI / 2;
      const line = add(new THREE.PlaneGeometry(60, 0.14), new THREE.MeshStandardMaterial({ color: '#c9cbc6', roughness: 0.7, transparent: true, opacity: 0.8 }), 0, GROUND + 0.006, 3.4, false); line.rotation.x = -Math.PI / 2;

      // ------------------------------------------------------------ the light the wall throws
      // Haze: sheets of mist in front of the wall, each showing the picture more blurred and further spread the
      // further out it hangs. Together they read as glow in wet air, in the colours on screen right now.
      const mist = K.canvasTex(256, 256, (c, w) => {
        const img = c.createImageData(w, w), n = K.noise(5);
        for (let y = 0; y < w; y++) for (let x = 0; x < w; x++) { const v = 255 * K.clamp(0.5 + 0.9 * n.fbm(x / 64, y / 64, 0, 4)); img.data.set([v, v, v, 255], (y * w + x) * 4); }
        c.putImageData(img, 0, 0);
      }, { repeat: [1, 1], data: true });
      const sheets = [0.5, 1.3, 2.4, 3.8, 5.6].map((z, k) => {
        const grow = 1 + z * 0.22, m = new THREE.ShaderMaterial({
          transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
          uniforms: { uContent: U.uContent, uGain: U.uGain, uMist: { value: mist }, uLod: { value: 3.4 + k * 0.6 }, uGrow: { value: grow }, uAmount: { value: 0 }, uDrift: { value: 0 } },
          vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
          fragmentShader: `uniform sampler2D uContent, uMist; uniform float uGain, uLod, uGrow, uAmount, uDrift; varying vec2 vUv;
            void main(){ vec2 p = (vUv - 0.5) * uGrow + 0.5, q = clamp(p, 0.0, 1.0);              // p: where we are on the wall, running past its edges
              float past = length((p - q) * vec2(${fl(WALL_W)}, ${fl(WALL_H)}));
              float edge = smoothstep(0.0, 0.2, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
              float m = texture2D(uMist, vUv * vec2(1.6, 0.8) + vec2(uDrift, 0.0)).r;
              gl_FragColor = vec4(textureLod(uContent, q, uLod).rgb * exp(-past * 0.9) * mix(0.35, 1.0, smoothstep(0.0, 0.5, past)) * edge * (0.7 + 0.6 * m) * uAmount * uGain, 1.0); }`,
        });
        add(new THREE.PlaneGeometry(WALL_W * grow, WALL_H * grow), m, 0, 0, z, false);
        return { z, m, k };
      });
      // Spill: twelve coloured lights on the face of the wall, each taking the average colour of its part of the
      // picture. They shine straight out with a very wide soft cone, like a glowing surface does, so they light the
      // ground and whatever stands in front, and never the wall itself.
      const ZX = 6, ZY = 2, zones = [];
      for (let j = 0; j < ZY; j++) for (let i = 0; i < ZX; i++) {
        const l = new THREE.SpotLight('#000000', 1, 0, 1.5, 1, 2); l.position.set(((i + 0.5) / ZX - 0.5) * WALL_W, (0.5 - (j + 0.5) / ZY) * WALL_H, 0.12);
        l.target.position.set(l.position.x, l.position.y, 10); scene.add(l, l.target); zones.push(l);
      }
      const lin = Array.from({ length: 256 }, (_, v) => Math.pow(v / 255, 2.2));
      let shown = -1;
      // Draw the picture for time t. The wall only changes 30 times a second, between two camera exposures, so the
      // lamps never smear; the cache key is the picture number, which keeps this a pure function of t.
      function show(t) {
        const f = Math.round(t * REFRESH);
        if (f === shown) return; shown = f;
        drawContent(ctx, f / REFRESH); content.needsUpdate = true;
        const px = ctx.getImageData(0, 0, COLS, ROWS).data, zw = COLS / ZX, zh = ROWS / ZY;
        zones.forEach((l, k) => {
          let r = 0, g = 0, b = 0; const x0 = (k % ZX) * zw, y0 = Math.floor(k / ZX) * zh;
          for (let y = y0; y < y0 + zh; y++) for (let x = x0; x < x0 + zw; x++) { const i = (y * COLS + x) * 4; r += lin[px[i]]; g += lin[px[i + 1]]; b += lin[px[i + 2]]; }
          l.color.setRGB(r / (zw * zh), g / (zw * zh), b / (zw * zh));
        });
      }

      // ------------------------------------------------------------ camera: one pull from a single lamp to the whole wall
      // The camera sits on a boom around its target: distance (as a logarithm, so the pull feels even), swing to the
      // side and height angle. K.path flows through the keys; the last key lies after the end so it never stops.
      // The animals fidget at the line during the pull, and the wall is in frame when the flag drops, so no story beat is missed.
      const hx = (HERO[0] - (COLS - 1) / 2) * PITCH, hy = ((ROWS - 1) / 2 - HERO[1]) * PITCH, D = Math.PI / 180;
      const cam = {
        dist: K.path([[0, Math.log(0.5)], [0.6, Math.log(0.64)], [1.1, Math.log(1.6)], [1.65, Math.log(6.6)], [2.3, Math.log(16.5)], [3.8, Math.log(19.6)], [14, Math.log(22)]]),
        swing: K.path([[0, 40 * D], [0.7, 34 * D], [1.65, 15 * D], [2.3, 8 * D], [3.8, 5.5 * D], [14, -4 * D]]),
        rise: K.path([[0, -20 * D], [0.7, -17 * D], [1.65, -8 * D], [2.3, -9 * D], [3.8, -8 * D], [14, -7 * D]]),
        wide: K.path([[0, [-1.0, 0.3, 0]], [2.3, [0, -0.5, 0]], [3.8, [0, -1.0, 0]], [14, [0, -1.05, 0]]]),   // where it looks once it is far away
        lens: K.track([[0, 0.022], [0.7, 0.026], [1.65, 0.05], [2.3, 0.03], [8, 0.02]]),
        gain: K.track([[0, 3.5], [1.65, 3.5], [8, 3.8]]),                 // exposure, opened up a touch for the far wall
      };
      const SPILL = 65;

      return {
        update(t) {
          show(t);
          // the target slides from the first lamp to the middle of the wall in step with the distance, so the picture
          // never crosses the frame faster than the pull itself
          const ld = cam.dist(t), d = Math.exp(ld), a = cam.swing(t), e = cam.rise(t), gain = cam.gain(t), w = K.smooth(0, Math.log(12), ld);
          const aim = cam.wide(t).map((v, k) => K.lerp([hx, hy, 0.03][k], v, w));
          const pos = [aim[0] + d * Math.sin(a) * Math.cos(e), aim[1] + d * Math.sin(e), aim[2] + d * Math.cos(a) * Math.cos(e)];
          K.look(camera, pos, aim); K.focus(camera, aim, cam.lens(t));
          U.uGain.value = gain;
          for (const l of zones) l.intensity = SPILL * gain;
          for (const s of sheets) { s.m.uniforms.uAmount.value = 0.009 * K.smooth(0.2, 3.5, pos[2] - s.z); s.m.uniforms.uDrift.value = t * 0.012 + s.k * 0.37; }   // a sheet fades out before the camera passes through it
        },
      };
    },

    sound(k) {
      const D = 12;
      const panAt = (t, x) => K.clamp(((x - scrollAt(t)) / COLS - 0.5) * 1.4, -0.8, 0.8);     // where on the wall something is
      k.bed('hum', 0, D, { gain: 0.5 }); k.bed('room', 0, D, { gain: 0.9 });
      // switch-on: the scan buzzes down the wall and the last row lands with a relay; then the pull back
      k.play('neon', 0, { dur: 1.0, gain: 1.0 }); k.play('tock', 1.0, { gain: 0.8, f: 500 });
      k.withMinor(() => { for (let i = 0; i < 9; i++) k.play('click', 0.02 + 0.98 * Math.pow(i / 9, 0.6), { gain: 0.6, f: 1500 + i * 90, pan: -0.3 + i * 0.07 }); });
      k.play('whoosh', 0.8, { dur: 1.6, gain: 0.45, top: 1400 });
      // the wall's own soundtrack, as if from its speakers: a chip tune that is quick for the sprint, slow for the nap
      // and bright for the finish. Every caption arrives with a small tick.
      k.music('chip', T_GO, T_STOP + 0.15, { bpm: 176, chords: [['C4', 'E4', 'G4', 'C5'], ['F4', 'A4', 'C5', 'F5']], gain: 0.9 });
      k.music('chip', T_SLEEP, T_WAKE - 0.1, { bpm: 80, chords: [['A3', 'C4', 'E4', 'A4']], gain: 0.55 });
      k.music('chip', T_WIN + 0.5, D - 0.3, { bpm: 152, chords: [['C4', 'E4', 'G4', 'C5'], ['F4', 'A4', 'C5', 'F5'], ['G4', 'B4', 'D5', 'G5']], gain: 0.7 });
      k.withMinor(() => CAPTIONS.slice(1).forEach(([t]) => k.play('tick', t + 0.05, { gain: 0.7, f: 2600 })));
      // the hare's three hops at the line; set: a low blip as he crouches. Go: the flag swishes down like a starting pistol
      k.withMinor(() => { for (let i = 0; i < 3; i++) k.play('tock', 0.6 + i * 0.3, { gain: 0.35, f: 520 }); });
      k.play('blip', T_GO - 0.9, { f: 'C5', dur: 0.09, gain: 0.8 });
      k.play('slap', T_GO, { gain: 0.9 }); k.play('swish', T_GO, { dur: 0.25, gain: 0.8 }); k.play('blip', T_GO, { f: 'C6', dur: 0.2, gain: 0.9 });
      // the hare: a sprint is a whoosh and a patter of feet (one bound every 0.2 s), a stop is a skid
      const dash = (t0, t1) => {
        k.play('jump', t0, { gain: 0.7 }); k.play('whoosh', t0, { dur: t1 - t0 + 0.2, gain: 0.7, pan: panAt(t0, hareNose(t0)) });
        k.withMinor(() => { for (let t = t0 + 0.05; t < t1; t += 0.1) k.play('tick', t, { gain: 0.8, f: 1700, pan: panAt(t, hareNose(t)) }); });
        k.noise(t1, { dur: 0.45, color: 'pink', filter: 'bandpass', f: [[0, 3200], [0.45, 700]], q: 1.4, gain: 0.3, a: 0.02, pan: panAt(t1, hareNose(t1)) });
      };
      dash(T_GO + 0.08, T_STOP - 0.38); dash(T_DASH, T_DASH + 0.4);
      k.play('pop', T_STOP + 0.12, { gain: 0.6 });
      ['G6', 'E6', 'G6', 'E6', 'G6'].forEach((f, i) => k.play('blip', T_LOOK + 0.06 + i * 0.12, { f, dur: 0.06, gain: 0.7 }));           // he looks back and laughs
      k.tone(T_YAWN, { f: [[0, 380], [0.25, 560], [0.7, 250]], type: 'triangle', dur: 0.75, gain: 0.07, a: 0.1, hold: 0.35 });    // yawn
      k.play('thud', T_SLEEP - 0.12, { gain: 0.22, f: 100 });                                                                    // flop
      for (let t = T_SLEEP + 0.1; t < T_WAKE - 0.5; t += 1) {                                                                  // snoring: in through the nose, out in a whistle
        k.noise(t, { dur: 0.5, color: 'brown', filter: 'bandpass', f: [[0, 180], [0.45, 420]], q: 3, gain: 0.5, a: 0.3 });
        k.tone(t + 0.6, { f: [[0, 1250], [0.4, 800]], dur: 0.45, gain: 0.035, a: 0.08, hold: 0.15 });
      }
      k.play('blip', T_WAKE, { f: 'A6', dur: 0.07, gain: 1 }); k.play('blip', T_WAKE + 0.1, { f: 'A6', dur: 0.12, gain: 1 }); k.play('jump', T_WAKE + 0.02, { gain: 0.6 });   // !
      k.play('hurt', T_DASH + 0.95, { gain: 0.45 });                                                                           // too late
      // the tortoise: the same soft footfall from the off to the line, every 10 lamps, never faster, never slower
      k.withMinor(() => { let n = 1; for (let t = T_GO; t < D; t += 1 / 240) if (plodded(t) >= n * STEP / 2) { k.play('tock', t, { gain: 0.5, f: n % 2 ? 190 : 170, pan: panAt(t, X_START - 20 + plodded(t)) }); n++; } });
      // he wins: a coin on the line, a fanfare when the cup pops up
      k.play('coin', T_WIN, { gain: 1 }); k.play('success', T_WIN + 0.06, { gain: 0.8 });
      k.play('powerup', T_WIN + 0.45, { gain: 0.9 }); k.play('sparkle', T_WIN + 0.8, { gain: 0.8 }); k.play('sparkle', T_WIN + 1.5, { gain: 0.6 });
    },
  });
}
```
