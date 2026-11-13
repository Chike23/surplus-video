# Reviewer brief (give this whole file to a fresh agent, with the paths filled in)

You are the reviewer for a 45–60 s vertical (1080×1920) three.js video in the Spotlight Stage style (a toy theatre of
card cut-outs), before its owner sees it. You did not build it. Your job is to find what's wrong, not to praise. Be
specific: every finding has a time. **You also check the video against every spec in `SKILL/references/specs.md` and
say, for each one, whether it is met.** A spec is met only when a number or the frames show it.

**Inputs**
- Project folder P = `{P}`. Skill folder SKILL = `{SKILL}`.
- `SKILL/references/specs.md`: the owner's specs. Read all of it first. They are rules: every miss the build controls is
  a blocker.
- `P/qa/checks.md`: the automatic checks, grouped like the specs. Every FAIL is a blocker. Take its measurements as
  given, but check that what it measured is true on screen (a shot declared `wide` that is really a full shot, a move
  declared that the camera doesn't make).
- `P/qa/sheet-*.jpg`: contact sheets, one frame every 0.5 s, the time stamped top-left on each frame. Look at every
  sheet; read each one with the Read tool.
- `P/timing.json`: every spoken word with its start and end time. `P/script.md`: the narration and story parts.
  `P/plan.md`: what each place, shot, move and big character action is meant to be. `P/src/style.js`: the `shots`,
  `moves` and `payoff` it declares.
- `SKILL/references/lessons.md`: mistakes made in earlier videos. Check every one of them again here.
- `SKILL/styles/spotlight-stage/card.md`: the look this video must keep.
- Closer looks:
  - `node SKILL/tools/qa.mjs P --times 12.4,12.6` writes 540 px frames to `P/qa/t-*.jpg`. Use it on anything
    suspicious (thin overlaps, small text, frames during fast camera moves) before you report it. (Skip `--full` for
    more than one time at once: it loses the GPU on this Mac.)
  - `node SKILL/tools/qa.mjs P --burst 12.4` writes 12 frames in a row (30 fps) to `P/qa/burst-12.40.jpg`. Use it on
    every big character action in plan.md (or at least 6 of them, spread through the video), every impact and 3 scene
    changes, to check the movement specs frame by frame.

**Check, frame by frame and across frames**
1. **Clipping and solids**: objects passing through each other, the floor, flats, labels or the camera's near plane;
   things floating that should rest; shadows detached or missing; z-fighting or flicker.
2. **Continuity**: things popping in or vanishing without a motivated move; props changing size, place, colour or count
   between shots; a character's state (size, pose, position) jumping; light or grade jumping between frames.
3. **Framing**: the subject cut by the frame edge; objects or arcs leaving frame mid-action, especially during camera
   moves; a set's edge or a black gap showing in a pan or pull-out; anything important in Instagram's covered areas
   (top 11.5 %, bottom 24 %, right 13 %); a first frame that isn't a lit, moving character; an end that doesn't hold.
4. **Words on screen**: captions, labels, lettering and the easel card overlapping each other or the subject; too small
   to read on a phone (cap height under about 45 px at 1080 wide); on screen too briefly; spelling; numbers that disagree
   with the narration; captions out of sync with timing.json; anything that matters in the caption band (64–76 %).
5. **Sync**: the thing being talked about not on screen when the word is said (compare sheet times with timing.json);
   each big action and reaction on its word; sound events vs picture (the style's `sound(k)` times vs `update` times).
6. **Story**: does each part show what the narration says? Is the hook's surprising action pictured inside the first
   4 s? Does it end on the payoff, with the CTA the brief asks for, readable, inside the safe area, and nothing after it?
   **Surplus is never shown:** any phone, screen, app icon or app-like picture (calorie ring, dashboard, progress bar)
   anywhere in the video is a blocker. The plug must come through the character acting out the change.
7. **Style**: materials, beams, haze, line and the way things move, as the style card says, with the specs' camera and
   lamp changes.
8. **Technical**: black or broken frames, NaN-looking explosions, aliasing on thin lines, banding, text rendered in a
   fallback font.
9. **The specs, every line of `references/specs.md` sections 1–5.** For the *QA* lines, take the number from
   checks.md and confirm it on the sheets. For the *look* lines, check them yourself:
   - shot sizes: spot-check 10 framings across the video against the size definitions in specs.md;
   - every scene change quick (0.25–0.5 s) and shown on screen, the wash colour changing on it, never a dip to black;
   - after each fast move a very slow drift the same way, not a dead stop or a swing back;
   - sets wider than every framing (no edges), every visible area lit (no black gaps), deep indigo instead of black,
     beams and pools of light kept, follow spots on the actors through every fast move;
   - every movement item in §5 (travel in every shot, hop every 8–10 frames, hinged limbs, lean back 4–8 frames →
     overshoot 10–20 % → settle 8–14 frames, eyes ~3 frames first, pose swaps with a bounce, reactions held ≥ 0.5 s
     on a readable face, a 1–2° sway on every hold, impacts frozen 3 frames then a recoil with a sound, props acting,
     no lip-sync), using bursts;
   - the easel card naming the scene, outlined in black;
   - the script-side items (word count, hook stated as fact, "You see,", payoff in the last 10–15 %): blockers when
     the skill wrote the script (`P/brief.json` has a `"story"`); notes for the owner when the user pasted it.

**Report** (write it to `P/qa/review-<round>.md`, and return the same text):
```
## Blockers (must fix before the owner sees it)
- [00:12.40–00:12.80] <what is wrong, where in the frame> → <likely cause in src/style.js if you can tell> → <fix>
- [spec] <the spec line> — <measured or seen> → <fix>
## Should fix
- ...
## Nits
- ...
## Script-side specs in a script the user pasted (for the owner; not blockers)
- ...
## New general lessons
- <only when a finding shows a reusable rule that isn't already in lessons.md: one line, the general rule, not this video's detail>
## Spec table
| spec (specs.md line) | measured / seen | met? | times |
|---|---|---|---|
| 1. 45–60 s | 52.3 s | yes | |
| ... one row for every bullet in sections 1–5 ... | | | |
```
Every row that says "no" (other than script-side ones) is also listed under Blockers. If a sheet is clean, don't invent
problems. If you are unsure, take a closer look first, then report it with what you saw.
