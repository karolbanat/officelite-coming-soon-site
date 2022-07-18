const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const webpack = require('webpack-stream');
const named = require('vinyl-named');
const through = require('through2');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const paths = {
	sass: './src/sass/**/*.scss',
	js: './src/js/**/*.js',
	dist: './dist',
	sassDest: './dist/css',
	jsDest: './dist/js',
};

function sassCompiler(done) {
	src(paths.sass)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(
			rename({
				suffix: '.min',
			})
		)
		.pipe(sourcemaps.write())
		.pipe(dest(paths.sassDest));
	done();
}

function javaScript(done) {
	src(paths.js)
		.pipe(named())
		.pipe(
			webpack({
				mode: 'development',
				output: {
					filename: 'bundle.js',
				},
				module: {
					rules: [
						{
							use: {
								loader: 'babel-loader',
								options: {
									presets: ['@babel/preset-env'],
								},
							},
							test: /\.js$/,
							exclude: /node_modules/,
						},
					],
				},
				devtool: 'inline-source-map',
				plugins: [new MomentLocalesPlugin()],
			}).on('error', (err) => console.debug(err))
		)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(
			through.obj(function (file, enc, cb) {
				// Dont pipe through any source map files as it will be handled
				// by gulp-sourcemaps
				const isSourceMap = /\.map$/.test(file.path);
				if (!isSourceMap) this.push(file);
				cb();
			})
		)
		// .pipe(
		// 	babel({
		// 		presets: ['@babel/preset-env'],
		// 	})
		// )
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(dest(paths.jsDest));
	done();
}

function cleanStuff(done) {
	src(paths.dist, { read: false }).pipe(clean());
	done();
}

function startBrowserSync(done) {
	browserSync.init({
		server: {
			baseDir: './',
		},
		browser: ['chrome', 'firefox'],
	});
	done();
}

function watchForChanges(done) {
	watch('./*.html').on('change', reload);
	watch([paths.sass, paths.js], parallel(sassCompiler, javaScript)).on('change', reload);
	done();
}

exports.cleanStuff = cleanStuff;
const mainFunctions = parallel(sassCompiler, javaScript);
exports.default = series(mainFunctions, startBrowserSync, watchForChanges);
