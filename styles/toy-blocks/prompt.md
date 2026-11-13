I want a short 3D motion graphic made with three.js in the "Toy Blocks" style. Below is the complete source of a reference animation in this exact style, plus the small rendering kit and sound kit it runs on. Use them as your style guide and rebuild the animation around my content.

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
- Load these Google Fonts before building (the kit awaits the specs in style.fonts): Fredoka, Fraunces

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
Name: Toy Blocks
Family: Material worlds
Use: explainer
Look: Design-shop wooden blocks on a sunlit playroom floor: maple cubes and bricks with rounded edges, chalky milk paint worn back to bare wood at the corners, and letters, numbers and simple pictures screen-printed on the faces. The stacks are the chart.
Motion: Blocks drop in from above with real weight: one corner hits first, the block bounces once, rocks from edge to edge and settles with a knock. A heavy block makes the whole tower teeter. Nothing eases; everything falls.
Light: Low, warm afternoon sun through a window to the left, so the floor carries soft stripes of window-frame shadow and every block throws a long shadow. Cool sky light fills the shade and darkens the gaps between blocks. The far wall stays in shade with one patch of window light.
Materials: Pale maple with drawn grain that runs the right way on every face (end grain on the ends), matte milk paint in dusty blue, coral, green, mustard and cream with chips and scratches, slightly patchy pressed-in print, an oak board floor with a soft sheen.
Camera: Long lens at a child's eye height. It starts close on the word spelled in alphabet blocks, cranes up to the first tower as it grows, then makes one slow arc around the stacks with a slight push, close enough that the tallest tower nearly fills the height of the frame. Shallow focus keeps the room soft.
Finish: Real motion blur on the falling blocks, real depth of field, colours kept true (neutral tone curve), a touch of warmth and contrast, light vignette, very fine grain. No bloom to speak of.
Good for: Lists, comparisons, proportions, steps and "the building blocks of X". One cube is one unit, a tower is a bar, a brick is a label, alphabet blocks spell the headline; pictures on the faces say what each unit is.

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

