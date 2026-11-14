---
name: surplus-video
description: Makes a finished vertical (9:16) 3D animated video promoting the Surplus weight-gain app, always in the Spotlight Stage style (a toy theatre lit by stage lamps). First asks the kind of story (a story with a twist that can be true, reworked from a true one or made up, or a relatable story with a surprising real fact), then offers 10 story ideas of that kind to pick from, then writes a show-don't-tell script told like you're telling your best friend, with voiced character lines, plain words, a he/she/they main character and a hook that starts with He, She or They (or uses one the user pastes); scene changes are straight cuts; Surplus is told through the character, never shown as a phone or app. Voices it with ElevenLabs (always the narrator Mark - Natural Conversations on the Eleven v4 model) at his natural 3 words a second (the voice is never sped up, slowed, cut or re-timed, and there are no pauses), times every word with Whisper, builds the animation to fixed specs with no word captions, has one fresh reviewer agent check it once, fixes what it finds, mixes the audio with mix.py (music bed at -19 dB to the voice, as in the model videos), shows the preview, and renders the MP4 only after approval. Lessons from every review are kept. Use for "/surplus-video", "make a Surplus video/reel", "make a Surplus video about ...", "new animation for Surplus".
---

# /surplus-video

From an idea to a finished, reviewed MP4. The user picks the kind of story and one of ten ideas, watches the preview,
gives notes by timestamp if they want changes, and says when to render. You do everything else, the script included.

**Names:** SKILL = this skill's folder (its base directory). P = the project folder, `~/surplus-videos/<yyyy-mm-dd>-<slug>`.
**Read first:** `references/specs.md` (the owner's specs: every video meets them), `references/surplus.md` (what we
sell, the CTAs, health guard rails), `references/script.md` (how the stories work) and `references/lessons.md` (every time).
Read the others at their step: `references/stories-done.md`, `references/build.md`, `agents/reviewer.md`.

## Rules, always
- **Original.** Stories, characters and shots are always original. Never recreate another creator's video shot for
  shot; offer an original take on the same idea instead.
- **No real, named living people as characters**, and no real living person as the butt of a joke. No brand mascots or
  logos. Nothing graphic, nothing political.
- **Show, don't tell.** The picture tells the story; the narration says only what the picture can't (`references/script.md`).
- **No captions.** No word-by-word subtitles of the narration. Labels, signs and lettering are fine, and diegetic text
  (a carved message, a sign) is fine; all text reads correctly, never mirrored.
- **Never edit or re-time the voice.** ElevenLabs speaks at the pace the specs need on its own: no speeding up, no
  slowing down, no cutting, no pauses added. Only the silence before the first word and after the last is trimmed.
  The picture is timed to the voice, and every visual reaction lands 0–3 frames before its word. The video is never
  sped up or slowed down either.
