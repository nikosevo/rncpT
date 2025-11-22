import { Buffer } from 'buffer';
// @ts-ignore
window.global = window;
// @ts-ignore
window.process = { env: {} };
// @ts-ignore
window.Buffer = Buffer;

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
