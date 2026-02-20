/**
 * -----------------------
 * Un.titled - Laravel Mix
 * -----------------------
 */

/**
 * Local setup
 */
const hostname = 'syd-d11.ddev.site'

/**
 * Dependencies
 */
const mix = require('laravel-mix')
const copyWebpackPlugin = require('copy-webpack-plugin')
const imageminPlugin = require('imagemin-webpack-plugin').default
const mixGlob = require('laravel-mix-glob')

/**
 * Variables
 */
const themeDirectory = './web/themes/pippip'
const themeAssets = `${themeDirectory}/assets`
const glob = new mixGlob({ mix })

/**
 * Config
 */
mix.setPublicPath(`${themeDirectory}/dist`)
mix.disableSuccessNotifications()

mix.options({
  processCssUrls: false,
  autoprefixer: { remove: false },
})

mix.browserSync({
  proxy: `https://${hostname}`,
  ghostMode: false,
  files: [
    `${themeDirectory}/templates/**/*.twig`,
    `${themeAssets}/sass/**/*.scss`,
    `${themeAssets}/js/**/*.js`,
    `${themeAssets}/js/**/*.ts`,
    `${themeAssets}/js/**/*.tsx`,
  ],
})

if (mix.inProduction()) {
  mix.version()
  mix.disableNotifications()
} else {
  mix.sourceMaps()
  mix.webpackConfig({ devtool: 'inline-source-map' })
}

mix.webpackConfig({
  stats: 'errors-warnings',
})

/**
 * Assets
 */
glob.sass(`${themeAssets}/sass/*.scss`, 'css')
glob.js(`${themeAssets}/js/*.js`, 'js')
glob.js(`${themeAssets}/js/*.ts`, 'js')
glob.js(`${themeAssets}/js/*.tsx`, 'js')
mix.copyDirectory(`${themeAssets}/font`, `${themeDirectory}/dist/font`)

/**
 * Custom Webpack Configuration
 * 1. Add Typescript support
 * 2. Copy icon/img assets after being optimised
 * 3. Optimise SVGs
 */
mix.webpackConfig({
  module: {
    rules: [
      {
        test: /\.ts|\.tsx$/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx'],
  },
  plugins: [
    new copyWebpackPlugin({
      patterns: [{ from: `${themeAssets}/img`, to: 'img' }],
    }),
    new imageminPlugin({
      test: /\.(svg)$/i,
      svgo: {
        plugins: [
          {
            removeViewBox: false,
          },
        ],
      },
    }),
  ],
})

/**
 * Custom Webpack Configuration
 * Optimise pngs/jpgs/svgs (production only)
 */
if (mix.inProduction()) {
  mix.webpackConfig({
    plugins: [
      new imageminPlugin({
        test: /\.(jpe?g|png|svg)$/i,
        svgo: {
          plugins: [
            {
              removeViewBox: false,
            },
          ],
        },
        pngquant: {
          quality: '70-90',
          dithering: 0,
          speed: 1,
        },
        jpegtran: {
          progressive: true,
          quality: 60,
        },
      }),
    ],
  })
}

mix.minify(`${themeDirectory}/dist/js/global.js`)
mix.minify(`${themeDirectory}/dist/js/emmsg.js`)
mix.minify(`${themeDirectory}/dist/js/defaults.js`)
mix.minify(`${themeDirectory}/dist/css/global.css`)
mix.minify(`${themeDirectory}/dist/css/print.css`)