var gulp = require('gulp');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('less', function() {
    return gulp.src('./src/*.less')
        .pipe(less())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('js', function() {
    return gulp.src('./src/*.js')
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.extname = '.min.js'
         }))
        .pipe(gulp.dest('./dist/'));
});