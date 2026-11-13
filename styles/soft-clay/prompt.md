I want a short 3D motion graphic made with three.js in the "Soft Clay" style. Below is the complete source of a reference animation in this exact style, plus the small rendering kit and sound kit it runs on. Use them as your style guide and rebuild the animation around my content.

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
- Load these Google Fonts before building (the kit awaits the specs in style.fonts): Fredoka

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
Name: Soft Clay
Family: Material worlds
Use: explainer
Look: Everything is modelled in plasticine and filmed like stop-motion on a small tabletop: chunky, slightly lopsided forms with fingerprints, tool marks and pits in them, in a few colours from one box of clay, in front of a seamless paper backdrop.
Motion: Animated on twos (15 poses a second) with no motion blur, by swapping shapes like a stop-motion animator: a ball of clay buds, hops over on an arc, lands as a thick puck, is pressed too flat and springs back into a coin. Stacks flinch when something lands on them, words are slapped onto the backdrop, and anything just touched shifts by a hair between poses. Only the camera moves smoothly.
Light: One big soft lamp from the upper left that pools on the backdrop and falls off to the corners, plus soft light from the whole sky that is blocked in every crease and under every object, so contact shadows are real.
Materials: Matte, waxy plasticine with a velvety sheen: a generated surface of fingerprints, knife drags, pits and joins bends the light, pressed spots are a little shinier, and each colour has a second colour streaked through it. The backdrop is uncoated coloured card.
Camera: A macro lens with shallow focus on a slow dolly: it starts close enough to read the fingerprints, travels along with the action, then pulls back in the same move until the whole set fits, and ends on a slight push-in.
Finish: True colours (neutral tone curve), almost no bloom, a light vignette and a little grain; a faint flicker in the lamp from pose to pose, like single frames shot one at a time.
Good for: Anything that can be told with a few friendly objects on a table: amounts as piles and stacks, growth and comparison, simple characters and props, a number or a few words as fat clay letters. Good for warm, non-technical topics.

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

