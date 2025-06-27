
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';

// Polyfill Buffer for browser environment
if (!window.Buffer) {
  window.Buffer = Buffer;
}

// Polyfill global for browser environment
if (!window.global) {
  window.global = window;
}

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
