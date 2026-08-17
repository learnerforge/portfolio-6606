import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.css'

createApp(App).mount('#app')

// Remove the boot overlay once Vue has mounted
window.addEventListener('load', () => {
  const boot = document.getElementById('boot')
  if (boot) {
    boot.style.transition = 'opacity .8s ease, transform .8s ease'
    boot.style.opacity = '0'
    boot.style.transform = 'scale(1.05)'
    setTimeout(() => boot.remove(), 900)
  }
}, { once: true })
