I want a short 3D motion graphic made with three.js in the "Inflated" style. Below is the complete source of a reference animation in this exact style, plus the small rendering kit and sound kit it runs on. Use them as your style guide and rebuild the animation around my content.

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
Name: Inflated
Family: Material worlds
Use: explainer
Look: Everything is a glossy inflatable in a bright one-colour studio: here a striped hot-air balloon, its basket, a flame, arrows, clouds and small tube letters. Each skin has welded seams and is limp, flat and creased when short of air, round and mirror-smooth when full.
Motion: Air is the animation. Things fill in pumps that overshoot and snap taut, swell from the valve end outwards, stand up, wobble and settle. Full things float and sway, landings squash and rock, arrows and captions inflate in and deflate out. Every jolt rings out as a wobble.
Light: Softboxes overhead and to the left and a thin strip on the right draw long white highlights on every skin. A soft key from the upper left shapes the forms and drops soft shadows; the floor and the flame bounce their colour onto the skins.
Materials: Clear-coated vinyl in hot candy colours (pink, orange, yellow, red) with cream trim and a wicker-orange basket, on a cobalt sweep with just enough sheen to hold a blurred pool of colour under each object.
Camera: One slow, continuous crane on a long lens that stays with the main object: high over it while it lies on the floor, sinking and pulling back as it stands, looking up at it as it rises, overtaking it to look down as it sinks, level again for the last hold.
Finish: True colours (neutral tone curve), real motion blur on the wobble, a touch of depth of field, soft bloom on the highlights and the flame, almost no grain.
Good for: Any explainer or story that can be told with a few simple inflated objects and characters. It is strongest where pressure, growth, floating, squeezing or too much and too little is the point, because how full each thing is carries the meaning. A beat is one change of air (something fills, lifts, vents, sags) that causes the next one; small balloon arrows show a push or a flow; each beat gets one short caption in small tube letters at the side of the frame.

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

