# Portfolio — Martín Prono

Sitio estático (HTML/CSS/JS puro, sin build tool) con switch de idioma ES/EN.

## Cómo editarlo

- **Textos (español/inglés)**: editá `i18n/es.json` e `i18n/en.json`. No hace falta tocar el HTML para cambiar un texto.
- **Agregar un proyecto o servicio nuevo**: agregá un objeto más al array `projects.items` o `services.items` en ambos JSON (es/en) — la tarjeta aparece sola, generada por `assets/js/main.js`. Si el proyecto tiene sitio público, completá `"url"`; si es privado, dejá `"url": null` y se muestra como "Caso de estudio privado".
- **Experiencia laboral**: array `experience.items` en ambos JSON — cada entrada es `{ role, company, period, description }`, se renderiza como timeline.
- **Stack técnico (los nombres de tecnologías, ej. "PHP", "Docker")**: se editan en `assets/js/main.js`, constante `STACK_DATA` (esos nombres no se traducen, solo el título de cada categoría que sí viene del JSON).
- **Colores, tipografías, espaciados**: variables en `assets/css/tokens.css`.
- **Foto de perfil**: ya está tu foto real en `assets/img/profile/yo.jpeg`. Si la querés cambiar, reemplazá ese archivo (o `placeholder.svg` sigue ahí como respaldo) y actualizá el `src` en `index.html` (sección `#about`).
- **Imágenes de proyectos**: hoy son mockups genéricos en `assets/img/projects/*.svg` (bar, psi, casasinti, nomade, terminal). Si tenés capturas reales (sobre todo de `perspectivanomade.com`, que es pública), reemplazá el archivo correspondiente o cambiá el campo `"image"` del proyecto en el JSON para que apunte a un `.webp`/`.png` real.
- **WhatsApp**: el número vive en un solo lugar, `WHATSAPP_NUMBER` en `assets/js/main.js` — se usa para el botón del hero, el botón flotante y la card de contacto, así que para cambiarlo solo hay que tocar esa constante. El mensaje predeterminado que se precarga al abrir el chat es `contact.whatsappMessage` en ambos JSON de `i18n/`.
- **Datos de contacto**: email y LinkedIn reales en `index.html`, sección `#contact`.

## Cómo verlo localmente

El sitio usa `fetch()` para cargar los JSON de traducción, así que necesita servirse por HTTP (no funciona abriendo el `index.html` directo con `file://`). Opciones simples:

```bash
# con Node (si lo tenés instalado)
npx serve .

# o con Python
python3 -m http.server 8080
```

Después abrí `http://localhost:8080` (o el puerto que indique la herramienta).

## Cómo publicarlo gratis (Cloudflare Pages)

1. Subí esta carpeta a un repositorio de GitHub.
2. Entrá a [Cloudflare Pages](https://pages.cloudflare.com/), conectá el repo.
3. Build command: vacío (no hay build). Output directory: `/` (raíz).
4. Cloudflare te da una URL `tu-proyecto.pages.dev` con HTTPS automático.

Cada vez que hagas push al repo, el sitio se actualiza solo.
