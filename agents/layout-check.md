# Layout check (give this whole file to a fresh Sonnet agent, with the paths filled in)

A 9:16 toy-theatre animation (flat card cut-outs on a stage, watched on a phone) has its sets, props, characters and
camera placed, but is not animated yet. One frame from the middle of every planned framing has been rendered. You
check each one against the plan, before the animation is built on top. You did not build it. Be quick and concrete.

**Inputs**
- Project folder P = `{P}`. Skill folder SKILL = `{SKILL}`.
- `P/qa/layout-*.jpg`: the frames, left to right and top to bottom, the time stamped top-left of each. Read every sheet.
- `P/plan.md`: for each shot and move, its time, size, what the camera sees and its focus; the props table (each
  prop's state over time); the concept pictures.
- `SKILL/references/specs.md`: the size definitions under "Shot sizes", and "Framed well".

**For each frame** (match it to the plan row whose time range holds its time stamp)
1. **Size:** is it the declared size (xwide, wide, full, medium, close, insert) as specs.md defines them?
2. **Focus:** is the plan's focus what the eye goes to, whole and clear of anything in front of it? Is anything
   the plan says the camera sees missing or cut?
3. **Framed well:** not too close (no face, no hand doing the action and no prop the line is about cut by the edge;
   room above the head and in front of the face) and not too far (the subject isn't lost small in a lot of empty
   set). Key things stay out of Instagram's covered areas: the top 11.5 %, the bottom 24 % and the right 13 %.
4. **Props:** each prop in the state the props table gives at that time, in its own place (not on top of another
   prop or in front of a face).
5. **Concepts:** for a frame that shows a concept picture, does it say the concept with the sound off, nothing left
   to imagine? A number is a count of things, and a comparison has both things whole and visibly different.
6. **The place, without words:** on the first frame in each place, could you tell where this is from the set alone?
   If not, name 2–3 set pieces to add. Any card, sign or lettering that names the place or the scene, or announces
   what happens next or when, is a failure: it has to go.

**Report** (write it to `P/qa/layout.md`, and return the same text):
```
- [00:12.40] <what is wrong> → <the fix: aim further left/up, size full instead of close, move the jar to x 1.2, ...>
...
All other framings OK.
```
Only real problems, each with its time and a fix. If a frame is fine, leave it out.
