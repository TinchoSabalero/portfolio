// Genera index.html (español) y en/index.html (inglés) a partir de template.html
// y los datos de i18n/. Sin dependencias: `node build.mjs`.
//
// Por qué existe: el sitio es bilingüe, y si el idioma se cambiara solo por JS en la
// misma URL, Google podría indexar una sola versión. Generando una URL por idioma
// (+ hreflang) las dos son indexables, y el contenido queda en HTML plano para los
// crawlers de IA que no ejecutan JavaScript.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://martinprono.pages.dev/';
const WHATSAPP_NUMBER = '5493425148399';

const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const readJson = (p) => JSON.parse(read(p));

const template = read('template.html');
const stackData = readJson('i18n/stack.json');
const langs = {
  es: { data: readJson('i18n/es.json'), url: SITE_URL,         out: 'index.html',    ogLocale: 'es_AR', htmlLang: 'es' },
  en: { data: readJson('i18n/en.json'), url: SITE_URL + 'en/', out: 'en/index.html', ogLocale: 'en_US', htmlLang: 'en' },
};

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const getPath = (obj, path) =>
  path.split('.').reduce((acc, k) => (acc == null ? undefined : acc[k]), obj);

const indent = (html, spaces) =>
  html.split('\n').map((l) => (l ? ' '.repeat(spaces) + l : l)).join('\n');

// ---------- bloques generados ----------

function renderExperience(d) {
  return d.experience.items.map((it) => `<div class="experience__item reveal">
  <p class="experience__period">${esc(it.period)}</p>
  <h3 class="experience__role">${esc(it.role)}</h3>
  <p class="experience__company">${esc(it.company)}</p>
  <p class="experience__desc">${esc(it.description)}</p>
</div>`).join('\n');
}

function renderStack(d) {
  return stackData.map((g) => `<div class="card reveal">
  <p class="stack-card__category mono">${esc(d.stack.categories[g.key])}</p>
  <div class="stack-card__tags">${g.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
</div>`).join('\n');
}

function renderServices(d) {
  return d.services.items.map((it) => `<div class="card reveal">
  <h3 class="card__title">${esc(it.title)}</h3>
  <p class="card__desc">${esc(it.description)}</p>
</div>`).join('\n');
}

function renderProjects(d) {
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  return d.projects.items.map((it) => {
    const footer = it.url
      ? `<a class="project-card__link" href="${esc(it.url)}" target="_blank" rel="noopener">${esc(d.projects.visitLabel)} ${arrow}</a>`
      : `<span class="project-card__case-label">${esc(d.projects.caseStudyLabel)}</span>`;
    return `<div class="project-card reveal">
  <div class="project-card__media"><img src="/${esc(it.image)}" alt="${esc(it.title)}" loading="lazy" width="800" height="450"></div>
  <div class="project-card__body">
    <h3 class="card__title">${esc(it.title)}</h3>
    <p class="card__desc">${esc(it.description)}</p>
    <div class="project-card__stack">${it.stack.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
    <div class="project-card__footer">${footer}</div>
  </div>
</div>`;
  }).join('\n');
}

// ---------- datos estructurados ----------

function buildJsonLd(lang, d) {
  const person = `${SITE_URL}#martin`;
  const service = `${SITE_URL}#servicio`;
  const es = lang === 'es';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${langs[lang].url}#profilepage`,
        url: langs[lang].url,
        name: d.meta.title,
        inLanguage: es ? 'es-AR' : 'en',
        dateCreated: '2026-06-26',
        dateModified: new Date().toISOString().slice(0, 10),
        mainEntity: { '@id': person },
      },
      {
        '@type': 'Person',
        '@id': person,
        name: 'Martín Prono',
        givenName: 'Martín',
        familyName: 'Prono',
        jobTitle: d.hero.kicker,
        description: d.meta.description,
        url: SITE_URL,
        image: `${SITE_URL}assets/img/profile/yo.jpeg`,
        email: 'mailto:martinpro_95@hotmail.com',
        telephone: `+${WHATSAPP_NUMBER}`,
        address: { '@type': 'PostalAddress', addressLocality: 'Santa Fe', addressRegion: 'Santa Fe', addressCountry: 'AR' },
        workLocation: { '@type': 'Place', name: es ? 'Remoto (clientes de todo el mundo)' : 'Remote (clients worldwide)' },
        alumniOf: { '@type': 'EducationalOrganization', name: 'Instituto ICOP' },
        hasOccupation: {
          '@type': 'Occupation',
          name: d.hero.kicker,
          occupationalCategory: '15-1254.00',
          skills: stackData.flatMap((g) => g.tags).join(', '),
        },
        knowsLanguage: [
          { '@type': 'Language', name: 'Spanish', alternateName: 'es' },
          { '@type': 'Language', name: 'English', alternateName: 'en' },
        ],
        knowsAbout: [
          ...stackData.flatMap((g) => g.tags),
          ...d.services.items.map((s) => s.title),
        ],
        sameAs: [
          'https://www.linkedin.com/in/mart%C3%ADn-prono-703930127',
          'https://github.com/TinchoSabalero',
        ],
        worksFor: { '@id': service },
      },
      {
        '@type': 'ProfessionalService',
        '@id': service,
        name: 'Martín Prono — Full-Stack Web Development',
        description: d.services.subtitle,
        url: SITE_URL,
        image: `${SITE_URL}assets/img/og/og-image.jpg`,
        priceRange: '$$',
        address: { '@type': 'PostalAddress', addressLocality: 'Santa Fe', addressRegion: 'Santa Fe', addressCountry: 'AR' },
        availableLanguage: ['es', 'en'],
        areaServed: { '@type': 'Place', name: 'Worldwide' },
        founder: { '@id': person },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: d.services.title,
          itemListElement: d.services.items.map((s) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: s.title, description: s.description },
          })),
        },
      },
    ],
  };
}

