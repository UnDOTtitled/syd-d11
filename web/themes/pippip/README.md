# Pippip v3

Contents:

- [About](#about)
- [Browser support](#browser-support)
- [Setup](#setup)
- [Frontend build (Vite)](#frontend-build-vite)
- [Icons](#icons)
- [CSS](#css)
- [SASS file structure](#sass-file-structure)
- [Grid](#grid)
- [JS](#js)
- [Included JS files](#included-js-files)
- [Included plugins](#included-plugins)

## About

Pippip is a Drupal 11 base theme using **Vite**, **TypeScript**, and **SASS**. Naming conventions for styles and templates loosely follow the [Pattern Lab methodology](https://patternlab.io/).

## Browser support

- Edge, Chrome, Firefox, Safari (modern versions; see Vite build target in `vite.config.js`).

## Setup

- Place image assets in `./assets/img` and fonts in `./assets/font`.
- From the **project root** (not inside the theme or DDEV):
  - Run `npm install`
  - Run `npm run build` for a one-off build, or `npm run watch` to rebuild on file changes.

## Frontend build (Vite)

All frontend commands are run from the **project root**. Drupal serves built assets from the theme’s `dist/` directory.

| Command | Purpose |
|--------|---------|
| `npm run build` | One-off build. Outputs to `web/themes/pippip/dist/` (CSS, JS, fonts, images, manifest). |
| `npm run watch` | Build on save. Rebuilds when you change files; refresh the browser to see updates. |
| `npm run preview` | Serve the built `dist/` locally (optional; for quick checks without Drupal). |

### Verifying the build

1. From project root: `npm install` (if needed), then `npm run build`.
2. Check that `web/themes/pippip/dist/` contains `css/global.css`, `css/print.css`, `js/defaults.js`, `js/global.js`, `js/emmsg.js`, `.vite/manifest.json`, plus `font/` and `img/`.
3. Open the site (e.g. `https://syd-d11.ddev.site`). Page should be styled and JS should run.
4. For development: run `npm run watch`, edit a Sass or TS file and save, then refresh the browser to see changes.

## Icons

Icons can be used in Twig with `{{ get_icon('icon') }}`.

## CSS

The theme is **SASS**-based. Built CSS is written to `dist/css/` by Vite.

### Included helper classes

- `.hidden` — hides the element from view and screen readers.

### SASS file structure

- **Entry files:** Top-level files in `assets/sass/` (e.g. `global.scss`, `print.scss`) are built as separate CSS files in `dist/css/` (e.g. `global.css`, `print.css`). `global.scss` is the main stylesheet and imports the rest.
- **Folders:** `config/` (variables, fonts), `helpers/` (mixins, breakpoints, etc.), `base/` (defaults, typography, Drupal), `templates/`, `organisms/`, `molecules/`, `atoms/`, `grid/` — all used via imports from the entry files.

### Grid

[Reflex grid](http://reflexgrid.com/docs/) is used for layout (flexbox-based, mobile-first). See its docs for usage.

## JS

The theme uses **TypeScript**. Vite compiles it for modern browsers (see `vite.config.js` build target). Source lives in `assets/js/`; built files go to `dist/js/`.

### Included JS files

- `assets/js/defaults.ts` — default plugins and global behaviour.
- `assets/js/global.ts` — project-specific global JS (minimal by default).
- `assets/js/emmsg.ts` — emergency message behaviour.

### Included plugins

Usage details are in `assets/js/defaults.ts` (and the built `defaults.js`).

- [BaguetteBox](https://www.npmjs.com/package/baguettebox.js) — image lightbox
- [LazyLoad](https://github.com/verlok/lazyload) — lazy-load images
- [Van11y accessible accordion](https://github.com/nico3333fr/van11y-accessible-accordion-aria) — accessible accordion
- [Zenscroll](https://github.com/zengabor/zenscroll) — anchor scroll animation
