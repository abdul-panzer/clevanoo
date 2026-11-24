// All tunable values for the hero journey live here.
export const COLORS = {
  background: 0xdfe9f8,   // light blue hero background (also the fog colour)
  ground: 0xd6e2f6,       // tinted ground inside the scene
  groundLine: 0xc6d4ef,   // faint ground grid, shows the camera's travel
  plaza: 0xcad8f2,        // soft pad under each station
  white: 0xffffff,        // matte architectural forms
  glass: 0xfafcff,        // frosted candidate cards
  cobalt: 0x264597,       // logo gradient, top
  cobaltLift: 0x2d52aa,   // lit accent
  navy: 0x1a2955,         // logo gradient, bottom
  paleBlue: 0xc9d5ee,
  mist: 0xe6ebf5,
};

// Normalised scroll ranges (0..1 across the pinned hero).
export const RANGES = {
  hold: [0, 0.12],
  sourcing: [0.12, 0.28],
  screening: [0.28, 0.48],
  matching: [0.48, 0.7],
  placement: [0.7, 0.9],
  release: [0.9, 1],
};

export const STAGES = [
  { key: 'sourcing', no: '01', title: 'Talent sourcing', text: 'Connect with professionals whose skills and ambitions align with your business.' },
  { key: 'screening', no: '02', title: 'Screening & verification', text: 'Evaluate experience, technical expertise, and role readiness with care.' },
  { key: 'matching', no: '03', title: 'Precision matching', text: 'Bring the right candidate and the right opportunity together.' },
  { key: 'placement', no: '04', title: 'Placement & onboarding', text: 'Support a smooth start and a successful long-term partnership.' },
];

// Station positions on the ground plane [x, z].
export const STATIONS = {
  sourcing: [-10, 4],
  screening: [-2, -3],
  matching: [6, 3],
  placement: [13, -5],
};

// The route passes through these ground points [x, z] (a smooth curve is fitted through them).
export const ROUTE = [
  [-18, 10], [-10, 4], [-6, -1], [-2, -3], [2, 0], [6, 3], [10, 0], [13, -4.2],
];

// Camera waypoints: p = scroll progress, pos = camera position, look = look-at target.
// A smooth curve is fitted through both, so the camera travels rather than cuts.
export const CAMERA = [
  { p: 0.0, pos: [0, 20, 37], look: [0, 0, -1] },
  { p: 0.12, pos: [-0.8, 19.5, 36], look: [0, 0, -1] },
  { p: 0.24, pos: [-16.5, 7.6, 15.5], look: [-10.4, 0.7, 3.2] },
  { p: 0.44, pos: [-7.5, 8.2, 9.5], look: [-2.2, 0.9, -3] },
  { p: 0.64, pos: [4.4, 14.5, 11], look: [4.6, 0, 4.6] },
  { p: 0.86, pos: [10.8, 12, 8], look: [12.4, 0.9, -4.6] },
  { p: 1.0, pos: [11, 13.2, 8.8], look: [12.4, 0.9, -4.6] },
];

export const SCROLL = {
  desktopHeightVh: 480,   // total scroll travel of the pinned hero
  mobileHeightVh: 340,    // shorter journey on phones
  scrub: 0.6,             // GSAP smoothing, seconds
  fov: 36,
  introOffset: 0.27,       // pushes the world into the lower part of the screen under the headline
};
