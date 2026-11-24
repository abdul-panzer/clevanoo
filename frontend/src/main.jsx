import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { initNav } from './site/nav.js';
import './styles.css';
import './inner.css';

initNav();
createRoot(document.getElementById('root')).render(<App />);
