import { defineConfig } from 'vite'
import { resolve, extname, relative } from 'path'
import { glob } from 'glob'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const themeRoot = new URL('.', import.meta.url).pathname

// Discover all JS/TS entry points and SCSS entry points (non-partials)
const jsEntries = Object.fromEntries(
  glob
    .sync('assets/js/*.{js,ts,tsx}', { cwd: themeRoot })
    .map(file => [
      // Output name (strip extension)
      file.replace(/^assets\/js\//, '').replace(/\.(js|ts|tsx)$/, ''),
      resolve(themeRoot, file),
    ])
)

const cssEntries = Object.fromEntries(
  glob
    .sync('assets/sass/*.scss', { cwd: themeRoot })
    .map(file => [
      file.replace(/^assets\/sass\//, '').replace(/\.scss$/, ''),
      resolve(themeRoot, file),
    ])
)

export default defineConfig(({ mode }) => ({
  // Run the dev server from the theme directory
  root: themeRoot,

  // Vite dev server — DDEV will proxy this
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Needed so Drupal's page can load assets from the Vite dev server
    cors: true,
    hmr: {
      // Use the DDEV hostname so HMR websocket works
      host: 'syd-d11.ddev.site',
      protocol: 'wss',
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        // If you use a global variables/mixins file, add it here
        // additionalData: `@use "assets/sass/_variables" as *;`,
      },
    },
  },

  build: {
    // Output to dist/ inside the theme, matching your existing libraries.yml paths
    outDir: 'dist',
    emptyOutDir: true,

    // Generate manifest.json so the Drupal Vite module can resolve hashed filenames
    manifest: true,

    // Use Rollup library mode for Drupal-style multi-entry builds
    rollupOptions: {
      input: {
        ...jsEntries,
        ...cssEntries,
      },
      output: {
        // Keep JS filenames predictable (no hashes) so libraries.yml stays stable
        // The Drupal Vite module reads manifest.json and handles cache-busting
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: assetInfo => {
          if (assetInfo.name?.endsWith('.css')) return 'css/[name].css'
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name ?? '')) return 'font/[name][extname]'
          if (/\.(png|jpe?g|gif|webp|avif)$/.test(assetInfo.name ?? '')) return 'img/[name][extname]'
          if (/\.svg$/.test(assetInfo.name ?? '')) return 'img/[name][extname]'
          return 'assets/[name][extname]'
        },
      },
    },

    // Target modern browsers — D11 drops IE support entirely
    target: ['chrome90', 'firefox90', 'safari14', 'edge90'],

    // Sourcemaps in dev, none in production
    sourcemap: mode === 'development',

    // Minify in production (esbuild is the default — much faster than terser)
    minify: mode === 'production' ? 'esbuild' : false,
  },

  plugins: [
    // Copy fonts and images from assets/ into dist/
    viteStaticCopy({
      targets: [
        { src: 'assets/font/**/*', dest: 'font' },
        { src: 'assets/img/**/*', dest: 'img' },
      ],
    }),
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
}))