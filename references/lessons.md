# Lessons (read before building; check again in every review)

One line per lesson: the general rule, then why, then the video it came from. Add to it after every review round and
every round of the owner's notes. Fix the general cause, not only this video. Merge a new lesson into an existing line
when it's the same rule; don't add duplicates.

## Framing and motion
- Thrown or hopping objects: keep the top of every arc inside the frame **for the camera at that moment**; arc height
  ≤ about half the distance travelled. High arcs leave the frame. (stomach-stretch: bites and the hop left the top)
- Check frames **during** camera moves and whips, not only the held poses: things that are fine at rest leave the
  frame mid-move. (stomach-stretch)
- Never reset, refill or swap a prop that stays in frame on a shot-change drawing: empty it with a visible move
  (a drain over a few drawings, a poof) or change it only while it is out of frame. (how-fast-to-gain: cups emptied
  and the plate restocked in one drawing during a whip)
- Lettering placed for a shot's settled camera rides the whip in if it pops during the move: pop it once the whip
  has landed (the label waits for shot start + 4 drawings), stamp sound with it. (how-fast-to-gain)
- When one beat changes two props (a stamp on the phone, the needle on the dial), that shot has both in frame.
  (how-fast-to-gain: ON PACE with the needle off screen)
- Two props side by side are wide for a 9:16 frame: lay out the hero props so they stack in depth or height, and
  check each framing with a quick projection of the props' corners against the subtitle band and the safe areas
  before rendering. (how-fast-to-gain: the cups could not fill the height and clear the subtitles)
- The opening is wide (specs: every new place opens wide), but tight to the set: the hero about a third of the height
  and already moving, and the first push-in comes within about a second. A far, empty opening reads as nothing on a
  phone. (stomach-stretch: opening was too far)
- In-view scene changes: an outgoing flown or slid piece must be out of frame before the next piece enters the same
  part of the frame. Stagger by the out-move plus the time the incoming piece is already visible before it lands
  (about 1.2–1.5 s for a 0.75 s fly-out). If you don't, they cross and read as collisions. (eat-less-than-you-think: the balance
  rose through the incoming cloud, a page landed on a hanging pan)
- Never park a prop on the same screen spot as one already standing there. Give each prop its own place. If both
  can't fit large enough to read, show them in separate shots (pan from one to the other) rather than one wide
  frame. (eat-less-than-you-think: the penny scale stood in front of the balance's post)

## Characters and faces
- Put eyes and faces on the broad, smooth part of a shape, never in a crease, joint or where the surface folds; make
  them big enough to read at phone size. (stomach-stretch: eyes sat in the gullet crease)
- Small marks (sweat drops, sparks) over a surface of similar value read as wrong shapes: give them contrast and a
  clear silhouette. (stomach-stretch: sweat drop read as a white triangle)

## Words on screen
- Plan where every caption and label goes **per shot** before building: never over the subject or a prop in use, never
  in the subtitle band or Instagram's covered areas. (stomach-stretch: caption covered the plate)
- Burned-in subtitles are words on screen too: frame each shot so no readable prop (a dial face, a phone screen) and
  no point of action sits in the subtitle band (y 0.64–0.76 of the frame). Fix it with the camera, not only the
  labels. (how-fast-to-gain: subtitles over the dial and the phone's rows) The hero's own body and pointing hand
  count too. In every full-figure shot, put the floor at ≤ 0.62 of the height. With the camera centred on the actor
  plane, that means framing y ≤ 0.12 × the visible height. Or keep the character out of the subtitle column.
  Check each shot's numbers, not only the plan. (eat-less-than-you-think: subtitles crossed Sam in 5 shots)
- The subtitle's highlight colour must contrast with what sits behind the band (mustard on a mustard prop vanishes).
  (how-fast-to-gain)
- Check gaps between lettering, captions and props at the pop's overshoot (about 1.18×), not only at rest; two words
  on screen at once in the same spot (a word and its caption) need a clear gap or one of them goes. (how-fast-to-gain)
- Text drawn on a prop's screen: measure each string and shrink it to fit its column, and frame the screen big
  enough that its smallest text reads on a phone. (how-fast-to-gain: a food name ran into its number)
- Props in a row each with a tag: spread the props and stagger the tag heights so tags can't collide; keep tags
  large enough for a phone. (stomach-stretch: food tags overlapped and were small)
- Dials and gauges: a needle must never cover the key number at its rest or final position. Put labels outside the
  needle's sweep. (stomach-stretch: needle hid "+0.5")

## Code
- `K.seg(q, a, b)` with a == b divides by zero (NaN): never build a zero-width window. (stomach-stretch)
- A mesh squashed to near-zero height on a coplanar surface shows only its ink outline (a black blob): give it a
  minimum height, or hide the surface under it. (how-fast-to-gain: the fat dome)
- `sound(k)` runs outside `build()`: every time it reads (flights, drops) must live at the top of style.js. qa.mjs
  runs the score on a stub ("sound score runs"); a FAIL there means silence or a crash on Play. (how-fast-to-gain)
- Anything the kit renders several times per frame must be stateless in `update(t)`; rebuild per-frame geometry from
  t, never accumulate.

## Tools on this machine
- Whisper stretches the last words of a line into the pause after it (0.3–0.75 s late). voice.mjs ends each line at
  the measured silence and splits it at every comma, question mark or full stop that has a pause, fitting each
  part's words into its own speech. If the whole line is stretched instead, words after a pause land up to 0.5 s
  early. Land lettering on its word or 1–2 drawings before, and check a few words against the audio.
  (how-fast-to-gain; full stops added in eat-less-than-you-think, where "So why can't he gain?" lit 0.45 s early)
- On this M1 (8 GB), a heavy scene at full size with many samples per frame (40, ray-marched beams) slows down frame
  after frame until the GPU drops the WebGL context. Every frame after that is black, and the render "finishes"
  much too fast with check frames that are all the same small file. render.mjs now reopens the page when a frame
  gets slow or the context is lost. Before rendering, time ~20 full frames (8 samples stayed at about 1.5 s per
  frame) and pass `--samples` to match. Always look at the check frames before sending. (eat-less-than-you-think)
- `qa.mjs --times a,b,c --full` (the style's full sample count) hit the same GPU context loss: black frames after the
  first. Use the default close-ups, or one time per `--full` run. (eat-less-than-you-think)
- This machine's ffmpeg has no `drawtext`: stamp times and labels in the page (chrome.mjs `grab` does) before tiling.
- A local server must send `charset=utf-8` for HTML and JS, or "·", "…" and other non-ASCII text turn into garbage.
  (tools/serve.py does)
