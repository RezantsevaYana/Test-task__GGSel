const { src, dest, parallel, series, watch } = require('gulp');

const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create()
const autoprefixer = require('gulp-autoprefixer')

function styles() {
    return src('./src/styles/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ grid: true }))
    .pipe(dest('./build/css/'))
    .pipe(browserSync.stream())
  }


function browsersync() {
    browserSync.init({
      server: {
        baseDir: './build/',
        serveStaticOptions: {
          extensions: ['html'],
        },
      },
      port: 3000,
      ui: { port: 3001 },
      open: true,
    })
}

function pages() {
    return src('./src/*.html')
    .pipe(dest('./build/'))
    .pipe(browserSync.reload({ stream: true, }))
}

function copyFonts() {
    return src('./src/fonts/**/*')
    .pipe(dest('./build/fonts/'))
}
  
function copyImages() {
    return src('./src/images/**/*')
        .pipe(dest('./build/images/'))
}
  
async function copyResources() {
    copyFonts()
    copyImages()
}

function watch_dev() {
    watch('./src/styles/style.scss', styles).on(
      'change',
      browserSync.reload
    )
    watch('./src/*.html', pages).on(
      'change',
      browserSync.reload
    )
  }


exports.browsersync = browsersync
exports.styles = styles
exports.pages = pages
exports.copyResources = copyResources

exports.default = parallel(
  styles,
  copyResources,
  pages,
  browsersync,
  watch_dev
)

exports.build = series(
  styles,
  copyResources,
  pages
)