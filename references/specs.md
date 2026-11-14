# Specs for every video (always followed; the reviewer checks every line)

These come from the owner. They are rules, not suggestions. Every video meets all of them before the user sees it.

- **Hard limits** ("at least", "at most", "never", "none over", "every") are met exactly. A miss is a blocker.
- **"About" numbers** have their allowed range in brackets. Outside it is a blocker too.
- **Script-side items** (marked *script*): how many words, the hook line, "You see,", where the payoff is said. A
  script the skill writes must meet them (a miss is a blocker: rewrite the line). Only a script the user pasted
  themselves can miss them: then tell the user, and never change their words. Everything else is the build's job.
- `tools/qa.mjs` measures what it can (marked *QA*) and writes it to `P/qa/checks.md`. The reviewer checks the rest
  from the sheets and close-ups (marked *look*), and fills in the table at the end of its report.

## 1. Specs for every video

**Format**
- Vertical 9:16 (1080×1920), 30 frames a second, 45–60 seconds. *QA*
- The first frame shows a character already moving, fully lit. Never black, never a title, never a logo. *QA + look*

**How fast it talks**
- About 3 words a second (2.8–3.2), at the narrator's own pace: always Mark - Natural Conversations on Eleven v4,
  which ignores the speed setting, so the script sets the pace. *QA*
- The voice is never edited or re-timed: no speeding up, slowing down, cutting or added pauses. Only the silence
  before the first word and after the last is trimmed. The picture is never sped up or slowed down either. *QA*
- A 45-second video has about 130–150 words; a 60-second one has about 175–195. *script*
- No captions: no word-by-word subtitles of the narration. Labels, lettering and diegetic text (a carved message, a
  sign) are fine, and every piece of text reads correctly, never mirrored. *look*
- Every visual reaction, reveal and big action lands 0–3 frames before its word, never after it. *look* (bursts)

**The story** *script + look*
- Show, don't tell: every line has a picture that tells it; the narration never names a feeling or describes what's
  on screen.
- No real, named living people as characters, no brand mascots or logos, nothing graphic or political; stories,
  characters and shots are original.

**The first 4 seconds (the hook)**
- A surprising action, stated as fact, inside the first 4 seconds. *script + look*
- The framing changes 4–5 times in those 4 seconds (about one change a second). *QA*
- At most 1–2 scene changes in those 4 seconds; the rest of the change comes from the camera moving. *QA*
- "You see," explains right after the hook, or brings the reveal about two-thirds of the way in. *script*

**How often the scene changes** (a shot = a stretch between scene changes)
- A new shot every 4.3 seconds on average (3.1–5.1), about 13 a minute. *QA*
- That's about 10–11 shots in a 45-second video, or 14–15 in a 60-second one. *QA*
- Shot lengths vary: 1 in 10 is under 1.1 seconds (5–20 % of shots), and none is over 8.6 seconds. *QA*
- 7 in 10 shot changes move to a new place (55–85 %), so the place changes about every 6–7 seconds (5–8). *QA*
- A 45-second video visits about 7 places; a 60-second one about 9 (7–13). *QA* (visits: each stretch in one place)
- Every change is quick (a quarter to half a second) and shown on screen, never a dip to black. *QA + look*

**How often the camera pans or zooms meaningfully**
- The framing changes about every 1.4 seconds (1.1–1.8 on average): about 33 times in 45 seconds, about 44 in 60. *QA*
- Each change is a fast, eased pan or zoom to the new framing, then a very slow drift the same way until the next
  move. *QA + look*
- About 3 in 4 framing changes happen during a camera move, not at a scene change (65–85 %). *QA*
- The camera is still at most about 8% of the time; a short stop is fine. *QA*
- About 1 in 5 frames has a fast move (12–30 %), and nothing is a smeared whip. *QA + look*

