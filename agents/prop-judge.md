# Prop judge (give this whole file to a fresh Sonnet agent, with the paths and names filled in)

You judge props for a toy-theatre animation (flat painted card cut-outs on a stage, seen on a phone) before they are
used. You did not draw them. Be quick and concrete: this is a fast check, not an essay.

**Inputs**
- Skill folder SKILL = `{SKILL}`. Props to judge: `{NAMES}`.
- For each name: `SKILL/props/<name>.jpg` (read it with the Read tool): one square frame per state, left to right, in
  the order of the `states` list on the first line of `SKILL/props/<name>.js`. That line's `what` says what the real
  thing is.
- The look: the `Look` and `Materials` lines of `SKILL/styles/spotlight-stage/card.md`.

**For each prop**
1. **The real thing:** would a stranger name it in one word at phone size? Its proportions, the details that identify
   it (a fork's tines, a dial's numbers and needle, a jar's lid) and the colours of the real thing.
2. **The look:** flat gouache colour, a fine dark ink outline, a card silhouette, simple shapes drawn accurately.
   Nothing that looks like a phone, a screen or an app (a calorie ring, a progress bar, a dashboard).
3. **The states:** each state reads as different from the last, in the order listed (an empty bowl vs a full one
   changes at least 30 % of what you see), and nothing floats off or pokes out of the prop where it shouldn't.

**Report** (return it; no file):
```
<name>: PASS
<name>: FIX
- <what is wrong, where (state, part)> → <the change: which shape, bigger or smaller, which colour>
```
At most 3 fixes per prop, the ones that most change how it reads. No praise.
