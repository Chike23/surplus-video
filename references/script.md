# Writing the script

You write the script, from the topic and the story the user picked. It is told as a story with a character (the
Spotlight Stage plays like a show), it meets the script-side specs in `references/specs.md`, and every fact in it is
sourced. A script the user pastes instead is used word for word: only lay it out (the file format below) and check it.

## The numbers (references/specs.md)
- The voice runs at 3.75 words a second, so **45–60 s is about 165–245 words**. Aim for 190–215 (about 52–58 s).
- **The hook:** a surprising action, stated as fact, said inside the first 4 s (the first ~15 words). The character
  does it on screen from the first frame. Not a question, not a title.
- **"You see,"** starts the line right after the hook and explains it, or it brings the reveal about two-thirds in.
- **A new place every ~25 words** (the place changes every 6–7 s): write each beat so the story moves somewhere new
  on the stage (the kitchen, the wings, up on the flies, the gym, the scales).
- **The payoff lands in the last 10–15 %** (from about word 85 % on) and the script ends on it. It is the character's
  result with Surplus, and its last line is the CTA. No outro, no sign-off after it.

## The two stories (step 1, the doc)
Write two different takes on the topic: a different character, angle or shape (e.g. one flips a myth with a number,
one follows a character's change). Each story is 4–6 bullets:
```
## Story A: <short title>
- **Hook (0–4 s):** <the character and the surprising thing they do, stated as fact>
- **"You see,":** <what it explains right after the hook, or the reveal it brings two-thirds in>
- **Beats:** <2–3 beats, each in a new place, each with one concrete number>
- **Reveal:** <the number or mechanism that flips it>
- **Payoff (last 10–15 %):** <how the character brings Surplus in, and the result they get>. CTA: <the picked one>
Kind A or B · about N words · Sources: <the facts it rests on>
```

## The two kinds
**A. Value video, Surplus at the end (most videos).** The viewer learns something useful even if they never download.
| Part | When (55 s) | Job |
|---|---|---|
| Hook | 0–4 s | The character's surprising action, stated as fact. |
| "You see," | 4–12 s | Why it happens, in plain words. Open a loop ("but that's not the strange part"). |
| Beats | 12–40 s | 2–3 beats, one idea, one place and one number each; each pulls into the next. |
| Reveal | about 35–40 s | The counter-intuitive bit (if "You see," wasn't used up top, it brings this). |
| Payoff | last 10–15 % | The character does the fix with Surplus and gets the result. The CTA ends it. |

**B. Problem → Surplus fixes it.**
| Part | When (55 s) | Job |
|---|---|---|
| Hook | 0–4 s | The character's problem as a surprising fact: "Sam eats four meals a day. He's still 58 kilos." |
| "You see," | 4–14 s | The real cause, with one number ("It's not his metabolism. It's ..."). |
| Proof | 14–32 s | Why that cause keeps them stuck, one place and one picture per idea. |
| The fix | 32–46 s | 2–3 steps that fix it. |
| Payoff | last 10–15 % | Surplus is how the character does those steps (2 real features from surplus.md); the result; the CTA. |

## Surplus, through the character
Never write a line that needs the app on screen ("tap here", "look at this screen", "open the app and..."): the picture
never shows a phone or the app. The narration says what Surplus does **for the character**, and the picture shows the
character doing it: eating the extra meal, the scale's needle finally moving, a proud pose. For example: "So Sam
stopped guessing. Surplus counted every bite and set him five hundred calories over. Six weeks later, the needle
moved. Search Surplus on the App Store." Features only from `references/surplus.md`.

## Hooks that work (adapt; never copy anyone's line)
- **Stat shock, acted:** "Most skinny guys eat 600 calories less than they think. Sam is one of them."
- **Myth flipped:** "Sam blames his fast metabolism. His metabolism is perfectly normal."
- **Insider:** "Competitive eaters train their stomachs like a muscle. Sam is about to try it."
- **Consequence:** "Sam eats three huge meals a day. That's exactly why he can't gain."

## Writing for the ear
- Short sentences (≤ 14 words), one idea each, everyday words. The character by name, the viewer as "you".
- Concrete beats vague: "a handful of almonds is 160 calories" beats "nuts are calorie-dense".
- Numbers as they should be said: "five hundred calories", "half a kilo".
- Open loops and pay them all off before the payoff. Twists only when there's a real one.
- Tone from `references/surplus.md`: a coach who has been skinny too; no hype words, no body-shaming.

## Pauses
Mark a pause after a word with `[pause 0.4]` (seconds). `voice.mjs` cuts real silence into the take there, and every
later word moves with it. At this pace, use few: after the hook (0.3), before the reveal (0.4), before the payoff
(0.3). At most 3, all together ≤ 1.5 s.

## The file: P/script.md
```
# <title>
Mode: A (value + plug) | B (problem → Surplus)   CTA: link-in-bio | app-store | comment KEYWORD   Story: A | B

## Narration
1. [S1] Sam eats four meals a day. He's still fifty-eight kilos. [pause 0.3]
2. [S1] You see, ...
3. [S2] ...
...
## Sources
- <every fact or number above, with where it comes from>
```
- One numbered line = one sentence or phrase. `[S1]`–`[S4]` at the start of a line opens that story part (3–4 parts).
  Lines without a tag stay in the current part.

## Check before voicing
- 165–245 words (190–215 aimed); the hook's surprising action stated as fact within the first ~15 words;
  "You see," right after the hook or about two-thirds in; a new place every ~25 words; 3–4 story parts.
- The payoff starts after about 85 % of the words, ends the script, and its last line is the picked CTA.
- Surplus told through the character; no line that needs a phone or the app on screen; claims only from surplus.md.
- Every number and health claim has a source (web search) and stays inside the health guard rails in surplus.md.
- For a script the user pasted: their words exactly (only line breaks, `[S#]` and `[pause]` added); a claim that fails
  goes back to them; script-side specs it misses are listed at step 9. Never fix their words yourself.
