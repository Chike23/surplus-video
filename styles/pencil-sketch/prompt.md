I want a short 3D motion graphic made with three.js in the "Pencil Sketch" style. Below is the complete source of a reference animation in this exact style, plus the small rendering kit and sound kit it runs on. Use them as your style guide and rebuild the animation around my content.

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
Name: Pencil Sketch
Family: Filters over 3D
Use: explainer
Look: A real 3D scene that reads as a graphite drawing in a designer's sketchbook: forms shaded with hatching and cross-hatching that follows the light, outlines that overshoot their corners, faint construction lines, hand lettering, toothy paper with a smudge and an eraser mark, and one red accent.
Motion: The drawing makes itself: setting-out lines first, then outlines stroke by stroke, then shading laid across each form in one direction and crossed in a second. Hatching is fixed to the objects and turns with them; only the line wobble boils a little, on held frames. Notes are lettered on and their leader lines follow the parts as the view turns.
Light: One sun from the upper left and flat fill. The light is never shown directly: it only decides how many layers of hatching a face or a cast shadow gets, so lit faces stay as bare paper and shade is cross-hatched.
Materials: Graphite on cream cartridge paper. Soft dark pencil for outlines and lettering, lighter pencil for hatching and construction lines, a red pencil for numbers and marks, and one wash of red marker on the part that matters.
Camera: One slow, continuous arc round the subject on a long lens, about 35 degrees from nearly front-on to a three-quarter view, rising and pulling back a little as the drawing grows. Everything is sharp, like a drawing. The subject sits left of centre so the notes have a clear column of paper.
Finish: No motion blur, bloom, grain or vignette. One paper pass: tooth that breaks up light lines, a hand smudge that drags graphite, an eraser mark, slight mottling and darker page edges.
Good for: How something is built or put together, step by step: parts are drawn in order, each with a numbered note. Also good for anatomy of an object, plans, exploded views and anything that benefits from seeing the structure through the surface.

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

