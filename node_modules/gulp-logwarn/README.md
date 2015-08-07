gulp-logwarn
============
[![NPM](https://nodei.co/npm/gulp-logwarn.png?downloads=true)](https://nodei.co/npm/gulp-logwarn/)

A configurable gulp plugin that warns you if you left debug code

## Install

Use npm for install the package

```javascript
npm install gulp-logwarn
```

## How it works
In your gulpfile.js import gulp-logwarn and call it in a pipe `logwarn()`. If you want, you can extend the strings to be checked by passing an array of strings as argument to logwarn, something like `logwarn(["console.debug","$log.info","DEBUG"])`. You can also pass in an [options](#options) object to change the logging level like `logwarn(["console.debug"], {logLevel:"warn"})`.

in the gulpfile.js
```javascript
var logwarn = require('gulp-logwarn');

var strings = ["console.log","$log"];

var appJs = [
	'js/app.js',
	'js/services.js',
	'js/filters.js',
	'js/directives.js',
	'js/controllers.js'
];

gulp.task('logwarn', function(){
  gulp.src(appJs)
    .pipe(logwarn(strings));
});

...

// if you want to extend you can pass an array so...

gulp.task('logwarn', function(){
	gulp.src(appJs)
		.pipe(logwarn(['console.debug,console.dir']));
});

// If you want to change the log level you can pass an object like so

gulp.task('logwarn', function(){
	gulp.src(appJs)
		.pipe(logwarn(['console.debug,console.dir'], {
			logLevel: 'warn' // or 'info'
		}));
});

```

run it with ```gulp logwarn``` and it will produce as output

![alt tag](https://raw.githubusercontent.com/pmcalabrese/gulp-logwarn/master/console.png)

## Options

### `logLevel`

Set `logLevel` to either `'warn'` or `'info'` to change what gets printed to the console. Using `'warn'` will only print messages for files that contain a `console.log`, whereas using `'info'` will print information for all files passed in regardless of whether there are any `console.log`s in that file.

## TODO

- tests
- clean up the code
