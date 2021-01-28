const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sync = require('browser-sync').create();
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const gulpWebp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const del = require('del');
const jsmin = require('gulp-jsmin');
const htmlmin = require('gulp-htmlmin');

// Styles

const styles = () => {
  return gulp
    .src('source/less/style.less')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css/'))
    .pipe(sync.stream());
};

exports.styles = styles;

// Images

const images = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg}').pipe(
    imagemin([
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
      }),
    ])
  );
};
exports.images = images;

const webp = () => {
  return gulp
    .src('source/img/**/*.{jpg,png}')
    .pipe(gulpWebp({ quality: 90 }))
    .pipe(gulp.dest('build/img'));
};
exports.webp = webp;

const sprite = () => {
  return gulp.src('source/img/**/*.svg').pipe(svgstore()).pipe(rename('sprite.svg')).pipe(gulp.dest('build/img'));
};
exports.sprite = sprite;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build/',
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};
exports.server = server;

// Copy

const copy = () => {
  return gulp
    .src(['source/fonts/*.{woff,woff2}', 'source/img/**'], {
      base: 'source/',
    })
    .pipe(gulp.dest('build'));
};

exports.copy = copy;

// Clean

const clean = () => {
  return del('build');
};

exports.clean = clean;

// HTMLmin

const htmlMin = () => {
  return gulp
    .src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
};

exports.htmlMin = htmlMin;

// JSmin

const jsMin = () => {
  return gulp
    .src('source/js/**.js')
    .pipe(jsmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('build/js'));
};
exports.jsMin = jsMin;

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/*.html', gulp.series(htmlMin));
  gulp.watch('source/js/*.js', gulp.series(jsMin));
  gulp.watch('source/*.html').on('change', sync.reload);
};

exports.build = gulp.series(clean, copy, htmlMin, styles, jsMin, images, webp, sprite);

exports.start = gulp.series(exports.build, server, watcher);
