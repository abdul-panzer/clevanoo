// Fixed canvas behind the home page's sections after the hero (shared logic in background.js).
import React, { useEffect, useRef } from 'react';
import { mountBackdrop, BACKDROP } from './background.js';
import { webglAvailable } from './world.js';

export default function Backdrop() {
  const canvas = useRef(null);
  useEffect(() => {
    if (!webglAvailable()) { canvas.current.style.display = 'none'; return undefined; }
    try {
      return mountBackdrop(canvas.current, BACKDROP, {
        lowPower: window.matchMedia('(max-width: 720px)').matches,
        reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      });
    } catch (e) { canvas.current.style.display = 'none'; return undefined; }
  }, []);
  return <canvas ref={canvas} className="bg-canvas" aria-hidden="true" />;
}
