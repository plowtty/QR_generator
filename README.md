# QR Generator Studio

A static web app for generating advanced QR codes with full customization, multiple content types, local history, and export in `PNG` and `SVG`.

## Features

- **Content types:** `URL`, `Text`, `Wi-Fi`, `Phone`, `Email`, and `vCard`
- **QR customization:** size, margin, dark color, light color, and error correction level (`L`, `M`, `Q`, `H`)
- **Export:** download as `PNG` or `SVG`
- **Persistence:** auto-draft, recent history, and favorites stored in `localStorage`
- **Accessibility:** keyboard navigation, live region announcements, and visible focus
- **Modular architecture:** JavaScript ES Modules with no build step required

## Project Structure

```text
.
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js
│   │   └── modules/
│   │       ├── app-controller.js
│   │       ├── content-builders.js
│   │       ├── content-type-config.js
│   │       ├── default-state.js
│   │       ├── qr-service.js
│   │       └── storage-service.js
│   └── vendor/
│       └── qrcode.mjs
├── index.html
└── README.md
```

## Run Locally

You can open `index.html` directly, but ES Modules work better with a local server:

```bash
python3 -m http.server 8000
```

Then open:

```
http://localhost:8000/
```

## Deploy to GitHub Pages

This is a fully static site (HTML + CSS + JS), so it works out of the box on GitHub Pages.

1. Push to your repository.
2. Go to **Settings** → **Pages**.
3. Under **Build and deployment**, select:
   - **Source:** `Deploy from a branch`
   - **Branch:** `master` and folder `/ (root)`
4. Save and wait for the public URL.

Live URL: **https://plowtty.github.io/QR_generator/**

## Notes

- History and favorites are stored per browser/device via `localStorage`.
- The QR library (`qrcode@1.5.4`) is vendorized locally under `assets/vendor/` for cross-browser stability.
