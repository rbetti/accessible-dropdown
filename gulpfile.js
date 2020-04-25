'use strict'

const gulp = require('gulp')
const eslint = require('gulp-eslint')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

gulp.task('lint', () => {
  return (
    gulp.src('./src/**/*.js').
			// ----------- linting --------------
      pipe(eslint()).
      pipe(eslint.format()).
			pipe(eslint.failAfterError()) // --> failing if errors
	);
});

/**
 * Styles section
 */
 gulp.task('sass', () => {
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
});

gulp.task('dist-js', () => {
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
    //.pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
});


exports.watch = () => {
  gulp.watch(
    './src/**/*.js',
		gulp.series(
      //'lint',
			gulp.parallel('dist-js')
		)
  )
  gulp.watch(['./src/sass/*.scss', './src/sass/**/*.scss'], gulp.series('sass'));
}
