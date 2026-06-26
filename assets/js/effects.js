const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let revealObserver;

export function initReveal() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
  }

  document.querySelectorAll('.reveal:not([data-reveal-bound])').forEach((el) => {
    el.setAttribute('data-reveal-bound', 'true');
    revealObserver.observe(el);
  });
}

export function initWhatsappFab() {
  const fab = document.getElementById('whatsapp-fab');
  const hero = document.getElementById('hero');
  if (!fab || !hero) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        fab.classList.toggle('is-visible', !entry.isIntersecting);
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(hero);
}

const TYPE_SPEED = 55;
const DELETE_SPEED = 30;
const PAUSE = 1800;

export function createTyping(el) {
  let phrases = [];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let timeoutId = null;

  function tick() {
    if (!phrases.length) return;
    const current = phrases[phraseIndex % phrases.length];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        timeoutId = setTimeout(tick, PAUSE);
        return;
      }
      timeoutId = setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex++;
        timeoutId = setTimeout(tick, 300);
        return;
      }
      timeoutId = setTimeout(tick, DELETE_SPEED);
    }
  }

  function restart(newPhrases) {
    clearTimeout(timeoutId);
    phrases = newPhrases;
    phraseIndex = 0;
    charIndex = 0;
    deleting = false;

    if (!phrases.length) {
      el.textContent = '';
      return;
    }

    if (prefersReducedMotion) {
      el.textContent = phrases[0];
      return;
    }

    tick();
  }

  return { restart };
}
