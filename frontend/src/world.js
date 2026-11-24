// The miniature recruiting world: one persistent Three.js scene, one camera journey.
// Everything is procedural geometry (no model files). createWorld() returns
// { resize, render(progress), dispose }.
import * as THREE from 'three';
import { COLORS, RANGES, STATIONS, ROUTE, CAMERA, SCROLL } from './config.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const span = (range, p) => clamp((p - range[0]) / (range[1] - range[0]), 0, 1);

function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}
// Smooth curve through a list of points (arrays of numbers), u in 0..points.length-1
function through(points, u) {
  const n = points.length - 1, i = clamp(Math.floor(u), 0, n - 1), t = u - i;
  const a = points[Math.max(0, i - 1)], b = points[i], c = points[i + 1], d = points[Math.min(n, i + 2)];
  return b.map((_, k) => catmull(a[k], b[k], c[k], d[k], t));
}

/* ---------- route: sampled once, used for the ribbon, the cards and the camera checks ---------- */
function buildRoute() {
  const pts = [], per = 28;
  for (let i = 0; i <= (ROUTE.length - 1) * per; i++) pts.push(through(ROUTE, i / per));
  const len = [0];
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = len[len.length - 1];
  const at = (t) => {                       // t = 0..1 along the route by distance
    const target = clamp(t, 0, 1) * total;
    let i = 1; while (i < len.length - 1 && len[i] < target) i++;
    const k = (target - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1]);
    const x = lerp(pts[i - 1][0], pts[i][0], k), z = lerp(pts[i - 1][1], pts[i][1], k);
    const dx = pts[i][0] - pts[i - 1][0], dz = pts[i][1] - pts[i - 1][1], l = Math.hypot(dx, dz) || 1;
    return { x, z, dx: dx / l, dz: dz / l };
  };
  const nearest = ([sx, sz]) => {           // route fraction closest to a ground point
    let best = 0, bd = Infinity;
    pts.forEach((q, i) => { const d = Math.hypot(q[0] - sx, q[1] - sz); if (d < bd) { bd = d; best = i; } });
    return len[best] / total;
  };
  return { pts, len, total, at, nearest };
}

