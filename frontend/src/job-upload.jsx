import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import JobUploadPage from '../../src/pages/JobUploadPage.jsx';

const apiBaseUrl = document.querySelector('meta[name="clevanoo-api"]').content.replace(/\/+$/, '');
createRoot(document.getElementById('job-upload-root')).render(<JobUploadPage apiBaseUrl={apiBaseUrl} />);
