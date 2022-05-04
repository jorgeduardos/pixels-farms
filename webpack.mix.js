const fs = require('fs');
const path = require('path');
const mix = require('laravel-mix');
require('laravel-mix-criticalcss');
require('laravel-mix-purgecss');

const compileSeparateFiles = function (dir) {
  return fs.readdirSync(dir).filter(file => {
    return fs.statSync(`${dir}/${file}`).isFile();
  });
}

// // PERFORMANCE JS
compileSeparateFiles('./src/js/vendors').forEach(function (filepath) {
  mix.js('./src/js/vendors/' + filepath, 'js')
    .setPublicPath('./web/assets/')
});

mix
  .before(() => {
    // PERFORMANCE CSS FRAGMENTS
    let getDirectories = (dir) => {
      return fs.readdirSync(dir);
    }
    const cssFragmentsDirectories = getDirectories('./src/css/components');
    if(cssFragmentsDirectories.length) {
      cssFragmentsDirectories.forEach((directoryName) => {
        compileSeparateFiles(`./src/css/components/${directoryName}`).forEach((filepath) => {
          mix.sass(`./src/css/components/${directoryName}/${filepath}`, `css/components/${directoryName}`)
        });
      });
    }
  })
  .sass('./src/css/main.scss', 'css')
  .js('./src/js/main.js', 'js')
  .setPublicPath('./web/assets/')
  .copy('./src/fonts', './web/assets/fonts/')
  .copy('./src/images', './web/assets/images/')
  .copy('./src/favicon', './web/assets/favicon/')

  .browserSync({
    proxy: process.env.PRIMARY_SITE_URL,
    files: ['templates/{*,**/*}.{html,twig}', 'web/assets/css/**/*.css', 'web/assets/js/**/*.js'],
    browser: 'google chrome'
  })

  

  .options({
    autoprefixer: true,
    processCssUrls: false,
    postCss: [
      require('cssnano')(),
    ],
    legacyNodePolyfills: true
  })

  .purgeCss({
    enabled: mix.inProduction(),
    globs: [
      path.join(__dirname, './templates/**/*.{html,twig}'),
      path.join(__dirname, './src/css/**/*.{scss,css}'),
      path.join(__dirname, './src/js/**/*.js'),
      path.join(__dirname, './src/images/**/*.svg'),
      path.join(__dirname, './web/assets/images/**/*.svg'),
    ],
    content: ['./templates/**/*/.{html,twig}', './web/assets/images/**/*.svg', './src/images/**/*.svg', './web/assets/js/main.js'],
    css: ['./web/assets/css/main.css'],
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    extensions: ['html', 'js', 'php', 'twig', 'scss', 'css'],
    whitelist: ['lazyloading', 'lazyloaded', 'lazyfade', 'lazyblur', 'lazyload']
  })

  .criticalCss({
    enabled: mix.inProduction(),
    paths: {
      base: process.env.PRIMARY_SITE_URL,
      templates: './templates/_critical/',
      suffix: '-critical.min'
    },
    urls: [
      {
        url: '/',
        template: 'index'
      }
    ],
    options: {
      minify: true,
      width: 1440,
      height: 1200,
    },
  })

  // This enable jQuery autoload
  // .autoload({
  //   jquery: ['$', 'window.jQuery', 'jQuery']
  // })

  .babelConfig({
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-function-bind',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-transform-runtime',
    ],
  });

if (mix.inProduction()) {
  mix.version();
} else {  
  mix.sourceMaps(true, 'source-map')
  .version()
}