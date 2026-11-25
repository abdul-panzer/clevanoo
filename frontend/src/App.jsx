import React, { useEffect } from 'react';
import Hero from './Hero.jsx';
import { initMotion } from './motion.js';
import { initLatestJobs } from './site/jobs.js';

export default function App() {
  useEffect(() => {
    initLatestJobs(document.getElementById('latest-jobs'));
    return initMotion();
  }, []);
  return <Hero />;
}
