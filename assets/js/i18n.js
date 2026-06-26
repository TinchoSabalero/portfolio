export const SUPPORTED_LANGS = ['es', 'en'];
export const STORAGE_KEY = 'lang';

export function getInitialLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

  const browserLang = navigator.language?.slice(0, 2);
  return SUPPORTED_LANGS.includes(browserLang) ? browserLang : 'es';
}

export async function loadLang(lang) {
  const res = await fetch(`i18n/${lang}.json`);
  return res.json();
}

function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
}

export function applyTranslations(data) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = getPath(data, el.getAttribute('data-i18n'));
    if (typeof value === 'string') el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.getAttribute('data-i18n-attr')
      .split(',')
      .forEach((pair) => {
        const [attr, path] = pair.split(':').map((s) => s.trim());
        const value = getPath(data, path);
        if (typeof value === 'string') el.setAttribute(attr, value);
      });
  });
}
