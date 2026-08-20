// El contenido y las traducciones ya vienen resueltos en el HTML (ver build.mjs).
// Este script solo maneja las interacciones del navegador.
import { initNav } from './nav.js';
import { initReveal, createTyping, initWhatsappFab } from './effects.js';

function init() {
  const year = document.getElementById('footer-year');
  if (year) year.textContent = new Date().getFullYear();

  initNav();
  initWhatsappFab();
  initReveal();

  // Las frases del typing las emite build.mjs en data-typing (JSON), para que la
  // primera ya esté en el HTML y no haya salto de layout ni contenido vacío sin JS.
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const phrases = JSON.parse(typingEl.dataset.typing || '[]');
    createTyping(typingEl).restart(phrases);
  }
}

init();
