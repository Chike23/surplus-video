---
name: surplus-video
description: Makes a finished vertical (9:16) 3D animated video promoting the Surplus weight-gain app, always in the Spotlight Stage style (a toy theatre lit by stage lamps). Suggests topics, puts two story outlines (Story A, Story B) in a doc to pick from, then writes the script (or uses one the user pastes); Surplus is told through the character, never shown as a phone or app. Voices it with ElevenLabs paced to 3.75 words a second, times every word with Whisper, builds the animation to fixed specs (shot, camera-move and shot-size rates, lamp levels, puppet movement), has a fresh reviewer agent check every spec and frame, fixes it, shows a timed preview for notes, and renders the MP4 only after approval. Lessons from every review are kept. Use for "/surplus-video", "make a Surplus video/reel", "make a Surplus video about ...", "new animation for Surplus".
---

# /surplus-video

From a topic to a finished, reviewed MP4. The user picks a topic and one of two stories, watches the preview, gives
notes by timestamp, and says when to render. You do everything else, the script included.

**Names:** SKILL = this skill's folder (its base directory). P = the project folder, `~/surplus-videos/<yyyy-mm-dd>-<slug>`.
**Read first:** `references/specs.md` (the owner's specs: every video meets them), `references/surplus.md` (what we
sell, the CTAs, health guard rails) and `references/lessons.md` (every time).
Read the others at their step: `references/stories-done.md`, `references/script.md`, `references/build.md`, `agents/reviewer.md`.

## Rules, always
- **Keys:** the ElevenLabs key lives in `~/.surplus-video-keys` or `~/.make-short-keys`. Never print, open or ask for it.
- **Nothing is posted anywhere.** The output is a file on this Mac.
- **Look before you show.** Look at frames yourself before showing the user anything. Passing checks is not the same as looking right.
- **Every video meets `references/specs.md`.** Its numbers beat anything else in this skill, the style card or the
  reference. The user never sees a preview that misses a spec. A script you write meets the script-side specs too;
  only a script the user pasted can miss them, and then you tell them.
- **The reviewer is always a fresh agent**, never you grading your own work. It checks every spec.
- **You write the script**, from the topic and the story the user picked (step 1). Never script a story they haven't
  picked. If the user pastes their own script instead, use it word for word.
- **Surplus is never shown.** No phone, no screen, no app, no app icon, nothing that looks like the app (calorie rings,
  dashboards, progress bars). The plug is told through the story's character at the end: the narration says what
  Surplus does for them, and the character acts out the change. The name and the CTA may be lettered in the style
  (the easel card, a marquee).
- **One style only:** #6 Spotlight Stage (`spotlight-stage`). Never ask which style. If the user asks for another
  one, say the skill is set to Spotlight Stage.
- **Facts:** every number or health claim in the script is checked (web search) and listed under Sources in
  `P/script.md`. Surplus claims only from `references/surplus.md`. Never write a claim you can't source: leave it out.
  (In a script the user pasted, a wrong or unsupported claim goes back to them, step 4.)
- **Ask before downloading** anything (models, packages), with name, source and size.
- Keep messages between steps short: what happened, in a line or two. No code or stack traces for the user.

## 0. First run on a computer (skip when `SKILL/.checked` exists)
Check: `node -v` (18+), `ffmpeg -version`, Google Chrome installed, `whisper-cli` (`brew install whisper-cpp`), the model
`~/.cache/whisper-cpp/ggml-small.en.bin` (466 MB, from huggingface.co/ggerganov/whisper.cpp), `SKILL/tools/node_modules/puppeteer-core`
(`cd SKILL/tools && npm i`), and a key line in one of the key files (`grep -c '^ELEVENLABS_API_KEY\|^Creator_key' <file>`: count only, never print).
Install what's missing after asking. If there's no key, the user saves it themselves: `echo 'ELEVENLABS_API_KEY=...' > ~/.surplus-video-keys`.
Then `touch SKILL/.checked`.

## 1. Topic, story, call to action
1. **Topic and CTA** (one AskUserQuestion call; skip what the user already said). First read `references/surplus.md`
   and `references/stories-done.md` (every story already made, and what counts as too similar), plus the `brief.json`
   and `script.md` of any `~/surplus-videos/*` not on that list yet (videos still in progress). Never suggest a topic
   that is on the list or too similar to one. If the user types a topic that is, say which done story it's close to
   and ask whether to go ahead.
   - *Topic:* your 3 best topics for people who struggle to gain weight. Each option: a short name, and in its
     description the surprising fact it hooks on and its kind (A: teaches something, plugs Surplus at the end; B:
     problem → Surplus fixes it). The user can type their own.
   - *Call to action:* *Link in bio* / *Search Surplus on the App Store* / *Comment a keyword* (then ask the keyword:
     one word in caps).

   Make P (slug from the topic): `mkdir -p P/{src,qa,out,voice,kit} && cp SKILL/kit/* P/kit/`, and write
   `P/brief.json`: `{ "topic", "mode": "A|B", "cta": "bio|appstore|keyword", "keyword", "story": null, "style": "spotlight-stage" }`.
