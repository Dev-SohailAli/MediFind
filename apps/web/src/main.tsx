import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

import App from './App';
import './styles/global.css';

// Precaches only the static app shell (see vite.config.ts workbox config).
// No runtime network caching exists because the app makes no network call.
registerSW({ immediate: true });

const container = document.getElementById('root');
if (!container) {
  throw new Error('#root element is missing from index.html');
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
