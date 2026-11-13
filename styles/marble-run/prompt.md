I want a short 3D motion graphic made with three.js in the "Marble Run" style. Below is the complete source of a reference animation in this exact style, plus the small rendering kit and sound kit it runs on. Use them as your style guide and rebuild the animation around my content.

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
- Load these Google Fonts before building (the kit awaits the specs in style.fonts): Oswald

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
Name: Marble Run
Family: Machines that explain
Use: explainer
Look: A handmade wooden marble run shot like a product film: a walnut board carrying pale maple rails on brass pins, brass paddle gates, swirled glass marbles and three glass jars on a maple plinth with the labels burnt into the wood, in front of a shaded seamless backdrop.
Motion: Marbles are let go one at a time, pick up speed as they drop, clack against brass gates that flip to sort them, fall into their jar and settle into a pile. Nothing is eased by hand: speed comes from the height each marble has lost, and the piles are a small physics run.
Light: Warm daylight from the upper left, kept off the backdrop so the wall sits in soft shade behind the sunlit wood. Rails and marbles throw soft shadows onto the board, and every marble drops a small glint of its own colour into its shadow.
Materials: Satin maple and walnut with drawn grain, polished brass that picks up the window, coloured glass with a white vein that glows on the side away from the light, thick clear jar glass with bright edges.
Camera: Long lens, shallow focus, one continuous shot that stays close. It rides beside one marble from the hopper, gets to the first gate just ahead of it and waits for the clack, follows it across the second gate, then travels down as it drops into its jar, opens just far enough to hold all three jars and pushes slowly in on the jars, their counters and their names.
Finish: Real motion blur and depth of field, colours kept true (neutral tone curve), a small bloom on brass and glass glints, light vignette, fine grain.
Good for: Sorting, routing and filtering: anything where many items take different paths through the same rules. The hopper is what comes in, each gate is one rule, each jar is one outcome with a counter under it, and how full the jars end up is the result.

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

