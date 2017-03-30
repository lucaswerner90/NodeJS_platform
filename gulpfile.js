const gulp=require('gulp');
const obfuscate = require('gulp-obfuscate');


gulp.task('production', function () {
  return gulp.src(['!gulpfile.js','./**/*.js'])
    .pipe(obfuscate())
    .pipe('./dist_code');
});
