const DESKTOP_QUERY = '(min-width: 48em)';

export function initNav() {
  const burger = document.getElementById('nav-burger');
  const links = document.getElementById('nav-links');

  function closeMenu() {
    links.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }

  function openMenu() {
    links.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  }

  burger.addEventListener('click', () => {
    const isOpen = links.classList.contains('is-open');
    if (isOpen) closeMenu();
    else openMenu();
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  const desktopMq = window.matchMedia(DESKTOP_QUERY);
  desktopMq.addEventListener('change', (e) => {
    if (e.matches) closeMenu();
  });
}
