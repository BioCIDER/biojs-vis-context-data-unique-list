/*
 * BioCIDER: biojs-vis-context-data-unique-list
 * https://github.com/BioCIDER/biojs-vis-context-data-unique-list
 *
 * Copyright (c) 2015 Carlos Horro
 * Licensed under the MIT license.
 */


// browserify build config
var buildDir = "build";
var outputFile = "biocider";

var imagesDir = "img";
var cssDir = "css";

// packages
var gulp   = require('gulp');

// browser builds
var browserify = require('browserify');
var watchify = require('watchify')
var uglify = require('gulp-uglify');

// testing
//var mocha = require('gulp-mocha');



// code style 

// gulp helper
var source = require('vinyl-source-stream'); // converts node streams into vinyl streams
var gzip = require('gulp-gzip');
var rename = require('gulp-rename');
var chmod = require('gulp-chmod');
var streamify = require('gulp-streamify'); // converts streams into buffers (legacy support for old plugins)
var watch = require('gulp-watch');

// path tools
var fs = require('fs');
var path = require('path');
var join = path.join;
var mkdirp = require('mkdirp');
var del = require('del');

// auto config
var outputFileMin = join(buildDir,outputFile + ".min.js");
var packageConfig = require('./package.json');

// a failing test breaks the whole build chain
gulp.task('build', ['build-browser', 'build-browser-gzip','copy-images','copy-css']);
gulp.task('default', [  'build']);






// will remove everything in build
gulp.task('clean', function(cb) {
  del([buildDir+'/img']);
  del([buildDir+'/css']);
  del([buildDir+'/**/*'], cb);
});

// just makes sure that the build dir exists
gulp.task('init', ['clean'], function() {
  mkdirp(buildDir, function (err) {
    if (err) console.error(err)
  });
});

//gulp.task('test', function () {
//  return gulp.src('./test/**/*.js', {read: false})
//    .pipe(mocha({reporter: 'spec',
//                 useColors: false}));
//});

// copy images from source locations to build location
gulp.task('copy-images',['init'], function(cb) {
  gulp.src([
    imagesDir+'/**'
])
.pipe(gulp.dest(buildDir+'/'+imagesDir));
});

// copy images from source locations to build location
gulp.task('copy-css',['init'], function(cb) {
  gulp.src([
    cssDir+'/common.css'
])
.pipe(rename("bundle.css"))
.pipe(gulp.dest(buildDir+'/'+cssDir));
});

// browserify debug
gulp.task('build-browser',['init'], function() {
  var b = browserify({debug: true,hasExports: true});
  exposeBundles(b);
  return b.bundle()
    .pipe(source(outputFile + ".js"))
    .pipe(chmod(644))
    .pipe(gulp.dest(buildDir));
});



// browserify min
gulp.task('build-browser-min',['init'], function() {
  var b = browserify({hasExports: true});
  exposeBundles(b);
  return b.bundle()
    .pipe(source(outputFile + ".min.js"))
    .pipe(chmod(644))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(buildDir));
});
 
gulp.task('build-browser-gzip', ['build-browser-min'], function() {
  return gulp.src(outputFileMin)
    .pipe(gzip({append: false, gzipOptions: { level: 9 }}))
    .pipe(rename(outputFile + ".min.gz.js"))
    .pipe(gulp.dest(buildDir));
});

// exposes the main package
// + checks the config whether it should expose other packages
function exposeBundles(b){
   b.add("./" + packageConfig.main, {expose: packageConfig.name });
  //b.add("./" + packageConfig.main, {expose: "BioCider"});
  if(packageConfig.sniper !== undefined && packageConfig.sniper.exposed !== undefined){
    for(var i=0; i<packageConfig.sniper.exposed.length; i++){
      b.require(packageConfig.sniper.exposed[i]);
    }
  }
}

// watch task for browserify 
// watchify has an internal cache -> subsequent builds are faster
gulp.task('watch', function() {
  var util = require('gulp-util')

  var b = browserify({debug: true,hasExports: true, cache: {}, packageCache: {} });
  b.add("./" + packageConfig.main, {expose: packageConfig.name});
  //b.add("./" + packageConfig.main, {expose: "BioCider" });
  // expose other bundles
  exposeBundles(b);

  function rebundle(ids){
    b.bundle()
    .on("error", function(error) {
      util.log(util.colors.red("Error: "), error);
     })
    .pipe(source(outputFile + ".js"))
    .pipe(chmod(644))
    .pipe(gulp.dest(buildDir));
  }

  var watcher = watchify(b);
  watcher.on("update", rebundle)
   .on("log", function(message) {
      util.log("Refreshed:", message);
  });
  return rebundle();
});
