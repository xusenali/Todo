import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

const updateSW = registerSW({ immediate: true })

// Ochiq turgan tabda ham yangi versiya borligini tez aniqlash uchun.
setInterval(() => {
  updateSW().catch(() => {})
}, 60_000)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
