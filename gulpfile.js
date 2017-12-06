var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var    include       = require("gulp-include");

gulp.task('styles', function() {
  gulp.src('./src/sass/*.scss')
    .pipe(plumber({
        errorHandler: function (error) {
          console.log(error.message);
          this.emit('end');
      }}))
    .pipe(sass({
        includePaths: ['./node_modules/']
    }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('scripts', function(){
  return gulp.src('src/js/*.js')
    // allows for the includsion of files much like how SASS works
    .pipe(include({
      extensions: "js",
      hardFail: true,
      includePaths: [
        __dirname + "/node_modules",
        __dirname + "/src/js",
        __dirname + "/inc"
      ]
    }))
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(babel())
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'))
});

gulp.task('default', function(){
  gulp.watch("src/sass/**/*.scss", ['styles']);
  gulp.watch("src/js/**/*.js", ['scripts']);
});