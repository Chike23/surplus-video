I want a short 3D motion graphic made with three.js in the "Floating Screens" style. Below is the complete source of a reference animation in this exact style, plus the small rendering kit and sound kit it runs on. Use them as your style guide and rebuild the animation around my content.

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
- Load these Google Fonts before building (the kit awaits the specs in style.fonts): Fraunces, Inter

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
Name: Floating Screens
Family: Products and screens
Use: explainer
Look: Screens as objects: white cards printed with a real interface, each backed by a block of clear glass, hanging one in front of the other in a bright, warm room. The newest card is always nearest and sharpest; the ones before it stay behind it, softly out of focus.
Motion: A card swings in from the side like a heavy door, slides to its place and settles. Buttons sink when pressed and the whole card gives a little. A thin cable draws itself from the pressed button to the edge of the next card, and at the end one highlight runs through the whole chain.
Light: One big soft window light from the upper right in front, so every card throws a soft shadow onto the card behind it and a softer one onto the wall, and every raised button and tile has its own small shadow. A bright room fills the shadows: nothing goes dark.
Materials: Matt printed card stock on thick glass with polished, slightly green edges; raised interface pieces in the same card; a painted plaster wall. Warm paper, dark ink and exactly one accent colour.
Camera: Long lens on a dolly that rolls past the row at one steady speed and never stops. It pans to stay on the newest card, hands over to the next one as it flies in, and finally cranes back until the whole sequence is in frame. Focus always sits on the newest card.
Finish: Neutral tone mapping so interface colours stay exact, real depth of field and motion blur, a faint vignette, almost no grain. Bloom is set so that only a glass edge that lights up glows.
Good for: Anything made of steps or screens: an app flow, a workflow, a process, a set of stats or quotes. One card per step, the action on each card acted out, a cable from each step to the next.

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