REFERENCE STYLE SOURCE (styles/soft-clay.js; its sample topic was "How compound interest grows your savings")
```js
{
  // ---------------------------------------------------------------- content (change this for a new topic)
  const START = 1000;                          // dollars put in once, never added to
  const RATE = 0.07;                           // interest per year, paid on everything in the pile
  const YEARS = [0, 5, 10, 15, 20, 25, 30];    // one stack of coins per entry
  const COIN = 250;                            // dollars per clay coin
  const balance = (y) => START * Math.pow(1 + RATE, y);
  const money = (v) => '$' + Math.round(v).toLocaleString('en-US');
  const LAST = YEARS[YEARS.length - 1];
  const SIGN = [money(START), Math.round(RATE * 100) + '% a year'];   // the little sign next to the first stack
  const CAPTION = ['after', String(LAST), 'years'];                   // small words pressed onto the backdrop
  const RESULT = money(balance(LAST));                                // the big number: "$7,612"

  // the box of clay: a handful of sticks, each with a neighbour it got slightly mixed with
  const BOX = {
    card: '#12808a',                                   // the paper backdrop
    cream: ['#f3e6cd', '#eec78c'], coral: ['#de3a26', '#f2814f'], yellow: ['#f4ad08', '#ee7f14'], navy: ['#253677', '#4467b8'],
  };
  const FONT = '700 200px "Fredoka"';

  // ---------------------------------------------------------------- stop-motion time
  // The clay is animated "on twos": 15 poses a second, each held for two frames. Everything made of clay reads the
  // pose clock; only the camera and the lens read real time, so the shot glides while the puppets tick.
  const POSES = 15;
  const pose = (t) => Math.floor(t * POSES + 1e-3) / POSES;
  const snap = (t) => Math.round(t * POSES) / POSES;                 // put an event exactly on a pose
  const since = (tq, t0) => Math.round((tq - t0) * POSES);            // whole poses since an event (negative = before)
  const nudge = (id, tq, amt) => (K.hash(id, Math.round(tq * POSES)) - 0.5) * 2 * amt;   // re-placement jitter: new on every pose

  // one schedule for picture and sound: when every ball of clay lands and when every word is pressed on
  function schedule() {
    const counts = YEARS.map((y) => Math.round(balance(y) / COIN)), own = Math.round(START / COIN), coins = [];
    let t = 0.4;
    counts.forEach((n, s) => {
      const dur = s ? 0.34 + 0.022 * n : 0;                           // taller stacks take a little longer, but not in proportion: growth speeds up
      for (let j = 0; j < n; j++) coins.push({ s, j, own: j < own, land: s ? snap(t + dur * (j + 1) / n) : -9 });
      if (s) t += dur + 0.12;
    });
    const words = CAPTION.map((w, i) => ({ text: w, land: snap(t + 0.12 + i * 0.14) }));
    const t1 = words[words.length - 1].land + 0.26;
    const digits = [...RESULT].map((ch, i) => ({ ch, land: snap(t1 + i * 2 / POSES) }));
    return { counts, own, coins, words, digits, end: digits[digits.length - 1].land };
  }

  // ---------------------------------------------------------------- the clay kit (reusable on any subject)
  // 1. THE SURFACE. One tiling height map of what hands and tools leave behind: fingerprints (a shallow dent with
  //    ridges in it), knife drags with a burr, pits, specks, joins that were smoothed over. Grey = untouched.
  let SURFACE = null;
  function claySurface() {
    if (SURFACE) return SURFACE;
    const N = 1024, r = K.rng(3);
    SURFACE = K.canvasTex(N, N, (ctx) => {
      ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, N, N);
      // draw something at (x, y) and again wherever it crosses the edge, so the map tiles
      const tiled = (x, y, pad, draw) => { for (const ox of [-N, 0, N]) for (const oy of [-N, 0, N]) { if (x + ox < -pad || x + ox > N + pad || y + oy < -pad || y + oy > N + pad) continue; ctx.save(); ctx.translate(x + ox, y + oy); draw(); ctx.restore(); } };
      const pc = document.createElement('canvas'); pc.width = pc.height = 440; const p = pc.getContext('2d');
      for (let i = 0; i < 8; i++) {                                   // fingerprints
        const R = r.range(80, 160), sp = r.range(13, 17), ph = [r.range(0, 6.3), r.range(0, 6.3)], sx = r.range(0.62, 0.82);
        p.setTransform(1, 0, 0, 1, 0, 0); p.globalCompositeOperation = 'source-over'; p.clearRect(0, 0, 440, 440);
        p.translate(220, 220); p.rotate(r.range(0, 6.3));
        let g = p.createRadialGradient(0, 0, 0, 0, 0, R); g.addColorStop(0, 'rgba(0,0,0,0.26)'); g.addColorStop(0.75, 'rgba(0,0,0,0.2)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        p.fillStyle = g; p.fillRect(-220, -220, 440, 440);            // the press: a shallow dent
        p.strokeStyle = 'rgba(255,255,255,0.5)'; p.lineWidth = sp * 0.4; p.lineJoin = 'round';
        for (let k = 1; k * sp < R * 1.6; k++) {                      // the ridges: loops that crowd toward one side, like a real print
          p.beginPath();
          for (let a = 0; a < 6.283; a += 0.05) { const rr = k * sp * (1 + 0.07 * Math.sin(3 * a + ph[0]) + 0.04 * Math.sin(5 * a + ph[1] + k * 0.4)), X = rr * Math.cos(a) * sx, Y = rr * Math.sin(a) * 1.15 + k * sp * 0.42; if (a === 0) p.moveTo(X, Y); else p.lineTo(X, Y); }
          p.closePath(); p.stroke();
        }
        p.globalCompositeOperation = 'destination-in'; g = p.createRadialGradient(0, 0, R * 0.25, 0, 0, R); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        p.fillStyle = g; p.fillRect(-220, -220, 440, 440);
        tiled(r.range(0, N), r.range(0, N), 230, () => ctx.drawImage(pc, -220, -220));
      }
      ctx.lineCap = 'round';
      for (let i = 0; i < 10; i++) {                                  // tool marks: a drag with a raised burr beside it
        const L = r.range(120, 430), a = r.range(0, 6.3), w = r.range(2, 5), bend = r.range(-30, 30);
        tiled(r.range(0, N), r.range(0, N), 460, () => {
          ctx.rotate(a);
          ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(-L / 2, 0); ctx.quadraticCurveTo(0, bend, L / 2, 0); ctx.stroke();
          ctx.strokeStyle = 'rgba(255,255,255,0.32)'; ctx.lineWidth = w * 0.8; ctx.beginPath(); ctx.moveTo(-L / 2, w); ctx.quadraticCurveTo(0, bend + w, L / 2, w); ctx.stroke();
        });
      }
      for (let i = 0; i < 4; i++) {                                   // joins: two pieces pushed together and smoothed over
        const a = r.range(0, 6.3), pts = Array.from({ length: 9 }, (_, k) => [(k - 4) * 85, r.range(-26, 26)]);
        tiled(r.range(0, N), r.range(0, N), 420, () => {
          ctx.rotate(a);
          for (const [dy, style, w] of [[0, 'rgba(0,0,0,0.4)', 3.5], [5, 'rgba(255,255,255,0.22)', 5]]) { ctx.strokeStyle = style; ctx.lineWidth = w; ctx.beginPath(); pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y + dy) : ctx.moveTo(x, y + dy))); ctx.stroke(); }
        });
      }
      for (let i = 0; i < 170; i++) {                                 // pits (dark) and specks of stuck clay (light)
        const rad = r.range(1.5, 4.5) * (r.chance(0.08) ? 2.4 : 1), up = r.chance(0.22);
        tiled(r.range(0, N), r.range(0, N), 16, () => { const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rad); g.addColorStop(0, up ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.8)'); g.addColorStop(1, up ? 'rgba(255,255,255,0)' : 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rad, 0, 7); ctx.fill(); });
      }
      const im = ctx.getImageData(0, 0, N, N), d = im.data;           // a fine tooth over everything
      for (let i = 0; i < d.length; i += 4) { const v = d[i] + r.range(-7, 7); d[i] = d[i + 1] = d[i + 2] = v; }
      ctx.putImageData(im, 0, 0);
    }, { data: true, repeat: [1, 1] });
    return SURFACE;
  }

  // 2. THE MATERIAL. clay(colour, { marble, marbleAmount, marbleSize, bump, lump, roughness, sheen, tile }) -> a plasticine material
  //    for ANY geometry: no UVs needed. The surface map is projected from three sides in object space (so marks stay
  //    stuck to the object when it moves or squashes), soft dents are added as noise, a second colour is streaked
  //    through, pressed places come out slightly darker and shinier, and a sheen gives the waxy, velvety edge light.
  const CLAY_GLSL = `
    uniform sampler2D uSurf; uniform vec3 uOff, uMarble; uniform float uTile, uBump, uLump, uLumpSize, uMarbleAmt, uMarbleSize;
    varying vec3 vClayP, vClayN;
    float cHash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
    float cNoise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
      return mix(mix(mix(cHash(i), cHash(i + vec3(1,0,0)), f.x), mix(cHash(i + vec3(0,1,0)), cHash(i + vec3(1,1,0)), f.x), f.y),
                 mix(mix(cHash(i + vec3(0,0,1)), cHash(i + vec3(1,0,1)), f.x), mix(cHash(i + vec3(0,1,1)), cHash(i + vec3(1,1,1)), f.x), f.y), f.z); }
    // x: height of the surface in world units (fine marks + soft dents), y: the fine marks alone, -0.5..0.5
    vec2 clayH(vec3 p, vec3 w){
      vec3 q = p / uTile + uOff;
      float fine = dot(w, vec3(texture2D(uSurf, q.zy).r, texture2D(uSurf, q.xz).r, texture2D(uSurf, q.xy).r)) - 0.5;
      vec3 l = p / uLumpSize + uOff * 9.0;
      return vec2(uBump * fine + uLump * (cNoise(l) + 0.5 * cNoise(l * 2.3 + 5.0) - 0.75), fine);
    }
    // bend the normal by a height difference per pixel (Mikkelsen's bump mapping, in true units so it holds at any distance)
    vec3 clayBump(vec3 pos, vec3 n, vec2 dH, float face){
      vec3 sx = dFdx(pos), sy = dFdy(pos), r1 = cross(sy, n), r2 = cross(n, sx);
      float det = dot(sx, r1) * face;
      return normalize(abs(det) * n - sign(det) * (dH.x * r1 + dH.y * r2));
    }`;
  let clayCount = 0;
  function clay(colour, o = {}) {
    const [base, mix] = Array.isArray(colour) ? colour : [colour, o.marble || colour], c = new THREE.Color(base), r = K.rng(101 + clayCount++);
    const m = new THREE.MeshPhysicalMaterial({ color: c, roughness: o.roughness == null ? 0.6 : o.roughness, metalness: 0,
      sheen: o.sheen == null ? 0.4 : o.sheen, sheenRoughness: 0.5, sheenColor: c.clone().lerp(new THREE.Color('#ffffff'), 0.2) });
    const u = { uSurf: { value: claySurface() }, uOff: { value: new THREE.Vector3(r(), r(), r()) }, uMarble: { value: new THREE.Color(mix) },
      uTile: { value: o.tile || 1.5 }, uBump: { value: o.bump == null ? 0.007 : o.bump }, uLump: { value: o.lump == null ? 0.02 : o.lump }, uLumpSize: { value: o.lumpSize || 0.3 },
      uMarbleAmt: { value: o.marbleAmount == null ? 0.4 : o.marbleAmount }, uMarbleSize: { value: o.marbleSize || 0.5 } };
    m.userData.clay = u;
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, u);
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vClayP, vClayN;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvClayP = position; vClayN = normal;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + CLAY_GLSL)
        .replace('#include <map_fragment>', `#include <map_fragment>
          vec3 cW = pow(abs(normalize(vClayN)), vec3(4.0)); cW /= cW.x + cW.y + cW.z;
          vec2 cH = clayH(vClayP, cW);
          vec2 cD = vec2(clayH(vClayP + dFdx(vClayP), cW).x, clayH(vClayP + dFdy(vClayP), cW).x) - cH.x;
          float cM = cNoise(vClayP * 0.7 / uMarbleSize + uOff * 5.0);
          float cS = smoothstep(0.3, 0.95, sin(dot(vClayP, vec3(1.1, 1.8, 0.9)) / uMarbleSize + cM * 9.0 + uOff.x * 40.0)) * (0.35 + cM);
          diffuseColor.rgb = mix(diffuseColor.rgb, uMarble, clamp(uMarbleAmt * cS, 0.0, 1.0));
          diffuseColor.rgb *= 1.0 + 0.3 * cH.y;`)
        .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor + 0.55 * cH.y + 0.12 * (cM - 0.5), 0.32, 1.0);')
        .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\nnormal = clayBump(-vViewPosition, normal, cD, faceDirection);');
    };
    m.customProgramCacheKey = () => 'soft-clay';
    return m;
  }

  // 3. THE HANDS. lumpy(geometry, { amount, size, dents, dentSize, dentDepth, seed }) -> a copy that was shaped by
  //    fingers: every point is pushed by a smooth 3D field (so nothing stays symmetrical, and split vertices on hard
  //    edges never crack apart), then a few thumb dents are pressed in. Normals follow the warp exactly.
  function lumpy(geo, o = {}) {
    const amount = o.amount == null ? 0.03 : o.amount, f = 1 / (o.size || 0.6), seed = o.seed || 1;
    const g = geo.clone(), n = K.noise(seed), r = K.rng(seed + 77), P = g.attributes.position, N = g.attributes.normal, dents = [];
    for (let i = 0; i < (o.dents || 0); i++) { const k = r.int(0, P.count - 1); dents.push([P.getX(k), P.getY(k), P.getZ(k), N.getX(k), N.getY(k), N.getZ(k), (o.dentSize || 0.25) * r.range(0.7, 1.3), (o.dentDepth || 0.04) * r.range(0.6, 1.2)]); }
    const warp = (x, y, z, out) => {
      let dx = 2 * amount * n.n3(x * f + 31.4, y * f, z * f), dy = 2 * amount * n.n3(x * f, y * f + 47.2, z * f), dz = 2 * amount * n.n3(x * f, y * f, z * f + 12.9);
      for (const d of dents) { const q = Math.hypot(x - d[0], y - d[1], z - d[2]) / d[6]; if (q < 1) { const k = d[7] * (1 - q * q) * (1 - q * q); dx -= d[3] * k; dy -= d[4] * k; dz -= d[5] * k; } }
      return out.set(x + dx, y + dy, z + dz);
    };
    const p = new THREE.Vector3(), nn = new THREE.Vector3(), t1 = new THREE.Vector3(), t2 = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), E = 2e-3;
    for (let i = 0; i < P.count; i++) {
      p.fromBufferAttribute(P, i); nn.fromBufferAttribute(N, i);
      t1.set(0, 1, 0); if (Math.abs(nn.y) > 0.9) t1.set(1, 0, 0);
      t1.crossVectors(nn, t1).normalize(); t2.crossVectors(nn, t1);                       // two directions lying in the surface
      warp(p.x, p.y, p.z, a); warp(p.x + t1.x * E, p.y + t1.y * E, p.z + t1.z * E, b); warp(p.x + t2.x * E, p.y + t2.y * E, p.z + t2.z * E, c);
      b.sub(a); c.sub(a); nn.crossVectors(b, c).normalize();                              // the warped surface's own normal
      P.setXYZ(i, a.x, a.y, a.z); N.setXYZ(i, nn.x, nn.y, nn.z);
    }
    g.computeBoundingBox(); g.computeBoundingSphere();
    return g;
  }
  const part = (geo, mat) => { const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true; return m; };

  // ---------------------------------------------------------------- the models (this topic)
  const COIN_R = 0.5, COIN_T = 0.14, BALL_R = Math.cbrt(0.75 * COIN_R * COIN_R * COIN_T);   // a ball with exactly one coin's worth of clay
  // A hand-made coin: a disc with a raised rim, and grooves pushed into the edge one by one with a tool (never evenly).
  function coinGeo(seed) {
    const r = K.rng(seed), T = COIN_T / 2, SEG = 128, GROOVES = 30;
    const half = [[0, T - 0.036], [0.11, T - 0.036], [0.22, T - 0.036], [0.31, T - 0.036], [0.35, T - 0.03], [0.385, T - 0.008], [0.42, T], [0.465, T - 0.004], [0.489, T - 0.022], [0.5, T - 0.048], [0.5, 0]];
    const prof = half.concat(half.slice(0, -1).reverse().map(([x, y]) => [x, -y]));      // top centre, over the edge, to bottom centre
    const ga = [], gw = [], gd = [];
    for (let i = 0; i < GROOVES; i++) { ga.push((i + r.range(-0.24, 0.24)) / GROOVES * 2 * Math.PI); gw.push(r.range(0.04, 0.065)); gd.push(r.chance(0.12) ? 0 : r.range(0.011, 0.022)); }
    const groove = (a) => { let g = 0; for (let i = 0; i < GROOVES; i++) { const d = Math.abs(((a - ga[i] + 9 * Math.PI) % (2 * Math.PI)) - Math.PI) / gw[i]; if (d < 1) g = Math.max(g, gd[i] * (1 - d * d)); } return g; };
    const pos = [], idx = [];
    prof.forEach(([pr, py]) => { for (let s = 0; s < SEG; s++) { const a = s / SEG * 2 * Math.PI, rr = pr * COIN_R / 0.5 - K.smooth(0.44, 0.5, pr) * groove(a); pos.push(Math.cos(a) * rr, py, Math.sin(a) * rr); } });
    for (let i = 0; i < prof.length - 1; i++) for (let s = 0; s < SEG; s++) { const a = i * SEG + s, b = i * SEG + (s + 1) % SEG, c = a + SEG, d = b + SEG; idx.push(a, b, c, b, d, c); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    return lumpy(g, { amount: 0.014, size: 0.5, seed });
  }

  registerStyle({
    id: 'soft-clay',
    name: 'Soft Clay',
    family: 'Material worlds',
    look: 'Everything is modelled in plasticine and filmed like stop-motion on a small tabletop: chunky, slightly lopsided forms with fingerprints, tool marks and pits in them, in a few colours from one box of clay, in front of a seamless paper backdrop.',
    motion: 'Animated on twos (15 poses a second) with no motion blur, by swapping shapes like a stop-motion animator: a ball of clay buds, hops over on an arc, lands as a thick puck, is pressed too flat and springs back into a coin. Stacks flinch when something lands on them, words are slapped onto the backdrop, and anything just touched shifts by a hair between poses. Only the camera moves smoothly.',
    light: 'One big soft lamp from the upper left that pools on the backdrop and falls off to the corners, plus soft light from the whole sky that is blocked in every crease and under every object, so contact shadows are real.',
    materials: 'Matte, waxy plasticine with a velvety sheen: a generated surface of fingerprints, knife drags, pits and joins bends the light, pressed spots are a little shinier, and each colour has a second colour streaked through it. The backdrop is uncoated coloured card.',
    camera: 'A macro lens with shallow focus on a slow dolly: it starts close enough to read the fingerprints, travels along with the action, then pulls back in the same move until the whole set fits, and ends on a slight push-in.',
    post: 'True colours (neutral tone curve), almost no bloom, a light vignette and a little grain; a faint flicker in the lamp from pose to pose, like single frames shot one at a time.',
    explains: 'Anything that can be told with a few friendly objects on a table: amounts as piles and stacks, growth and comparison, simple characters and props, a number or a few words as fat clay letters. Good for warm, non-technical topics.',
    topic: 'How compound interest grows your savings',
    duration: 8,
    fonts: [FONT],
    render: { samples: 64, shutter: 0, tone: 'neutral', exposure: 1.0, bloom: 0.06, bloomThreshold: 1.1, vignette: 0.26, grain: 0.014, fov: 28, background: '#0d3a3d' },

    build(S) {
      const { scene, camera } = S;
      const plan = schedule(), rnd = K.rng(7);

      // ---- the set: one big soft key, sky light with real occlusion, a pale environment for fill and sheen
      const KEY = 1400;
      K.env(S, { top: '#f6f2ea', horizon: '#b9d2d0', bottom: '#3f6466', intensity: 0.22, panels: [{ pos: [-9, 12, 10], size: [16, 12], color: '#fff2df', power: 2.4 }] });
      const key = K.spot(S, { pos: [-7.5, 11, 9.5], target: [0.4, 1.3, -0.6], color: '#fff0dc', power: KEY, angle: 0.52, penumbra: 1, soft: 1.3, near: 6, far: 40, bias: -0.0003 });
      K.skyLight(S, { color: '#e2f2ff', power: 0.75, size: 9.5, center: [-0.5, 1.5, 0], spread: 0.85 });

      // a seamless paper sweep: floor, cove, wall in one sheet
      const FLOOR_BACK = -1.3, COVE = 1.9, WALL = FLOOR_BACK - COVE;
      {
        const front = 16, height = 16, Lf = front - FLOOR_BACK, La = Math.PI / 2 * COVE, L = Lf + La + height - COVE;
        const g = new THREE.PlaneGeometry(70, 1, 1, 120), p = g.attributes.position;
        for (let i = 0; i < p.count; i++) {
          const s = (p.getY(i) + 0.5) * L, x = p.getX(i);
          if (s < Lf) p.setXYZ(i, x, 0, front - s);
          else if (s < Lf + La) { const a = (s - Lf) / COVE; p.setXYZ(i, x, COVE - COVE * Math.cos(a), FLOOR_BACK - COVE * Math.sin(a)); }
          else p.setXYZ(i, x, COVE + s - Lf - La, WALL);
        }
        g.computeVertexNormals();
        const tooth = K.canvasTex(256, 256, (ctx) => { const im = ctx.createImageData(256, 256), r = K.rng(9); for (let i = 0; i < im.data.length; i += 4) { im.data[i] = im.data[i + 1] = im.data[i + 2] = 128 + r.range(-60, 60); im.data[i + 3] = 255; } ctx.putImageData(im, 0, 0); }, { data: true, repeat: [40, L * 0.6] });
        const card = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: BOX.card, roughness: 0.93, bumpMap: tooth, bumpScale: 0.35 }));
        card.receiveShadow = true; scene.add(card);
      }

      // ---- the stacks
      const PITCH = 1.3, X0 = -2.75;
      const coinGeos = [1, 2, 3, 4, 5, 6].map((s) => coinGeo(s * 13));
      const ballGeos = [1, 2, 3].map((s) => lumpy(new THREE.SphereGeometry(BALL_R, 22, 16), { amount: 0.03, size: 0.3, seed: s * 5, dents: 3, dentSize: 0.2, dentDepth: 0.03 }));
      const dollar = K.text3d('$', { font: FONT, size: 0.6, depth: 0.09, bevel: 0.03, bevelSegments: 3 }); dollar.rotateX(-Math.PI / 2);
      const dollarGeos = [1, 2, 3].map((s) => lumpy(dollar, { amount: 0.008, size: 0.25, seed: s * 3 }));
      const mats = { own: [0, 1, 2, 3].map(() => clay(BOX.coral, { lump: 0.012, marbleSize: 0.22, marbleAmount: 0.5 })), earned: [0, 1, 2, 3].map(() => clay(BOX.yellow, { lump: 0.012, marbleSize: 0.22, marbleAmount: 0.5 })) };
      const stacks = YEARS.map((_, s) => { const g = new THREE.Group(); g.position.set(X0 + s * PITCH + rnd.range(-0.04, 0.04), 0, rnd.range(-0.06, 0.06)); scene.add(g); return { g, coins: [], top: 0, lean: [rnd.range(-0.012, 0.012), rnd.range(-0.012, 0.012)] }; });
      for (const c of plan.coins) {
        const st = stacks[c.s], th = rnd.range(0.93, 1.07), mat = rnd.pick(c.own ? mats.own : mats.earned);
        const top = c.j === plan.counts[c.s] - 1;
        c.home = [st.lean[0] * c.j + rnd.range(-0.035, 0.035), st.top + COIN_T * th / 2, st.lean[1] * c.j + rnd.range(-0.035, 0.035)];
        c.rot = [rnd.range(-0.03, 0.03), rnd.range(-0.5, 0.5) * (top ? 0.4 : 1), rnd.range(-0.03, 0.03)];
        c.th = th; st.top += COIN_T * th;
        c.coin = new THREE.Group(); c.coin.add(part(rnd.pick(coinGeos), mat));
        const d = part(rnd.pick(dollarGeos), mat); d.position.y = COIN_T / 2 - 0.036; c.coin.add(d);
        st.g.add(c.coin); st.coins.push(c);
        if (c.s) { c.ball = part(rnd.pick(ballGeos), mat); c.spin = [rnd.range(0, 6), rnd.range(0, 6)]; c.arc = [(c.j % 2 ? 1.15 : 0.5) + rnd.range(-0.08, 0.08), (c.j % 2 ? -1 : 1) * rnd.range(0.2, 0.5)]; scene.add(c.ball); }
      }
      // where each ball starts: the top of the stack before it (the coins that earned it)
      for (const c of plan.coins) if (c.s) { const from = stacks[c.s - 1]; c.from = [from.g.position.x + rnd.range(-0.15, 0.15), from.top + BALL_R * 0.6, from.g.position.z + rnd.range(-0.15, 0.15)]; }

      // ---- the sign next to the first stack: a slab with the starting amount pressed onto it
      const sign = new THREE.Group();
      {
        sign.add(part(lumpy(K.roundedBox(2.05, 1.3, 0.24, 0.12, 6), { amount: 0.035, size: 0.9, seed: 21, dents: 4, dentSize: 0.35, dentDepth: 0.03 }), clay(BOX.navy, { marbleAmount: 0.3 })));
        const a = part(lumpy(K.text3d(SIGN[0], { font: FONT, size: 0.62, depth: 0.16, bevel: 0.045, bevelSegments: 4 }), { amount: 0.012, size: 0.4, seed: 22 }), clay(BOX.cream, { marbleAmount: 0.12 }));
        const b = part(lumpy(K.text3d(SIGN[1], { font: FONT, size: 0.34, depth: 0.12, bevel: 0.03, bevelSegments: 4 }), { amount: 0.008, size: 0.3, seed: 23 }), clay(BOX.yellow, { marbleAmount: 0.25 }));
        a.position.set(0, 0.2, 0.16); b.position.set(0, -0.33, 0.15); sign.add(a, b);
        sign.position.set(X0 - 1.85, 0.62, 0.1); sign.rotation.set(-0.2, 0.16, -0.015); scene.add(sign);
      }

      // ---- the words on the backdrop: every letter (or small word) is its own lump, pressed on one after another
      const stuck = [];
      {
        const cx = -2.2, big = { font: FONT, size: 2.45, depth: 0.5, bevel: 0.15, bevelSegments: 5 };
        K.text3dLetters(RESULT, big).forEach((L, i) => {
          const m = part(lumpy(L.geometry, { amount: 0.04, size: 0.9, seed: 40 + i, dents: 2, dentSize: 0.4, dentDepth: 0.03 }), clay(BOX.cream, { marbleAmount: 0.18 }));
          stuck.push({ m, land: plan.digits[i].land, at: [cx + L.x, 3.2 + L.y + rnd.range(-0.04, 0.04), WALL], depth: 0.5, tilt: rnd.range(-0.035, 0.035), id: 300 + i }); scene.add(m);
        });
        const small = { font: FONT, size: 0.8, depth: 0.22, bevel: 0.07, bevelSegments: 4 }, cap = CAPTION.join(' ');
        const letters = K.text3dLetters(cap, small); let k = 0;
        plan.words.forEach((w, wi) => {
          const mine = letters.filter((L) => L.index >= k && L.index < k + w.text.length); k += w.text.length + 1;
          const x0 = (mine[0].x + mine[mine.length - 1].x) / 2, grp = new THREE.Group(), mat = clay(BOX.yellow, { marbleAmount: 0.25 });
          mine.forEach((L, i) => { const m = part(lumpy(L.geometry, { amount: 0.014, size: 0.4, seed: 60 + wi * 9 + i }), mat); m.position.set(L.x - x0, L.y + rnd.range(-0.015, 0.015), 0); m.rotation.z = rnd.range(-0.04, 0.04); grp.add(m); });
          stuck.push({ m: grp, land: w.land, at: [cx + x0, 5.2, WALL], depth: 0.22, tilt: rnd.range(-0.02, 0.02), id: 400 + wi }); scene.add(grp);
        });
      }

      // ---- camera: one continuous dolly. Macro on the sign and the first stack, then it travels with the growing stacks,
      // pulls back to show the whole curve as the words go up, and ends on a slight push-in
      const cam = {
        pos: K.path([[0, [-4.35, 2.05, 4.9]], [1.1, [-2.9, 2.0, 7.3]], [2.0, [-0.6, 2.1, 7.7]], [3.0, [2.1, 2.3, 8.7]], [4.0, [3.4, 2.7, 11.3]], [5.3, [0.6, 2.95, 15.3]], [8, [0.5, 2.85, 14.5]]]),
        aim: K.path([[0, [-3.9, 0.52, 0]], [1.1, [-2.55, 0.9, 0]], [2.0, [-0.2, 1.25, 0]], [3.0, [2.45, 1.75, 0]], [4.0, [3.6, 2.55, 0]], [5.3, [-0.1, 2.6, -1.2]], [8, [-0.1, 2.6, -1.2]]]),
        focus: K.path([[0, [-4.25, 0.7, 0.2]], [1.1, [-2.55, 0.9, 0]], [4.0, [3.6, 2.55, 0]], [5.3, [-0.1, 2.6, -1.2]], [8, [-0.1, 2.6, -1.2]]]),   // between the sign and the first stack, then the stacks, then just behind them so the wall words stay crisp
        ap: K.track([[0, 0.05], [1.1, 0.06], [4.0, 0.05], [5.3, 0.04], [8, 0.04]]),
      };
      const SQUASH = [0.045, 0.02, 0.008];       // how far (world units) a stack gives way on the three poses after something lands on it

      return {
        update(t) {
          const tq = pose(t);                    // the clay's clock

          stacks.forEach((st, si) => {
            // a stack gives way a little under whatever just landed on it, stretches as it sends a ball off to the next
            // stack, and is never put back exactly where it was
            let drop = 0, busy = false, height = COIN_T;
            for (const c of st.coins) { const a = since(tq, c.land); if (a >= 0 && a <= 2) drop += SQUASH[a]; if (a >= -1 && a <= 4) busy = true; if (a >= 1) height = c.home[1]; }
            if (stacks[si + 1]) for (const c of stacks[si + 1].coins) { const a = since(tq, c.land); if (a === -5) { drop -= 0.03; busy = true; } else if (a === -4) drop += 0.012; }
            const sy = 1 - K.clamp(drop, -0.045, 0.07) / Math.max(height, 0.5), sx = 1 + (1 - sy) * 0.5;
            st.g.scale.set(sx, sy, sx);
            st.g.rotation.set(busy ? nudge(si + 0.1, tq, 0.006) : 0, busy ? nudge(si + 0.5, tq, 0.03) : 0, busy ? nudge(si + 0.25, tq, 0.006) : 0);
            for (const c of st.coins) {
              const a = since(tq, c.land);       // poses since this coin touched down
              // replacement animation: a ball in the air (a < 0), then the coin in four shapes: a thick puck on contact, pressed too flat, springing back, at rest
              const flat = a === 0 ? [0.74, 1.8] : a === 1 ? [1.1, 0.74] : a === 2 ? [0.965, 1.08] : [1, 1];
              c.coin.visible = a >= 0;
              c.coin.position.set(c.home[0], c.home[1] - COIN_T * c.th * (1 - flat[1]) / 2, c.home[2]);
              c.coin.rotation.set(c.rot[0], c.rot[1], c.rot[2]); c.coin.scale.set(flat[0], flat[1] * c.th, flat[0]);
              if (!c.ball) continue;
              c.ball.visible = a >= -5 && a < 0;
              const to = st.g.position, floor = (c.home[1] - COIN_T * c.th / 2) * sy;      // the top of the stack right now
              if (a === -5) {                    // it buds on top of the stack that earned it...
                c.ball.position.set(c.from[0], c.from[1] - BALL_R * 0.25, c.from[2]); c.ball.rotation.set(0, c.spin[1], 0); c.ball.scale.set(1.18, 0.74, 1.18);
              } else if (a < 0) {                // ...and takes four poses to hop over on an arc
                const u = (a + 5) / 5, y1 = floor + BALL_R, hop = 4 * u * (1 - u);
                c.ball.position.set(K.lerp(c.from[0], to.x + c.home[0], u), K.lerp(c.from[1], y1, u) + (0.7 + 0.1 * Math.abs(y1 - c.from[1])) * c.arc[0] * hop, K.lerp(c.from[2], to.z + c.home[2], u) + c.arc[1] * hop);
                c.ball.rotation.set(c.spin[0] + u * 3, c.spin[1], u * 2); c.ball.scale.set(0.94, 1.1, 0.94);
              }
            }
          });

          for (const w of stuck) {               // pressed onto the backdrop: thrown on wide and flat, springs out, settles
            const a = since(tq, w.land), s = a === 0 ? [1.2, 0.45] : a === 1 ? [0.93, 1.22] : a === 2 ? [1.03, 0.94] : [1, 1], loose = K.clamp(1 - a / 5);
            w.m.visible = a >= 0;
            w.m.scale.set(s[0], s[0], s[1]);
            w.m.position.set(w.at[0] + nudge(w.id, tq, 0.02) * loose, w.at[1] + nudge(w.id + 0.3, tq, 0.02) * loose, w.at[2] + w.depth * s[1] / 2 - 0.03);
            w.m.rotation.z = w.tilt + nudge(w.id + 0.6, tq, 0.07) * loose;
          }

          key.intensity = KEY * (1 + nudge(1, tq, 0.012));      // single frames never get exactly the same exposure
          K.look(camera, cam.pos(t), cam.aim(t)); K.focus(camera, cam.focus(t), cam.ap(t));   // the camera glides in real time
        },
      };
    },

    sound(k) {
      const K = globalThis.K, plan = schedule(), r = K.rng(5);
      const NOTES = [0, 2, 4, 7, 9];                                   // a pentatonic scale: every coin lands one step higher than the last
      const plop = (t, j, pan, gain) => {                              // soft clay on soft clay: a low thump with a short pitched body
        const f = 196 * Math.pow(2, (NOTES[j % 5] + 12 * Math.floor(j / 5)) / 12 / 2.2);
        k.tone(t, { f: [[0, f * 1.5], [0.05, f]], dur: 0.16, gain: 0.2 * gain, pan, a: 0.004 });
        k.tone(t, { f: [[0, 150], [0.07, 70]], dur: 0.1, gain: 0.22 * gain, pan });
        k.noise(t, { dur: 0.035, color: 'brown', filter: 'lowpass', f: 900, gain: 0.3 * gain, pan });
      };
      // several coins can land on one pose: sound the highest of them, a little louder
      const hits = new Map();
      for (const c of plan.coins) if (c.s) { const h = hits.get(c.land) || { j: 0, n: 0, s: c.s }; h.j = Math.max(h.j, c.j); h.n++; hits.set(c.land, h); }
      k.withMinor(() => { for (const [t, h] of hits) plop(t, h.j, K.map(h.s, 0, YEARS.length - 1, -0.5, 0.6), 0.75 + 0.2 * h.n + r.range(-0.08, 0.08)); });
      YEARS.forEach((_, s) => { if (s) k.play('swish', Math.min(...plan.coins.filter((c) => c.s === s).map((c) => c.land)) - 4 / POSES, { gain: 0.35 + 0.05 * s, pan: K.map(s, 0, YEARS.length - 1, -0.5, 0.6) }); });   // each new batch takes off
      plan.words.forEach((w, i) => { k.play('slap', w.land, { gain: 0.45, pan: -0.25 }); k.play('pop', w.land, { gain: 0.5, f: 520 + i * 70, pan: -0.25 }); });
      plan.digits.forEach((d, i) => { k.play('press', d.land, { gain: 0.75, pan: -0.4 + i * 0.1 }); k.play('slap', d.land, { gain: 0.5, pan: -0.4 + i * 0.1 }); k.play('pop', d.land, { gain: 0.6, f: 330 * Math.pow(2, NOTES[i % 5] / 12), pan: -0.4 + i * 0.1 }); });
      k.play('success', plan.end + 3 / POSES, { gain: 0.7, f: 'G5' });
      k.bed('room', 0, 8, { gain: 0.9 });
      k.music('pad', 0, 8, { bpm: 60, gain: 0.45, chords: [['G3', 'B3', 'D4', 'A4'], ['C4', 'E4', 'G4', 'D5']] });
    },
  });
}
```
