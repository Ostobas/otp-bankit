var gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    purgecss = require('gulp-purgecss'),
    concatCss = require('gulp-concat-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    merge = require('gulp-merge-link'),
    replace = require('gulp-replace'),
    del = require('del')

gulp.task('clean', function() {
    return del('build')
})

gulp.task('html', function() {
    return gulp.src('index.html')
        .pipe(merge({
            'css/bundle.css': ['./src/css/*.css'],
            'js/app.bundle.js': ['./src/js/*.js']
        }))
        .pipe(replace('./src/img', 'img'))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('build'))
})

gulp.task('manifest', function() {
    return gulp.src('manifest.json')
        .pipe(gulp.dest('build'))
})

gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('build/fonts'))
})

gulp.task('img', function() {
    return gulp.src('src/img/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest('build/img'))
})

gulp.task('css', function() {
    return gulp.src('src/css/**/*.css')
        .pipe(autoprefixer('last 2 version'))
        .pipe(concatCss('bundle.css'))
        .pipe(purgecss({
            content: ['**/*.html', 'js/**/*.js'],
            css: ['css/**/*.css']
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('build/css'))
})

gulp.task('js', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(uglify().on('error', function(e){
            console.log(e)
        }))
        .pipe(concat('app.bundle.js'))
        .pipe(gulp.dest('build/js'))
})

gulp.task('default', ['clean'], function() {
    gulp.start('html', 'manifest', 'fonts', 'img', 'css', 'js')
})