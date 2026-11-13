# Ink and Toon: notes from videos

- `label()` from example-stomach.js places lettering for the camera 0.4 s after it pops. When a word falls in the
  first drawings of a shot, the lettering rides the whip in from the frame edge: delay the pop to the shot start +
  4 drawings (a `landed(t)` helper) and move its stamp sound with it. (how-fast-to-gain)
- The inverted-hull outline turns any mesh squashed flat (a dome at near-zero height) into a solid ink blot: keep
  a minimum height and hide the coplanar disc under it. (how-fast-to-gain)
- Text drawn on a canvas prop (a phone screen) at 540 px wide needs Caveat ≥ 72 px and Anton ≥ 66 px to read at about
  45 px cap height when the phone fills ~45 % of the frame height; shorten labels rather than shrink them.
  (how-fast-to-gain)
