import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const __dirname = dirname(fileURLToPath(import.meta.url))
const themeRoot = resolve(__dirname, 'web/themes/pippip')

/** Log file changes so we can confirm the watcher sees edits (e.g. from WSL/Windows). */
function watchDebug() {
  return {
    name: 'watch-debug',
    configureServer(server) {
      server.watcher.on('change', (path) => {
        console.log('[vite] file changed:', path.replace(themeRoot, '').replace(/^\//, '') || path)
      })
    },
  }
}

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

// Prefix CSS entry names so they don't overwrite JS entries (e.g. global.ts vs global.scss)
const cssEntries = Object.fromEntries(
  glob
    .sync('assets/sass/*.scss', { cwd: themeRoot })
    .map(file => [
      'style-' + file.replace(/^assets\/sass\//, '').replace(/\.scss$/, ''),
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
      // Use localhost so HMR websocket works when assets are served from localhost:5173
      host: 'localhost',
      protocol: 'ws',
    },
    // Detect file changes when editing from Windows while Vite runs in WSL
    watch: {
      usePolling: true,
      interval: 300,
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        // If you use a global variables/mixins file, add it here
        // additionalData: `@use "assets/sass/_variables" as *;`,
        // Theme uses @use; only node_modules (baguettebox, normalize) use @import — quietDeps hides their warnings
        quietDeps: true,
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
          if (assetInfo.name?.endsWith('.css')) {
            const base = assetInfo.name.replace(/^style-/, '').replace(/\.css$/, '')
            return `css/${base}.css`
          }
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
    watchDebug(),
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