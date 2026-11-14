I want a short 3D motion graphic made with three.js in the "Spotlight Stage" style. Below is the complete source of a reference animation in this exact style, plus the small rendering kit and sound kit it runs on. Use them as your style guide and rebuild the animation around my content.

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
- A 1080x1920 (vertical 9:16) canvas scaled to fit the window, with a small control bar: play/pause, a scrub slider, the time, a sound toggle, loop on by default.
- A new style object, built the same way as the reference (content block first, then build(S) returning update(t)), that tells MY CONTENT in this style. 45-60 seconds.
- A narration track at 3 words a second, and no captions (labels and lettering on the set are fine).
- Run it with the kit: const S = await K.run(canvas, style, { samples }). Use a low sample count (2-4) while playing live and the style's full count when rendering frames. Expose window.seek = (t) => S.seek(t) and window.DURATION.
- Play the style's sound(k) score in sync from the player: on play call stopSound = SOUND.live((k) => style.sound(k), currentT, { voiceover: false }), and call stopSound() on pause, on seek and when the sound toggle is turned off.
- Include the STAGE kit and the SOUND kit below unchanged.
- Load these Google Fonts before building (the kit awaits the specs in style.fonts): Oswald, Playfair Display

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
Name: Spotlight Stage
Format: Vertical 9:16 (1080x1920), 30 fps, 45-60 seconds, with a narration track at 3 words a second and no captions (labels and lettering on the set are fine). The numbers for pace, shots, places, camera moves, shot sizes, lamps and movement are in the surplus-video skill's references/specs.md and beat anything here or in reference.js (whose slow stalls camera, 16:9 frame and darker grade are superseded).
Family: Spaces and journeys
Use: story
Look: A toy theatre at night: crimson velvet, a worn timber stage and a painted world of flat card cut-outs standing in layers, with an easel card at the front for the caption. The room is dark; whatever the story is about is picked out by shafts of light cutting through haze.
Motion: It plays like a show. Scenery flats slide in from the wings, pieces are flown in from above on thin rods, actors and props are cut-outs pushed along slots in the floor with a small wobble. Scene changes happen in view and fast, a quarter to half a second each: flats part, others glide in, the easel card is pulled and the wash changes colour on the same frame. The cut-out actors travel in every shot (a hop or bob every 8-10 frames, a slight tilt), swing hinged arms and heads on pins, lean back before each big action, overshoot and settle, look before they move, swap to a shocked, proud or worried pose on the big beats, and sway gently on their rods when they wait. No lip-sync.
Light: Only stage lamps, each a real spot light with a matching visible beam: two follow spots from the house that stay on the actors, two wide front washes that set the colour of the scene, a top light that drops a shaft on the centre of the action, a small special on the easel card and a row of horizon lights behind the last flat. Light every area the camera can see (the wings, the flies and the extra places too), so no shot shows a black gap. The follow spots stay on the actors through every fast pan and zoom. The wash colour changes on the same frame as each quick scene change. The first frame is fully lit, never a fade-up from dark. Front washes about 20% brighter than a classic dark stage, so the picture averages about 40% brightness with colour strength about 45-50%. What no lamp touches falls to deep indigo, not pure black (pure black on 1% of the picture at most). The dark theatre mood stays: beams through the haze and pools of light.
Materials: Thick matt card painted in flat gouache colours with a fine ink line and paper grain, bare card on the sawn edges, thin steel rods and wires, deep-pile velvet with gold braid, dark stained boards with a satin reflection.
Camera: It leaves the stalls seat. About every 1.4 seconds a fast, eased pan or zoom (a third to half a second) moves to a new framing, then a very slow drift continues the same way until the next move: it pushes onto the actors, pulls back to the whole stage and pans across into the wings and up to the flies. Never still for long, never a smeared whip. It stays within about 25 degrees of straight-on, so the flat cut-outs never turn edge-on. Long lens, the whole stage picture sharp.
Finish: Beams are ray-marched cones with drifting haze and dust that only shows inside them; soft shadows from each layer onto the one behind, bloom on the brightest card, filmic contrast, heavy vignette, fine grain.
Good for: Stories, history, fables and step-by-step scenes. One scene per beat: each beat is a stage picture built from flat cut-out scenery and cut-out actors, and the change between beats is shown, not cut. The follow spot says where to look, the colour of the wash says where and when we are, and one short line on the easel card names the scene, lettered with a black outline (it can carry a running number).

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

