import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Backdrop from './Backdrop.jsx';
import { initNav } from './site/nav.js';
import './styles.css';
import './inner.css';

initNav();
createRoot(document.getElementById('home-hero')).render(<App />);
createRoot(document.getElementById('home-backdrop')).render(<Backdrop />);
