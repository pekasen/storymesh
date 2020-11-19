'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
sass.compiler = require('node-sass');

gulp.task('sass', function () {
  return gulp.src('./src/renderer/index.scss')
    .pipe(concat('./ngwebs.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css/'));
});
 
gulp.task('sass', function () {
  return gulp.src('./src/**/*.scss')
    .pipe(concat('./ngwebs.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css/'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./src/**/*.scss', gulp.series('sass'));
});