REFERENCE STYLE SOURCE (styles/inflated.js; its sample topic was "How a hot-air balloon flies")
```js
{
  // ---------------------------------------------------------------- content (change this for a new topic)
  // Four beats that follow from each other. The picture tells them; each gets one short caption in small balloon
  // letters (STROKEFONT characters only: A-Z 0-9 . , ! ? - + : ' / & % # @ =).
  const BEATS = [
    { at: 0.0, until: 1.42, say: 'NO HEAT,\nNO LIFT' },                        // the envelope lies limp beside its basket
    { at: 1.6, until: 4.45, say: 'HEATED AIR\nEXPANDS' },                      // the burner fires: it swells and stands up
    { at: 4.75, until: 7.7, say: 'HOT AIR IS\nLIGHTER, SO\nIT RISES' },          // so it lifts off and rises
    { at: 7.95, until: 10.85, say: 'VENT OPEN:\nHOT AIR OUT,\nLESS LIFT' } ,   // the top vent lets hot air out: it sinks and lands
  ];
  const ROOM = '#2545f2';                                        // the one bold studio colour
  const STRIPES = ['#ff3d8f', '#ff6a1c', '#ffc414', '#ff3a2e'];  // the envelope's gores, in turn
  const CREAM = '#f7f3ea';                                       // crown cap, skirt, frame, clouds, captions
  const WICKER = ['#f2a43c', '#de842a'];                         // the basket's rings
  const WARM = '#ff5a1f';                                        // arrows: warm air pushing

  // ---------------------------------------------------------------- the story, told in air (picture and sound share this)
  const BURNS = [[1.5, 1.95], [2.03, 2.48], [2.6, 3.05], [4.05, 4.95], [6.0, 6.55]];   // [from, to] the burner roars
  const FILLS = [0.42, 0.34, 0.26];       // air the first three roars put in: 0 = limp, 1 = taut
  const PILOT = 0.2;                      // the small flame between roars
  const T_RISE = 2.3;                     // enough air to start standing up
  const T_LIFT = 4.7, T_TOP = 7.6;        // off the floor, top of the climb
  const T_VENT = 7.9, T_SHUT = 9.85;      // the vent in the crown opens and closes
  const T_SINK = 8.2, T_LAND = 10.45;     // down again
  const ALT = 7;                          // how high it goes
  const STAND = [0.55, 0.62];             // the spring that stands the balloon up: Hz, damping
  let T_THUMP = T_RISE; while (K.spring(T_THUMP - T_RISE, ...STAND) < 1) T_THUMP += 1 / 240;   // the basket slaps down flat

  const ring = (tau, hz, damp) => (tau <= 0 ? 0 : Math.exp(-damp * tau) * Math.sin(2 * Math.PI * hz * tau));   // a jolt that rings out
  const fire = (t) => Math.max(PILOT * K.smooth(BURNS[0][0] - 0.08, BURNS[0][0], t), ...BURNS.map(([a, b]) => K.smooth(a, a + 0.07, t) * (1 - K.smooth(b - 0.18, b, t))));
  const air = (t) => FILLS.reduce((a, f, i) => a + f * K.spring(t - BURNS[i][0] - 0.05, 2.4, 0.5), 0.02);     // each roar is a pump: it overshoots and snaps back
  const alt = (t) => ALT * K.smooth(T_LIFT, T_TOP, t) * (1 - K.smooth(0, 1, 0.93 * K.seg(t, T_SINK, T_LAND)) / K.smooth(0, 1, 0.93))   // it still has a little speed when it lands
    + 0.09 * Math.sin(2.4 * (t - T_TOP)) * K.smooth(T_TOP - 0.6, T_TOP, t) * (1 - K.smooth(T_SINK, T_SINK + 0.7, t));
  const vent = (t) => K.spring(t - T_VENT, 4, 0.4) * (1 - K.seg(t, T_SHUT, T_SHUT + 0.25, K.ease.inOut));
  // lean of the whole balloon: lying on its side (a quarter turn), standing up on a spring, swaying in flight, a rock on landing
  const tilt = (t) => Math.PI / 2 * (1 - K.spring(t - T_RISE, ...STAND))
    + 0.022 * Math.sin(1.9 * (t - T_LIFT)) * K.smooth(T_LIFT, T_LIFT + 1.2, t) * (1 - K.smooth(T_LAND - 1.4, T_LAND - 0.3, t))
    + 0.03 * ring(t - T_LAND, 1.5, 3);

  registerStyle({
    id: 'inflated',
    name: 'Inflated',
    family: 'Material worlds',
    look: 'Everything is a glossy inflatable in a bright one-colour studio: here a striped hot-air balloon, its basket, a flame, arrows, clouds and small tube letters. Each skin has welded seams and is limp, flat and creased when short of air, round and mirror-smooth when full.',
    motion: 'Air is the animation. Things fill in pumps that overshoot and snap taut, swell from the valve end outwards, stand up, wobble and settle. Full things float and sway, landings squash and rock, arrows and captions inflate in and deflate out. Every jolt rings out as a wobble.',
    light: 'Softboxes overhead and to the left and a thin strip on the right draw long white highlights on every skin. A soft key from the upper left shapes the forms and drops soft shadows; the floor and the flame bounce their colour onto the skins.',
    materials: 'Clear-coated vinyl in hot candy colours (pink, orange, yellow, red) with cream trim and a wicker-orange basket, on a cobalt sweep with just enough sheen to hold a blurred pool of colour under each object.',
    camera: 'One slow, continuous crane on a long lens that stays with the main object: high over it while it lies on the floor, sinking and pulling back as it stands, looking up at it as it rises, overtaking it to look down as it sinks, level again for the last hold.',
    post: 'True colours (neutral tone curve), real motion blur on the wobble, a touch of depth of field, soft bloom on the highlights and the flame, almost no grain.',
    explains: 'Any explainer or story that can be told with a few simple inflated objects and characters. It is strongest where pressure, growth, floating, squeezing or too much and too little is the point, because how full each thing is carries the meaning. A beat is one change of air (something fills, lifts, vents, sags) that causes the next one; small balloon arrows show a push or a flow; each beat gets one short caption in small tube letters at the side of the frame.',
    topic: 'How a hot-air balloon flies',
    duration: 12,
    fonts: [],
    render: { samples: 48, shutter: 0.5, tone: 'neutral', exposure: 1.0, bloom: 0.18, bloomThreshold: 1.0, vignette: 0.22, grain: 0.006, fov: 30, background: '#000000' },

    build(S) {
      const { THREE, K, scene, camera } = S;
      const TAU = Math.PI * 2;

      // ------------------------------------------------------------ studio: paper sweep, softboxes, key light
      // The softboxes live in the environment and are there to be reflected: bright enough to draw white highlights
      // on a glossy skin. The skins take only a little of their diffuse light (SOFTBOX_FILL), so colours stay deep;
      // the shaping light is the key, a sky/floor fill and a sky light for contact shadows.
      K.env(S, { top: '#2b3cb0', horizon: '#3f5bff', bottom: ROOM, intensity: 1.0, blur: 0.03, panels: [
        { pos: [0.5, 11, 2.5], size: [9, 3.4], color: '#ffffff', power: 30 },    // overhead softbox: the long highlight on top of every skin
        { pos: [-9, 6, 8], size: [4, 6], color: '#fff3e2', power: 22 },          // key softbox, upper left
        { pos: [11, 3.5, 0.5], size: [1.1, 9], color: '#eaf0ff', power: 30 },    // thin strip for a rim on the right
      ] });
      const SOFTBOX_FILL = 0.12;
      // the key and the sky light travel with the balloon, so it is lit the same on the floor and up among the clouds
      const KEY_FROM = new THREE.Vector3(-7, 12, 10).normalize();
      const key = K.sun(S, { color: '#fff6ea', power: 2.6, size: 7.5, soft: 1.9, far: 70 });
      const sky = K.skyLight(S, { power: 0.5, size: 10 });
      scene.add(new THREE.HemisphereLight('#f2f0ff', '#989fe6', 1.1));

      // the paper sweep: a floor with a soft sheen (so every object leaves a blurred pool of its colour under it)
      // that curves up into the back wall, so there is no horizon line
      const paper = { color: ROOM, roughness: 0.9, envMap: scene.environment, envMapIntensity: SOFTBOX_FILL };
      K.mirrorFloor(S, { color: ROOM, surfaceRoughness: 0.9, roughness: 0.5, strength: 0.3, material: paper });
      {
        const prof = [[-9, 0]];
        for (let i = 1; i <= 24; i++) { const a = i / 24 * Math.PI / 2; prof.push([-9 - Math.sin(a) * 7, 7 - Math.cos(a) * 7]); }
        prof.push([-16, 60]);
        const pos = [], idx = [];
        prof.forEach(([z, y], i) => { pos.push(-80, y, z, 80, y, z); if (i) idx.push(2 * i - 2, 2 * i - 1, 2 * i, 2 * i - 1, 2 * i + 1, 2 * i); });
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
        const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial(paper)); m.receiveShadow = true; m.position.y = 0.002; scene.add(m);
        // only the objects are mirrored in the floor: the wall lives on layer 1, which the mirror does not look at, and
        // the background behind it is black (render.background), so empty floor mirrors nothing
        m.layers.set(1); camera.layers.enable(1);
      }

      // ------------------------------------------------------------ vinyl: the one material everything is made of
      // Clear-coated plastic whose gloss comes from the softboxes only (a small light makes a hard dot on a skin this
      // glossy), with a little light scattered inside the balloon. o.paint is GLSL that may repaint diffuseColor and
      // add to totalEmissiveRadiance; o.vertex / o.fragment patch the shaders further; o.key names the variant.
      function vinyl(color, o = {}) {
        const m = new THREE.MeshPhysicalMaterial({ color, roughness: 0.24, metalness: 0, ior: 1.9, clearcoat: 1, clearcoatRoughness: 0.06, sheen: 0.15, sheenRoughness: 0.5,
          sheenColor: new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.5), side: o.side || THREE.FrontSide, vertexColors: !!o.vertexColors });
        m.onBeforeCompile = (sh) => {
          Object.assign(sh.uniforms, o.uniforms || {});
          if (o.vertex) sh.vertexShader = o.vertex(sh.vertexShader);
          sh.fragmentShader = (o.fragment ? o.fragment(sh.fragmentShader) : sh.fragmentShader)
            .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n' + (o.paint || '') + '\n totalEmissiveRadiance += diffuseColor.rgb * 0.18;')
            .replace('#include <lights_fragment_maps>', '#include <lights_fragment_maps>\n iblIrradiance *= ' + SOFTBOX_FILL.toFixed(3) + ';')
            .replace('reflectedLight.directSpecular + reflectedLight.indirectSpecular', 'reflectedLight.indirectSpecular')
            .replace('( clearcoatSpecularDirect + clearcoatSpecularIndirect )', 'clearcoatSpecularIndirect');
        };
        m.customProgramCacheKey = () => 'vinyl:' + (o.key || 'plain');
        return m;
      }
      const solid = (geo, mat, parent, shadow = true) => { const m = new THREE.Mesh(geo, mat); m.castShadow = shadow; m.receiveShadow = shadow; (parent || scene).add(m); return m; };
      // join indexed geometries into one (positions and normals only)
      const merge = (list) => {
        let n = 0, ni = 0; list.forEach((g) => { n += g.attributes.position.count; ni += g.index.count; });
        const pos = new Float32Array(n * 3), nrm = new Float32Array(n * 3), idx = new Uint32Array(ni); let o = 0, oi = 0;
        list.forEach((g) => { pos.set(g.attributes.position.array, o * 3); nrm.set(g.attributes.normal.array, o * 3); const ix = g.index.array; for (let i = 0; i < ix.length; i++) idx[oi + i] = ix[i] + o; o += g.attributes.position.count; oi += ix.length; });
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3)); g.setIndex(new THREE.BufferAttribute(idx, 1));
        return g;
      };
      // a smooth body of revolution through a few [radius, height] points (flames, arrows, pods)
      const turned = (pts, seg = 40) => new THREE.LatheGeometry(new THREE.SplineCurve(pts.map(([r, y]) => new THREE.Vector2(r, y))).getPoints(64).map((p) => new THREE.Vector2(Math.max(p.x, 0), p.y)), seg);

      // ------------------------------------------------------------ the envelope
      // Rest shape: a teardrop turned around the y axis, mouth at y = 0, crown at ENV_H, with GORES bulging panels and a
      // crease along every seam. The mesh stores that full, upright shape. The vertex shader lays it on the floor,
      // flattens it, fills it and stands it up (skin() below), and works the normals out from the deformed neighbours.
      const ENV_H = 3.2, ENV_R = 1.4, MOUTH_R = 0.38, EQ = 0.64 * ENV_H, GORES = 16, CAP_R = 0.46;
      function envelopeGeometry() {
        const NU = GORES * 12, NV = 150, fine = [];
        for (let i = 0; i <= 200; i++) { const y = EQ * i / 200; fine.push([MOUTH_R + (ENV_R - MOUTH_R) * Math.pow(Math.sin(Math.PI / 2 * y / EQ), 1.2), y]); }   // throat and cone
        for (let i = 1; i <= 200; i++) { const a = Math.PI / 2 * i / 200; fine.push([ENV_R * Math.cos(a), EQ + (ENV_H - EQ) * Math.sin(a)]); }                      // dome
        const len = [0]; for (let i = 1; i < fine.length; i++) len.push(len[i - 1] + Math.hypot(fine[i][0] - fine[i - 1][0], fine[i][1] - fine[i - 1][1]));
        const profile = (v) => {     // [radius, height] at fraction v of the way along the skin from mouth to crown
          const s = K.clamp(v) * len[len.length - 1]; let i = 1; while (i < len.length - 1 && len[i] < s) i++;
          const u = (s - len[i - 1]) / (len[i] - len[i - 1]); return [K.lerp(fine[i - 1][0], fine[i][0], u), K.lerp(fine[i - 1][1], fine[i][1], u)];
        };
        const point = (a, v) => {
          const [r, y] = profile(v), u = (a / TAU * GORES) % 1, bulge = Math.pow(Math.max(0, 4 * u * (1 - u)), 0.7);
          const rr = r * (1 - 0.06 * Math.pow(Math.sin(Math.PI * K.clamp(v)), 0.6) * (1 - bulge));      // seams are valleys, panels bulge
          return new THREE.Vector3(rr * Math.cos(a), y, rr * Math.sin(a));
        };
        const pos = [], nrm = [], gore = [], idx = [], dv = new THREE.Vector3(), da = new THREE.Vector3();
        for (let j = 0; j <= NV; j++) for (let i = 0; i <= NU; i++) {
          const a = i / NU * TAU + Math.PI, v = j / NV, p = point(a, v);     // the mesh closes at the back (a = PI)
          dv.subVectors(point(a, Math.min(1, v + 0.4 / NV)), point(a, Math.max(0, v - 0.4 / NV))); da.subVectors(point(a + 0.5 * TAU / NU, v), point(a - 0.5 * TAU / NU, v));
          const n = j === NV ? new THREE.Vector3(0, 1, 0) : dv.clone().cross(da).normalize();
          pos.push(p.x, p.y, p.z); nrm.push(n.x, n.y, n.z); gore.push(i / NU, v);
          if (i < NU && j < NV) { const q = j * (NU + 1) + i; idx.push(q, q + NU + 1, q + 1, q + 1, q + NU + 1, q + NU + 2); }
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3)); g.setAttribute('aGore', new THREE.Float32BufferAttribute(gore, 2));
        g.setIndex(idx);
        return g;
      }
      const C = (x) => x.toFixed(4);
      const ENV_VERT = /* glsl */`
        attribute vec2 aGore;                  // x: 0..1 around the balloon, y: 0..1 along the skin from mouth to crown
        uniform vec3 uPivot;                   // where the middle of the mouth is in the world
        uniform vec4 uPose;                    // x: lean of the axis at the mouth (0 = straight up, PI/2 = lying towards -x), y: bend per unit
                                               // of length, z: stretch along the axis, w: stretch across it
        uniform vec4 uAir;                     // x: air 0..1, y: overall girth, z: vent 0..1 (the crown cap is pulled in), w: slack 0..1
        varying vec3 vRest; varying float vLimp;
        float softplus(float x) { return x > 15.0 ? x : log(1.0 + exp(x)); }
        // how full the skin is at height s: the air comes in at the mouth, so the swelling travels from there to the crown
        float fullAt(float s) {
          float f = smoothstep(0.0, 1.0, uAir.x * 1.8 - 0.8 * s / ${C(ENV_H)});
          return max(f, 0.75 * (1.0 - smoothstep(0.0, 0.7, s)));                           // the load ring holds the mouth open
        }
        vec3 skin(vec3 p) {
          float rr = length(p.xz), f = fullAt(p.y), limp = 1.0 - f, flat_ = mix(0.13, 1.0, f);
          float s = p.y - uAir.z * 0.3 * (1.0 - smoothstep(${C(0.72 * CAP_R)}, ${C(CAP_R)}, rr)) * step(${C(0.8 * ENV_H)}, p.y);   // vent: the cap sinks into the crown
          s *= uPose.z;
          // cross-section: a limp skin is a flat, slightly wider sheet with soft buckles; a full one is round
          vec2 q = p.xz * uAir.y * uPose.w;
          float lx = q.x * flat_ + limp * rr * 0.022 * (sin(p.z * 3.1 + p.y * 2.3) + 0.6 * sin(p.y * 5.3 - p.z * 4.1));
          float lz = q.y * mix(1.18, 1.0, f) * (1.0 + limp * (0.05 * sin(p.y * 5.0) + 0.03 * sin(p.y * 11.0 + 1.0)));
          // the axis is an arc that leaves the mouth at angle uPose.x and bends by uPose.y per unit of length
          float a0 = uPose.x, k = uPose.y, a = a0 + k * s;
          vec2 c = abs(k) < 1e-4 ? s * vec2(-sin(a0), cos(a0)) : vec2(cos(a) - cos(a0), sin(a) - sin(a0)) / k;
          vec2 u = vec2(cos(a), sin(a));                                                   // "across", at right angles to the axis
          // the floor: a limp skin cannot hold itself up and lies on it; a full one rests its belly on it
          float rest = abs(u.y) * rr * uAir.y * flat_ + 0.02 + 0.07 * limp;
          float cy = mix(uPivot.y + c.y, rest, limp * smoothstep(0.0, 0.8, s));
          cy = rest + 0.05 * (softplus((cy - rest) / 0.05) - 0.69 * limp);
          return vec3(uPivot.x + c.x + u.x * lx, cy + u.y * lx, uPivot.z + lz);
        }`;
      const ENV_FRAG = /* glsl */`
        uniform vec4 uAir; uniform vec3 uPal[4]; uniform vec3 uCream; uniform float uHeat;
        varying vec3 vRest; varying float vLimp;
        float gHole = 0.0;                     // 1 where we look into the open vent
        float h3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
        float vnoise(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(mix(h3(i), h3(i + vec3(1, 0, 0)), f.x), mix(h3(i + vec3(0, 1, 0)), h3(i + vec3(1, 1, 0)), f.x), f.y),
                     mix(mix(h3(i + vec3(0, 0, 1)), h3(i + vec3(1, 0, 1)), f.x), mix(h3(i + vec3(0, 1, 1)), h3(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
        // wrinkles: long folds that run along the balloon, deep while the skin is limp, faint near the mouth when it is slack
        float skinHeight() {
          vec3 p = vRest * vec3(4.0, 1.0, 4.0);
          float soft = vnoise(p * 1.3) - 0.5;                                               // dents
          float fold = 1.0 - smoothstep(0.0, 0.16, abs(vnoise(p + 3.7) - 0.5)) + 0.5 * (1.0 - smoothstep(0.0, 0.14, abs(vnoise(p * 1.9 + 9.1) - 0.5)));   // creases
          return vLimp * (0.07 * soft - 0.02 * fold) + 0.014 * uAir.w * (1.0 - smoothstep(0.0, 1.6, vRest.y)) * soft;
        }`;
      const ENV_PAINT = /* glsl */`
        { float rr = length(vRest.xz), top = step(${C(0.8 * ENV_H)}, vRest.y), gi = vGore.x * ${C(GORES)}, gu = fract(gi);
          vec3 col = uPal[int(mod(floor(gi), 4.0))];                                                               // one colour per gore
          float trim = max(top * (1.0 - smoothstep(${C(CAP_R - 0.012)}, ${C(CAP_R + 0.012)}, rr)), 1.0 - smoothstep(0.17, 0.19, vRest.y));
          col = mix(col, uCream, trim);                                                                            // crown cap and skirt
          col = mix(col, vec3(1.0), 0.42 * exp(-pow(min(gu, 1.0 - gu) / 0.035, 2.0)) * (1.0 - 0.6 * trim));        // the welds are paler
          gHole = uAir.z * top * (1.0 - smoothstep(${C(0.9 * CAP_R)}, ${C(0.99 * CAP_R)}, rr));
          float inside = step(faceDirection, 0.0), nearMouth = exp(-vRest.y * 1.6);
          diffuseColor.rgb = col * (1.0 - 0.55 * inside);
          // the burner lights the inside, and the skin near the mouth glows like a lantern while it roars
          totalEmissiveRadiance += uHeat * mix(col * vec3(1.0, 0.8, 0.55) * 0.3 * nearMouth, vec3(1.7, 0.6, 0.14) * (0.2 + nearMouth), inside); }`;
      const envU = { uPivot: { value: new THREE.Vector3() }, uPose: { value: new THREE.Vector4(0, 0, 1, 1) }, uAir: { value: new THREE.Vector4(1, 1, 0, 0) }, uHeat: { value: 0 },
        uPal: { value: STRIPES.map((c) => new THREE.Color(c)) }, uCream: { value: new THREE.Color(CREAM) } };
      const envelope = solid(envelopeGeometry(), vinyl('#ffffff', { key: 'envelope', uniforms: envU, side: THREE.DoubleSide, paint: ENV_PAINT,
        vertex: (v) => v.replace('#include <common>', '#include <common>\n' + ENV_VERT + '\nvarying vec2 vGore;')
          // normal: push two neighbours on the rest shape through the same deformation and take the cross product
          .replace('#include <beginnormal_vertex>', `vec3 eP = skin(position);
            vec3 eT = normalize(cross(normal, abs(normal.y) > 0.9 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0))), eB = cross(normal, eT);
            vec3 objectNormal = normalize(cross(skin(position + 0.012 * eT) - eP, skin(position + 0.012 * eB) - eP));
            vRest = position; vGore = aGore; vLimp = 1.0 - fullAt(position.y);`)
          .replace('#include <begin_vertex>', 'vec3 transformed = eP;'),
        fragment: (f) => f.replace('#include <common>', '#include <common>\n' + ENV_FRAG + '\nvarying vec2 vGore;')
          // bump from the procedural wrinkle height (true-scale version of three's bump mapping), for base and clear coat
          .replace('#include <normal_fragment_begin>', `#include <normal_fragment_begin>
            { float bh = skinHeight(); vec2 dH = vec2(dFdx(bh), dFdy(bh)) * smoothstep(0.12, 0.55, abs(dot(normal, normalize(vViewPosition))));   // fade at grazing angles, where bump turns to noise
              vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition);
              vec3 r1 = cross(sy, normal), r2 = cross(normal, sx); float det = dot(sx, r1);
              vec3 tilt = sign(det) * (dH.x * r1 + dH.y * r2) / max(abs(det), 1e-9); tilt *= min(1.0, 0.5 / max(length(tilt), 1e-5));   // never fold the normal right over
              normal = normalize(normal - tilt); nonPerturbedNormal = normal; }`)
          .replace('#include <opaque_fragment>', 'outgoingLight = mix(outgoingLight, vec3(0.2, 0.035, 0.03) * (1.0 + 2.0 * uHeat), min(1.0, gHole));   // the open vent is a dark hole, not a glossy dish\n#include <opaque_fragment>') }));
      envelope.frustumCulled = false;     // the mesh itself stays at the origin: the shader puts the skin in the world
      {
        const d = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, side: THREE.DoubleSide });     // so its shadow follows the deformation too
        d.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, envU); sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\n' + ENV_VERT).replace('#include <begin_vertex>', 'vec3 transformed = skin(position);'); };
        envelope.customDepthMaterial = d;
      }
      // the same axis arc on the CPU, for things that ride on the envelope: [x, y, angle] at distance s from the mouth
      const pose = { x: 0, y: 0, a0: 0, k: 0 };
      const axisAt = (s) => { const a = pose.a0 + pose.k * s; return Math.abs(pose.k) < 1e-4 ? [pose.x - s * Math.sin(pose.a0), pose.y + s * Math.cos(pose.a0), a] : [pose.x + (Math.cos(a) - Math.cos(pose.a0)) / pose.k, pose.y + (Math.sin(a) - Math.sin(pose.a0)) / pose.k, a]; };

      // ------------------------------------------------------------ basket, frame, burner and flame: one rigid rig
      // The basket is a stack of inflated rings. `rig` turns about whichever bottom edge is on the floor, so the basket
      // can lie on its side, be pulled upright and rock; `car` holds the parts with the basket's floor at y = 0.
      const BASKET_W = 0.95, TUBE = 0.11, BASKET_H = 2 * TUBE + 3 * 0.19, MOUTH_Y = BASKET_H + 0.55;
      const rig = new THREE.Group(), car = new THREE.Group(); scene.add(rig); rig.add(car);
      const squircle = (half, y, n = 96) => Array.from({ length: n }, (_, i) => { const a = (i + 0.5) / n * TAU, c = Math.cos(a), s = Math.sin(a); return [half * Math.sign(c) * Math.abs(c) ** 0.4, y, half * Math.sign(s) * Math.abs(s) ** 0.4]; });
      const wicker = WICKER.map((c) => vinyl(c)), cream = vinyl(CREAM);
      for (let i = 0; i < 4; i++) solid(K.tube(squircle(BASKET_W / 2 - TUBE, TUBE + i * 0.19), TUBE * (i === 3 ? 1.08 : 1), { closed: true, segments: 160, radial: 16 }), i === 3 ? cream : wicker[i % 2], car);
      solid(K.roundedBox(BASKET_W - 0.16, 0.1, BASKET_W - 0.16, 0.05), wicker[1], car).position.y = 0.07;
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) solid(K.tube([[sx * 0.33, BASKET_H - 0.06, sz * 0.33], [sx * 0.3, (BASKET_H + MOUTH_Y) / 2, sz * 0.3], [sx * 0.27, MOUTH_Y, sz * 0.27]], 0.038, { segments: 10, radial: 12 }), cream, car);   // uprights
      solid(new THREE.TorusGeometry(MOUTH_R, 0.055, 14, 56).rotateX(Math.PI / 2), cream, car).position.y = MOUTH_Y;                                                // load ring: the envelope's mouth sits in it
      for (const s of [-1, 1]) solid(K.tube([[-0.33, BASKET_H, -0.33 * s], [0, BASKET_H - 0.02, 0], [0.33, BASKET_H, 0.33 * s]], 0.032, { segments: 10, radial: 10 }), cream, car);   // burner bars
      solid(turned([[0, -0.13], [0.1, -0.11], [0.13, -0.02], [0.12, 0.06], [0.07, 0.1], [0, 0.1]]), vinyl('#c9ccd6'), car).position.y = BASKET_H - 0.02;           // burner pod
      // the flame: an inflated teardrop, yellow at the root and red at the tip, that also lights what is near it
      const flame = new THREE.Group(); flame.position.y = BASKET_H + 0.06; car.add(flame);
      {
        const g = turned([[0, 0], [0.17, 0.03], [0.27, 0.16], [0.26, 0.32], [0.18, 0.55], [0.09, 0.78], [0.03, 0.94], [0, 1]]), p = g.attributes.position, col = [];
        const stops = ['#ffe34a', '#ff8a1c', '#ff3a2e'].map((c) => new THREE.Color(c)), c = new THREE.Color();
        for (let i = 0; i < p.count; i++) { const y = p.getY(i) * 2; c.copy(stops[Math.min(1, Math.floor(y))]).lerp(stops[Math.min(2, Math.floor(y) + 1)], y % 1); col.push(c.r, c.g, c.b); }
        g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
        solid(g, vinyl('#ffffff', { key: 'flame', vertexColors: true, paint: 'totalEmissiveRadiance += diffuseColor.rgb * 0.9;' }), flame, false);
      }
      const flameLight = new THREE.PointLight('#ff8a2a', 0, 6, 2); flameLight.position.y = 0.35; flame.add(flameLight);

      // ------------------------------------------------------------ arrows: small foil balloons that show a push
      const arrowGeo = turned([[0, -0.5], [0.1, -0.49], [0.155, -0.42], [0.155, -0.08], [0.17, 0.0], [0.31, 0.05], [0.35, 0.12], [0.3, 0.2], [0.13, 0.41], [0.035, 0.49], [0, 0.5]]).scale(1, 1, 0.6);
      const warm = vinyl(WARM);
      const arrows = Array.from({ length: 7 }, () => solid(arrowGeo, warm));
      // lift arrows ride beside the envelope: [x from the axis, height above the mouth], two each side
      const LIFT = [[-1.3, 0.5], [-1.85, 1.35], [1.3, 0.5], [1.85, 1.35]];

      // ------------------------------------------------------------ clouds: clusters of white balls, hung at different heights
      // [x, y, z, size]: kept to the left of and behind the balloon, clear of the captions on the right
      const CLOUDS = [[-3.4, 4.4, -2.4, 1.0], [0.9, 6.3, -5.0, 1.5], [-2.9, 7.6, 1.2, 0.62], [-4.4, 9.6, -4.0, 1.35], [1.6, 11.6, -3.2, 1.0], [-2.6, 12.6, -1.5, 0.8]];
      const clouds = CLOUDS.map(([x, y, z, s], n) => {
        const g = new THREE.Group(), ball = new THREE.SphereGeometry(1, 40, 28), white = vinyl('#ffffff');
        [[0, 0, 0, 0.5], [-0.55, -0.08, 0.05, 0.36], [0.52, -0.1, 0, 0.4], [0.2, 0.22, -0.1, 0.36], [-0.25, 0.18, 0.12, 0.32], [0.95, -0.2, 0.04, 0.24], [-0.95, -0.2, 0, 0.22]].forEach(([bx, by, bz, r]) => { const b = solid(ball, white, g, false); b.position.set(bx, by, bz); b.scale.setScalar(r); });
        g.position.set(x, y, z); g.scale.set(s * (n % 2 ? -1 : 1), s * 0.9, s); scene.add(g);
        return g;
      });

      // ------------------------------------------------------------ captions: small balloon letters, one mesh per line
      // Tubes along the single-stroke font with round ends. The shader moves every vertex along its normal (uPuff), which
      // changes the tube's radius exactly, so a line can blow up from a thin thread. Sizes here are in cap heights.
      const LETTER = 0.118;
      function balloonLines(text) {
        const lay = STROKEFONT.layout(text, { size: 1, align: 'left', spacing: 0.24, lineGap: 0.7, step: 0.07, round: 0.14 }), rows = new Map();
        lay.strokes.forEach((st) => { const y = lay.glyphs[st.glyph].y; if (!rows.has(y)) rows.set(y, []); rows.get(y).push(st); });
        return [...rows.keys()].sort((a, b) => b - a).map((y) => {
          const parts = [], ball = (p, r) => parts.push(new THREE.SphereGeometry(r, 14, 10).translate(p[0], p[1], 0));
          rows.get(y).forEach((st) => {
            if (st.closed && STROKEFONT.length(st) < 0.5) { ball(st.points.reduce((a, p) => [a[0] + p[0] / st.points.length, a[1] + p[1] / st.points.length], [0, 0]), LETTER * 1.15); return; }   // a dot
            parts.push(K.tube(st.points, LETTER, { closed: st.closed, segments: st.points.length * 2, radial: 12 }));
            if (!st.closed) { ball(st.points[0], LETTER); ball(st.points[st.points.length - 1], LETTER); }
          });
          const u = { uPuff: { value: 0 } };
          const m = solid(merge(parts), vinyl(CREAM, { key: 'letters', uniforms: u, vertex: (v) => v.replace('#include <common>', '#include <common>\nuniform float uPuff;').replace('#include <begin_vertex>', 'vec3 transformed = position + normal * uPuff;') }), null, false);
          m.frustumCulled = false; m.userData.u = u;
          return m;
        });
      }
      const captions = BEATS.map((b) => ({ ...b, lines: balloonLines(b.say) }));
      // where the caption block sits in the picture: left edge and middle height as fractions of the frame from its
      // centre, cap height as a fraction of the frame height, and how far in front of the subject it floats
      const CAP = { x: 0.13, y: 0.06, size: 0.053, near: 0.8 };

      // ------------------------------------------------------------ camera: one crane move that stays with the balloon
      const cam = {
        aimX: K.path([[0, -1.12], [1.8, -1.05], [3.9, 0.97], [10.6, 0.95], [12, 0.2]]),    // the balloon ends up left of centre, captions to its right
        aimY: K.path([[0, 0.1], [1.8, 0.4], [2.95, 2.5], [3.9, 2.3], [7.8, 2.3], [8.8, 2.55], [10.2, 2.3], [12, 2.3]]),        // height of the aim above the basket floor
        dist: K.path([[0, 9.2], [1.8, 9.2], [2.95, 10.7], [4.0, 10.4], [7.7, 10.9], [8.8, 11.2], [10.4, 10.4], [12, 9.7]]),
        high: K.path([[0, 5.6], [2.0, 4.6], [3.9, 0.8], [5.0, -0.5], [6.4, -2.1], [7.7, -0.2], [8.9, 4.4], [10.0, 2.8], [12, 0.6]]),   // camera above (+) or below (-) its aim
        side: K.path([[0, -1.0], [12, 1.0]]),                                                 // slow drift to the right
      };
      const vX = new THREE.Vector3(), vY = new THREE.Vector3(), vZ = new THREE.Vector3(), focusAt = new THREE.Vector3();
      const nz = K.noise(3);

      return {
        update(t) {
          const A = air(t), heat = fire(t), y0 = alt(t), phi = tilt(t), open = vent(t);
          const pump = BURNS.slice(0, 3).reduce((a, [tb]) => a + ring(t - tb - 0.05, 3.1, 5), 0);                 // every pump makes the skin ring
          const bump = ring(t - T_THUMP, 3.2, 6) + 0.8 * ring(t - T_LAND, 3, 6);                                  // the basket hitting the floor
          const tug = ring(t - T_LIFT, 1.5, 2.6);                                                                 // the envelope taking the basket's weight

          // ---- the rig: basket, frame, burner
          const edge = y0 > 0.002 ? 0 : (phi >= 0 ? -1 : 1) * BASKET_W / 2, sq = 1 - 0.07 * bump;
          rig.position.set(edge, y0, 0); rig.rotation.z = phi; car.position.x = -edge; car.scale.set(1 + 0.04 * bump, sq, 1 + 0.04 * bump);
          const mouthY = MOUTH_Y * sq;
          pose.x = edge - edge * Math.cos(phi) - mouthY * Math.sin(phi); pose.y = y0 - edge * Math.sin(phi) + mouthY * Math.cos(phi);

          // ---- the envelope: the crown follows the lean a moment late, so it droops while rising and overshoots when it settles
          const slack = K.seg(t, T_VENT, T_VENT + 0.7, K.ease.inOut) * (1 - 0.5 * K.seg(t, T_LAND, T_LAND + 0.8, K.ease.inOut));
          pose.a0 = phi; pose.k = 0.8 * (tilt(t - 0.16) - phi) / ENV_H;
          const along = 1 + 0.05 * pump + 0.03 * tug - 0.04 * bump, girth = (1 + 0.05 * ring(t - BURNS[2][0] - 0.1, 3.1, 5) - 0.025 * pump + 0.012 * heat * (t >= BURNS[3][0] ? 1 : 0) - 0.035 * slack) * (1 - 0.015 * tug + 0.03 * bump);
          envU.uPivot.value.set(pose.x, pose.y, 0); envU.uPose.value.set(phi, pose.k, along, 1);
          envU.uAir.value.set(A, girth, open, slack); envU.uHeat.value = heat;
          pose.len = ENV_H * along;

          // ---- the flame: flickers, leans, and lights the mouth
          const fl = 0.75 + 0.25 * nz.n2(t * 9, 1.3), lean = 0.12 * nz.n2(t * 6, 7.7);
          flame.visible = heat > 0.01; flame.scale.set(0.55 + 0.45 * heat, (0.12 + 0.88 * heat) * (0.9 + 0.25 * fl), 0.55 + 0.45 * heat); flame.rotation.z = lean;
          flameLight.intensity = 5 * heat * fl;

          // ---- arrows. Lift arrows flow upwards beside the envelope while it climbs: each one inflates low, rises and
          // deflates, over and over. Vent arrows leave the crown while the vent is open.
          arrows.forEach((m, j) => {
            const lift = j < 4, T0 = lift ? T_LIFT + 0.25 : T_VENT + 0.05, T1 = lift ? T_VENT - 0.1 : T_SHUT, period = lift ? 1.0 : 0.72;
            const turn = (t - T0) / period + (lift ? [0, 0.5, 0.25, 0.75][j] : (j - 4) / 3), u = turn % 1, born = t - u * period;     // this arrow's current run started at `born`
            const on = turn >= 0 && born >= T0 - 1e-6 && born + period <= T1 + 1e-6 ? K.spring(u * period, 5, 0.45) * (1 - K.seg(u, 0.76, 1, K.ease.in)) : 0;
            m.visible = on > 0.1; if (!m.visible) return;
            if (lift) {
              const [ax, ay] = LIFT[j], [x, y, a] = axisAt(ay + (u - 0.5) * 0.8);
              m.position.set(x + ax * Math.cos(a), y + ax * Math.sin(a), 0.25); m.rotation.set(0, 0, a); m.scale.setScalar(1.0 * on);
            } else {
              const fan = (j - 5) * 0.55, [x, y, a] = axisAt(pose.len - 0.25), d = 0.3 + 0.8 * u, dir = a + fan;
              m.position.set(x - d * Math.sin(dir), y + d * Math.cos(dir), 0.05 * (j - 5)); m.rotation.set(0, 0, dir); m.scale.setScalar(0.62 * on);
            }
          });

          // ---- clouds bob a little; the lights travel with the balloon
          clouds.forEach((c, n) => { c.position.y = CLOUDS[n][1] + 0.07 * Math.sin(t * 0.9 + n * 2.1); });
          focusAt.set(0, y0 + 2.3, 0);
          key.target.position.copy(focusAt); key.position.copy(focusAt).addScaledVector(KEY_FROM, 24); sky.target.position.copy(focusAt);

          // ---- camera
          const ax = cam.aimX(t), ay = alt(t - 0.1) + cam.aimY(t), d = cam.dist(t), high = cam.high(t), side = cam.side(t);
          K.look(camera, [ax + side, ay + high, Math.sqrt(d * d - high * high - side * side)], [ax, ay, 0]);
          K.focus(camera, [0, y0 + 2.3, 0.7], 0.012);

          // ---- captions float at a fixed place in the picture, a little in front of the balloon, facing the camera
          camera.updateMatrixWorld();
          vX.setFromMatrixColumn(camera.matrixWorld, 0); vY.setFromMatrixColumn(camera.matrixWorld, 1); vZ.setFromMatrixColumn(camera.matrixWorld, 2);
          const dc = CAP.near * d, frameH = 2 * Math.tan(camera.fov * Math.PI / 360) * dc, unit = CAP.size * frameH;
          captions.forEach((c) => {
            const out = K.seg(t, c.until, c.until + 0.22, K.ease.in);
            c.lines.forEach((m, i) => {
              const blown = c.at <= 0 ? 1 : K.spring(t - c.at - 0.09 * i, 3.4, 0.42), fat = (0.16 + 0.84 * blown) * (1 - 0.8 * out);     // thread -> full, with an overshoot
              m.visible = (c.at <= 0 || t >= c.at + 0.09 * i) && out < 1; if (!m.visible) return;
              const row = 0.05 * Math.sin(t * 1.3 + i * 1.9) - 0.5 * out;                 // a little bob; it drops as it deflates
              m.position.copy(camera.position).addScaledVector(vZ, -dc).addScaledVector(vX, CAP.x * frameH * 16 / 9 + 0.03 * unit * Math.sin(t * 1.1 + i)).addScaledVector(vY, CAP.y * frameH + row * unit);
              m.quaternion.copy(camera.quaternion); m.rotateY(-0.1); m.scale.setScalar(unit);
              m.userData.u.uPuff.value = LETTER * (fat - 1);
            });
          });
        },
      };
    },

    sound(k) {
      const D = 12, rnd = globalThis.K.rng(5);
      k.bed('room', 0, D, { gain: 0.7 });
      // the limp skin settles with a rustle and a small sigh
      k.play('paper', 0.3, { gain: 0.45, pan: -0.35 });
      k.tone(0.45, { f: [[0, 290], [0.5, 170]], dur: 0.6, gain: 0.07, a: 0.1, hold: 0.2, verb: 0.2, pan: -0.3 });
      // captions inflate with a small rubbery blip
      BEATS.forEach((b, i) => { if (b.at > 0) k.tone(b.at, { f: [[0, 520 + 60 * i], [0.09, 760 + 80 * i]], dur: 0.13, gain: 0.1, pan: 0.5, minor: true }); });
      // the burner: a roar of gas (low rumble plus hiss); the first three are pumps, and the skin answers with a
      // rubbery note that climbs as the envelope fills
      BURNS.forEach(([a, b], i) => {
        const dur = b - a;
        k.noise(a, { dur: dur + 0.08, color: 'brown', filter: 'lowpass', f: [[0, 260], [0.12, 620], [dur, 380]], q: 0.8, gain: 0.5, a: 0.08, hold: 0.55, pan: -0.1 });
        k.noise(a, { dur, color: 'pink', filter: 'bandpass', f: [[0, 900], [0.1, 2100], [dur, 1500]], q: 0.9, gain: 0.17, a: 0.06, hold: 0.55, pan: -0.1 });
        k.play('click', a - 0.02, { gain: 0.35 });
        if (i < 3) k.tone(a + 0.06, { f: [[0, 120 + 44 * i], [0.24, 190 + 70 * i]], dur: 0.36, gain: 0.28, verb: 0.1 });
      });
      k.play('pop', BURNS[2][0] + 0.2, { f: 460, gain: 0.8 });                                     // taut
      // standing up: the skin drags and creaks, then the basket slaps down flat and rocks
      k.play('swish', T_RISE + 0.25, { gain: 0.6, pan: -0.3 });
      for (let n = 0; n < 6; n++) { const t = T_RISE + 0.12 + n * 0.11 + rnd.range(0, 0.03); k.tone(t, { f: [[0, 190 + 22 * n], [0.06, 235 + 24 * n]], type: 'sawtooth', dur: 0.075, gain: 0.2, filter: 'bandpass', f2: 850 + 50 * n, q: 5, pan: rnd.range(-0.5, 0.1), minor: true }); }
      k.play('thud', T_THUMP, { gain: 0.95, f: 95 });
      k.play('tock', T_THUMP + 0.42, { gain: 0.3 });
      // lift-off and the climb: a soft whoosh and a far slide whistle going up; little pops as the arrows inflate
      k.play('whoosh', T_LIFT - 0.05, { gain: 0.5 });
      k.tone(T_LIFT + 0.1, { f: [[0, 250], [T_TOP - T_LIFT - 0.3, 560]], dur: T_TOP - T_LIFT - 0.2, gain: 0.05, a: 0.4, hold: 0.5, verb: 0.3 });
      k.withMinor(() => { for (let n = 0; n < 5; n++) k.play('pop', T_LIFT + 0.25 + n * 0.5, { f: 620 + 70 * (n % 3), gain: 0.22, pan: n % 2 ? 0.35 : -0.35 }); });
      // the vent: a pop, a long hiss of escaping air, and the whistle sliding back down with the balloon
      k.play('pop', T_VENT, { f: 900, gain: 1.0 });
      k.noise(T_VENT + 0.02, { dur: T_SHUT - T_VENT, filter: 'highpass', f: [[0, 3000], [T_SHUT - T_VENT, 1500]], gain: 0.17, a: 0.05, hold: 0.6 });
      k.tone(T_SINK, { f: [[0, 540], [T_LAND - T_SINK - 0.1, 210]], dur: T_LAND - T_SINK, gain: 0.05, a: 0.3, hold: 0.6, verb: 0.3 });
      k.play('tick', T_SHUT + 0.1, { gain: 0.5 });
      // landing: a soft bump, a squeak of vinyl on the floor, and a small "there" to close
      k.play('thud', T_LAND, { gain: 0.7, f: 80 });
      k.tone(T_LAND + 0.05, { f: [[0, 560], [0.12, 880]], type: 'triangle', dur: 0.16, gain: 0.16, filter: 'bandpass', f2: 1400, q: 4 });
      k.play('ding', T_LAND + 0.55, { gain: 0.3 });
    },
  });
}
```
