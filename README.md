# BioCursos

Sitio web de **BioCursos**: plataforma de cursos de Biología y Química para preparatoria y
universidad. Incluye catálogo, página de planes, aula virtual con lecciones y laboratorios,
checkout, portal para empresas, inicio de sesión y panel de administración.

El proyecto es una **aplicación de una sola página (SPA)** construida con React 18, React Router 6 y
Tailwind CSS. Funciona sin backend: los datos se guardan en el `localStorage` del navegador.

---

## Estructura del proyecto

```
Cursos/
├── index.html                 Documento principal y punto de entrada del sitio
├── manifest.webmanifest       Manifiesto de la aplicación instalable (PWA)
├── sw.js                      Service worker: caché y modo sin conexión
├── robots.txt                 Reglas para buscadores
├── sitemap.xml                Mapa del sitio (cambia el dominio antes de publicar)
├── assets/
│   ├── css/
│   │   ├── styles.css         Tailwind compilado + estilos base
│   │   └── professional.css   Capa de diseño: tokens, tipografía y componentes
│   ├── js/
│   │   ├── app.js             Aplicación React (bundle compilado)
│   │   └── data.js            Datos semilla: cursos, usuarios, planes y metadatos
│   └── img/
│       └── favicon.svg        Icono del sitio
├── backend/                   API REST: Node.js, Express, MySQL y JWT
├── frontend/                  Fuente React + Vite (en progreso)
├── docs/
│   └── ANALISIS_RUBRICA.md    Evaluación del proyecto frente a la rúbrica
├── .htaccess                  Configuración opcional de Apache (caché, compresión, seguridad)
└── README.md                  Este documento
```

### Qué contiene cada archivo

| Archivo | Responsabilidad |
| --- | --- |
| `index.html` | Metadatos, tipografías, favicon, hojas de estilo, datos estructurados y punto de montaje `#root`. |
| `assets/css/styles.css` | Utilidades de Tailwind y reglas propias de la aplicación. |
| `assets/css/professional.css` | Capa de diseño profesional: paleta, tipografía, superficies, formularios, tablas y accesibilidad. |
| `assets/js/app.js` | Lógica y vistas de la aplicación (React, React Router, iconos y componentes). |
| `assets/js/data.js` | Contenido inicial de la demo, separado del código. |
| `manifest.webmanifest` / `sw.js` | Instalación como app y funcionamiento sin conexión. |
| `.htaccess` | Caché, compresión y cabeceras de seguridad al publicar con Apache (opcional). |
| `docs/ANALISIS_RUBRICA.md` | Brechas frente a la rúbrica y plan de trabajo priorizado. |

---

## Requisitos

- Un **navegador moderno** (Chrome, Edge, Firefox o Safari actuales). El sitio se puede abrir con
  doble clic en `index.html`; también funciona publicado con Apache u otro servidor.
- Conexión a internet para las tipografías de Google Fonts (DM Sans, IBM Plex Mono e Instrument
  Serif). Sin conexión, el navegador usa las fuentes del sistema.

---

## Cómo ejecutar

### Opción A — Abrir directamente (recomendada)

1. Haz **doble clic en `index.html`**.
2. El sitio se abre en el navegador y funciona completo: catálogo, aula, login y panel de
   administración.

Los archivos de JavaScript son scripts clásicos, no módulos ES, por lo que no necesitan un servidor.

### Opción B — Apache de XAMPP

1. Copia la carpeta `Cursos` dentro de `C:\xampp\htdocs\` (por ejemplo `C:\xampp\htdocs\cursos`).
2. Abre el **Panel de control de XAMPP** e inicia **Apache**.
3. Visita `http://localhost/cursos/`.

El sitio navega con rutas en el hash (`#/planes`, `#/admin`, ...), así que no necesita reglas de
reescritura.

### Opción C — Servidor integrado de PHP (sin mover archivos)

Desde una terminal:

```bat
C:\xampp\php\php.exe -S localhost:8080 -t C:\xampp\Cursos
```

Luego abre `http://localhost:8080/`.

### Opción D — Publicación en un hosting

Sube el contenido de la carpeta manteniendo la jerarquía. No se requieren reglas de reescritura:
las rutas viven después del `#` y el servidor sólo entrega `index.html`, `assets/` y el favicon.

---

## Rutas de la aplicación

La navegación usa el hash de la URL, por lo que todas las rutas empiezan con `#/`:

| Ruta | Descripción |
| --- | --- |
| `/#/` | Inicio y catálogo de cursos. |
| `/#/planes` | Planes personales y para empresas, precios y preguntas frecuentes. |
| `/#/curso/:slug` | Detalle del curso: temario, lecciones, laboratorios y repaso. |
| `/#/checkout` | Resumen e inscripción a un curso o plan. |
| `/#/empresa` | Portal de formación para equipos. |
| `/#/login` | Inicio de sesión. |
| `/#/admin` | Panel de administración (cursos, planes, usuarios y reportes). |
| Cualquier otra | Página 404. |

