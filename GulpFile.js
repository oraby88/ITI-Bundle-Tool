
const { src, dest, series, watch, parallel } = require('gulp');
const replace = require('gulp-replace');


const globs = {
    html: "project/**/*.html",
    css: "project/css/**/*.css",
    js: "project/js/**/*.js",
    img: "project/pics/*"
}


const htmlmin = require("gulp-html-minifier-terser");
// html task
function htmlTask() {
    //read file
    return src(globs.html)
        //minfiy
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        // move to dist
        .pipe(dest("dist"))
}

exports.h = htmlTask



const concat = require("gulp-concat")
const cleanCSS = require('gulp-clean-css');
function cssTask() {
    // read files
    return src(globs.css)
        // concat to one file
        .pipe(concat("style.min.css"))
        // minify
        .pipe(cleanCSS())
        // move to dist
        .pipe(dest("dist/assets/css"))
}


exports.css = cssTask


const terser = require('gulp-terser');
function jsTask() {
    return src(globs.js, { sourcemaps: true })
        .pipe(concat("script.min.js"))
        .pipe(terser())
        .pipe(dest("dist/assets/js"))
}


exports.js = jsTask
const optimizeImages = require("gulp-optimize-images");
function imgTask() {

    return src(globs.img)
        .pipe(optimizeImages({
            compressOptions: {
                jpeg: {
                    quality: 50,
                    progressive: true,
                },
                png: {
                    quality: 90,
                    progressive: true,
                    compressionLevel: 6,
                },
                webp: {
                    quality: 80,
                },
            }
        }))
        .pipe(dest('dist/assets/images'))
}
exports.img = imgTask






function replacePath() {
    return src(['dist/**/*.html'])
        .pipe(replace('./pics/', './assets/images/'))
        .pipe(replace('./css/style.css', './assets/css/style.min.css'))
        .pipe(replace('./js/script.js', './assets/js/script.min.js'))
        .pipe(dest('dist'))
}

exports.replacePath = replacePath






function watchTask() {
    watch(globs.html, htmlTask)
    watch(globs.css, cssTask)
    watch(globs.js, jsTask)
    watch(globs.img, imgTask)
    watch(globs.img, replacePath)
}

function dummyTask(done) {
    // logic
    console.log("test !");
    done()
}

//default //gulp
exports.default = series(parallel(htmlTask, cssTask, jsTask, dummyTask, imgTask, replacePath), watchTask)




