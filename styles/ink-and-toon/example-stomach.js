// styles/ink-toon-stomach.js: "Ink and Toon" explainer. Topic: gain weight by eating more, training your stomach the
// way competitive eaters do. Classic script; needs the STAGE kit (K, registerStyle) loaded first. inkKit() below is the
// reference's look kit, unchanged; the content, the objects and the moves are new.
{
  // ---------------------------------------------------------------- content (change this for a new topic)
  const BEATS = [
    { n: '', word: 'STUFFED?', note: 'full after a few bites' },
    { n: '1', word: 'STRETCH', note: 'a little more each week' },
    { n: '2', word: 'PACK', note: 'dense calories', sum: '= +500 kcal a day' },
  ];
  const ENDING = { word: 'GAIN!', note: 'up to +0.5 kg a week' };
  // USDA FoodData Central: 28 g almonds 162 kcal, 2 tbsp (32 g) peanut butter 190 kcal, 1 cup (244 g) whole milk 149 kcal
  const FOODS = [{ name: 'almonds', kcal: '+160 kcal' }, { name: 'peanut butter', kcal: '+190 kcal' }, { name: 'whole milk', kcal: '+150 kcal' }];
  const WEEKS = ['1', '2', '3', '4'];
  const DIAL = { lo: '0', hi: '+0.5', unit: 'kg' };
  // narration (ElevenLabs); start times sit on the drawing grid of the beat they belong to
  const VO = [
    { t: 0.2, text: "Can't gain weight? Your stomach fills up too fast." },
    { t: 3.4, text: 'So train it like competitive eaters do: a little more food every week.' },
    { t: 7.4, text: 'Then fill that space with dense calories: nuts, peanut butter, whole milk.' },
    { t: 12.2, text: "Five hundred extra a day, and that's up to half a kilo a week." },
  ];

  // ---------------------------------------------------------------- the print palette
  const INK = '#1c1622', PAPER = '#f7ecd6';
  const PAL = {
    teal: { lit: '#2a9d94', shade: '#1c7376', deep: '#12565c' },
    tealDot: { lit: '#3db0a4', shade: '#1c7376', deep: '#12565c' },
    cream: { lit: '#f7e8cc', shade: '#b3c9bd' },
    paper: { lit: '#fffdf6', shade: '#c9dcd4' },
    persimmon: { lit: '#ee5a36', shade: '#ae2f33', gloss: '#ffd2bd' },
    mustard: { lit: '#f6b63c', shade: '#c9722c', gloss: '#fff1c4' },
    navy: { lit: '#3b4568', shade: '#222641', gloss: '#b4c0e6' },
    bean: { lit: '#6a3d27', shade: '#3c221b', gloss: '#d9a37a' },
    water: { lit: '#effbf6', shade: '#9fd8cf' },
    gut: { lit: '#f2796a', shade: '#b63f4d', gloss: '#ffe0d6' },        // the stomach: persimmon pulled towards pink
    almond: { lit: '#c98a4b', shade: '#874b2b', gloss: '#f4d3a8' },
    pb: { lit: '#c07a3c', shade: '#7e4426', gloss: '#f2c48e' },
  };

  // ---------------------------------------------------------------- timing
  // Props move on twos (15 drawings a second); every event sits on that grid so picture and sound land together.
  const DPS = 15, F = 1 / DPS, at = (n) => n / DPS;
  const B2 = 48, B3 = 108, B4 = 180, END = 246;            // beat starts and the end, in drawings
  const T = {
    bite: [6, 14, 22].map(at), stuffed: at(29), lab1: at(30),
    cut2: at(B2), cal: at(B2 + 1), lab2: at(B2 + 4), week: [B2 + 12, B2 + 26, B2 + 40].map(at),
    cut3: at(B3), drop: [B3 + 2, B3 + 4, B3 + 6].map(at), lab3: at(B3 + 4), tag: [B3 + 9, B3 + 12, B3 + 15].map(at), feed: [B3 + 20, B3 + 32, B3 + 44].map(at), sum: at(B3 + 58),
    cut4: at(B4), hop: at(B4 + 3), land: at(B4 + 9), lab4: at(B4 + 12), ting: at(B4 + 24),
  };
  const DURATION = END / DPS;
  const BITE_FLY = 4 * F, FEED_FLY = 5 * F, GULP = 3 * F;   // flight into the gullet, then the swallow down to the stomach
  const SIZES = [0.75, 0.86, 0.97, 1.08];                  // stomach size in each week
  const arriveBite = T.bite.map((t) => t + BITE_FLY), puffAt = arriveBite.map((t) => t + GULP);
  const weekBite = T.week.map((t) => t + F), arriveWeek = weekBite.map((t) => t + BITE_FLY), stretchAt = arriveWeek.map((t) => t + GULP);
  const arriveFeed = T.feed.map((t) => t + FEED_FLY), feedAt = arriveFeed.map((t) => t + GULP);

  // ---------------------------------------------------------------- the look, as reusable pieces (reference kit, unchanged)
  function inkKit(S, o = {}) {
    const { THREE, K } = S, px = S.H / 1080;
    const G = { res: { value: new THREE.Vector2(S.W, S.H) }, light: { value: new THREE.Vector3(0, 1, 0) }, up: { value: new THREE.Vector3(0, 1, 0) }, seed: { value: 0 }, pitch: { value: (o.pitch || 11) * px } };
    const srgb = (hex) => new THREE.Vector3(parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255);

    // One hard sun. Its direction is the "hand-placed shadow shape": low and from the side gives big readable shadows.
    const sun = K.sun(S, { pos: o.sun || [-6.2, 6.2, 4.8], target: o.sunTarget || [0.3, 1, 0], power: Math.PI, size: o.sunSize || 6.5, mapSize: 4096, normalBias: 0.03 });

    // FILL. MeshToonMaterial with a plain 0..1 ramp as its gradient map, so three.js hands us one number per pixel:
    // how lit it is (half-Lambert times the cast shadow). The patch turns that number into print: lit colour, shadow
    // colour, a band of halftone dots where light turns into shadow, optional hatching inside the shadow, and a
    // hard-edged highlight (a round glint, or a vertical streak down turned shapes).
    const ramp = new THREE.DataTexture(new Uint8Array(1024).map((_, i) => (i % 4 === 3 ? 255 : i >> 2)), 256, 1);
    ramp.minFilter = ramp.magFilter = THREE.LinearFilter; ramp.needsUpdate = true;
    const FILL_PARS = `
      uniform vec3 uLit, uShade, uDeep, uGloss, uUp; uniform float uThr, uBand, uPitch, uHatch, uGlossSize, uStreak;`;
    const FILL_MAIN = `{
      float v = outgoingLight.r;                                            // 0 = in shadow, 1 = facing the light
      float k = clamp((v - uThr) / max(uBand, 1e-4), 0.0, 1.0);             // 0 at the shadow edge, 1 in full light
      vec2 g = mat2(0.819, 0.574, -0.574, 0.819) * gl_FragCoord.xy / uPitch;   // dot screen, turned 35 degrees, fixed to the page
      float rad = 0.74 * (1.0 - k), aa = 0.8 / uPitch;                      // dots grow until they merge into solid shadow
      float tone = v < uThr ? 1.0 : (1.0 - smoothstep(rad - aa, rad + aa, length(fract(g) - 0.5))) * step(k, 0.999);
      vec3 c = mix(uLit, uShade, tone);
      if (uHatch > 0.0) {                                                   // pen hatching inside the shadow
        float sp = uPitch * 1.3, h = abs(fract((gl_FragCoord.x + gl_FragCoord.y) / sp) - 0.5) * sp;
        float lw = uHatch * (0.75 + 0.5 * sin(gl_FragCoord.x * 0.011 - gl_FragCoord.y * 0.017));
        c = mix(c, uDeep, (1.0 - smoothstep(lw - 0.7, lw + 0.7, h)) * step(v, uThr));
      }
      #if NUM_DIR_LIGHTS > 0
        vec3 hv = normalize(directionalLights[0].direction + normalize(vViewPosition));
        float lit = step(uThr + uBand, v);
        if (uGlossSize > 0.0) c = mix(c, uGloss, step(1.0 - uGlossSize, dot(normal, hv)) * lit);
        if (uStreak > 0.0) {                                                // the long glint down a turned shape
          float ny = dot(normal, uUp); vec3 nh = normalize(normal - uUp * ny), hh = normalize(hv - uUp * dot(hv, uUp));
          c = mix(c, uGloss, step(1.0 - uStreak, dot(nh, hh)) * step(abs(ny), 0.55) * lit);
        }
      #endif
      outgoingLight = c;
    }`;
    function fill(c, f = {}) {
      const m = new THREE.MeshToonMaterial({ color: '#ffffff', gradientMap: ramp, side: f.side || THREE.FrontSide });
      const u = m.userData.u = { uLit: { value: new THREE.Color(c.lit) }, uShade: { value: new THREE.Color(c.shade) }, uDeep: { value: new THREE.Color(c.deep || c.shade) }, uGloss: { value: new THREE.Color(c.gloss || '#ffffff') },
        uUp: G.up, uPitch: G.pitch, uThr: { value: f.thr == null ? 0.56 : f.thr }, uBand: { value: f.band == null ? 0.1 : f.band }, uHatch: { value: (f.hatch || 0) * px }, uGlossSize: { value: f.gloss || 0 }, uStreak: { value: f.streak || 0 } };
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, u);
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + FILL_PARS).replace('#include <opaque_fragment>', FILL_MAIN + '\n#include <opaque_fragment>');
      };
      return m;
    }

    // OUTLINE: the inverted hull. A back-faced copy of the mesh in ink, pushed outwards along its normals by a number
    // of screen pixels. The push is not even: it swells on the side away from the light, thins towards the light and
    // wavers along the form, like a brush line. Needs smooth normals (turned, rounded and tube shapes all have them).
    function hull(width, color) {
      return new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: { uRes: G.res, uLight: G.light, uSeed: G.seed, uWidth: { value: width * px }, uColor: { value: new THREE.Color(color) } },
        vertexShader: `uniform vec2 uRes; uniform vec3 uLight; uniform float uWidth, uSeed;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vec3 n = normalize(normalMatrix * normal);
            float waver = 0.6 * sin(dot(position, vec3(7.1, 5.3, 6.7)) + uSeed * 2.1) + 0.4 * sin(dot(position, vec3(-17.3, 12.9, 15.1)) + uSeed * 5.3);
            float w = uWidth * (1.0 + 0.3 * waver) * mix(0.55, 1.45, smoothstep(-0.6, 0.8, -dot(n, uLight)));
            // surfaces that face the ground come a little towards the lens, so the line survives where a prop stands on it
            mv.xyz *= 1.0 - 0.006 * smoothstep(0.85, 1.0, -normalize(mat3(modelMatrix) * normal).y);
            gl_Position = projectionMatrix * mv;
            gl_Position.xy += n.xy / max(length(n.xy), 0.35) * w * 2.0 / uRes * gl_Position.w;
          }`,
        fragmentShader: 'uniform vec3 uColor; void main() { gl_FragColor = vec4(uColor, 1.0); }',
      });
    }
    const outline = (mesh, width = 4.2, color = INK) => { const h = new THREE.Mesh(mesh.geometry, hull(width, color)); h.frustumCulled = false; mesh.add(h); return mesh; };
    // a filled, outlined, shadow-casting solid: the basic building block
    const solid = (geo, mat, parent, f = {}) => { const m = new THREE.Mesh(geo, mat); m.castShadow = f.cast !== false; m.receiveShadow = true; if (f.line !== 0) outline(m, f.line); if (parent) parent.add(m); return m; };

    const flat = (color) => new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
    // INNER LINES: a thin ink line round a turned shape at height y, drawn only part of the way (angles in degrees,
    // 0 = right, 90 = towards the camera) so it breaks off on the lit side. Thinner than the outline on purpose.
    const crease = (parent, r, y, a0 = -70, a1 = 105, w = 0.0085) => { const n = 28, pts = Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [Math.cos(a) * r, y, Math.sin(a) * r]; });
      const m = new THREE.Mesh(K.tube(pts, w, { segments: 56, radial: 5 }), flat(INK)); parent.add(m); return m; };

    // TURNED SHAPES: a profile of [radius, height] points, corners softened, spun round the axis. Draw the profile from
    // the bottom of the axis, out, up the outside, over the lip and back down the inside, so the shape is closed.
    const soften = (pts, n = 2) => { for (; n > 0; n--) { const q = [pts[0]]; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]); } q.push(pts[pts.length - 1]); pts = q; } return pts; };
    const turned = (pts, seg = 64, n = 2) => new THREE.LatheGeometry(soften(pts, n).map(([r, y]) => new THREE.Vector2(r, y)), seg);

    // MARKS: brush strokes as flat geometry (speed lines, impact bursts, steam, arrows). strokes([[points, width,
    // taper], ...]) -> one geometry in the XY plane; taper 'both' | 'head' | 'tail' | 'none' thins the ends like a brush.
    function strokes(list, grow = 0) {
      const pos = [], idx = [];
      for (let [pts, w, taper = 'both'] of list) {
        while (pts.length < 5) pts = pts.flatMap((p, i) => (i ? [[(p[0] + pts[i - 1][0]) / 2, (p[1] + pts[i - 1][1]) / 2], p] : [p]));   // short strokes need points to taper over
        const n = pts.length, base = pos.length / 3;
        for (let i = 0; i < n; i++) {
          const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, u = i / (n - 1);
          const k = taper === 'both' ? Math.pow(Math.sin(Math.PI * u), 0.5) : taper === 'head' ? Math.pow(1 - u, 0.6) : taper === 'tail' ? Math.pow(u, 0.6) : 1;
          const hw = (w * k + grow * Math.min(1, k * 3)) / 2;
          pos.push(pts[i][0] - dy / l * hw, pts[i][1] + dx / l * hw, 0, pts[i][0] + dy / l * hw, pts[i][1] - dx / l * hw, 0);
          if (i < n - 1) idx.push(base + 2 * i, base + 2 * i + 1, base + 2 * i + 2, base + 2 * i + 1, base + 2 * i + 3, base + 2 * i + 2);
        }
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); return g;
    }
        // an ink mark, or (with a colour) a coloured mark with an ink edge
    function mark(list, color, edge = 0.03) {
      const g = new THREE.Group();
      if (!color) { g.add(new THREE.Mesh(strokes(list), flat(INK))); return g; }
      g.add(new THREE.Mesh(strokes(list, edge * 2), flat(INK)));
      const top = new THREE.Mesh(strokes(list), flat(color)); top.position.z = 0.004; g.add(top);
      return g;
    }
    const arc = (r, a0, a1, n = 24, ry = r) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [Math.cos(a) * r, Math.sin(a) * ry]; });
    // radial impact ticks around an ellipse
    const burst = (n, rx, ry, len, w, seed = 1) => { const r = K.rng(seed); return Array.from({ length: n }, (_, i) => { const a = (i + r.range(-0.25, 0.25)) / n * Math.PI * 2, l = len * r.range(0.6, 1.25), c = Math.cos(a), s = Math.sin(a); return [[[c * rx, s * ry], [c * (rx + l * 0.5), s * (ry + l * 0.5)], [c * (rx + l), s * (ry + l)]], w, 'head']; }); };

    // LETTERING: display type drawn like a comic sound effect: slanted, cream face with a dot-screen fade, heavy ink
    // edge and a solid colour block behind it. Returns a flat mesh; `height` is the world height of a capital.
    function lettering(text, f = {}) {
      const fpx = 260, font = `${fpx}px "Anton"`, sk = -0.13, dep = 26, lw = 30, pad = 54, ls = '10px';
      const m = document.createElement('canvas').getContext('2d'); m.font = font; m.letterSpacing = ls;
      const mt = m.measureText(text), asc = Math.ceil(mt.actualBoundingBoxAscent), W = Math.ceil(mt.width + pad * 2 + dep + asc * -sk), H = asc + pad * 2 + dep, x = pad, y = pad + asc;
      const prep = (c) => { c.font = font; c.letterSpacing = ls; c.lineJoin = 'round'; c.textBaseline = 'alphabetic'; c.setTransform(1, 0, sk, 1, -sk * y, 0); c.lineWidth = lw; c.strokeStyle = INK; };
      const tex = K.canvasTex(W, H, (ctx) => {
        prep(ctx);
        for (let k = dep; k >= 0; k -= 2) ctx.strokeText(text, x + k, y + k);                    // ink round the whole block
        ctx.fillStyle = f.block || PAL.persimmon.lit; for (let k = dep; k > 0; k -= 1) ctx.fillText(text, x + k, y + k);   // the block
        ctx.strokeText(text, x, y); ctx.fillStyle = f.face || PAPER; ctx.fillText(text, x, y);   // the face
        const dots = document.createElement('canvas'); dots.width = W; dots.height = H; const d = dots.getContext('2d');   // dot-screen fade up from the baseline
        d.fillStyle = f.dots || PAL.mustard.lit;
        for (let j = -2; j < H / 13 + 2; j++) for (let i = -2; i < W / 13 + 2; i++) { const cx = i * 15 + (j % 2) * 7.5, cy = j * 13, r = 9.4 * K.clamp((cy - (y - asc * 0.62)) / (asc * 0.6)); if (r > 0.5) { d.beginPath(); d.arc(cx, cy, r, 0, 7); d.fill(); } }
        prep(d); d.globalCompositeOperation = 'destination-in'; d.fillStyle = '#000'; d.fillText(text, x, y);
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(dots, 0, 0);
      });
      const unit = (f.height || 0.6) / asc, mesh = new THREE.Mesh(new THREE.PlaneGeometry(W * unit, H * unit), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
      mesh.userData.size = [W * unit, H * unit]; return mesh;
    }
    // the step number in a starburst
    function badge(text, f = {}) {
      const tex = K.canvasTex(420, 420, (ctx) => {
        const r = K.rng(text + 'b'); ctx.translate(210, 210); ctx.lineJoin = 'round';
        ctx.beginPath(); for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, rr = (i % 2 ? 142 : 188) * r.range(0.95, 1.05); ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath();
        ctx.save(); ctx.translate(12, 14); ctx.fillStyle = INK; ctx.fill(); ctx.restore();
        ctx.fillStyle = f.color || PAL.mustard.lit; ctx.fill(); ctx.lineWidth = 15; ctx.strokeStyle = INK; ctx.stroke();
        ctx.font = '230px "Anton"'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = INK; ctx.fillText(text, 0, 84);
      });
      const s = f.height || 0.8; return new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    }
    // a caption box, as in a graphic novel: hand-written note on a slip of paper with an inked edge
    function caption(text, f = {}) {
      const fpx = 150, font = `700 ${fpx}px "Caveat"`, m = document.createElement('canvas').getContext('2d'); m.font = font;
      const tw = Math.ceil(m.measureText(text).width), bw = tw + 110, bh = 190, W = bw + 60, H = bh + 60;
      const tex = K.canvasTex(W, H, (ctx) => {
        const r = K.rng(text), j = () => r.range(-7, 7), box = (dx, dy) => { ctx.beginPath(); ctx.moveTo(20 + dx + j(), 20 + dy + j()); ctx.lineTo(20 + bw + dx + j(), 20 + dy + j()); ctx.lineTo(20 + bw + dx + j(), 20 + bh + dy + j()); ctx.lineTo(20 + dx + j(), 20 + bh + dy + j()); ctx.closePath(); };
        ctx.lineJoin = 'round'; box(14, 16); ctx.fillStyle = INK; ctx.fill();
        box(0, 0); ctx.fillStyle = PAPER; ctx.fill(); ctx.lineWidth = 11; ctx.strokeStyle = INK; ctx.stroke();
        ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = INK; ctx.fillText(text, 20 + bw / 2, 20 + bh / 2 + 6);
      });
      const unit = (f.height || 0.42) / bh, mesh = new THREE.Mesh(new THREE.PlaneGeometry(W * unit, H * unit), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
      mesh.userData.size = [W * unit, H * unit]; return mesh;
    }

    // PRINT FINISH: a filter over the finished picture. Edges wander by about a pixel and are "redrawn" a few times a
    // second (line boil), paper tooth and fibres multiply through the colour, tiny pinholes where ink did not take,
    // and a hand-ruled panel border with bare paper outside it.
    function print(f = {}) {
      return S.addFilter(`uniform vec3 uPaper, uInk; uniform float uBoil, uBorder;
        float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
        float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
        void main(){
          float s = res.y / 1080.0; vec2 px = vUv * res; float b = floor(time * uBoil);
          vec2 w = (vec2(vn(px / (42.0 * s) + b * 7.31), vn(px / (42.0 * s) + 19.7 - b * 3.17)) - 0.5) * 3.0 * s;
          vec3 c = texture2D(tex, (px + w) / res).rgb;
          if (uBorder > 0.0) {
            vec2 q = abs(px + w * 1.6 - res * 0.5) - (res * 0.5 - (uBorder + 16.0) * s);
            float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 16.0 * s, lw = (2.6 + 1.5 * vn(px / (120.0 * s))) * s;
            c = mix(c, uInk, 1.0 - smoothstep(lw - 0.8, lw + 0.8, abs(d)));
            c = mix(c, uPaper, smoothstep(lw - 0.6, lw + 0.8, d));
          }
          float tooth = 0.6 * vn(px / (1.8 * s)) + 0.4 * vn(px / (6.0 * s)), fibre = vn(px * vec2(0.03, 0.8) / s + 3.0);
          c *= mix(vec3(1.0), uPaper, 0.3) * (0.95 + 0.07 * tooth + 0.025 * fibre);
          c = mix(c, uPaper, 0.4 * step(0.9988, h21(floor(px / (2.0 * s)) + 5.0)));
          gl_FragColor = vec4(c, 1.0);
        }`, { uPaper: { value: srgb(PAPER) }, uInk: { value: srgb(INK) }, uBoil: { value: f.boil == null ? 6 : f.boil }, uBorder: { value: f.border == null ? 26 : f.border } });
    }

    // call once per update(t), after the camera is placed: gives the outline and the fills the light and "up" in view space
    const frame = (t, camera) => {
      camera.updateMatrixWorld();
      G.light.value.copy(sun.position).sub(sun.target.position).normalize().transformDirection(camera.matrixWorldInverse);
      G.up.value.set(0, 1, 0).transformDirection(camera.matrixWorldInverse);
      G.seed.value = Math.floor(t * 6);
    };
    return { G, sun, fill, outline, solid, turned, crease, strokes, mark, arc, burst, lettering, badge, caption, print, frame, flat };
  }

  registerStyle({
    id: 'ink-toon-stomach',
    name: 'Ink and Toon',
    family: 'Filters over 3D',
    look: 'Real 3D that reads as a hand-inked animation cel: flat colour in two tones, a brush line round every shape, halftone dots where light turns to shadow and pen hatching inside cast shadows, printed on warm paper inside a ruled panel.',
    motion: 'Snap, not glide. Props are drawn on twos (15 drawings a second) and jump between held poses with a stretched in-between, an overshoot and a quick settle; speed lines, impact ticks and steam squiggles are drawn in for two or three frames. The camera alone moves on every frame.',
    light: 'One hard sun, low and from the side, placed for the shape of the shadow rather than for realism. No fill light: the shadow colour of each material is picked by hand, shifted towards the cool ground colour.',
    materials: 'No textures. Each material is a lit colour, a shadow colour and, on glossy things, one hard white glint. Paper, one ink and four spot colours do everything.',
    camera: 'Long lens, looking down at a table-top from the front. It drifts slowly while a pose is held and whips to the next framing in a third of a second, one framing per step.',
    post: 'No blur, bloom or grain. A print filter lets every edge wander by a pixel and re-draws it six times a second, multiplies paper tooth through the colour and rules an ink border round the panel.',
    explains: 'Steps, recipes and how-tos with a few recognisable objects: each step is one bold action on the same hero object, named by a big lettered word and a hand-written caption box.',
    topic: 'Gain weight by eating more: train your stomach the way competitive eaters do',
    duration: DURATION,
    vo: VO,
    fonts: ['260px "Anton"', '700 150px "Caveat"'],
    render: { samples: 16, preview: 2, shutter: 0, tone: 'linear', exposure: 1, bloom: 0, vignette: 0, grain: 0, fov: 26, background: PAL.teal.lit },

    build(S) {
      const { THREE, K, scene, camera } = S;
      const ink = inkKit(S, { sunSize: 7.5, sunTarget: [0.3, 1, 0] }), { fill, solid, turned, mark, arc, burst, flat } = ink;
      ink.print();
      const M = {
        cream: fill(PAL.cream), paper: fill(PAL.paper, { band: 0.06 }), mustard: fill(PAL.mustard, { gloss: 0.03 }), bean: fill(PAL.bean, { gloss: 0.03 }),
        navy: fill(PAL.navy, { gloss: 0.05 }), navyTurned: fill(PAL.navy, { streak: 0.04 }), gut: fill(PAL.gut, { gloss: 0.035 }),
        almond: fill(PAL.almond, { gloss: 0.05 }), pb: fill(PAL.pb, { streak: 0.04 }),
      };
      const group = (parent = scene) => { const g = new THREE.Group(); parent.add(g); return g; };
      const sphere = (r) => new THREE.SphereGeometry(r, 24, 16);
      const pop = (x, d = 0.25) => (x < 0 ? 0 : K.ease.outBack(Math.min(1, (x + F / 2) / d), 2.4));        // lands on its frame: 0.7, 1.18, 1.05, 1
      const wobble = (x, f = 3.4, k = 9) => (x <= 0 ? 0 : Math.exp(-k * x) * Math.sin(x * 2 * Math.PI * f));   // the settle after a hit
      // SMEAR: on a drawing where a prop has travelled far since the last one, stretch it along its path
      const X = new THREE.Vector3(1, 0, 0), dv = new THREE.Vector3();
      const rig = (inner) => { const outer = group(), mid = group(outer); mid.add(inner); return { outer, inner, set(p, p0, max = 0.9) {
        dv.set(p[0] - p0[0], p[1] - p0[1], p[2] - p0[2]); const speed = dv.length() / F, s = 1 + Math.min(max, Math.max(0, speed - 7) * 0.04);
        outer.position.set(p[0], p[1], p[2]); outer.quaternion.identity(); if (s > 1) outer.quaternion.setFromUnitVectors(X, dv.normalize());
        mid.quaternion.copy(outer.quaternion).invert(); outer.scale.set(s, 1 / Math.sqrt(s), 1 / Math.sqrt(s));
      } }; };
      const fly = (A, B, u, h) => [K.lerp(A[0], B[0], u), K.lerp(A[1], B[1], u) + h * 4 * u * (1 - u), K.lerp(A[2], B[2], u)];

      // ---- the ground: one flat colour with a field of printed dots lying on it in perspective
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), fill(PAL.teal, { band: 0, hatch: 1.7 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
      { const pts = [], r = 0.7; for (let j = -16; j <= 16; j++) for (let i = -16; i <= 16; i++) { const x = (i + (j & 1) * 0.5) * r, z = j * r * 0.866, d = Math.hypot(x - 0.2, z + 0.5), s = 0.17 * (1 - K.smooth(2.6, 9, d)); if (s > 0.02) pts.push([x, z, s]); }
        const dots = new THREE.InstancedMesh(new THREE.CircleGeometry(1, 20).rotateX(-Math.PI / 2), fill(PAL.tealDot, { band: 0, hatch: 1.7 }), pts.length); dots.receiveShadow = true;
        pts.forEach(([x, z, s], i) => K.place(dots, i, [x, 0.004, z], null, s)); scene.add(dots); }

      // ---- the stomach (the hero): a tube of changing width along a J-shaped centreline in the picture plane, from the
      // gullet at the top, round the big bulb, out through the narrow exit at the lower left. Rebuilt every update from
      // three numbers: puff (how full it is), and the swallow bulges travelling down the gullet.
      const STOM = (() => {
        const CL = [[0.32, 2.12], [0.31, 1.86], [0.30, 1.62], [0.38, 1.38], [0.55, 1.02], [0.40, 0.60], [-0.05, 0.42], [-0.50, 0.50], [-0.82, 0.72], [-0.99, 0.90], [-1.13, 0.80], [-1.17, 0.55]];
        const curve = new THREE.CatmullRomCurve3(CL.map(([x, y]) => new THREE.Vector3(x, y + 0.03, 0)), false, 'centripetal');
        const L = curve.getLength(), SEG = 84, RAD = 28, Zv = new THREE.Vector3(0, 0, 1), ds = L / SEG;
        const rBase = K.path([[0, 0.1], [0.07, 0.1], [0.14, 0.1], [0.21, 0.22], [0.32, 0.5], [0.44, 0.52], [0.58, 0.42], [0.70, 0.3], [0.81, 0.16], [0.88, 0.12], [0.93, 0.11], [1, 0.1]]);
        const C = [], Tn = [], Nn = [];
        for (let i = 0; i <= SEG; i++) { const u = i / SEG, t = curve.getTangentAt(u); C.push(curve.getPointAt(u)); Tn.push(t); Nn.push(new THREE.Vector3().crossVectors(Zv, t).normalize()); }
        const pos = new Float32Array((SEG + 1) * RAD * 3), nor = new Float32Array(pos.length), idx = [];
        for (let i = 0; i < SEG; i++) for (let j = 0; j < RAD; j++) { const a = i * RAD + j, b = i * RAD + (j + 1) % RAD; idx.push(a, b, a + RAD, b, b + RAD, a + RAD); }
        const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); geo.setIndex(idx);
        const r = new Float32Array(SEG + 1), cs = Array.from({ length: RAD }, (_, j) => [Math.cos(j / RAD * Math.PI * 2), Math.sin(j / RAD * Math.PI * 2)]);
        const set = (puff, bulges) => {
          for (let i = 0; i <= SEG; i++) {
            const u = i / SEG; let rr = rBase(u) * (1 + 0.16 * puff * K.smooth(0.2, 0.32, u) * (1 - K.smooth(0.62, 0.8, u)));
            for (const [bu, amp] of bulges) rr += amp * Math.exp(-(((u - bu) / 0.035) ** 2));
            const d = Math.min(u, 1 - u) * L; if (d < rr) rr *= Math.sqrt(Math.max(0, 1 - (1 - d / rr) ** 2));   // round caps at both ends
            r[i] = rr;
          }
          for (let i = 0; i <= SEG; i++) {
            const i0 = Math.max(0, i - 1), i1 = Math.min(SEG, i + 1), sl = K.clamp((r[i1] - r[i0]) / (ds * (i1 - i0)), -6, 6), c = C[i], t = Tn[i], nn = Nn[i];
            for (let j = 0; j < RAD; j++) {
              const [co, si] = cs[j], rx = co * nn.x, ry = co * nn.y, rz = si, k = (i * RAD + j) * 3;
              pos[k] = c.x + rx * r[i]; pos[k + 1] = c.y + ry * r[i]; pos[k + 2] = rz * r[i];
              const nx = rx - sl * t.x, ny = ry - sl * t.y, nz = rz, l = Math.hypot(nx, ny, nz);
              nor[k] = nx / l; nor[k + 1] = ny / l; nor[k + 2] = nz / l;
            }
          }
          geo.attributes.position.needsUpdate = true; geo.attributes.normal.needsUpdate = true;
        };
        // a point on the surface at u along and `ang` round (0 = outer side in the picture plane, PI/2 = towards +z)
        const surf = (u, ang, out, nrm) => { const i = Math.round(u * SEG), co = Math.cos(ang), si = Math.sin(ang), nn = Nn[i], rx = co * nn.x, ry = co * nn.y;
          out.set(C[i].x + rx * r[i], C[i].y + ry * r[i], si * r[i]); nrm.set(rx, ry, si).normalize(); };
        set(0, []);
        return { geo, set, surf, tip: [C[0].x, C[0].y] };
      })();
      const stom = group(), stomRig = rig(stom);
      const stomMesh = solid(STOM.geo, M.gut, stom); stomMesh.frustumCulled = false;
      // a face: two eyes on the front of the bulb, open / squeezed shut (stuffed) / happy arcs
      const EYE_U = 0.40, Zv = new THREE.Vector3(0, 0, 1), ep = new THREE.Vector3(), en = new THREE.Vector3();
      const eyes = [Math.PI / 2 + 0.31, Math.PI / 2 - 0.31].map((a) => {
        const g = group(stom), s = a > Math.PI / 2 ? 1 : -1;
        const open = new THREE.Mesh(sphere(1), flat(INK)); open.scale.set(0.078, 0.122, 0.04); g.add(open);
        const glint = new THREE.Mesh(new THREE.CircleGeometry(0.025, 12), flat(PAPER)); glint.position.set(-0.022, 0.046, 0.042); g.add(glint);
        const squint = mark([[[[-0.075 * s, 0.08], [0.06 * s, 0], [-0.075 * s, -0.08]], 0.04, 'none']]); squint.position.z = 0.012; g.add(squint);
        const happy = mark([[arc(0.08, 0.2, Math.PI - 0.2, 12).map(([x, y]) => [x, y - 0.04]), 0.042]]); happy.position.z = 0.012; g.add(happy);
        g.userData = { a, open, glint, squint, happy }; return g;
      });

      // ---- the plate with the meal: bites piled in two layers, eaten from the top down
      const PLATE = [-2.15, 0, 0.55], plate = group();
      solid(turned([[0, 0], [0.58, 0], [0.64, 0.03], [0.86, 0.1], [0.9, 0.135], [0.86, 0.145], [0.62, 0.06], [0, 0.06]]), M.paper, plate);
      const SLOT = [[0, 0.17, 0], ...Array.from({ length: 6 }, (_, i) => { const a = i / 6 * Math.PI * 2 + 0.3; return [Math.cos(a) * 0.33, 0.16, Math.sin(a) * 0.33]; }),
        ...Array.from({ length: 3 }, (_, i) => { const a = i / 3 * Math.PI * 2 + 0.9; return [Math.cos(a) * 0.16, 0.36, Math.sin(a) * 0.16]; })];
      const hopTime = { 9: T.bite[0], 8: T.bite[1], 7: T.bite[2], 6: weekBite[0], 5: weekBite[1], 4: weekBite[2] };
      const bites = SLOT.map((sl, i) => { const m = solid(sphere(0.15), i % 2 ? M.bean : M.mustard, null, { line: 3 }); return { r: rig(m), m, sl, th: hopTime[i] ?? Infinity }; });
      const platePos = (q) => { const u = K.seg(q, T.cut3 - F, T.cut3 + 3 * F, K.ease.in); return [PLATE[0] - 8 * u, PLATE[1] + 0.6 * Math.sin(u * 2.2), PLATE[2]]; };

      // ---- the week calendar: a tent of navy board with paper pages that flip over the top
      const CAL = [2.1, 0, -0.35], cal = group(), calRig = rig(cal), TILT = 0.36, LEN = 1.28, HINGE = LEN * Math.cos(TILT);
      cal.rotation.y = -0.22;
      { const bp = group(cal); bp.position.y = HINGE; bp.rotation.x = TILT; solid(K.roundedBox(1.08, LEN, 0.05, 0.025, 3), M.navy, bp).position.set(0, -LEN / 2, -0.03); }
      [-0.3, 0.3].forEach((x) => { const ring = solid(new THREE.TorusGeometry(0.075, 0.02, 8, 20), M.navy, cal, { line: 2.5 }); ring.position.set(x, HINGE + 0.01, 0); ring.rotation.y = Math.PI / 2; });
      const pageText = (w) => { const tex = K.canvasTex(600, 660, (ctx) => {
        ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.font = '130px "Anton"'; ctx.fillStyle = INK; ctx.fillText('WEEK', 300, 165);
        ctx.font = '400px "Anton"'; ctx.lineWidth = 24; ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.strokeText(w, 314, 594); ctx.fillText(w, 314, 594);
        ctx.strokeText(w, 300, 580); ctx.fillStyle = PAL.persimmon.lit; ctx.fillText(w, 300, 580); });
        return new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.99), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })); };
      const pages = WEEKS.map((w, k) => { const pv = group(cal); pv.position.y = HINGE; const PL = LEN - 0.08;
        const pg = solid(K.roundedBox(1.0, PL, 0.016, 0.02, 3), M.paper, pv, { line: 2.5 }); pg.position.y = -PL / 2 - 0.04;
        const txt = pageText(w); txt.position.set(0, 0.0, 0.0095); pg.add(txt); return { pv, pg, k }; });
      const calPos = (q) => [CAL[0] + 9 * K.seg(q, T.cut3 - F, T.cut3 + 3 * F, K.ease.in), CAL[1] + 3.6 * (1 - K.seg(q, T.cal, T.cal + 2 * F, K.ease.in)) + 1.5 * Math.sin(Math.PI * K.seg(q, T.cut3 - F, T.cut3 + 3 * F)), CAL[2]];

      // ---- the dense foods: a pile of almonds, a jar of peanut butter, a carton of milk
      const FPOS = [[-3.7, 0, 0.8], [-2.62, 0, 0.8], [-1.55, 0, 0.8]], FH = [0.22, 0.7, 1.0];
      const foods = [];
      { const g = new THREE.Group(); [[0, 0.06, 0, 0.3], [0.2, 0.06, 0.08, 1.4], [-0.19, 0.06, 0.1, 2.2], [0.06, 0.06, -0.19, 0.9], [0.02, 0.16, 0.02, 1.9], [-0.12, 0.14, -0.08, 0.2]].forEach(([x, y, z, a]) => {
          const m = solid(sphere(1), M.almond, g, { line: 3 }); m.scale.set(0.16, 0.075, 0.1); m.position.set(x, y, z); m.rotation.set(0, a, 0.15); }); foods.push(g); }
      { const g = new THREE.Group(); solid(turned([[0, 0], [0.24, 0], [0.29, 0.04], [0.3, 0.46], [0.27, 0.52], [0.21, 0.55], [0, 0.55]]), M.pb, g);
        solid(turned([[0, 0.51], [0.24, 0.51], [0.26, 0.55], [0.26, 0.66], [0.23, 0.69], [0, 0.69]]), M.navyTurned, g, { line: 3 });
        solid(turned([[0.303, 0.14], [0.303, 0.38]], 64, 0), M.cream, g, { line: 0, cast: false }).scale.set(1.004, 1, 1.004); foods.push(g); }
      { const g = new THREE.Group(); solid(K.roundedBox(0.42, 0.62, 0.42, 0.03, 3), M.paper, g).position.y = 0.31;
        const roof = solid(new THREE.CylinderGeometry(0.245, 0.245, 0.42, 3, 1), M.paper, g, { line: 3 }); roof.rotation.x = -Math.PI / 2; roof.position.y = 0.62 + 0.12;
        solid(K.roundedBox(0.03, 0.1, 0.4, 0.01, 2), M.paper, g, { line: 2.5 }).position.y = 0.97;
        const band = solid(K.roundedBox(0.425, 0.22, 0.425, 0.02, 3), M.navy, g, { line: 0, cast: false }); band.position.y = 0.3;
        const word = K.textPlane('MILK', { font: '150px "Anton"', color: PAPER, height: 0.16 }); word.position.set(0, 0.3, 0.214); g.add(word); foods.push(g); }
      const feeds = foods.map((g, i) => ({ r: rig(g), g, home: FPOS[i], td: T.drop[i], th: T.feed[i] }));

      // ---- the bathroom scale with its dial
      const SC = [2.85, 0, 0.1], scaleG = group(), scaleRig = rig(scaleG);
      solid(K.roundedBox(2.7, 0.26, 2.15, 0.11, 4), M.cream, scaleG).position.y = 0.13;
      solid(K.roundedBox(2.3, 0.05, 1.15, 0.024, 3), M.navy, scaleG).position.set(0, 0.27, -0.36);
      const dialTex = K.canvasTex(512, 512, (ctx) => {
        ctx.translate(256, 256); ctx.fillStyle = PAPER; ctx.beginPath(); ctx.arc(0, 0, 250, 0, 7); ctx.fill();
        const ang = (v) => (-50 + 200 * v) * Math.PI / 180 - Math.PI / 2;     // 0 kg at 50 deg left of up, +0.5 kg at 50 deg right
        ctx.lineCap = 'butt'; ctx.strokeStyle = PAL.persimmon.lit; ctx.lineWidth = 30; ctx.beginPath(); ctx.arc(0, 0, 200, ang(0), ang(0.5)); ctx.stroke();
        for (let i = 0; i <= 10; i++) { const a = ang(i * 0.05), major = i % 5 === 0, r0 = major ? 150 : 178; ctx.strokeStyle = INK; ctx.lineWidth = major ? 13 : 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); ctx.lineTo(Math.cos(a) * 222, Math.sin(a) * 222); ctx.stroke(); }
        ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '82px "Anton"';
        [[-1, DIAL.lo], [1, DIAL.hi]].forEach(([sd, s]) => { const a = (sd * 74 - 90) * Math.PI / 180; ctx.fillText(s, Math.cos(a) * 158, Math.sin(a) * 158 + 4); });   // beside the ends of the scale, clear of the needle
        ctx.font = '700 76px "Caveat"'; ctx.fillText(DIAL.unit, 0, 132);
        ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 0, 243, 0, 7); ctx.stroke();
      });
      const dialG = group(scaleG); dialG.position.set(0, 0.3, 0.52); dialG.rotation.x = 0.5;
      solid(turned([[0, 0], [0.55, 0], [0.58, 0.05], [0.57, 0.13], [0.51, 0.16], [0, 0.16]], 48), M.navyTurned, dialG);
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.48, 48), new THREE.MeshBasicMaterial({ map: dialTex })); face.rotation.x = -Math.PI / 2; face.position.y = 0.163; dialG.add(face);
      const needle = group(dialG); needle.position.y = 0.168;
      { const n = new THREE.Mesh(new THREE.PlaneGeometry(0.038, 0.42), flat(INK)); n.position.set(0, 0.17, 0.002); needle.add(n);
        const cap = new THREE.Mesh(new THREE.CircleGeometry(0.055, 20), flat(PAL.persimmon.lit)); cap.position.z = 0.004; needle.add(cap);
        const capEdge = new THREE.Mesh(new THREE.CircleGeometry(0.073, 20), flat(INK)); capEdge.position.z = 0.003; needle.add(capEdge); }
      const scalePos = (q) => [SC[0] + 7 * (1 - pop(q - (T.cut4 - 2 * F), 0.3)), SC[1], SC[2]];
      const ON_SCALE = [SC[0] + 0.05, 0.295, SC[2] - 0.36];

      // ---- marks
      const faceCam = [];
      const sprite = (m, parent = scene) => { parent.add(m); faceCam.push(m); m.visible = false; return m; };
      const rays = (angles, r0, r1, w) => angles.map((a) => [[[Math.cos(a) * r0, Math.sin(a) * r0], [Math.cos(a) * r1, Math.sin(a) * r1]], w, 'head']);
      const strain = [sprite(mark(rays([0.1, 0.5, 0.9, -0.3, -0.75], 0.68, 0.95, 0.055))), sprite(mark(rays([0.3, 0.7, -0.1, -0.55, 1.15], 0.7, 0.98, 0.055)))];
      const sweat = [0, 1].map(() => sprite(mark([[[[0, 0.15], [0, 0.09], [0, 0.04]], 0.085, 'tail'], [arc(0.021, 0, Math.PI * 2, 16), 0.042, 'none']], PAL.water.lit, 0.024)));
      const hit = sprite(mark(burst(12, 0.78, 0.66, 0.36, 0.065, 5)));
      const thump = sprite(mark(burst(10, 1.5, 0.35, 0.34, 0.065, 9)));
      const star = (s) => mark([[[[0, -s], [0, 0], [0, s]], s * 0.34], [[[-s * 0.7, 0], [0, 0], [s * 0.7, 0]], s * 0.3]], PAPER, 0.024);
      const ting = [sprite(star(0.3)), sprite(star(0.17)), sprite(star(0.22))];

      // ---- the camera: one framing per beat. [aim x, y, z, elevation, azimuth, distance]
      const D = Math.PI / 180;
      const cam = K.track([
        [0, [-0.85, 0.88, 0.25, 27 * D, -6 * D, 6.7]], [at(B2 - 1), [-0.82, 0.88, 0.25, 28 * D, -3 * D, 6.4], 'linear'],
        [at(B2 + 4), [-0.2, 1.1, 0.05, 29 * D, 4 * D, 8.7], 'inOutQuint'], [at(B3 - 1), [-0.2, 1.1, 0.05, 30 * D, 7 * D, 8.4], 'linear'],
        [at(B3 + 4), [-1.55, 1.05, 0.35, 32 * D, -7 * D, 8.5], 'inOutQuint'], [at(B4 - 1), [-1.5, 1.05, 0.35, 33 * D, -4 * D, 8.2], 'linear'],
        [at(B4 + 4), [2.6, 1.15, 0.1, 29 * D, 5 * D, 9.0], 'inOutQuint'], [DURATION, [2.6, 1.15, 0.1, 28 * D, 9 * D, 8.6], 'linear'],
      ]);
      const camPos = (c) => [c[0] + c[5] * Math.sin(c[4]) * Math.cos(c[3]), c[1] + c[5] * Math.sin(c[3]), c[2] + c[5] * Math.cos(c[4]) * Math.cos(c[3])];
      const TAN = Math.tan(S.R.fov / 2 * D);
      const spot = (time, sx, sy, push = 0) => { const c = cam(time), p = camPos(c), e = c[3], a = c[4], d = c[5] + push, hh = d * TAN, hw = hh * S.W / S.H;
        const f = [-Math.sin(a) * Math.cos(e), -Math.sin(e), -Math.cos(a) * Math.cos(e)], r = [Math.cos(a), 0, -Math.sin(a)], u = [-Math.sin(a) * Math.sin(e), Math.cos(e), -Math.cos(a) * Math.sin(e)];
        return { pos: [0, 1, 2].map((i) => p[i] + f[i] * d + r[i] * sx * hw + u[i] * sy * hh), rot: new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(...r), new THREE.Vector3(...u), new THREE.Vector3(...f).negate())) }; };

      // ---- lettering: a word, a number badge and a caption box per beat, standing in the scene, turned to the camera
      const label = (step, when, until, at2, cap2, f = {}) => {
        const look = when + 0.9, g = group(), word = ink.lettering(step.word, { height: f.height || 0.56 }), cap = ink.caption(step.note, { height: f.cap || 0.36 }), capG = group(), [ww, wh] = word.userData.size;
        const a = spot(look, ...at2), b = spot(look, ...cap2); g.add(word); g.position.set(...a.pos); g.quaternion.copy(a.rot);
        const ticks = mark(burst(9, ww * 0.56, wh * 0.62, 0.3, 0.06, 7 + when)); ticks.position.z = -0.01; g.add(ticks);
        let bd = null; if (step.n) { bd = ink.badge(step.n, { height: wh * 0.82 }); bd.position.set(-ww / 2 + 0.02, wh * 0.22, 0.02); g.add(bd); }
        capG.add(cap); capG.position.set(...b.pos); capG.quaternion.copy(b.rot); cap.rotation.z = f.tilt == null ? -0.04 : f.tilt;
        const capEnd = f.capUntil == null ? until : f.capUntil;
        return (q) => {
          const x = q - when, out = 1 - K.seg(q, until, until + 2 * F), s = pop(x) * out;
          g.visible = x >= 0 && out > 0; g.scale.setScalar(Math.max(s, 1e-3)); word.rotation.z = 0.05 * wobble(x + 0.03, 4, 10);
          ticks.visible = x >= 0 && x < 2 * F - 1e-3; ticks.scale.setScalar(x < F - 1e-3 ? 0.92 : 1.06);
          if (bd) { const b = pop(x - F); bd.scale.setScalar(Math.max(b, 1e-3)); bd.rotation.z = 0.18 - 0.5 * (1 - Math.min(1, b)); }
          const cout = 1 - K.seg(q, capEnd, capEnd + 2 * F), cs = pop(x - 3 * F) * cout; capG.visible = x >= 3 * F - 1e-3 && cout > 0; capG.scale.setScalar(Math.max(cs, 1e-3));
        };
      };
      const labels = [
        label(BEATS[0], T.lab1, T.cut2 - 2 * F, [-0.45, 0.66, 0.6], [0.5, 0.68, 0.3], { tilt: 0.03 }),
        label(BEATS[1], T.lab2, T.cut3 - 2 * F, [-0.5, 0.66, 0.4], [0.5, 0.7, 0.3], { tilt: -0.04 }),
        label(BEATS[2], T.lab3, T.cut4 - 2 * F, [-0.56, 0.68, 0.4], [0.02, 0.72, 0.3], { tilt: 0.04, capUntil: T.sum - 2 * F }),
        label(ENDING, T.lab4, 99, [-0.56, 0.62, 0.3], [-0.56, 0.34, 0.0], { cap: 0.36, tilt: -0.03 }),
      ];
      // the running total in B3, a second caption slip that replaces the first
      const sum = group(); { const c = ink.caption(BEATS[2].sum, { height: 0.4 }), p = spot(T.sum + 0.6, 0.06, 0.72, 0.3); sum.add(c); c.rotation.z = -0.03; sum.position.set(...p.pos); sum.quaternion.copy(p.rot); }
      // a tag over each dense food: its name and its calories
      const tag = (name, kcal, h = 0.5) => {
        const f1 = '700 112px "Caveat"', f2 = '118px "Anton"', m = document.createElement('canvas').getContext('2d');
        m.font = f1; const w1 = m.measureText(name).width; m.font = f2; const w2 = m.measureText(kcal).width;
        const bw = Math.ceil(Math.max(w1, w2)) + 90, bh = 300, W = bw + 60, H = bh + 60;
        const tex = K.canvasTex(W, H, (ctx) => {
          const r = K.rng(name), j = () => r.range(-6, 6), box = (dx, dy) => { ctx.beginPath(); ctx.moveTo(20 + dx + j(), 20 + dy + j()); ctx.lineTo(20 + bw + dx + j(), 20 + dy + j()); ctx.lineTo(20 + bw + dx + j(), 20 + bh + dy + j()); ctx.lineTo(20 + dx + j(), 20 + bh + dy + j()); ctx.closePath(); };
          ctx.lineJoin = 'round'; box(14, 16); ctx.fillStyle = INK; ctx.fill(); box(0, 0); ctx.fillStyle = PAPER; ctx.fill(); ctx.lineWidth = 11; ctx.strokeStyle = INK; ctx.stroke();
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = INK; ctx.font = f1; ctx.fillText(name, 20 + bw / 2, 20 + 90);
          ctx.font = f2; ctx.fillStyle = PAL.persimmon.shade; ctx.fillText(kcal, 20 + bw / 2, 20 + 212);
        });
        const unit = h / bh; return new THREE.Mesh(new THREE.PlaneGeometry(W * unit, H * unit), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
      };
      const tags = FOODS.map((f, i) => { const g = sprite(new THREE.Group()); g.add(tag(f.name, f.kcal)); g.children[0].rotation.z = [0.04, -0.03, 0.05][i]; return g; });

      // ---- the stomach's state over time
      const tipAt = (q) => { const s = stomScale(q); return [STOM.tip[0] * s, (STOM.tip[1] + 0.03) * s + 0.04, 0]; };
      const stomScale = (q) => SIZES[0] + stretchAt.reduce((s, ta, i) => s + (SIZES[i + 1] - SIZES[i]) * pop(q - ta, 0.25), 0);
      const stomPuff = (q) => puffAt.reduce((s, ta) => s + pop(q - ta, 0.2) / 3, 0) * (1 - K.seg(q, T.cut2, T.cut2 + 2 * F)) + feedAt.reduce((s, ta) => s + 0.22 * pop(q - ta, 0.2), 0);
      const arrivals = [...arriveBite.map((t) => [t, 0.06]), ...arriveWeek.map((t) => [t, 0.06]), ...arriveFeed.map((t) => [t, 0.08])];
      const bulges = (q) => arrivals.filter(([ta]) => q >= ta - 1e-3 && q < ta + GULP - 1e-3).map(([ta, a]) => [0.03 + 0.085 * Math.round((q - ta) / F), a]);
      const hits = [...puffAt.map((t) => [t, 0.08]), [T.stuffed, 0.1], ...stretchAt.map((t) => [t, 0.12]), ...feedAt.map((t) => [t, 0.08]), [T.land, 0.2]];
      const squash = (q) => 1 - hits.reduce((s, [ta, k]) => s + k * wobble(q - ta + F * 0.5, 3.2, 8), 0);
      const stomPos = (q) => (q < T.hop ? [0, 0, 0] : fly([0, 0, 0], ON_SCALE, Math.min(1, (q - T.hop) / (T.land - T.hop)), 0.75));
      const eyeState = (q) => {
        if (q >= T.stuffed && q < T.cut2) return 'squint';
        if (q >= T.land || [...stretchAt, ...feedAt].some((ta) => q >= ta && q < ta + 7 * F)) return 'happy';
        return Math.round(q * DPS) % 47 === 46 ? 'blink' : 'open';
      };

      return {
        update(t) {
          const q = Math.floor(t * DPS + 1e-3) / DPS, n = Math.round(q * DPS);     // q: the time of the drawing we are on
          const c = cam(t), cp = camPos(c);
          K.look(camera, cp, c); ink.frame(t, camera);

          // stomach: shape, size, squash, hop onto the scale
          const s = stomScale(q), sq = squash(q);
          STOM.set(stomPuff(q), bulges(q));
          stomRig.set(stomPos(q), stomPos(q - F), 0.5);
          stom.scale.set(s / Math.sqrt(sq), s * sq, s / Math.sqrt(sq));
          const es = eyeState(q);
          eyes.forEach((e) => { const d = e.userData; STOM.surf(EYE_U, d.a, ep, en); e.position.copy(ep).addScaledVector(en, 0.004); e.quaternion.setFromUnitVectors(Zv, en);
            d.open.visible = d.glint.visible = es === 'open'; d.squint.visible = es === 'squint'; d.happy.visible = es === 'happy'; if (es === 'blink') { d.open.visible = true; d.open.scale.y = 0.016; } else d.open.scale.y = 0.122; });

          // plate and the bites: each bite flies up into the gullet, shrinking as it goes in
          const pp = platePos(q); plate.position.set(...pp); plate.visible = q < T.cut3 + 3 * F;
          bites.forEach((b) => {
            const home = (qq) => { const p = platePos(qq); return [p[0] + b.sl[0], p[1] + b.sl[1], p[2] + b.sl[2]]; };
            const P = (qq) => (qq < b.th ? home(qq) : fly(home(b.th), tipAt(b.th), (qq - b.th) / BITE_FLY, 0.45));
            const u = (q - b.th) / BITE_FLY; b.r.outer.visible = plate.visible && u < 1 - 1e-3;
            b.r.set(P(q), P(q - F)); const k = u > 0 ? 1 - 0.55 * u * u : 1; b.m.scale.set(k, 0.8 * k, k); b.m.rotation.z = u > 0 ? u * 2.5 : 0;
          });

          // calendar: drops in, flips a page each week, hops away
          calRig.set(calPos(q), calPos(q - F), 0.6); calRig.outer.visible = q >= T.cal && q < T.cut3 + 3 * F;
          const csq = 1 - 0.12 * wobble(q - T.cal - 1.5 * F, 3.4, 9); cal.scale.set(1 / Math.sqrt(csq), csq, 1 / Math.sqrt(csq));
          pages.forEach(({ pv, pg, k }) => { const u = k < 3 ? K.seg(q, T.week[k], T.week[k] + 3 * F) : 0; pv.rotation.x = -TILT - u * (2 * Math.PI - 2 * TILT); pg.position.z = u > 0.5 ? -(0.07 + k * 0.012) : 0.02 + (3 - k) * 0.012; });

          // dense foods: drop onto the table, then fly into the gullet one by one
          feeds.forEach((f) => {
            const P = (qq) => (qq < f.th ? [f.home[0], f.home[1] + 3.6 * (1 - K.seg(qq, f.td, f.td + 2 * F, K.ease.in)), f.home[2]] : fly(f.home, tipAt(f.th), (qq - f.th) / FEED_FLY, 1.3));
            const u = (q - f.th) / FEED_FLY; f.r.outer.visible = q >= f.td && u < 1 - 1e-3;
            f.r.set(P(q), P(q - F)); const ls = 1 - 0.14 * wobble(q - f.td - 1.5 * F, 3.4, 9), k = u > 0 ? 1 - 0.7 * u * u : 1; f.g.scale.set(k / Math.sqrt(ls), k * ls, k / Math.sqrt(ls)); f.g.rotation.z = u > 0 ? u * 1.6 : 0;
          });
          tags.forEach((g, i) => { const x = q - T.tag[i], out = 1 - K.seg(q, T.cut4 - 2 * F, T.cut4); g.visible = x >= 0 && out > 0; g.position.set(FPOS[i][0], FH[i] + 0.45, FPOS[i][2] + 0.1); g.scale.setScalar(Math.max(1e-3, pop(x, 0.2) * out)); });
          { const x = q - T.sum, out = 1 - K.seg(q, T.cut4 - 2 * F, T.cut4); sum.visible = x >= 0 && out > 0; sum.scale.setScalar(Math.max(1e-3, pop(x) * out)); }

          // scale: slides in from the right, takes the stomach's weight, the needle swings to +0.5
          scaleRig.set(scalePos(q), scalePos(q - F), 0.5); scaleRig.outer.visible = q >= T.cut4 - 2 * F;
          const ssq = 1 - 0.1 * wobble(q - T.land + F * 0.5, 3.4, 9); scaleG.scale.set(1, ssq, 1);
          needle.rotation.set(-Math.PI / 2, 0, -(-50 + 100 * K.spring(q - T.land, 1.5, 0.32)) * D);

          // marks: stuffed (strain lines, sweat, impact), stretches, landing, stars
          const sc = stomPos(q), body = [sc[0] + 0.42 * s, sc[1] + 0.95 * s, sc[2] + 0.3];
          const stuffed = q >= T.stuffed && q < T.cut2;
          strain.forEach((m, i) => { m.visible = stuffed && n % 2 === i; m.position.set(...body); m.scale.setScalar(s * 1.05); });
          sweat.forEach((m, i) => { const x = q - T.stuffed - i * 5 * F, ph = ((x / F) % 8 + 8) % 8; m.visible = stuffed && x >= 0 && ph < 4; m.position.set(body[0] + (i ? 0.7 : -0.85) * s, body[1] + (i ? 0.42 : 0.55) * s - ph * 0.07, body[2] + 0.1); m.scale.setScalar(s); });
          const hx = [T.stuffed, ...stretchAt].map((ta) => q - ta).find((x) => x >= 0 && x < 2 * F - 1e-3);
          hit.visible = hx != null; if (hit.visible) { hit.position.set(...body); hit.scale.setScalar(s * (hx < F - 1e-3 ? 0.92 : 1.1)); }
          const lx = q - T.land; thump.visible = lx >= 0 && lx < 2 * F - 1e-3; thump.position.set(SC[0], 0.15, SC[2] + 0.9); thump.scale.setScalar(lx < F - 1e-3 ? 0.9 : 1.1);
          ting.forEach((m, i) => { const x = q - T.ting - i * 2 * F; m.visible = x >= 0; m.position.set(...[[ON_SCALE[0] + 1.25, 2.15, 0.2], [ON_SCALE[0] - 0.9, 2.55, 0.1], [SC[0] + 1.0, 0.62, 1.05]][i]); m.scale.setScalar(pop(x, 0.2) * (1 + 0.12 * Math.sin(n * 1.6 + i))); });

          for (const f of labels) f(q);
          for (const m of faceCam) m.quaternion.copy(camera.quaternion);
        },
      };
    },

    sound(k) {
      // every time below is a drawing the picture also changes on (see T)
      const gulp = (t, g = 1) => { k.tone(t, { f: [[0, 300], [0.13, 95]], dur: 0.17, gain: 0.32 * g }); k.noise(t, { dur: 0.08, color: 'brown', filter: 'lowpass', f: 650, gain: 0.3 * g }); };
      const stretch = (t, i) => { k.tone(t - 0.14, { f: [[0, 110 + i * 25], [0.18, 240 + i * 35]], type: 'triangle', dur: 0.22, gain: 0.13, a: 0.16 }); k.play('press', t, { gain: 0.55 }); };
      k.bed('room', 0, DURATION, { gain: 0.7 });
      // B1: three bites, each pops off the plate, flies, is swallowed and lands; the third one is one too many
      T.bite.forEach((t, i) => { k.play('pop', t, { gain: 0.6, f: 520 + i * 60, pan: -0.5 }); k.play('swish', t + F, { gain: 0.5, dur: 0.14, pan: -0.2 }); gulp(arriveBite[i], 0.8); k.play('thud', puffAt[i], { gain: 0.35 + i * 0.12, f: 120 - i * 10 }); });
      k.play('impact', T.stuffed, { gain: 0.55, f: 100 }); k.play('buzz', T.stuffed + 0.05, { gain: 0.5, f: 98, dur: 0.35, minor: true });
      k.play('stamp', T.lab1, { gain: 0.9, pan: -0.3 });
      // B2: the calendar arrives, then each week a page flips, one more bite goes down and the stomach stretches
      k.play('whoosh', T.cut2 - F, { gain: 0.8, dur: 0.4, pan: 0.3 }); k.play('slap', T.cal + 2 * F, { gain: 0.7, pan: 0.5 }); k.play('stamp', T.lab2, { gain: 0.9, pan: -0.3 });
      T.week.forEach((t, i) => { k.play('paper', t, { gain: 1, dur: 0.2, pan: 0.5 }); k.play('pop', weekBite[i], { gain: 0.5, f: 560, pan: -0.5, minor: true }); gulp(arriveWeek[i], 0.7); stretch(stretchAt[i], i); });
      // B3: the plate goes, three dense foods land, get their tags and go down; the total stamps in
      k.play('whoosh', T.cut3 - F, { gain: 0.8, dur: 0.4, pan: -0.3 }); k.play('swish', T.cut3, { gain: 0.6, dur: 0.2, pan: -0.6 });
      T.drop.forEach((t, i) => k.play('thud', t + 2 * F, { gain: 0.45, f: [170, 140, 120][i], pan: -0.6 + i * 0.2 }));
      k.play('tock', T.drop[1] + 2 * F, { gain: 0.35, f: 1400, pan: -0.4 });   // the glass jar
      k.play('stamp', T.lab3, { gain: 0.9, pan: 0.3 });
      T.tag.forEach((t, i) => k.play('tick', t, { gain: 0.8, f: 3800 + i * 400, pan: -0.6 + i * 0.2 }));
      T.feed.forEach((t, i) => { k.play('swish', t, { gain: 0.6, dur: 0.2, pan: -0.3 }); gulp(arriveFeed[i], 0.9); k.play('press', feedAt[i], { gain: 0.4, minor: true }); });
      k.play('stamp', T.sum, { gain: 0.8, pan: 0.3 }); k.play('ding', T.sum + 0.03, { gain: 0.35, f: 'E6', pan: 0.3 });
      // B4: the scale slides in, the stomach hops on, the needle swings up, ting
      k.play('whoosh', T.cut4 - F, { gain: 0.8, dur: 0.4, pan: 0.4 }); k.play('roller', T.cut4 - 2 * F, { gain: 0.5, dur: 0.3, pan: 0.6 });
      k.play('swish', T.hop, { gain: 0.7, dur: 0.25, pan: 0.2 }); k.play('impact', T.land, { gain: 0.8, f: 110 });
      k.withMinor(() => { for (let i = 0; i < 9; i++) k.play('count', T.land + F * (1 + i), { gain: 0.9 - i * 0.08, pan: 0.2 }); });
      k.play('stamp', T.lab4, { gain: 1 }); k.play('ding', T.ting, { gain: 0.7, f: 'A6', pan: 0.3 }); k.play('ding', T.ting + 2 * F, { gain: 0.5, f: 'E7', pan: -0.2 });
    },
  });
}
