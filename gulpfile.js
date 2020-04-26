'use strict'

const gulp = require('gulp')
const eslint = require('gulp-eslint')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');
const buffer = require('vinyl-buffer');

const lintJs = () => {
  return (
    gulp.src('./src/**/*.js')
			// ----------- linting --------------
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError()) // --> failing if errors
	);
};

/**
 * Styles section
 */
const compileCss = () => {
  return gulp.src('./src/sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass.sync({
      sourceComments: true
    }))
    .pipe(autoprefixer({
			cascade: false
     }))
     .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'))
};

const compileJs = () => {
  return browserify({
      entries: './src/accessible-dropdown.js'
    })
    .transform(babelify.configure({
      presets : ['@babel/env']
    }))
    .bundle()
    .pipe(source("accessible-dropdown.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
};

const minifyJs = () => {
  return gulp.src("./dist/accessible-dropdown.js")
    .pipe(rename("accessible-dropdown.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./dist"));
}

// eslint-disable-next-line no-undef
exports.watch = () => {
  gulp.watch('./src/**/*.js', gulp.parallel(lintJs, compileJs));
  gulp.watch(['./src/sass/*.scss', './src/sass/**/*.scss'], compileCss);
}

exports.minify = minifyJs