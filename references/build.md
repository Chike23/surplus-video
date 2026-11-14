# Building the video (three.js + the STAGE kit)

The look comes from the style: `styles/spotlight-stage/card.md` (the rules of the look) and `reference.js` (a complete
piece in that look, on another topic). Learn the look from the reference; take the story from the script.
**`references/specs.md` sets the pace, the camera, the shot sizes, the lamps and the movement.** Where the reference
does something else (its slow stalls camera, its 16:9 frame, its dark grade), the specs win.

## The frame
- **9:16 vertical, 1080×1920**, 30 fps, 45–60 s. The player runs `K.run(canvas, style, { samples, width: 1080, height: 1920 })`.
- The reference was made for 16:9. Re-frame for vertical, don't squeeze. Stack things vertically, bring the camera
  closer, and use a wider `fov` when the reference used a long lens on a wide scene.
- **Instagram covers** the top 11.5 %, the bottom 24 % and the right 13 % (the player's **Safe** button shades them). Key
  action, labels and lettering stay out of those areas. The bottom band is for nothing important.
- **No captions** (owner's rule): never draw the narration's words on screen. Labels, signs and lettering that name
  things are fine, and so is diegetic text (a carved message, a sign on a set). Every piece of text faces the camera
  and reads the right way round: never mirrored (no negative scale on a text card, no text on the back face of a flat).

## Structure of src/style.js (same as the reference)
```js
{
  // content first: words, numbers, cues (all times come from CUE: the narration's clock)
  const DPS = 30;
  const T = { hook: CUE.at('eat all day'), seeIt: CUE.at('you see'), ... };
  const shots = [ { t: 0, place: 'kitchen', size: 'wide' }, { t: T.seeIt, place: 'flies', size: 'wide', how: 'fly', dur: 0.45 }, ... ];
  const moves = [ { t: CUE.at('all'), size: 'full' }, ... ];        // every pan or zoom inside a shot
  const DURATION = CUE.snap(TIMING.duration + 1.0, DPS);            // hold 0.8–2 s on the payoff, no outro
  registerStyle({ id, name, duration: DURATION, shots, moves, payoff: T.payoff, fonts: [...], render: {...},
    build(S) { ...; return { update(t) {...}, overlay(ctx, t, W, H) { /* labels */ } }; },
    sound(k) { ... } });
}
```
- **Every time is a cue.** Events, camera moves, labels and sounds come from `CUE.at('<words>')` (the start of that
  phrase, snapped to the drawing grid) or offsets from it in frames. Never type a bare number of seconds for something
  the voice talks about. When the take changes, everything follows.
- A thing lands **on the word that names it, 0–3 frames before it, never after** (`CUE.at` snaps to the drawing at or
  just before the word). Every reaction, reveal and pose swap too: the eye leads, the ear confirms. A sound starts on
  the same frame as its event, using the same `T.x` value.
- **The voice is the clock and is never changed.** Never speed up, slow down or stretch the voice or the picture to
  make something fit: move the picture's events to the words instead.
- `shots`, `moves` and `payoff` are what QA measures the specs from (format in specs.md). **Drive the camera from the
  same two lists** (one camera function that eases to each entry's framing), so what's declared is what's shown.

## Places, shots and the camera (numbers in specs.md)
- The script's `[S1]`–`[S4]` are story parts. Each part has several **places** (areas of the stage: centre, a wing,
  up on the flies, a close-up area on the apron, a second room behind a gauze), and the video visits about 7–9 of them.
  Build every set wider and deeper than any framing that looks at it, and light all of it, so no pan shows an edge
  or a black gap.
- **Shots**: a scene change about every 4.3 s, ~1 in 10 short (under 1.1 s), none over 8.6 s, 7 in 10 to a new place.
  A change takes 0.25–0.5 s and is shown on screen: `how: 'change'` (a flat or drop wipes across the frame, the next
  set is behind it, the wash changes colour on the same frame) or `how: 'fly'` (the camera flies to the next area of
  the stage; about 1 in 5 place changes). Never a dip to black. A new place opens wide (`xwide` or `wide`).
- **Moves**: the framing changes about every 1.4 s. Each move is a fast eased pan or zoom (about 0.3–0.5 s) to the new
  framing, then a very slow drift the same way until the next move. The camera is never still more than ~8 % of the
  time, and no move smears (QA flags image speed over 4 frame-heights a second).
- **The hook (0–4 s)**: 4–5 framing changes, at most 2 of them scene changes, the rest camera moves.
- **Sizes**: wide + extreme wide ≥ 25 % of the time, full ~27 % (home base), medium only in passing (< 0.5 s each,
  ≤ 20 % in all), face close-ups ~13 % for the big reactions, object inserts ~10 %, extreme wides held longest
  (~1.7 s) with the camera travelling.
- **Angle**: the stage faces +z (the house), as in the reference. Keep the camera within 25° of looking straight along
  −z, so the cut-outs never turn edge-on. Push in, pull out and pan across instead of swinging round.
- First frame: a character already moving, fully lit, the hook's action under way. Last 0.8–2 s: hold on the payoff
  with the CTA; nothing after it.

## Characters (specs.md §5)
- Every shot, the cut-out travels along its floor slot (or in and out of the wings); a slide gets a hop or bob every
  8–10 frames with a slight side-to-side tilt.
- Limbs and head are separate cut-outs on pins (a pivot `Group` at the joint), so they can point, wave, hold props and
  tilt.
- A big action: 4–8 frames of lean back, the move overshoots 10–20 %, settles over 8–14 frames, on its word.
  `K.spring(t - t0, ~2.4, 0.4)` gives the overshoot and settle; add the lean back before t0 with a short `K.seg`.
- The face (head pin) turns about 3 frames before the body. Pose swaps (shocked, proud, worried cut-outs) land on the
  beat with a small bounce, and a reaction holds at least 0.5 s on a readable face.
- Holds: a 1–2° sway on the rod, never a frozen puppet. Impacts: 3 frames frozen, then a recoil, a sound on that frame.
- Props act: flown in on rods, needles swing, overshoot and settle. No lip-sync.

## The Surplus ending
The plug is part of the story, told through the character. **Never show a phone, a screen, the app, an app icon or
anything that looks like the app** (calorie rings, dashboards, progress bars, a "+500 kcal" readout). While the
narration says what Surplus does for them, the character acts it out: eats the extra meal, the scale's needle finally
swings up and settles, a proud pose swap with a bounce. The word **Surplus** and the CTA line ("link in bio", "Search
Surplus on the App Store", "Comment BULK") may be lettered in the style, on the easel card or a marquee: large, inside
the safe area, part of the payoff the video ends on. No App Store badge or other logos.

## The look (from the atlas brief, kept)
- The reference shows the look, not the story: don't reuse its objects or beats unless the topic needs them.
- **Show, don't tell.** Things happen to objects or characters over the beats, and the picture does the telling: each
  line's *We see* (script.md) is acted out, on its word. Words on screen are labels, never the subject of a shot, and
  never a repeat of the narration.
- Keep the reference's materials, beams, haze and way of moving; the lamp levels and grade follow specs.md §4.
- `update(t)` sets the whole scene for time t and nothing builds up between calls (the kit calls it many times per
  frame, and QA calls it for every frame to measure the camera). No `Math.random`, `Date` or timers; use `K.rng(seed)`.
  `tools/build.mjs` refuses to build otherwise.
- Everything is built in code: no downloaded models, images, HDRIs or textures.
- Simple forms, beautifully lit, beat complicated models that look wrong. Draw the subject accurately.
- Phone viewing: words large and on screen long enough to read (≥ 1.2 s + 0.3 s per word), sharp, high contrast.

## Sound
The narration is on top. In `sound(k)`:
- **A music bed under the whole piece:** `k.music('pad' | 'pulse', t0, t1, { bpm, chords, gain })` from 0 to the end,
  changing chords on the story's turns (the twist, the payoff). Its level is set by `tools/mix.py` (the bed at −6 dB to
  the voice), so the `gain` values only balance its parts. Ambience beds (`k.bed('room')`) don't reach the final mix.
- **Effects** on the events that land (arrivals, impacts, scene changes, the key number, the result), with sounds the
  material would make, on the same frame as the event. Keep the hits about even: mix.py caps the whole effects stem by
  its loudest 50 ms, so one huge hit pulls every effect down.
- Never mix by hand, never add ducking or compression: `render.mjs P --audio` renders the bed and the effects as
  stems and mix.py sets every level (references/specs.md section 6).

## Before handing to QA
`node SKILL/tools/build.mjs P` must pass, then open the preview once yourself (browser pane) and scrub through. Then
run `node SKILL/tools/qa.mjs P` and fix every FAIL before the review.