REFERENCE STYLE SOURCE (styles/spotlight-stage.js; its sample topic was "The first powered flight: from the Wright brothers' bicycle shop in Dayton to 12 seconds and 120 feet at Kitty Hawk on 17 December 1903")
```js
{
  // ---------------------------------------------------------------- content: the play (change this block first for a new story)
  // One easel card per scene: a small place line and one or two short lines. A card with `count` shows two running numbers.
  const CARDS = [
    { place: 'DAYTON, OHIO', lines: ['TWO BICYCLE MAKERS', 'BUILD A WING'] },
    { place: 'KITTY HAWK, NORTH CAROLINA', lines: ['17 DECEMBER 1903', 'ORVILLE AT THE CONTROLS'] },
    { place: 'THE FIRST POWERED FLIGHT', count: [[12, 'SECOND', 'SECONDS'], [120, 'FOOT', 'FEET']] },
  ];
  const SHOP_SIGN = 'WRIGHT CYCLE CO.';

  // The prompt book: every move of scenery, actors and lamps on one clock. Picture and sound both read these times.
  const CUE = {
    enter: [0.3, 1.45],          // scene 1: Orville slides in along his slot to the bench
    frame: [1.3, 2.0],           // the second and third sections of the wing frame are lowered onto the bench
    strike: 3.2,                 // change 1, in view: the shop wall parts, bench and brothers slide off, frame and bicycle are flown out
    dunes: [3.5, 3.75, 4.0],     // the far, middle and front sand flats slide in from the right
    card: [3.8, 7.0],            // the easel card is pulled, showing the next
    flyer: [4.3, 5.25],          // the Flyer is flown in on its rods and set on the launch rail
    wilbur: [4.9, 5.7],          // Wilbur slides in to the far wingtip
    props: 5.8,                  // the propellers start
    roll: 7.0, lift: 7.9, flown: 10.3,   // scene 3: along the rail, off it, and the twelve seconds in the air
  };
  const D = 12;
  // The cut-outs themselves are drawn by the *Art() functions inside build(): swap those to stage another story.

  registerStyle({
    id: 'spotlight-stage',
    name: 'Spotlight Stage',
    family: 'Spaces and journeys',
    look: 'A toy theatre at night: crimson velvet, a worn timber stage and a painted world of flat card cut-outs standing in layers, with an easel card at the front for the caption. The room is dark; whatever the story is about is picked out by shafts of light cutting through haze.',
    motion: 'It plays like a show. Scenery flats slide in from the wings, pieces are flown in from above on thin rods, actors and props are cut-outs pushed along slots in the floor with a small wobble. Scene changes happen in view: flats part, others glide in, the easel card is pulled and the light changes colour.',
    light: 'Only stage lamps, each a real spot light with a matching visible beam: two follow spots from the house that stay on the actors, two wide front washes that set the colour of the scene, a top light that drops a shaft on the centre of the action, a small special on the easel card and a row of horizon lights behind the last flat. No fill: what no lamp touches stays black.',
    materials: 'Thick matt card painted in flat gouache colours with a fine ink line and paper grain, bare card on the sawn edges, thin steel rods and wires, deep-pile velvet with gold braid, dark stained boards with a satin reflection.',
    camera: 'One slow continuous move from a seat in the stalls: it starts a little left on the first scene, eases back and across as the stage changes, then drifts in and up with the action. Long lens, the whole stage picture sharp.',
    post: 'Beams are ray-marched cones with drifting haze and dust that only shows inside them; soft shadows from each layer onto the one behind, bloom on the brightest card, filmic contrast, heavy vignette, fine grain.',
    explains: 'Stories, history, fables and step-by-step scenes. One scene per beat: each beat is a stage picture built from flat cut-out scenery and cut-out actors, and the change between beats is shown, not cut. The follow spot says where to look, the colour of the wash says where and when we are, and one short line on the easel card names the scene (it can carry a running number).',
    topic: 'The first powered flight: from the Wright brothers\' bicycle shop in Dayton to 12 seconds and 120 feet at Kitty Hawk on 17 December 1903',
    duration: D,
    fonts: ['500 100px "Oswald"', '700 100px "Oswald"', '800 100px "Playfair Display"'],
    render: { samples: 40, shutter: 0.4, tone: 'filmic', exposure: 1.0, bloom: 0.3, bloomThreshold: 1.3, vignette: 0.42, grain: 0.014, fov: 30, background: '#010102' },

    build(S) {
      const { THREE, K, scene, camera } = S;
      const TAU = Math.PI * 2;
      const add = (geo, mat, pos, parent = scene, cast = true) => { const m = new THREE.Mesh(geo, mat); if (pos) m.position.set(pos[0], pos[1], pos[2]); m.castShadow = cast; m.receiveShadow = true; parent.add(m); return m; };

      // ------------------------------------------------------------ the stage (world units: the opening is 9 wide and about 5 high)
      const CURTAIN_Z = 0.15, CURTAIN_TOP = 9, WING_X = 6.8, OPEN_X = 4.5, HEM_Y = 5.15, BACK_Z = -4.4;
      // Everything stands in shallow layers, like the grooves of a toy theatre. Upstage is -z.
      const Z = { sky: -3.0, far: -2.5, wind: -2.3, wall: -2.1, hang: -1.9, mid: -1.85, men: -1.6, frame: -1.45, bench: -1.3, flyer: -1.2, front: -0.8, easel: 0.75 };

      // ------------------------------------------------------------ two things every beam needs to know about the scene
      const HAZE_GAIN = 0.4;   // how thick the air is: one number for all beams
      const gateU = { value: new THREE.Vector3(CURTAIN_Z, OPEN_X, HEM_Y) };   // the proscenium: z of the curtain line, half width of the opening, height of the valance hem
      // Depth pre-pass: just before the beams are drawn, the solid scene is drawn once more into a depth texture from
      // the very same camera, so a beam can stop at the first surface in front of it instead of glowing through it.
      // (An invisible mesh that sorts ahead of the beams triggers it, the way three's Reflector renders its mirror.)
      const depthRT = new THREE.WebGLRenderTarget(S.W, S.H, { depthTexture: new THREE.DepthTexture(S.W, S.H), minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
      const pre = { tDepth: { value: depthRT.depthTexture }, uProjInv: { value: new THREE.Matrix4() }, uRes: { value: new THREE.Vector2(S.W, S.H) } };
      const depthOnly = new THREE.MeshBasicMaterial({ colorWrite: false, side: THREE.DoubleSide });
      const probe = new THREE.Mesh(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(9), 3)), new THREE.MeshBasicMaterial({ transparent: true, colorWrite: false, depthWrite: false, depthTest: false }));
      probe.frustumCulled = false; probe.renderOrder = 4; scene.add(probe);
      let inPre = false;
      probe.onBeforeRender = (renderer, sc, cam) => {
        if (inPre) return; inPre = true;
        const rt = renderer.getRenderTarget(), auto = renderer.shadowMap.autoUpdate, hide = [dust, probe, ...lamps.map((L) => L.beam)].filter((o) => o.visible);
        hide.forEach((o) => { o.visible = false; }); sc.overrideMaterial = depthOnly; renderer.shadowMap.autoUpdate = false;
        renderer.setRenderTarget(depthRT); renderer.clear(); renderer.render(sc, cam);
        sc.overrideMaterial = null; renderer.shadowMap.autoUpdate = auto; hide.forEach((o) => { o.visible = true; });
        renderer.setRenderTarget(rt); pre.uProjInv.value.copy(cam.projectionMatrix).invert();
        inPre = false;
      };

      // ------------------------------------------------------------ LAMPS: real light + visible beam, always in step
      // The beam is a cone mesh whose shader walks the camera ray through the cone and adds up the light scattered by
      // haze on the way. It uses the same apex, angle and soft edge as the THREE.SpotLight, so the lit pool on the
      // scenery is always exactly where the shaft ends.
      const BEAM_VS = 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }';
      const HAZE = `
        float h3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
        float vn(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
                     mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }
        // smoke that drifts slowly across the stage: thick and thin patches, never even
        float haze(vec3 p, float t){ return 0.45 + 0.85 * vn(p * 0.5 + vec3(0.11, -0.05, 0.07) * t) + 0.5 * vn(p * 1.5 + vec3(-0.16, 0.09, 0.12) * t); }
        // the proscenium stops light: a point on the far side of the curtain line from the lamp is lit only if the
        // straight line from the lamp to it passes through the opening (between the curtains, under the valance)
        uniform vec3 uGate;   // curtain z, half width of the opening, height of the valance hem
        float gate(vec3 p, vec3 apex){
          float a = apex.z - uGate.x, b = p.z - uGate.x; if (a * b >= 0.0) return 1.0;
          vec3 h = mix(apex, p, a / (a - b));
          return smoothstep(0.0, 0.2, uGate.y - abs(h.x)) * smoothstep(0.0, 0.2, uGate.z - h.y);
        }`;
      const BEAM_FS = `
        uniform vec3 uApex, uDir, uColor; uniform float uCosO, uCosI, uNear, uLen, uTime, uSeed, uWingX;
        uniform sampler2D tDepth; uniform mat4 uProjInv; uniform vec2 uRes;
        varying vec3 vW;
        ${HAZE}
        void main(){
          vec3 ro = cameraPosition, rd = normalize(vW - ro), co = ro - uApex;
          // where the view ray is inside the cone (apex uApex, axis uDir, half angle acos(uCosO))
          float dv = dot(rd, uDir), cv = dot(co, uDir), c2 = uCosO * uCosO;
          float a = dv * dv - c2, b = dv * cv - dot(rd, co) * c2, c = cv * cv - dot(co, co) * c2, disc = b * b - a * c;
          if (disc <= 0.0 || abs(a) < 1e-6) discard;
          float sq = sqrt(disc), tA = (-b - sq) / a, tB = (-b + sq) / a, t0, t1;
          if (a < 0.0) { t0 = tB; t1 = tA; if (cv + dv * 0.5 * (t0 + t1) < 0.0) discard; }   // crossing the cone: in through one side, out through the other
          else if (dv > 0.0) { t0 = max(tA, tB); t1 = 1e4; } else { t0 = -1e4; t1 = min(tA, tB); }   // looking along the cone: inside from one root onwards
          // the beam starts at the lens and ends at its length, the floor or the back wall
          float sN = (uNear - cv) / dv, sL = (uLen - cv) / dv;
          t0 = max(t0, min(sN, sL)); t1 = min(t1, max(sN, sL));
          float tf = (0.005 - ro.y) / rd.y; if (rd.y < 0.0) t1 = min(t1, tf); else t0 = max(t0, tf);
          // ...or at the first solid thing the camera sees along this ray (depth from the pre-pass above)
          vec2 suv = gl_FragCoord.xy / uRes;
          vec4 vp = uProjInv * vec4(suv * 2.0 - 1.0, texture2D(tDepth, suv).x * 2.0 - 1.0, 1.0);
          t1 = min(t1, length(vp.xyz / vp.w));
          t0 = max(t0, 0.0);
          if (t1 <= t0) discard;
          const int N = 26;
          float dt = (t1 - t0) / float(N), jit = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + uSeed) * 43758.5453), sum = 0.0;
          for (int i = 0; i < N; i++) {
            vec3 p = ro + rd * (t0 + (float(i) + jit) * dt), q = p - uApex;
            float h = dot(q, uDir), ca = h / length(q);
            float edge = smoothstep(uCosO, uCosI, ca);                        // the same soft edge as the spot light
            float fall = pow(uNear / h, 1.5);                                 // light thins out as the cone widens
            float wing = (p.z < uGate.x && abs(p.x) > uWingX) ? 0.0 : 1.0;    // the wings swallow what leaves the stage
            sum += edge * fall * haze(p, uTime) * gate(p, uApex) * wing;
          }
          float fwd = 0.75 + 0.9 * pow(0.5 - 0.5 * dv, 2.0);                  // haze scatters more light forwards, towards a camera the lamp faces
          gl_FragColor = vec4(uColor * sum * dt * fwd, 1.0);
        }`;
      const unitCone = new THREE.ConeGeometry(1, 1, 56, 1, false); unitCone.translate(0, -0.5, 0); unitCone.rotateX(Math.PI);   // apex at the origin, opening along +Y
      const lamps = [], yAxis = new THREE.Vector3(0, 1, 0), dir = new THREE.Vector3(), tmp = new THREE.Vector3();

      // makeLamp({ pos, power (candela at full), angle, penumbra, lens (radius), haze (how strongly its beam shows),
      // dust, shadow, soft }) -> lamp.set(aim [x,y,z], level 0..1+, { color: [r,g,b] linear, angle, reach }) to be
      // called from update(t). reach: how far past the aim point the beam still shows (default: until it hits something).
      function makeLamp(o) {
        const L = { o, color: new THREE.Color('#ffffff'), level: 0, apex: new THREE.Vector3(), dir: new THREE.Vector3(0, -1, 0), cosO: 1, cosI: 1 };
        L.light = K.spot(S, { pos: o.pos, target: [0, 0, 0], power: 0, angle: o.angle, penumbra: o.penumbra, soft: o.soft == null ? 0.08 : o.soft, shadow: o.shadow !== false, mapSize: o.mapSize || 2048, near: 0.6, far: 40, bias: -0.0006 });
        L.uni = { uApex: { value: L.apex }, uDir: { value: L.dir }, uColor: { value: new THREE.Color() }, uCosO: { value: 1 }, uCosI: { value: 1 }, uNear: { value: 1 }, uLen: { value: 30 }, uTime: { value: 0 }, uSeed: { value: 0 }, uWingX: { value: WING_X + 0.4 }, uGate: gateU, tDepth: pre.tDepth, uProjInv: pre.uProjInv, uRes: pre.uRes };
        L.beam = new THREE.Mesh(unitCone, new THREE.ShaderMaterial({ vertexShader: BEAM_VS, fragmentShader: BEAM_FS, uniforms: L.uni, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
        L.beam.frustumCulled = false; L.beam.renderOrder = 5; scene.add(L.beam);
        L.set = (aim, level, q = {}) => {
          const ang = q.angle == null ? o.angle : q.angle, lensR = o.lens || 0.14;
          if (q.color) L.color.setRGB(q.color[0], q.color[1], q.color[2]);
          dir.set(aim[0] - o.pos[0], aim[1] - o.pos[1], aim[2] - o.pos[2]).normalize();
          const near = lensR / Math.tan(ang);                                   // the cone's apex sits this far behind the lens
          L.apex.set(o.pos[0], o.pos[1], o.pos[2]).addScaledVector(dir, -near); L.dir.copy(dir); L.level = level;
          L.cosO = Math.cos(ang); L.cosI = Math.cos(ang * (1 - o.penumbra));
          L.light.position.copy(L.apex); L.light.target.position.set(aim[0], aim[1], aim[2]); L.light.angle = ang; L.light.color.copy(L.color); L.light.intensity = o.power * level;
          const u = L.uni; u.uCosO.value = L.cosO; u.uCosI.value = L.cosI; u.uNear.value = near;
          u.uColor.value.copy(L.color).multiplyScalar(level * (o.haze == null ? 1 : o.haze) * HAZE_GAIN);
          const len = q.reach == null ? 30 : tmp.set(aim[0], aim[1], aim[2]).sub(L.apex).length() + q.reach, r = len * Math.tan(ang) * 1.04;
          u.uLen.value = len;
          L.beam.position.copy(L.apex); L.beam.quaternion.setFromUnitVectors(yAxis, dir); L.beam.scale.set(r, len, r); L.beam.visible = level > 0.002;
        };
        lamps.push(L); return L;
      }
      // The rig: two follow spots and two washes out in the house, a top light over the stage, a special for the easel.
      const follow = makeLamp({ pos: [-5.5, 6.9, 12], power: 950, angle: 0.15, penumbra: 0.5, lens: 0.16, haze: 1.5, soft: 0.12 });
      const follow2 = makeLamp({ pos: [6, 6.6, 12], power: 1150, angle: 0.07, penumbra: 0.45, lens: 0.16, haze: 1.0, soft: 0.1 });
      const wash = [-1, 1].map((s) => makeLamp({ pos: [s * 5.6, 5.6, 10.5], power: 620, angle: 0.5, penumbra: 0.85, lens: 0.2, haze: 0.05, dust: 0.15, soft: 0.16, mapSize: 2048 }));
      const top = makeLamp({ pos: [0.3, 8.8, -0.35], power: 1300, angle: 0.17, penumbra: 0.6, lens: 0.14, haze: 2.4, soft: 0.06 });
      const cardLamp = makeLamp({ pos: [1.6, 6.4, 11], power: 760, angle: 0.15, penumbra: 0.45, lens: 0.14, haze: 0.1, dust: 0.3, soft: 0.1, mapSize: 1024 });
      // Horizon lights: a row of small lamps on the floor behind the last sand flat, shining up the sky cloth (a "ground row").
      const horizon = [-6, -3, 0, 3, 6].map((x) => { const l = new THREE.PointLight('#ffffff', 0, 8, 1.3); l.position.set(x, 0.9, Z.sky + 0.45); scene.add(l); return l; });

      // ------------------------------------------------------------ dust: specks that only show where a beam passes
      const NL = lamps.length, NDUST = 2400, dr = K.rng(7), dp = new Float32Array(NDUST * 3), ds = new Float32Array(NDUST * 4);
      for (let i = 0; i < NDUST; i++) { dp.set([dr.range(-6, 6), dr.range(0.1, 6.5), dr.range(-2.5, 6)], i * 3); ds.set([dr(), dr(), dr(), dr()], i * 4); }
      const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3)); dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(ds, 4));
      const dustU = { uTime: { value: 0 }, uA: { value: lamps.map(() => new THREE.Vector3()) }, uD: { value: lamps.map(() => new THREE.Vector3()) }, uC: { value: lamps.map(() => new THREE.Color()) }, uK: { value: lamps.map(() => new THREE.Vector3()) }, uGate: gateU, uPx: { value: S.H / (2 * Math.tan(15 * Math.PI / 180)) } };
      const dust = new THREE.Points(dustGeo, new THREE.ShaderMaterial({
        uniforms: dustU, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
        vertexShader: `uniform float uTime, uPx; uniform vec3 uA[${NL}], uD[${NL}], uC[${NL}], uK[${NL}]; attribute vec4 aSeed; varying vec3 vC;
          ${HAZE}
          void main(){
            // slow drift, a little different for every speck
            vec3 p = position + vec3(sin(uTime * 0.31 + aSeed.x * 6.28) * 0.22 + uTime * 0.035, uTime * (0.02 + 0.03 * aSeed.y) + sin(uTime * 0.5 + aSeed.z * 6.28) * 0.06, cos(uTime * 0.27 + aSeed.w * 6.28) * 0.2);
            vec3 c = vec3(0.0);
            for (int i = 0; i < ${NL}; i++) { vec3 q = p - uA[i]; float h = dot(q, uD[i]); if (h > uK[i].z) c += uC[i] * smoothstep(uK[i].x, uK[i].y, h / length(q)) * pow(uK[i].z / h, 1.5) * gate(p, uA[i]); }
            float glint = 0.25 + 0.75 * pow(abs(sin(uTime * (0.8 + 2.4 * aSeed.y) + aSeed.x * 40.0)), 8.0);   // flakes turn and catch the light
            vC = c * glint;
            vec4 mv = viewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv; gl_PointSize = (0.011 + 0.01 * aSeed.z) * uPx / -mv.z;
          }`,
        fragmentShader: 'varying vec3 vC; void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vC * smoothstep(0.5, 0.15, d), 1.0); }',
      }));
      dust.frustumCulled = false; dust.renderOrder = 6; scene.add(dust);

      // ------------------------------------------------------------ the house curtain and its valance: the frame of the picture
      const velvetMap = K.canvasTex(512, 1024, (c, w, h) => {
        c.fillStyle = '#6a0812'; c.fillRect(0, 0, w, h);
        const r = K.rng(3);
        for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(${r.chance(0.5) ? '40,0,6' : '190,40,50'},${r.range(0.02, 0.07)})`; c.fillRect(r.range(0, w), 0, r.range(1, 3), h); }   // the nap runs top to bottom
        const g = c.createLinearGradient(0, h * 0.925, 0, h * 0.965); g.addColorStop(0, '#6b4a12'); g.addColorStop(0.3, '#e0b04a'); g.addColorStop(0.7, '#c8962f'); g.addColorStop(1, '#5a3c0c');
        c.fillStyle = g; c.fillRect(0, h * 0.925, w, h * 0.04);                                                // gold braid above the hem
        for (let x = 0; x < w; x += 8) { c.fillStyle = r.chance(0.5) ? '#d39a2c' : '#a8701a'; c.fillRect(x, h * 0.966, 5, h * 0.034); }   // bullion fringe
      }, { repeat: [5, 1] });
      // Curtain warmers: the soft glow a house curtain is given so it never quite disappears. A real lamp would spill
      // onto the stage, so this light exists only inside the velvet's own shader: a dim key from the front plus the
      // pile catching light where a fold turns away.
      const warmU = { value: new THREE.Color('#ffb48a').multiplyScalar(0.2) };
      const velvetMat = (map) => {
        const m = new THREE.MeshPhysicalMaterial({ map, roughness: 0.92, sheen: 1, sheenColor: new THREE.Color('#e02a34'), sheenRoughness: 0.4, side: THREE.DoubleSide });
        m.onBeforeCompile = (sh) => {
          sh.uniforms.uWarm = warmU;
          sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uWarm;').replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
            { vec3 wl = normalize((viewMatrix * vec4(0.3, 0.5, 0.8, 0.0)).xyz); float rim = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 3.0);
              reflectedLight.directDiffuse += uWarm * material.diffuseColor * (max(dot(normal, wl), 0.0) + 2.5 * rim); }`);
        };
        return m;
      };
      const velvet = velvetMat(velvetMap);
      // Each half is a strip of cloth 1.45 times wider than the opening it would close, gathered at the side: the
      // same cloth in less width makes the deep folds. `lag` lets the hem trail and swing.
      const NF = 9, CLOTH = 1.45 * (WING_X + 0.12);
      function makeCurtain(side) {
        const NU = 162, NV = 26, geo = new THREE.PlaneGeometry(1, 1, NU, NV), pos = geo.attributes.position, uv = geo.attributes.uv, r = K.rng(side + 5);
        const foldAmp = Array.from({ length: NF + 2 }, () => r.range(0.75, 1.2)), foldPh = Array.from({ length: NF + 2 }, () => r.range(-0.5, 0.5));
        const mesh = add(geo, velvet, null); mesh.frustumCulled = false;
        let last = '';
        mesh.userData.set = (lead, lag) => {
          const key = lead.toFixed(4) + '|' + lag.toFixed(4); if (key === last) return; last = key;   // same pose as the last call: nothing to do
          const span = WING_X - lead, lam = span / NF;
          const amp = K.clamp(lam / (2 * Math.PI) * Math.sqrt(2 * Math.max(0, (CLOTH / span) ** 2 - 1)) * 0.7, 0.08, 0.2);   // keeps the cloth's width roughly constant
          for (let i = 0; i < pos.count; i++) {
            const u = uv.getX(i), v = uv.getY(i), cf = u * NF, k = Math.floor(cf), f = cf - k;
            const a = K.lerp(foldAmp[k], foldAmp[k + 1], f) * (0.8 + 0.35 * (1 - v)), ph = K.lerp(foldPh[k], foldPh[k + 1], f) * (1 - v) * 0.9;
            const s = 2 * Math.PI * (cf + ph * 0.25);
            const z = amp * a * (Math.sin(s) + 0.28 * Math.sin(2 * s + 1.1 + 2.2 * v));
            const hang = (1 - v) * (1 - v) * (0.25 + 0.75 * u);                                         // the hem trails behind the track, most at the leading edge
            pos.setXYZ(i, side * (WING_X - span * u - lag * hang), 0.02 + v * (CURTAIN_TOP - 0.02), CURTAIN_Z + z + (side > 0 ? 0.07 : 0));
          }
          pos.needsUpdate = true; geo.computeVertexNormals();
        };
        return mesh;
      }
      const curtains = [makeCurtain(-1), makeCurtain(1)];
      {   // the valance: a pleated strip of the same velvet across the top, braid and fringe along its hem
        const map = velvetMap.clone(); map.repeat.set(7, 1); map.needsUpdate = true;
        const geo = new THREE.PlaneGeometry(15, 2.6, 240, 8), p = geo.attributes.position;
        for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, 0.07 * Math.sin(x * 7.3) + 0.03 * Math.sin(x * 17 + 1.3)); p.setY(i, y + (y < -1.2 ? 0.05 * Math.cos(x * 7.3) : 0)); }
        geo.computeVertexNormals();
        add(geo, velvetMat(map), [0, HEM_Y + 1.3, CURTAIN_Z + 0.24]);
      }

      // ------------------------------------------------------------ the boards, the black drapes and the slots the scenery runs in
      const boards = K.canvasTex(1024, 1024, (c, w, h) => {
        const r = K.rng(21), NP = 14, pw = w / NP;
        for (let p = 0; p < NP; p++) {
          let y = -r.range(0, h * 0.6);
          while (y < h) {                                                    // boards of different lengths, butt-jointed
            const len = r.range(h * 0.45, h * 0.9), tone = r.range(0.75, 1.15);
            c.fillStyle = `rgb(${Math.round(64 * tone)},${Math.round(40 * tone)},${Math.round(24 * tone)})`; c.fillRect(p * pw, y, pw, len);
            for (let k = 0; k < 26; k++) { c.fillStyle = `rgba(${r.chance(0.5) ? '20,10,4' : '120,84,50'},${r.range(0.04, 0.12)})`; c.fillRect(p * pw + r.range(0, pw), y, r.range(0.6, 2), len); }   // grain
            c.fillStyle = 'rgba(8,5,3,0.9)'; c.fillRect(p * pw, y + len - 2, pw, 2.5);
            for (const nx of [0.22, 0.78]) { c.fillStyle = 'rgba(10,8,6,0.8)'; c.beginPath(); c.arc(p * pw + pw * nx, y + len - 12, 2.2, 0, 7); c.fill(); }   // nail heads
            y += len;
          }
          c.fillStyle = 'rgba(6,4,2,0.95)'; c.fillRect(p * pw - 1, 0, 2.2, h);
        }
        for (let k = 0; k < 420; k++) {                                       // scuffs from years of scenery
          const x = r.range(0, w), y = r.range(0, h), l = r.range(10, 90), a = r.range(-0.5, 0.5);
          c.strokeStyle = `rgba(150,110,70,${r.range(0.03, 0.12)})`; c.lineWidth = r.range(0.6, 3);
          c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.sin(a) * l, y + Math.cos(a) * l); c.stroke();
        }
      }, { repeat: [20, 20] });
      // a real reflection, blurred like satin varnish: this is what makes the boards "catch the light"
      K.mirrorFloor(S, { y: 0, color: '#ffffff', surfaceRoughness: 0.5, roughness: 0.3, strength: 0.55, fresnel: true, material: { map: boards } });
      const drape = new THREE.MeshBasicMaterial({ color: '#000000' });   // black velour: it is there to swallow light
      add(new THREE.PlaneGeometry(40, 14), drape, [0, 7, BACK_Z], scene, false);
      const wood = new THREE.MeshStandardMaterial({ color: '#7a5330', roughness: 0.7 }), steel = new THREE.MeshStandardMaterial({ color: '#8a8d93', roughness: 0.45, metalness: 0.6 });
      const groove = new THREE.MeshBasicMaterial({ color: '#070504' });
      for (const z of [Z.far, Z.wall, Z.mid, Z.men, Z.bench, Z.front]) { const m = add(new THREE.PlaneGeometry(16, 0.045).rotateX(-Math.PI / 2), groove, [0, 0.006, z], scene, false); m.receiveShadow = false; }

      // ------------------------------------------------------------ CUT-OUTS: everything on the stage is a painted card
      // A piece of art is a list of items in card units (y up, origin at the foot):
      //   { pts, fill, holes?, ink?, cut? }  a filled outline. It is painted AND sawn out of the card (cut: false = paint only)
      //   { line, w, color }                 a painted line
      //   { draw(ctx) }                      free painting
      // cutout() paints the list on a canvas and extrudes the same outlines into one thick card, so the silhouette
      // you see is real geometry: it throws real shadows on the layer behind and stops the beams.
      const INK = '#2a1c12', CARD = '#e6d9bb';
      const ell = (cx, cy, rx, ry = rx, n = 26, a0 = 0, a1 = TAU) => Array.from({ length: n }, (_, i) => { const a = a0 + (a1 - a0) * i / (a1 - a0 > TAU - 1e-6 ? n : n - 1); return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
      const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
      const round = (pts, it = 3) => { for (let k = 0; k < it; k++) { const o = []; pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; o.push([p[0] * 0.75 + q[0] * 0.25, p[1] * 0.75 + q[1] * 0.25], [p[0] * 0.25 + q[0] * 0.75, p[1] * 0.25 + q[1] * 0.75]); }); pts = o; } return pts; };   // corner cutting: a smooth blob from a rough polygon
      const strip = (line, w) => {   // a line given thickness (w: number, or a function of 0..1 along it)
        const Lf = [], Rt = [], n = line.length, wf = typeof w === 'function' ? w : () => w;
        line.forEach((p, i) => { const a = line[Math.max(0, i - 1)], b = line[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, h = wf(i / (n - 1)) / 2; Lf.push([p[0] - dy / l * h, p[1] + dx / l * h]); Rt.unshift([p[0] + dy / l * h, p[1] - dx / l * h]); });
        return Lf.concat(Rt);
      };
      const limb = (x1, y1, x2, y2, r1, r2 = r1) => { const a = Math.atan2(y2 - y1, x2 - x1); return ell(x2, y2, r2, r2, 9, a - Math.PI / 2, a + Math.PI / 2).concat(ell(x1, y1, r1, r1, 9, a + Math.PI / 2, a + Math.PI * 1.5)); };   // a tapered capsule
      const hull = (pts) => { pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]); const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = []; for (const p of pts) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); } for (const p of pts.slice().reverse()) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); } return lo.slice(0, -1).concat(up.slice(0, -1)); };
      const place = (items, s = 1, dx = 0, dy = 0, flip = 1) => items.map((it) => { const f = (a) => a.map(([x, y]) => [dx + flip * s * x, dy + s * y]), o = Object.assign({}, it); if (it.pts) o.pts = f(it.pts); if (it.holes) o.holes = it.holes.map(f); if (it.line) o.line = f(it.line); return o; });
      const label = (c, text, x, y, size, font, color, align = 'center') => { c.save(); c.translate(x, y); c.scale(size / 100, -size / 100); c.font = font; c.fillStyle = color; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(text, 0, 0); c.restore(); };

      function cutout(items, o = {}) {
        const cut = items.filter((it) => it.pts && it.cut !== false), pad = 0.04;
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const it of cut) for (const p of it.pts) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
        x0 -= pad; y0 -= pad; x1 += pad; y1 += pad;
        const w = x1 - x0, h = y1 - y0, res = Math.min(o.res || 280, 4000 / w, 4000 / h), T = o.thick || 0.045;
        const tex = K.canvasTex(Math.ceil(w * res), Math.ceil(h * res), (c, W, H) => {
          c.fillStyle = CARD; c.fillRect(0, 0, W, H);
          c.setTransform(res, 0, 0, -res, -x0 * res, y1 * res);     // card units, y up
          c.lineJoin = 'round'; c.lineCap = 'round';
          const trace = (pts) => { c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); };
          for (const it of items) {
            if (it.draw) { c.save(); it.draw(c); c.restore(); continue; }
            if (it.line) { c.beginPath(); it.line.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.strokeStyle = it.color || INK; c.lineWidth = it.w || 0.011; c.stroke(); continue; }
            if (!it.fill) continue;
            c.beginPath(); trace(it.pts); (it.holes || []).forEach(trace);
            c.fillStyle = it.fill; c.fill('evenodd');
            if (it.ink !== 0) { c.strokeStyle = INK; c.lineWidth = it.ink || 0.011; c.stroke(); }   // the printed ink line
          }
          c.setTransform(1, 0, 0, 1, 0, 0);                         // paper grain over the paint
          const r = K.rng(o.seed || 11), n = W * H / 260;
          for (let i = 0; i < n; i++) { c.fillStyle = r.chance(0.5) ? `rgba(255,244,220,${r.range(0.02, 0.07)})` : `rgba(40,25,10,${r.range(0.02, 0.07)})`; c.fillRect(r.range(0, W), r.range(0, H), r.range(1, 3.5), r.range(1, 3.5)); }
        });
        const v2 = (a) => a.map((p) => new THREE.Vector2(p[0], p[1]));
        const geo = new THREE.ExtrudeGeometry(cut.map((it) => { const s = new THREE.Shape(v2(it.pts)); (it.holes || []).forEach((hh) => s.holes.push(new THREE.Path(v2(hh)))); return s; }), { depth: T, bevelEnabled: false, curveSegments: 1 });
        geo.translate(0, 0, -T / 2);
        const uv = geo.attributes.uv, p = geo.attributes.position;
        for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) - x0) / w, (p.getY(i) - y0) / h);                  // the faces take the painting
        for (const g of geo.groups) if (g.materialIndex === 1) for (let i = g.start; i < g.start + g.count; i++) uv.setXY(i, 0.4 * pad / w, 0.4 * pad / h);   // the sawn edges take the margin of the sheet
        geo.clearGroups();
        const mesh = add(geo, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92 }), null, o.parent || scene);
        mesh.userData.box = { x0, y0, x1, y1 };
        return mesh;
      }
      // Two ways a cut-out gets onto the stage.
      // hung(): flown from above on thin rods (pass the points on the card where the rods are fixed).
      const rodGeo = new THREE.CylinderGeometry(0.011, 0.011, 10, 6).translate(0, 5, 0), wireGeo = new THREE.CylinderGeometry(0.005, 0.005, 10, 5).translate(0, 5, 0);
      function hung(mesh, z, rods, geo = rodGeo) { const g = new THREE.Group(); g.position.z = z; scene.add(g); g.add(mesh); for (const r of rods) add(geo, steel, [r[0], r[1], -0.03], g, false); return g; }
      // onSlot(): standing on a wooden slider in a floor slot, pushed from a wing by a long wire.
      function onSlot(mesh, z, wing, baseW) { const g = new THREE.Group(); g.position.z = z; scene.add(g); mesh.position.y = 0.05; g.add(mesh); add(K.roundedBox(baseW, 0.05, 0.13, 0.012, 2), wood, [0, 0.03, 0], g); add(new THREE.CylinderGeometry(0.009, 0.009, 14, 6).rotateZ(Math.PI / 2), steel, [wing * (7 + baseW / 2), 0.035, 0], g, false); g.userData.card = mesh; return g; }

      // ------------------------------------------------------------ ART, scene 1: the bicycle shop (green wall, brown wood, cream, a red sign)
      const SKIN = '#e0ad86', SHIRT = '#f1e7d0';
      // A man in profile, drawn facing right at height 1 and then scaled. Poses come from the two arms and the stride.
      function manArt(o) {
        const it = [], suit = o.suit || '#2b2c33', trousers = o.trousers || '#4a4641', sleeve = o.coat ? suit : SHIRT, st = o.stride || 0;
        const arm = ([ex, ey, hx, hy], col) => it.push({ pts: limb(0, 0.775, ex, ey, 0.04, 0.034), fill: col }, { pts: limb(ex, ey, hx, hy, 0.034, 0.027), fill: col }, { pts: ell(hx, hy, 0.028, 0.028, 12), fill: SKIN });
        arm(o.far, o.coat ? '#1d1e23' : '#d8ccb2');                                                                    // the far arm, a shade darker
        it.push({ pts: limb(-0.03, 0.48, -0.05 - st, 0.05, 0.062, 0.038), fill: '#38352f' }, { pts: limb(-0.095 - st, 0.02, -0.005 - st, 0.02, 0.024), fill: '#191715' });   // far leg and shoe
        it.push({ pts: limb(0.02, 0.48, 0.05 + st, 0.05, 0.066, 0.04), fill: trousers }, { pts: limb(0.02 + st, 0.02, 0.125 + st, 0.02, 0.024), fill: '#191715' });
        it.push({ pts: round([[-0.09, 0.45], [0.08, 0.45], [0.1, 0.58], [0.09, 0.72], [0.05, 0.8], [-0.03, 0.815], [-0.1, 0.77], [-0.11, 0.62]], 2), fill: suit });   // waistcoat or coat
        if (!o.coat) it.push({ pts: [[0.04, 0.8], [0.092, 0.72], [0.075, 0.6], [0.035, 0.72]], fill: SHIRT, cut: false, ink: 0.006 });
        if (o.apron) it.push({ pts: [[-0.005, 0.72], [0.095, 0.69], [0.108, 0.56], [0.1, 0.3], [-0.05, 0.3], [-0.055, 0.56]], fill: '#b5aa8d' });
        it.push({ pts: limb(0, 0.8, 0.01, 0.86, 0.032), fill: SKIN }, { pts: [[-0.04, 0.8], [0.048, 0.8], [0.052, 0.838], [-0.034, 0.842]], fill: SHIRT });   // neck and stand-up collar
        it.push({ pts: [[0.064, 0.93], [0.088, 0.9], [0.062, 0.89]], fill: SKIN }, { pts: ell(0.012, 0.918, 0.058, 0.07), fill: SKIN });   // nose, head
        it.push({ pts: ell(-0.004, 0.912, 0.012, 0.018, 10), fill: '#c99672', cut: false, ink: 0.005 }, { pts: ell(0.042, 0.93, 0.006, 0.008, 8), fill: INK, cut: false, ink: 0 });   // ear, eye
        if (o.hair === 'full') it.push({ pts: ell(0.012, 0.918, 0.063, 0.076, 14, 0.62, 3.75).concat([[-0.02, 0.905], [-0.012, 0.94], [0.022, 0.956]]), fill: '#3a2a1e' });
        else it.push({ pts: ell(0.012, 0.918, 0.062, 0.074, 10, 2.0, 3.75).concat([[-0.018, 0.9], [-0.03, 0.948]]), fill: '#4a382a' });   // Wilbur had lost most of his
        if (o.moustache) it.push({ pts: limb(0.047, 0.889, 0.073, 0.882, 0.0095), fill: '#3a2a1e', cut: false, ink: 0 });
        if (o.cap) it.push({ pts: round([[-0.058, 0.95], [-0.045, 0.995], [0.02, 1.006], [0.07, 0.988], [0.082, 0.962]], 2), fill: '#3c3d44' }, { pts: limb(0.06, 0.962, 0.112, 0.953, 0.009), fill: '#2c2d33' });
        arm(o.near, sleeve);
        return place(it, o.h, 0, 0, o.facing || 1);
      }
      function benchArt() {
        const A = '#8f6030', B = '#bb8c50', C = '#6f4622', it = [];
        it.push({ pts: rect(-1.62, 0, -1.4, 0.82), fill: C }, { pts: rect(1.4, 0, 1.62, 0.82), fill: C }, { pts: rect(-1.42, 0.2, 1.42, 0.32), fill: C });   // legs and stretcher
        it.push({ pts: rect(0.3, 0.32, 1.05, 0.6), fill: '#7c2f25' }, { pts: strip([[0.5, 0.6], [0.55, 0.68], [0.8, 0.68], [0.85, 0.6]], 0.03), fill: '#2c2d33', ink: 0 });   // a toolbox on it
        it.push({ pts: rect(-1.7, 0.8, 1.7, 1.0), fill: A }, { pts: rect(-1.86, 1.0, 1.86, 1.1), fill: B });                                                 // apron and top
        it.push({ pts: [[-1.82, 1.1], [-1.5, 1.1], [-1.5, 1.32], [-1.6, 1.32], [-1.6, 1.2], [-1.72, 1.2], [-1.72, 1.32], [-1.82, 1.32]], fill: '#34353b' });   // vice
        for (const x of [-0.85, 0, 0.85]) it.push({ pts: rect(x - 0.36, 0.84, x + 0.36, 0.96), fill: '#7d5329', cut: false, ink: 0.006 }, { pts: ell(x, 0.9, 0.025, 0.025, 10), fill: '#d1b06a', cut: false, ink: 0.005 });   // drawers
        const r = K.rng(31); for (let i = 0; i < 26; i++) { const x = r.range(-1.8, 1.5), y = r.pick([1.03, 1.06, 0.86, 0.93, 0.5, 0.26]); it.push({ line: [[x, y], [x + r.range(0.15, 0.5), y + r.range(-0.006, 0.006)]], w: 0.006, color: 'rgba(60,35,15,0.35)' }); }   // grain
        return it;
      }
      // One of three sections of a wing frame (ribs on two spars), lying flat and seen from a little above.
      const FRAME = { span: 3.3, chord: [0.5, 0.62] };
      const framePt = (u, c) => [FRAME.span * u + FRAME.chord[0] * c, FRAME.chord[1] * c + 0.11 * Math.sin(Math.PI * Math.min(1, c * 1.15))];   // the ribs are cambered: they arch
      function frameArt(k) {
        const it = [], u0 = k / 3, u1 = (k + 1) / 3, cs = [0, 0.1, 0.22, 0.36, 0.5, 0.64, 0.78, 0.9, 1];
        for (let i = 0; i < 4; i++) { const u = u0 + (i + 0.5) / 4 * (u1 - u0); it.push({ pts: strip(cs.map((c) => framePt(u, c)), 0.032), fill: '#ecd49a', ink: 0.007 }); }
        for (const [c, w] of [[0, 0.055], [0.62, 0.05], [1, 0.02]]) it.push({ pts: strip([framePt(u0 + 0.004, c), framePt(u1 - 0.004, c)], w), fill: c === 1 ? '#c9a763' : '#e3c686', ink: 0.007 });
        return it;
      }
      function bicycleArt() {
        const it = [], R = 0.46, WB = 1.42, STEEL = '#1c1c20', BB = [0.5, -0.03], ST = [0.36, 0.6], HT = [1.06, 0.66], HB = [1.1, 0.46];
        const tube = (a, b, w = 0.034, fill = STEEL) => it.push({ pts: strip([a, b], w), fill, ink: 0 });
        for (const cx of [0, WB]) {
          for (let k = 0; k < 14; k++) { const a = k / 14 * TAU + 0.1; tube([cx, 0], [cx + Math.cos(a) * (R - 0.03), Math.sin(a) * (R - 0.03)], 0.009, '#9a9588'); }   // spokes: real slivers of card
          it.push({ pts: ell(cx, 0, R, R, 48), holes: [ell(cx, 0, R - 0.055, R - 0.055, 44)], fill: '#eadfc4', ink: 0.009 }, { pts: ell(cx, 0, 0.045, 0.045, 14), fill: STEEL, ink: 0 });   // white rubber tyre, hub
        }
        tube([0, 0], BB, 0.028); tube([0, 0], ST, 0.026); tube(BB, ST); tube(ST, HT); tube(BB, HB); tube(HT, HB, 0.042); tube(ST, [0.345, 0.69], 0.022);
        it.push({ pts: strip([HB, [1.2, 0.26], [WB, 0]], 0.03), fill: STEEL, ink: 0 }, { pts: strip([[1.05, 0.66], [1.03, 0.8], [0.93, 0.845], [0.85, 0.78]], 0.028), fill: STEEL, ink: 0 });   // fork, handlebar
        it.push({ pts: round([[0.22, 0.675], [0.47, 0.69], [0.49, 0.73], [0.3, 0.745], [0.21, 0.71]], 2), fill: '#6b4526' });   // saddle
        it.push({ pts: ell(BB[0], BB[1], 0.1, 0.1, 20), fill: '#2a2a2f', ink: 0 }); tube(BB, [0.6, -0.21], 0.022); tube([0.54, -0.22], [0.68, -0.22], 0.03);   // chainwheel, crank, pedal
        tube([0.5, 0.065], [0, 0.04], 0.009, '#55514a'); tube([0.5, -0.125], [0, -0.04], 0.009, '#55514a');   // chain
        return it;
      }
      // The back wall of the shop: one painting, sawn down the middle into two flats that part like doors.
      const WALL = { w: 6.4, h: 6.2, split: -0.7 };
      function paintWall(c) {
        const { w, h } = WALL, box = (x0, y0, x1, y1, col) => { c.fillStyle = col; c.fillRect(x0, y0, x1 - x0, y1 - y0); };
        c.scale(-1, 1);   // (laid out with the bench on the right, then mirrored: the easel took that side)
        box(-w, 0, w, h, '#3e5c50');
        for (let x = -w; x < w; x += 0.42) box(x, 1.6, x + 0.012, h, 'rgba(18,34,28,0.35)');                       // boarded wall
        box(-w, 0, w, 1.55, '#27392f'); for (let x = -w; x < w; x += 0.28) box(x, 0, x + 0.012, 1.55, 'rgba(8,16,12,0.5)');   // dado
        box(-w, 1.52, w, 1.6, '#b9a67c'); box(-w, 0, w, 0.16, '#18241f');
        // window, with the light of a Dayton afternoon in it
        box(3.45, 2.15, 5.25, 4.55, '#c9b78f'); box(3.55, 2.25, 5.15, 4.45, '#efdc9f');
        box(4.32, 2.25, 4.38, 4.45, '#c9b78f'); for (const y of [2.98, 3.72]) box(3.55, y, 5.15, y + 0.05, '#c9b78f');
        // the sign
        const sx = 0.75; box(sx - 2.3, 4.35, sx + 2.3, 5.05, '#e2d2a4'); box(sx - 2.25, 4.4, sx + 2.25, 5.0, '#7c2a22');
        c.save(); c.scale(-1, 1); label(c, SHOP_SIGN, -sx, 4.69, 0.36, '800 100px "Playfair Display"', '#f0e0b0'); c.restore();
        // a shelf of tins, and tools hung under it
        box(-0.35, 3.42, 2.85, 3.5, '#8b5d33'); for (const x of [-0.2, 2.7]) { c.fillStyle = '#6f4622'; c.beginPath(); c.moveTo(x - 0.03, 3.42); c.lineTo(x + 0.03, 3.42); c.lineTo(x, 3.18); c.fill(); }
        [[0.0, 0.26, 0.3, '#a8452f'], [0.34, 0.2, 0.22, '#d8c79c'], [0.62, 0.3, 0.36, '#2f4860'], [1.7, 0.22, 0.26, '#d8c79c'], [2.0, 0.34, 0.2, '#a8452f'], [2.42, 0.18, 0.32, '#8a8f6a']].forEach(([x, bw, bh, col]) => box(x, 3.5, x + bw, 3.5 + bh, col));
        c.fillStyle = '#1b2924';
        c.beginPath(); c.moveTo(0.1, 3.3); c.lineTo(1.25, 3.2); c.lineTo(1.25, 3.08); c.lineTo(0.1, 2.98); c.fill(); box(-0.12, 3.0, 0.14, 3.3, '#9c6b3a');   // saw
        box(1.62, 2.82, 1.68, 3.3, '#9c6b3a'); box(1.52, 3.2, 1.8, 3.32, '#1b2924');                                                                       // hammer
        c.strokeStyle = '#1b2924'; c.lineWidth = 0.05; c.lineCap = 'round'; c.beginPath(); c.moveTo(2.15, 2.9); c.lineTo(2.15, 3.3); c.moveTo(2.5, 2.95); c.lineTo(2.42, 3.3); c.moveTo(2.5, 2.95); c.lineTo(2.58, 3.3); c.stroke();
        // spare rims on pegs
        for (const [x, y, rr] of [[-1.15, 3.55, 0.45], [-4.85, 4.5, 0.5]]) { c.strokeStyle = '#d9cba6'; c.lineWidth = 0.05; c.beginPath(); c.arc(x, y, rr, 0, TAU); c.stroke(); c.strokeStyle = 'rgba(217,203,166,0.5)'; c.lineWidth = 0.008; for (let k = 0; k < 16; k++) { const a = k / 16 * TAU; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); c.stroke(); } box(x - 0.03, y + rr - 0.02, x + 0.03, y + rr + 0.1, '#6f4622'); }
      }

      // ------------------------------------------------------------ ART, scenes 2 and 3: Kitty Hawk (steel-blue sky, sand, cream muslin, dark figures)
      // The 1903 Flyer, drawn the honest way: its parts are placed in three dimensions (metres: x forward, y up,
      // z along the span) and projected flat from a three-quarter view, so two wings, front elevator, twin rudder,
      // skids and the two pusher propellers all sit where they should. s = stage units per metre.
      function flyerArt(s) {
        const yaw = -0.6, pit = 0.22, cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit);   // seen from behind its left wing and a little above: it flies away up to the right
        const P = (x, y, z) => [(x * cy - z * sy) * s, (y * cp - (x * sy + z * cy) * sp) * s];
        const HALF = 6.15, LE = 0.62, TE = -1.36, GAP = 1.88, SKID = -0.5, MUSLIN = '#eadcb8', MUSLIN2 = '#cdbd95', WOODC = '#8a5f35', WOOD2 = '#664526';
        const droop = (z) => -0.2 * (z / HALF) ** 2, te = (z) => TE + 0.6 * Math.max(0, (Math.abs(z) - 5.5) / 0.65) ** 2;   // drooped tips, rounded trailing corners
        const zs = Array.from({ length: 31 }, (_, i) => -HALF + 2 * HALF * i / 30), it = [];
        const bar = (a, b, w, fill) => it.push({ pts: strip([P(...a), P(...b)], w), fill, ink: 0.006 });
        const quad = (pts3, fill) => it.push({ pts: pts3.map((p) => P(...p)), fill, ink: 0.009 });
        const body = (a, b, r1, r2, fill) => { const A = P(...a), B = P(...b); it.push({ pts: limb(A[0], A[1], B[0], B[1], r1 * s, r2 * s), fill, ink: 0.007 }); };
        const wing = (y0, fill) => {
          it.push({ pts: [...zs.map((z) => P(LE, y0 + droop(z), z)), ...zs.slice().reverse().map((z) => P(te(z), y0 + droop(z), z))], fill, ink: 0.01 });
          for (let z = -HALF + 0.3; z < HALF; z += 0.4625) it.push({ line: [P(LE, y0 + droop(z), z), P(te(z), y0 + droop(z), z)], w: 0.006, color: 'rgba(125,98,60,0.5)' });   // ribs showing through the cloth
          it.push({ line: zs.map((z) => P(LE - 0.14, y0 + droop(z), z)), w: 0.012, color: 'rgba(255,251,238,0.75)' });
        };
        // far to near, the way a scene painter would lay it in
        const elev = (y, fill) => quad([[2.55, y, -1.83], [3.3, y, -1.83], [3.3, y, 1.83], [2.55, y, 1.83]], fill);
        elev(0.45, MUSLIN2); for (const z of [-0.75, 0.75]) bar([2.98, 0.45, z], [2.98, 1.2, z], 0.02, WOODC); elev(1.2, MUSLIN);                             // the front elevator, out ahead
        for (const z of [-0.75, 0.75]) {
          bar([LE, GAP, z], [2.98, 1.2, z], 0.02, WOODC);                                                                                                     // outriggers
          it.push({ pts: strip([[TE, SKID], [0.5, SKID], [2.1, SKID], [2.55, SKID + 0.12], [2.85, SKID + 0.45], [2.98, 0.45]].map(([x, y]) => P(x, y, z)), 0.026), fill: WOODC, ink: 0.006 });   // skids, turning up to carry the elevator
          for (const x of [-0.75, 0.45]) bar([x, SKID, z], [x, 0, z], 0.02, WOOD2);
        }
        wing(0, MUSLIN2);
        const SZ = [-5.6, -4.0, -2.4, -0.8, 0.8, 2.4, 4.0, 5.6];
        for (const z of SZ) bar([0.45, droop(z), z], [0.45, GAP + droop(z), z], 0.02, WOOD2);                                                                 // front struts
        const eb = [[-0.6, 0.15], [0.03, 0.52], [-0.85, -0.3]], corners = []; for (const x of eb[0]) for (const y of eb[1]) for (const z of eb[2]) corners.push(P(x, y, z));
        it.push({ pts: hull(corners), fill: '#34322f', ink: 0.007 }, { pts: [P(-0.6, 0.52, -0.85), P(0.15, 0.52, -0.85), P(0.15, 0.52, -0.3), P(-0.6, 0.52, -0.3)], fill: '#5a554d', cut: false, ink: 0.005 });   // the engine, right of centre
        body([0.2, 0.2, 0.62], [0.74, 0.14, 0.64], 0.07, 0.06, '#25262c');                                                                                    // Orville, lying prone left of centre, hands on the elevator lever
        const hd = P(0.5, 0.33, 0.45); it.push({ pts: ell(hd[0], hd[1], 0.13 * s, 0.13 * s, 16), fill: SKIN, ink: 0.007 }, { pts: ell(hd[0] - 0.012 * s, hd[1] + 0.02 * s, 0.14 * s, 0.135 * s, 12, -0.2, 3.6), fill: '#3c3d44', ink: 0.006 });   // from behind: mostly cap
        body([0.25, 0.17, 0.45], [-0.5, 0.16, 0.45], 0.2, 0.18, '#25262c'); body([-0.5, 0.14, 0.45], [-1.3, 0.1, 0.45], 0.13, 0.09, '#3a3b42');
        for (const z of SZ) bar([-0.75, droop(z), z], [-0.75, GAP + droop(z), z], 0.024, WOODC);                                                              // rear struts
        wing(GAP, MUSLIN);
        for (const z of [-1.55, 1.55]) bar([-0.75, 0.95, z], [-1.62, 0.95, z], 0.03, '#3a3836');                                                              // propeller shafts
        for (const z of [-0.26, 0.26]) { bar([TE, GAP, z], [-3.1, 1.95, z], 0.02, WOOD2); bar([TE, 0, z], [-3.1, 0.1, z], 0.02, WOOD2); }                      // tail booms
        for (const z of [-0.26, 0.26]) quad([[-3.4, 0.08, z], [-2.85, 0.08, z], [-2.85, 1.98, z], [-3.4, 1.98, z]], z < 0 ? MUSLIN2 : MUSLIN);                // twin rudder
        return { items: it, P, slope: P(1, 0, 0)[1] / P(1, 0, 0)[0], rail: (x) => P(x, SKID - 0.04, 0),
          props: [-1.55, 1.55].map((z) => P(-1.68, 0.95, z)), propR: 1.28 * s, ey: [0, cp], ez: sy < 0 ? [-sy, -cy * sp] : [sy, cy * sp],   // each propeller disc, squashed by the same projection
          rods: [-2.4, 2.4].map((z) => P(-0.37, GAP + droop(z), z)), farTip: P(0, droop(-HALF), -HALF), ground: (x, z) => P(x, SKID - 0.04, z) };
      }
      function propArt() { return [{ pts: round([[0, -1], [0.13, -0.62], [0.05, -0.08], [0.05, 0.08], [0.13, 0.62], [0, 1], [-0.13, 0.62], [-0.05, 0.08], [-0.05, -0.08], [-0.13, -0.62]], 2), fill: '#6b4424', ink: 0.014 }, { pts: ell(0, 0, 0.07, 0.07, 14), fill: '#3a3836', ink: 0 }]; }
      // A sand flat: a long low hill with a few tonal bands, like a screen print. o: w, top(x), color, extra items.
      const nz = K.noise(5);
      function duneArt(o) {
        const xs = Array.from({ length: Math.round(o.w * 6) + 1 }, (_, i) => -o.w / 2 + i / 6), edge = xs.map((x) => [x, o.top(x)]);
        const it = [{ pts: [[-o.w / 2, 0], ...edge, [o.w / 2, 0]], fill: o.color, ink: 0 }];
        it.push({ draw(c) {
          for (let k = 1; k <= 3; k++) { c.beginPath(); c.moveTo(-o.w / 2, 0); for (const x of xs) c.lineTo(x, o.top(x) * (1 - 0.26 * k) - 0.05 * k + 0.1 * nz.n2(x * 0.6 + k * 9, k)); c.lineTo(o.w / 2, 0); c.fillStyle = o.band || 'rgba(74,52,24,0.17)'; c.fill(); }
          c.beginPath(); edge.forEach((p, i) => (i ? c.lineTo(p[0], p[1] - 0.025) : c.moveTo(p[0], p[1] - 0.025))); c.strokeStyle = 'rgba(255,242,205,0.32)'; c.lineWidth = 0.03; c.stroke();   // light along the crest
        } });
        return it.concat(o.extra || []);
      }
      const tuft = (x, y, r, col) => Array.from({ length: 8 }, (_, i) => { const hgt = r.range(0.2, 0.52), lean = -r.range(0.1, 0.34) * hgt * 2 + (i - 3.5) * 0.03; return { pts: strip([[x + (i - 3.5) * 0.012, y - 0.05], [x + (i - 3.5) * 0.012 + lean * 0.12, y + hgt * 0.35], [x + lean * 0.5, y + hgt * 0.72], [x + lean, y + hgt]], (u) => 0.02 * (1 - u) + 0.004), fill: r.pick(col), ink: 0 }; });   // sea oats, bent by the wind

      // ------------------------------------------------------------ SET, scene 1
      const wallL = cutout([{ draw: paintWall }, { pts: rect(-WALL.w, 0, WALL.split, WALL.h) }], { res: 200, seed: 2 }); wallL.position.z = Z.wall;
      const wallR = cutout([{ draw: paintWall }, { pts: rect(WALL.split, 0, WALL.w, WALL.h) }], { res: 200, seed: 3 }); wallR.position.z = Z.wall + 0.004;
      const BENCH_X = -1.2, FRAME_AT = [-2.9, 1.2];
      const bench = onSlot(cutout(benchArt(), { seed: 4 }), Z.bench, -1, 3.3);
      const frames = [0, 1, 2].map((k) => { const g = hung(cutout(frameArt(k), { seed: 5 + k, thick: 0.035 }), Z.frame, [framePt((k + 0.5) / 3, 0.62)]); g.position.x = FRAME_AT[0]; return g; });
      const bikeMesh = cutout(bicycleArt(), { seed: 9, thick: 0.035 }); bikeMesh.scale.setScalar(1.12);
      const bike = hung(bikeMesh, Z.hang, [[0.5, 0.7], [1.2, 0.74]]); bike.position.x = 2.25;
      const MAN_H = 2.6;
      const orville = onSlot(cutout(manArt({ h: MAN_H, hair: 'full', moustache: true, near: [0.1, 0.63, 0.25, 0.585], far: [0.13, 0.66, 0.28, 0.65] }), { seed: 12 }), Z.men, -1, 0.7);
      const wilbur = onSlot(cutout(manArt({ h: MAN_H, facing: -1, apron: true, near: [0.1, 0.64, 0.25, 0.6], far: [0.12, 0.67, 0.27, 0.69] }), { seed: 13 }), Z.men + 0.02, 1, 0.7);

      // ------------------------------------------------------------ SET, scenes 2 and 3
      // sky cloth: painted, hung at the back, lit by the horizon lights and whatever the washes spill on it
      const SKY = { w: 18, h: 8.6, y0: -0.6 };
      const sky = add(new THREE.PlaneGeometry(SKY.w, SKY.h), new THREE.MeshStandardMaterial({ roughness: 1, map: K.canvasTex(2048, 1024, (c, w, h) => {
        const Y = (y) => h * (1 - (y - SKY.y0) / SKY.h), g = c.createLinearGradient(0, Y(7.6), 0, Y(2.1)), r = K.rng(8);
        g.addColorStop(0, '#10233e'); g.addColorStop(0.6, '#27486d'); g.addColorStop(0.88, '#5c84a2'); g.addColorStop(1, '#d8c594');
        c.fillStyle = g; c.fillRect(0, 0, w, h);
        for (let i = 0; i < 9; i++) {                                           // long flat winter cloud, laid in with a dry brush
          const cx = r.range(0, w), cyy = Y(r.range(2.5, 5.2)), len = r.range(260, 620), th = r.range(9, 26), light = r.chance(0.6);
          for (let k = 0; k < 16; k++) { c.fillStyle = light ? `rgba(226,222,204,${r.range(0.05, 0.13)})` : `rgba(22,40,66,${r.range(0.06, 0.16)})`; c.beginPath(); c.ellipse(cx + r.range(-len, len) * 0.5, cyy + r.range(-th, th) * 0.5, len * r.range(0.25, 0.6), th * r.range(0.3, 0.8), 0, 0, TAU); c.fill(); }
        }
        c.fillStyle = '#284c5c'; c.fillRect(0, Y(2.1), w, h); c.fillStyle = 'rgba(255,255,255,0.25)'; c.fillRect(0, Y(2.1), w, 2);   // the Atlantic
        for (let i = 0; i < w * h / 300; i++) { c.fillStyle = r.chance(0.5) ? `rgba(255,244,220,${r.range(0.02, 0.06)})` : `rgba(20,25,40,${r.range(0.02, 0.06)})`; c.fillRect(r.range(0, w), r.range(0, h), r.range(1, 3), r.range(1, 3)); }
      }) }), [0, SKY.y0 + SKY.h / 2, Z.sky], scene, false);
      sky.receiveShadow = false;   // a shadow of an aeroplane on the sky would give the game away

      const FL = flyerArt(0.6), REST = [-1.4, 1.25];   // REST: where the centre of the lower wing sits when the Flyer is on its rail
      // The three sand flats. Each is much wider than the stage: they slide in from the right, and in scene 3 they
      // keep sliding left at different speeds, a moving panorama that makes the short flight travel.
      const FLAT = { far: { w: 16, x: 1, pan: 0.6 }, mid: { w: 20, x: 3.5, pan: 6.5 }, front: { w: 22, x: 4.5, pan: 9 } };
      const gr = K.rng(23), GRASS = ['#6f6a34', '#8a7f3e', '#5a6034', '#9a8846'];
      const farTop = (x) => 2.08 + 0.14 * nz.n2(x * 0.4, 1) + 1.2 * Math.exp(-(((x + 6.6) / 2.3) ** 2)) - 0.36 * K.smooth(0.5, 5.5, x);   // Kill Devil Hill on the left, falling to the sea on the right
      const shed = (x, w, h) => { const y = Math.min(farTop(x), farTop(x + w)) - 0.04; return [{ pts: [[x, y], [x + w, y], [x + w, y + h], [x + w / 2, y + h * 1.45], [x, y + h]], fill: '#5e4a34', ink: 0.007 }, { pts: rect(x + w * 0.38, y, x + w * 0.62, y + h * 0.7), fill: '#3a2d20', cut: false, ink: 0 }]; };
      const far = cutout(duneArt({ w: FLAT.far.w, top: farTop, color: '#b8a274', band: 'rgba(96,76,48,0.13)', extra: [...shed(3.0, 0.62, 0.3), ...shed(3.85, 0.44, 0.24)] }), { seed: 14 }); far.position.z = Z.far;
      const midTop = (x) => 1.74 + 0.14 * nz.n2(x * 0.5, 4) + 0.1 * nz.n2(x * 1.3, 6);
      const railPts = [-2.6, 10].map((x) => { const p = FL.rail(x); return [p[0] + REST[0] - FLAT.mid.x, p[1] + REST[1]]; });   // the launch rail: sixty feet of wooden track, drawn in the Flyer's own perspective
      const railItems = [{ pts: strip(railPts, 0.05), fill: '#6a4a2a', cut: false, ink: 0.007 }, { line: railPts.map((p) => [p[0], p[1] + 0.014]), w: 0.012, color: 'rgba(235,205,150,0.8)' }];
      for (let i = 0; i <= 12; i++) { const x = K.lerp(railPts[0][0], railPts[1][0], i / 12), y = K.lerp(railPts[0][1], railPts[1][1], i / 12); railItems.unshift({ pts: rect(x - 0.11, y - 0.07, x + 0.11, y - 0.02), fill: '#4f3920', cut: false, ink: 0.005 }); }
      const midTufts = []; for (let i = 0; i < 7; i++) { const x = gr.range(1, 9.5); midTufts.push(...tuft(x, midTop(x), gr, GRASS)); }   // only on the stretch that slides into view during the flight
      const mid = cutout(duneArt({ w: FLAT.mid.w, top: midTop, color: '#a07f4a', extra: [...railItems, ...midTufts] }), { seed: 15 }); mid.position.z = Z.mid;
      const frontTop = (x) => 0.36 + 0.1 * nz.n2(x * 0.55, 9) + 0.05 * nz.n2(x * 1.6, 2);
      const frontTufts = []; for (let i = 0; i < 15; i++) { const x = -10.5 + i * 1.45 + gr.range(-0.4, 0.4); frontTufts.push(...tuft(x, frontTop(x), gr, GRASS)); }
      const front = cutout(duneArt({ w: FLAT.front.w, top: frontTop, color: '#765b34', band: 'rgba(40,26,10,0.2)', extra: frontTufts }), { seed: 16 }); front.position.z = Z.front;

      // the Flyer: one card, two propellers that really turn behind it, two rods
      const flyer = new THREE.Group(); flyer.position.z = Z.flyer; scene.add(flyer);
      cutout(FL.items, { res: 300, seed: 18, thick: 0.04, parent: flyer });
      const props = FL.props.map((c, i) => {
        const g = new THREE.Group(), R = FL.propR; g.matrixAutoUpdate = false;
        g.matrix.set(FL.ez[0] * R, FL.ey[0] * R, 0, c[0], FL.ez[1] * R, FL.ey[1] * R, 0, c[1], 0, 0, 1, 0.045 + i * 0.012, 0, 0, 0, 1);   // a circle seen at an angle is a squashed circle
        flyer.add(g); return cutout(propArt(), { res: 160, seed: 19 + i, thick: 0.02, parent: g });
      });
      const flyRods = FL.rods.map(() => add(rodGeo, steel, null, scene, false));
      // Wilbur at Kitty Hawk: coat and cap, steadying the far wingtip
      const WIL = [REST[0] + FL.ground(-1.2, -7.6)[0], REST[1] + FL.ground(-1.2, -7.6)[1]];   // just clear of the far (right) wingtip, where he stood to steady it
      const wilburK = onSlot(cutout(manArt({ h: 1.07, coat: true, cap: true, stride: 0.05, near: [0.1, 0.67, 0.25, 0.65], far: [0.11, 0.69, 0.26, 0.72] }), { seed: 21, res: 320 }), Z.men + 0.05, -1, 0.4);
      wilburK.userData.card.position.y = WIL[1]; add(new THREE.CylinderGeometry(0.012, 0.012, WIL[1], 6).translate(0, WIL[1] / 2, 0), wood, [0, 0.03, -0.03], wilburK);   // he stands on a stick behind the sand
      // wind: strips of white card on rods that stream across, right to left
      const gusts = Array.from({ length: 9 }, (_, i) => {
        const r = K.rng(40 + i), len = r.range(1.5, 2.6), ph = r.range(0, 6), line = Array.from({ length: 22 }, (_, k) => [k / 21 * len, 0.09 * Math.sin(k / 21 * 5 + ph) * (0.4 + k / 21)]);
        const g = hung(cutout([{ pts: strip(line, (u) => 0.055 * Math.pow(Math.sin(Math.PI * u), 0.7) + 0.006), fill: '#f4eedc', ink: 0 }], { seed: 30 + i, thick: 0.025 }), Z.wind + i * 0.012, [line[11]], wireGeo);
        g.userData = { t0: CUE.dunes[0] + 0.1 + i * 0.78, y: [3.2, 4.3, 2.7, 3.8, 4.6, 3.0, 4.1, 3.5, 4.4][i], v: r.range(2.6, 3.4) }; return g;
      });

      // ------------------------------------------------------------ the easel at the front of the stage: one card per scene
      const EASEL = { x: 2.55, w: 2.8, h: 1.3, y: 0.3, tilt: -0.1 }, CPX = 360, INKC = '#14110e';
      const fit = (c, text, font, maxPx, width) => { c.font = `${font} 100px "Oswald"`; return Math.min(maxPx, 100 * width / c.measureText(text).width); };
      function drawCard(c, W, H, card, nums) {
        c.fillStyle = '#e9dfc6'; c.fillRect(0, 0, W, H);
        const r = K.rng(77); for (let i = 0; i < 2600; i++) { c.fillStyle = r.chance(0.5) ? `rgba(255,250,235,${r.range(0.03, 0.08)})` : `rgba(60,40,15,${r.range(0.02, 0.06)})`; c.fillRect(r.range(0, W), r.range(0, H), r.range(1, 4), r.range(1, 4)); }
        c.strokeStyle = INKC; c.lineWidth = 6; c.strokeRect(18, 18, W - 36, H - 36); c.lineWidth = 2; c.strokeRect(30, 30, W - 60, H - 60);
        c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.fillStyle = '#8f1d15';
        c.letterSpacing = '6px'; const kp = fit(c, card.place, '700', 60, W - 170); c.font = `700 ${kp}px "Oswald"`; c.fillText(card.place, W / 2 + 3, 104); c.letterSpacing = '0px';
        c.fillRect(W / 2 - 70, 126, 140, 5);
        c.fillStyle = INKC;
        const Y = [272, 412];
        if (card.lines) card.lines.forEach((l, i) => { const px = fit(c, l, '500', 138, W - 130); c.font = `500 ${px}px "Oswald"`; c.fillText(l, W / 2, Y[i] - (138 - px) * 0.2); });
        else card.count.forEach(([, one, many], i) => {                         // number right-aligned on a fixed line, so nothing jumps as it runs
          const n = nums[i], y = Y[i], x = W * 0.42;
          c.textAlign = 'right'; c.font = '700 144px "Oswald"'; c.fillText(String(n), x, y);
          c.textAlign = 'left'; c.font = '500 106px "Oswald"'; c.fillText(n === 1 ? one : many, x + 30, y);
        });
      }
      const easel = new THREE.Group(); easel.position.set(EASEL.x, 0, Z.easel); easel.rotation.x = EASEL.tilt; scene.add(easel);
      for (const sx of [-1, 1]) { const leg = add(K.roundedBox(0.07, 1.9, 0.05, 0.012, 2), wood, [sx * 1.12, 0.93, -0.06], easel); leg.rotation.z = -sx * 0.07; }
      add(K.roundedBox(EASEL.w + 0.2, 0.05, 0.14, 0.012, 2), wood, [0, EASEL.y - 0.03, 0.03], easel);
      const edgeMat = new THREE.MeshStandardMaterial({ color: '#d9cdb0', roughness: 0.9 }), backMat = new THREE.MeshStandardMaterial({ color: '#cbbd9c', roughness: 0.95 });
      const cards = CARDS.map((card, i) => {
        const tex = K.canvasTex(EASEL.w * CPX, Math.round(EASEL.h * CPX), (c, W, H) => drawCard(c, W, H, card, [0, 0]));
        const m = add(new THREE.BoxGeometry(EASEL.w, EASEL.h, 0.014), [edgeMat, edgeMat, edgeMat, edgeMat, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 }), backMat], [0, EASEL.y + EASEL.h / 2, 0.02 * (CARDS.length - i)], easel);
        m.userData.tex = tex; return m;
      });
      let shown = '0|0';
      const counter = cards[2].userData.tex, COUNT = CARDS[2].count;

      // ------------------------------------------------------------ the prompt book, written out: where everything is at time t
      const E = K.ease, seg = K.seg, rgb = (h) => new THREE.Color(h).toArray();
      const AMBER = rgb('#ffc98a'), WARM = rgb('#ffe2bd'), COLD = rgb('#c4d6ff'), STEEL_BLUE = rgb('#8fb4ee'), WHITE = rgb('#f4f1ea'), SUN = rgb('#fff1df'), DAWN = rgb('#ffb877');
      const mix3 = (a, b, k) => [K.lerp(a[0], b[0], k), K.lerp(a[1], b[1], k), K.lerp(a[2], b[2], k)];
      const slideOff = (t, t0, dur = 0.95) => seg(t, t0, t0 + dur, E.in);
      const orvX = K.track([[0, -4.95], [CUE.enter[0], -4.95], [CUE.enter[1], -3.5, 'inOut'], [CUE.strike + 0.1, -3.5], [CUE.strike + 1.0, -8.5, 'in']]);
      const flyX = K.path([[CUE.roll, 0], [CUE.lift, 0.78], [CUE.lift + 1.2, 1.3], [CUE.flown, 1.58], [D + 0.8, 1.7]]);
      const flyY = K.path([[CUE.lift, 0], [CUE.lift + 0.6, 0.4], [CUE.lift + 1.4, 1.05], [CUE.flown, 1.45], [D + 0.8, 1.55]]);
      const pan = K.path([[CUE.lift, 0], [CUE.lift + 0.9, 0.13], [CUE.flown, 0.8], [D + 0.7, 1]]);
      const flyerAt = (t) => {                                                   // [x, y, pitch] of the lower wing's centre
        const dx = flyX(t), up = t > CUE.lift ? flyY(t) + 0.06 * Math.sin(TAU * 0.8 * (t - CUE.lift) - 1.2) * seg(t, CUE.lift + 0.3, CUE.lift + 1.1) : 0;   // the first flight pitched up and down all the way
        const drop = 5.9 * (1 - seg(t, CUE.flyer[0], CUE.flyer[1], E.out)), ts = t - CUE.flyer[1];
        const rot = 0.075 * K.smooth(CUE.lift - 0.12, CUE.lift + 0.5, t) - 0.04 * K.smooth(CUE.lift + 1.3, CUE.flown, t) + 0.022 * Math.sin(TAU * 0.8 * (t - CUE.lift)) * seg(t, CUE.lift, CUE.lift + 0.6) + (ts > 0 ? 0.014 * Math.exp(-5 * ts) * Math.sin(TAU * 2.4 * ts) : 0);
        return [REST[0] + dx, REST[1] + FL.slope * Math.min(dx, 0.78) + up + drop, rot];
      };
      const SPIN = TAU * 2.4, spin = (t) => { const u = t - CUE.props; return u <= 0 ? 0.5 : u < 1 ? SPIN * u * u / 2 : SPIN * (u - 0.5); };
      const cam = {
        pos: K.path([[0, [-0.45, 3.1, 10.5]], [4.6, [0, 3.25, 11.1]], [8.6, [0.3, 3.32, 11.05]], [D + 1, [0.6, 3.4, 10.9]]]),
        aim: K.path([[0, [-0.35, 2.5, -1.5]], [4.6, [0, 2.55, -1.5]], [8.6, [0.28, 2.58, -1.5]], [D + 1, [0.55, 2.6, -1.5]]]),
      };
      const washLevel = K.track([[0, 0.85], [CUE.strike, 0.85], [CUE.strike + 0.45, 0.25, 'inOut'], [CUE.dunes[2] + 0.6, 0.45, 'inOut'], [CUE.lift, 0.45], [CUE.lift + 1.4, 0.55, 'inOut'], [CUE.flown, 0.55], [CUE.flown + 1.0, 0.36, 'inOut']]);
      const washTint = K.track([[0, AMBER], [CUE.strike, AMBER], [CUE.strike + 0.9, COLD, 'inOut'], [CUE.lift, COLD], [CUE.lift + 1.6, SUN, 'inOut']]);
      const horizonLevel = K.track([[0, 0], [CUE.strike + 0.1, 0], [CUE.strike + 1.0, 3.4, 'inOut'], [CUE.lift, 3.4], [CUE.lift + 1.6, 5.5, 'inOut'], [CUE.flown, 5.5], [CUE.flown + 1.0, 4.2, 'inOut']]);
      const horizonTint = K.track([[0, STEEL_BLUE], [CUE.lift, STEEL_BLUE], [CUE.lift + 1.6, DAWN, 'inOut']]);

      return {
        update(t) {
          // the house curtain is already open: its hem is still swinging to rest as the clip starts
          const lag = 0.14 * Math.exp(-2.2 * t) * Math.sin(TAU * 0.85 * t + 0.6);
          curtains[0].userData.set(OPEN_X, lag); curtains[1].userData.set(OPEN_X, lag);
          K.look(camera, cam.pos(t), cam.aim(t)); K.focus(camera, [0, 2.5, -1.5], 0.01);

          // ---- scene 1 and its strike
          const part = seg(t, CUE.strike, CUE.strike + 1.05, E.inOut);
          wallL.position.x = -5.8 * part; wallR.position.x = 6.6 * part;
          const ox = orvX(t), ov = (orvX(t + 0.02) - orvX(t - 0.02)) / 0.04;
          orville.position.x = ox; orville.userData.card.rotation.z = -0.012 * ov * Math.sin(TAU * 2.6 * t);          // a pushed slider rocks a little
          const wOff = slideOff(t, CUE.strike + 0.15);
          wilbur.position.x = 1.05 + 6.6 * wOff; wilbur.userData.card.rotation.z = 0.03 * Math.sin(TAU * 2.6 * t) * Math.sin(Math.PI * wOff) + 0.012 * Math.sin(TAU * 0.5 * t) * (1 - wOff);
          bench.position.x = BENCH_X - 7.2 * slideOff(t, CUE.strike + 0.25);
          const flyOut = 6.2 * seg(t, CUE.strike + 0.05, CUE.strike + 0.95, E.in);
          frames.forEach((g, k) => {
            const t0 = k ? CUE.frame[k - 1] : -1, ts = t - t0 - 0.5;
            g.position.y = FRAME_AT[1] + 5.6 * (1 - seg(t, t0, t0 + 0.5, E.out)) + flyOut;
            g.rotation.z = ts > 0 ? 0.02 * Math.exp(-4.5 * ts) * Math.sin(TAU * 2.2 * ts) : 0;                          // it settles on the bench with a small rock
          });
          bike.position.y = 3.0 + flyOut * 1.05; bike.rotation.z = 0.012 * Math.sin(TAU * 0.35 * t + 1);

          // ---- scene 2 arrives: sand from the right, the Flyer from above, Wilbur along his slot
          const p = t > CUE.lift ? pan(t) : 0;
          [[far, FLAT.far, 0], [mid, FLAT.mid, 1], [front, FLAT.front, 2]].forEach(([m, f, i]) => { m.position.x = f.x + 15 * (1 - seg(t, CUE.dunes[i], CUE.dunes[i] + 1.25, E.outQuint)) - f.pan * p; });
          const [fx, fy, frot] = flyerAt(t);
          flyer.position.x = fx; flyer.position.y = fy; flyer.rotation.z = frot;
          const a = spin(t); props.forEach((m, i) => { m.rotation.z = a * (i ? -1 : 1) + i * 0.9; });                  // the two propellers turned in opposite directions
          const cs = Math.cos(frot), sn = Math.sin(frot);
          flyRods.forEach((r, i) => { const q = FL.rods[i]; r.position.set(fx + q[0] * cs - q[1] * sn, fy + q[0] * sn + q[1] * cs, Z.flyer - 0.03); });
          const run = Math.min(flyX(t), 1.0), wx = WIL[0] - 4.5 * (1 - seg(t, CUE.wilbur[0], CUE.wilbur[1], E.out)) + run - FLAT.mid.pan * p;   // he runs with it along the rail, then the ground carries him away
          wilburK.position.x = wx; wilburK.userData.card.rotation.z = 0.035 * Math.sin(TAU * 3 * t) * seg(t, CUE.roll, CUE.roll + 0.3) * (1 - seg(t, CUE.lift + 0.5, CUE.lift + 1.2));
          gusts.forEach((g) => { const u = g.userData; g.position.x = 8.5 - u.v * (t - u.t0); g.position.y = u.y + 0.06 * Math.sin(t * 1.7 + u.y * 3); g.visible = t > u.t0; });

          // ---- the easel: the front card is pulled away to the right, showing the next
          cards.forEach((m, i) => { m.position.x = i < 2 ? 5 * seg(t, CUE.card[i], CUE.card[i] + 0.5, E.in) : 0; });
          const u = seg(t, CUE.lift, CUE.flown), key = COUNT.map(([n]) => Math.floor(n * u + 1e-6)).join('|');   // whole seconds and whole feet so far
          if (key !== shown) { shown = key; const nums = key.split('|').map(Number); counter.redraw((c, W, H) => drawCard(c, W, H, CARDS[2], nums)); }

          // ---- the lighting plot: the lamps follow the action and take the colour of the scene
          const toFlyer = K.smooth(CUE.strike + 0.1, CUE.flyer[0] + 0.25, t), inAir = seg(t, CUE.lift, CUE.lift + 1.2, E.inOut), last = seg(t, CUE.flown, CUE.flown + 1.0, E.inOut);
          const onFrame = [-1.1, 1.75 + flyOut * 0.75, Z.frame], onFlyer = [fx + 0.15, fy + 0.6, Z.flyer];
          follow.set(mix3(onFrame, onFlyer, toFlyer), K.lerp(1, 0.55, Math.sin(Math.PI * seg(t, CUE.strike, CUE.flyer[0] + 0.3))) * (1 + 0.15 * last),
            { color: mix3(WARM, WHITE, toFlyer), angle: K.lerp(0.14, 0.175, toFlyer) });
          const toWil = K.smooth(CUE.strike + 0.2, CUE.wilbur[0] + 0.4, t);
          follow2.set(mix3([ox, 1.75, Z.men], [wx, WIL[1] + 0.6, Z.men], toWil), (0.25 + 0.6 * seg(t, CUE.enter[0], CUE.enter[0] + 0.5)) * (1 - 0.85 * Math.sin(Math.PI * seg(t, CUE.strike, CUE.wilbur[0] + 0.5))) * (1 - seg(t, CUE.lift + 1.0, CUE.lift + 2.2)),
            { color: mix3(WARM, WHITE, toWil), angle: K.lerp(0.085, 0.05, toWil), reach: 1.2 });
          const wl = washLevel(t), wc = washTint(t);
          wash.forEach((L, i) => L.set([(i ? -1 : 1) * 1.6, 2.4, -1.6], wl, { color: wc }));   // crossed: each lights the far side of the stage
          top.set(mix3([BENCH_X + 0.2, 0.9, Z.bench - 0.1], [fx + 0.1, fy + 0.3, Z.flyer + 0.05], toFlyer), K.lerp(1, 0.25, Math.sin(Math.PI * seg(t, CUE.strike, CUE.flyer[0] + 0.4))) * K.lerp(1, 0.75, toFlyer),
            { color: mix3(mix3(AMBER, COLD, toFlyer), SUN, inAir), angle: K.lerp(0.17, 0.2, toFlyer), reach: K.lerp(8, 1.6, K.smooth(CUE.flyer[1], CUE.flyer[1] + 0.6, t)) });
          cardLamp.set([EASEL.x, EASEL.y + EASEL.h / 2, Z.easel], 0.62, { color: WARM });
          const hl = horizonLevel(t), hc = horizonTint(t); horizon.forEach((l) => { l.intensity = hl; l.color.setRGB(hc[0], hc[1], hc[2]); });

          lamps.forEach((L, i) => {
            L.uni.uTime.value = t; L.uni.uSeed.value = (t * 977) % 61;
            dustU.uA.value[i].copy(L.apex); dustU.uD.value[i].copy(L.dir); dustU.uC.value[i].copy(L.color).multiplyScalar(L.level * (L.o.dust == null ? 1 : L.o.dust) * 5);
            dustU.uK.value[i].set(L.cosO, L.cosI, L.uni.uNear.value);
          });
          dustU.uTime.value = t;
        },
      };
    },

    sound(k) {
      const r = globalThis.K.rng(4), bar = (a, b) => 240 / (b - a);   // one held chord per scene
      k.bed('room', 0, D, { gain: 0.9 });
      k.music('pad', 0, CUE.strike + 0.3, { bpm: bar(0, CUE.strike + 0.3), chords: [['F3', 'C4', 'A4', 'E4']], gain: 1.0 });
      k.music('pad', CUE.strike + 0.3, CUE.roll, { bpm: bar(CUE.strike + 0.3, CUE.roll), chords: [['D3', 'A3', 'F4', 'E4']], gain: 0.75 });
      k.music('pad', CUE.roll, CUE.lift, { bpm: bar(CUE.roll, CUE.lift), chords: [['G3', 'D4', 'G4', 'B4']], gain: 0.8 });
      k.music('pad', CUE.lift, D, { bpm: bar(CUE.lift, D), chords: [['C3', 'G3', 'E4', 'C5']], gain: 0.8 });
      // scene 1: a slider pushed along its slot, wing sections seated on the bench
      k.play('thud', 0.02, { gain: 0.2, f: 70 });
      k.play('roller', CUE.enter[0], { dur: CUE.enter[1] - CUE.enter[0], gain: 0.16, pan: -0.5 }); k.play('tock', CUE.enter[1], { gain: 0.35, f: 300, pan: -0.2 });
      CUE.frame.forEach((t, i) => { k.play('swish', t + 0.1, { dur: 0.3, gain: 0.2, pan: 0.1 + i * 0.2 }); k.play('tock', t + 0.46, { gain: 0.6, f: 560 + i * 90, pan: 0.1 + i * 0.2 }); k.play('click', t + 0.47, { gain: 0.5, pan: 0.1 + i * 0.2 }); });
      // the change: lamps clunk over, flats and sliders run off, rods run up, sand runs in, the card is pulled
      k.play('stamp', CUE.strike, { gain: 0.55 }); k.play('buzz', CUE.strike, { dur: 0.25, gain: 0.22, f: 98 });
      k.play('roller', CUE.strike + 0.05, { dur: 1.1, gain: 0.24 }); k.play('whoosh', CUE.strike + 0.1, { dur: 1.0, gain: 0.22, top: 1500 }); k.play('swish', CUE.strike + 0.3, { dur: 0.6, gain: 0.18 });
      CUE.dunes.forEach((t, i) => { k.play('whoosh', t, { dur: 0.9, gain: 0.2, top: 900 + i * 250, pan: 0.5 - i * 0.2 }); k.play('thud', t + 0.85, { gain: 0.22 + i * 0.05, f: 95, pan: 0.2 - i * 0.2 }); });
      CUE.card.forEach((t) => { k.play('paper', t, { dur: 0.4, gain: 0.8, pan: 0.5 }); k.play('swish', t + 0.1, { dur: 0.3, gain: 0.2, pan: 0.6 }); });
      k.play('swish', CUE.flyer[0] + 0.1, { dur: 0.7, gain: 0.22 }); k.play('tock', CUE.flyer[1] - 0.12, { gain: 0.6, f: 240 }); k.play('thud', CUE.flyer[1] - 0.12, { gain: 0.3, f: 110 });
      k.play('roller', CUE.wilbur[0], { dur: CUE.wilbur[1] - CUE.wilbur[0], gain: 0.12, pan: 0.5 });
      // Kitty Hawk: wind over the dunes, and a small engine that catches, runs and pulls
      k.noise(CUE.dunes[0], { dur: D - CUE.dunes[0], color: 'pink', filter: 'bandpass', f: [[0, 420], [1.5, 900], [3, 600], [4.6, 1200], [6.5, 700], [8.4, 950]], q: 0.7, gain: 0.07, a: 1.2, hold: D - CUE.dunes[0] - 2, bus: 'amb' });
      k.play('click', CUE.props, { gain: 0.6 });
      k.withMinor(() => { let t = CUE.props; while (t < D - 0.05) { const u = Math.min(1, (t - CUE.props) / 0.9), pull = globalThis.K.smooth(CUE.roll - 0.2, CUE.lift, t), fade = 1 - 0.45 * globalThis.K.smooth(CUE.flown, D, t), g = (0.06 + 0.05 * u + 0.06 * pull) * fade * r.range(0.8, 1); k.tone(t, { f: [[0, 105 + 25 * pull], [0.04, 62]], type: 'sawtooth', dur: 0.06, gain: g, filter: 'lowpass', f2: 620 + 300 * pull, pan: 0.1 }); k.noise(t, { dur: 0.02, filter: 'bandpass', f: 1300, q: 1, gain: g * 0.5, pan: 0.1 }); t += 0.16 - 0.085 * u - 0.012 * pull; } });
      // scene 3: along the rail, off it, and the count
      k.play('roller', CUE.roll, { dur: CUE.lift - CUE.roll, gain: 0.2 }); k.play('riser', CUE.roll + 0.1, { dur: CUE.lift - CUE.roll - 0.1, gain: 0.5 });
      k.play('whoosh', CUE.lift - 0.05, { dur: 1.1, gain: 0.3, top: 2200 }); k.play('ding', CUE.lift, { gain: 0.4, f: 'G5' });
      const n = CARDS[2].count[0][0]; for (let i = 1; i <= n; i++) { const t = CUE.lift + (CUE.flown - CUE.lift) * i / n; k.play('tick', t, { gain: 0.5, f: 3000 + i * 110, pan: 0.5 }); k.play('tock', t, { gain: 0.16, f: 700 + i * 22, pan: 0.5 }); }
      ['C4', 'G4', 'C5', 'E5'].forEach((nn, i) => k.tone(CUE.flown, { f: nn, type: 'sawtooth', dur: 1.7, gain: 0.032, a: 0.04, hold: 0.8, filter: 'lowpass', f2: [[0, 800], [0.2, 2200], [1.5, 800]], pan: (i - 1.5) * 0.25, verb: 0.35 }));
      k.play('success', CUE.flown, { gain: 0.55, f: 'C6' }); k.play('sparkle', CUE.flown + 0.12, { gain: 0.6, n: 6 });
    },
  });
}
```
