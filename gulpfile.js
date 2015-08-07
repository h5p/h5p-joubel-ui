var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat-util');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var header = require('gulp-header');
var jshint = require('gulp-jshint');
var del = require('del');
var logwarn = require('gulp-logwarn');

var cssmin = 'css/joubel-ui.min.css';
var jsmin = 'js/joubel-ui.min.js';

/* JS task */
gulp.task('js', function () {
  del([jsmin], function () {
    gulp.src('js/*.js')
      .pipe(logwarn(['console.log'])) // Warn if console.log left in code
      .pipe(header('var H5P = H5P || {};'))
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(concat(jsmin))
      .pipe(uglify())
      .pipe(gulp.dest('.'))
      .pipe(notify({message: jsmin + ' created'}));
  });
});

/* CSS task */
gulp.task('css', function () {
  del([cssmin], function () {
    gulp.src('css/*.css')
      .pipe(autoprefixer('last 2 version'))
      .pipe(minifyCSS())
      .pipe(concat(cssmin))
      .pipe(gulp.dest('.'))
      .pipe(notify({message: cssmin + ' created'}));
  });
});

gulp.task('default', function() {
  gulp.start('js', 'css');
});

/* Watch for changes, and run tasks */
gulp.task('watch', function () {
  gulp.watch('css/*.css', ['css']);
  gulp.watch('js/*.js', ['js']);
});
