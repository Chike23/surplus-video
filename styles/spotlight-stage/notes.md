# Spotlight Stage: notes from earlier videos

- **9:16 staging:** build the stage taller than it is wide and set every full-figure shot so the boards meet the
  back wall at ≤ 62 % of the frame, keeping the actors and props clear of the bottom 24 % that Instagram covers
  (there are no captions any more). Flown pieces (clouds, props, signs) hang low enough to fit between the floor line and the top 11.5 %.
  (eat-less-than-you-think)
- **One shadow per actor:** with two crossed washes, a follow spot and a top light all casting shadows, the actor
  throws 2–3 hard silhouettes on the back wall, and they read as extra people. Let the washes cast no shadow
  (`shadow: false`). Hang the follow spot high and fairly frontal (about [-3, 8.5, 12]) so the actor's shadow falls
  behind and below them, not beside their face. (eat-less-than-you-think)
- **Pale paper flats burn out:** a narrow spot plus the top light on a cream or pink flat (the thought cloud) clips to
  white and the paper grain disappears. Run the spot about 0.45 and the top light about 0.3 while they're on a pale
  flat. (eat-less-than-you-think)
- **No phone, ever** (owner's rule, 2026-11-13): the Surplus plug is the character acting out the change while the
  narration names Surplus; only the name and the CTA are lettered, on the easel card or the marquee.
- **Marquee:** the call to action must be at least 0.34 units tall on a 3-unit sign, or it falls under 45 px in the
  wide finale. Bulbs bloom, so keep the top bulb row a little below the 11.5 % line. (eat-less-than-you-think)
- **Render samples:** this style's beams and depth pre-pass are heavy. At 40 samples per full-size frame the M1 lost
  the GPU context after 2–5 frames, and the video came out black. Render with `--samples 8`, about 1.5 s a frame
  (about 40 min for 55 s). (eat-less-than-you-think)
- **Re-setting a slotted prop:** to bring a prop back from the other wing, teleport it while it is offstage. Give
  its slot a rod on each side and show only the rod on its current side. (eat-less-than-you-think: penny scale)
- **Lamps to specs §4 (starting values; then read the measured brightness, colour and black share in qa/checks.md):**
  front washes about 1.2× the reference's power (620 → ~745); `render.background` a deep indigo (about `#0c0a24`, not
  `#010102`); a weak indigo `HemisphereLight` (about `#2a2466` over `#0a0818`, 0.15–0.3) so unlit card reads as dark
  indigo; `render.saturation` about 1.2–1.3. Give the wings, the flies and every extra place their own wash or special.
  The wash colour changes on the cut's frame, not over a second.
  Under the filmic tone curve, PointLights near the drops (horizon, cyc) set the mean brightness; turning spot power
  up barely moves it (the curve's shoulder). Tune those first, and fill black gaps (the proscenium above the valance,
  the far apron) with footlights, apron lights or a little emissive on the cut-out. (bakers-thirteenth-loaf)
- **Motion blur:** at 8 samples a fast move breaks into separate copies with `shutter` 0.4; 0.3 keeps them closer.
  Look at a mid-move check frame (a push or a flight) before sending. (bakers-thirteenth-loaf)
- **The camera to specs:** drive it from the style's `shots` and `moves` lists: each entry is a framing (position and
  aim); ease to it in 0.3–0.5 s, then drift 2–4 % of the frame per second the same way until the next entry. Keep the
  aim's yaw and pitch within 25° of straight down −z.
