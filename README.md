# QR Generator Studio

Aplicación web estática para generar códigos QR avanzados con personalización, múltiples tipos de contenido, historial local y exportación en `PNG` y `SVG`.

## Funciones principales

- Tipos de contenido: `URL`, `Texto`, `Wi‑Fi`, `Teléfono`, `Email` y `vCard`
- Personalización del QR: tamaño, margen, color oscuro, color claro y nivel de corrección (`L`, `M`, `Q`, `H`)
- Exportación: descarga en `PNG` y `SVG`
- Persistencia útil: borrador automático, historial reciente y favoritos en `localStorage`
- Accesibilidad: navegación por teclado, mensajes en región viva y foco visible
- Arquitectura modular en JavaScript ES Modules

## Estructura del proyecto

```text
.
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── app.js
│       └── modules/
│           ├── app-controller.js
│           ├── content-builders.js
│           ├── default-state.js
│           ├── qr-service.js
│           └── storage-service.js
├── index.html
└── README.md
```

## Ejecutar localmente

Puedes abrir `index.html` directo, pero para módulos ES es mejor usar servidor local:

```bash
python3 -m http.server 8000
```

Luego abre:

- `http://127.0.0.1:8000/`

## Publicar en GitHub Pages

Sí, no hay problema en publicarlo en GitHub Pages. Esta versión es compatible porque es un sitio estático (HTML + CSS + JS + CDN).

1. Sube todo al repositorio.
2. Ve a **Settings** → **Pages**.
3. En **Build and deployment** selecciona:
   - **Source:** `Deploy from a branch`
   - **Branch:** `master` (o `main`) y carpeta `/root`
4. Guarda y espera la URL pública.

## Comandos recomendados para publicar

```bash
git add .
git commit -m "feat: versión casi final con QR avanzado, historial y exportación PNG/SVG"
git push origin master
```

## Notas

- El historial y favoritos se guardan por navegador/dispositivo (`localStorage`).
- La librería QR se carga desde CDN: `qrcode@1.5.4`.
