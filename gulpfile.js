import {series, parallel, watch, src, dest} from 'gulp';
import gulpConnect from 'gulp-connect';
import postcss from 'gulp-postcss';
import postcssNesting from 'postcss-nesting';
import postcssNested from 'postcss-nested';
import postcssCurrentSelector from 'postcss-current-selector';
import postcssNestedAncestors from 'postcss-nested-ancestors';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import concat from 'gulp-concat';
import plumber from 'gulp-plumber';
import del from 'delete';

const outputDir = 'dist';

const srcHTML = 'src/*.html';
const srcCSS = 'src/**/*.css';

export function server() {
  return gulpConnect.server({
    host: '0.0.0.0',
    port: 3000,
    root: 'dist/',
    livereload: true
  });
}

export function clean(cb) {
  del([outputDir], cb);
}

function tmpl() {
  return src(srcHTML)
    .pipe(dest(outputDir))
}

function css() {
  return src(srcCSS)
    .pipe(plumber())
    .pipe(postcss([
      postcssNestedAncestors(),
      postcssNested(),
      postcssCurrentSelector(),
      postcssNesting(),
      autoprefixer(),
      cssnano()
    ]))
    .pipe(concat('style.min.css'))
    .pipe(dest(outputDir))
}

function watchAll() {
  watch(srcHTML, series(tmpl));
  watch(srcCSS, series(css));
}

export default () => parallel(
  watchAll,
  series(clean, tmpl, css, server)
);
export const build = series(clean, tmpl, css);
export const dev = parallel(
  watchAll,
  series(clean, tmpl, css, server)
);