function ribbonGeometry(route, width, y, colorTop, colorEnd) {
  const pos = [], idx = [], col = [];
  const a = new THREE.Color(colorTop), b = new THREE.Color(colorEnd), c = new THREE.Color();
  route.pts.forEach((q, i) => {
    const prev = route.pts[Math.max(0, i - 1)], next = route.pts[Math.min(route.pts.length - 1, i + 1)];
    let dx = next[0] - prev[0], dz = next[1] - prev[1]; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
    pos.push(q[0] - dz * width / 2, y, q[1] + dx * width / 2, q[0] + dz * width / 2, y, q[1] - dx * width / 2);
    c.copy(a).lerp(b, route.len[i] / route.total); col.push(c.r, c.g, c.b, c.r, c.g, c.b);
    if (i > 0) { const k = i * 2; idx.push(k - 2, k, k - 1, k - 1, k, k + 1); }
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

export function createWorld(canvas, { lowPower = false, staticView = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  if ('outputEncoding' in renderer && THREE.sRGBEncoding !== undefined) renderer.outputEncoding = THREE.sRGBEncoding;
  const shadows = !lowPower;
  renderer.shadowMap.enabled = shadows;
  if (THREE.PCFSoftShadowMap !== undefined) renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(COLORS.background, 30, 56);
  const camera = new THREE.PerspectiveCamera(SCROLL.fov, 1, 0.1, 200);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xe3e8f3, 0.92));
  const sun = new THREE.DirectionalLight(0xffffff, 0.62);
  sun.position.set(-12, 24, 14);
  if (shadows) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera; sc.left = -34; sc.right = 34; sc.top = 30; sc.bottom = -30; sc.near = 1; sc.far = 80;
    sun.shadow.bias = -0.0005; sun.shadow.radius = 5;
  }
  scene.add(sun);

  /* ---------- shared geometry and materials (reused everywhere) ---------- */
  const G = {
    box: new THREE.BoxGeometry(1, 1, 1),
    sphere: new THREE.SphereGeometry(1, lowPower ? 12 : 20, lowPower ? 8 : 14),
    cyl: new THREE.CylinderGeometry(1, 1, 1, lowPower ? 12 : 24),
    body: new THREE.CylinderGeometry(0.62, 1, 1, lowPower ? 10 : 18),
    torus: new THREE.TorusGeometry(1, 0.085, 10, lowPower ? 24 : 48),
  };
  // Box whose faces run from the logo gradient's navy (bottom) to its blue (top)
  G.gbox = (() => {
    const g = new THREE.BoxGeometry(1, 1, 1), p = g.attributes.position, col = [];
    const top = new THREE.Color(COLORS.cobaltLift), bot = new THREE.Color(COLORS.navy), c = new THREE.Color();
    for (let i = 0; i < p.count; i++) { c.copy(bot).lerp(top, p.getY(i) + 0.5); col.push(c.r, c.g, c.b); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    return g;
  })();
  const std = (color, extra) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.9, metalness: 0 }, extra));
  const M = {
    white: std(COLORS.white),
    mist: std(COLORS.mist),
    pale: std(COLORS.paleBlue, { roughness: 0.7 }),
    cobalt: std(COLORS.cobalt, { roughness: 0.45, metalness: 0.08 }),
    navy: std(COLORS.navy, { roughness: 0.5 }),
    glass: std(COLORS.glass, { roughness: 0.3, metalness: 0.05, transparent: true, opacity: 0.8 }),
    ground: std(COLORS.ground, { roughness: 1 }),
    grad: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.08 }),
    gradGlass: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.3, metalness: 0.1, transparent: true, opacity: 0.94 }),
  };
  const owned = [];                                   // per-object materials, disposed with the world
  const own = (m) => { owned.push(m); return m; };
  const fade = (color, extra) => own(std(color, Object.assign({ transparent: true, opacity: 0 }, extra)));

  function mesh(geo, mat, parent, sx = 1, sy = 1, sz = 1, x = 0, y = 0, z = 0, shadow = true) {
    const m = new THREE.Mesh(geo, mat);
    m.scale.set(sx, sy, sz); m.position.set(x, y, z);
    m.castShadow = shadow && shadows; m.receiveShadow = shadows;
    parent.add(m); return m;
  }
  const group = (parent, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };

  /* ---------- reusable components ---------- */
  // Check mark built from two bars; returns its group and material so it can fade in.
  function Check(parent, size, mat) {
    const g = group(parent);
    const a = mesh(G.box, mat, g, size * 0.5, size * 0.16, size * 0.1, -size * 0.2, -size * 0.1, 0, false); a.rotation.z = -0.8;
    const b = mesh(G.box, mat, g, size * 0.9, size * 0.16, size * 0.1, size * 0.18, 0.02 * size, 0, false); b.rotation.z = 0.85;
    return g;
  }
  // Frosted glass candidate profile card with a simple bust, two text lines, a blue outline and a check badge.
  function CandidateCard(parent) {
    const g = group(parent);
    const outlineMat = fade(COLORS.white, { roughness: 0.5 });
    const badgeMat = fade(COLORS.white, { roughness: 0.5 });
    const tickMat = fade(COLORS.navy);
    mesh(G.box, outlineMat, g, 1.2, 1.6, 0.05, 0, 0, -0.03, false);
    mesh(G.gbox, M.gradGlass, g, 1.1, 1.5, 0.08);
    mesh(G.sphere, M.white, g, 0.2, 0.2, 0.09, 0, 0.34, 0.06, false);
    mesh(G.sphere, M.white, g, 0.33, 0.2, 0.08, 0, 0.02, 0.06, false);
    mesh(G.box, M.white, g, 0.66, 0.07, 0.03, 0, -0.34, 0.05, false);
    mesh(G.box, M.pale, g, 0.44, 0.07, 0.03, -0.11, -0.5, 0.05, false);
    const badge = group(g, 0.44, 0.62, 0.08);
    const disc = mesh(G.cyl, badgeMat, badge, 0.2, 0.06, 0.2, 0, 0, 0, false); disc.rotation.x = Math.PI / 2;
    Check(badge, 0.22, tickMat).position.z = 0.04;
    return { g, verify(k) { outlineMat.opacity = k; badgeMat.opacity = k; tickMat.opacity = k; badge.scale.setScalar(0.6 + 0.4 * k); badge.visible = k > 0.01; } };
  }
  // Simple professional figure.
  function Person(parent, x, z, mat, s = 1) {
    const g = group(parent, x, 0, z);
    mesh(G.body, mat, g, 0.26 * s, 0.66 * s, 0.26 * s, 0, 0.33 * s, 0);
    mesh(G.sphere, mat, g, 0.16 * s, 0.16 * s, 0.16 * s, 0, 0.84 * s, 0);
    return g;
  }
  // Role / vacancy tile.
  function RoleTile(parent, x, z) {
    const g = group(parent, x, 0, z);
    mesh(G.gbox, M.grad, g, 1.06, 0.14, 1.06, 0, 0.07, 0);
    mesh(G.box, M.pale, g, 0.5, 0.02, 0.09, -0.16, 0.15, -0.2, false);
    mesh(G.box, M.pale, g, 0.3, 0.02, 0.09, -0.26, 0.15, 0.0, false);
    return g;
  }
  // Pale office block with a simple roof detail.
  function OfficeBlock(parent, x, z, w, h, d) {
    mesh(G.gbox, M.grad, parent, w, h, d, x, h / 2, z);
    mesh(G.box, M.cobalt, parent, w * 0.5, 0.3, d * 0.5, x - w * 0.12, h + 0.15, z + d * 0.1);
  }
  function Tree(parent, x, z, s) {
    mesh(G.cyl, M.white, parent, 0.07 * s, 0.5 * s, 0.07 * s, x, 0.25 * s, z);
    mesh(G.sphere, M.mist, parent, 0.36 * s, 0.42 * s, 0.36 * s, x, 0.8 * s, z);
  }
  function Marker(parent, x, z) {                    // small station marker on the route
    mesh(G.cyl, M.white, parent, 0.5, 0.05, 0.5, x, 0.04, z, false);
    mesh(G.cyl, M.cobalt, parent, 0.26, 0.06, 0.26, x, 0.06, z, false);
  }

  /* ---------- ground and route ---------- */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), M.ground);
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = shadows; scene.add(ground);
  // faint grid and station pads give the ground a little colour and make the camera's travel readable
  const plazaMat = own(std(COLORS.plaza, { roughness: 1 }));
  // One mesh of thin ground lines whose colour fades into the ground with distance: no visible edge.
  const gridGeo = (() => {
    const R = 30, CZ = -2, STEP = 4, SEG = 2, HW = 0.03, pos = [], col = [], idx = [];
    const line = new THREE.Color(COLORS.groundLine), base = new THREE.Color(COLORS.ground), c = new THREE.Color();
    const tint = (x, z) => { const k = smooth(0.35, 1, Math.hypot(x, z - CZ) / R); c.copy(line).lerp(base, k); return [c.r, c.g, c.b]; };
    const quad = (x0, z0, x1, z1) => {              // flat on the ground, facing up
      const n = pos.length / 3, v = [[x0, z1], [x1, z1], [x1, z0], [x0, z0]];
      v.forEach(([x, z]) => { pos.push(x, 0.006, z); col.push(...tint(x, z)); });
      idx.push(n, n + 1, n + 2, n, n + 2, n + 3);
    };
    for (let g = -R; g <= R; g += STEP) for (let s = -R; s < R; s += SEG) {
      if (Math.hypot(g, s + SEG / 2) > R + 1) continue;
      quad(g - HW, s + CZ, g + HW, s + SEG + CZ);     // runs along z
      quad(s, g - HW + CZ, s + SEG, g + HW + CZ);     // runs along x
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.setIndex(idx); geo.computeVertexNormals();
    return geo;
  })();
  const gridMat = own(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 }));
  const grid = new THREE.Mesh(gridGeo, gridMat); grid.receiveShadow = shadows; scene.add(grid);
  Object.values(STATIONS).forEach(([x, z]) => mesh(G.cyl, plazaMat, scene, 3.6, 0.012, 3.6, x, 0.008, z, false));

  const route = buildRoute();
  const T = {
    sourcing: route.nearest(STATIONS.sourcing), screening: route.nearest(STATIONS.screening),
    matching: route.nearest(STATIONS.matching), placement: 1,
  };
  const baseGeo = ribbonGeometry(route, 0.5, 0.025, COLORS.paleBlue, COLORS.paleBlue);
  const liveGeo = ribbonGeometry(route, 0.3, 0.045, COLORS.cobaltLift, COLORS.navy);
  const ribbonMat = own(new THREE.MeshBasicMaterial({ vertexColors: true }));
  const baseRibbon = new THREE.Mesh(baseGeo, ribbonMat); scene.add(baseRibbon);
  const liveRibbon = new THREE.Mesh(liveGeo, ribbonMat); scene.add(liveRibbon);
  const liveCount = (route.pts.length - 1) * 6;
  Object.keys(STATIONS).forEach((k) => { const q = route.at(T[k]); Marker(scene, q.x, q.z); });
  const head = mesh(G.cyl, M.cobalt, scene, 0.3, 0.1, 0.3, 0, 0.08, 0, false);   // leading point of the drawn route

  /* ---------- station 1: talent sourcing ---------- */
  const s1 = group(scene, STATIONS.sourcing[0], 0, STATIONS.sourcing[1]);
  const s1Cards = [];
  for (let i = 0; i < 5; i++) {
    const c = CandidateCard(s1);
    c.base = [-2.9 + i * 1.3, 0.98, -2.1 - Math.abs(i - 2) * 0.35];
    c.g.position.set(c.base[0], c.base[1], c.base[2]); c.g.rotation.y = -0.4 + (i - 2) * 0.11;
    mesh(G.box, M.white, s1, 0.6, 0.08, 0.34, c.base[0], 0.04, c.base[2]);
    s1Cards.push(c);
  }
  Person(s1, -3.2, -0.3, M.white); Person(s1, -2.4, 0.3, M.white, 0.92); Person(s1, 2.5, -0.5, M.white);
  const lens = group(s1, 0, 1.0, -1.5); lens.rotation.y = -0.4;
  mesh(G.torus, M.cobalt, lens, 0.62, 0.62, 0.62);
  const handle = mesh(G.cyl, M.cobalt, lens, 0.06, 0.6, 0.06, 0.62, -0.62, 0); handle.rotation.z = 0.78;

  /* ---------- station 2: screening and verification ---------- */
  const g2 = route.at(T.screening);
  const gate = group(scene, g2.x, 0, g2.z); gate.rotation.y = Math.atan2(g2.dx, g2.dz);
  mesh(G.gbox, M.grad, gate, 0.5, 2.7, 0.7, -1.5, 1.35, 0); mesh(G.gbox, M.grad, gate, 0.5, 2.7, 0.7, 1.5, 1.35, 0);
  mesh(G.box, M.cobalt, gate, 3.9, 0.42, 0.8, 0, 2.9, 0);
  mesh(G.box, M.white, gate, 0.06, 2.3, 0.12, -1.23, 1.25, 0, false); mesh(G.box, M.white, gate, 0.06, 2.3, 0.12, 1.23, 1.25, 0, false);
  mesh(G.box, M.white, gate, 2.4, 0.06, 0.12, 0, 2.66, 0, false);
  const beamMat = fade(COLORS.paleBlue, { roughness: 0.4 });
  mesh(G.box, beamMat, gate, 2.4, 2.4, 0.03, 0, 1.36, 0, false);
  const gateCheckMat = fade(COLORS.cobalt);
  Check(gate, 0.5, gateCheckMat).position.set(0, 3.55, 0);
  const s2Cards = [0, 1, 2].map((i) => { const c = CandidateCard(scene); c.lag = i * 0.2; return c; });
  Person(scene, g2.x - 2.6, g2.z - 2.4, M.white); Person(scene, g2.x - 1.8, g2.z - 2.9, M.white, 0.9);

  /* ---------- station 3: precision matching ---------- */
  const s3 = group(scene, STATIONS.matching[0], 0, STATIONS.matching[1]);
  const COLS = 5, ROWS = 4, GAP = 1.32, PICK = [2, 1];
  const tileAt = (c, r) => [(c - (COLS - 1) / 2) * GAP + 0.6, 1.6 + r * GAP];
  let picked = null;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const [x, z] = tileAt(c, r), t = RoleTile(s3, x, z);
    if (c === PICK[0] && r === PICK[1]) picked = t;
  }
  const pickMat = fade(COLORS.white, { roughness: 0.6 });
  mesh(G.box, pickMat, picked, 1.08, 0.05, 1.08, 0, 0.16, 0, false);
  const pickRingMat = fade(COLORS.paleBlue);
  mesh(G.box, pickRingMat, s3, 1.5, 0.02, 1.5, picked.position.x, 0.03, picked.position.z, false);
  const matchCard = CandidateCard(s3);
  const matchFrom = [-0.2, 0.98, 0.1], matchTo = [picked.position.x, 0.95, picked.position.z];

  /* ---------- station 4: placement and onboarding ---------- */
  const s4 = group(scene, STATIONS.placement[0], 0, STATIONS.placement[1]);
  mesh(G.gbox, M.grad, s4, 5.4, 3.3, 3.2, 0.4, 1.65, -2.8);
  mesh(G.gbox, M.grad, s4, 2.8, 2.1, 2.6, 4.4, 1.05, -2.5);
  mesh(G.box, M.cobalt, s4, 2.2, 0.3, 1.6, 0.4, 3.45, -2.8);
  mesh(G.box, M.white, s4, 2.7, 0.16, 1.3, 0.4, 2.0, -0.75);
  mesh(G.box, M.white, s4, 0.14, 2.0, 0.14, -0.85, 1.0, -0.2); mesh(G.box, M.white, s4, 0.14, 2.0, 0.14, 1.65, 1.0, -0.2);
  mesh(G.box, M.white, s4, 3.2, 0.1, 1.6, 0.4, 0.05, -0.5);
  mesh(G.box, M.pale, s4, 1.7, 1.75, 0.08, 0.4, 0.95, -1.18, false);
  const doorGlow = fade(COLORS.white, { roughness: 0.3 });
  mesh(G.box, doorGlow, s4, 1.7, 1.75, 0.09, 0.4, 0.95, -1.17, false);
  const haloMat = fade(COLORS.paleBlue);
  mesh(G.cyl, haloMat, s4, 2.5, 0.02, 2.5, 0.4, 0.03, 1.5, false);
  const team = [[-0.9, 1.3], [-0.1, 1.75], [0.9, 1.75], [1.7, 1.3]].map(([x, z], i) => {
    const m = i === 1 ? M.cobalt : M.white, p = Person(s4, x, z, m, i === 1 ? 1.05 : 1);
    return { p, to: [x, z], from: [-1.6 - i * 0.5, 3.6 + i * 0.75] };
  });
  const badge = group(s4, 0.4, 4.6, -1.6);
  const badgeDisc = mesh(G.cyl, M.white, badge, 0.62, 0.1, 0.62, 0, 0, 0, false); badgeDisc.rotation.x = Math.PI / 2;
  Check(badge, 0.6, M.navy).position.z = 0.08;

  /* ---------- surrounding miniature city ---------- */
  let seed = 23; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const camPath = []; for (let i = 0; i <= 60; i++) camPath.push(cameraAt(i / 60).pos);
  const clear = (x, z, r) => route.pts.every((q) => Math.hypot(q[0] - x, q[1] - z) > r) &&
    Object.values(STATIONS).every((q) => Math.hypot(q[0] - x, q[1] - z) > r + 4) &&
    camPath.every((q, i) => i < 8 || Math.hypot(q[0] - x, q[2] - z) > 5.5);
  let placed = 0, tries = 0; const wantBlocks = lowPower ? 12 : 26;
  while (placed < wantBlocks && tries++ < 600) {
    const x = -30 + rnd() * 62, z = -15 + rnd() * 30, w = 1.6 + rnd() * 1.8, d = 1.6 + rnd() * 1.8, h = 0.9 + rnd() * 3.4;
    if (!clear(x, z, 4.2)) continue;
    OfficeBlock(scene, x, z, w, h, d); placed++;
  }
  placed = 0; tries = 0;
  while (placed < (lowPower ? 6 : 16) && tries++ < 400) {
    const x = -24 + rnd() * 50, z = -16 + rnd() * 30;
    if (!clear(x, z, 2.2)) continue;
    Tree(scene, x, z, 0.8 + rnd() * 0.5); placed++;
  }

  /* ---------- camera ---------- */
  function cameraAt(p) {
    let i = 0; while (i < CAMERA.length - 2 && p > CAMERA[i + 1].p) i++;
    const a = CAMERA[i], b = CAMERA[i + 1];
    let t = clamp((p - a.p) / (b.p - a.p), 0, 1);
    t = lerp(t, t * t * (3 - 2 * t), 0.55);            // gentle ease between waypoints, never a stop-start
    return { pos: through(CAMERA.map((w) => w.pos), i + t), look: through(CAMERA.map((w) => w.look), i + t) };
  }

  let W = 1, H = 1;
  function resize() {
    W = canvas.clientWidth || 1; H = canvas.clientHeight || 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2));
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
  }

  /* ---------- everything below is driven by one progress value ---------- */
  function render(p) {
    // camera journey
    const c = cameraAt(p), wide = W / H < 0.9 ? 1.4 : W / H < 1.3 ? 1.2 : 1;   // pull back on narrow screens
    camera.position.set(c.look[0] + (c.pos[0] - c.look[0]) * wide, c.look[1] + (c.pos[1] - c.look[1]) * wide, c.look[2] + (c.pos[2] - c.look[2]) * wide);
    camera.lookAt(c.look[0], c.look[1], c.look[2]);
    const portrait = W / H < 0.9, intro = 1 - smooth(RANGES.sourcing[0], RANGES.sourcing[1] - 0.04, p);
    // under the headline the world sits low; on phones the subject then sits above the bottom panel
    const off = staticView ? 0.04 : SCROLL.introOffset * (portrait ? 0.8 : 1) * intro - (portrait ? 0.15 * (1 - intro) : 0);
    camera.setViewOffset(W, H, 0, -off * H, W, H);

    // route reveal
    const a = span(RANGES.sourcing, p), b = span(RANGES.screening, p), m = span(RANGES.matching, p), d = span(RANGES.placement, p);
    const drawn = p < RANGES.screening[0] ? lerp(0, T.sourcing, a) : p < RANGES.matching[0] ? lerp(T.sourcing, T.screening, b)
      : p < RANGES.placement[0] ? lerp(T.screening, T.matching, m) : lerp(T.matching, 1, smooth(0, 0.8, d));
    liveGeo.setDrawRange(0, Math.min(liveCount, Math.floor(drawn * (route.pts.length - 1)) * 6));
    const hp = route.at(drawn); head.position.set(hp.x, 0.08, hp.z); head.visible = drawn > 0.002;

    // 1 — sourcing: the search ring passes over the cards, found profiles lift and gain an outline
    const sweep = smooth(0.25, 0.95, a);
    lens.position.x = lerp(-3.4, 2.9, sweep); lens.position.z = -1.45 - 0.25 * Math.sin(sweep * Math.PI);
    s1Cards.forEach((card, i) => {
      const hit = smooth(i / 5 + 0.02, i / 5 + 0.2, sweep), keep = (i === 1 || i === 3) ? 1 : 0;
      card.g.position.y = card.base[1] + 0.22 * hit * keep;
      card.verify(hit * keep);
    });

    // 2 — screening: profiles travel the route through the gateway; verified ones gain a blue outline and check
    let gateHit = 0;
    s2Cards.forEach((card) => {
      const k = clamp(b * 1.35 - card.lag, 0, 1), t = lerp(T.screening - 0.085, T.screening + 0.085 - card.lag * 0.14, smooth(0, 1, k)), q = route.at(t);
      card.g.position.set(q.x, 0.98, q.z); card.g.rotation.y = -0.25;
      const passed = smooth(T.screening - 0.004, T.screening + 0.02, t);
      card.verify(passed);
      gateHit = Math.max(gateHit, 1 - Math.abs(t - T.screening) / 0.03);
    });
    beamMat.opacity = 0.16 + 0.34 * clamp(gateHit, 0, 1);
    gateCheckMat.opacity = smooth(0.6, 0.9, b);

    // 3 — matching: one role tile lifts and turns blue, the candidate card aligns with it
    const lift = smooth(0.15, 0.55, m), land = smooth(0.3, 0.9, m);
    picked.position.y = 0.5 * lift;
    pickMat.opacity = lift; pickRingMat.opacity = 0.9 * lift;
    matchCard.g.position.set(lerp(matchFrom[0], matchTo[0], land), lerp(matchFrom[1], matchTo[1], land) + 0.9 * Math.sin(land * Math.PI), lerp(matchFrom[2], matchTo[2], land));
    matchCard.g.rotation.set(-Math.PI / 2 * land, -0.3 * (1 - land), 0);
    matchCard.verify(smooth(0.85, 1, m));

    // 4 — placement: the team assembles at the entrance, the destination lights up, a check confirms
    team.forEach((mbr, i) => {
      const k = smooth(i * 0.08, 0.55 + i * 0.08, d);
      mbr.p.position.set(lerp(mbr.from[0], mbr.to[0], k), 0, lerp(mbr.from[1], mbr.to[1], k));
    });
    const done = smooth(0.55, 0.95, d);
    doorGlow.opacity = 0.9 * done; haloMat.opacity = 0.8 * done;
    badge.scale.setScalar(Math.max(0.001, done)); badge.visible = done > 0.01; badge.position.y = 4.2 + 0.4 * done;

    renderer.render(scene, camera);
  }

  function dispose() {
    Object.values(G).forEach((g) => g.dispose());
    Object.values(M).forEach((m) => m.dispose());
    owned.forEach((m) => m.dispose());
    baseGeo.dispose(); liveGeo.dispose(); gridGeo.dispose(); ground.geometry.dispose();
    renderer.dispose();
  }

  resize();
  return { resize, render, dispose };
}

export function webglAvailable() {
  try { return !!(THREE.WebGLRenderer && document.createElement('canvas').getContext('webgl')); } catch (e) { return false; }
}
