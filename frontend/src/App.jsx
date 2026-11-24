import React, { useEffect } from 'react';
import Hero from './Hero.jsx';
import Backdrop from './Backdrop.jsx';
import { SECTIONS_HTML } from './sectionsHtml.js';
import { initMotion } from './motion.js';
import { initLatestJobs } from './site/jobs.js';

export default function App() {
  useEffect(() => {
    initLatestJobs(document.getElementById('latest-jobs'));
    return initMotion();
  }, []);
  return (
    <>
      <Backdrop />
      <main id="main">
        <Hero />
        <section className="teaser" aria-label="Next">
          <div className="wrap">
            <h2 className="teaser-title">The right talent. The right fit. Ready to move forward.</h2>
          </div>
        </section>
        <div className="rest" dangerouslySetInnerHTML={{ __html: SECTIONS_HTML }} />
      </main>
    </>
  );
}
