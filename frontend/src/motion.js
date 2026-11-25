// Scroll motion for the sections below the hero: each section arrives as a "camera shot"
// (tilts in, holds flat, tilts away), cards and headings scrub in, images and decor drift
// with parallax. Everything is tied to scroll position and reverses on the way back up.
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const HEADER = 72;
const CARD_GRIDS = '.grid-2, .grid-3, .grid-4, .case-grid, .mosaic, .stats, [data-stagger]';

// gentle: inner pages — modest vertical entrances only, no drift, no section camera shots.
export function initMotion({ gentle = false } = {}) {
  const doc = document, root = doc.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 720px)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  root.classList.add('js');
  const cleanups = [];
  const on = (target, type, fn, opts) => { target.addEventListener(type, fn, opts); cleanups.push(() => target.removeEventListener(type, fn, opts)); };

  let reveals = [], words = [], floats = [], shots = [], maxScroll = 1, bar = null, dirty = true, raf = 0;
  const docTop = (el) => { let y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; };

  function splitWords(h) {
    const spans = [];
    Array.from(h.childNodes).forEach((node) => {
      if (node.nodeType !== 3) return;
      const frag = doc.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(' ')); return; }
        const outer = doc.createElement('span'), inner = doc.createElement('span');
        outer.className = 'w'; inner.className = 'wi'; inner.textContent = part; outer.appendChild(inner); frag.appendChild(outer); spans.push(inner);
      });
      h.replaceChild(frag, node);
    });
    return spans;
  }

  function collect() {
    const RULES = [
      ['.float-chip', (i) => (i % 2 ? 'left' : 'right'), 2, [-40, 40]],
      ['.mosaic-stat', () => 'zoom', 1, [0]],
      ['.story', () => 'right', 1, [-26]],
      ['.footer-grid > .reveal', () => 'up', 4, [0, 0, 0, 0]],
    ];
    const seen = new Set();
    doc.querySelectorAll(CARD_GRIDS).forEach((grid) => {
      Array.from(grid.children).forEach((el) => {
        if (!el.matches('.reveal:not(.mosaic-stat, .float-chip)')) return;
        el.classList.add('is-in');
        seen.add(el);
      });
    });
    RULES.forEach(([sel, fx, cols, drift]) => {
      const plain = sel.replace('.footer-grid > ', '');
      doc.querySelectorAll(sel).forEach((el) => {
        if (!el.classList.contains('reveal') || seen.has(el)) return;
        const i = Array.from(el.parentElement.children).filter((c) => c.matches(plain)).indexOf(el), col = i % cols;
        reveals.push({ el, top: 0, h: 0, e: -1, lag: 0.15 * col, fx: fx(i), dir: cols === 3 ? col - 1 : (col < cols / 2 ? -1 : 1), drift: drift[col] || 0 });
        seen.add(el);
      });
    });
    doc.querySelectorAll('.reveal').forEach((el) => {
      if (seen.has(el)) return;
      reveals.push({ el, top: 0, h: 0, e: -1, lag: 0, fx: 'up', dir: 0, drift: el.classList.contains('center') || el.classList.contains('head-with-eyebrow') ? 12 : 0 });
    });
    doc.querySelectorAll('main h2:not(.h-card, .approach-title), main h1.split').forEach((h) => {
      h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
      const spans = splitWords(h); if (spans.length && !reduced) words.push({ el: h, spans, top: 0, e: -1 });
    });
    doc.querySelectorAll('[data-parallax-img]').forEach((el) => floats.push({ el, host: el.parentElement, amt: 10, kind: 'img', scale: 1.1 }));
    doc.querySelectorAll('.tip img').forEach((el) => floats.push({ el, host: el.parentElement, amt: 18, kind: 'img', scale: 1 }));
    doc.querySelectorAll('.tile img').forEach((el, i) => floats.push({ el, host: el.parentElement, amt: i % 2 ? -16 : 16, kind: 'img', scale: 1 }));
    doc.querySelectorAll('[data-rotate]').forEach((el) => floats.push({ el, host: el.closest('.spec'), amt: +el.dataset.rotate * 2.5, kind: 'r' }));
    doc.querySelectorAll('.mission-text, .cta-title').forEach((el) => floats.push({ el, host: el, amt: -12, kind: 'y' }));
    if (reduced) { reveals.forEach((r) => r.el.classList.add('is-in')); return; }
    // floating depth decor: the home page's own list, or any inner-page section marked data-decor
    const decor = gentle ? Array.from(doc.querySelectorAll('[data-decor]'))
      : ['#different', '#services', '#industries', '#specialities', '#jobs', '#tips', '#testimonials', '#contact'].map((sel) => doc.querySelector(sel));
    decor.forEach((sec, i) => {
      if (!sec) return;
      const dots = doc.createElement('span'), ring = doc.createElement('span');
      dots.className = 'depth depth-dots ' + (i % 2 ? 'at-right' : 'at-left'); ring.className = 'depth depth-ring ' + (i % 2 ? 'at-left' : 'at-right');
      dots.setAttribute('aria-hidden', 'true'); ring.setAttribute('aria-hidden', 'true');
      sec.insertBefore(ring, sec.firstChild); sec.insertBefore(dots, sec.firstChild);
      floats.push({ el: dots, host: sec, amt: 80, ax: i % 2 ? -18 : 18, kind: 'y' });
      floats.push({ el: ring, host: sec, amt: -60, kind: 'y' });
      cleanups.push(() => { dots.remove(); ring.remove(); });
    });
    bar = doc.createElement('span'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true');
    doc.querySelector('.site-header').appendChild(bar); cleanups.push(() => bar.remove());
    if (!gentle) doc.querySelectorAll('.rest > section, .teaser').forEach((el, i) => {
      if (el.querySelector(CARD_GRIDS)) return;
      el.classList.add('shot');
      shots.push({ el, top: 0, h: 0, k: -1, side: i % 2 ? -1 : 1 });
    });
  }

  function layout() {
    reveals.forEach((r) => { r.top = docTop(r.el); r.h = r.el.offsetHeight; r.e = -1; });
    words.forEach((w) => { w.top = docTop(w.el); w.e = -1; });
    floats.forEach((o) => { o.top = docTop(o.host); o.h = o.host.offsetHeight; });
    shots.forEach((c) => { c.top = docTop(c.el); c.h = c.el.offsetHeight; c.k = -1; });
    maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
    dirty = true;
  }

  function camera(y, vh) {
    const amp = mobile.matches ? 0.45 : 1, range = vh * 0.62, n = (v) => v.toFixed(2);
    shots.forEach((c) => {
      if (c.top > y + vh + 400 || c.top + c.h < y - 400) { if (c.k !== 9) { c.el.style.transform = ''; c.el.style.opacity = ''; c.k = 9; } return; }
      const kin = 1 - smooth(0, 1, (y + vh - c.top) / range), kout = 1 - smooth(0, 1, (c.top + c.h - y - HEADER) / range);
      const key = Math.round(kin * 1000) * 10000 + Math.round(kout * 1000);
      if (key === c.k) return; c.k = key;
      if (kin <= 0 && kout <= 0) { c.el.style.transform = ''; c.el.style.opacity = ''; return; }
      const s = c.side;
      if (kin > 0) {
        c.el.style.transformOrigin = '50% 0%';
        c.el.style.transform = `perspective(1600px) translate3d(${n(s * 50 * kin * amp)}px,${n(26 * kin)}px,${n(-220 * kin * amp)}px) rotateX(${n(20 * kin * amp)}deg) rotateY(${n(-s * 10 * kin * amp)}deg) rotateZ(${n(s * 1.2 * kin * amp)}deg)`;
      } else {
        c.el.style.transformOrigin = '50% 100%';
        c.el.style.transform = `perspective(1600px) translate3d(${n(-s * 34 * kout * amp)}px,0,${n(-170 * kout * amp)}px) rotateX(${n(-15 * kout * amp)}deg) rotateY(${n(s * 8 * kout * amp)}deg)`;
      }
      c.el.style.opacity = (1 - 0.3 * Math.max(kin, kout)).toFixed(3);
    });
  }

  function entrance(r, k, small) {
    if (gentle) return `perspective(1200px) translate3d(0,${(28 * k).toFixed(2)}px,${(-40 * k).toFixed(2)}px) rotateX(${(7 * k).toFixed(2)}deg)`;
    const n = (v) => v.toFixed(2), fx = small && (r.fx === 'left' || r.fx === 'right') ? 'up' : r.fx;
    switch (fx) {
      case 'left': return `perspective(1200px) translate3d(${n(-80 * k)}px,${n(22 * k)}px,0) rotateY(${n(18 * k)}deg)`;
      case 'right': return `perspective(1200px) translate3d(${n(80 * k)}px,${n(22 * k)}px,0) rotateY(${n(-18 * k)}deg)`;
      case 'zoom': return `perspective(1200px) translate3d(0,${n(36 * k)}px,${n(-160 * k)}px) rotateX(${n(10 * k)}deg)`;
      default: return `perspective(1100px) translate3d(0,${n(44 * k)}px,${n(-60 * k)}px) rotateX(${n(15 * k)}deg) rotateY(${n(r.dir * 8 * k)}deg)`;
    }
  }

  function scrub(y, vh) {
    const atEnd = y >= maxScroll - 2, range = vh * (gentle ? 0.32 : 0.42), small = mobile.matches;
    reveals.forEach((r) => {
      const e = atEnd ? 1 : smooth(0, 1, (y + vh - r.top) / range - r.lag);
      if (e === r.e || (e < 1 && Math.abs(e - r.e) < 0.002)) return;
      r.e = e;
      if (e >= 1) { r.el.style.opacity = ''; r.el.style.transform = ''; r.el.classList.add('is-in'); return; }
      const k = 1 - e;
      r.el.classList.remove('is-in');
      r.el.style.opacity = Math.min(1, e * 1.4).toFixed(3);
      r.el.style.transform = entrance(r, k, small);
    });
    words.forEach((w) => {
      const raw = atEnd ? 9 : (y + vh - w.top) / (vh * 0.36), e = clamp(raw, 0, 3);
      if (e === w.e) return; w.e = e;
      w.spans.forEach((span, j) => {
        const ej = smooth(0, 1, raw * 1.25 - 0.25 - j * 0.14), k = 1 - ej;
        span.style.transform = k <= 0 ? '' : `translate3d(0,${(k * 108).toFixed(1)}%,0) rotate(${(k * 5).toFixed(2)}deg)`;
        span.style.opacity = k <= 0 ? '' : ej.toFixed(3);
      });
    });
  }

  function parallax(y, vh) {
    const small = mobile.matches, mid = y + vh / 2;
    reveals.forEach((r) => {
      if (!r.drift || gentle || small || r.top > y + vh + 200 || r.top + r.h < y - 200) return;
      const v = clamp((r.top + r.h / 2 - mid) / (vh / 2 + r.h / 2), -1, 1);
      r.el.style.translate = `0 ${(v * r.drift).toFixed(1)}px`;
    });
    floats.forEach((o) => {
      if (o.top > y + vh + 200 || o.top + o.h < y - 200) return;
      const v = clamp((o.top + o.h / 2 - mid) / (vh / 2 + o.h / 2), -1, 1), amt = o.amt * (small ? 0.5 : 1);
      if (o.kind === 'r') o.el.style.transform = `rotate(${(v * amt).toFixed(2)}deg)`;
      else if (o.kind === 'img') o.el.style.transform = `translate3d(0,${(v * amt).toFixed(1)}px,0) scale(${o.scale})`;
      else o.el.style.translate = `${o.ax ? (v * o.ax).toFixed(1) + 'px' : '0'} ${(v * amt).toFixed(1)}px`;
    });
  }

  function frame() {
    if (dirty) {
      dirty = false;
      const y = window.pageYOffset, vh = window.innerHeight;
      if (bar) bar.style.transform = `scaleX(${clamp(y / maxScroll, 0, 1).toFixed(4)})`;
      if (!reduced) { camera(y, vh); scrub(y, vh); parallax(y, vh); }
    }
    raf = requestAnimationFrame(frame);
  }

  /* in-page links, active nav item, card tilt */
  on(doc, 'click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    const el = doc.getElementById(a.getAttribute('href').slice(1)); if (!el) return;
    e.preventDefault();
    window.scrollTo({ top: el.id === 'home' ? 0 : docTop(el) - 84, behavior: reduced ? 'auto' : 'smooth' });
    if (el.id !== 'home') { el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
  });
  if (finePointer && !reduced) {
    doc.querySelectorAll('.tilt').forEach((card) => {
      on(card, 'pointermove', (e) => {
        if (!card.classList.contains('is-in')) return;
        const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
      });
      on(card, 'pointerleave', () => { if (card.classList.contains('is-in')) card.style.transform = ''; });
    });
  }

  collect(); layout();
  on(window, 'scroll', () => { dirty = true; }, { passive: true });
  on(window, 'resize', layout);
  on(window, 'load', layout);
  if ('ResizeObserver' in window) { const ro = new ResizeObserver(layout); ro.observe(doc.body); cleanups.push(() => ro.disconnect()); }
  raf = requestAnimationFrame(frame);

  return () => { cancelAnimationFrame(raf); cleanups.forEach((fn) => fn()); };
}
