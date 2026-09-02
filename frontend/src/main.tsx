import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

// Yangi versiya faollashgan zahoti sahifani majburiy qayta yuklaymiz —
// aks holda eski JS xotirada qolib, eski API manziliga so'rov yuborishda davom etadi.
if ('serviceWorker' in navigator) {
  let reloaded = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloaded) return
    reloaded = true
    window.location.reload()
  })
}

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
