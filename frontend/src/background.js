// 3D scroll elements behind every section after the hero: one fixed canvas, one AI-tech or
// cyber-security object per section, in the brand navy. Scroll position decides which object
// is in view and how far through its motion it is, so everything reverses on the way back up.
import * as THREE from 'three';
import { COLORS } from './config.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const mod = (a, n) => ((a % n) + n) % n;

// Section → object. x = side of the screen (world units), dim = strength.
export const BACKDROP = [
  { sel: '#about', build: 'layers', x: 6.4, dim: 0.8 },          // neural network layers
  { sel: '#different', build: 'core', x: -7.4, dim: 0.5 },       // AI core
  { sel: '#approach', build: 'racks', x: 6.8, dim: 0.75 },       // data-centre racks
  { sel: '#mission', build: 'globe', x: -7.2, dim: 0.5 },        // global network
  { sel: '#services', build: 'chip', x: 6.6, dim: 0.75 },        // AI processor
  { sel: '#industries', build: 'matrix', x: -6.8, dim: 0.75 },   // data cube
  { sel: '#specialities', build: 'shield', x: 6.8, dim: 0.85 },  // security shield and lock
  { sel: '#jobs', build: 'screens', x: -6.4, dim: 0.7 },         // interface panels
  { sel: '#tips', build: 'bars', x: 6.6, dim: 0.7 },             // signal bars
  { sel: '#testimonials', build: 'signal', x: -7.2, dim: 0.5 }, // broadcast rings
  { sel: '#contact', build: 'network', x: 6.4, dim: 0.7 },       // connected neural nodes
];
const SPACING = 11;

