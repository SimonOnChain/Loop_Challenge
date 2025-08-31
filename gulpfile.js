import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';

// Configure Sass to use modern API
const sass = gulpSass(dartSass);
sass.compiler = dartSass;

import postcss from 'gulp-postcss';
import sassGlob from 'gulp-sass-glob';
import rename from 'gulp-rename';
import include from 'gulp-include';
import notify from 'gulp-notify';
import webp from 'gulp-webp';
import del from 'del';
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import named from 'vinyl-named';
import replace from 'gulp-replace';
import svgstore from 'gulp-svgstore';
import svgmin from 'gulp-svgmin';
import clone from 'gulp-clone';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import cleanCSS from 'gulp-clean-css';
import webpackConfig from './webpack.common.js';

const clonesink = clone.sink();

const COPIED_ASSETS_DIRECTORIES = ['fonts']; // you may add here a list of asset directories that should be copied 1-to-1 to the asset distribution folders

const PATHS = {
	source: 'templates/src/',
	distribution: 'templates/dist/',
	assets: 'assets/',
	styles: 'styles/',
	scripts: 'scripts/',
	images: 'images/',
	icons: 'icons/',
	generators: 'generators/',
	symbolIcons: 'symbols/',
	inlineIcons: 'inline/',
};

const DEFAULT_PROJECT_CONFIG = {
	assetDistributionDirectories: [{ directory: PATHS.distribution + PATHS.assets }],
};

function getAssetDistributionDirectories() {
	return DEFAULT_PROJECT_CONFIG.assetDistributionDirectories;
}

function getFullCopiedAssetDirectories() {
	return COPIED_ASSETS_DIRECTORIES.map(dir => PATHS.source + PATHS.assets + dir + '/**/*');
}

function iconsInline() {
	const assetDistributionDirectories = getAssetDistributionDirectories();

	let stream = gulp
		.src(PATHS.source + PATHS.assets + PATHS.icons + PATHS.inlineIcons + '*.svg')
		.pipe(svgmin())
		.pipe(svgstore({ inlineSvg: true }))
		.pipe(rename('icons-inline.svg'));

	assetDistributionDirectories.forEach(function (assetsDistributionDirectory) {
		stream = stream.pipe(gulp.dest(assetsDistributionDirectory + PATHS.icons));
	});

	return stream;
}

function scripts() {
	const assetDistributionDirectories = getAssetDistributionDirectories();

	let stream = gulp
		.src(PATHS.source + PATHS.assets + PATHS.scripts + 'main.js')
		.pipe(named())
		.pipe(gulpWebpack(webpackConfig))
		.on(
			'error',
			notify.onError({
				message: 'Error: <%= error.message %>',
				title: 'Error running webpack task',
			}),
		);

	assetDistributionDirectories.forEach(function (assetsDistributionDirectory) {
		stream = stream.pipe(gulp.dest(assetsDistributionDirectory + PATHS.scripts));
	});

	return stream;
}

function html() {
	return gulp
		.src([PATHS.source + '**/*.html', PATHS.source + '**/*.php', '!' + PATHS.source + PATHS.assets + '**/*'])
		.pipe(include())
		.on(
			'error',
			notify.onError({
				message: 'Error: <%= error.message %>',
				title: 'Error running html/include task',
			}),
		)
		.pipe(gulp.dest(PATHS.distribution));
}

function copy() {
	return gulp
		.src(getFullCopiedAssetDirectories())
		.pipe(gulp.dest(PATHS.distribution + PATHS.assets));
}

function styles () {
	const assetDistributionDirectories = getAssetDistributionDirectories();

	let stream = gulp
		.src(PATHS.source + PATHS.assets + PATHS.styles + 'styles.scss') // Target main stylesheet
		.pipe(sourcemaps.init()) // Initialize sourcemaps
		.pipe(sassGlob())
		.on(
			'error',
			notify.onError({
				message: 'Error: <%= error.message %>',
				title: 'Error running sass/sassGlob task',
			}),
		)
		.pipe(
			sass({
				includePaths: ['node_modules'],
			}),
		)
		.on(
			'error',
			notify.onError({
				message: 'Error: <%= error.message %>',
				title: 'Error running sass/include task',
			}),
		)
		.pipe(autoprefixer({ // Add vendor prefixes
			cascade: false
		}))
		.pipe(cleanCSS({ // Minify CSS
			compatibility: 'ie8'
		}))
		.pipe(sourcemaps.write('.')) // Write sourcemaps
		.pipe(include())
		.on(
			'error',
			notify.onError({
				message: 'Error: <%= error.message %>',
				title: 'Error running sass/include task',
			}),
		)
		.pipe(postcss())
		.on(
			'error',
			notify.onError({
				message: 'Error: <%= error.message %>',
				title: 'Error running sass/postcss task',
			}),
		)
		.on(
			'error',
			notify.onError({
				message: 'Error: CSS Min',
				title: 'Error running sass/cleanCSS task',
			}),
		);

	assetDistributionDirectories.forEach(function (assetsDistributionDirectory) {
		stream = stream.pipe(gulp.dest(assetsDistributionDirectory + PATHS.styles));
	});

	return stream;
}

function getStylesTask() {
	return styles;
}

// Rest of the code remains the same...

function watchAssets () {
	gulp.watch(PATHS.source + PATHS.assets + PATHS.styles + '**/*.scss', stylesTasks);
	gulp.watch(PATHS.source + PATHS.assets + PATHS.scripts, scripts);
	// gulp.watch(PATHS.source + PATHS.assets + PATHS.images, images); // Commented out as 'images' is not defined
	gulp.watch(PATHS.source + PATHS.assets + PATHS.icons, gulp.parallel(iconsInline));
	gulp.watch(
		[PATHS.source + '**/*.html', PATHS.source + '**/*.php', '!' + PATHS.source + PATHS.assets + '**/*'],
		html,
	);
	gulp.watch(getFullCopiedAssetDirectories(), copy);
}

// Rest of the code remains the same...

const stylesTasks = getStylesTask();

const icons = gulp.parallel(iconsInline);

const build = gulp.series(
	gulp.parallel(iconsInline),
	gulp.parallel(scripts, stylesTasks, /* images, */ html), // Commented out as 'images' is not defined
);

export { icons, stylesTasks as styles, /* images, */ watchAssets as watch, build }; // Commented out as 'images' is not defined
export default build;