REFERENCE STYLE SOURCE (styles/toy-blocks.js; its sample topic was "The 50/30/20 budget rule: 50% needs, 30% wants, 20% savings")
```js
{
  // ---------------------------------------------------------------- content (change this block for a new topic)
  const TITLE = 'BUDGET';            // spelled with alphabet blocks on the floor, well in front of the towers: the opening shot
  const UNIT = 10;                   // what one cube stands for, in percent. The number on a tower's cap is counted
                                     // from its cubes (cubes x UNIT), so the print can never disagree with the stack.
  const TOWERS = [                   // left to right; `cubes` are the pictures printed on the blocks, bottom to top
    { name: 'NEEDS', paint: 'blue', cubes: ['house', 'apple', 'bolt', 'car', 'cross'] },
    { name: 'WANTS', paint: 'coral', cubes: ['note', 'pizza', 'plane'] },
    { name: 'SAVINGS', paint: 'green', cubes: ['piggy', 'coin'] },
  ];
  const TITLE_INKS = ['blue', 'coral', 'mustard', 'green', 'coral', 'blue'];

  // ---------------------------------------------------------------- the toy box: sizes, paint, timing
  const PAINT = { blue: '#3d6a97', coral: '#d8603f', green: '#4f8d68', mustard: '#e3a83a', cream: '#f1e7cf' };   // milk paint: chalky, slightly greyed
  const MAPLE = { base: '#e6cc9f', line: '150,100,52', light: '255,244,214' };   // the blocks
  const OAK = { base: '#8b6744', line: '70,44,22', light: '232,196,150' };       // the floor
  const EDGE = 0.07;                 // radius of every rounded edge, world units (a cube is 1 unit)
  const BASE = [2.7, 0.84, 1.2], CAP = [1.84, 0.92, 1.04], LETTER = 0.82, PITCH = 3.4, TITLE_Z = 7;   // name brick, percent brick, alphabet cube, tower spacing, where the headline lies
  const FIRST = 0.4, BEAT = 0.42, CAP_GAP = 0.58, NEXT_GAP = 0.56;   // first knock, cube to cube, last cube to cap, cap to next tower
  const GRAV = 52, DROP_FROM = 11.5, BOUNCE = 0.16;                  // gravity (units/s2), release height, how much speed survives the first hit
  const towerX = (i) => (i - (TOWERS.length - 1) / 2) * PITCH;

  // Every block that falls, with the time it first touches (tc) and where it comes to rest. Picture and sound both
  // read this list, so a knock is always on the frame of its contact.
  function schedule(K) {
    const r = K.rng(21), drops = [];
    let t = FIRST;
    TOWERS.forEach((tw, ti) => {
      const n = tw.cubes.length;
      for (let i = 0; i <= n; i++) {
        const cap = i === n, size = cap ? CAP : [1, 1, 1];
        if (cap) t += CAP_GAP - BEAT;
        const lean = r.sign();
        drops.push({
          tower: ti, level: i, cap, size, tc: t,
          x: towerX(ti) + (cap ? 0.1 * lean : r.range(-0.05, 0.05)), z: r.range(-0.04, 0.04), y: BASE[1] + i + (cap ? CAP[1] / 2 : 0.5),
          yaw: r.range(-0.07, 0.07), spin: r.range(0.6, 1.5) * r.sign(),          // rest angle, and how fast it turns on the way down
          tilt: lean * r.range(0.15, 0.26), tiltX: r.range(-0.11, 0.11),          // how crooked it arrives (radians): one corner hits first
          hz: r.range(3.1, 4.0), damp: cap ? 4.2 : 5.2,                           // the rocking after the hit
          pivot: [Math.min(size[0] / 2, i ? 0.5 : BASE[0] / 2), Math.min(size[2] / 2, i ? 0.5 : BASE[2] / 2)],   // it rocks on the edges of whatever is narrower: itself or the block under it
          sway: lean * (cap ? 0.07 * Math.pow(n / 5, 1.2) : 0.0045 * Math.pow(i + 1, 0.9)),   // the lean it gives the whole tower (a cap on five cubes makes it teeter)
          swayHz: 2.3 / Math.sqrt(i + 1.4), swayDamp: cap ? 1.7 : 3.2, swayFor: cap ? 0.9 + 0.22 * n : 0.8,
        });
        t += BEAT;
      }
      t += NEXT_GAP - BEAT;
    });
    return drops;
  }
  const fallTime = (d) => Math.sqrt(2 * (DROP_FROM - d.y) / GRAV);
  const bounceTime = (d) => 2 * BOUNCE * fallTime(d);                     // length of the one small bounce after the first hit
  const rockPhase = (d, tau) => 2 * Math.PI * d.hz * tau * (1 + 0.9 * tau);   // rocking gets quicker as it gets smaller, like a real block

  // Where one block is at time t, before the tower's own sway: free fall from rest, one bounce, then it rocks from
  // edge to edge and dies down. Everything is a formula of (t - tc), so any frame can be asked for in any order.
  function dropPose(K, d, t) {
    const tau = t - d.tc, T = fallTime(d), tb = bounceTime(d), h = d.size[1] / 2;
    const lift = tau < 0 ? (DROP_FROM - d.y) - 0.5 * GRAV * Math.pow(Math.max(0, T + tau), 2) : tau < tb ? 0.5 * GRAV * tau * (tb - tau) : 0;
    const env = tau < 0 ? 1 - 1.5 * tau : Math.exp(-d.damp * tau) * (1 - K.smooth(0.5, 0.95, tau));
    const rz = d.tilt * env * (tau < 0 ? 1 : Math.cos(rockPhase(d, tau)));
    const rx = d.tiltX * env * (tau < 0 ? 1 : Math.cos(rockPhase(d, tau) * 1.31));
    const ry = d.yaw + d.spin * tau * (tau < 0 ? 1 : Math.exp(-14 * tau));
    // a tilted block rests on one bottom edge: that edge stays on the support, so the centre rises and shifts sideways
    return {
      x: d.x - Math.sign(rz) * d.pivot[0] * (1 - Math.cos(rz)) - h * Math.sin(rz),
      y: d.y + lift + d.pivot[0] * Math.abs(Math.sin(rz)) + d.pivot[1] * Math.abs(Math.sin(rx)) - h * (1 - Math.cos(rz) * Math.cos(rx)),
      z: d.z + Math.sign(rx) * d.pivot[1] * (1 - Math.cos(rx)) + h * Math.sin(rx),
      rx, ry, rz,
    };
  }
  // The lean of a whole tower: every landing gives it a push that rocks it on its bottom edges and dies away.
  function towerSway(K, drops, ti, t) {
    let a = 0;
    for (const d of drops) { const tau = t - d.tc; if (d.tower === ti && tau > 0 && tau < d.swayFor) a += d.sway * Math.exp(-d.swayDamp * tau) * Math.sin(2 * Math.PI * d.swayHz * tau) * (1 - K.smooth(d.swayFor * 0.55, d.swayFor, tau)); }
    return a;
  }

  // ---------------------------------------------------------------- pictures for the faces (drawn white in a 100 x 100 box, centre 0,0)
  const poly = (c, pts, round = 6) => { c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); c.fill(); if (round) { c.lineWidth = round; c.stroke(); } };
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); };
  const disc = (c, x, y, r, ry, rot) => { c.beginPath(); c.ellipse(x, y, r, ry || r, rot || 0, 0, 7); c.fill(); };
  const cut = (c, fn) => { c.globalCompositeOperation = 'destination-out'; fn(); c.globalCompositeOperation = 'source-over'; };   // a hole in the print
  const PICTURES = {
    house: (c) => { rr(c, 17, -40, 11, 24, 2); poly(c, [[-41, -4], [0, -40], [41, -4]], 8); rr(c, -30, -6, 60, 46, 4); cut(c, () => rr(c, -9, 8, 18, 32, 3)); },
    apple: (c) => { disc(c, -13, 10, 24, 28); disc(c, 13, 10, 24, 28); c.lineWidth = 7; c.beginPath(); c.moveTo(0, -14); c.quadraticCurveTo(1, -30, 8, -38); c.stroke(); disc(c, 22, -30, 13, 6.5, -0.55); cut(c, () => disc(c, 0, -22, 7, 5)); },
    bolt: (c) => poly(c, [[12, -44], [-27, 6], [-3, 6], [-12, 44], [27, -10], [3, -10]], 5),
    car: (c) => { rr(c, -44, -4, 88, 27, 9); poly(c, [[-25, -4], [-15, -27], [15, -27], [27, -4]], 7); cut(c, () => { disc(c, -22, 24, 15); disc(c, 22, 24, 15); poly(c, [[-15, -7], [-10, -20], [-2, -20], [-2, -7]], 3); poly(c, [[5, -7], [5, -20], [11, -20], [18, -7]], 3); }); disc(c, -22, 24, 11); disc(c, 22, 24, 11); cut(c, () => { disc(c, -22, 24, 4); disc(c, 22, 24, 4); }); },
    cross: (c) => { rr(c, -14, -40, 28, 80, 7); rr(c, -40, -14, 80, 28, 7); },
    note: (c) => { disc(c, -22, 28, 14, 10.5, -0.35); disc(c, 20, 19, 14, 10.5, -0.35); rr(c, -13, -32, 7, 60, 2); rr(c, 29, -41, 7, 60, 2); poly(c, [[-13, -32], [36, -41], [36, -25], [-13, -16]], 2); },
    pizza: (c) => { poly(c, [[-33, -22], [33, -22], [0, 44]], 8); rr(c, -42, -41, 84, 17, 8.5); cut(c, () => { disc(c, -12, -8, 6.5); disc(c, 12, -4, 6.5); disc(c, 0, 15, 5.5); }); },
    plane: (c) => { c.save(); c.rotate(Math.PI / 4); rr(c, -6.5, -46, 13, 90, 6.5); poly(c, [[0, -14], [45, 13], [45, 22], [0, 9], [-45, 22], [-45, 13]], 4); poly(c, [[0, 26], [19, 39], [19, 45], [0, 40], [-19, 45], [-19, 39]], 3); c.restore(); },
    piggy: (c) => { disc(c, -2, 4, 36, 27); rr(c, 27, -5, 17, 18, 6); poly(c, [[8, -20], [20, -37], [27, -16]], 4); rr(c, -24, 22, 11, 19, 3); rr(c, 9, 22, 11, 19, 3); c.lineWidth = 4.5; c.beginPath(); c.arc(-42, 1, 6, -1.2, 3.6); c.stroke(); cut(c, () => { disc(c, 19, -5, 3.2); rr(c, -13, -17, 22, 5, 2.5); }); },
    coin: (c) => { disc(c, 0, 0, 41); cut(c, () => { c.lineWidth = 3.5; c.beginPath(); c.arc(0, 0, 32, 0, 7); c.stroke(); c.font = '700 50px "Fredoka"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('$', 0, 3); }); },
  };
  // art(c, W, H) draws a face's print in white, centred on 0,0 (W x H = the face in texture pixels)
  const picture = (name) => (c, W, H) => { const k = Math.min(W, H) * 0.0074; c.scale(k, k); PICTURES[name](c); };
  // one line of text set to a cap height (a fraction of the face height), optionally inside a thin printed frame
  const lettering = (text, font, capH, frame) => (c, W, H) => {
    if (frame) { c.lineWidth = H * 0.028; c.beginPath(); c.roundRect(-W / 2 + H * frame, -H / 2 + H * frame, W - 2 * H * frame, H - 2 * H * frame, H * 0.07); c.stroke(); }
    c.font = font.replace('#', '100'); const m = c.measureText('H'), px = 100 * capH * H / m.actualBoundingBoxAscent;
    c.font = font.replace('#', px.toFixed(1)); c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    const b = c.measureText(text); c.fillText(text, (b.actualBoundingBoxLeft - b.actualBoundingBoxRight) / 2, capH * H / 2);
  };
  const SANS = '700 #px "Fredoka"', SERIF = '900 #px "Fraunces"';

  // ---------------------------------------------------------------- the block maker
  // makeToyBox(S) -> { block, prism, cylinder, shapes }. Every face of a block is its own little painting: wood with the
  // grain running the way it would if the block were sawn from a board, milk paint that has worn back to bare wood
  // along the rounded edges, and a screen print that is a touch crooked and patchy. A second canvas per face carries
  // height (red: grain, paint thickness, the print pressed in) and roughness (green: paint is chalkier than wood).
  function makeToyBox(S, PX = 380) {
    const { THREE, K } = S, cache = new Map();
    const canvas = (w, h) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv; };
    const tint = (mask, css) => { const cv = canvas(mask.width, mask.height), c = cv.getContext('2d'); c.fillStyle = css; c.fillRect(0, 0, cv.width, cv.height); c.globalCompositeOperation = 'destination-in'; c.drawImage(mask, 0, 0); return cv; };

    // wood into a colour canvas (c) and its height/roughness canvas (d). dir: 'h' or 'v' = long grain running that
    // way across the face, 'end' = end grain (growth rings).
    function wood(c, d, W, H, seed, dir, tone = MAPLE, rough = 150, s = PX / 380) {
      const r = K.rng(seed);
      c.fillStyle = tone.base; c.fillRect(0, 0, W, H); d.fillStyle = `rgb(128,${rough},0)`; d.fillRect(0, 0, W, H);
      const both = (path, a, lw) => { c.strokeStyle = `rgba(${tone.line},${a})`; c.lineWidth = lw; c.stroke(path); d.strokeStyle = `rgba(92,${rough + 30},0,${Math.min(1, a * 2.2)})`; d.lineWidth = lw; d.stroke(path); };
      if (dir === 'end') {
        const cx = W * r.range(-0.3, 1.3), cy = H * r.range(1.15, 2.1), far = Math.hypot(Math.max(cx, W - cx), cy);
        for (let rad = Math.max(8, cy - H) * 0.6; rad < far; rad += r.range(3.5, 9) * s) { const p = new Path2D(); p.arc(cx, cy, rad, 0, 7); both(p, r.range(0.1, 0.3), r.range(0.8, 2.6) * s); }
        for (let i = 0; i < 46; i++) { const a = -Math.PI * r(), p = new Path2D(); p.moveTo(cx + Math.cos(a) * 20, cy + Math.sin(a) * 20); p.lineTo(cx + Math.cos(a) * far, cy + Math.sin(a) * far); c.strokeStyle = `rgba(${tone.light},${r.range(0.04, 0.12)})`; c.lineWidth = r.range(0.6, 1.6) * s; c.stroke(p); }
        for (let i = 0; i < 260 * s * s; i++) { c.fillStyle = `rgba(${tone.line},${r.range(0.1, 0.3)})`; c.fillRect(r() * W, r() * H, 1.3 * s, 1.3 * s); }
        return;
      }
      const L = dir === 'v' ? H : W, T = dir === 'v' ? W : H;
      for (const x of [c, d]) { x.save(); if (dir === 'v') x.transform(0, 1, 1, 0, 0, 0); }
      const ph = r.range(0, 6.28), amp = r.range(2, 6) * s, kx = r.range(0.5, 1.3) * 6.28 / L, wave = (x) => amp * (Math.sin(x * kx + ph) + 0.4 * Math.sin(x * kx * 2.3 + ph * 2));
      for (let i = 0; i < 8; i++) { c.fillStyle = `rgba(${tone.line},${r.range(0.03, 0.09)})`; c.fillRect(0, r.range(-0.1, 1) * T, L, r.range(0.04, 0.16) * T); }     // broad bands of darker wood
      for (let y = -8 * s; y < T + 8 * s; y += r.range(1.6, 6.5) * s) {                                                                                                   // the grain lines, flowing together
        const p = new Path2D(), j = r.range(0, 6.28);
        for (let x = 0; x <= L + 16; x += 16) p.lineTo(x, y + wave(x) + Math.sin(x * 0.011 / s + j) * 0.9 * s);
        both(p, r.range(0.05, 0.24), r.range(0.6, 1.9) * s);
      }
      for (let i = 0; i < 420 * s * s; i++) { const x = r() * L; c.fillStyle = `rgba(${tone.line},${r.range(0.1, 0.26)})`; c.fillRect(x, r() * T + wave(x), r.range(3, 13) * s, 1.1 * s); }   // pores
      for (let i = 0; i < 7; i++) { const x = r() * L, w = r.range(20, 70) * s, g = c.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, `rgba(${tone.light},0)`); g.addColorStop(0.5, `rgba(${tone.light},${r.range(0.04, 0.1)})`); g.addColorStop(1, `rgba(${tone.light},0)`); c.fillStyle = g; c.fillRect(x, 0, w, T); }   // shimmer across the grain
      for (const x of [c, d]) x.restore();
    }
    // Where the paint still is (alpha): the whole outline, minus a ragged band along it, deeper at corners, plus a
    // few chips and scratches. `outline` is a closed list of pixel points (default: the rectangle of the face).
    function paintLayer(W, H, seed, edge, outline, wear = 1, rim = true) {
      const r = K.rng(seed + 500), n = K.noise(seed + 3), cv = canvas(W, H), c = cv.getContext('2d');
      const pts = outline || [[0, 0], [W, 0], [W, H], [0, H]];
      c.fillStyle = '#fff'; poly(c, pts, 0);
      c.globalCompositeOperation = 'destination-out';
      let run = 0;
      if (rim) pts.forEach((a, i) => {
        const b = pts[(i + 1) % pts.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]), sharp = !outline || len > edge * 3;
        for (let u = 0; u < len; u += 2, run += 2) {
          const corner = sharp ? 1 + 1.1 * (1 - K.smooth(0, edge * 2.4, Math.min(u, len - u))) : 1.15;
          const rad = edge * wear * (0.22 + 0.5 * K.clamp(0.5 + 1.2 * n.fbm(run * 0.013, seed * 0.37, 0, 3))) * corner;
          c.beginPath(); c.arc(a[0] + (b[0] - a[0]) * u / len, a[1] + (b[1] - a[1]) * u / len, Math.max(1, rad), 0, 7); c.fill();
        }
      });
      for (let i = 0; i < 5 * wear; i++) { const x = r() * W, y = r() * H, a = r() * 6.28, l = r.range(0.06, 0.3) * W; c.globalAlpha = r.range(0.25, 0.6); c.lineWidth = r.range(0.7, 1.6); c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }   // scratches
      for (let i = 0; i < 26 * wear; i++) { c.globalAlpha = r.range(0.3, 1); c.beginPath(); c.arc(r() * W, r() * H, r.range(0.5, 2.4), 0, 7); c.fill(); }                                                                                                                      // dings
      return cv;
    }
    const paintColour = (mask, css, seed) => {    // flat colour would look like plastic: milk paint is cloudy
      const r = K.rng(seed + 77), cv = tint(mask, css), c = cv.getContext('2d'), W = cv.width, H = cv.height;
      c.globalCompositeOperation = 'source-atop';
      for (let i = 0; i < 46; i++) { const x = r() * W, y = r() * H, rad = r.range(0.08, 0.3) * W, g = c.createRadialGradient(x, y, 0, x, y, rad), k = r() < 0.5 ? '255,250,235' : '20,14,8'; g.addColorStop(0, `rgba(${k},${r.range(0.03, 0.075)})`); g.addColorStop(1, `rgba(${k},0)`); c.fillStyle = g; c.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
      return cv;
    };
    // The print (alpha): the art, set down a hair off-centre and off-square, with pinholes and thin misses in the ink.
    function printLayer(W, H, seed, art) {
      const r = K.rng(seed + 900), cv = canvas(W, H), c = cv.getContext('2d');
      c.translate(W / 2 + r.range(-1, 1) * W * 0.012, H / 2 + r.range(-1, 1) * H * 0.012); c.rotate(r.range(-0.022, 0.022));
      c.fillStyle = c.strokeStyle = '#fff'; c.lineJoin = c.lineCap = 'round';
      art(c, W, H);
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'destination-out'; c.fillStyle = c.strokeStyle = '#000';
      for (let i = 0; i < W * H / 900; i++) { c.globalAlpha = r.range(0.35, 1); c.beginPath(); c.arc(r() * W, r() * H, r.range(0.4, 1.9), 0, 7); c.fill(); }
      for (let i = 0; i < 9; i++) { c.globalAlpha = r.range(0.2, 0.5); c.fillRect(r() * W, r() * H, r.range(0.1, 0.4) * W, r.range(0.8, 1.8)); }
      return cv;
    }
    // One face -> material. o: { w, h (world size), seed, dir, tone, paint (css), ink (css), art, outline (world points
    // from the face's lower-left corner), wear, rim (false = no worn edge) }. A face with no art is shared between blocks.
    function face(o) {
      const W = Math.round(o.w * PX), H = Math.round(o.h * PX), key = o.art || o.outline ? null : [W, H, o.dir, o.paint, o.seed % 3].join('|');
      if (key && cache.has(key)) return cache.get(key);
      const data = K.canvasTex(W, H, null, { data: true }), d = data.ctx;
      const map = K.canvasTex(W, H, (c) => {
        wood(c, d, W, H, o.seed, o.dir || 'h', o.tone);
        if (o.paint) {
          const m = paintLayer(W, H, o.seed, EDGE * PX, o.outline && o.outline.map(([x, y]) => [x * PX, H - y * PX]), o.wear, o.rim !== false);
          c.drawImage(paintColour(m, o.paint, o.seed), 0, 0);
          d.globalAlpha = 0.86; d.drawImage(tint(m, 'rgb(142,228,0)'), 0, 0); d.globalAlpha = 1;      // paint: a film on top, and chalky
        }
        if (o.art) {
          const m = printLayer(W, H, o.seed, o.art);
          c.globalAlpha = 0.96; c.drawImage(tint(m, o.ink || PAINT.cream), 0, 0); c.globalAlpha = 1;
          d.filter = `blur(${(PX / 260).toFixed(2)}px)`; d.drawImage(tint(m, 'rgb(70,205,0)'), 0, 0); d.filter = 'none';   // the print sits a little below the surface
        }
      });
      const mat = new THREE.MeshStandardMaterial({ map, bumpMap: data, bumpScale: 5, roughnessMap: data, roughness: 1 });
      if (key) cache.set(key, mat);
      return mat;
    }
    const shadowed = (m) => { m.castShadow = m.receiveShadow = true; return m; };

    // A cube or brick. size [w, h, d]; grain: the axis the wood fibres run along ('x', 'y' or 'z'); faces: { front,
    // back, left, right, top, bottom }, each { paint, ink, art } (leave one out for bare wood). Origin at the centre.
    function block({ size, grain = 'x', seed = 1, faces = {} }) {
      const [w, h, d] = size, dir = { x: ['end', 'h', 'h'], y: ['v', 'end', 'v'], z: ['h', 'v', 'end'] }[grain];
      const sides = [['right', d, h, dir[0]], ['left', d, h, dir[0]], ['top', w, d, dir[1]], ['bottom', w, d, dir[1]], ['front', w, h, dir[2]], ['back', w, h, dir[2]]];
      return shadowed(new THREE.Mesh(K.roundedBox(w, h, d, EDGE, 5), sides.map(([name, fw, fh, fd], i) => face({ w: fw, h: fh, dir: fd, seed: seed * 7 + i, ...(faces[name] || {}) }))));
    }
    // Any flat outline pushed through the wood: arches, wedges, half-rounds, bridges. shape: THREE.Shape in world
    // units; the two big faces get the full treatment, the band around them is plain paint or wood.
    function prism(shape, depth, { paint, seed = 1 } = {}) {
      const g = new THREE.ExtrudeGeometry(shape, { depth: depth - 2 * EDGE * 0.7, bevelEnabled: true, bevelThickness: EDGE * 0.7, bevelSize: EDGE * 0.7, bevelOffset: -EDGE * 0.7, bevelSegments: 3, curveSegments: 28 });
      g.translate(0, 0, -depth / 2 + EDGE * 0.7); g.computeBoundingBox();
      const bb = g.boundingBox, w = bb.max.x - bb.min.x, h = bb.max.y - bb.min.y, uv = g.attributes.uv, p = g.attributes.position;
      for (let i = g.groups[0].start; i < g.groups[0].start + g.groups[0].count; i++) uv.setXY(i, (p.getX(i) - bb.min.x) / w, (p.getY(i) - bb.min.y) / h);
      const outline = shape.getPoints(28).map((v) => [v.x - bb.min.x, v.y - bb.min.y]);
      const band = face({ w: 1, h: 1, seed: seed + 40, dir: 'h', paint, rim: false, outline: [[-1, -1], [2, -1], [2, 2], [-1, 2]] }); band.map.wrapS = band.map.wrapT = band.bumpMap.wrapS = band.bumpMap.wrapT = THREE.RepeatWrapping;
      return shadowed(new THREE.Mesh(g, [face({ w, h, seed, dir: 'h', paint, outline }), band]));
    }
    // A turned piece (cylinder, wheel, peg): the profile [[radius, y], ...] is spun around the y axis.
    function turned(profile, { paint, seed = 1 } = {}) {
      const n = profile.length, g = new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), 48), uv = g.attributes.uv, len = [0];
      for (let i = 1; i < n; i++) len[i] = len[i - 1] + Math.hypot(profile[i][0] - profile[i - 1][0], profile[i][1] - profile[i - 1][1]);
      for (let i = 0; i < uv.count; i++) uv.setY(i, len[i % n] / len[n - 1]);                           // v follows the profile's real length, so the print is not squeezed
      const rMax = Math.max(...profile.map((q) => q[0])), wall = profile.map((q, i) => (q[0] > rMax - 1e-4 ? len[i] : -1)).filter((v) => v >= 0);
      const w = 2 * Math.PI * rMax, y0 = wall[0] - EDGE * 0.6, y1 = wall[wall.length - 1] + EDGE * 0.6;    // paint the outside wall, leave the turned ends bare
      return shadowed(new THREE.Mesh(g, face({ w, h: len[n - 1], seed: seed + 60, dir: 'v', paint, outline: paint && [[-1, y0], [w + 1, y0], [w + 1, y1], [-1, y1]] })));
    }
    const cylinder = (r, h, o) => { const e = EDGE, pts = [[0, -h / 2]]; for (let i = 0; i <= 5; i++) { const a = -Math.PI / 2 + i * Math.PI / 10; pts.push([r - e + Math.cos(a) * e, -h / 2 + e + Math.sin(a) * e]); } for (let i = 0; i <= 5; i++) { const a = i * Math.PI / 10; pts.push([r - e + Math.cos(a) * e, h / 2 - e + Math.sin(a) * e]); } pts.push([0, h / 2]); return turned(pts, o); };
    const shapes = {
      arch: (w, h, hole) => { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(-hole, 0); s.absarc(0, 0, hole, Math.PI, 0, true); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath(); return s; },
      wedge: (w, h) => { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath(); return s; },
      halfRound: (r) => { const s = new THREE.Shape(); s.moveTo(-r, 0); s.lineTo(r, 0); s.absarc(0, 0, r, 0, Math.PI, false); s.closePath(); return s; },
    };
    return { block, prism, turned, cylinder, shapes, face, wood };
  }

  registerStyle({
    id: 'toy-blocks',
    name: 'Toy Blocks',
    family: 'Material worlds',
    look: 'Design-shop wooden blocks on a sunlit playroom floor: maple cubes and bricks with rounded edges, chalky milk paint worn back to bare wood at the corners, and letters, numbers and simple pictures screen-printed on the faces. The stacks are the chart.',
    motion: 'Blocks drop in from above with real weight: one corner hits first, the block bounces once, rocks from edge to edge and settles with a knock. A heavy block makes the whole tower teeter. Nothing eases; everything falls.',
    light: 'Low, warm afternoon sun through a window to the left, so the floor carries soft stripes of window-frame shadow and every block throws a long shadow. Cool sky light fills the shade and darkens the gaps between blocks. The far wall stays in shade with one patch of window light.',
    materials: 'Pale maple with drawn grain that runs the right way on every face (end grain on the ends), matte milk paint in dusty blue, coral, green, mustard and cream with chips and scratches, slightly patchy pressed-in print, an oak board floor with a soft sheen.',
    camera: 'Long lens at a child\'s eye height. It starts close on the word spelled in alphabet blocks, cranes up to the first tower as it grows, then makes one slow arc around the stacks with a slight push, close enough that the tallest tower nearly fills the height of the frame. Shallow focus keeps the room soft.',
    post: 'Real motion blur on the falling blocks, real depth of field, colours kept true (neutral tone curve), a touch of warmth and contrast, light vignette, very fine grain. No bloom to speak of.',
    explains: 'Lists, comparisons, proportions, steps and "the building blocks of X". One cube is one unit, a tower is a bar, a brick is a label, alphabet blocks spell the headline; pictures on the faces say what each unit is.',
    topic: 'The 50/30/20 budget rule: 50% needs, 30% wants, 20% savings',
    duration: 8,
    fonts: ['700 100px "Fredoka"', '900 100px "Fraunces"'],
    render: { samples: 64, shutter: 0.5, tone: 'neutral', exposure: 1.0, bloom: 0.12, bloomThreshold: 1.3, vignette: 0.3, grain: 0.018, fov: 24, background: '#2c2a26', contrast: 1.05, saturation: 1.04 },

    build(S) {
      const { THREE, K, scene, camera } = S;
      const toy = makeToyBox(S), drops = schedule(K), rnd = K.rng(4);
      const put = (m, x, y, z, ry = 0, rx = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); scene.add(m); return m; };

      // ---------------- light: one low sun through a window, sky light for the shade
      // The sun is a far spot light with a "cookie": a drawing of the window it shines through, in the light's own
      // view (x = right, y = up, world units, 0,0 = the point it aims at). Bars of the frame become soft shadow
      // stripes on the floor; a second window puts a patch of light on the far wall.
      const sunDir = new THREE.Vector3(0.72, -0.38, -0.58).normalize(), right = new THREE.Vector3().crossVectors(sunDir, new THREE.Vector3(0, 1, 0)).normalize(), up = new THREE.Vector3().crossVectors(right, sunDir);
      const AIM = [-3.5, 6.5], HALF = 13, FAR = 70;     // centre of the cookie in light view, its half-width, distance of the sun
      const target = right.clone().multiplyScalar(AIM[0]).addScaledVector(up, AIM[1]);
      const sun = K.spot(S, { pos: target.clone().addScaledVector(sunDir, -FAR).toArray(), target: target.toArray(), color: '#ffe3bf', power: 8 * FAR * FAR, angle: Math.atan(HALF / FAR), penumbra: 0, soft: 0.8, mapSize: 4096, near: FAR - 30, far: FAR + 45, normalBias: 0.015 });
      sun.map = K.canvasTex(1024, 1024, (c, W) => {
        const k = W / (2 * HALF), X = (x) => (x - AIM[0] + HALF) * k, Y = (y) => (AIM[1] + HALF - y) * k, pane = (x0, y0, x1, y1) => c.fillRect(X(x0), Y(y1), (x1 - x0) * k, (y1 - y0) * k);
        c.fillStyle = '#000'; c.fillRect(0, 0, W, W); c.filter = 'blur(9px)'; c.fillStyle = '#fff';
        pane(-4.3, -3, 7.9, 8.2); pane(-8.7, -3, -4.85, 8.2); pane(-13.2, -3, -9.25, 8.2);                       // the window over the floor: the towers stand in its widest pane
        for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) pane(-14.6 + i * 3.6, 9.6 + j * 3.2, -11.4 + i * 3.6, 12.4 + j * 3.2);   // a second window, far left of the sun's view: it only reaches the wall
      });
      K.skyLight(S, { color: '#c9d6ea', power: 1.0, size: 15, center: [0, 1, -2], mapSize: 2048 });
      K.env(S, { top: '#a9bbd0', horizon: '#d8cdb9', bottom: '#70502f', intensity: 0.5, panels: [{ pos: [-24, 13, 15], size: [14, 16], color: '#fff0d6', power: 3 }] });

      // ---------------- the playroom: oak boards, a shaded wall with a skirting board, a rug, toys left lying about
      const BOARD = 2.4, TILE = BOARD * 5, floorData = K.canvasTex(2048, 2048, null, { data: true });
      const floorMap = K.canvasTex(2048, 2048, (c, W) => {
        const d = floorData.ctx, r = K.rng(9), bw = W / 5;
        for (let i = 0; i < 5; i++) {
          for (const x of [c, d]) { x.save(); x.beginPath(); x.rect(i * bw, 0, bw, W); x.clip(); x.translate(i * bw, 0); }
          toy.wood(c, d, bw, W, 30 + i, 'v', OAK, 132, 0.8);
          c.fillStyle = `rgba(${r() < 0.5 ? '40,20,5' : '255,214,160'},${r.range(0.02, 0.13)})`; c.fillRect(0, 0, bw, W);     // no two boards are the same colour
          for (const x of [c, d]) x.restore();
        }
        for (let i = 0; i < 5; i++) for (const [x, col] of [[c, 'rgba(38,20,8,0.9)'], [d, 'rgb(30,200,0)']]) { x.fillStyle = col; x.fillRect(i * bw - 2.5, 0, 5, W); x.fillRect(i * bw, ((i * 0.37 + 0.2) % 1) * W, bw, 4); }   // gaps between boards, and where two boards meet end to end
      }, { repeat: [96 / TILE, 96 / TILE] });
      floorData.wrapS = floorData.wrapT = THREE.RepeatWrapping; floorData.repeat.copy(floorMap.repeat);
      const floor = put(new THREE.Mesh(new THREE.PlaneGeometry(96, 96), new THREE.MeshStandardMaterial({ map: floorMap, bumpMap: floorData, bumpScale: 2.5, roughnessMap: floorData, roughness: 1 })), 1.1, 0, -10, 0, -Math.PI / 2);
      floor.receiveShadow = true;
      const WALL_Z = -21, wall = put(new THREE.Mesh(new THREE.PlaneGeometry(110, 40), new THREE.MeshStandardMaterial({ color: '#b3c1c0', roughness: 0.95 })), 0, 20, WALL_Z); wall.receiveShadow = true;
      const trim = new THREE.MeshStandardMaterial({ color: '#9aa9a8', roughness: 0.6 });
      put(new THREE.Mesh(K.roundedBox(110, 2.6, 0.36, 0.1, 3), trim), 0, 1.3, WALL_Z + 0.18).receiveShadow = true;
      put(new THREE.Mesh(K.roundedBox(110, 0.3, 0.5, 0.12, 3), trim), 0, 2.55, WALL_Z + 0.22).castShadow = true;
      const rugData = K.canvasTex(1024, 512, null, { data: true });
      const rugMap = K.canvasTex(1024, 512, (c, W, H) => {
        const d = rugData.ctx, r = K.rng(12); c.fillStyle = '#3f6672'; c.fillRect(0, 0, W, H); d.fillStyle = 'rgb(128,240,0)'; d.fillRect(0, 0, W, H);
        [[30, 26, '#e6dcc4'], [64, 8, '#cf6a4a'], [H - 56, 26, '#e6dcc4'], [H - 72, 8, '#cf6a4a']].forEach(([y, h, col]) => { c.fillStyle = col; c.fillRect(0, y, W, h); });
        for (let y = 0; y < H; y += 4) { c.fillStyle = `rgba(60,40,20,${r.range(0.05, 0.16)})`; c.fillRect(0, y, W, 1.5); d.fillStyle = 'rgb(70,240,0)'; d.fillRect(0, y, W, 1.5); }   // the weave
      });
      const rugMat = new THREE.MeshStandardMaterial({ map: rugMap, bumpMap: rugData, bumpScale: 3, roughness: 1 });
      const rug = put(new THREE.Mesh(K.roundedBox(20, 0.2, 9, 0.09, 3), rugMat), 6.5, 0.1, -12.2, -0.1); rug.castShadow = rug.receiveShadow = true;

      const P = PAINT, plain = (c, rough = 0.8) => new THREE.MeshStandardMaterial({ color: c, roughness: rough });
      // just behind the towers (a little soft): the other shapes in the box
      put(toy.prism(toy.shapes.arch(2.0, 1.15, 0.58), 0.9, { paint: P.mustard, seed: 3 }), -6.4, 0, -2.3, 0.42);
      put(toy.prism(toy.shapes.wedge(1.5, 1.0), 0.9, { paint: P.coral, seed: 5 }), 6.2, 0, -3.4, -0.5);
      // further back (soft): spare blocks, a ring stacker, a ball
      put(toy.block({ size: [1, 1, 1], seed: 61, grain: 'y', faces: { front: { paint: P.cream, ink: P.blue, art: lettering('A', SERIF, 0.56) }, top: { paint: P.cream }, right: { paint: P.cream } } }), -1.7, 0.5, -6.2, 0.5);
      put(toy.prism(toy.shapes.halfRound(0.7), 0.9, { paint: P.blue, seed: 8 }), -1.75, 1.0, -6.2, 0.38);
      put(toy.cylinder(0.46, 1.4, { paint: P.green, seed: 9 }), -5.7, 0.46, -6.4, 0.3, 0, Math.PI / 2);
      put(toy.block({ size: [2, 0.6, 1], seed: 71, faces: { front: { paint: P.coral }, top: { paint: P.coral } } }), 2.0, 0.3, -7.4, -0.3);
      put(toy.prism(toy.shapes.wedge(1.4, 0.9), 0.9, { paint: P.mustard, seed: 11 }), 2.3, 0.6, -7.4, -0.22);
      const stacker = new THREE.Group(); stacker.position.set(7.7, 0.2, -11); stacker.scale.setScalar(0.92); scene.add(stacker);
      const part = (g, m, y) => { const o = new THREE.Mesh(g, m); o.position.y = y; if (g.type === 'TorusGeometry') o.rotation.x = Math.PI / 2; o.castShadow = o.receiveShadow = true; stacker.add(o); };
      part(new THREE.CylinderGeometry(1.5, 1.6, 0.3, 40), plain(MAPLE.base, 0.6), 0.15); part(new THREE.CylinderGeometry(0.16, 0.16, 4.2, 20), plain(MAPLE.base, 0.6), 2.1); part(new THREE.SphereGeometry(0.42, 24, 16), plain(P.coral), 4.3);
      [[1.05, P.blue], [0.9, P.mustard], [0.75, P.green], [0.6, P.coral]].forEach(([rad, c], i) => part(new THREE.TorusGeometry(rad, 0.4, 20, 48), plain(c), 0.7 + i * 0.78));
      const ball = put(new THREE.Mesh(new THREE.SphereGeometry(1.3, 40, 24), new THREE.MeshStandardMaterial({ roughness: 0.75, map: K.canvasTex(256, 128, (c) => { c.fillStyle = P.cream; c.fillRect(0, 0, 256, 128); c.fillStyle = P.mustard; c.fillRect(0, 44, 256, 40); c.fillStyle = P.blue; c.fillRect(0, 60, 256, 8); }) })), -10.2, 1.3, -13, 0.4, 0.5, 0.3);
      ball.castShadow = true;

      // ---------------- the content: the headline in alphabet blocks, a name brick per tower, the cubes, the caps
      const titleX = (i) => (i - (TITLE.length - 1) / 2) * (LETTER + 0.07);
      [...TITLE].forEach((ch, i) => {
        const ink = PAINT[TITLE_INKS[i % TITLE_INKS.length]], other = PAINT[TITLE_INKS[(i + 2) % TITLE_INKS.length]];
        put(toy.block({ size: [LETTER, LETTER, LETTER], seed: 100 + i, grain: i % 3 === 1 ? 'y' : 'x', faces: {
          front: { ink, art: lettering(ch, SERIF, 0.5, 0.085) }, top: { paint: ink }, bottom: { paint: ink },
          left: { paint: other, art: lettering(ch, SERIF, 0.5) }, right: { paint: other, art: lettering(ch, SERIF, 0.5) }, back: { ink, art: lettering(ch, SERIF, 0.5, 0.085) },
        } }), titleX(i) + rnd.range(-0.02, 0.02), LETTER / 2, TITLE_Z + rnd.range(-0.07, 0.07), rnd.range(-0.09, 0.09));
      });
      TOWERS.forEach((tw, ti) => {
        const ink = PAINT[tw.paint], label = { ink, art: lettering(tw.name, SANS, 0.5) };
        put(toy.block({ size: BASE, seed: 200 + ti, faces: { front: label, back: label } }), towerX(ti), BASE[1] / 2, 0, rnd.range(-0.025, 0.025));
      });
      const bodies = drops.map((d, i) => {
        const tw = TOWERS[d.tower], paint = PAINT[tw.paint];
        if (d.cap) {
          const face = { paint: P.cream, ink: paint, art: lettering(tw.cubes.length * UNIT + '%', SANS, 0.56) };
          return put(toy.block({ size: CAP, seed: 300 + i, faces: { front: face, back: face, top: { paint: P.cream }, bottom: { paint: P.cream }, left: { paint: P.cream }, right: { paint: P.cream } } }), 0, 30, 0);
        }
        const pic = picture(tw.cubes[d.level]), painted = { paint, art: pic }, bare = { ink: paint, art: pic };
        return put(toy.block({ size: d.size, seed: 300 + i, grain: i % 2 ? 'x' : 'y', faces: { front: painted, back: painted, left: bare, right: bare, top: { paint }, bottom: { paint } } }), 0, 30, 0);
      });
      for (const m of bodies) m.rotation.order = 'ZXY';     // yaw first, then the tilt in world axes

      // ---------------- camera: it starts close on the headline, cranes up to the first tower as it grows (the headline
      // leaves through the bottom of the frame), and settles into one slow arc from left to right with a slight push.
      // The arc's last key lies after the end of the clip, so the move is still gliding on the final frame.
      const cam = {
        open: { pos: [-1.2, 3.7, 17.35], aim: [-0.3, 0.95, 5.35] },
        arcPos: K.path([[0, [-3.3, 4.75, 19.6]], [8.8, [3.0, 4.45, 18.1]]]),
        arcAim: K.path([[0, [-0.3, 3.3, 0.45]], [8.8, [0.1, 3.34, 0.4]]]),
        focus: K.track([[0, [-0.3, 0.5, TITLE_Z + 0.4]], [1.1, [-2.5, 2, 0.6], 'inOut'], [2.5, [0, 3.3, 0.55], 'inOut']]),
        ap: K.track([[0, 0.06], [2.5, 0.15, 'inOut']]),
      };
      const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);

      return {
        update(t) {
          const sway = TOWERS.map((_, ti) => towerSway(K, drops, ti, t));
          drops.forEach((d, i) => {
            const p = dropPose(K, d, t), m = bodies[i], tau = t - d.tc;
            // the tower's lean carries every block that has landed: it turns about the bottom edge of the lowest cube
            const a = sway[d.tower] * K.seg(tau, -0.05, 0.02), x0 = towerX(d.tower), dx = p.x - x0, dy = p.y - BASE[1];
            // and a block that is hit from above shivers for a moment
            let jz = 0, jy = 0;
            for (const e of drops) { const te = t - e.tc; if (e.tower === d.tower && e.level > d.level && te > 0 && te < 0.5) { const k = Math.exp(-11 * te) * (e.cap ? 1.6 : 1) / (e.level - d.level); jz += 0.011 * k * Math.sin(52 * te + i); jy += 0.014 * k * Math.sin(38 * te + i * 2.1); } }
            m.position.set(x0 + dx * Math.cos(a) - dy * Math.sin(a) - Math.sign(a) * 0.5 * (1 - Math.cos(a)), BASE[1] + 0.5 * Math.abs(Math.sin(a)) + dx * Math.sin(a) + dy * Math.cos(a), p.z);
            m.rotation.set(p.rx, p.ry + jy, p.rz + a + jz);
            m.visible = tau > -fallTime(d);
          });
          const k = K.seg(t, 0, 1.3, K.ease.inOut);       // the crane from the opening shot into the arc
          K.look(camera, mix(cam.open.pos, cam.arcPos(t), k), mix(cam.open.aim, cam.arcAim(t), k)); K.focus(camera, cam.focus(t), cam.ap(t));
        },
      };
    },

    sound(k) {
      // wood on wood only: a knock for every contact in the schedule, pitched by the size of the block, a softer one
      // for the bounce, a few ticks as it rocks out, and one toy-xylophone note when a tower gets its number
      const K = globalThis.K, drops = schedule(K), r = K.rng(5);
      const knock = (t, g, f, pan) => {
        k.tone(t, { f: [[0, f * 1.3], [0.035, f]], dur: 0.1, gain: 0.5 * g, pan, verb: 0.16 });
        k.tone(t, { f: [[0, f * 0.62], [0.08, f * 0.5]], dur: 0.13, gain: 0.34 * g, pan });                 // the body of the block under it
        k.tone(t, { f: f * 2.76, dur: 0.04, gain: 0.14 * g, pan });
        k.noise(t, { dur: 0.024, filter: 'bandpass', f: f * 3.4, q: 1.1, gain: 0.55 * g, pan });
        k.noise(t, { dur: 0.08, color: 'brown', filter: 'lowpass', f: 320, gain: 0.6 * g, pan });
      };
      const notes = ['E5', 'G5', 'C6'];
      drops.forEach((d) => {
        const pan = K.clamp(d.x / 7, -0.7, 0.7), f = (d.cap ? 330 : 520 + r.range(-50, 70)) * (1 - 0.03 * d.level);
        knock(d.tc, d.cap ? 1 : 0.8, f, pan);
        knock(d.tc + bounceTime(d), 0.42, f * 1.12, pan);
        k.withMinor(() => { for (let n = 0; n < 5; n++) { const q = (0.25 + n / 2) / d.hz, tau = (-1 + Math.sqrt(1 + 3.6 * q)) / 1.8, g = 0.34 * Math.exp(-d.damp * tau); if (tau > bounceTime(d) + 0.03 && g > 0.03) knock(d.tc + tau, g, f * 1.25, pan); } });
        if (d.cap) { const n = notes[d.tower % notes.length]; k.tone(d.tc + 0.02, { f: n, dur: 0.9, gain: 0.16, pan, verb: 0.35 }); k.tone(d.tc + 0.02, { f: k.hz(n) * 4, dur: 0.22, gain: 0.05, pan, verb: 0.3 }); }
      });
      k.bed('room', 0, 8, { gain: 0.45 });
    },
  });
}
```
