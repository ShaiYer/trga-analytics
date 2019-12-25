var gulp = require("gulp");
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var order = require("gulp-order");
var watch = require('gulp-watch');
const { series } = require('gulp');

/**
 *
 * Concat the trga src files in order into dist
 *
 */

var jsFilesConcatArray = [
    "src/trga-analytics-api.js",
    "src/trga-ga-api.js",
    "src/trga-dom-helper.js",
    ];

var jsFilesDebugConcatArray = [

    "src/trga-debug.js",
];

var jsFilesWithDebugConcatArray = jsFilesConcatArray.concat(jsFilesDebugConcatArray)

gulp.task('concatOrderWithDebug', function() {
    return gulp
        .src(jsFilesWithDebugConcatArray)
        .pipe(order(jsFilesWithDebugConcatArray,{ base: './' }))
        .pipe(concat("trga-analytics-with-debug.js"))
        .pipe(gulp.dest("dist"));
});


gulp.task('concatOrder', function() {
    return gulp
        .src(jsFilesConcatArray)
        .pipe(order(jsFilesConcatArray,{ base: './' }))
        .pipe(concat("trga-analytics.js"))
        .pipe(gulp.dest("dist"));
});

/**
 *
 * Compress the JS
 *
 */

gulp.task('compressJs', function() {

    return gulp
        .src(['dist/trga-analytics-with-debug.js', 'dist/trga-analytics.js'])
        .pipe(minify({
            ext:{
                // src:'-debug.js',
                min:'.min.js'
            },
            exclude: [],
            noSource: true,
            ignoreFiles: ['*.min.js']
        }))
        .pipe(gulp.dest('dist'));


});


/**
 *
 * Execute the deploy task of concat + compressJs
 *
 *
 */

gulp.task('deploy', gulp.series('concatOrder', 'concatOrderWithDebug', 'compressJs'));

/**
 *
 * Watch function for development
 *
 */
gulp.task('watch', function () {
    gulp.watch('src/**/*.js', gulp.series('deploy'));
});