// ---------- render ----------

function buildPage(lang) {
  const { data: d, url, ogLocale, htmlLang } = langs[lang];
  const other = lang === 'es' ? 'en' : 'es';

  const hreflang = [
    `  <link rel="alternate" hreflang="es" href="${langs.es.url}">`,
    `  <link rel="alternate" hreflang="en" href="${langs.en.url}">`,
    `  <link rel="alternate" hreflang="x-default" href="${langs.es.url}">`,
  ].join('\n');

  // El toggle marca el idioma activo con la misma clase que usaba el botón JS
  const opts = ['es', 'en'].map((l, i) => {
    const span = `<span class="lang-toggle__opt${l === lang ? ' is-active' : ''}">${l.toUpperCase()}</span>`;
    return i === 0 ? span : `<span class="lang-toggle__sep">/</span>${span}`;
  }).join('');

  const vars = {
    $lang: htmlLang,
    $otherLang: langs[other].htmlLang,
    $otherUrl: other === 'es' ? '/' : '/en/',
    $canonical: url,
    $siteUrl: SITE_URL,
    $hreflang: hreflang,
    $ogLocale: ogLocale,
    $ogLocaleAlt: langs[other].ogLocale,
    $langToggleOpts: opts,
    $typingJson: esc(JSON.stringify(d.hero.typing)),
    $typingFirst: esc(d.hero.typing[0] ?? ''),
    $whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(d.contact.whatsappMessage)}`,
    $year: String(new Date().getFullYear()),
    $jsonld: indent(JSON.stringify(buildJsonLd(lang, d), null, 2), 4),
  };

  const blocks = {
    '@EXPERIENCE': indent(renderExperience(d), 10),
    '@STACK': indent(renderStack(d), 10),
    '@SERVICES': indent(renderServices(d), 10),
    '@PROJECTS': indent(renderProjects(d), 10),
  };

  let out = template.replace(/\{\{([^}]+)\}\}/g, (full, rawKey) => {
    const key = rawKey.trim();
    if (key in blocks) return blocks[key];
    if (key in vars) return vars[key];
    const value = getPath(d, key);
    if (typeof value !== 'string') {
      throw new Error(`[build] clave i18n faltante o no textual en ${lang}: "${key}"`);
    }
    return esc(value);
  });

  const dest = join(ROOT, langs[lang].out);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, out);
  return { out: langs[lang].out, bytes: out.length, projects: d.projects.items.length };
}

// ---------- sitemap ----------

function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const url = (loc, alts) => `  <url>
    <loc>${loc}</loc>
${alts.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}"/>`).join('\n')}
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>`;
  const alts = [
    { lang: 'es', href: langs.es.url },
    { lang: 'en', href: langs.en.url },
    { lang: 'x-default', href: langs.es.url },
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${url(langs.es.url, alts)}
${url(langs.en.url, alts)}
</urlset>
`;
  writeFileSync(join(ROOT, 'sitemap.xml'), xml);
  return 'sitemap.xml';
}

for (const lang of Object.keys(langs)) {
  const r = buildPage(lang);
  console.log(`  ${r.out.padEnd(14)} ${String(r.bytes).padStart(6)} bytes  (${r.projects} proyectos)`);
}
console.log(`  ${buildSitemap().padEnd(14)} 2 URLs con hreflang`);