function shieldGeometry(depth) {
  const o = [[0, 2.7], [-2.2, 1.9], [-2.2, -0.2], [-1.9, -1.5], [-1.1, -2.5], [0, -3.1], [1.1, -2.5], [1.9, -1.5], [2.2, -0.2], [2.2, 1.9]];
  const pos = [], idx = [], n = o.length, z = depth / 2;
  o.forEach(([x, y]) => pos.push(x, y, z)); o.forEach(([x, y]) => pos.push(x, y, -z));
  pos.push(0, 0, z, 0, 0, -z);
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    idx.push(2 * n, i, j, 2 * n + 1, n + j, n + i, i, n + i, n + j, i, n + j, j);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

export function createBackdrop(canvas, { lowPower = false, reduced = false, plan = BACKDROP } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  if ('outputEncoding' in renderer && THREE.sRGBEncoding !== undefined) renderer.outputEncoding = THREE.sRGBEncoding;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9e1f2, 0.95));
  const key = new THREE.DirectionalLight(0xffffff, 0.6); key.position.set(5, 9, 8); scene.add(key);

  const seg = lowPower ? 12 : 24;
  const G = {
    box: new THREE.BoxGeometry(1, 1, 1),
    sphere: new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7)),
    cyl: new THREE.CylinderGeometry(1, 1, 1, seg),
    ico: new THREE.IcosahedronGeometry(1, 0),
    octa: new THREE.OctahedronGeometry(1, 0),
    ring: new THREE.TorusGeometry(1, 0.016, 8, lowPower ? 40 : 72),
    hex: new THREE.TorusGeometry(1, 0.014, 6, 6),
    shackle: new THREE.TorusGeometry(0.42, 0.09, 8, 20, Math.PI),
    shield: shieldGeometry(0.5),
  };
  const mats = [];
  let seed = 31; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  function Station(plan) {
    const g = new THREE.Group(), inner = new THREE.Group(); g.add(inner); scene.add(g);
    const mk = (color, rough) => { const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.06, transparent: true, side: THREE.DoubleSide }); mats.push(m); return m; };
    const st = { plan, g, inner, pale: mk(COLORS.paleBlue, 0.85), blue: mk(COLORS.cobalt, 0.5), navy: mk(COLORS.navy, 0.55), white: mk(COLORS.white, 0.9), update() {} };
    st.add = (geo, mat, parent, sx = 1, sy = sx, sz = sx, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(geo, mat); m.scale.set(sx, sy, sz); m.position.set(x, y, z); (parent || inner).add(m); return m;
    };
    st.group = (parent) => { const n = new THREE.Group(); (parent || inner).add(n); return n; };
    st.opacity = (o) => {
      [st.pale, st.blue, st.navy, st.white].forEach((m) => { m.opacity = o; m.depthWrite = o > 0.6; });
    };
    return st;
  }

  const B = {
    // Neural layers: stacked plates with nodes; they separate as you scroll
    layers(st) {
      const L = [];
      for (let k = 0; k < 5; k++) {
        const g = st.group(); L.push(g);
        st.add(G.box, k % 2 ? st.pale : st.white, g, 3.6, 0.1, 3.6);
        for (let i = 0; i < 5; i++) st.add(G.sphere, k % 2 ? st.blue : st.navy, g, 0.16, 0.16, 0.16, (rnd() - 0.5) * 2.8, 0.2, (rnd() - 0.5) * 2.8);
      }
      st.update = (t) => {
        const gap = 0.5 + 1.3 * Math.min(1, Math.abs(t) * 1.6);
        L.forEach((g, k) => { g.position.y = (k - 2) * gap; g.rotation.y = t * (k - 2) * 0.5; });
        st.inner.rotation.set(0.45, 0.6 + t * 1.6, 0);
      };
    },
    // AI core: faceted shell, inner crystal, orbit rings
    core(st) {
      const shell = st.add(G.ico, st.pale, null, 2.3), inner = st.add(G.octa, st.blue, null, 1.25);
      const r1 = st.add(G.ring, st.navy, null, 3.3), r2 = st.add(G.ring, st.blue, null, 3.8);
      const sat = st.add(G.sphere, st.blue, null, 0.2);
      st.update = (t) => {
        shell.rotation.set(t, t * 2, 0); inner.rotation.set(0.4, -t * 3, 0);
        r1.rotation.set(1.2 + t * 2, 0, 0.3); r2.rotation.set(0.4, t * 2.4, 0);
        sat.position.set(Math.cos(t * 4) * 3.3, Math.sin(t * 4) * 1.2, Math.sin(t * 4) * 3.0);
      };
    },
    // Data-centre racks: server blades slide out as you scroll
    racks(st) {
      const racks = [];
      for (let r = 0; r < 4; r++) {
        const g = st.group(); g.position.set((r - 1.5) * 1.3, 0, 0);
        st.add(G.box, st.pale, g, 1.04, 3.1, 1.1);
        const slots = [];
        for (let k = 0; k < 7; k++) slots.push(st.add(G.box, (k + r) % 3 ? st.blue : st.navy, g, 0.86, 0.26, 0.14, 0, -1.22 + k * 0.405, 0.58));
        racks.push(slots);
      }
      st.update = (t) => {
        const amt = Math.min(1, Math.abs(t) * 2);
        racks.forEach((slots, r) => slots.forEach((s, k) => { s.position.z = 0.58 + Math.max(0, Math.sin(t * 3 + r * 0.9 + k * 0.7)) * 0.55 * amt; }));
        st.inner.rotation.set(0.22, 0.75 + t * 1.3, 0);
      };
    },
    // Global network: globe with latitude rings, orbit and satellites
    globe(st) {
      const globe = st.group();
      st.add(G.sphere, st.pale, globe, 2.5);
      [-0.6, 0, 0.6].forEach((h) => { const r = st.add(G.ring, st.blue, globe, 2.52 * Math.cos(Math.asin(h)), 2.52 * Math.cos(Math.asin(h)), 2.52, 0, h * 2.5, 0); r.rotation.x = Math.PI / 2; });
      const mer = st.add(G.ring, st.blue, globe, 2.52);
      const orbit = st.add(G.ring, st.navy, null, 3.6); orbit.rotation.x = Math.PI / 2;
      const sats = [0, 1, 2].map(() => st.add(G.box, st.navy, null, 0.3));
      st.update = (t) => {
        globe.rotation.y = t * 2.6; mer.rotation.y = 0.5;
        sats.forEach((s, k) => { const a = t * 3 + k * 2.094; s.position.set(Math.cos(a) * 3.6, 0, Math.sin(a) * 3.6); s.rotation.y = -a; });
        st.inner.rotation.set(0.35, 0, 0.3);
      };
    },
    // AI processor on a circuit board; data pulses travel along the traces
    chip(st) {
      st.add(G.box, st.pale, null, 8, 0.16, 8, 0, -0.08, 0);
      st.add(G.box, st.navy, null, 3.2, 0.6, 3.2, 0, 0.3, 0);
      st.add(G.box, st.blue, null, 1.9, 0.1, 1.9, 0, 0.65, 0);
      const paths = [];
      for (let side = 0; side < 4; side++) {
        const ca = Math.cos(side * Math.PI / 2), sa = Math.sin(side * Math.PI / 2), W = (u, v) => [u * ca - v * sa, u * sa + v * ca];
        for (let k = 0; k < 6; k++) { const p = W(1.8, (k - 2.5) * 0.46), pin = st.add(G.box, st.blue, null, 0.5, 0.1, 0.14, p[0], 0.08, p[1]); pin.rotation.y = -side * Math.PI / 2; }
        for (let k = 0; k < 3; k++) {
          const v0 = (k - 1) * 0.92, l1 = 2.5 + rnd() * 0.7, bend = (k - 1) * 0.7, a = W(2.05, v0), b = W(l1, v0), c = W(3.7, v0 + bend);
          paths.push([a, b, c]);
          [[a, b], [b, c]].forEach(([p, q]) => {
            const len = Math.hypot(q[0] - p[0], q[1] - p[1]), m = st.add(G.box, st.blue, null, len, 0.03, 0.06, (p[0] + q[0]) / 2, 0.02, (p[1] + q[1]) / 2);
            m.rotation.y = -Math.atan2(q[1] - p[1], q[0] - p[0]);
          });
          st.add(G.cyl, st.navy, null, 0.14, 0.06, 0.14, c[0], 0.04, c[1]);
        }
      }
      const pulses = paths.map(() => st.add(G.box, st.white, null, 0.18, 0.1, 0.18));
      st.update = (t) => {
        st.inner.rotation.set(0.95, 0, t * 1.3);
        pulses.forEach((pl, i) => {
          const s = mod(t * 1.6 + i * 0.37, 1) * 2, k = Math.min(1, Math.floor(s)), q = s - k, p = paths[i];
          pl.position.set(lerp(p[k][0], p[k + 1][0], q), 0.09, lerp(p[k][1], p[k + 1][1], q));
        });
      };
    },
    // Data cube: 27 blocks that expand and re-assemble
    matrix(st) {
      const cubes = [];
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) {
        const odd = (i + j + k + 3) % 2, centre = !i && !j && !k;
        cubes.push({ c: st.add(G.box, centre ? st.navy : odd ? st.blue : st.pale, null, 0.78), p: [i, j, k] });
      }
      st.update = (t) => {
        const s = 0.9 + 1.2 * Math.min(1, Math.abs(t) * 1.5);
        cubes.forEach((o) => { o.c.position.set(o.p[0] * s, o.p[1] * s, o.p[2] * s); o.c.rotation.y = t * o.p[1] * 1.2; });
        st.inner.rotation.set(0.5 + t * 0.4, 0.6 + t * 1.8, 0);
      };
    },
    // Cyber security: shield with padlock inside counter-rotating hex rings
    shield(st) {
      const body = st.group();
      st.add(G.shield, st.blue, body);
      st.add(G.shield, st.pale, body, 0.8, 0.8, 1.25);
      st.add(G.box, st.navy, body, 1.15, 0.92, 0.3, 0, -0.65, 0.42);
      st.add(G.shackle, st.navy, body, 1, 1, 1, 0, -0.18, 0.42);
      st.add(G.cyl, st.white, body, 0.11, 0.1, 0.11, 0, -0.6, 0.58).rotation.x = Math.PI / 2;
      const h1 = st.add(G.hex, st.navy, null, 3.9), h2 = st.add(G.hex, st.blue, null, 4.4);
      const scan = st.add(G.box, st.white, body, 3.6, 0.04, 0.62);
      st.update = (t) => {
        body.rotation.y = t * 2.2; h1.rotation.z = t * 2; h2.rotation.z = -t * 1.4 + 0.5;
        scan.position.y = Math.sin(t * 5) * 2.2;
      };
    },
    // Interface panels fanning out on an arc
    screens(st) {
      const panels = [];
      for (let k = 0; k < 6; k++) {
        const p = st.group(); panels.push(p);
        st.add(G.box, st.pale, p, 2.1, 1.35, 0.06);
        st.add(G.box, st.navy, p, 2.1, 0.2, 0.08, 0, 0.575, 0);
        st.add(G.box, st.blue, p, 1.2, 0.08, 0.08, -0.3, 0.1, 0.02);
        st.add(G.box, st.blue, p, 0.8, 0.08, 0.08, -0.5, -0.15, 0.02);
      }
      st.update = (t) => {
        const spread = 0.2 + 0.32 * (1 - Math.min(1, Math.abs(t) * 1.4));
        panels.forEach((p, k) => {
          const a = (k - 2.5) * spread + t * 0.9;
          p.position.set(Math.sin(a) * 5, (k % 2 ? 0.9 : -0.9) + t * (k - 2.5) * 0.5, Math.cos(a) * 5 - 5); p.rotation.y = a;
        });
      };
    },
    // Signal bars: a field of columns whose wave follows the scroll
    bars(st) {
      const cols = [], NX = lowPower ? 7 : 9, NZ = 5;
      for (let i = 0; i < NX; i++) for (let j = 0; j < NZ; j++) {
        cols.push({ m: st.add(G.box, (i + j) % 4 === 0 ? st.navy : (i + j) % 2 ? st.blue : st.pale, null, 0.5, 1, 0.5, (i - (NX - 1) / 2) * 0.72, 0, (j - (NZ - 1) / 2) * 0.72), i, j });
      }
      st.update = (t) => {
        cols.forEach((o) => { const h = 0.35 + 1.5 * (0.5 + 0.5 * Math.sin(o.i * 0.8 + t * 6) * Math.cos(o.j * 0.9 + t * 4)); o.m.scale.y = h; o.m.position.y = h / 2 - 1.2; });
        st.inner.rotation.set(0.5, 0.7 + t * 1.2, 0);
      };
    },
    // Broadcast rings spreading from a core
    signal(st) {
      const rings = [];
      for (let k = 0; k < 5; k++) rings.push(st.add(G.ring, k % 2 ? st.blue : st.navy, null, 1 + k * 0.62));
      const c = st.add(G.octa, st.blue, null, 0.7);
      st.update = (t) => {
        rings.forEach((m, k) => { m.position.z = (k - 2) * (0.15 + 1.5 * Math.abs(t)); m.rotation.z = t * (k + 1) * 0.4; });
        c.rotation.set(t * 2, t * 3, 0); st.inner.rotation.set(0.2, 0.7 + t * 1.5, 0);
      };
    },
    // Talent profiles: candidate cards fanning out along a connection path
    profiles(st) {
      const cards = [];
      for (let k = 0; k < 5; k++) {
        const c = st.group(); cards.push(c);
        st.add(G.box, k === 2 ? st.blue : st.pale, c, 1.7, 2.3, 0.08);
        st.add(G.sphere, st.white, c, 0.32, 0.32, 0.1, 0, 0.42, 0.08);
        st.add(G.box, st.white, c, 0.9, 0.12, 0.04, 0, -0.35, 0.08);
        st.add(G.box, k === 2 ? st.white : st.navy, c, 0.6, 0.1, 0.04, -0.15, -0.62, 0.08);
      }
      const path = st.add(G.ring, st.navy, null, 4.2); path.rotation.x = Math.PI / 2;
      st.update = (t) => {
        const spread = 0.42 - 0.18 * Math.min(1, Math.abs(t) * 1.4);
        cards.forEach((c, k) => {
          const a = (k - 2) * spread + t * 0.7;
          c.position.set(Math.sin(a) * 4.2, (k - 2) * 0.15 + Math.sin(t * 2 + k) * 0.2, Math.cos(a) * 4.2 - 4.2); c.rotation.y = a;
        });
        st.inner.rotation.set(0.25, 0.5 + t * 0.9, 0);
      };
    },
    // Neural network: connected nodes
    network(st) {
      const nodes = [];
      let guard = 0;
      while (nodes.length < (lowPower ? 10 : 16) && guard++ < 400) {
        const p = [(rnd() - 0.5) * 6, (rnd() - 0.5) * 5, (rnd() - 0.5) * 4];
        if (nodes.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) > 1.3)) nodes.push(p);
      }
      const up = new THREE.Vector3(0, 1, 0);
      nodes.forEach((a, i) => {
        st.add(G.sphere, i % 3 ? st.blue : st.navy, null, i % 3 ? 0.22 : 0.32, undefined, undefined, a[0], a[1], a[2]);
        nodes.map((b, j) => ({ j, d: Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) })).filter((o) => o.j > i).sort((p, q) => p.d - q.d).slice(0, 2).forEach((o) => {
          const b = nodes[o.j], m = st.add(G.cyl, st.pale, null, 0.035, o.d, 0.035, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
          m.quaternion.setFromUnitVectors(up, new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize());
        });
      });
      st.update = (t) => { st.inner.rotation.set(0.2 + t * 0.5, t * 1.8, 0); };
    },
  };

  const stations = plan.map((p) => { const st = Station(p); (B[p.build] || B.network)(st); return st; });

  let W = 1, H = 1;
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2));
    renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix();
  }

  // f = fractional section index (0 = first section centred)
  function render(f) {
    const small = W < 720, narrow = W / H < 1.25;
    const oa = 0.3 * Math.sin(f * 1.35), oe = 0.18 * Math.cos(f * 1.05), R = 14.5 - 1.4 * Math.cos(f * 2.1);
    camera.position.set(Math.sin(oa) * Math.cos(oe) * R, Math.sin(oe) * R, Math.cos(oa) * Math.cos(oe) * R);
    camera.lookAt(0, 0, 0);
    stations.forEach((st, i) => {
      const t = f - i, a = Math.abs(t), vis = 1 - smooth(0.45, 0.95, a);
      st.g.visible = vis > 0.01; if (!st.g.visible) return;
      st.g.position.set(narrow ? 0 : st.plan.x, t * SPACING, (narrow ? -6 : 0) - 5 * a * a);
      st.g.scale.setScalar(0.82 + 0.18 * vis);
      st.opacity(vis * st.plan.dim * (small ? 0.45 : narrow ? 0.6 : 1));
      st.update(reduced ? 0 : t);
    });
    renderer.render(scene, camera);
  }

  function dispose() { Object.values(G).forEach((g) => g.dispose()); mats.forEach((m) => m.dispose()); renderer.dispose(); }
  resize();
  return { resize, render, dispose };
}


