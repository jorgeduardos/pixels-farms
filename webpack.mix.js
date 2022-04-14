// webpack.mix.js

let mix = require('laravel-mix');
const URL = 'pixel-farm.test';

mix
    .copy('./src/js/lib', './dist/js/lib/')
    .copy('./src/images', './dist/images')
    .options({
        autoprefixer: true,
        postCss: [
            require('cssnano')(),
        ],
        legacyNodePolyfills: true
    })


mix
    .js('src/js/app.js', 'js').sass('src/css/app.scss', 'css').setPublicPath('dist')
    .browserSync({
        proxy: URL,
        port: 3000,
        files: [
            './dist/css/app.css',
            './dist/js/app.js',
            './dist/images/{*,**/*}.{svg,jpg,png}',
            './index.html',
        ],
    })
    .sourceMaps(true, 'source-map');

if (mix.inProduction()) {
    mix
        .minify('dist/js/app.js')
        .minify('dist/css/app.css')
}