Ejemplo: `http://localhost/cursos/#/curso/fundamentos-biologia`.

---

## Diseño y aplicación instalable

- **Sistema de diseño:** `assets/css/professional.css` define los tokens de color, tipografía,
  superficies, formularios y estados de foco. Se carga después de `styles.css`, así que puedes
  ajustar la identidad visual sin tocar la lógica de la aplicación.
- **Paleta:** índigo `#4F46E5` como color de marca, cian `#0EA5E9` como acento y neutros fríos.
- **Tipografía:** Manrope para títulos y DM Sans para texto; Instrument Serif para acentos.
- **PWA:** `manifest.webmanifest` y `sw.js` permiten instalar el sitio y abrirlo sin conexión. El
  service worker sólo se registra bajo `http://` o `https://`; con doble clic (`file://`) el sitio
  funciona igual, sin instalación.
- **SEO:** metadatos Open Graph, Twitter Card, datos estructurados JSON-LD, `robots.txt` y
  `sitemap.xml`. Antes de publicar, sustituye `https://biocursos.mx/` por tu dominio real en
  `robots.txt` y `sitemap.xml`.
- **Accesibilidad:** enlace de salto al contenido, foco visible, etiquetas ARIA en diálogos y
  respeto a `prefers-reduced-motion`.

---

## Cuentas de acceso

Las cuentas se definen en `assets/js/data.js` (`usuarios_personales` y `usuarios_empresas`).
El panel `/#/admin` está disponible para el perfil de administrador.

> **Aviso de seguridad:** este sitio es estático y las credenciales viajan al navegador. Si lo
> publicas tal cual, cualquier visitante puede leerlas. Para un entorno real, cambia las
> contraseñas y sustituye el inicio de sesión local por un backend con autenticación.

---

## Datos y persistencia

- **Datos semilla:** `assets/js/data.js` (4 cursos completos, usuarios, 5 planes y metadatos).
  El archivo se carga como script clásico y publica los datos en `window.BioCursosDatos`.
- **Carga inicial:** al abrir el sitio, la aplicación usa los datos semilla directamente desde
  `data.js`.
- **Almacenamiento:** los cambios (compras, progreso, ediciones del panel) se guardan en el
  `localStorage` del navegador bajo la clave `biocursos_db_v1`. La sesión se guarda en
  `biocursos_session_v1`.
- **Cambios desde `/#/admin`:** se guardan en el `localStorage` del navegador, no en los archivos.
  Cada navegador conserva su propia copia.
- **Reiniciar la demo:** en las herramientas de desarrollo del navegador
  (*Application → Local Storage*) borra `biocursos_db_v1` y recarga, o ejecuta en la consola:

  ```js
  localStorage.removeItem("biocursos_db_v1");
  localStorage.removeItem("biocursos_session_v1");
  location.reload();
  ```

  Al recargar se vuelven a tomar los datos de `data.js`.

- **Respaldo / importación:** el panel de administración permite exportar e importar la base de
  datos en JSON.

---

## Notas técnicas

- `assets/js/app.js` es el **bundle compilado** de la aplicación (React 18.3.1, React Router 6.30,
  lucide-react y componentes propios). No es código fuente editable línea a línea: para cambios
  grandes de diseño o lógica se necesitaría el proyecto fuente, que no está incluido.
- Los scripts se cargan como **JavaScript clásico** (no módulos ES) para que `index.html` funcione
  también con doble clic, sin servidor. `data.js` debe cargarse antes que `app.js`.
- El enrutamiento usa el hash (`#/...`), por lo que no hacen falta reglas de reescritura en el
  servidor y el sitio funciona en cualquier hosting estático.
- Los textos y precios de la demo se pueden ajustar en `assets/js/data.js` o desde `/#/admin`.
- Los estilos están compilados; las clases de Tailwind presentes son las que usa la aplicación.
- Si modificas `styles.css`, fuerza una recarga completa (`Ctrl + F5`) para evitar la caché.
- El sitio no envía datos a ningún servidor: todo el funcionamiento es local en el navegador.

---

## Créditos y licencias

- React y React Router — licencia MIT.
- lucide-react (iconos) — licencia ISC.
- Tailwind CSS — licencia MIT.
- Tipografías DM Sans, IBM Plex Mono e Instrument Serif — SIL Open Font License, servidas por
  Google Fonts.

---

## Punto de entrada

`index.html` es ahora el único punto de entrada del sitio. El antiguo archivo único
(`BioCursos.html`) se eliminó: su contenido quedó dividido en `index.html`, `assets/css/styles.css`,
`assets/js/app.js` y `assets/js/data.js`.
