// Entry for every inner page: shared header, gentle scroll motion, one decorative 3D scene,
// and the page's own behaviour (jobs, contact form, filters).
import { initNav } from './nav.js';
import { initMotion } from '../motion.js';
import { initJobs } from './jobs.js';
import { initEmailForm } from './forms.js';
import { initFilters } from './filters.js';

const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = window.matchMedia('(max-width: 720px)').matches;

function webgl() {
  try { return !!document.createElement('canvas').getContext('webgl'); } catch (e) { return false; }
}

// The 3D scene is decorative: it loads after the page is ready and only where it can run well.
function startScene() {
  const marked = Array.from(document.querySelectorAll('[data-scene]'));
  const saveData = navigator.connection && navigator.connection.saveData;
  if (!marked.length || reduced || saveData || !webgl()) return;
  const load = () => new Promise((ok, fail) => {
    if (window.THREE) return ok();
    const s = document.createElement('script'); s.src = THREE_URL; s.async = true; s.onload = ok; s.onerror = fail;
    document.head.appendChild(s);
  });
  load().then(() => import('../background.js')).then(({ mountBackdrop }) => {
    const canvas = document.createElement('canvas');
    canvas.className = 'bg-canvas'; canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    const plan = marked.map((el, i) => ({
      el, build: el.dataset.scene,
      x: (el.dataset.side === 'left' ? -1 : el.dataset.side === 'right' ? 1 : (i % 2 ? -1 : 1)) * 6.7,   // data-side keeps it beside images, not behind text
      dim: Number(el.dataset.dim || 0.42),
    }));
    try {
      const stop = mountBackdrop(canvas, plan, { lowPower: small, reduced });
      window.addEventListener('pagehide', stop, { once: true });   // release WebGL when leaving the page
    } catch (e) { canvas.remove(); }
  }).catch(() => {});
}

function boot() {
  const stopNav = initNav();
  const stopMotion = initMotion({ gentle: true });
  initJobs();
  initEmailForm();
  initFilters();
  window.addEventListener('pagehide', (event) => {
    if (!event.persisted) {
      stopNav();
      stopMotion();
    }
  });
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 300));
  if (document.readyState === 'complete') idle(startScene); else window.addEventListener('load', () => idle(startScene), { once: true });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