2. **Story A and Story B, in a doc.** Look up the topic's facts first (web search), so both stories rest on real,
   sourced numbers. Then write two different stories, each as 4–6 bullets in the shape of `references/script.md`
   ("The two stories"). Check both against `references/stories-done.md` and against each other with its rules, and
   replace any that's too similar. Put them in a doc: load the docs skill (`anthropic-skills:docs`, or whatever docs tool this
   session has) and make a doc titled "<topic>: pick a story" with two headings, **Story A** and **Story B**, and the
   sources under them. With no docs tool, write `P/stories.md` the same way and open it. Give the user the link, then
   ask (AskUserQuestion): *Story A* / *Story B* (they can type changes). Make the changes and ask again until they
   pick one. Save `"story"` in brief.json.
3. **A script the user pastes** (at any point here) replaces 1–2: use it word for word, take the CTA from its ending
   (ask only if it isn't clear), and go on.

## 2. The style: always #6 Spotlight Stage (no question)
A toy theatre at night: card cut-outs in layers, lit by beams through haze. Its files are in
`SKILL/styles/spotlight-stage/` (card.md, reference.js, notes.md). If `stage.js` or `sound.js` exists there, copy it
over `P/kit/`.

## 3. The voice (only when `SKILL/config.json` has no `voiceId`)
`node SKILL/tools/voice.mjs --list`, offer the 3–4 best narrators (warm, clear, conversational, a coach not an
announcer) plus *Other*, and save `voiceId` and `voiceName` in config.json. A per-video voice can go in brief.json.

**From here to the preview: no questions.** Once the story is picked, work through steps 4–9 and only come back
with the reviewed preview.
Say in one line what you're starting at each step.

## 4. The script → `P/script.md`
Write it from the picked story, following `references/script.md`: the specs' word count (aim for 190–215 words, about
52–58 s), the surprising action stated as fact in the first 4 s, "You see," after the hook or about two-thirds in, a
new place to go every ~25 words, and the payoff (the character's result with Surplus, then the CTA) in the last
10–15 %, nothing after it. Every number and health claim checked (web search) and listed under Sources; Surplus claims
only from `references/surplus.md`. Run the checklist at the end of script.md, then add the numbered script to the
stories doc under a heading **Script (Story A/B)**, so the user can read it while you build. No question: go on.
A script the user pasted: lay their words out in the same file format (only line breaks, `[S#]` and `[pause]` marks
added, never a word changed). If a claim in it is wrong or unsupported, quote the line, say what's off with the source,
and wait for their corrected line (the one question allowed before the preview). Script-side specs it misses: list
them in one line each at step 9; never change their words to meet them.

## 5. Voice and word timing
`node SKILL/tools/voice.mjs P` → `P/voice/voice.mp3`, `P/timing.json` (every word's start and end, scenes, pauses), `P/vo.js`.
- It prints words Whisper heard differently. Number formats and homophones are fine. A skipped or wrong word means
  a new take (`node SKILL/tools/voice.mjs P` again). At most 2 re-takes, then rephrase that line in script.md, same
  meaning (in a script the user pasted: tell them which word the voice keeps getting wrong instead).
- voice.mjs paces the take to 3.75 words a second (ElevenLabs at its top speed, then a tempo change; `--rate` to
  adjust). It prints the final rate: it must be 3.35–3.91; if not, `voice.mjs P --retime --rate <nudged target>` (no new
  take, no cost).
- The voice must run 45–60 s. If it doesn't, add or cut a beat in script.md and take it again (a script the user
  pasted: say so in one line at step 9, never cut or add their words).
- Pause changes only (no new words): `node SKILL/tools/voice.mjs P --retime` (no new take, no cost).

## 6. Plan → `P/plan.md`
Plan to `references/specs.md`. For each scene: its time range (from timing.json), the **places** (areas of the stage,
about 7–9 for the video), what the picture shows and which objects, every **shot** (time, the phrase, the place, how it
changes: an in-view change or a camera flight, 0.25–0.5 s) and every **move** inside it (time, pan or zoom, the size it
lands on), so the counts and shares in specs.md come out right (add them up in the plan: shots, average shot length,
place visits, framing changes, the first 4 s, share of each size). Then each big character action (time, the word,
the pose swap), every label and where on screen it sits (outside the subtitle band and Instagram's covered areas), and
the key sounds. Then go through `references/lessons.md` and note how this plan avoids each lesson that applies.

## 7. Build → `P/src/style.js`
Read `references/build.md`, the style's `card.md`, its whole `reference.js`, and its `notes.md`. Build the scene code as the reference does, with every time from
`CUE`, the `shots`, `moves` and `payoff` the specs ask for, and the Surplus ending. Where the reference and specs.md
disagree (camera, lamps, pace, captions), specs.md wins. `node SKILL/tools/build.mjs P` must pass. Then open the preview in the
browser pane and scrub through the cues and shots yourself; fix what you see.

**Preview server:** in the session's working folder, `.claude/launch.json` gets (or updates) a configuration
`{ "name": "surplus-preview", "runtimeExecutable": "python3", "runtimeArgs": ["<SKILL>/tools/serve.py", "<P>", "8765"], "port": 8765 }`.
Start it with `preview_start` (stop an older one on the same port first), then open `http://localhost:8765/preview.html`.
`?t=12.4` opens at a time.

## 8. Review loop (up to 3 rounds, before the user sees anything)
1. `node SKILL/tools/qa.mjs P` → `P/qa/checks.md` (every spec it can measure) + `P/qa/sheet-*.jpg` (a frame every 0.5 s,
   time-stamped). About 2 min. Fix every FAIL before spawning the reviewer: it's cheaper than a round.
2. Spawn a **fresh reviewer**: Agent tool, `general-purpose`, description "Review video frames", prompt = the whole of
   `SKILL/agents/reviewer.md` with `{P}` and `{SKILL}` filled in, plus the round number and the style slug. Wait for its report.
3. Fix every blocker and should-fix. Fix the cause (in the general way) in `src/style.js`, rebuild, and look at the
   fixed moments yourself: `node SKILL/tools/qa.mjs P --times <t1>,<t2>` (skip `--full`: it loses the GPU, see lessons.md).
4. Next round until a round finds no blockers and no should-fix and its spec table is all met, or after round 3
   (remaining items, and any spec still missed, go in the hand-off).
5. Add the reviewer's "New general lessons" (and your own) to `references/lessons.md`: the general rule, merged, no duplicates.

## 9. Show the user
Open `http://localhost:8765/preview.html` in the browser pane (if the pane is hidden, ask them to press Cmd+Shift+B).
Tell them, briefly:
- what it is (topic, mode, style, length) and the script (the numbered lines);
- what the reviewer caught and you fixed, and anything still open; the specs: all met, or which one isn't and why;
- for a script the user pasted: any script-side spec it misses (step 4), one line each;
- how to give notes: **"Play it and tell me what to change with the time from the clock, top-right, e.g. '0:12.4 the
  label covers the jar'. ←/→ steps one frame (shift: 1 s). *Safe* shades the parts Instagram covers."**
Then ask: *Any changes, or render it?* (buttons: *Render it* / *I have changes*).

## 10. Changes
Log each note in `P/notes.md` (time · note · what you changed). Picture changes: fix, rebuild, close-up QA at those
times, and look yourself. Big changes (a new shot, a scene): a reviewer round on that range. Script changes: rewrite
the lines the note asks for (the user's own words exactly when they give them), still to the specs, update the doc →
`voice.mjs P` (new take; every cue follows) →
rebuild → full QA and a reviewer round. A note that conflicts with a spec: do what the user says, and tell them which
spec it breaks. Show it again (step 9). Repeat until the user says render.

## 11. Render (only on the user's explicit go)
`node SKILL/tools/render.mjs P --samples <n>` in the background; say the expected finish time. Use `--samples 8` (about 40 min
for 55 s; more lost the GPU on this Mac, see the style's notes.md). It writes `P/out/<name>.mp4` at −15 LUFS plus `P/out/check-1..5.jpg`. Look at the check frames: if they
are black, or all the same small file, the GPU dropped out. Then send the MP4 to the user (SendUserFile) and `open` it.

## 12. Close the loop
- Turn the user's notes into general lessons in `references/lessons.md` (what kind of mistake, the rule that prevents it).
- Style-specific lessons go in `SKILL/styles/spotlight-stage/notes.md`.
- `echo "<P folder name>" >> SKILL/styles/spotlight-stage/videos.txt` (a record of the videos made).
- Add the story to the top of the list in `references/stories-done.md`, in its entry format (core fact, hook, lesson,
  character, payoff), so later topics and stories steer clear of it. (The skill folder is a git repo: commit and push
  only when the user asks.)
