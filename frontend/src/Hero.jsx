// Pinned, scroll-driven hero. One master GSAP ScrollTrigger timeline produces a single
// progress value (0..1); the camera, route, stations and HTML overlays all derive from it.
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RANGES, STAGES, SCROLL } from './config.js';
import { HOME_INTRO_HTML } from './homeIntro.js';
import { createWorld, webglAvailable } from './world.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const stageAt = (p) => (p < RANGES.sourcing[0] ? -1 : p < RANGES.screening[0] ? 0 : p < RANGES.matching[0] ? 1 : p < RANGES.placement[0] ? 2 : 3);

export default function Hero() {
  const section = useRef(null), canvas = useRef(null), intro = useRef(null), panel = useRef(null), fill = useRef(null), cue = useRef(null);
  const [active, setActive] = useState(-1);
  const [mode] = useState(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 720px)').matches;
    return { reduced, webgl: !small && Boolean(window.THREE) && webglAvailable(), small };
  });
  const [worldFailed, setWorldFailed] = useState(false);
  const isStatic = mode.reduced || !mode.webgl || worldFailed;

  useEffect(() => {
    const el = section.current;
    let world = null, raf = 0, shown = -1, target = 0, current = -1, activeNow = -2, tl = null;
    if (mode.webgl && !worldFailed) {
      try { world = createWorld(canvas.current, { lowPower: mode.small, staticView: isStatic }); }
      catch {
        setWorldFailed(true);
        return undefined;
      }
    }
    if (isStatic && !world) return undefined;

    // Everything on screen is a function of p.
    function apply(p) {
      if (world) world.render(p);
      if (isStatic) return;
      const out = smooth(RANGES.sourcing[0], RANGES.sourcing[0] + 0.1, p);
      intro.current.style.opacity = String(1 - out);
      intro.current.style.transform = 'translate3d(0,' + (-34 * out).toFixed(1) + 'px,0)';
      intro.current.style.pointerEvents = out > 0.6 ? 'none' : '';
      const show = smooth(RANGES.sourcing[0] + 0.04, RANGES.sourcing[1] - 0.02, p) * (1 - smooth(RANGES.release[0] + 0.02, 0.99, p));
      panel.current.style.opacity = show.toFixed(3);
      panel.current.style.transform = 'translate3d(0,' + (18 * (1 - show)).toFixed(1) + 'px,0)';
      panel.current.style.pointerEvents = show > 0.6 ? '' : 'none';
      fill.current.style.transform = 'scaleY(' + clamp((p - RANGES.sourcing[0]) / (RANGES.placement[1] - RANGES.sourcing[0]), 0, 1).toFixed(4) + ')';
      cue.current.style.opacity = String(1 - smooth(0.01, 0.07, p));
      const st = stageAt(p);
      if (st !== activeNow) { activeNow = st; setActive(st); }
    }

    function frame() {
      // light follow-smoothing for the native fallback; GSAP's scrub already smooths
      current = current < 0 ? target : current + (target - current) * (tl ? 1 : 0.14);
      if (Math.abs(current - target) < 0.0004) current = target;
      if (current !== shown) { shown = current; apply(current); }
      raf = requestAnimationFrame(frame);
    }

    const nativeProgress = () => {
      const r = el.getBoundingClientRect(), travel = r.height - window.innerHeight;
      target = travel > 0 ? clamp(-r.top / travel, 0, 1) : 0;
    };

    if (isStatic) { target = 0; }
    else if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      const proxy = { p: 0 };
      tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: SCROLL.scrub, invalidateOnRefresh: true } });
      tl.to(proxy, { p: 1, ease: 'none', duration: 1, onUpdate: () => { target = proxy.p; } });
    } else {
      nativeProgress();
      window.addEventListener('scroll', nativeProgress, { passive: true });
    }

    const onResize = () => { if (world) world.resize(); if (!tl && !isStatic) nativeProgress(); shown = -1; };
    window.addEventListener('resize', onResize);
    const ro = 'ResizeObserver' in window ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(canvas.current);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', nativeProgress);
      if (ro) ro.disconnect();
      if (tl) { if (tl.scrollTrigger) tl.scrollTrigger.kill(); tl.kill(); }
      if (world) world.dispose();
    };
  }, [isStatic, mode, worldFailed]);

  // Clicking a step scrolls to that stage of the journey.
  const goTo = (i) => {
    const el = section.current, range = RANGES[STAGES[i].key];
    const top = el.getBoundingClientRect().top + window.pageYOffset, travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + travel * (range[0] + (range[1] - range[0]) * 0.75), behavior: mode.reduced ? 'auto' : 'smooth' });
  };

  const height = isStatic ? undefined : (mode.small ? SCROLL.mobileHeightVh : SCROLL.desktopHeightVh) + 'vh';

  return (
    <section className={'journey' + (isStatic ? ' is-static' : '') + (mode.webgl && !worldFailed ? '' : ' no-webgl')} id="home" ref={section} style={{ height }} aria-label="How Clevanoo works">
      <div className="journey-sticky">
        <canvas ref={canvas} className="journey-canvas" aria-hidden="true" />
        <div className="journey-intro" ref={intro} dangerouslySetInnerHTML={{ __html: HOME_INTRO_HTML }} />

        <div className="steps" ref={panel} style={isStatic ? undefined : { opacity: 0 }}>
          <span className="steps-line" aria-hidden="true"><span className="steps-fill" ref={fill} /></span>
          <ol>
            {STAGES.map((s, i) => {
              const on = isStatic || active === i;
              return (
                <li key={s.key} className={'step' + (on ? ' is-active' : '') + (active > i ? ' is-done' : '')} aria-current={!isStatic && active === i ? 'step' : undefined}>
                  <button type="button" className="step-head" onClick={() => goTo(i)} disabled={isStatic}>
                    <span className="step-dot" aria-hidden="true" />
                    <span className="step-no">{s.no}</span>
                    <span className="step-title">{s.title}</span>
                  </button>
                  <div className="step-body"><p>{s.text}</p></div>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="scroll-cue" ref={cue} aria-hidden="true"><span />Scroll</div>
      </div>
    </section>
  );
}