REFERENCE STYLE SOURCE (styles/pencil-sketch.js; its sample topic was "How a house goes up: foundation, frame, walls, roof")
```js
{
  // ---------------------------------------------------------------- content (change this for a new topic)
  const TITLE = 'HOW A HOUSE GOES UP';
  const STAGES = [                       // one stage = one part of the drawing plus its note. `at` = when the pencil starts on it
    { label: 'FOUNDATION', at: -1.6 },   // already drawn on frame one: the clip opens on its note being lettered
    { label: 'FRAME', at: 1.35 },
    { label: 'WALLS', at: 3.25 },
    { label: 'ROOF', at: 5.1 },
  ];
  const DIMENSION = '8500';              // millimetres, the way a builder's drawing gives them, along the front of the slab
  const DURATION = 8;
  const PAPER = '#f2ede0', GRAPHITE = '#33343a', ACCENT = '#cf472b', WASH = '#e8967a';   // one accent: a red pencil, and the same red as a marker wash

  // one schedule for picture and sound, worked out from the four stage times above
  function plan() {
    const [s1, s2, s3, s4] = STAGES.map((s) => s.at);
    return {
      slab: { at: s1, fillAt: s1 + 0.6, fill: 0.75 }, dim: s1 + 2.2,
      plates: s2, studs: s2 + 0.22, studGap: 0.033, topPlate: s2 + 1.1,
      walls: { at: s3, fillAt: s3 + 0.5, fill: 0.85, side: 0.18, details: s3 + 1.0 },
      rafters: s4, roof: { at: s4 + 0.3, fillAt: s4 + 0.75, fill: 0.6, washAt: s4 + 0.7, wash: 0.75 }, chimney: s4 + 0.95,
      notes: [s1 + 1.2, s2 + 0.95, s3 + 0.95, s4 + 1.05],     // when each note is lettered
      smoke: s4 + 1.75,                                       // the last mark: someone has moved in
    };
  }

  // ================================================================ THE PENCIL KIT (reusable on any subject)
  // Three pieces, all driven by one clock (uTime), so nothing accumulates and any frame can be rendered alone:
  //   solid(geometry, opts)   a form shaded with hatching that is picked by the real light and shadow falling on it,
  //                           laid in by a moving "hand", with its edges drawn as pencil strokes
  //   strokes(list, opts)     free pencil lines in 3D with a constant width on screen: they wobble, overshoot, taper,
  //                           draw themselves on, and show faintly through whatever hides them (construction lines)
  //   write(text, opts)       single-stroke lettering made of the same strokes, written on letter by letter
  // The paper (tooth, smudge, eraser mark) is one full-screen filter at the end: see PAPER_FILTER.
  // For a new subject: build it from any geometry with solid(), give each part an `at` time, add loose lines with
  // strokes([line(a, b, {...}), ...]) and words with write(). Curved forms shade well but only get outlines at creases.
  const NOISE = `
    float h11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
    float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
    float n1(float x){ float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h11(i), h11(i + 1.0), f); }
    float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }`;

  function pencilKit(S, o = {}) {
    const { THREE, K, scene } = S, lin = (hex) => new THREE.Color(hex);
    const TEXELS = 165;                  // hatch texels per world unit: about one texel per pixel at the usual distance
    let seedN = 0;
    const nextSeed = () => K.hash(++seedN, 3.1) * 97 + 1;

    // ---- the hatch sheet: real strokes with a firm start and a lifted end, rasterised once into a tiling texture.
    // R, G and B hold three sets of strokes that interleave (R: one row in four, G: the rows between, B: the rows between those), so
    // adding channels makes the hatching denser without any stroke moving: that is what keeps tone changes calm.
    const N = 2048, PITCH = N / 96;
    const hatch = K.canvasTex(N, N, (ctx) => {
      const r = K.rng(7);
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, N, N); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      const stroke = (x, y, len, chan) => {
        const tilt = r.gauss() * 0.03, bow = r.range(-3, 3), wd = r.range(2.3, 3.5), press = r.range(0.55, 0.95), n = 10;
        const P = (u) => [x + u * len, y + u * len * tilt + bow * Math.sin(u * Math.PI)];
        for (let dx = -N; dx <= N; dx += N) for (let dy = -N; dy <= N; dy += N) {                     // copies across the seams, so it tiles
          if (x + dx > N + 50 || x + len + dx < -50 || y + dy > N + 50 || y + dy < -50) continue;
          for (let i = 0; i < n; i++) {
            const u = i / n, p0 = P(u), p1 = P(u + 1 / n);
            const pr = press * (0.6 + 0.4 * K.smooth(0, 0.12, u)) * (1 - 0.6 * K.smooth(0.55, 1, u));  // press, then flick away
            const v = Math.round(255 * pr);
            ctx.strokeStyle = `rgb(${chan === 0 ? v : 0},${chan === 1 ? v : 0},${chan === 2 ? v : 0})`;
            ctx.lineWidth = wd * (1 - 0.45 * K.smooth(0.6, 1, u));
            ctx.beginPath(); ctx.moveTo(p0[0] + dx, p0[1] + dy); ctx.lineTo(p1[0] + dx, p1[1] + dy); ctx.stroke();
          }
        }
      };
      const rows = (chan, phase) => { for (let k = 0; k < N / PITCH; k++) for (let x = -r.range(0, 200); x < N;) { const len = r.range(100, 300); stroke(x, (k + phase) * PITCH + r.range(-2.5, 2.5), len, chan); x += len + r.range(-24, 30); } };
      rows(0, 0); rows(1, 0.5); rows(2, 0.25); rows(2, 0.75);
    }, { data: true, repeat: [1, 1] });

    const U = {                          // shared by every material of the kit
      uTime: { value: 0 }, uBoil: { value: 0 }, uRes: { value: new THREE.Vector2(S.W, S.H) }, uHatch: { value: hatch }, uDens: { value: TEXELS / N },
      uPaper: { value: lin(o.paper || '#f2ede0') }, uGraphite: { value: lin(o.graphite || '#33343a') }, uAccent: { value: lin(o.accent || '#cf472b') },
    };

    // ---- hatch shading. A normal lit material (so real light and cast shadows work), but instead of showing the light
    // it turns it into tone, and tone into layers of strokes: one set, then the set between, then a second direction
    // across the first, and so on. Strokes are laid out flat on each face in OBJECT space, so they belong to the object
    // and turn with it. Each face gets its own direction, which is what makes a box read as a box.
    // o: angle (stroke direction on the face, radians from level), fan (how much the direction changes from face to
    // face), gain / lift (tone = light * gain + lift; gain 0 gives a fixed tone), ink (pencil colour), wash + washAt +
    // washDur (a marker wash under the pencil), fillAt + fillDur (when the hand shades it in), wipe (direction it works in).
    function hatchMaterial(geo, p = {}) {
      const m = new THREE.MeshLambertMaterial({ color: '#ffffff', polygonOffset: true, polygonOffsetFactor: 1.5, polygonOffsetUnits: 2 });
      geo.computeBoundingBox();
      const dir = new THREE.Vector3(...(p.wipe || [1, 0.7, -0.6])).normalize(), bb = geo.boundingBox, v = new THREE.Vector3(); let lo = Infinity, hi = -Infinity;
      for (let i = 0; i < 8; i++) { const d = v.set(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z).dot(dir); lo = Math.min(lo, d); hi = Math.max(hi, d); }
      const k = 1 / Math.max(1e-4, hi - lo);
      const u = {
        uTime: U.uTime, uHatch: U.uHatch, uDens: U.uDens, uPaper: U.uPaper,
        uT: { value: new THREE.Vector2(p.fillAt == null ? -99 : p.fillAt, p.fillDur || 0.6) },
        uWipe: { value: new THREE.Vector4(dir.x * k, dir.y * k, dir.z * k, -lo * k) },
        uHatchP: { value: new THREE.Vector4(p.angle == null ? 0.95 : p.angle, p.gain == null ? 1 : p.gain, p.lift || 0, p.fan == null ? -0.4 : p.fan) },
        uInk: { value: p.ink ? lin(p.ink) : U.uGraphite.value }, uWash: { value: lin(p.wash || '#ffffff') },
        uWashT: { value: new THREE.Vector3(p.washAt == null ? -99 : p.washAt, p.washDur || 0.6, p.wash ? 1 : 0) },
      };
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, u);
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vObjP, vObjN;')
          .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjP = transformed; vObjN = objectNormal;');
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
          uniform sampler2D uHatch; uniform float uTime, uDens; uniform vec3 uPaper, uInk, uWash, uWashT; uniform vec2 uT; uniform vec4 uHatchP, uWipe;
          varying vec3 vObjP, vObjN;
          ${NOISE}
          vec2 turn(vec2 p, float a){ float c = cos(a), s = sin(a); return vec2(c * p.x + s * p.y, -s * p.x + c * p.y); }
          // has the hand reached this point yet? s = how far across the object it is, h = coordinates along / across the strokes
          float laid(float prog, float s, vec2 h, vec2 rag){ return step(s * 0.8 + n2(h * rag) * 0.2, prog * 1.001 - 0.0005); }`)
          .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
          vec3 oN = normalize(vObjN);
          vec3 tU = abs(oN.y) > 0.92 ? vec3(1.0, 0.0, 0.0) : normalize(cross(vec3(0.0, 1.0, 0.0), oN));   // level direction on the face
          vec2 hc = vec2(dot(vObjP, tU), dot(vObjP, cross(oN, tU)));                                      // flat coordinates on the face
          float hAng = uHatchP.x + uHatchP.w * (oN.x * 0.9 + oN.y * 0.45);
          vec2 hA = turn(hc, hAng), hB = turn(hc, hAng - 1.2);                                            // first direction, and the one across it
          hA.y += (n2(hc * 0.55 + 1.3) - 0.5) * 0.22; hB.y += (n2(hc * 0.55 + 7.7) - 0.5) * 0.22;         // a wrist draws shallow arcs, not ruled lines
          float sW = dot(vObjP, uWipe.xyz) + uWipe.w, pW = (uTime - uT.x) / uT.y;
          if (laid(clamp(pW * 1.6, 0.0, 1.0), sW, hA, vec2(0.8, 7.0)) < 0.5) discard;                    // not drawn yet: the paper is still empty here`)
          .replace('#include <opaque_fragment>', `
          float tone = dot(outgoingLight, vec3(0.3333)) * uHatchP.y + uHatchP.z;
          float dk = clamp(1.0 - tone, 0.0, 1.0);
          dk += (n2(hc * 1.6 + 3.7) - 0.5) * 0.16 * smoothstep(0.03, 0.2, dk);                            // an uneven hand: layers come in patchy
          vec3 sA = texture2D(uHatch, hA * uDens + 0.37).rgb, sB = texture2D(uHatch, hB * uDens * 1.07 + 0.11).rgb;
          float lB = laid(clamp((pW - 0.4) / 0.6, 0.0, 1.0), sW, hB, vec2(0.8, 7.0));                    // the second direction goes on in a second pass
          float ink = 1.0 - (1.0 - sA.r * smoothstep(0.10, 0.24, dk)) * (1.0 - sA.g * smoothstep(0.30, 0.42, dk))
            * (1.0 - sB.r * smoothstep(0.46, 0.58, dk) * lB) * (1.0 - sB.g * smoothstep(0.62, 0.72, dk) * lB)
            * (1.0 - sA.b * smoothstep(0.76, 0.86, dk)) * (1.0 - sB.b * smoothstep(0.88, 0.96, dk) * lB);
          ink *= 0.6 + 0.4 * smoothstep(0.15, 0.8, dk);                                                   // light tones are drawn with a light hand
          vec3 col = uPaper;
          // marker wash: broad bands, each one a single pull of the pen along its length, one band after another
          vec2 hM = turn(hc, hAng + 0.35); float band = hM.y / 0.46, across = fract(band) - 0.5;
          vec2 gS = vec2(dFdx(sW), dFdy(sW)), gB = vec2(dFdx(band), dFdy(band));
          float sBand = sW - across * dot(gS, gB) / max(dot(gB, gB), 1e-9) + (h11(floor(band)) - 0.5) * 0.07;   // how far across the object this band's middle is
          float wash = step(sBand * 0.9 + 0.05, clamp((uTime - uWashT.x) / uWashT.y, 0.0, 1.0) * 1.001 - 0.0005) * uWashT.z;
          wash *= 0.78 + 0.14 * n2(vec2(hM.x * 0.5, hM.y * 6.0)) + 0.16 * smoothstep(0.38, 0.5, abs(across));     // streaky, and darker where two bands overlap
          col = mix(col, uWash, clamp(wash, 0.0, 1.0) * 0.9);
          col = mix(col, uInk, ink * 0.9);
          gl_FragColor = vec4(col, 1.0);`);
      };
      // the shadow appears with the shading: the same wipe, for the shadow pass
      const depth = new THREE.MeshDepthMaterial();
      depth.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, { uTime: u.uTime, uT: u.uT, uWipe: u.uWipe });
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vObjP;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjP = transformed;');
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uTime; uniform vec2 uT; uniform vec4 uWipe; varying vec3 vObjP;')
          .replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\nif ((dot(vObjP, uWipe.xyz) + uWipe.w) * 0.8 + 0.1 > clamp((uTime - uT.x) / uT.y * 1.6, 0.0, 1.0)) discard;');
      };
      m.userData.depth = depth;
      return m;
    }

    // ---- pencil lines. Every line is one instance of a thin strip between two points in 3D. The vertex shader works
    // on screen: it gives the strip a width in pixels, a slow wobble and a slight bow, and "boils" a little of that
    // wobble on held frames. The fragment shader does pressure, the tapered flick at the end, dashes and the draw-on.
    const STRIP = 10, sp = [], si = [];
    for (let i = 0; i <= STRIP; i++) { sp.push(i / STRIP, -1, 0, i / STRIP, 1, 0); if (i < STRIP) { const k = i * 2; si.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); } }
    const STROKE_VS = `
      attribute vec4 iA, iB, iT, iS;      // iA = start + looseness, iB = end, iT = (start time, duration, seed, width px), iS = (darkness, accent, wobble px, dash px)
      uniform float uTime, uBoil; uniform vec2 uRes;
      varying vec4 vL, vS; varying vec4 vK;
      ${NOISE}
      void main(){
        vec4 a = modelViewMatrix * vec4(iA.xyz, 1.0), b = modelViewMatrix * vec4(iB.xyz, 1.0);
        if (a.z > -0.3 && b.z > -0.3) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }               // behind the camera
        if (a.z > -0.3) a = mix(b, a, (-0.3 - b.z) / (a.z - b.z)); else if (b.z > -0.3) b = mix(a, b, (-0.3 - a.z) / (b.z - a.z));
        a.xyz *= 0.997; b.xyz *= 0.997;                                                                  // a hair toward the eye, so a line on a surface is not swallowed by it
        vec4 ca = projectionMatrix * a, cb = projectionMatrix * b, c = mix(ca, cb, position.x);
        vec2 sa = ca.xy / ca.w * uRes * 0.5, sb = cb.xy / cb.w * uRes * 0.5, d = sb - sa;
        float len = max(length(d), 1e-3); vec2 dir = d / len, nrm = vec2(-dir.y, dir.x);
        float along = dot(c.xy / c.w * uRes * 0.5 - sa, dir), seed = iT.z, hw = iT.w * 0.5 + 1.5;
        float wob = (n1(seed * 31.7 + along / 90.0) - 0.5) * 2.0 + sin(position.x * 3.14159) * (h11(seed * 3.3) - 0.5) * 1.8;
        wob += (n1(seed * 17.3 + along / 60.0 + uBoil * 7.1) - 0.5) * 0.7;                               // the boil: a little of the wobble is redrawn on every hold
        c.xy += nrm * (position.y * hw + wob * iS.z) / (uRes * 0.5) * c.w;
        gl_Position = c;
        vL = vec4(position.x, position.y * hw, along, len); vS = iS;
        vK = vec4(seed, iT.w * 0.5, iA.w, clamp((uTime - iT.x) / max(iT.y, 1e-3), 0.0, 1.0));
      }`;
    const STROKE_FS = `
      uniform vec3 uGraphite, uAccent; uniform float uOpacity;
      varying vec4 vL, vS; varying vec4 vK;
      ${NOISE}
      void main(){
        float prog = 1.0 - (1.0 - vK.w) * (1.0 - vK.w);                                                  // the hand starts fast and slows into the end of a line
        if (vL.x > prog) discard;
        float seed = vK.x, loose = vK.z;
        float a = 1.0 - smoothstep(vK.y - 0.9, vK.y + 0.9, abs(vL.y));
        a *= mix(1.0, 0.58 + 0.42 * n1(seed * 13.1 + vL.z / 36.0), loose);                               // pressure changes along a line
        a *= mix(1.0, smoothstep(-1.0, 4.0, vL.z) * (0.3 + 0.7 * smoothstep(0.0, 34.0, vL.w - vL.z)), loose);   // firm start, light flick at the end
        if (vS.w > 0.0) a *= step(fract(vL.z / vS.w + seed), 0.6);
        gl_FragColor = vec4(mix(uGraphite, uAccent, vS.y), a * vS.x * uOpacity);
      }`;
    const strokeMaterial = (opacity, extra) => new THREE.ShaderMaterial(Object.assign({
      vertexShader: STROKE_VS, fragmentShader: STROKE_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide,
      uniforms: { uTime: U.uTime, uBoil: U.uBoil, uRes: U.uRes, uGraphite: U.uGraphite, uAccent: U.uAccent, uOpacity: { value: opacity } },
    }, extra));

    // one line. o: at, dur (draw-on), w (px), ink (0..1), accent, wobble (px), dash (px, 0 = solid), loose (1 = sketch
    // line with pressure and taper, 0 = an even line for lettering), over ([start, end] overshoot in world units)
    function line(a, b, p = {}) {
      const ov = p.over || [0, 0], d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], len = Math.hypot(...d) || 1, n = d.map((x) => x / len);
      return { a: a.map((x, i) => x - n[i] * ov[0]), b: b.map((x, i) => x + n[i] * ov[1]), at: p.at == null ? -9 : p.at, dur: p.dur || 0.25, w: p.w || 3.2, ink: p.ink == null ? 0.88 : p.ink,
        accent: p.accent ? 1 : 0, wobble: p.wobble == null ? 1.4 : p.wobble, dash: p.dash || 0, loose: p.loose == null ? 1 : p.loose, seed: nextSeed() };
    }
    // strokes(list, { parent, ghost, onTop }): ghost = how strongly lines show through things in front of them (0 = hidden
    // lines stay hidden); onTop = ignore depth (notes on the page). Returns the mesh; mesh.userData.set(i, a, b) moves a line.
    function strokes(list, p = {}) {
      const n = list.length, g = new THREE.InstancedBufferGeometry(), A = new Float32Array(n * 4), B = new Float32Array(n * 4), T = new Float32Array(n * 4), St = new Float32Array(n * 4);
      list.forEach((s, i) => { A.set([...s.a, s.loose], i * 4); B.set([...s.b, 0], i * 4); T.set([s.at, s.dur, s.seed, s.w], i * 4); St.set([s.ink, s.accent, s.wobble, s.dash], i * 4); });
      g.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); g.setIndex(si);
      g.setAttribute('iA', new THREE.InstancedBufferAttribute(A, 4)); g.setAttribute('iB', new THREE.InstancedBufferAttribute(B, 4));
      g.setAttribute('iT', new THREE.InstancedBufferAttribute(T, 4)); g.setAttribute('iS', new THREE.InstancedBufferAttribute(St, 4));
      g.instanceCount = n;
      const mesh = new THREE.Mesh(g, strokeMaterial(1, p.onTop ? { depthTest: false } : {}));
      mesh.frustumCulled = false; mesh.renderOrder = p.onTop ? 30 : 20; (p.parent || scene).add(mesh);
      if (p.ghost && !p.onTop) { const gh = new THREE.Mesh(g, strokeMaterial(p.ghost, { depthFunc: THREE.GreaterDepth })); gh.frustumCulled = false; gh.renderOrder = 10; (p.parent || scene).add(gh); }
      mesh.userData.set = (i, a, b) => { A.set(a, i * 4); B.set(b, i * 4); g.attributes.iA.needsUpdate = true; g.attributes.iB.needsUpdate = true; };
      return mesh;
    }

    // the edges of any geometry as pencil lines: found from its creases, drawn bottom-up and left to right, each one
    // overshooting its corners. o: at, lineDur, over (overshoot, world units), restate (chance of a second, lighter
    // line beside the first), construct (true = long faint setting-out lines first), w, ink, crease (degrees), keep(a, b)
    function edgeStrokes(geo, p = {}) {
      const r = K.rng(p.seed || 11), e = new THREE.EdgesGeometry(geo, p.crease || 30).attributes.position, segs = [];
      for (let i = 0; i < e.count; i += 2) {
        let a = [e.getX(i), e.getY(i), e.getZ(i)], b = [e.getX(i + 1), e.getY(i + 1), e.getZ(i + 1)];
        if (b[1] - a[1] < -1e-3 || (Math.abs(b[1] - a[1]) <= 1e-3 && b[0] - b[2] * 0.5 < a[0] - a[2] * 0.5)) [a, b] = [b, a];
        if (!p.keep || p.keep(a, b)) segs.push({ a, b, len: Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) });
      }
      segs.sort((s, q) => (s.a[1] + s.b[1]) * 2 + s.a[0] * 0.2 - s.a[2] * 0.1 - ((q.a[1] + q.b[1]) * 2 + q.a[0] * 0.2 - q.a[2] * 0.1));
      const out = [], at = p.at == null ? -9 : p.at, span = (p.lineDur == null ? 0.6 : p.lineDur) * 0.72, over = p.over == null ? 0.14 : p.over, restate = p.restate == null ? 0.55 : p.restate;
      segs.forEach((s, i) => {
        const t0 = at + span * i / Math.max(1, segs.length - 1), dur = K.clamp(s.len * 0.08, 0.1, 0.3), ov = (k = 1) => Math.min(s.len * 0.25, r.range(0.25, 1) * over * k);
        if (p.construct && s.len > 1.4) out.push(line(s.a, s.b, { at: t0 - 0.4, dur: dur * 1.5, w: 2.1, ink: 0.26, wobble: 0.9, over: [r.range(0.4, 1.3), r.range(0.4, 1.3)] }));
        out.push(line(s.a, s.b, { at: t0, dur, w: p.w || 3.4, ink: p.ink || 0.9, over: [ov(), ov()], wobble: Math.min(1.5, s.len * 2) }));
        if (s.len > 0.4 && r() < restate) {
          const j = () => r.range(-0.028, 0.028);
          out.push(line(s.a.map((x) => x + j()), s.b.map((x) => x + j()), { at: t0 + dur * 0.8, dur, w: 2.4, ink: 0.42, over: [ov(1.5), ov(1.5)] }));
        }
      });
      return out;
    }

    // a shaded form with its outline. o: everything hatchMaterial and edgeStrokes take, plus pos, rot, cast (shadow),
    // edges (false = no outline), ghost (how much its hidden lines show through, default 0.11)
    function solid(geo, p = {}) {
      const mat = hatchMaterial(geo, p), mesh = new THREE.Mesh(geo, mat);
      if (p.pos) mesh.position.set(...p.pos); if (p.rot) mesh.rotation.set(...p.rot);
      mesh.castShadow = p.cast !== false; mesh.receiveShadow = true; mesh.customDepthMaterial = mat.userData.depth;
      (p.parent || scene).add(mesh);
      if (p.edges !== false) strokes(edgeStrokes(geo, p), { parent: mesh, ghost: p.ghost == null ? 0.11 : p.ghost });
      return mesh;
    }

    // single-stroke lettering as pencil lines (needs lib/strokefont.js). Returns { list, width, end }.
    // o: x, y (left end, middle of the capitals), size (cap height), at, cps (letters per second), w, ink, accent,
    // slant, map (turns a flat point [x, y] into a 3D point: this is what puts the words on a page or on a wall)
    function write(text, p = {}) {
      const r = K.rng(text + (p.x || 0)), size = p.size || 1, lay = STROKEFONT.layout(text, { size, align: 'left', step: 0.11, spacing: p.spacing == null ? 0.2 : p.spacing });
      const map = p.map || ((x, y) => [x, y, 0]), cps = p.cps || 24, at = p.at == null ? -9 : p.at, w = p.w || 5, slant = p.slant == null ? 0.07 : p.slant, list = [];
      const ext = p.ext == null ? 0 : p.ext;
      lay.glyphs.forEach((gl, gi) => {
        const dx = r.range(-0.02, 0.02) * size, dy = r.range(-0.03, 0.03) * size, rot = r.range(-0.035, 0.035), cx = gl.x + gl.w / 2;   // no two letters sit quite alike
        const total = gl.strokeIndexes.reduce((s, k) => s + STROKEFONT.length(lay.strokes[k]), 0) || 1; let done = 0;
        for (const k of gl.strokeIndexes) {
          const st = lay.strokes[k], pts = st.points.map(([x, y]) => { const u = x - cx, v = y; return [(p.x || 0) + cx + u * Math.cos(rot) - v * Math.sin(rot) + v * slant + dx, (p.y || 0) + u * Math.sin(rot) + v * Math.cos(rot) + dy]; });
          if (st.closed) pts.push(pts[0]);
          for (let i = pts.length - 2; i > 0; i--) {                                                       // a straight run is one pull of the pencil, not a row of dots
            const ax = pts[i][0] - pts[i - 1][0], ay = pts[i][1] - pts[i - 1][1], bx = pts[i + 1][0] - pts[i][0], by = pts[i + 1][1] - pts[i][1];
            if (Math.abs(ax * by - ay * bx) < 0.05 * Math.hypot(ax, ay) * Math.hypot(bx, by) && ax * bx + ay * by > 0) pts.splice(i, 1);
          }
          for (let i = 1; i < pts.length; i++) {
            const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]), e = ext / (l || 1);
            const a = [pts[i - 1][0] - (pts[i][0] - pts[i - 1][0]) * e, pts[i - 1][1] - (pts[i][1] - pts[i - 1][1]) * e], b = [pts[i][0] + (pts[i][0] - pts[i - 1][0]) * e, pts[i][1] + (pts[i][1] - pts[i - 1][1]) * e];
            list.push(line(map(a[0], a[1]), map(b[0], b[1]), { at: at + (gi + done / total) / cps, dur: l / total / cps, w, ink: p.ink == null ? 0.92 : p.ink, accent: p.accent, wobble: 0, loose: 0 }));
            done += l;
          }
        }
      });
      return { list, width: lay.width, end: at + lay.glyphs.length / cps };
    }

    return { U, solid, strokes, line, edgeStrokes, write, hatchMaterial };
  }

  // ---- the paper: one full-screen pass over the finished drawing. Everything in it is fixed to the page, like the
  // sheet itself: the drawing turns, the paper does not.
  const PAPER_FILTER = `
    uniform vec3 paper; uniform vec4 rub, smudgeA, smudgeB;   // rub = the eraser mark: centre (px from the bottom left), half length, half width. smudges: centre, radii
    ${NOISE}
    float fbm(vec2 p){ return 0.5 * n2(p) + 0.3 * n2(p * 2.1 + 5.0) + 0.2 * n2(p * 4.3 + 9.0); }
    float lum(vec3 c){ return dot(c, vec3(0.3, 0.55, 0.15)); }
    void main(){
      vec2 p = vUv * res; vec3 c = texture2D(tex, vUv).rgb;
      // smudge: where the side of the hand has rested, graphite is dragged down and to the right and leaves a grey haze
      float sm = 0.0;
      for (int i = 0; i < 2; i++) { vec4 z = i == 0 ? smudgeA : smudgeB; vec2 e = (p - z.xy) / z.zw; sm += smoothstep(1.0, 0.25, length(e) + 0.5 * (fbm(p * 0.004 + float(i) * 9.0) - 0.5)); }
      vec3 drag = vec3(0.0); float ws = 0.0;
      for (int i = 0; i < 10; i++) { float w = 1.0 - float(i) / 10.0; drag += texture2D(tex, vUv - vec2(0.94, -0.34) * float(i) * 4.0 / res).rgb * w; ws += w; }
      c = mix(c, drag / ws, 0.8 * sm) * (1.0 - 0.022 * sm);
      // the eraser mark: most of the graphite is lifted, a ghost of it stays, and the paper is rubbed a little cleaner
      vec2 q = p - rub.xy; q = vec2(q.x * 0.97 + q.y * 0.24, -q.x * 0.24 + q.y * 0.97);
      float er = 1.0 - smoothstep(0.0, 14.0, length(vec2(max(abs(q.x) - rub.z, 0.0), q.y)) - rub.w + 9.0 * n2(p * 0.05));
      c = mix(c, paper, er * 0.8);
      // tooth: a pencil only touches the high points of the paper, so light lines break up and heavy ones fill in
      float tooth = 0.55 * n2(p * 0.62) + 0.45 * n2(p * 1.45 + 31.0);
      float k = clamp(1.0 - lum(c) / lum(paper), 0.0, 1.0);
      vec3 sheet = paper * (1.0 + (fbm(p * 0.006) - 0.5) * 0.045 - (0.5 - tooth) * 0.035 + er * 0.012);
      sheet *= 1.0 - 0.05 * smoothstep(0.35, 0.95, length((vUv - 0.5) * vec2(1.0, 0.8)) * 1.6);      // the page falls away a little toward its edges
      float bite = mix(clamp(0.25 + 1.5 * tooth, 0.0, 1.6), 1.0, smoothstep(0.25, 0.9, k));
      gl_FragColor = vec4(clamp(sheet - (paper - c) * bite, 0.0, 1.0), 1.0);
    }`;

  // ================================================================ THE STYLE
  registerStyle({
    id: 'pencil-sketch',
    name: 'Pencil Sketch',
    family: 'Filters over 3D',
    look: 'A real 3D scene that reads as a graphite drawing in a designer\'s sketchbook: forms shaded with hatching and cross-hatching that follows the light, outlines that overshoot their corners, faint construction lines, hand lettering, toothy paper with a smudge and an eraser mark, and one red accent.',
    motion: 'The drawing makes itself: setting-out lines first, then outlines stroke by stroke, then shading laid across each form in one direction and crossed in a second. Hatching is fixed to the objects and turns with them; only the line wobble boils a little, on held frames. Notes are lettered on and their leader lines follow the parts as the view turns.',
    light: 'One sun from the upper left and flat fill. The light is never shown directly: it only decides how many layers of hatching a face or a cast shadow gets, so lit faces stay as bare paper and shade is cross-hatched.',
    materials: 'Graphite on cream cartridge paper. Soft dark pencil for outlines and lettering, lighter pencil for hatching and construction lines, a red pencil for numbers and marks, and one wash of red marker on the part that matters.',
    camera: 'One slow, continuous arc round the subject on a long lens, about 35 degrees from nearly front-on to a three-quarter view, rising and pulling back a little as the drawing grows. Everything is sharp, like a drawing. The subject sits left of centre so the notes have a clear column of paper.',
    post: 'No motion blur, bloom, grain or vignette. One paper pass: tooth that breaks up light lines, a hand smudge that drags graphite, an eraser mark, slight mottling and darker page edges.',
    explains: 'How something is built or put together, step by step: parts are drawn in order, each with a numbered note. Also good for anatomy of an object, plans, exploded views and anything that benefits from seeing the structure through the surface.',
    topic: 'How a house goes up: foundation, frame, walls, roof',
    duration: DURATION,
    fonts: [],
    render: { samples: 16, preview: 4, shutter: 0, tone: 'linear', exposure: 1, bloom: 0, vignette: 0, grain: 0, fov: 30, near: 1, far: 160, background: PAPER },

    build(S) {
      const { THREE, K, scene, camera } = S;
      const kit = pencilKit(S, { paper: PAPER, graphite: GRAPHITE, accent: ACCENT }), { solid, strokes, line, write } = kit;
      const P = plan(), rnd = K.rng(5);
      const disp = (hex) => { const n = parseInt(hex.slice(1), 16); return new THREE.Vector3((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255); };
      S.addFilter(PAPER_FILTER, { paper: { value: disp(PAPER) }, rub: { value: new THREE.Vector4(1345, 978, 92, 30) },
        smudgeA: { value: new THREE.Vector4(1120, 265, 230, 85) }, smudgeB: { value: new THREE.Vector4(1560, 90, 230, 60) } });

      // light: it only ever becomes hatching. Sun from the upper left, so the front is light, the right side in shade
      K.sun(S, { pos: [-6, 15, 7], target: [0, 1, 0], power: Math.PI, size: 10, soft: 0.22 });
      scene.add(new THREE.AmbientLight('#ffffff', Math.PI * 0.3));

      // ---------------------------------------------------------------- the subject: a small house, in four stages
      const W = 6.2, D = 4.4, SLAB = 0.3, WALL = 2.6, RISE = 1.75, T = 0.15, WT = 0.1, y0 = SLAB, yTop = SLAB + WALL, yApex = yTop + RISE;
      // ground: bare paper where it is lit, hatching where a shadow falls
      solid(new THREE.PlaneGeometry(70, 70).rotateX(-Math.PI / 2), { edges: false, cast: false, angle: 0.5, fan: 0, lift: 0.06 });

      // blocking-in: before anything is drawn firmly, the whole volume is set out in faint lines that run past their corners
      const mass = [], bx = W / 2 + WT, bz = D / 2 + WT, faint = (a, b) => mass.push(line(a, b, { w: 2.1, ink: 0.3, wobble: 1.1, over: [rnd.range(0.35, 1.1), rnd.range(0.35, 1.1)] }));
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) faint([sx * bx, y0, sz * bz], [sx * bx, yTop, sz * bz]);
        faint([sx * bx, yTop, bz], [sx * bx, yApex, 0]); faint([sx * bx, yTop, -bz], [sx * bx, yApex, 0]); faint([sx * bx, yTop, -bz], [sx * bx, yTop, bz]);
        faint([-bx, yTop, sx * bz], [bx, yTop, sx * bz]);
      }
      faint([-bx, yApex, 0], [bx, yApex, 0]);
      strokes(mass);

      // 1 foundation
      solid(new THREE.BoxGeometry(W + 0.7, SLAB, D + 0.7), { pos: [0, SLAB / 2, 0], at: P.slab.at, lineDur: 0.75, fillAt: P.slab.fillAt, fillDur: P.slab.fill, construct: true, seed: 2, angle: 0.3 });

      // 2 frame: plates, then studs going up one after another round the house, then the top plates
      const beam = (len, along, x, y, z, at) => solid(new THREE.BoxGeometry(along === 'x' ? len : T, T, along === 'x' ? T : len), { pos: [x, y, z], at, lineDur: 0.3, fillAt: at + 0.2, fillDur: 0.3, restate: 0, over: 0.07, w: 3, seed: x * 7 + z * 3 + y, fan: 0, lift: 0.26 });
      const ring = (y, at) => { beam(W, 'x', 0, y, D / 2 - T / 2, at); beam(D - 2 * T, 'z', W / 2 - T / 2, y, 0, at + 0.08); beam(W, 'x', 0, y, -D / 2 + T / 2, at + 0.16); beam(D - 2 * T, 'z', -W / 2 + T / 2, y, 0, at + 0.24); };
      ring(y0 + T / 2, P.plates);
      const studs = [];
      for (let i = 0; i < 9; i++) if (i !== 4) studs.push([-W / 2 + T / 2 + i * (W - T) / 8, D / 2 - T / 2]);            // front, with a gap for the door
      for (let j = 1; j < 6; j++) studs.push([W / 2 - T / 2, D / 2 - T / 2 - j * (D - T) / 6]);                          // right side
      for (let i = 8; i >= 0; i--) studs.push([-W / 2 + T / 2 + i * (W - T) / 8, -D / 2 + T / 2]);                       // back
      for (let j = 5; j > 0; j--) studs.push([-W / 2 + T / 2, D / 2 - T / 2 - j * (D - T) / 6]);                         // left side
      const studTimes = studs.map((_, i) => P.studs + i * P.studGap);
      studs.forEach(([x, z], i) => solid(new THREE.BoxGeometry(T, WALL - 2 * T, T), { pos: [x, y0 + WALL / 2, z], at: studTimes[i], lineDur: 0.22, fillAt: studTimes[i] + 0.12, fillDur: 0.25, restate: 0, over: 0.1, w: 3, seed: i + 20, wipe: [0, 1, 0], fan: 0, lift: 0.26 }));
      beam((W - T) / 4 - T, 'x', 0, y0 + 2.2, D / 2 - T / 2, P.studs + 0.5);                                              // the header over the door
      ring(yTop - T / 2, P.topPlate);

      // 3 walls: front and back with openings, gable ends on the sides
      const rect = (x0, y0_, x1, y1) => { const s = new THREE.Path(); s.moveTo(x0, y0_); s.lineTo(x1, y0_); s.lineTo(x1, y1); s.lineTo(x0, y1); s.closePath(); return s; };
      const front = new THREE.Shape(); front.moveTo(-W / 2, y0); front.lineTo(-0.5, y0); front.lineTo(-0.5, y0 + 2.05); front.lineTo(0.5, y0 + 2.05); front.lineTo(0.5, y0); front.lineTo(W / 2, y0); front.lineTo(W / 2, yTop); front.lineTo(-W / 2, yTop); front.closePath();
      front.holes.push(rect(1.35, y0 + 0.95, 2.45, y0 + 2.05), rect(-2.45, y0 + 0.95, -1.35, y0 + 2.05));
      const back = new THREE.Shape(); back.moveTo(-W / 2, y0); back.lineTo(W / 2, y0); back.lineTo(W / 2, yTop); back.lineTo(-W / 2, yTop); back.closePath();
      const gable = new THREE.Shape(); gable.moveTo(-D / 2 - WT, y0); gable.lineTo(D / 2 + WT, y0); gable.lineTo(D / 2 + WT, yTop); gable.lineTo(0, yApex + WT * 0.76); gable.lineTo(-D / 2 - WT, yTop); gable.closePath();
      gable.holes.push(rect(-0.6, y0 + 0.95, 0.6, y0 + 2.05));
      const ext = (shape) => new THREE.ExtrudeGeometry(shape, { depth: WT, bevelEnabled: false });
      const wallOpts = (k, seed) => ({ at: P.walls.at + k * P.walls.side, lineDur: 0.6, fillAt: P.walls.fillAt + k * P.walls.side, fillDur: P.walls.fill, seed });
      solid(ext(front).translate(0, 0, D / 2), wallOpts(0, 31));
      solid(ext(gable).rotateY(Math.PI / 2).translate(W / 2, 0, 0), wallOpts(1, 32));
      solid(ext(back).translate(0, 0, -D / 2 - WT), wallOpts(0.5, 33));
      solid(ext(gable).rotateY(Math.PI / 2).translate(-W / 2 - WT, 0, 0), wallOpts(0.5, 34));
      // glass and door: a fixed dark tone for the panes (gain 0), glazing bars and planks as loose lines
      const det = [], dAt = P.walls.details;
      const pane = (geo, pos, tone) => solid(geo, { pos, edges: false, cast: false, gain: 0, lift: tone, fillAt: dAt, fillDur: 0.5, angle: 0.8, fan: 0 });
      for (const cx of [1.9, -1.9]) {
        pane(new THREE.BoxGeometry(1.1, 1.1, 0.02), [cx, y0 + 1.5, D / 2 + 0.03], 0.27);
        det.push(line([cx, y0 + 0.95, D / 2 + 0.05], [cx, y0 + 2.05, D / 2 + 0.05], { at: dAt + 0.2, w: 2.6, over: [0.03, 0.03] }), line([cx - 0.55, y0 + 1.5, D / 2 + 0.05], [cx + 0.55, y0 + 1.5, D / 2 + 0.05], { at: dAt + 0.3, w: 2.6, over: [0.03, 0.03] }));
        det.push(line([cx - 0.66, y0 + 0.9, D / 2 + WT + 0.01], [cx + 0.66, y0 + 0.9, D / 2 + WT + 0.01], { at: dAt + 0.4, w: 3.6, over: [0.05, 0.08] }));   // the sill
      }
      pane(new THREE.BoxGeometry(0.02, 1.1, 1.2), [W / 2 + 0.03, y0 + 1.5, 0], 0.1);
      det.push(line([W / 2 + 0.05, y0 + 0.95, 0], [W / 2 + 0.05, y0 + 2.05, 0], { at: dAt + 0.35, w: 2.6 }), line([W / 2 + 0.05, y0 + 1.5, 0.6], [W / 2 + 0.05, y0 + 1.5, -0.6], { at: dAt + 0.45, w: 2.6 }));
      pane(new THREE.BoxGeometry(1.0, 2.05, 0.02), [0, y0 + 1.025, D / 2 + 0.03], 0.78);
      for (const x of [-0.25, 0, 0.25]) det.push(line([x, y0 + 0.04, D / 2 + 0.05], [x, y0 + 2.0, D / 2 + 0.05], { at: dAt + 0.25 + x * 0.3, w: 2.2, ink: 0.6, over: [0, 0.02] }));
      det.push(line([0.36, y0 + 1.0, D / 2 + 0.05], [0.4, y0 + 1.0, D / 2 + 0.05], { at: dAt + 0.5, w: 7, wobble: 0, loose: 0 }));                              // the door knob
      det.push(line([-0.75, y0 + 0.02, D / 2 + WT + 0.3], [0.75, y0 + 0.02, D / 2 + WT + 0.3], { at: dAt + 0.5, w: 3, over: [0.05, 0.08] }));                   // the step
      strokes(det, { ghost: 0 });

      // 4 roof: ridge and rafters as bare lines first, then the roof itself with the one wash of colour
      const raf = [line([-W / 2 - 0.3, yApex, 0], [W / 2 + 0.3, yApex, 0], { at: P.rafters, dur: 0.3, w: 3, over: [0.2, 0.3] })];
      for (let i = 0; i < 6; i++) { const x = -W / 2 + T + i * (W - 2 * T) / 5; for (const s of [1, -1]) raf.push(line([x, yTop, s * D / 2], [x, yApex, 0], { at: P.rafters + 0.08 + i * 0.045 + (s < 0 ? 0.02 : 0), dur: 0.2, w: 2.8, ink: 0.8, over: [0.12, 0.1] })); }
      strokes(raf, { ghost: 0.11 });
      const OV = 0.42, RT = 0.15, slope = RISE / (D / 2 + WT), zE = D / 2 + WT + OV, yE = yTop - OV * slope, LEN = W + 2 * WT + 0.7;
      const prof = new THREE.Shape(); prof.moveTo(zE, yE); prof.lineTo(0, yApex); prof.lineTo(-zE, yE); prof.lineTo(-zE, yE + RT); prof.lineTo(0, yApex + RT); prof.lineTo(zE, yE + RT); prof.closePath();
      solid(new THREE.ExtrudeGeometry(prof, { depth: LEN, bevelEnabled: false }).rotateY(Math.PI / 2).translate(-LEN / 2, 0, 0),
        { at: P.roof.at, lineDur: 0.55, fillAt: P.roof.fillAt, fillDur: P.roof.fill, wash: WASH, washAt: P.roof.washAt, washDur: P.roof.wash, angle: Math.PI / 2, fan: 0, construct: true, seed: 41, wipe: [1, 0.4, -0.55] });
      solid(new THREE.BoxGeometry(0.55, 1.5, 0.55), { pos: [1.75, yApex - 0.35, -1.05], at: P.chimney, lineDur: 0.3, fillAt: P.chimney + 0.2, fillDur: 0.4, seed: 43, over: 0.08, ghost: 0 });

      const curl = [], cTop = [1.75, yApex + 0.42, -1.05];                                                              // a curl of smoke, in one unbroken line
      for (let i = 0; i <= 34; i++) { const u = i / 34, a = u * 4.2 * Math.PI; curl.push([cTop[0] + 0.34 * u + 0.1 * (0.5 + u) * Math.sin(a), cTop[1] + 0.05 + 0.5 * u + 0.07 * (0.5 + u) * (1 - Math.cos(a)), cTop[2]]); }
      strokes(curl.slice(1).map((q, i) => line(curl[i], q, { at: P.smoke + i * 0.011, dur: 0.012, w: 2.6, ink: 0.62, wobble: 0, loose: 0 })));

      // ---------------------------------------------------------------- setting-out on the ground: grid, centre lines, a dimension
      const lay = [], G = 0.006;
      for (let x = -10; x <= 10; x += 2) lay.push(line([x, G, -8], [x, G, 8], { w: 2, ink: 0.15, wobble: 1 }));
      for (let z = -8; z <= 8; z += 2) lay.push(line([-10, G, z], [10, G, z], { w: 2, ink: 0.15, wobble: 1 }));
      lay.push(line([-5.6, G, 0], [5.8, G, 0], { w: 2.2, ink: 0.34, dash: 30 }), line([0, G, -4.4], [0, G, 4.8], { w: 2.2, ink: 0.34, dash: 30 }));
      const zd = D / 2 + 1.5, xs = (W + 0.7) / 2;
      for (const s of [-1, 1]) {
        lay.push(line([s * xs, G, D / 2 + 0.5], [s * xs, G, zd + 0.3], { at: P.dim, dur: 0.15, w: 2.2, ink: 0.6 }));                                         // witness lines
        lay.push(line([s * xs - 0.11, G, zd + 0.16], [s * xs + 0.11, G, zd - 0.16], { at: P.dim + 0.3 + s * 0.04, dur: 0.08, w: 3.8, accent: 1, wobble: 0 }));   // the draughtsman's tick
      }
      lay.push(line([-xs, G, zd], [xs, G, zd], { at: P.dim + 0.05, dur: 0.3, w: 2.4, ink: 0.7, over: [0.25, 0.25] }));
      const dimW = write(DIMENSION, { size: 0.32 }).width;
      lay.push(...write(DIMENSION, { size: 0.32, at: P.dim + 0.35, cps: 14, w: 3.8, map: (x, y) => [x - dimW / 2, 0.34 + y, zd] }).list);
      strokes(lay, { ghost: 0 });

      // ---------------------------------------------------------------- the page: title and notes are lettered on the sheet, not in the scene.
      // `page` copies the camera, so its children are placed in pixels from the middle of the frame (y up).
      const page = new THREE.Group(), FV = 2 * Math.tan(THREE.MathUtils.degToRad(S.R.fov) / 2) / S.H, PZ = -1 / FV, PAGE_AT = 8, onPage = (x, y) => [x, y, PZ];   // the sheet hangs 8 units in front of the lens
      scene.add(page);
      const ink = [], guide = (x0, x1, y, size, at) => { for (const s of [-0.5, 0.5]) ink.push(line(onPage(x0, y + s * size * 1.06), onPage(x1, y + s * size * 1.06), { at, dur: 0.2, w: 1.8, ink: 0.24, wobble: 0.6 })); };
      const TS = 56, tx = -872, ty = 448, title = write(TITLE, { x: tx, y: ty, size: TS, w: 6.4, map: onPage, at: -5, ext: 0.7 });
      guide(tx - 46, tx + title.width + 430, ty, TS, -6);                                                                 // lettering guidelines, rubbed out past the end
      ink.push(...title.list);
      ink.push(line(onPage(tx - 6, ty - TS * 0.86), onPage(tx + title.width * 0.62, ty - TS * 0.86 + 5), { at: -5, w: 3.4, accent: 1, wobble: 1.6 }));
      const NS = 47, wide = Math.max(...STAGES.map((st) => write(st.label, { size: NS }).width)), nx = 960 - 70 - wide - NS * 1.5;   // the widest note ends 70 px from the edge
      const rows = [-322, -140, 42, 224], notes = STAGES.map((st, i) => {
        const y = rows[i], at = P.notes[i];
        guide(nx - 36, nx + 440, y, NS, at - 0.25);
        ink.push(...write(String(i + 1), { x: nx - (i === 0 ? 5 : 11), y, size: NS * 0.8, w: 5, map: onPage, at, accent: 1, ext: 0.6, slant: 0.02 }).list);
        const R0 = NS * 0.88, M = 26, turns = 1.12, ph = 2.2;                                                          // the ring round the number does not quite meet itself
        for (let k = 0; k < M; k++) { const a0 = ph + k / M * turns * 6.283, a1 = ph + (k + 1.25) / M * turns * 6.283, r0 = R0 * (1 + 0.1 * k / M), r1 = R0 * (1 + 0.1 * (k + 1) / M); ink.push(line(onPage(nx + Math.cos(a0) * r0 * 1.05, y + Math.sin(a0) * r0), onPage(nx + Math.cos(a1) * r1 * 1.05, y + Math.sin(a1) * r1), { at: at + 0.04 + k * 0.006, dur: 0.02, w: 3.4, accent: 1, wobble: 0, loose: 0, ink: 0.85 })); }
        const word = write(st.label, { x: nx + NS * 1.5, y, size: NS, w: 5.8, map: onPage, at: at + 0.2, cps: 26, ext: 0.6 });
        ink.push(...word.list);
        return { y, at, end: word.end };
      });
      strokes(ink, { parent: page, onTop: true });
      // leader lines: fixed to the note at one end and to the part at the other, so they swing as the drawing turns
      const anchors = [[W / 2 + 0.35, SLAB, D / 2 + 0.35], [W / 2 - T / 2, y0 + 1.3, D / 2 - T / 2 - (D - T) / 6], [W / 2 + WT, y0 + 1.75, -1.25], [W / 2 + 0.2, yApex - 0.62, 0.95]];
      const leaders = strokes(notes.flatMap((n) => [line([0, 0, 0], [1, 0, 0], { at: n.end, dur: 0.22, w: 2.6, ink: 0.8, wobble: 1.2 }), line([0, 0, 0], [1, 0, 0], { at: n.end + 0.2, dur: 0.05, w: 3, wobble: 0 }), line([0, 0, 0], [1, 0, 0], { at: n.end + 0.24, dur: 0.05, w: 3, wobble: 0 })]), { parent: page, onTop: true });

      // ---------------------------------------------------------------- camera: one continuous arc round the house, rising as it grows.
      // Keys are [angle round the house (degrees from straight in front), height angle, distance, how far the house
      // sits left of centre (world units), height looked at]. The drawing turns; the hatching turns with it.
      const shot = K.path([[0, [6, 9.5, 16.0, 2.0, 1.75]], [2, [14, 11, 16.6, 2.25, 1.9]], [4, [24, 12.5, 17.3, 2.5, 2.05]], [6, [34, 14, 18.0, 2.8, 2.15]], [8, [42, 15.5, 18.6, 3.0, 2.25]]]);
      const rad = THREE.MathUtils.degToRad;
      const v = new THREE.Vector3();

      return {
        update(t) {
          kit.U.uTime.value = t;
          kit.U.uBoil.value = Math.floor(t * 7.5 + 0.5);           // the line wobble is redrawn every fourth frame
          const [yaw, tilt, dist, left, high] = shot(t), cy = Math.cos(rad(yaw)), sy = Math.sin(rad(yaw)), ct = Math.cos(rad(tilt)), aim = [cy * left, high, -sy * left];
          K.look(camera, [aim[0] + sy * ct * dist, high + Math.sin(rad(tilt)) * dist, aim[2] + cy * ct * dist], aim);
          camera.updateMatrixWorld();
          page.position.copy(camera.position); page.quaternion.copy(camera.quaternion); page.scale.setScalar(PAGE_AT * FV); page.updateMatrixWorld();
          notes.forEach((n, i) => {
            page.worldToLocal(v.set(...anchors[i]));                                      // the part, in page space
            const k = v.z / PZ, a = [(nx - NS * 1.25) * k, (n.y - 4) * k, v.z], b = [v.x, v.y, v.z];
            const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, h = 17 * k;
            leaders.userData.set(i * 3, [...a, 1], [...b, 0]);
            for (const s of [1, 2]) { const an = s === 1 ? 0.42 : -0.42, c = Math.cos(an), sn = Math.sin(an); leaders.userData.set(i * 3 + s, [b[0] - (ux * c - uy * sn) * h, b[1] - (ux * sn + uy * c) * h, v.z, 0], [...b, 0]); }
          });
        },
      };
    },

    sound(k) {
      const P = plan(), r = globalThis.K.rng(3);
      const pencil = (t, dur, gain = 0.8, pan = 0) => k.play('stroke', t, { material: 'pencil', dur, gain, pan });
      const lines = (t, n, gap, dur, gain, pan) => { for (let i = 0; i < n; i++) pencil(t + i * gap, dur * r.range(0.8, 1.2), gain * r.range(0.8, 1.1), pan + r.range(-0.15, 0.15)); };
      const scribble = (t, dur, gain, pan) => k.withMinor(() => { for (let x = 0; x < dur; x += 0.085) pencil(t + x, 0.06, gain * (0.7 + 0.3 * ((x / 0.085) % 2)), pan + r.range(-0.1, 0.1)); });   // shading: quick strokes back and forth
      k.bed('room', 0, DURATION, { gain: 0.7 });
      // every note: the number, its ring, the word, then the leader line out to the part
      STAGES.forEach((st, i) => { const t = P.notes[i], word = st.label.length / 26; pencil(t, 0.07, 0.7, 0.5); pencil(t + 0.05, 0.16, 0.6, 0.5); k.withMinor(() => lines(t + 0.2, st.label.length, 1 / 26, 0.035, 0.75, 0.55)); pencil(t + 0.2 + word, 0.2, 0.55, 0.3); k.play('tick', t + 0.44 + word, { gain: 0.5, f: 2600, pan: 0.2 }); });
      // 1 foundation: only its dimension is still to come
      lines(P.dim, 2, 0.07, 0.12, 0.5, -0.3); pencil(P.dim + 0.05, 0.3, 0.6, -0.3); lines(P.dim + 0.3, 2, 0.08, 0.05, 0.7, -0.3); k.withMinor(() => lines(P.dim + 0.35, DIMENSION.length, 1 / 14, 0.05, 0.6, -0.3));
      // 2 frame: plates, a quick stroke for every stud, plates again
      lines(P.plates, 4, 0.08, 0.26, 0.6, -0.2);
      k.withMinor(() => { for (let i = 0; i < 27; i++) pencil(P.studs + i * P.studGap, 0.13, 0.55, -0.6 + 0.9 * Math.abs(1 - i / 13.5)); });
      lines(P.topPlate, 4, 0.08, 0.26, 0.6, -0.2);
      // 3 walls: outlines, then the shading goes on, then the glazing bars
      lines(P.walls.at, 7, 0.085, 0.2, 0.7, -0.25); scribble(P.walls.fillAt, P.walls.fill + 0.15, 0.5, -0.1); lines(P.walls.details + 0.2, 5, 0.06, 0.08, 0.5, -0.2);
      // 4 roof: rafters, outline, one long pull of the marker, a little shading
      k.withMinor(() => lines(P.rafters + 0.08, 12, 0.03, 0.1, 0.5, -0.2)); pencil(P.rafters, 0.3, 0.7, -0.2);
      lines(P.roof.at, 5, 0.09, 0.22, 0.7, -0.2);
      for (let i = 0; i < 3; i++) k.play('stroke', P.roof.washAt + i * 0.25, { material: 'marker', dur: 0.24, gain: 0.5, pan: -0.3 + i * 0.15 });
      scribble(P.roof.fillAt + 0.1, 0.4, 0.4, 0); lines(P.chimney, 3, 0.08, 0.12, 0.5, 0.1);
      pencil(P.smoke, 0.36, 0.5, 0.1);
      k.play('tock', P.smoke + 0.55, { gain: 0.45, f: 520 });        // the pencil is put down
    },
  });
}
```
