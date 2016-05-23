var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var addStream = require('add-stream');
var path = require('path');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var Q = require('q');
var del = require('del');

/**
 * File patterns
 **/

// Root directory
var rootDirectory = path.resolve('./');

// Source directory for build process
var sourceDirectory = path.join(rootDirectory, './src');

var sourceFiles = [

    // Make sure module files are handled first
    path.join(sourceDirectory, '/**/*.module.js'),

    // Then add all JavaScript files
    path.join(sourceDirectory, '/**/*.js')
];

var lintFiles = [
    'gulpfile.js'
].concat(sourceFiles);

// removes all compiled dev files
gulp.task('clean-dist', function() {
    var deferred = Q.defer();
    del('./dist', function() {
        deferred.resolve();
    });
});

/* Task to compile less */
gulp.task('compile-less', function () {
    return gulp.src(path.join(sourceDirectory, '/**/*.less'))
        .pipe(less())
        .pipe(concat('angular-horizons-public-view.css'))
        .pipe(gulp.dest('./dist'));
});

/* Task to minify css */
gulp.task('minify-css', function () {
    return gulp.src('./dist/angular-horizons-public-view.css')
        .pipe(minifyCss())
        .pipe(rename('angular-horizons-public-view.min.css'))
        .pipe(gulp.dest('./dist'));
});


function prepareTemplates() {
    return gulp.src(path.join(sourceDirectory, '/**/*.html'))
        .pipe(templateCache('template.js', {module: 'angularHorizonsPublicView'}));
}

gulp.task('build', function () {
    return gulp.src(sourceFiles)
        .pipe(addStream.obj(prepareTemplates))
        .pipe(concat('angular-horizons-public-view.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename('angular-horizons-public-view.min.js'))
        .pipe(gulp.dest('./dist'));
});

/**
 * Process
 */
gulp.task('process-all',function () {
    runSequence('clean-dist', 'jshint', 'build','compile-less','minify-css');
});


/**
 * Watch task
 */
gulp.task('watch', function () {

    // Watch JavaScript files
    gulp.watch(path.join(sourceDirectory, '/**/*'), ['process-all']);

});

/**
 * Validate source JavaScript
 */
gulp.task('jshint', function () {
    return gulp.src(lintFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('default', function () {
    runSequence('process-all', 'watch');
});