- **Audio levels:** the music bed sits at −19 dB to the voice (gated RMS), the level under the owner's model videos
  (owner's change, 2026-11-14; it was −6 dB). SFX sit at 50 % (−6 dB) or slightly less, with peaks capped so no hit pokes out over the narration. Always mix with `tools/mix.py`, never by hand. No
  ducking or compression that would change these ratios; only one linear gain plus a peak limiter goes on the whole mix.
- **Keys:** the ElevenLabs key lives in `~/.surplus-video-keys` or `~/.make-short-keys`. Never print, open or ask for it.
- **Nothing is posted anywhere.** The output is a file on this Mac.
- **Look before you show.** Look at frames yourself before showing the user anything. Passing checks is not the same as looking right.
- **Every video meets `references/specs.md`.** Its numbers beat anything else in this skill, the style card or the
  reference. A script you write meets the script-side specs too; only a script the user pasted can miss them, and
  then you tell them.
- **One review, by a fresh agent**, never you grading your own work. It runs once per video, then the video comes back
  to the user ready. More changes happen only when the user asks for them.
- **You write the script**, from the idea the user picked (step 1). Never script an idea they haven't picked. If the
  user pastes their own script instead, use it word for word.
- **Surplus is never shown.** No phone, no screen, no app, no app icon, nothing that looks like the app (calorie rings,
  dashboards, progress bars). The plug is told through the story's character at the end: the narration says what
  Surplus does for them, and the character acts out the change. The name and the CTA may be lettered in the style
  (the easel card, a marquee).
- **One style only:** #6 Spotlight Stage (`spotlight-stage`). Never ask which style. If the user asks for another
  one, say the skill is set to Spotlight Stage.
- **Stories can be true, reworked or made up; facts can't.** A story may be true, a true one made better (a sharper
  twist, higher stakes, bent towards eating and gaining) or fiction (`references/script.md`, "Where the story comes
  from"). A changed or made-up story is never called true, and a reworked one uses invented characters instead of the
  real people. The food, body and weight facts a story teaches are real: checked with a web search and listed under
  Sources in `P/script.md`. Surplus claims only from `references/surplus.md`. Never write a fact you can't source:
  leave it out. (In a script the user pasted, a wrong or unsupported claim goes back to them, step 4.)
- **Fits Surplus, never an ad.** The story's problem is one Surplus solves, but Surplus only appears in the payoff,
  as one thing it does for the character (`references/script.md`, "Fit the app, don't sell it").
- **Ask before downloading** anything (models, packages), with name, source and size.
- Keep messages between steps short: what happened, in a line or two. No code or stack traces for the user.

## 0. First run on a computer (skip when `SKILL/.checked` exists)
Check: `node -v` (18+), `ffmpeg -version`, `python3 --version`, Google Chrome installed, `whisper-cli` (`brew install whisper-cpp`), the model
`~/.cache/whisper-cpp/ggml-small.en.bin` (466 MB, from huggingface.co/ggerganov/whisper.cpp), `SKILL/tools/node_modules/puppeteer-core`
(`cd SKILL/tools && npm i`), and a key line in one of the key files (`grep -c '^ELEVENLABS_API_KEY\|^Creator_key' <file>`: count only, never print).
Install what's missing after asking. If there's no key, the user saves it themselves: `echo 'ELEVENLABS_API_KEY=...' > ~/.surplus-video-keys`.
Then `touch SKILL/.checked`.

## 1. Kind, idea, call to action
1. **Kind and CTA** (one AskUserQuestion call with two questions; skip what the user already said).
   - *Kind:* **Twist story** (a story with a twist from any era: true, reworked from a true one, or made up; Surplus
     comes in at the end) /
     **Relatable story** (an everyday moment the viewer lives and the surprising truth behind it; Surplus is the fix).
   - *Call to action:* *Link in bio* / *Search Surplus on the App Store* / *Comment a keyword* (then ask the keyword:
     one word in caps).
2. **Ten ideas of that kind.** First read `references/script.md` (all of it), `references/surplus.md` and
   `references/stories-done.md` (every story already made, and what counts as too similar), plus the `brief.json` and
   `script.md` of any `~/surplus-videos/*` not on that list yet (videos still in progress). Then find 10 ideas that fit
   "What makes an idea right" in script.md, mixed the way it says (true, inspired by a true story, fiction), each
   labelled. Check a true idea's story with a web search before offering it (one you can't verify can come back as
   inspired or fiction, labelled so), and check every idea's food or body fact. Give each its actual hook line,
   written and tested as script.md says. Check all 10 against stories-done.md and against each other, and replace any
   that's too similar. If the user named a topic, all 10 are takes on it; if they bring another creator's video, the
   ideas are original takes on its idea, never a copy.
   Put them in a doc: load the docs skill (`anthropic-skills:docs`, or whatever docs tool this session has) and make a
   doc titled "Surplus: pick a story (<kind>)" with the 10 in the format from script.md, label and sources under each. With no
   docs tool, write the same to a file and open it. Give the user the link, and in chat show the 10 as a numbered list
   (title, era or moment, True / Inspired / Fiction, the hook line, the twist or turn: one or two lines each). Ask them to reply with a number,
   or with changes; make the changes and ask again until they pick one.
3. **Make P** (slug from the picked title): `mkdir -p P/{src,qa,out,voice,kit} && cp SKILL/kit/* P/kit/`, and write
   `P/brief.json`: `{ "kind": "twist|relatable", "source": "true|inspired|fiction", "story": "<picked title>", "hook": "<its hook line>", "cta": "bio|appstore|keyword", "keyword", "style": "spotlight-stage" }`.
4. **A script the user pastes** (at any point here) replaces 1–2: use it word for word, take the CTA from its ending
   (ask only if it isn't clear), make P with `"story": null`, and go on.

## 2. The style: always #6 Spotlight Stage (no question)
A toy theatre at night: card cut-outs in layers, lit by beams through haze. Its files are in
`SKILL/styles/spotlight-stage/` (card.md, reference.js, notes.md). If `stage.js` or `sound.js` exists there, copy it
over `P/kit/`.

## 3. The voice: always Mark on Eleven v4 (no question)
The narrator is always **Mark - Natural Conversations** from the owner's ElevenLabs voices (`voiceId`
`UgBBYS2sOqTuMpoF3BR0`), on the **Eleven v4** model (`eleven_v4`), with stability 0.5, similarity 0.8 and speed 1.0:
all in config.json, picked by the owner from test takes. Never ask which voice or model, never switch them, and never
set either per video. If the user asks for another narrator, say the skill is set to Mark on v4. If ElevenLabs answers
that the voice isn't found, ask the user to add "Mark - Natural Conversations" to My Voices on elevenlabs.io.