// Scroll-driven mount shared by every page: finds which section is centred and renders
// the matching station. On the home page it stays hidden until the pinned hero has ended.
export function mountBackdrop(canvas, plan, { lowPower = false, reduced = false } = {}) {
  const scene = createBackdrop(canvas, { lowPower, reduced, plan });
  const docTop = (el) => { let y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; };
  const els = plan.map((p) => p.el || document.querySelector(p.sel));
  let anchors = [], start = 0, target = 0, current = null, shown = null, raf = 0, dirty = true;
  const layout = () => {
    const vh = window.innerHeight;
    anchors = els.map((el) => (el ? docTop(el) + Math.min(el.offsetHeight, vh * 1.4) / 2 : 0));
    const hero = document.querySelector('.journey'); start = hero ? docTop(hero) + hero.offsetHeight - vh : -Infinity;
    dirty = true;
  };
  const read = () => {
    const c = window.pageYOffset + window.innerHeight / 2, n = anchors.length;
    if (c <= anchors[0]) return (c - anchors[0]) / window.innerHeight;
    for (let i = 0; i < n - 1; i++) if (c <= anchors[i + 1]) return i + (c - anchors[i]) / Math.max(1, anchors[i + 1] - anchors[i]);
    return n - 1 + (c - anchors[n - 1]) / window.innerHeight;
  };
  const frame = () => {
    if (dirty) { target = read(); dirty = false; }
    current = current === null || reduced ? target : current + (target - current) * 0.12;
    if (Math.abs(current - target) < 0.0004) current = target;
    const active = window.pageYOffset > start - 40;
    canvas.style.visibility = active ? 'visible' : 'hidden';
    if (active && current !== shown) { shown = current; scene.render(current); }   // idle when nothing moves
    raf = requestAnimationFrame(frame);
  };
  const onScroll = () => { dirty = true; };
  const onResize = () => { scene.resize(); layout(); shown = null; };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  window.addEventListener('load', layout);
  const ro = 'ResizeObserver' in window ? new ResizeObserver(layout) : null; if (ro) ro.observe(document.body);
  layout(); raf = requestAnimationFrame(frame);
  return () => {
    cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); window.removeEventListener('load', layout);
    if (ro) ro.disconnect(); scene.dispose();
  };
}