REFERENCE STYLE SOURCE (styles/marble-run.js; its sample topic was "How your inbox sorts email")
```js
{
  // ---------------------------------------------------------------- content (change this for a new topic)
  const SOURCE = 'NEW MAIL';                       // engraved on the hopper
  const BINS = [                                   // the three jars, left to right
    { label: 'INBOX', glass: '#3f78ff' },
    { label: 'PROMOTIONS', glass: '#22c36e' },
    { label: 'SPAM', glass: '#ff453a' },
  ];
  const GATE_TAGS = ['SPAM?', 'PROMO?'];           // the question each brass gate asks
  // One digit per marble, in the order they leave the hopper: the jar it belongs in. About half of all email is spam,
  // so the SPAM jar ends up the fullest and INBOX the emptiest: the jars are the chart.
  const ORDER = '22101221201212' + '0' + '21012010211222';
  const HERO = 14;                                 // the marble the camera follows
  const T_HERO = 0.25, EVERY = 0.32;                // when the hero is released, and the gap between releases (seconds)

  // ---------------------------------------------------------------- the machine (all in one vertical plane, z = Z0)
  // Marbles ride on two maple rails. Rail 1 runs right from the hopper to gate 1. A gate is a brass paddle on an axle
  // in a gap of the track: lying flat it is a bridge, standing up it is a wall that knocks the marble down through the
  // gap. Gate 1 lets SPAM cross to the far jar and drops the rest onto rail 2, which runs back left; gate 2 drops
  // PROMOTIONS into the middle jar and lets INBOX roll on to the end.
  const R = 0.23, ROD = 0.06, GAUGE = 0.28, Z0 = 0.7;             // marble radius, rail radius, rail spacing, track plane
  const RIDE = Math.sqrt((R + ROD) ** 2 - (GAUGE / 2) ** 2);      // marble centre above the rail centre-line
  const ROLL = RIDE * R / (R + ROD);                              // rolling radius on two rails (smaller than R: it spins faster)
  const KROLL = 1 / (1 + 0.4 * R * R / (ROLL * ROLL));            // share of gravity that becomes speed; the rest goes into spin
  const G = 35;                                                   // gravity in world units: about 2.3x slow motion for a 19 mm marble
  const JARX = [-3.75, 0, 3.75];
  const JAR = { rin: 0.6, rneck: 0.47, floor: 0.1, sh0: 1.4, sh1: 1.72, rim: 1.95 };   // inside of a jar: radius, neck radius, floor, shoulder, rim
  const PIN = [-3.95, 5.475], FEED = [0.743, -0.669];               // where the front marble waits, and the direction of the feed chute
  const M1 = -0.1, GAP1 = [2.15, 3.15], Y1 = 4.565;                // rail 1: slope, the gap of gate 1, height at the gap
  const M2 = 0.1, GAP2 = [0, -1], Y2 = 3.177, START2 = 2.95;       // rail 2 runs right to left
  const y1 = (x) => Y1 + M1 * (x - GAP1[0]), y2 = (x) => Y2 + M2 * (x - GAP2[0]);
  const END1 = JARX[2] + 0.02, END2 = JARX[0] - 0.02;             // where the end plates turn a marble down into its jar
  const PL = 0.95, PT = 0.06, OPEN = 1.08;                         // paddle length, thickness and how far it swings (radians)
  const up = (m) => { const k = Math.hypot(1, m); return [-m / k, 1 / k]; };
  const gate = (gap, yf, m, dir) => {                             // dir = +1 when marbles arrive moving right
    const xm = (gap[0] + gap[1]) / 2, n = up(m), a0 = Math.atan(m), a1 = a0 - dir * OPEN;
    const pivot = [xm - n[0] * (R + PT / 2), yf(xm) - n[1] * (R + PT / 2)];
    return { pivot, a0, a1, dir, n: [Math.sin(a1), -Math.cos(a1)] };   // n faces the arriving marble
  };
  const GATE1 = gate(GAP1, y1, M1, 1), GATE2 = gate(GAP2, y2, M2, -1);
  const plate = (x, y, dir) => { const a = -dir * 1.134; return { a, n: [Math.sin(a), -Math.cos(a)], hit: [x, y] }; };   // fixed end plates lean 25 deg toward the marble
  const PLATE1 = plate(END1, y1(END1), 1), PLATE2 = plate(END2, y2(END2), -1);
  const slot = (j) => [PIN[0] - FEED[0] * j * 2 * R, PIN[1] - FEED[1] * j * 2 * R];   // queue places up the feed chute
  const heap = (k) => {                                           // places inside the hopper, bottom to top, in rows of four
    if (k <= 0) return [...slot(3), Z0];
    const r = Math.floor((k - 1) / 4), c = (k - 1) % 4, cc = r % 2 ? 3 - c : c;
    return [-4.76 - cc * 0.3, 6.6 + 0.34 * r, Z0 + (cc % 2 ? 0.24 : -0.24) * (r % 2 ? -1 : 1)];
  };
  const mkPath = (pts) => {
    const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const at = (s) => { let i = 1; while (i < pts.length - 1 && cum[i] < s) i++; const a = pts[i - 1], b = pts[i], d = cum[i] - cum[i - 1], u = (s - cum[i - 1]) / d; return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, (b[0] - a[0]) / d, (b[1] - a[1]) / d]; };
    return { pts, L: cum[cum.length - 1], at };
  };
  // rail 1 starts steep at the pin and bends into the long shallow run
  const BEND = (() => {
    const s = (y1(PIN[0]) - PIN[1]) / (FEED[1] - M1 * FEED[0]), c = [PIN[0] + FEED[0] * s, PIN[1] + FEED[1] * s], k = Math.hypot(1, M1), b = [c[0] + 0.6 / k, c[1] + 0.6 * M1 / k], out = [];
    for (let i = 0; i <= 14; i++) { const u = i / 14, v = 1 - u; out.push([v * v * PIN[0] + 2 * u * v * c[0] + u * u * b[0], v * v * PIN[1] + 2 * u * v * c[1] + u * u * b[1]]); }
    return out;
  })();
  const rail1 = (xEnd) => mkPath([...BEND, [xEnd, y1(xEnd)]]), rail2 = (xEnd) => mkPath([[START2, y2(START2)], [xEnd, y2(xEnd)]]);

  // ---------------------------------------------------------------- the run, pre-computed
  // Every marble's whole trip is worked out once, in small time steps, and stored as samples; update(t) only reads
  // them. On the rails a marble is tied to its path and its speed comes from the height it has dropped. In the air it
  // falls freely and bounces off the brass plates. In the jars it is a small rigid-body pile (floor, glass wall,
  // other marbles). The same pass writes the event list (clacks, landings, glass hits) that the sound is scored from.
  const DUR = 8, H = 1 / 960, SR = 240, S0 = -0.25;
  let memo = null;
  function schedule(K) {
    if (memo) return memo;
    const rng = K.rng(21), n = ORDER.length, bin = [...ORDER].map(Number), T = bin.map((_, i) => T_HERO + (i - HERO) * EVERY);
    const R1a = rail1(GAP1[0]), R1b = rail1(END1), R2a = rail2(GAP2[0]), R2b = rail2(END2);
    const NS = Math.ceil((DUR + 0.3 - S0) * SR) + 2, data = new Float32Array(n * NS * 7), ev = [], g1 = [], g2 = [], ins = BINS.map(() => []);
    const qmul = (a, b) => [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0], a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];
    const M = bin.map((b, i) => {
      const a = rng.range(0, 6.28), c = rng.range(-1, 1), s = Math.sqrt(1 - c * c), h = rng.range(0, 3.14);
      return { i, bin: b, mode: 'wait', x: 0, y: 0, z: Z0, vx: 0, vy: 0, vz: 0, w: [0, 0, 0], q0: [Math.cos(a) * s * Math.sin(h), Math.sin(a) * s * Math.sin(h), c * Math.sin(h), Math.cos(h)], q: [0, 0, 0, 1], path: null, s: 0, v: 0, gate: null, struck: false, jar: -1, asleep: false, calm: 0, last: -9, touch: false };
    });
    const hit = (m, k, g, t) => { if (g > 1.1 && t - m.last > 0.045) { ev.push({ t, k, x: m.x, g, i: m.i }); m.last = t; } };
    const bounce = (m, nrm, e) => { const vn = m.vx * nrm[0] + m.vy * nrm[1]; m.vx -= (1 + e) * vn * nrm[0]; m.vy -= (1 + e) * vn * nrm[1]; return -vn; };
    const toJar = (m, j) => { m.mode = 'jar'; m.jar = j; m.vz = rng.range(-0.3, 0.3); m.vx += rng.range(-0.12, 0.12); };
    const aFeed = KROLL * G * -FEED[1], tFeed = Math.sqrt(4 * R / aFeed);      // the queue rolls one place forward in tFeed seconds
    const TS = S0 - Math.ceil((S0 - T[0] + 0.4) * SR) / SR;      // start before the first release, on the sample grid
    let next = 0, ns = 0;
    for (let step = 0; ; step++) {
      const t = TS + step * H;
      if (t > DUR + 0.3) break;
      while (next < n && T[next] <= t) { const m = M[next++]; m.mode = 'rail'; m.path = m.bin === 2 ? R1b : R1a; m.s = 0; m.v = 0; ev.push({ t, k: 'release', x: PIN[0], g: 1, i: m.i }); if (next < n) ev.push({ t: t + 0.07 + tFeed, k: 'queue', x: PIN[0], g: 1 }); }
      for (const m of M) {
        m.touch = false;
        if (m.mode === 'wait') {
          // place in the queue, as a fraction while the line rolls forward (it starts a beat after the release, like a real escapement)
          let f = m.i - next;
          if (next > 0) { const u = (t - T[next - 1] - 0.07) / tFeed; f += 1 - K.clamp(u, 0, 1) ** 2; }
          let p;
          if (f <= 3) p = [...slot(f), Z0];
          else { const k = f - 3, k0 = Math.floor(k), a = heap(k0), b = heap(k0 + 1), u = K.smooth(0, 1, k - k0); p = [K.lerp(a[0], b[0], u), K.lerp(a[1], b[1], u), K.lerp(a[2], b[2], u)]; }
          m.x = p[0]; m.y = p[1]; m.z = p[2];
          const th = (m.i - f) * 2 * R / ROLL; m.q = qmul([0, 0, -Math.sin(th / 2), Math.cos(th / 2)], m.q0);
          continue;
        }
        if (m.mode === 'rail') {
          const [, , tx, ty] = m.path.at(m.s);
          m.v += -KROLL * G * ty * H; m.s += m.v * H;
          const p = m.path.at(Math.min(m.s, m.path.L));
          const xo = m.x; m.x = p[0]; m.y = p[1]; m.vx = m.v * p[2]; m.vy = m.v * p[3]; m.w = [0, 0, -m.v * Math.sign(p[2]) / ROLL];
          if (m.path === R1b && xo < GAP1[0] && m.x >= GAP1[0]) g1.push({ t, open: false, i: m.i });
          if (m.path === R2b && xo > GAP2[0] && m.x <= GAP2[0]) g2.push({ t, open: false, i: m.i });
          if (m.s >= m.path.L) {
            if (m.path === R1a) { m.mode = 'air'; m.gate = GATE1; m.struck = false; g1.push({ t, open: true, i: m.i }); }
            else if (m.path === R2a) { m.mode = 'air'; m.gate = GATE2; m.struck = false; g2.push({ t, open: true, i: m.i }); }
            else { const P = m.path === R1b ? PLATE1 : PLATE2; const g = bounce(m, P.n, 0.3); m.w[2] *= 0.3; ev.push({ t, k: 'plate', x: m.x, g, i: m.i }); toJar(m, m.path === R1b ? 2 : 0); }
          }
        } else if (m.mode === 'air') {
          m.vy -= G * H; m.x += m.vx * H; m.y += m.vy * H;
          const g = m.gate, dx = m.x - g.pivot[0], dy = m.y - g.pivot[1];
          if (!m.struck && dx * g.n[0] + dy * g.n[1] <= R + PT / 2 && m.vx * g.n[0] + m.vy * g.n[1] < 0) {
            const s = bounce(m, g.n, 0.3); m.struck = true; m.w[2] *= 0.3; ev.push({ t, k: 'paddle', x: m.x, g: s, gate: g === GATE1 ? 1 : 2, i: m.i });
            if (g === GATE2) toJar(m, 1);
          } else if (m.struck && m.vy < 0 && m.y <= y2(m.x)) {
            m.mode = 'rail'; m.path = m.bin === 1 ? R2a : R2b; m.s = (START2 - m.x) * Math.hypot(1, M2); m.y = y2(m.x);
            const [, , tx, ty] = m.path.at(m.s); ev.push({ t, k: 'land', x: m.x, g: -m.vy, i: m.i }); m.v = Math.max(0.5, m.vx * tx + m.vy * ty);
          }
        } else if (!m.asleep) {
          m.vy -= G * H; m.x += m.vx * H; m.y += m.vy * H; m.z += m.vz * H;
        }
        const wl = Math.hypot(m.w[0], m.w[1], m.w[2]);
        if (wl > 1e-6) { const a = wl * H / 2, s = Math.sin(a) / wl; m.q = qmul([m.w[0] * s, m.w[1] * s, m.w[2] * s, Math.cos(a)], m.q); }
      }
      // the jars: floor, glass wall and marble against marble
      for (let it = 0; it < 2; it++) {
        for (const m of M) {
          if (m.mode !== 'jar' || m.asleep) continue;
          const jx = JARX[m.jar];
          if (m.y < JAR.rim) {
            if (!m.inside) { m.inside = true; ins[m.jar].push(t); }             // it has dropped through the neck: the counter under the jar ticks
            const lim = K.lerp(JAR.rin, JAR.rneck, K.clamp((m.y - JAR.sh0) / (JAR.sh1 - JAR.sh0))) - R, dx = m.x - jx, dz = m.z - Z0, d = Math.hypot(dx, dz);
            if (d > lim) { const nx = dx / d, nz = dz / d, vn = m.vx * nx + m.vz * nz; m.x = jx + nx * lim; m.z = Z0 + nz * lim; m.touch = true; if (vn > 0) { const e = vn > 0.8 ? 0.35 : 0; m.vx -= (1 + e) * vn * nx; m.vz -= (1 + e) * vn * nz; hit(m, 'glass', vn, t); } }
          }
          if (m.y < JAR.floor + R) { m.y = JAR.floor + R; m.touch = true; if (m.vy < 0) { const vn = -m.vy; m.vy = vn > 0.8 ? 0.36 * vn : 0; hit(m, 'glass', vn, t); } }
        }
        for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
          const p = M[a], q = M[b];
          if (p.mode !== 'jar' || q.mode !== 'jar' || p.jar !== q.jar || (p.asleep && q.asleep)) continue;
          const dx = p.x - q.x, dy = p.y - q.y, dz = p.z - q.z, d2 = dx * dx + dy * dy + dz * dz;
          if (d2 >= 4 * R * R || d2 < 1e-9) continue;
          const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, nz = dz / d, vn = (p.vx - q.vx) * nx + (p.vy - q.vy) * ny + (p.vz - q.vz) * nz;
          if (vn < -1.4) { p.asleep = q.asleep = false; p.calm = q.calm = 0; }          // a real knock wakes a resting marble
          const wp = p.asleep ? 0 : 1, wq = q.asleep ? 0 : 1, ws = wp + wq, o = (2 * R - d) / ws;
          p.x += nx * o * wp; p.y += ny * o * wp; p.z += nz * o * wp; q.x -= nx * o * wq; q.y -= ny * o * wq; q.z -= nz * o * wq; p.touch = q.touch = true;
          if (vn < 0) { const e = vn < -0.8 ? 0.3 : 0, j = -(1 + e) * vn / ws; p.vx += j * nx * wp; p.vy += j * ny * wp; p.vz += j * nz * wp; q.vx -= j * nx * wq; q.vy -= j * ny * wq; q.vz -= j * nz * wq; hit(p, 'clink', -vn, t); }
        }
      }
      for (const m of M) {
        if (m.mode !== 'jar' || m.asleep) continue;
        if (m.touch) {                                                               // rolling resistance, spin follows the roll, then rest
          const k = 1 - 2.2 * H; m.vx *= k; m.vy *= k; m.vz *= k;
          const b = Math.min(1, 25 * H); m.w[0] += (m.vz / R - m.w[0]) * b; m.w[1] *= 1 - b; m.w[2] += (-m.vx / R - m.w[2]) * b;
          m.calm = Math.hypot(m.vx, m.vy, m.vz) < 0.22 ? m.calm + H : 0;
          if (m.calm > 0.2) { m.asleep = true; m.vx = m.vy = m.vz = 0; m.w = [0, 0, 0]; }
        } else m.calm = 0;
      }
      if (step % (1 / H / SR) === 0 && t >= S0 - 1e-9 && ns < NS) { for (const m of M) data.set([m.x, m.y, m.z, m.q[0], m.q[1], m.q[2], m.q[3]], (m.i * NS + ns) * 7); ns++; }
    }
    // read one marble at time t: position into p[0..2], rotation into q[0..3]
    const pose = (i, t, p, q) => {
      const f = K.clamp((t - S0) * SR, 0, ns - 1.001), k = Math.floor(f), u = f - k, o = (i * NS + k) * 7;
      for (let c = 0; c < 3; c++) p[c] = data[o + c] + (data[o + 7 + c] - data[o + c]) * u;
      if (q) { const dot = data[o + 3] * data[o + 10] + data[o + 4] * data[o + 11] + data[o + 5] * data[o + 12] + data[o + 6] * data[o + 13], s = dot < 0 ? -1 : 1; for (let c = 0; c < 4; c++) q[c] = data[o + 3 + c] + (s * data[o + 10 + c] - data[o + 3 + c]) * u; }
      return p;
    };
    // a paddle as a function of time: 0 = flat (bridge), 1 = up (wall). It turns just before the marble that needs it,
    // overshoots and settles like sprung brass, and shudders when a marble strikes it.
    const paddle = (arr, kicks) => {
      const sw = []; let s = arr[0].open ? 1 : 0; const init = s;
      for (let i = 1; i < arr.length; i++) { const w = arr[i].open ? 1 : 0; if (w !== s) { sw.push([Math.max(arr[i].t - 0.17, arr[i - 1].t + (s ? 0.08 : 0.15)), w - s]); s = w; } }
      const f = (t) => { let u = init, k = 0; for (const [ts, d] of sw) if (t > ts) u += d * K.spring(t - ts, 8, 0.5); for (const tk of kicks) { const a = t - tk; if (a > 0 && a < 0.5) k += Math.exp(-a * 12) * Math.sin(a * 62); } return u + 0.07 * k; };
      f.switches = sw; return f;
    };
    const kicks = (gt) => ev.filter((e) => e.k === 'paddle' && e.gate === gt).map((e) => e.t);
    memo = { n, bin, T, pose, ev, ins, g2, gate1: paddle(g1, kicks(1)), gate2: paddle(g2, kicks(2)) };
    return memo;
  }

  registerStyle({
    id: 'marble-run',
    name: 'Marble Run',
    family: 'Machines that explain',
    look: 'A handmade wooden marble run shot like a product film: a walnut board carrying pale maple rails on brass pins, brass paddle gates, swirled glass marbles and three glass jars on a maple plinth with the labels burnt into the wood, in front of a shaded seamless backdrop.',
    motion: 'Marbles are let go one at a time, pick up speed as they drop, clack against brass gates that flip to sort them, fall into their jar and settle into a pile. Nothing is eased by hand: speed comes from the height each marble has lost, and the piles are a small physics run.',
    light: 'Warm daylight from the upper left, kept off the backdrop so the wall sits in soft shade behind the sunlit wood. Rails and marbles throw soft shadows onto the board, and every marble drops a small glint of its own colour into its shadow.',
    materials: 'Satin maple and walnut with drawn grain, polished brass that picks up the window, coloured glass with a white vein that glows on the side away from the light, thick clear jar glass with bright edges.',
    camera: 'Long lens, shallow focus, one continuous shot that stays close. It rides beside one marble from the hopper, gets to the first gate just ahead of it and waits for the clack, follows it across the second gate, then travels down as it drops into its jar, opens just far enough to hold all three jars and pushes slowly in on the jars, their counters and their names.',
    post: 'Real motion blur and depth of field, colours kept true (neutral tone curve), a small bloom on brass and glass glints, light vignette, fine grain.',
    explains: 'Sorting, routing and filtering: anything where many items take different paths through the same rules. The hopper is what comes in, each gate is one rule, each jar is one outcome with a counter under it, and how full the jars end up is the result.',
    topic: 'How your inbox sorts email',
    duration: DUR,
    fonts: ['500 150px "Oswald"', '700 100px "Oswald"'],
    render: { samples: 48, shutter: 0.5, tone: 'neutral', exposure: 1.0, bloom: 0.3, bloomThreshold: 1.25, vignette: 0.3, grain: 0.02, fov: 28, background: '#6f8a8e', contrast: 1.04 },

    build(S) {
      const { THREE, K, scene, camera } = S;
      const run = schedule(K);
      const SUN = [-6, 10, 14], AIM = [0, 3.2, 0];

      // ---- light: one warm window, a cool sky, and a bright environment for the brass and glass to reflect
      K.env(S, { top: '#dfe8f2', horizon: '#efe6d8', bottom: '#8d7a66', intensity: 0.6, panels: [
        { pos: [-11, 10, 9], size: [9, 9], color: '#fff2dc', power: 7 },
        { pos: [12, 5, 7], size: [3, 10], color: '#dbe8ff', power: 2.2 },
        { pos: [0, 14, 2], size: [14, 5], color: '#ffffff', power: 2.5 },
      ] });
      K.sun(S, { pos: SUN, target: AIM, color: '#ffe6c0', power: 3.9, size: 20, soft: 0.8, mapSize: 4096, normalBias: 0.01, bias: -0.0003 });
      K.skyLight(S, { color: '#dfe9ff', power: 0.6, size: 9, center: AIM, mapSize: 2048, normalBias: 0.012 });
      // a flag: an unseen panel just behind the machine keeps the sun off the backdrop, so the wall falls into soft
      // shade and the sunlit maple stands out against it (it draws nothing, it only casts a shadow)
      { const flag = new THREE.Mesh(new THREE.PlaneGeometry(160, 60), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide })); flag.position.set(0, 28.5, -1.2); flag.castShadow = true; scene.add(flag); }

      // ---- materials
      const wood = (w, h, seed, base, lines, dk = '125,82,36', lt = '255,244,220', sheen = 1) => K.canvasTex(w, h, (ctx) => {
        const r = K.rng(seed); ctx.fillStyle = base; ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 46; i++) { ctx.fillStyle = r.chance(0.5) ? `rgba(${dk},${r.range(0.03, 0.1)})` : `rgba(${lt},${r.range(0.04, 0.1)})`; ctx.fillRect(0, r.range(-20, h), w, r.range(h * 0.01, h * 0.09)); }   // broad bands of tone
        for (let i = 0; i < lines; i++) {                                                                                    // fine grain lines, a little wavy, tileable along x
          const y0 = r.range(0, h), amp = r.range(0, 7), ph = r.range(0, 6.28), fr = r.int(1, 3);
          ctx.strokeStyle = `rgba(${dk},${r.range(0.02, 0.13) * r()})`; ctx.lineWidth = r.range(0.5, 2.6); ctx.beginPath();
          for (let x = 0; x <= w; x += 24) { const y = y0 + Math.sin(x / w * 6.283 * fr + ph) * amp; if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
          ctx.stroke();
        }
        for (let i = 0; i < lines * 3; i++) { ctx.fillStyle = `rgba(${dk},${r.range(0.05, 0.18)})`; ctx.fillRect(r.range(0, w), r.range(0, h), r.range(4, 26), 1); }   // pores
        for (let i = 0; i < 26; i++) { const x = r.range(0, w), g = ctx.createLinearGradient(x, 0, x + r.range(20, 70), 0); g.addColorStop(0, `rgba(${lt},0)`); g.addColorStop(0.5, `rgba(${lt},${r.range(0.03, 0.08) * sheen})`); g.addColorStop(1, `rgba(${lt},0)`); ctx.fillStyle = g; ctx.fillRect(x, 0, 70, h); }   // the cross-grain shimmer of maple
      });
      const boardTex = wood(2048, 1400, 3, '#80563a', 300, '40,21,9', '200,150,104', 0.35);
      const railTex = wood(1024, 256, 8, '#e8cc9c', 150); railTex.wrapS = railTex.wrapT = THREE.RepeatWrapping;
      const maple = (rx, ry) => { const t = railTex.clone(); t.needsUpdate = true; t.repeat.set(rx, ry); return new THREE.MeshStandardMaterial({ map: t, roughness: 0.52, bumpMap: t, bumpScale: 0.35 }); };
      const boardMat = new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.56 });
      const brass = new THREE.MeshStandardMaterial({ color: '#d6ad58', metalness: 1, roughness: 0.27 });
      const add = (geo, mat, x, y, z, o = {}) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); if (o.rot) m.rotation.set(...o.rot); m.castShadow = o.cast !== false; m.receiveShadow = o.receive !== false; (o.parent || scene).add(m); return m; };

      // ---- the seamless backdrop: floor, a wide curve, wall
      const YF = -1.45;
      {
        const g = new THREE.PlaneGeometry(140, 1, 1, 80), p = g.attributes.position, L1 = 34, L2 = Math.PI * 1.75, L3 = 30, LT = L1 + L2 + L3;
        for (let i = 0; i < p.count; i++) {
          const s = (0.5 - p.getY(i)) * LT; let y, z;
          if (s < L1) { y = YF; z = 30 - s; } else if (s < L1 + L2) { const a = (s - L1) / 3.5; y = YF + 3.5 - 3.5 * Math.cos(a); z = -4 - 3.5 * Math.sin(a); } else { y = YF + 3.5 + (s - L1 - L2); z = -7.5; }
          p.setXYZ(i, p.getX(i), y, z);
        }
        g.computeVertexNormals();
        add(g, new THREE.MeshStandardMaterial({ color: '#7d9a9d', roughness: 0.94, side: THREE.DoubleSide }), 0, 0, 0, { cast: false });
      }

      // ---- plinth, back board and the engraved jar labels
      add(K.roundedBox(12.9, 1.45, 2.25, 0.07, 4), maple(4, 1), 0, -0.725, 0.425);
      add(K.roundedBox(12.1, 7.3, 0.3, 0.05, 3), boardMat, 0, 3.65, -0.15);
      // under each jar: a two-wheel counter in a brass bezel, and the jar's name burnt into the wood below it
      const digits = (idle) => K.canvasTex(160, 2560, (ctx) => {        // one wheel: ten numerals top to bottom (the tens wheel shows its 0 dimmed)
        ctx.fillStyle = '#17110c'; ctx.fillRect(0, 0, 160, 2560); ctx.fillStyle = '#f4ead6'; ctx.font = '700 100px "Oswald"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.save(); ctx.scale(1.9, 1.9); for (let i = 0; i < 10; i++) { ctx.fillStyle = i || !idle ? '#f4ead6' : '#5d5246'; ctx.fillText(i, 80 / 1.9, (i * 256 + 136) / 1.9); } ctx.restore();
      });
      const tensTex = digits(true), onesTex = digits(false), shadeTex = K.canvasTex(8, 128, (ctx) => { const g = ctx.createLinearGradient(0, 0, 0, 128); g.addColorStop(0, 'rgba(0,0,0,0.75)'); g.addColorStop(0.3, 'rgba(0,0,0,0)'); g.addColorStop(0.7, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.75)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 8, 128); });
      const wheels = BINS.map((b, j) => {
        const l = K.textPlane(b.label, { font: '500 150px "Oswald"', height: 0.4, color: '#3b2614', lit: true, letterSpacing: 16, roughness: 0.7 });
        l.position.set(JARX[j] + 0.03, -1.08, 1.553); l.receiveShadow = true; scene.add(l);
        add(K.roundedBox(1.02, 0.78, 0.07, 0.03, 3), brass, JARX[j], -0.45, 1.565);
        const pair = [tensTex, onesTex].map((src, k) => {
          const t = src.clone(); t.needsUpdate = true; t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 0.1);
          add(new THREE.PlaneGeometry(0.4, 0.62), new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 }), JARX[j] + (k - 0.5) * 0.41, -0.45, 1.603, { cast: false });
          return t;
        });
        add(new THREE.PlaneGeometry(0.82, 0.62), new THREE.MeshBasicMaterial({ map: shadeTex, transparent: true, depthWrite: false }), JARX[j], -0.45, 1.605, { cast: false, receive: false });   // the wheels curve away at top and bottom
        return pair;
      });
      for (const [x, y] of [[-5.78, 0.32], [5.78, 0.32], [-5.78, 7.07], [5.78, 7.07]]) {       // brass screws in the corners of the board
        add(new THREE.CylinderGeometry(0.075, 0.085, 0.035, 20), brass, x, y, 0.017, { rot: [Math.PI / 2, 0, 0] });
        add(new THREE.BoxGeometry(0.11, 0.016, 0.01), new THREE.MeshStandardMaterial({ color: '#3a2a10', roughness: 0.6 }), x, y, 0.036, { rot: [0, 0, 0.6 + x + y], cast: false });
      }

      // ---- rails: two maple dowels per run, brass ferrules on the ends, brass pins from the board to carry them
      const pins = [];
      const rails = (pts) => {                                    // pts: the marble's centre line; the dowels sit RIDE below it
        const line = pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], k = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / k * Math.sign(b[0] - a[0]), ny = Math.abs(b[0] - a[0]) / k; return [p[0] - nx * RIDE, p[1] - ny * RIDE]; });
        let len = 0; for (let i = 1; i < line.length; i++) len += Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]);
        const mat = maple(len / 1.6, 1);
        for (const dz of [-GAUGE / 2, GAUGE / 2]) {
          add(K.tube(line.map((p) => [p[0], p[1], Z0 + dz]), ROD, { segments: Math.ceil(len * 14), radial: 12 }), mat, 0, 0, 0);
          for (const e of [0, line.length - 1]) { const p = line[e], q = line[e ? e - 1 : 1]; add(new THREE.CylinderGeometry(ROD + 0.009, ROD + 0.009, 0.1, 16), brass, p[0], p[1], Z0 + dz, { rot: [0, 0, Math.atan2(q[1] - p[1], q[0] - p[0]) + Math.PI / 2] }); }
        }
        return line;
      };
      const straight = (x0, x1, yf, step = 0.9) => { const out = [], k = Math.max(1, Math.round(Math.abs(x1 - x0) / step)); for (let i = 0; i <= k; i++) { const x = x0 + (x1 - x0) * i / k; out.push([x, yf(x)]); } return out; };
      const lineY = (line, x) => { for (let i = 1; i < line.length; i++) { const a = line[i - 1], b = line[i]; if ((x - a[0]) * (x - b[0]) <= 0) return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } return line[0][1]; };
      const railA = rails([slot(3.3), slot(2), slot(1), ...BEND.filter((_, i) => i % 2 === 0), ...straight(BEND[14][0] + 0.5, GAP1[0] - 0.03, y1)]);
      // the last rails stop a good marble radius short of their end plates, so a marble that is turned down by the plate drops past the rail ends, not through them
      const railA2 = rails(straight(GAP1[1] + 0.03, END1 - 0.3, y1));
      const railB = rails(straight(START2 + 0.14, GAP2[0] + 0.03, y2));
      const railB2 = rails(straight(GAP2[1] - 0.03, END2 + 0.3, y2));
      for (const x of [-3.72, -2.6, -1.4, -0.2, 1.0, 1.98]) pins.push([x, lineY(railA, x)]);
      pins.push([3.32, lineY(railA2, 3.32)]);
      for (const x of [2.95, 1.55, 0.2]) pins.push([x, lineY(railB, x)]);
      for (const x of [-1.2, -2.4, -3.3]) pins.push([x, lineY(railB2, x)]);
      {
        const PLn = Z0 + GAUGE / 2 + 0.11;
        const rod = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03, 0.03, PLn, 12).rotateX(Math.PI / 2), brass, pins.length);
        const cap = new THREE.InstancedMesh(new THREE.SphereGeometry(0.044, 16, 12), brass, pins.length);
        const foot = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.07, 0.085, 0.03, 20).rotateX(Math.PI / 2), brass, pins.length);
        pins.forEach(([x, y], i) => { const yy = y - ROD - 0.03; K.place(rod, i, [x, yy, PLn / 2]); K.place(cap, i, [x, yy, PLn]); K.place(foot, i, [x, yy, 0.015]); });
        for (const m of [rod, cap, foot]) { m.castShadow = m.receiveShadow = true; scene.add(m); }
      }

      // ---- gates: a brass paddle on an axle with a knob in front; and the two fixed plates at the ends of the rails
      const plateGeo = K.roundedBox(PL, PT, 0.54, 0.02, 3), dark = new THREE.MeshStandardMaterial({ color: '#2b1d0b', roughness: 0.6 });
      const mkGate = (g) => {
        const grp = new THREE.Group(); grp.position.set(g.pivot[0], g.pivot[1], Z0); scene.add(grp);
        add(plateGeo, brass, 0, 0, 0, { parent: grp });
        add(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16), brass, 0, 0, 0, { rot: [Math.PI / 2, 0, 0], parent: grp });
        add(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 32), brass, 0, 0, 0.42, { rot: [Math.PI / 2, 0, 0], parent: grp });
        add(new THREE.BoxGeometry(0.24, 0.036, 0.012), dark, 0, 0, 0.462, { parent: grp, cast: false });
        add(new THREE.CylinderGeometry(0.032, 0.032, Z0 + 0.4, 12), brass, g.pivot[0], g.pivot[1], (Z0 + 0.4) / 2, { rot: [Math.PI / 2, 0, 0] });
        add(new THREE.CylinderGeometry(0.09, 0.105, 0.035, 24), brass, g.pivot[0], g.pivot[1], 0.017, { rot: [Math.PI / 2, 0, 0] });
        return grp;
      };
      const gate1 = mkGate(GATE1), gate2 = mkGate(GATE2);
      for (const P of [PLATE1, PLATE2]) {
        const d = [Math.cos(P.a), Math.sin(P.a)], dn = -0.14 * Math.sign(d[1]), c = [P.hit[0] - P.n[0] * (R + PT / 2) + d[0] * dn, P.hit[1] - P.n[1] * (R + PT / 2) + d[1] * dn];   // the marble strikes the upper half
        add(K.roundedBox(0.78, PT, 0.54, 0.02, 3), brass, c[0], c[1], Z0, { rot: [0, 0, P.a] });
        for (const k of [-0.24, 0.24]) { const x = c[0] + d[0] * k - P.n[0] * 0.05, y = c[1] + d[1] * k - P.n[1] * 0.05; add(new THREE.CylinderGeometry(0.03, 0.03, Z0 + 0.2, 12), brass, x, y, (Z0 + 0.2) / 2, { rot: [Math.PI / 2, 0, 0] }); add(new THREE.CylinderGeometry(0.07, 0.085, 0.03, 20), brass, x, y, 0.015, { rot: [Math.PI / 2, 0, 0] }); }
      }
      // the escapement: a brass finger that holds the front marble and dips to let one go
      const NF = [-FEED[1], FEED[0]], fingerAt = [PIN[0] + FEED[0] * (R + 0.035) - NF[0] * 0.38, PIN[1] + FEED[1] * (R + 0.035) - NF[1] * 0.38];
      const finger = new THREE.Group(); finger.position.set(fingerAt[0], fingerAt[1], Z0); scene.add(finger);
      add(K.roundedBox(0.05, 0.56, 0.1, 0.02, 3).translate(0, 0.26, 0), brass, 0, 0, 0, { parent: finger });
      add(new THREE.CylinderGeometry(0.045, 0.045, 0.3, 14), brass, 0, 0, 0, { rot: [Math.PI / 2, 0, 0], parent: finger });
      add(new THREE.CylinderGeometry(0.03, 0.03, Z0 + 0.15, 12), brass, fingerAt[0], fingerAt[1], (Z0 + 0.15) / 2, { rot: [Math.PI / 2, 0, 0] });
      const fingerRest = Math.atan2(NF[1], NF[0]) - Math.PI / 2;

      // ---- engraved brass plates
      const plaque = (text, w, h, x, y, z) => {
        const tex = K.canvasTex(1024, Math.round(1024 * h / w), (ctx, W, Hh) => {
          const g = ctx.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, '#e6c06c'); g.addColorStop(1, '#cfa24c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
          const r = K.rng(text.length * 7 + 1); for (let i = 0; i < 500; i++) { ctx.fillStyle = r.chance(0.5) ? `rgba(255,244,205,${r.range(0.03, 0.09)})` : `rgba(120,80,20,${r.range(0.03, 0.08)})`; ctx.fillRect(r.range(-200, W), r.range(0, Hh), r.range(80, 500), 1.5); }   // brushed
          ctx.strokeStyle = 'rgba(70,44,10,0.55)'; ctx.lineWidth = 6; ctx.strokeRect(26, 26, W - 52, Hh - 52);
          ctx.fillStyle = '#2a1a08'; ctx.font = `700 ${Math.round(Hh * 0.56)}px "Oswald"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = Math.round(Hh * 0.05) + 'px';
          ctx.fillText(text, W / 2 + Hh * 0.025, Hh * 0.535);
        });
        const face = new THREE.MeshStandardMaterial({ map: tex, metalness: 0.75, roughness: 0.42 });
        return add(K.roundedBox(w, h, 0.045, 0.012, 2), [brass, brass, brass, brass, face, brass], x, y, z);
      };
      plaque(SOURCE, 1.0, 0.34, -5.21, 6.3, 1.31);
      plaque(GATE_TAGS[0], 1.0, 0.36, GATE1.pivot[0] + 0.02, GATE1.pivot[1] + 0.88, 0.022);
      plaque(GATE_TAGS[1], 1.06, 0.36, GATE2.pivot[0] - 0.02, GATE2.pivot[1] + 0.88, 0.022);

      // ---- the hopper: a maple box; marbles leave through a doorway low on its right side
      add(K.roundedBox(1.38, 1.32, 1.3, 0.05, 4), maple(0.7, 2), -5.21, 6.26, 0.65);
      add(K.roundedRect(0.6, 0.68, 0.27), new THREE.MeshBasicMaterial({ color: '#150d06' }), -4.518, 6.03, Z0, { rot: [0, Math.PI / 2, 0], cast: false, receive: false });

      // ---- jars: lathe-turned glass. three.js glass cannot show glass through glass, so the jars are a clear
      // reflective shell whose opacity follows the viewing angle (bright edges, clear middle) and the marbles are true glass.
      const jarMat = new THREE.MeshPhysicalMaterial({ color: '#e9f4ee', roughness: 0.14, metalness: 0, transparent: true, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.5 });
      jarMat.onBeforeCompile = (sh) => {
        sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `
          float gEdge = pow(1.0 - saturate(abs(dot(normalize(vViewPosition), normal))), 3.0);
          float gSpec = max(max(totalSpecular.r, totalSpecular.g), totalSpecular.b);
          gl_FragColor = vec4(outgoingLight, clamp(0.02 + 0.42 * gEdge + 0.75 * smoothstep(0.35, 1.6, gSpec), 0.0, 0.95));`);
      };
      const jarGeo = new THREE.LatheGeometry([[0, 0], [0.56, 0], [0.63, 0.02], [0.65, 0.08], [0.65, 1.38], [0.63, 1.54], [0.56, 1.67], [0.52, 1.73], [0.52, 1.84], [0.555, 1.88], [0.565, 1.92], [0.545, 1.95], [0.49, 1.95], [0.47, 1.91], [0.47, 1.76], [0.53, 1.62], [0.59, 1.48], [0.6, 1.38], [0.6, 0.2], [0.56, 0.12], [0.45, 0.1], [0, 0.1]].map((p) => new THREE.Vector2(p[0], p[1])), 72);
      const ghost = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });      // draws nothing, but still casts a shadow
      JARX.forEach((x) => {
        const j = add(jarGeo, jarMat, x, 0, Z0, { cast: false, receive: false }); j.renderOrder = 5;
        add(new THREE.CylinderGeometry(0.63, 0.63, 0.1, 40), ghost, x, 0.05, Z0, { receive: false });
      });

      // ---- marbles: coloured glass with an opaque vein around them, so you can see them roll
      const sunDir = new THREE.Vector3(SUN[0] - AIM[0], SUN[1] - AIM[1], SUN[2] - AIM[2]).normalize();
      const vein = K.canvasTex(512, 256, (ctx, w, h) => {            // white = clear glass, black = vein (used as the transmission map)
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#000'; ctx.shadowColor = '#000'; ctx.shadowBlur = 5;
        const band = (amp, amp2, ph, wide) => {                      // a ribbon that wanders round the ball and swells and thins
          const top = [], bot = [];
          for (let i = 0; i <= 96; i++) { const a = i / 96 * 6.2832, y = h * (0.5 + amp * Math.sin(2 * a + ph) + amp2 * Math.sin(3 * a + ph * 2)), hw = wide * (0.2 + 0.8 * (0.5 + 0.5 * Math.sin(a + ph)) ** 2); top.push([i / 96 * w, y - hw]); bot.push([i / 96 * w, y + hw]); }
          ctx.beginPath(); top.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); bot.reverse().forEach(([x, y]) => ctx.lineTo(x, y)); ctx.closePath(); ctx.fill();
        };
        band(0.2, 0.07, 0.4, 12); band(0.13, 0.06, 2.6, 4.5);
      }, { data: true });
      const white = new THREE.Color('#ffffff');
      const mkGlass = (hex) => {
        const c = new THREE.Color(hex), deep = new THREE.Color(c.r * c.r, c.g * c.g, c.b * c.b);
        const m = new THREE.MeshPhysicalMaterial({ color: white.clone().lerp(c, 0.3), roughness: 0.04, metalness: 0, transmission: 1, transmissionMap: vein, thickness: 0.3, ior: 1.5, attenuationColor: c, attenuationDistance: 0.3, envMapIntensity: 1.3 });
        // Light gathers on the far side of a glass ball: add that glow in a deeper shade of the marble's colour. The
        // sun's own highlight is dropped (a soft light on a mirror-smooth ball renders as dots); the window in the
        // environment gives the glint instead.
        m.onBeforeCompile = (sh) => {
          sh.uniforms.uSun = { value: sunDir }; sh.uniforms.uDeep = { value: deep };
          sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uSun, uDeep;')
            .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n{ vec3 sv = normalize((viewMatrix * vec4(uSun, 0.0)).xyz); float far = max(dot(normal, -sv), 0.0); totalEmissiveRadiance += uDeep * (0.16 + 2.0 * far * far * far); }')
            .replace('#include <lights_fragment_end>', '#include <lights_fragment_end>\nreflectedLight.directSpecular *= 0.0;');
        };
        return m;
      };
      const ballGeo = new THREE.SphereGeometry(R, 48, 32), where = [], tints = run.bin.map((b) => new THREE.Color(BINS[b].glass)), tint = new THREE.Color();
      const balls = BINS.map((b, j) => { const m = new THREE.InstancedMesh(ballGeo, mkGlass(b.glass), run.bin.filter((x) => x === j).length); m.castShadow = m.receiveShadow = true; m.frustumCulled = false; scene.add(m); return m; });
      { const count = [0, 0, 0]; run.bin.forEach((b, i) => { where[i] = [balls[b], count[b]++]; }); }
      // the bright coloured spot a glass ball throws into the middle of its own shadow
      const spotTex = K.canvasTex(64, 64, (ctx) => { const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, '#fff'); g.addColorStop(0.4, 'rgba(255,255,255,0.5)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64); });
      const spots = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: spotTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), run.n);
      for (let i = 0; i < run.n; i++) spots.setColorAt(i, tints[i]);
      spots.frustumCulled = false; scene.add(spots);

      // ---- camera: one shot in three parts. (A) ride beside the hero and reach gate 1 just before it does; (B) follow it
      // along rail 2 and across gate 2; (C) let it run ahead into its jar while the frame opens to the three jars (never
      // wider than the board) and then pushes slowly in on jars, counters and names.
      // Each part gives [centre x, centre y, width of the frame at the track, camera offset x, y]; the parts cross-fade.
      const tG = run.ev.find((e) => e.k === 'paddle' && e.i === HERO).t, t2 = run.g2.find((e) => e.i === HERO).t, GP = [GATE1.pivot[0] - 0.2, GATE1.pivot[1] - 0.08];
      const hp = [0, 0, 0], acc = [0, 0, 0], LENS = 2 * Math.tan(14 * Math.PI / 180) * 16 / 9;       // frame width per unit of distance at fov 28
      const hero = (t, cap) => { acc[0] = acc[1] = acc[2] = 0; let ws = 0; for (let k = -6; k <= 6; k++) { const w = 7 - Math.abs(k); run.pose(HERO, Math.min(t + k * 0.04, cap), hp); acc[0] += hp[0] * w; acc[1] += hp[1] * w; acc[2] += hp[2] * w; ws += w; } return [acc[0] / ws, acc[1] / ws, acc[2] / ws]; };
      const cam = {
        lead: K.track([[0, 0.25], [1.2, 1.3, 'inOut']]),
        rise: K.track([[0, 0.45], [1.0, -0.1, 'inOut']]),
        off: K.track([[0, [1.1, 0.2, 5.5]], [tG - 0.2, [0.45, 0.3, 6.3], 'inOut']]),
        jars: K.path([[t2, [-0.7, y2(0) + 0.25, 5.6, -0.35, 0.3]], [t2 + 1.25, [-1.5, 1.35, 8.8, 0, 0.3]], [t2 + 2.4, [0, 1.85, 12.3, 0.4, 0.3]], [DUR, [0, 1.15, 10.9, 0.3, 0.25]]]),
        ap: K.track([[0, 0.05], [tG, 0.055], [t2 + 1, 0.055], [DUR, 0.035]]),
        mix: (a, b, w) => a.map((v, i) => v + (b[i] - v) * w),
      };
      const mtx = new THREE.Matrix4(), vp = new THREE.Vector3(), vq = new THREE.Quaternion(), one = new THREE.Vector3(1, 1, 1), p = [0, 0, 0], q = [0, 0, 0, 1];

      return {
        update(t) {
          for (let i = 0; i < run.n; i++) {
            run.pose(i, t, p, q); vp.set(p[0], p[1], p[2]); vq.set(q[0], q[1], q[2], q[3]).normalize();
            mtx.compose(vp, vq, one); where[i][0].setMatrixAt(where[i][1], mtx);
            const k = p[0] < -4.5 || p[1] < JAR.rim ? 0 : 0.45, d = p[2] / sunDir.z;      // (not from inside the hopper or a jar)
            K.place(spots, i, [p[0] - sunDir.x * d, p[1] - sunDir.y * d, 0.006], null, 0.28); spots.setColorAt(i, tint.copy(tints[i]).multiplyScalar(k));
          }
          for (const b of balls) b.instanceMatrix.needsUpdate = true;
          spots.instanceMatrix.needsUpdate = spots.instanceColor.needsUpdate = true;
          gate1.rotation.z = K.lerp(GATE1.a0, GATE1.a1, run.gate1(t)); gate2.rotation.z = K.lerp(GATE2.a0, GATE2.a1, run.gate2(t));
          let dip = 0; for (const T of run.T) { const a = t - T + 0.04; if (a > 0 && a < 0.6) dip += K.spring(a, 9, 0.6) - K.spring(a - 0.17, 7, 0.5); }
          finger.rotation.z = fingerRest - 1.25 * dip;

          // counters: every marble that has dropped into a jar rolls its wheel on by one
          wheels.forEach((pair, j) => {
            let v = 0; for (const ti of run.ins[j]) v += K.seg(t, ti + 0.03, ti + 0.25, K.ease.out);
            const ones = v % 10, tens = Math.floor(v / 10) + K.clamp(ones - 9);
            pair[0].offset.y = 0.9 - tens / 10; pair[1].offset.y = 0.9 - ones / 10;
          });

          // (A) the hero plus some lead room, easing to a stop on gate 1 as the hero nears it
          const h = hero(t, tG), ahead = h[0] + cam.lead(t), o = cam.off(t);
          const A = [GP[0] - 0.6 * Math.log(1 + Math.exp((GP[0] - ahead) / 0.6)), K.lerp(h[1] + cam.rise(t), GP[1], K.smooth(GP[0] - 3.2, GP[0] + 0.4, ahead)), o[2] * LENS, o[0], o[1]];
          // (B) the hero again, now rolling left, seen from a little ahead of it
          const hb = hero(t, DUR), B = [hb[0] - 0.7, hb[1] + 0.25, 5.6, -0.35, 0.3];
          const v = cam.mix(cam.mix(A, B, K.smooth(tG + 0.05, tG + 0.8, t)), cam.jars(t), K.smooth(t2 - 0.35, t2 + 0.45, t));
          K.look(camera, [v[0] + v[3], v[1] + v[4], Z0 + v[2] / LENS], [v[0], v[1], Z0]);
          K.focus(camera, [v[0], v[1], K.lerp(Z0, 1.3, K.smooth(t2 + 1, DUR, t))], cam.ap(t));
        },
      };
    },

    sound(k) {
      // wood, brass and glass only: every sound is one of the events the run wrote down, at the time it happens
      const K = globalThis.K, run = schedule(K), pan = (x) => K.clamp(x / 7, -0.8, 0.8), on = (e) => e.t >= 0 && e.t < DUR - 0.05;
      const lead = (e) => (e.i === HERO ? 1.5 : 1);                 // the marble the camera follows is mixed a little forward
      k.bed('room', 0, DUR, { gain: 0.9 });
      k.withMinor(() => {
        for (const e of run.ev.filter(on)) {
          const g = K.clamp(e.g / 8, 0.15, 1) * lead(e), p = pan(e.x);
          if (e.k === 'release') { k.play('click', e.t, { gain: 0.5, f: 2400, pan: p }); k.noise(e.t, { dur: 1.5, color: 'brown', filter: 'bandpass', f: [[0, 240], [1.5, 700]], q: 1.4, gain: 0.09 * lead(e) ** 3, a: 0.5, pan: -0.15 }); }   // let go, and the roll that rises as it speeds up
          else if (e.k === 'queue') k.play('tock', e.t, { gain: 0.35, f: 1500, pan: p });                              // the next marble stops against the finger
          else if (e.k === 'land') k.play('tock', e.t, { gain: 0.7 * g + 0.2, f: 520, pan: p });                       // onto the lower rail: wood
          else if (e.k === 'glass') { k.tone(e.t, { f: 2500 + (e.x * 131 + e.t * 977) % 900, dur: 0.16, gain: 0.16 * g, a: 0.001, pan: p, verb: 0.2 }); k.play('tick', e.t, { gain: 0.5 * g, f: 5200, pan: p }); k.play('thud', e.t, { gain: 0.25 * g, f: 150, pan: p }); }   // into the jar
          else if (e.k === 'clink') { k.tone(e.t, { f: 3800 + (e.t * 1733) % 1500, dur: 0.07, gain: 0.1 * g, a: 0.001, pan: p }); k.play('tick', e.t, { gain: 0.4 * g, f: 6500, pan: p }); }   // marble on marble
        }
      });
      for (const e of run.ev.filter(on)) {                         // brass rings when a marble strikes a paddle or an end plate
        if (e.k !== 'paddle' && e.k !== 'plate') continue;
        const g = K.clamp(e.g / 7, 0.3, 1) * lead(e), p = pan(e.x), f = e.k === 'paddle' ? 1650 : 1320;
        k.play('tock', e.t, { gain: 0.8 * g, f: 1100, pan: p });
        k.tone(e.t, { f, dur: 0.35, gain: 0.07 * g, a: 0.001, pan: p, verb: 0.3 }); k.tone(e.t, { f: f * 2.41, dur: 0.18, gain: 0.035 * g, a: 0.001, pan: p, verb: 0.3 });
      }
      k.withMinor(() => run.ins.forEach((list, j) => list.forEach((ti) => { if (ti > 0 && ti < DUR - 0.1) k.play('tick', ti + 0.06, { gain: 0.35, f: 2100, pan: pan(JARX[j]) }); })));   // a counter wheel rolling on
      for (const [f, x] of [[run.gate1, GATE1.pivot[0]], [run.gate2, GATE2.pivot[0]]]) for (const [ts] of f.switches) if (ts > 0 && ts < DUR) { k.play('click', ts + 0.03, { gain: 0.55, f: 1700, pan: pan(x) }); k.play('tick', ts + 0.03, { gain: 0.3, f: 3000, pan: pan(x) }); }   // a paddle flipping
    },
  });
}
```