**Shot sizes (share of screen time)** *QA* (from the declared sizes) *+ look* (that each framing really is that size)
- Extreme wide plus wide shots fill at least 25% (36% in Rick's), and every new place opens wide.
- Full shots are home base at about 27% (20–35 %).
- Medium shots are passed through quickly (under half a second each) and never fill more than 20%.
- Close shots on faces are only for the big reactions (about 13%, 8–18 %); close-ups of objects take about 10% (5–15 %).
- Extreme wide shots are held longest (about 1.7 seconds, 1.3–2.2), with the camera travelling through the place.

Sizes, for this style: **xwide** the whole theatre or more than the set (proscenium, wings or flies in frame; actors
under 1/6 of the height). **wide** the whole set of this place (actors about 1/4–1/3 of the height). **full** an actor
head to foot, about half to two-thirds of the height. **medium** an actor from the waist up. **close** a face, head and
shoulders, about half the frame. **insert** a close-up of an object.

**The ending**
- The payoff lands in the last 10–15% and the video ends on it, with no outro. *script + QA* (the picture holds
  0.8–2 s after the last word, on the payoff)
- Surplus is never shown: no phone, screen, app, app icon or anything that looks like the app. The character brings it
  in through the story at the end, and acts out the change. *look* (owner's rule)

## 2. Sets and places
- Build every set wider and deeper than the frame, so pull-outs and pans never show an edge. *look*
- Add small extra places (the wings, up on the flies, a close-up area, a second room) so the place can change every
  6–7 seconds. *QA (place count) + look*
- About 1 in 5 place changes should have no cut: the camera flies from one area of the stage to the next (10–35 %). *QA*

## 3. Spotlight Stage: changes to the prompt (in `styles/spotlight-stage/card.md` and `prompt.md`)
- 1080×1920 vertical, 45–60 seconds (was 1920x1080, 7-12 seconds).
- The camera follows the pan-or-zoom-then-drift rule. It leaves the stalls seat: it pushes onto the actors, pulls
  back to the whole stage, and pans across into the wings. (Replaces "one slow continuous move from a seat in the
  stalls".) *QA + look*
- Keep the camera within about 25° of straight-on, so the flat cut-outs never turn edge-on (≤ 25°; over 30° is a
  blocker). *QA*
- Keep the in-view scene changes (flats sliding, cards pulled, light changing colour), but each must take a quarter to
  half a second, not a full second or more. *QA (declared) + look*
- A narration track at 3 words a second, and no captions. *QA + look*
- The easel card stays as the scene's name, with a black outline too. *look*

## 4. Theatre lamps
- Light every area the camera can see, including the wings, the flies and the extra places, so no shot shows a black
  gap. *QA (black share) + look*
- Follow spots stay on the actors through every fast pan and zoom, so faces never drop into the dark. *look*
- Change the wash colour at the same moment as each quick scene change, so every new place reads instantly. *look*
- Light the first frame fully: no fade-up from dark. *QA*
- Raise the front washes about 20%, so the average brightness goes from 35% to about 40% (36–44 %). *QA*
- Let the unlit areas fall to deep indigo, not pure black (pure black on about 1% of the picture at most, down from
  3.5%). *QA*
- Add a little colour, taking colour strength from 35% to about 45–50% (42–53 %). *QA*
- Keep the dark theatre mood: the beams through the haze and the pools of light stay. *look*

(QA measures the sheet frames without the band at 64–76 % of the height, where captions used to sit, so the numbers
stay comparable: brightness = mean luma, colour strength = mean HSV saturation, pure black = pixels with no channel
above 10/255.)

## 5. Character movement *look* (sheets, plus `qa.mjs P --burst <t>` for 12 frames in a row at each big action)
- **Travel in every shot.** The cut-out slides along its floor slot across the stage, enters and exits through the
  wings, and never stands on one spot for a whole shot.
- **Walking.** The slide gets a small hop or bob every 8–10 frames, with a slight tilt side to side.
- **Hinged limbs.** Arms and head swing on pins: point, wave, hold props, tilt the head.
- **One big action per beat, on its word.** A 4–8 frame lean back first, then the move overshoots by 10–20%, then it
  settles over 8–14 frames.
- **Eyes first.** The face turns towards what it reacts to about 3 frames before the body moves.
- **Pose swaps on big moments.** Swap to a shocked, proud or worried cut-out on the beat, with a small bounce.
- **Reactions on screen at their word**, held at least half a second on a face we can read.
- **Holds never freeze.** A slow sway on the rod (1–2 degrees) keeps the puppet alive even when it waits.
- **Impacts.** A 3-frame freeze, then a recoil, with a sound effect on that frame.
- **Props act too.** Food flies in on rods, and the scale needle swings, overshoots and settles.
- **No lip-sync.** The character reacts and acts the story out.

## 6. Audio *mix.py* (prints each level; render.mjs stops if a rule is missed)
- Always mixed with `tools/mix.py`, never by hand.
- The music bed sits at 50 % of the voice level: −6 dB, gated RMS (400 ms blocks, gated like loudness meters).
- SFX sit at 50 % of the voice level or slightly less (≤ −6 dB, gated RMS), with peaks capped: no 50 ms of effects is
  louder than the narration's loud syllables (the 95th percentile of its 50 ms levels), so no hit pokes out over it.
- No ducking or compression that would change these ratios. The whole mix gets one linear gain (to about −15 LUFS)
  plus a peak limiter (−1.5 dBFS) and nothing else.

## How the build declares what QA measures (in `src/style.js`, passed to `registerStyle`)
```js
shots: [ // every scene change; the first at t 0. place: a name per area; size: xwide|wide|full|medium|close|insert
  { t: 0, place: 'kitchen', size: 'wide' },
  { t: CUE.at('every day'), place: 'wings-left', size: 'xwide', how: 'change', dur: 0.35 }, // flat wipes across, new wash
  { t: CUE.at('you see'), place: 'flies', size: 'wide', how: 'fly', dur: 0.45 },             // camera flies there, no cut
],
moves: [ // every pan or zoom inside a shot: when it starts, and the size it lands on
  { t: CUE.at('eat'), size: 'full' }, { t: CUE.at('all'), size: 'close' }, ...
],
payoff: CUE.at('<first word of the payoff>'),
```
The size holds from its entry until the next shot or move. QA builds the timeline from these two lists and checks
the camera itself (speed, stillness, angle) every frame, so a declared move that doesn't happen shows up there.

## The spec table (the reviewer's report ends with it)
One row per bullet in sections 1–5 (section 6 is checked by mix.py at the mix): `| spec | measured / seen | met? | times |`. Met only when the number or the frames
show it. Every "no" is a blocker, except script-side misses in a script the user pasted: those go in a separate
line for the owner.
