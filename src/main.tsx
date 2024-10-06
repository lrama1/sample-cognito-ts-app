import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './polyfills.ts';
import App from './App.tsx'
import './index.css'

import { Buffer } from 'buffer';
(window as any).global = window;
(window as any).Buffer = Buffer;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
