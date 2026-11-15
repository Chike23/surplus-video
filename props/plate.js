// @prop {"what": "a white dinner plate with a blue rim seen from the side and a little above; full: rice, a roast chicken leg and broccoli", "states": [{}, {"food": 1}]}
function plateArt(s = {}) {   // foot at y 0, about 0.36 wide; s.food: 0 an empty plate, 1 a full meal
  const it = [
    { pts: ell(0, 0.045, 0.18, 0.045, 32), fill: '#f4f2ec', ink: 0.006 },                      // the plate, seen a little from above
    { pts: ell(0, 0.045, 0.172, 0.039, 32), holes: [ell(0, 0.046, 0.15, 0.032, 32)], fill: '#5b7fa6', cut: false, ink: 0.003 },   // the painted rim band
    { pts: ell(0, 0.05, 0.11, 0.022, 26), fill: '#e2ded3', cut: false, ink: 0.004 },          // the well
  ];
  if (!s.food) return it;
  it.push(
    { pts: strip([[-0.1, 0.05], [-0.1, 0.1]], 0.026), fill: '#6f9a3a', ink: 0.005 },          // broccoli, behind the rice
    { pts: ell(-0.13, 0.12, 0.04, 0.037, 14), fill: '#3f8a3a' },
    { pts: ell(-0.075, 0.125, 0.042, 0.04, 14), fill: '#4a9a40' },
    { pts: ell(-0.1, 0.155, 0.038, 0.035, 14), fill: '#357a32' },
    { pts: ell(-0.035, 0.05, 0.1, 0.085, 22, 0, Math.PI), fill: '#efe3b0', ink: 0.007 },      // a dome of rice in the well
    { pts: ell(-0.06, 0.1, 0.035, 0.014, 8), fill: '#fbf4dc', cut: false, ink: 0 },
    { pts: round([[0.0, 0.045], [0.11, 0.045], [0.14, 0.075], [0.11, 0.11], [0.04, 0.115], [0.0, 0.09]], 2), fill: '#b0612a' },   // the chicken leg, over the rice
    { pts: ell(0.07, 0.09, 0.035, 0.014, 10), fill: '#cf8443', cut: false, ink: 0 },
    { pts: strip([[0.125, 0.085], [0.158, 0.1]], 0.024), fill: '#f2ead6' },                  // a short bone, inside the plate's width
    { pts: ell(0.163, 0.102, 0.016, 0.016, 10), fill: '#f2ead6' },
  );
  return it;
}