REFERENCE STYLE SOURCE (styles/floating-screens.js; its sample topic was "Ordering bread online from a small bakery in three steps: choose the loaf, check the basket, order confirmed")
```js
{
  // ---------------------------------------------------------------- content (change this for a new topic)
  // Three screens of one small story. Every word and number on the cards comes from this block.
  const SHOP = { name: 'Tin Robin', kind: 'BAKERY', street: '14 Mill Lane' };
  const ITEM = { title: ['Country', 'Sourdough'], name: 'Country Sourdough', tag: 'BAKED THIS MORNING', note: 'Slow-fermented for 24 hours', price: 8 };
  const ORDER = { from: 1, to: 2, day: 'Saturday', time: '8:00 am', number: 'Order no. 1042' };
  const STEPS = ['Choose', 'Basket', 'Confirmed'];               // the little tag on the corner of each card
  const money = (v) => '$' + v.toFixed(2);
  // warm paper, dark ink and ONE accent colour that is only used for "the thing you press" and "done"
  const C = { paper: '#ffffff', ink: '#1f1b16', muted: '#8b8376', line: '#e9e2d6', tile: '#f5efe5', crumb: '#f1e3c9', accent: '#14805a', soft: '#dcefe5', wall: '#e2c6ad' };

  // ---------------------------------------------------------------- the schedule (picture and sound share it)
  const T = {
    A: -0.75,              // card 1 slides in just before the clip starts, so frame one catches it settling
    add: 1.1,              // "Add to basket" is pressed
    B: 1.4,                // card 2 slides in
    plus: 2.75,            // "+" is pressed: 1 loaf becomes 2, the total rolls up
    order: 3.5,            // "Place order" is pressed
    C: 3.8,                // card 3 slides in
    tick: 4.85,            // the tick lands
    wide: [5.55, 7.0],     // the camera pulls back to show all three steps
    recap: 6.45,           // a highlight runs through the whole flow once
  };
  const LINK = [[T.add + 0.15, T.B + 1.0], [T.order + 0.15, T.C + 1.0]];   // when each connector draws itself (it lands as the next card settles)
  const HOP = 0.3;                                                         // recap: seconds from one card to the next
  // the moments each card's glass edge lights up: when its cable plugs in, and once more in the recap
  const FLASH = [[T.recap], [LINK[0][1], T.recap + HOP], [LINK[1][1], T.recap + 2 * HOP]];

  // ---------------------------------------------------------------- the cards (world units: 1 point of interface = 1 cm)
  const PT = 0.01, CW = 480, CH = 330, RAD = 26;       // every card is designed on a 480 x 330 point grid
  const PX = 4;                                        // texture pixels per point
  const SHEET = 0.024, GLASS = 0.16, RIM = 0.13;       // printed sheet, the glass block behind it, how far the glass shows around the sheet
  const STEP = [3.5, -0.3, 2.2];                       // each card sits this far from the one before: right, a little lower, nearer
  const YAW = [0.08, 0.02, -0.05];                     // a slight fan, so the cards are not parallel like a spreadsheet
  const FROM = { pos: [6.0, -0.4, 1.2], rot: [0.1, -0.8, 0.09] };   // where a card flies in from, relative to its place, and how it is turned
  const BTN = { x: 32, y: 262, w: 196, h: 46 };        // the main button sits in the same place on every card: that is where the connector leaves
  const PORT_Y = 255;                                  // height (points) at which a connector plugs into the next card's left edge

  // ---------------------------------------------------------------- canvas helpers (all drawing is in points)
  const say = (c, str, x, y, font, color, align = 'left', spacing = 0) => { c.font = font; c.fillStyle = color; c.textAlign = align; c.textBaseline = 'middle'; c.letterSpacing = spacing + 'px'; c.fillText(str, x, y); c.letterSpacing = '0px'; };
  const pill = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
  const mix = (a, b, k) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), K.clamp(k)).getHexString();
  // a tick that draws itself: p = 0..1
  const tick = (c, x, y, s, p = 1, color = '#fff') => {
    if (p <= 0.01) return;
    c.beginPath(); c.moveTo(x - 0.42 * s, y + 0.04 * s); c.lineTo(x - 0.12 * s, y + 0.33 * s); c.lineTo(x + 0.45 * s, y - 0.3 * s);
    c.lineWidth = s * 0.2; c.lineCap = c.lineJoin = 'round'; c.strokeStyle = color; c.setLineDash([s * 1.32 * p, s * 3]); c.stroke(); c.setLineDash([]);
  };
  // the product "photo", as a flat drawing: a round loaf with a scored ear of wheat
  const loaf = (c, x, y, s) => {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = 'rgba(120,78,26,0.2)'; c.beginPath(); c.ellipse(4, 41, 60, 10, 0, 0, 7); c.fill();                 // its shadow on the table
    const g = c.createRadialGradient(-18, -22, 4, 0, 2, 70);
    g.addColorStop(0, '#f0c47c'); g.addColorStop(0.5, '#d89a45'); g.addColorStop(1, '#a8632a');
    c.beginPath(); c.ellipse(0, 0, 63, 45, 0, 0, 7); c.fillStyle = g; c.fill();                                       // the crust
    c.save(); c.clip();
    c.strokeStyle = 'rgba(255,243,214,0.55)'; c.lineWidth = 2.2; c.lineCap = 'round';                                 // flour rings from the proving basket
    for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(0, 4, 20 + i * 11, 13 + i * 8, 0, Math.PI * 1.06, Math.PI * 1.94); c.stroke(); }
    c.restore();
    c.lineCap = 'round';
    const cut = (x0, y0, x1, y1, w) => { c.beginPath(); c.moveTo(x0, y0 + 1.6); c.lineTo(x1, y1 + 1.6); c.lineWidth = w + 2.5; c.strokeStyle = '#9a5a25'; c.stroke(); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.lineWidth = w; c.strokeStyle = '#f9ebcb'; c.stroke(); };
    const dx = 0.9, dy = -0.436;                                                                                      // direction of the long cut
    cut(-32, 15, 28, -14, 4.2);
    for (let i = 0; i < 4; i++) for (const side of [-1, 1]) {                                                         // short cuts leaning forward on both sides
      const bx = -22 + i * 13 * dx, by = 10.2 + i * 13 * dy, a = side * 0.85, lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a);
      cut(bx + lx * 5, by + ly * 5, bx + lx * 16, by + ly * 16, 3.2);
    }
    c.restore();
  };
  const basketIcon = (c, x, y, color) => { c.strokeStyle = color; c.lineWidth = 1.8; c.lineCap = c.lineJoin = 'round'; c.beginPath(); c.moveTo(x - 9, y - 3); c.lineTo(x + 9, y - 3); c.lineTo(x + 6.5, y + 8); c.lineTo(x - 6.5, y + 8); c.closePath(); c.stroke(); c.beginPath(); c.arc(x, y - 3, 5.5, Math.PI, 0); c.stroke(); };
  const wordmark = (c, x, y) => { c.beginPath(); c.arc(x + 7, y, 7, 0, 7); c.fillStyle = C.accent; c.fill(); say(c, SHOP.name, x + 22, y + 1, '600 19px "Fraunces"', C.ink); say(c, SHOP.kind, x + 22 + 96, y + 1.5, '600 10px "Inter"', C.muted, 'left', 1.6); };

  // ---------------------------------------------------------------- the three screens
  // Each screen is a static face plus a few raised pieces (see `card.piece` below). A piece is drawn by a function
  // (c, state, w, h): the state is whatever that piece animates (a press, a count), so the face itself never repaints.

  // any button: accent with a white label, turning into a soft "done" state. state: { on: 0..1, rip: 0..1 (the touch ripple) }
  const button = (label, done) => (c, s, w, h) => {
    c.fillStyle = mix(C.accent, C.soft, s.on); c.fillRect(0, 0, w, h);
    if (s.rip > 0 && s.rip < 1) { c.beginPath(); c.arc(w * 0.5, h * 0.5, w * 0.62 * K.ease.out(s.rip), 0, 7); c.fillStyle = `rgba(255,255,255,${0.34 * (1 - s.rip)})`; c.fill(); }
    c.globalAlpha = K.clamp(1 - s.on * 1.6); say(c, label, w / 2, h / 2 + 0.5, '600 17px "Inter"', '#ffffff', 'center');
    c.globalAlpha = K.clamp(s.on * 1.6 - 0.6); say(c, done, w / 2 + 11, h / 2 + 0.5, '600 17px "Inter"', C.accent, 'center');
    c.font = '600 17px "Inter"'; tick(c, w / 2 - c.measureText(done).width / 2 - 3, h / 2, 13, 1, C.accent);
    c.globalAlpha = 1;
  };
  // the step tag on a card's corner. state: { on: 0..1 }
  const chip = (n, label) => (c, s, w, h) => {
    c.fillStyle = mix(C.paper, C.accent, s.on); c.fillRect(0, 0, w, h);
    c.beginPath(); c.arc(h / 2, h / 2, h / 2 - 5, 0, 7); c.fillStyle = mix(C.tile, '#0c6646', s.on); c.fill();
    say(c, String(n), h / 2, h / 2 + 0.5, '700 13px "Inter"', mix(C.muted, '#ffffff', s.on), 'center');
    say(c, label, h + 1, h / 2 + 0.5, '600 14px "Inter"', mix(C.ink, '#ffffff', s.on));
  };

  // 1. the product page
  const drawProduct = (c) => {
    c.fillStyle = C.paper; c.fillRect(0, 0, CW, CH);
    wordmark(c, 32, 40);
    say(c, 'Bread', 318, 41, '500 13px "Inter"', C.ink); say(c, 'Pastry', 366, 41, '500 13px "Inter"', C.muted);
    basketIcon(c, 438, 40, C.ink);
    say(c, ITEM.tag, 33, 96, '600 11px "Inter"', C.accent, 'left', 1.5);
    say(c, ITEM.title[0], 30, 133, '600 40px "Fraunces"', C.ink); say(c, ITEM.title[1], 30, 174, '600 40px "Fraunces"', C.ink);
    say(c, ITEM.note, 32, 209, '400 13.5px "Inter"', C.muted);
    say(c, money(ITEM.price), 32, 240, '700 22px "Inter"', C.ink);
  };
  const drawPhoto = (c, s, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#f6ead3'); g.addColorStop(0.62, '#f1e0c2'); g.addColorStop(0.62, '#e9d3ae'); g.addColorStop(1, '#e4cba2');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    loaf(c, w / 2, h * 0.5, 1.22);
    pill(c, 14, h - 40, 62, 26, 13); c.fillStyle = 'rgba(255,253,248,0.92)'; c.fill(); say(c, '800 g', 45, h - 26.5, '600 12px "Inter"', C.ink, 'center');
  };
  const drawBadge = (c, s, w, h) => { c.fillStyle = C.accent; c.fillRect(0, 0, w, h); say(c, String(ORDER.from), w / 2, h / 2 + 0.5, '700 11px "Inter"', '#fff', 'center'); };

  // 2. the basket
  const drawBasket = (c) => {
    c.fillStyle = C.paper; c.fillRect(0, 0, CW, CH);
    say(c, 'Your basket', 30, 44, '600 28px "Fraunces"', C.ink);
    say(c, 'TOTAL', 33, 190, '600 11px "Inter"', C.muted, 'left', 1.5);
  };
  // the item row. state: { roll: 0..1 (the quantity rolling from one number to the next), rip: 0..1 (ripple on "+") }
  const drawItem = (c, s, w, h) => {
    c.fillStyle = C.tile; c.fillRect(0, 0, w, h);
    pill(c, 14, 14, 64, 64, 14); c.fillStyle = C.crumb; c.fill(); loaf(c, 46, 43, 0.44);
    say(c, ITEM.name, 92, 31, '600 16px "Inter"', C.ink);
    say(c, money(ITEM.price) + ' each', 92, 55, '400 13px "Inter"', C.muted);
    const X = 198, Y = 47, SW = 92, SH = 32, PXc = X + SW - 16, PYc = Y + SH / 2;
    pill(c, X, Y, SW, SH, SH / 2); c.fillStyle = C.paper; c.fill(); c.lineWidth = 1; c.strokeStyle = C.line; c.stroke();
    c.fillStyle = C.muted; c.fillRect(X + 11, PYc - 0.9, 10, 1.8);                                                 // minus
    if (s.rip > 0 && s.rip < 1) { c.beginPath(); c.arc(PXc, PYc, 11 + 15 * K.ease.out(s.rip), 0, 7); c.fillStyle = `rgba(20,128,90,${0.3 * (1 - s.rip)})`; c.fill(); }
    c.beginPath(); c.arc(PXc, PYc, 11, 0, 7); c.fillStyle = C.accent; c.fill();                                    // plus
    c.fillStyle = '#fff'; c.fillRect(PXc - 5, PYc - 0.9, 10, 1.8); c.fillRect(PXc - 0.9, PYc - 5, 1.8, 10);
    c.save(); c.beginPath(); c.rect(X + 28, Y + 3, 34, SH - 6); c.clip();                                          // the number rolls upward behind a little window
    say(c, String(ORDER.from), X + 45, PYc + 0.5 - s.roll * 24, '700 16px "Inter"', C.ink, 'center');
    say(c, String(ORDER.to), X + 45, PYc + 24.5 - s.roll * 24, '700 16px "Inter"', C.ink, 'center');
    c.restore();
  };
  const drawTotal = (c, s, w, h) => say(c, money(s.v), 2, h / 2, '700 36px "Inter"', C.ink);                      // state: { v: the amount shown }
  const drawPickup = (c, s, w, h) => {
    c.fillStyle = C.tile; c.fillRect(0, 0, w, h);
    c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.arc(28, 34, 12, 0, 7); c.stroke(); c.beginPath(); c.moveTo(28, 27); c.lineTo(28, 34); c.lineTo(33, 37); c.lineCap = 'round'; c.stroke();   // a clock
    say(c, 'PICKUP', 16, 70, '600 10.5px "Inter"', C.muted, 'left', 1.5);
    say(c, ORDER.day, 15, 93, '600 17px "Inter"', C.ink); say(c, ORDER.time, 15, 116, '600 17px "Inter"', C.ink);
    c.fillStyle = C.line; c.fillRect(16, 140, w - 32, 1);
    say(c, SHOP.name, 16, 162, '600 12.5px "Inter"', C.ink); say(c, SHOP.street, 16, 181, '400 12.5px "Inter"', C.muted);
  };

  // 3. order confirmed
  const DISC = { x: 100, y: 165, r: 60 };
  const drawDone = (c) => {
    c.fillStyle = C.paper; c.fillRect(0, 0, CW, CH);
    c.beginPath(); c.arc(DISC.x, DISC.y, DISC.r - 1, 0, 7); c.lineWidth = 2; c.strokeStyle = C.line; c.setLineDash([5, 6]); c.stroke(); c.setLineDash([]);   // where the tick will land
    say(c, 'Order confirmed', 188, 104, '600 33px "Fraunces"', C.ink);
    say(c, `${ORDER.to} × ${ITEM.name}   ·   ${money(ORDER.to * ITEM.price)}`, 190, 139, '500 14px "Inter"', C.muted);
    say(c, ORDER.number, 190, 291, '500 12.5px "Inter"', C.muted);
  };
  const drawTick = (c, s, w, h) => { c.fillStyle = C.accent; c.fillRect(0, 0, w, h); tick(c, w / 2, h / 2 + 2, w * 0.36, s.p); };   // state: { p: 0..1 }
  const drawWhen = (c, s, w, h) => {
    c.fillStyle = C.tile; c.fillRect(0, 0, w, h);
    say(c, 'PICKUP', 20, 25, '600 10.5px "Inter"', C.accent, 'left', 1.5);
    say(c, `${ORDER.day}, ${ORDER.time}`, 19, 51, '600 21px "Inter"', C.ink);
    say(c, `${SHOP.name} Bakery  ·  ${SHOP.street}`, 20, 77, '400 13px "Inter"', C.muted);
  };

  registerStyle({
    id: 'floating-screens',
    name: 'Floating Screens',
    family: 'Products and screens',
    look: 'Screens as objects: white cards printed with a real interface, each backed by a block of clear glass, hanging one in front of the other in a bright, warm room. The newest card is always nearest and sharpest; the ones before it stay behind it, softly out of focus.',
    motion: 'A card swings in from the side like a heavy door, slides to its place and settles. Buttons sink when pressed and the whole card gives a little. A thin cable draws itself from the pressed button to the edge of the next card, and at the end one highlight runs through the whole chain.',
    light: 'One big soft window light from the upper right in front, so every card throws a soft shadow onto the card behind it and a softer one onto the wall, and every raised button and tile has its own small shadow. A bright room fills the shadows: nothing goes dark.',
    materials: 'Matt printed card stock on thick glass with polished, slightly green edges; raised interface pieces in the same card; a painted plaster wall. Warm paper, dark ink and exactly one accent colour.',
    camera: 'Long lens on a dolly that rolls past the row at one steady speed and never stops. It pans to stay on the newest card, hands over to the next one as it flies in, and finally cranes back until the whole sequence is in frame. Focus always sits on the newest card.',
    post: 'Neutral tone mapping so interface colours stay exact, real depth of field and motion blur, a faint vignette, almost no grain. Bloom is set so that only a glass edge that lights up glows.',
    explains: 'Anything made of steps or screens: an app flow, a workflow, a process, a set of stats or quotes. One card per step, the action on each card acted out, a cable from each step to the next.',
    topic: 'Ordering bread online from a small bakery in three steps: choose the loaf, check the basket, order confirmed',
    duration: 8,
    fonts: ['600 40px "Fraunces"', '400 16px "Inter"', '500 16px "Inter"', '600 16px "Inter"', '700 16px "Inter"'],
    render: { samples: 96, shutter: 0.5, tone: 'neutral', exposure: 1.06, bloom: 0.35, bloomThreshold: 1.3, vignette: 0.16, grain: 0.012, fov: 28, near: 0.5, far: 120, background: C.wall },

    build(S) {
      const { THREE, K, scene, camera } = S;

      // ============================================================ the room: a bright wall and one window light
      // The sky of the environment is the fill light (it is what keeps shadows pale), the panels are what the glass
      // edges reflect. The sun is the window: big and soft, low enough that shadows land on the card behind.
      const room = K.env(S, { top: '#ffffff', horizon: '#fbfaf7', bottom: '#e2ddd6', intensity: 0.66, panels: [
        { pos: [16, 10, 14], size: [12, 12], color: '#fffaf2', power: 5 },
        { pos: [-18, 2, 8], size: [3, 20], color: '#eef5ff', power: 3 },
        { pos: [0, 20, 4], size: [24, 6], color: '#ffffff', power: 3 },
      ] });
      const SUN = [0.5, 0.42, 1].map((v) => v * 24);
      K.sun(S, { pos: [SUN[0], SUN[1], SUN[2] - 1], target: [0, 0, -1], color: '#fffaf4', power: 1.75, size: 11.5, soft: 1.9, mapSize: 4096, normalBias: 0.004, bias: -0.0002 });
      const WALL_Z = -STEP[2] - 4.2;
      const wallTex = K.canvasTex(4096, 2048, (c, w, h) => {
        const u = w / 72;                                                                        // pixels per world unit
        c.fillStyle = C.wall; c.fillRect(0, 0, w, h);
        // light from a tall window, leaning the way the sun falls: soft panes with the shadow of the frame between them
        c.save(); c.translate(w / 2 - 1.2 * u, h / 2 - 0.4 * u); c.transform(1, 0, -0.32, 1, 0, 0); c.filter = `blur(${Math.round(0.42 * u)}px)`;
        c.fillStyle = 'rgba(255,243,228,0.62)';
        for (const [x, y, pw, ph] of [[-8.6, -5.4, 5.6, 4.9], [-2.6, -5.4, 5.6, 4.9], [3.4, -5.4, 5.6, 4.9], [-8.6, 0.1, 5.6, 4.9], [-2.6, 0.1, 5.6, 4.9], [3.4, 0.1, 5.6, 4.9]]) c.fillRect(x * u, y * u, pw * u, ph * u);
        c.restore();
      });
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(72, 36), new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.95 }));
      wall.position.set(0, 0.5, WALL_Z); wall.receiveShadow = true; scene.add(wall);

      // ============================================================ reusable pieces
      // a rounded-rectangle slab with a small bevel: back on z = 0, front on z = depth, texture mapped flat across it.
      // Material 0 is the two faces, material 1 the edge.
      const slab = (w, h, r, depth, bevel) => {
        const x = w / 2 - bevel, y = h / 2 - bevel, q = Math.max(0.001, Math.min(r - bevel, x - 1e-4, y - 1e-4)), s = new THREE.Shape();
        s.moveTo(-x + q, -y); s.lineTo(x - q, -y); s.absarc(x - q, -y + q, q, -Math.PI / 2, 0); s.lineTo(x, y - q); s.absarc(x - q, y - q, q, 0, Math.PI / 2);
        s.lineTo(-x + q, y); s.absarc(-x + q, y - q, q, Math.PI / 2, Math.PI); s.lineTo(-x, -y + q); s.absarc(-x + q, -y + q, q, Math.PI, Math.PI * 1.5);
        const g = new THREE.ExtrudeGeometry(s, { depth: depth - 2 * bevel, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 5, curveSegments: 20 });
        g.translate(0, 0, bevel);
        const p = g.attributes.position, uv = g.attributes.uv;
        for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / h + 0.5);
        return g;
      };
      const solid = (geo, mat, parent, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m; };
      // a canvas drawn in points that repaints only when its state changes, so update(t) can call show() freely
      const paper = (w, h, draw) => {
        const tex = K.canvasTex(Math.round(w * PX), Math.round(h * PX)); let key = null;
        tex.show = (state) => {
          const k = JSON.stringify(state); if (k === key) return; key = k;
          const c = tex.ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, w * PX, h * PX); c.setTransform(PX, 0, 0, PX, 0, 0);
          draw(c, state, w, h); tex.needsUpdate = true;
        };
        return tex;
      };
      const printed = (tex) => new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.55, metalness: 0, specularIntensity: 0.3 });   // low specular: no grey veil over the ink
      const cardEdge = new THREE.MeshStandardMaterial({ color: '#f3eee5', roughness: 0.6 });
      // the glass block: its two big faces are clear (you see the wall and the card behind through the margin), its
      // polished edge is the pale green of thick glass seen edge-on and glows a little, the way a lit glass edge does
      const glass = [
        new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.03, metalness: 0, transmission: 1, thickness: GLASS, ior: 1.45, attenuationColor: new THREE.Color('#cfeee3'), attenuationDistance: 1.2, envMap: room, envMapIntensity: 1.2 }),
        new THREE.MeshPhysicalMaterial({ color: '#bfe9db', roughness: 0.28, metalness: 0, transmission: 0.55, thickness: 0.4, ior: 1.45, emissive: new THREE.Color('#8fd6c0'), emissiveIntensity: 0.22, envMap: room, envMapIntensity: 1.6 }),
      ];

      // THE CARD. makeCard(i, drawFace) builds a glass-backed card at step i of the row and returns:
      //   card.piece({ x, y, w, h, r, lift, thick, draw, state, edge, flat })   a raised piece of interface, placed in points
      //       -> { mesh, show(state), lift(z) }. `flat: true` makes it a transparent label lying on the face instead.
      //   card.world(x, y, z)   where a point of the face is in the world right now (for connectors)
      const makeCard = (i, drawFace) => {
        const g = new THREE.Group(); scene.add(g);
        const W = CW * PT, H = CH * PT, R = RAD * PT;
        const rim = glass[1].clone();                                    // its own edge material, so each card can light up alone
        solid(slab(W + 2 * RIM, H + 2 * RIM, R + RIM * 0.8, GLASS, 0.03), [glass[0], rim], g, 0, 0, -GLASS);
        const face = paper(CW, CH, drawFace); face.show({});
        solid(slab(W, H, R, SHEET, 0.006), [printed(face), cardEdge], g);
        const at = (x, y, z = 0) => [(x - CW / 2) * PT, (CH / 2 - y) * PT, SHEET + z];
        const v = new THREE.Vector3();
        return {
          group: g, rim, t0: 0, rest: STEP.map((s) => s * (i - 1)), yaw: YAW[i], at,
          world: (x, y, z = 0, out = v) => { g.updateMatrixWorld(); return out.set(...at(x, y, z)).applyMatrix4(g.matrixWorld); },
          piece({ x, y, w, h, r = 14, lift = 0.03, thick = 0.02, draw, state = {}, edge = '#f3eee5', flat = false }) {
            const tex = paper(w, h, draw); tex.show(state);
            const [px, py, pz] = at(x + w / 2, y + h / 2);
            const m = flat
              ? new THREE.Mesh(new THREE.PlaneGeometry(w * PT, h * PT), new THREE.MeshStandardMaterial({ map: tex, transparent: true, depthWrite: false, roughness: 0.55 }))
              : solid(slab(w * PT, h * PT, Math.min(r, w / 2 - 0.05, h / 2 - 0.05) * PT, thick, Math.min(0.006, thick * 0.3)), [printed(tex), new THREE.MeshStandardMaterial({ color: edge, roughness: 0.6 })], g);
            if (flat) { m.receiveShadow = true; g.add(m); lift = 0.0015; }
            m.position.set(px, py, pz + lift);
            return { mesh: m, show: tex.show, lift: (z) => { m.position.z = pz + z; } };
          },
        };
      };

      // THE CONNECTOR: a cable between two points that can both move. Its shape is recomputed on every update
      // (a bezier that leaves `a` along `da` and arrives at `b` along `db`) and it is drawn up to `p` of its length.
      const Y = new THREE.Vector3(0, 1, 0);
      const cable = (radius, mat, N = 80, M = 10) => {
        const pos = new Float32Array((N + 1) * M * 3), nor = new Float32Array((N + 1) * M * 3), idx = [];
        for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) { const a = i * M + j, b = i * M + (j + 1) % M; idx.push(a, a + M, b, b, a + M, b + M); }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setIndex(idx);
        const mesh = new THREE.Mesh(g, mat); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; scene.add(mesh);
        const curve = new THREE.CubicBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
        const pt = new THREE.Vector3(), tan = new THREE.Vector3(), side = new THREE.Vector3(), up = new THREE.Vector3();
        return {
          mesh, curve,
          shape(a, da, b, db, p) {
            curve.v0.copy(a); curve.v1.copy(a).add(da); curve.v2.copy(b).sub(db); curve.v3.copy(b);
            for (let i = 0; i <= N; i++) {
              curve.getPoint(i / N, pt); curve.getTangent(i / N, tan); side.crossVectors(tan, Y).normalize(); up.crossVectors(side, tan);
              for (let j = 0; j < M; j++) {
                const an = (j / M) * Math.PI * 2, cs = Math.cos(an), sn = Math.sin(an), o = (i * M + j) * 3;
                nor[o] = side.x * cs + up.x * sn; nor[o + 1] = side.y * cs + up.y * sn; nor[o + 2] = side.z * cs + up.z * sn;
                pos[o] = pt.x + nor[o] * radius; pos[o + 1] = pt.y + nor[o + 1] * radius; pos[o + 2] = pt.z + nor[o + 2] * radius;
              }
            }
            g.attributes.position.needsUpdate = true; g.attributes.normal.needsUpdate = true;
            g.setDrawRange(0, Math.round(K.clamp(p) * N) * M * 6); mesh.visible = p > 0.004;
          },
        };
      };

      // ============================================================ the three cards and what is on them
      const cards = [makeCard(0, drawProduct), makeCard(1, drawBasket), makeCard(2, drawDone)];
      const [A, B, Cc] = cards; A.t0 = T.A; B.t0 = T.B; Cc.t0 = T.C;
      const measure = document.createElement('canvas').getContext('2d'); measure.font = '600 14px "Inter"';
      const chips = cards.map((card, i) => card.piece({ x: -14, y: -17, w: Math.ceil(measure.measureText(STEPS[i]).width) + 50, h: 34, r: 17, lift: 0.1, thick: 0.035, draw: chip(i + 1, STEPS[i]), state: { on: 0 }, edge: '#e9e4da' }));
      // the socket on the left edge where the cable from the card before plugs in
      const sockets = [B, Cc].map((card) => { const [x, y] = card.at(0, PORT_Y); const m = solid(new THREE.SphereGeometry(0.062, 24, 16), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.4 }), card.group, x - RIM, y, -GLASS / 2); m.scale.z = 0.7; return m; });

      // screen 1
      A.piece({ x: 262, y: 70, w: 190, h: 238, r: 20, lift: 0.06, thick: 0.022, draw: drawPhoto, edge: '#e6d6b8' });
      const addBtn = A.piece({ ...BTN, r: 23, thick: 0.03, draw: button('Add to basket', 'Added'), state: { on: 0, rip: 0 }, edge: '#0f6d4c' });
      const badge = A.piece({ x: 441, y: 23, w: 17, h: 17, r: 8.5, lift: 0.012, thick: 0.012, draw: drawBadge, edge: C.accent });
      // screen 2
      const item = B.piece({ x: 28, y: 70, w: 304, h: 92, r: 18, lift: 0.04, thick: 0.02, draw: drawItem, state: { roll: 0, rip: 0 }, edge: '#e6dfd2' });
      const total = B.piece({ x: 30, y: 201, w: 220, h: 46, draw: drawTotal, state: { v: ITEM.price }, flat: true });
      const orderBtn = B.piece({ ...BTN, r: 23, thick: 0.03, draw: button('Place order', 'Order placed'), state: { on: 0, rip: 0 }, edge: '#0f6d4c' });
      B.piece({ x: 348, y: 70, w: 104, h: 238, r: 18, lift: 0.03, thick: 0.02, draw: drawPickup, edge: '#e6dfd2' });
      // screen 3
      const disc = Cc.piece({ x: DISC.x - DISC.r, y: DISC.y - DISC.r, w: DISC.r * 2, h: DISC.r * 2, r: DISC.r, lift: 0.07, thick: 0.04, draw: drawTick, state: { p: 0 }, edge: '#0f6d4c' });
      Cc.piece({ x: 188, y: 166, w: 264, h: 98, r: 18, lift: 0.035, thick: 0.02, draw: drawWhen, edge: '#e6dfd2' });
      const ring = new THREE.Mesh(new THREE.RingGeometry(DISC.r * PT * 0.96, DISC.r * PT, 96), new THREE.MeshBasicMaterial({ color: C.accent, transparent: true, depthWrite: false }));
      ring.position.set(...Cc.at(DISC.x, DISC.y, 0.003)); Cc.group.add(ring);

      // connectors: from the right end of a card's button to the socket of the next card
      const cableMat = new THREE.MeshStandardMaterial({ color: C.accent, roughness: 0.42, side: THREE.DoubleSide });
      const links = [[A, B], [B, Cc]].map(([from, to], i) => {
        const bead = solid(new THREE.SphereGeometry(0.06, 24, 16), new THREE.MeshStandardMaterial({ color: C.accent, roughness: 0.3 }), scene);
        const glint = new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.6, 1.5) })); scene.add(glint);
        return { from, to, bead, glint, socket: sockets[i], cable: cable(0.024, cableMat), a: new THREE.Vector3(), b: new THREE.Vector3(), da: new THREE.Vector3(0.45, -0.2, 0.5), db: new THREE.Vector3(0.45, 0.2, 0.6) };
      });

      // ============================================================ motion
      // how far a button is pushed in around time t0: down in 0.08 s, then back up with a small bounce
      const pressed = (t, t0) => { const u = t - t0; return u <= 0 ? 0 : u < 0.08 ? K.ease.out(u / 0.08) : 1 - K.spring(u - 0.08, 3.4, 0.5); };
      const kicks = [[T.add], [T.plus, T.order], [T.tick + 0.02]];           // the moments each card is touched: it gives a little
      const q = (v, n = 80) => Math.round(v * n) / n;                         // round animated values so canvases repaint a sensible number of times
      // A card arrives like a heavy door: its position has no bounce (it is heavy), its rotation swings past and settles.
      const pose = (card, i, t) => {
        const u = t - card.t0, p = 1 - K.spring(u, 1.2, 1), s = 1 - K.spring(u, 1.2, 0.5), g = card.group;
        let k = 0; for (const t0 of kicks[i]) k += pressed(t, t0) * (t0 === T.plus ? 0.45 : 1);
        let f = 0; for (const t0 of FLASH[i]) { const d = t - t0; if (d > 0) f += Math.min(1, d / 0.06) * Math.exp(-d * 4.5); }
        card.rim.emissiveIntensity = 0.22 + 5 * f;                      // light runs into the glass and fades
        k -= 0.9 * f * (t > T.recap ? 1 : 0);                             // in the recap the card also leans toward the camera a little
        g.visible = u > 0;
        g.position.set(card.rest[0] + FROM.pos[0] * p, card.rest[1] + FROM.pos[1] * p, card.rest[2] + FROM.pos[2] * p - 0.07 * k);
        g.rotation.set(FROM.rot[0] * s + 0.012 * k, card.yaw + FROM.rot[1] * s - 0.014 * k, FROM.rot[2] * s);
      };

      // The camera is on a dolly that rolls past the row at one steady speed and never stops (the keys before 0 and
      // after 8 keep it moving through the first and last frame). It pans to stay locked on the newest card, hands
      // over to the next one while that card flies in, and at the end cranes back until all three are in frame.
      const P = cards.map((c) => c.rest), rel = (i, o) => [P[i][0] + o[0], P[i][1] + o[1], P[i][2] + o[2]];
      const HAND = [[T.add - 0.05, T.B + 0.7], [T.order - 0.05, T.C + 0.7]];            // the two hand-overs: the pan leads, so the card's settle is seen sharp
      const cam = {
        pos: K.path([[-1.5, rel(0, [-4.0, 0.45, 8.3])], [0, rel(0, [-1.9, 0.4, 8.4])], [T.wide[0] / 2, rel(1, [-1.45, 0.3, 8.8])], [T.wide[0], rel(2, [-1.0, 0.2, 9.5])], [T.wide[1], rel(2, [-2.3, 0.3, 13.2])], [9.5, rel(2, [-2.0, 0.32, 13.5])]]),
        aim: K.track([[0, rel(0, [-0.1, 0.05, 0])], [HAND[0][0], rel(0, [-0.1, 0.05, 0])], [HAND[0][1], rel(1, [-0.15, 0.05, 0])], [HAND[1][0], rel(1, [-0.15, 0.05, 0])], [HAND[1][1], rel(2, [-0.15, 0.05, 0])], [T.wide[0], rel(2, [-0.15, 0.05, 0])], [T.wide[1], rel(2, [-2.7, 0.1, 0])]]),
        // the lens closes for the fast middle of each hand-over, so the pan blurs as one clean streak
        ap: K.track([[0, 0.075], [HAND[0][0], 0.12], [HAND[0][0] + 0.3, 0], [HAND[0][1] - 0.4, 0], [HAND[0][1], 0.12], [HAND[1][0], 0.12], [HAND[1][0] + 0.3, 0], [HAND[1][1] - 0.4, 0], [HAND[1][1], 0.12], [T.wide[0], 0.12], [T.wide[1], 0.05]]),
      };
      const v3 = new THREE.Vector3(), white = new THREE.Color('#ffffff'), accent = new THREE.Color(C.accent);

      return {
        update(t) {
          cards.forEach((card, i) => pose(card, i, t));
          chips[0].show({ on: 1 });
          chips[1].show({ on: q(K.seg(t, LINK[0][1] - 0.05, LINK[0][1] + 0.2)) });
          chips[2].show({ on: q(K.seg(t, LINK[1][1] - 0.05, LINK[1][1] + 0.2)) });

          // screen 1: the button sinks, turns into "Added", the basket gets its badge
          addBtn.lift(0.045 - 0.04 * pressed(t, T.add));
          addBtn.show({ on: q(K.seg(t, T.add + 0.1, T.add + 0.4)), rip: q(K.seg(t, T.add, T.add + 0.5)) });
          badge.mesh.scale.setScalar(Math.max(0.001, K.spring(t - T.add - 0.22, 3, 0.45)));

          // screen 2: "+" is pressed, the number rolls, the total counts up; then the order is placed
          item.lift(0.04 - 0.02 * pressed(t, T.plus));
          item.show({ roll: q(K.seg(t, T.plus + 0.04, T.plus + 0.42, K.ease.outBack), 120), rip: q(K.seg(t, T.plus, T.plus + 0.45)) });
          total.show({ v: Math.round(ITEM.price * (ORDER.from + (ORDER.to - ORDER.from) * K.seg(t, T.plus + 0.1, T.plus + 0.55, K.ease.out)) * 20) / 20 });
          orderBtn.lift(0.045 - 0.04 * pressed(t, T.order));
          orderBtn.show({ on: q(K.seg(t, T.order + 0.1, T.order + 0.4)), rip: q(K.seg(t, T.order, T.order + 0.5)) });

          // screen 3: the disc pops out of the card, the tick draws, one ring spreads
          disc.mesh.scale.setScalar(Math.max(0.001, K.spring(t - T.tick, 2.6, 0.5)));
          disc.show({ p: q(K.seg(t, T.tick + 0.1, T.tick + 0.45, K.ease.out), 120) });
          const rg = K.seg(t, T.tick + 0.08, T.tick + 0.85, K.ease.out);
          ring.scale.setScalar(1 + 0.75 * rg); ring.material.opacity = t > T.tick + 0.08 ? 0.5 * (1 - rg) : 0;

          // connectors: each one draws from the pressed button to the next card, with a bead at its head.
          // In the recap a bright bead runs through both, one after the other.
          links.forEach((L, i) => {
            const p = K.seg(t, LINK[i][0], LINK[i][1], K.ease.inOut);
            L.from.world(BTN.x + BTN.w - 4, BTN.y + BTN.h / 2, 0.03, L.a);
            L.to.group.updateMatrixWorld(); L.b.set(L.to.at(0, PORT_Y)[0] - RIM - 0.03, L.to.at(0, PORT_Y)[1], -GLASS / 2).applyMatrix4(L.to.group.matrixWorld);
            L.cable.shape(L.a, L.da, L.b, L.db, p);
            L.bead.visible = p > 0.004 && p < 1; L.cable.curve.getPoint(p, L.bead.position);
            L.socket.material.color.copy(white).lerp(accent, K.seg(t, LINK[i][1] - 0.04, LINK[i][1] + 0.1));
            const r = (t - T.recap) / HOP - i;
            L.glint.visible = r > 0 && r < 1; if (L.glint.visible) L.cable.curve.getPoint(K.ease.inOut(r), L.glint.position);
          });
          // the chips nod as the highlight reaches them
          chips.forEach((ch, i) => { const u = t - (T.recap + i * HOP); ch.lift(0.1 + (u > 0 ? 0.07 * Math.exp(-u * 7) * Math.sin(u * 16) : 0)); });

          K.look(camera, cam.pos(t), cam.aim(t));
          // focus sits on the newest card and follows it while it is still flying in
          v3.copy(A.group.position).lerp(B.group.position, K.seg(t, T.B, T.B + 0.35, K.ease.inOut)).lerp(Cc.group.position, K.seg(t, T.C, T.C + 0.35, K.ease.inOut));
          K.focus(camera, [v3.x, v3.y, v3.z], cam.ap(t));
        },
      };
    },

    sound(k) {
      k.bed('room', 0, 8, { gain: 0.5 });
      k.music('pad', 0, 8, { bpm: 60, gain: 0.7, chords: [['F3', 'C4', 'E4', 'A4'], ['G3', 'D4', 'E4', 'B4']] });
      // cards: air as they swing in, then glass and weight as they stop
      [T.B, T.C].forEach((t, i) => {
        k.play('whoosh', t + 0.02, { gain: 0.5, dur: 0.6, top: 1700, pan: 0.45 - i * 0.1 });
        k.play('thud', t + 0.52, { gain: 0.3, f: 95, pan: 0.15 });
        k.play('tock', t + 0.52, { gain: 0.35, f: 1500, pan: 0.15 });
      });
      // presses
      [T.add, T.order].forEach((t) => { k.play('click', t, { gain: 1, pan: -0.15 }); k.play('pop', t + 0.11, { gain: 0.55, f: 480, pan: -0.15 }); });
      k.play('click', T.plus, { gain: 0.8, f: 2300 }); k.play('blip', T.plus + 0.12, { gain: 0.8, f: 'A5', type: 'sine', dur: 0.09 });
      k.withMinor(() => { for (let i = 0; i < 6; i++) k.play('count', T.plus + 0.14 + i * 0.065, { gain: 0.5 }); });
      // connectors: a soft rising line, and a note as each one plugs in
      LINK.forEach(([a, b], i) => {
        k.tone(a, { f: [[0, 330], [b - a, 660]], type: 'sine', dur: b - a, gain: 0.05, a: 0.2, verb: 0.3, pan: -0.1 + i * 0.2 });
        k.play('swish', a, { gain: 0.5, dur: 0.3 });
        k.play('ding', b, { gain: 0.5, f: i ? 'G5' : 'E5' });
      });
      k.play('success', T.tick + 0.1, { gain: 0.9, f: 'C6' });
      k.play('pop', T.tick, { gain: 0.6, f: 380 });
      // recap: three small notes as the highlight passes the chips, and a low one to close
      ['C5', 'E5', 'G5'].forEach((n, i) => k.tone(T.recap + i * HOP, { f: n, type: 'triangle', dur: 0.9, gain: 0.08, a: 0.005, filter: 'lowpass', f2: 2200, verb: 0.35 }));
      k.tone(T.recap + 2 * HOP, { f: 'C3', type: 'sine', dur: 1.4, gain: 0.1, a: 0.03, verb: 0.3 });
    },
  });
}
```