**From here to the preview: no questions.** Once the idea is picked, work through steps 4–9 and only come back
with the reviewed preview. Say in one line what you're starting at each step.

## 4. The script → `P/script.md`
Write it from the picked idea, following `references/script.md` (the format of the owner's eight model videos; its
model script shows the rhythm): the beat map for its kind, the hook (He, She or They, one strange act with one object
in the past tense, then a pressure beat in the same breath; ten written, the best kept), told like you're telling your
best friend (present tense, the viewer voiced with "Wait, …? Well, …", a comedy aside about every ten seconds, two to
four short voiced lines, mostly the doubters), said as it is (plain results and things; the main character as he, she
or they, everyone else by role, no names), the story engine (an underdog or backfire arc, want and stakes by second
eight, "but" and "so" beats, a time ladder in threes, a loop open at all times, a planted detail, the why held back for
the "You see," reveal 60–75 % in, the story ending on a callback to the hook's object), show don't tell (a *We see*
line under every line), no pauses, the specs' word count (aim for 150–170 words, about 50–57 s), written to flow
("Writing for the ear": commas and bridges between beats, full stops only for the hook, a few punch sentences, the
callback and the CTA), a new place every ~20 words, and the payoff (the bridge carrying the story's trick into today,
the character's result with Surplus, then the CTA) in the last 10–15 %, nothing after it. Every real fact, number and
health claim checked (web search) and listed under Sources, the story's source under Story source, a changed or
made-up story never called true, and Surplus only in the payoff; Surplus claims only from `references/surplus.md`. Run the
checklist at the end of script.md, then add the numbered script to the ideas doc under a heading **Script**, so the
user can read it while you build. No question: go on.
A script the user pasted: lay their words out in the same file format (only line breaks, `[S#]` and *We see* lines
added, never a word changed; any pause marks in it are dropped). If a claim in it is wrong or unsupported, quote the
line, say what's off with the source, and wait for their corrected line (the one question allowed before the
preview). Script-side specs it misses: list them in one line each at step 9; never change their words to meet them.

## 5. Voice and word timing
`node SKILL/tools/voice.mjs P` → `P/voice/voice.mp3`, `P/timing.json` (every word's start and end, scenes), `P/vo.js`.
- **The pace comes from the script.** Mark on v4 reads at about 3 words a second at his own pace, and v4 ignores
  ElevenLabs' speed setting, so voice.mjs makes one take, measures it and says if it's outside 2.8–3.2. Fix a miss
  in script.md, never in the audio: too slow, join more sentences with "and", "but", "so" and cut commas (a full
  stop is about half a second of breath, a comma about a third); too fast, add a full stop at a turn. Then take it again (at most 2 re-takes, then
  tell the user). It never speeds up, slows down, cuts or stretches the audio.
- It prints words Whisper heard differently. Number formats and homophones are fine. A skipped or wrong word means
  a new take (`node SKILL/tools/voice.mjs P` again). At most 2 re-takes, then rephrase that line in script.md, same
  meaning (in a script the user pasted: tell them which word the voice keeps getting wrong instead).
- The voice must run 45–60 s. If it doesn't, add or cut a beat in script.md and take it again (a script the user
  pasted: say so in one line at step 9, never cut or add their words).
- `node SKILL/tools/voice.mjs P --retime`: timing only from the existing take (no new take, no cost), e.g. after a
  new Whisper model.

## 6. Plan → `P/plan.md`
Plan to `references/specs.md`. For each scene: its time range (from timing.json), the **places** (areas of the stage,
about 7–9 for the video), and for each line **what we see** (from the script's *We see* lines: the picture tells it,
the narration never describes it). Then every **shot** (time, the phrase, the place, how it changes: a straight cut, or
a camera flight of 0.25–0.5 s) and every **move** inside it (time, pan or zoom, the size it lands on), so the counts
and shares in specs.md come out right (add them up in the plan: shots, average shot length, place visits, framing
changes, the first 4 s, share of each size). Then each big character action and reaction (time, the word, the pose
swap; it lands 0–3 frames before its word), every label or piece of lettering and where on screen it sits (outside
Instagram's covered areas, reading the right way round), the key sounds, and the music bed (which pad or pulse under
which part, changing chord with the story's turns). Then go through `references/lessons.md` and note how this plan
avoids each lesson that applies.

## 7. Build → `P/src/style.js`
Read `references/build.md`, the style's `card.md`, its whole `reference.js`, and its `notes.md`. Build the scene code as
the reference does, with every time from `CUE`, the `shots`, `moves` and `payoff` the specs ask for, the music bed and
effects in `sound(k)`, no captions, and the Surplus ending. Where the reference and specs.md disagree (camera, lamps,
pace), specs.md wins. `node SKILL/tools/build.mjs P` must pass. Then open the preview in the browser pane and scrub
through the cues and shots yourself; fix what you see.

**Preview server:** in the session's working folder, `.claude/launch.json` gets (or updates) a configuration
`{ "name": "surplus-preview", "runtimeExecutable": "python3", "runtimeArgs": ["<SKILL>/tools/serve.py", "<P>", "8765"], "port": 8765 }`.
Start it with `preview_start` (stop an older one on the same port first), then open `http://localhost:8765/preview.html`.
`?t=12.4` opens at a time.

## 8. One review (once per video, before the user sees anything)
1. `node SKILL/tools/qa.mjs P` → `P/qa/checks.md` (every spec it can measure) + `P/qa/sheet-*.jpg` (a frame every 0.5 s,
   time-stamped). About 2 min. Fix every FAIL before spawning the reviewer.
2. Spawn **one fresh reviewer**: Agent tool, `general-purpose`, description "Review video frames", prompt = the whole of
   `SKILL/agents/reviewer.md` with `{P}` and `{SKILL}` filled in, plus the style slug. Wait for its report.
3. Fix every blocker and should-fix. Fix the cause (in the general way) in `src/style.js`, rebuild, and look at the
   fixed moments yourself: `node SKILL/tools/qa.mjs P --times <t1>,<t2>` (skip `--full`: it loses the GPU, see lessons.md).
   Then run `node SKILL/tools/qa.mjs P` once more and fix any FAIL. No second reviewer: the video goes back to the
   user. Anything you couldn't fix goes in the hand-off.
4. Add the reviewer's "New general lessons" (and your own) to `references/lessons.md`: the general rule, merged, no duplicates.

## 9. Show the user
1. **The mix:** `node SKILL/tools/render.mjs P --audio` renders the effects and the music bed, mixes them with the voice
   through `tools/mix.py` (prints each level against the rule) and rebuilds the preview, so it plays the final mix.
   Run it again after any change to the voice or to `sound(k)`.
2. Open `http://localhost:8765/preview.html` in the browser pane (if the pane is hidden, ask them to press Cmd+Shift+B).
   Tell them, briefly:
   - what it is (the story, kind, length) and the script (the numbered lines);
   - what the reviewer caught and you fixed, and anything still open; the specs: all met, or which one isn't and why;
   - for a script the user pasted: any script-side spec it misses (step 4), one line each;
   - how to give notes: **"Play it and tell me what to change with the time from the clock, top-right, e.g. '0:12.4 the
     label covers the jar'. ←/→ steps one frame (shift: 1 s). *Safe* shades the parts Instagram covers."**
   Then ask: *Any changes, or render it?* (buttons: *Render it* / *I have changes*).

## 10. Changes (only when the user asks)
Log each note in `P/notes.md` (time · note · what you changed). Picture changes: fix, rebuild, close-up QA at those
times, and look yourself. Script changes: rewrite the lines the note asks for (the user's own words exactly when they
give them), still to the specs, update the doc → `voice.mjs P` (new take; every cue follows) → rebuild → full QA.
After a voice or sound change, `render.mjs P --audio` again. No reviewer round unless the user asks for one. A note
that conflicts with a spec or a rule: do what the user says, and tell them which one it breaks. Show it again
(step 9). Repeat until the user says render.

## 11. Render (only on the user's explicit go)
`node SKILL/tools/render.mjs P --samples <n>` in the background; say the expected finish time. Use `--samples 8` (about 40 min
for 55 s; more lost the GPU on this Mac, see the style's notes.md). It renders every frame, mixes the audio with
`tools/mix.py`, and writes `P/out/<name>.mp4` plus `P/out/check-1..5.jpg`. Look at the check frames: if they
are black, or all the same small file, the GPU dropped out. Then send the MP4 to the user (SendUserFile) and `open` it.

## 12. Close the loop
- Turn the user's notes into general lessons in `references/lessons.md` (what kind of mistake, the rule that prevents it).
- Style-specific lessons go in `SKILL/styles/spotlight-stage/notes.md`.
- `echo "<P folder name>" >> SKILL/styles/spotlight-stage/videos.txt` (a record of the videos made).
- Add the story to the top of the list in `references/stories-done.md`, in its entry format (core fact, hook, lesson,
  character, payoff), so later ideas steer clear of it. (The skill folder is a git repo: commit and push only when
  the user asks.)
