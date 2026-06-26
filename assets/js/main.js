import { getInitialLang, loadLang, applyTranslations, STORAGE_KEY } from './i18n.js';
import { initNav } from './nav.js';
import { initReveal, createTyping, initWhatsappFab } from './effects.js';

const WHATSAPP_NUMBER = '5493425148399';

function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

function updateWhatsAppLinks(data) {
  const url = buildWhatsAppUrl(data.contact.whatsappMessage);
  document.querySelectorAll('[data-whatsapp-link]').forEach((el) => {
    el.href = url;
  });
}

// Tags técnicos por categoría — los nombres de tecnologías no se traducen,
// solo el título de la categoría (que viene del JSON de i18n).
const STACK_DATA = [
  { key: 'backend', tags: ['PHP', 'Laravel', 'MySQL', 'Python'] },
  { key: 'frontend', tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Bootstrap'] },
  { key: 'infra', tags: ['Docker', 'Git', 'SVN'] },
  { key: 'ecommerce', tags: ['Magento 2', 'Shopify', 'WordPress'] },
  { key: 'ai', tags: ['OpenAI API', 'Meta Graph API'] },
  { key: 'blockchain', tags: ['Solidity'] },
];

let currentLang = null;
let typingController = null;

function renderStack(data) {
  const grid = document.getElementById('stack-grid');
  grid.innerHTML = '';

  STACK_DATA.forEach((group) => {
    const card = document.createElement('div');
    card.className = 'card reveal';

    const category = document.createElement('p');
    category.className = 'stack-card__category mono';
    category.textContent = data.stack.categories[group.key];

    const tagList = document.createElement('div');
    tagList.className = 'stack-card__tags';
    group.tags.forEach((tag) => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      tagList.appendChild(span);
    });

    card.append(category, tagList);
    grid.appendChild(card);
  });
}

function renderServices(data) {
  const grid = document.getElementById('services-grid');
  grid.innerHTML = '';

  data.services.items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card reveal';

    const title = document.createElement('h3');
    title.className = 'card__title';
    title.textContent = item.title;

    const desc = document.createElement('p');
    desc.className = 'card__desc';
    desc.textContent = item.description;

    card.append(title, desc);
    grid.appendChild(card);
  });
}

function renderExperience(data) {
  const timeline = document.getElementById('experience-timeline');
  timeline.innerHTML = '';

  data.experience.items.forEach((item) => {
    const entry = document.createElement('div');
    entry.className = 'experience__item reveal';

    const period = document.createElement('p');
    period.className = 'experience__period';
    period.textContent = item.period;

    const role = document.createElement('h3');
    role.className = 'experience__role';
    role.textContent = item.role;

    const company = document.createElement('p');
    company.className = 'experience__company';
    company.textContent = item.company;

    const desc = document.createElement('p');
    desc.className = 'experience__desc';
    desc.textContent = item.description;

    entry.append(period, role, company, desc);
    timeline.appendChild(entry);
  });
}

function renderProjects(data) {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = '';

  data.projects.items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';

    const media = document.createElement('div');
    media.className = 'project-card__media';
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = '';
    img.loading = 'lazy';
    media.appendChild(img);

    const body = document.createElement('div');
    body.className = 'project-card__body';

    const title = document.createElement('h3');
    title.className = 'card__title';
    title.textContent = item.title;

    const desc = document.createElement('p');
    desc.className = 'card__desc';
    desc.textContent = item.description;

    const stackWrap = document.createElement('div');
    stackWrap.className = 'project-card__stack';
    item.stack.forEach((tech) => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tech;
      stackWrap.appendChild(span);
    });

    const footer = document.createElement('div');
    footer.className = 'project-card__footer';

    if (item.url) {
      const link = document.createElement('a');
      link.className = 'project-card__link';
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.innerHTML = `${data.projects.visitLabel} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
      footer.appendChild(link);
    } else {
      const label = document.createElement('span');
      label.className = 'project-card__case-label';
      label.textContent = data.projects.caseStudyLabel;
      footer.appendChild(label);
    }

    body.append(title, desc, stackWrap, footer);
    card.append(media, body);
    grid.appendChild(card);
  });
}

function updateLangToggleUI(lang) {
  document.querySelectorAll('[data-lang-label]').forEach((el) => {
    el.classList.toggle('is-active', el.getAttribute('data-lang-label') === lang);
  });
}

async function setLang(lang) {
  const data = await loadLang(lang);

  applyTranslations(data);
  renderStack(data);
  renderExperience(data);
  renderServices(data);
  renderProjects(data);
  updateLangToggleUI(lang);
  updateWhatsAppLinks(data);

  document.documentElement.lang = lang;
  localStorage.setItem(STORAGE_KEY, lang);

  if (typingController) typingController.restart(data.hero.typing);
  initReveal();

  currentLang = lang;
}

function init() {
  document.getElementById('footer-year').textContent = new Date().getFullYear();

  initNav();
  initWhatsappFab();
  typingController = createTyping(document.getElementById('typing-text'));

  document.getElementById('lang-toggle').addEventListener('click', () => {
    setLang(currentLang === 'es' ? 'en' : 'es');
  });

  setLang(getInitialLang());
}

init();
