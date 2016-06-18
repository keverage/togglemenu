var gulp = require('gulp');
var less = require('gulp-less');
var chmod = require('gulp-chmod');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('less', function() {
    return gulp.src('./src/togglemenu.less')
        .pipe(less())
        .pipe(chmod(755))
        .pipe(gulp.dest('./dist/'));
});
 
gulp.task('js', function() {
    return gulp.src('./src/*.js')
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.extname = '.min.js'
         }))
        .pipe(chmod(755))
        .pipe(gulp.dest('./dist/'));
});