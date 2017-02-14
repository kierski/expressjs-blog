// require modules
const gulp = require('gulp');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const runSequence = require('run-sequence');
const sourcemaps = require('gulp-sourcemaps');
const filter = require('gulp-filter');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const markdownToJSON = require('gulp-markdown-to-json');
const marked = require('marked');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const gutil = require('gulp-util');

// build vendor
gulp.task('vendor', () => {
	gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map']).pipe(gulp.dest('app/src/vendor/bootstrap'));
	gulp.src(['node_modules/bootstrap/dist/**/*.css', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map']).pipe(rename({
			prefix: "_",
			extname: ".scss"
		}))
		.pipe(gulp.dest('app/src/vendor/bootstrap'));
	gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
		.pipe(gulp.dest('app/src/vendor/jquery'));
	gulp.src([
              'node_modules/clean-blog/**/*.html',
              '!node_modules/clean-blog/gulpfile.js',
              '!node_modules/clean-blog/LICENSE',
              '!node_modules/clean-blog/**/*.json',
              '!node_modules/clean-blog/README.md',
              '!node_modules/clean-blog/**/.git/**',
              '!node_modules/clean-blog/**/.*'
          ], {
			dot: true
		})
		.pipe(gulp.dest('app/src/vendor/clean-blog'));
	gulp.src('node_modules/clean-blog/css/**/*.css').pipe(rename({
		prefix: "_",
		extname: ".scss"
	})).pipe(gulp.dest('app/src/vendor/clean-blog/css'));
	gulp.src('node_modules/clean-blog/js/clean-blog.min.js').pipe(gulp.dest('app/src/vendor/clean-blog/js'));
	gulp.src('node_modules/clean-blog/img/**/*').pipe(gulp.dest('app/src/images'));
});

// styles
gulp.task('style', () => {
	return gulp.src('app/src/stylesheets/main.scss')
		.pipe(plumber())
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(sourcemaps.init())
		.pipe(scss.sync())
		.pipe(cleanCSS({
			compatibility: 'ie8'
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('app/public/stylesheets'));
});

// scripts
gulp.task('scripts', () => {
	return gulp.src(['app/src/vendor/jquery/jquery.min.js', 'app/src/vendor/bootstrap/js/bootstrap.min.js', 'app/src/vendor/clean-blog/js/clean-blog.min.js', 'app/src/javascripts/main.js'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('app/public/javascripts'));
});

// imgs
gulp.task('imgs', () => {
	return gulp.src('app/src/images/*', {
			base: 'app/src/images'
		})
		.pipe(imagemin())
		.pipe(gulp.dest('app/public/images'));
});

// gulp posts
marked.setOptions({
	pedantic: true,
	smartypants: true
});

gulp.task('post', () => {
	gulp.src('posts/**/*.md')
		.pipe(gutil.buffer())
		.pipe(markdownToJSON(marked, 'blog.json'))
		.pipe(gulp.dest('app/data'));
});

// gulp watch
gulp.task('posts:watch', () => {
	gulp.watch('posts/**/*.md', ['post']);
});

gulp.task('watch', () => {
	gulp.watch('app/src/stylesheets/**/*.scss', ['style']);
	gulp.watch('app/src/javascripts/**/*.js', ['scripts']);
});

// gulp default
gulp.task('default', ['posts:watch', 'watch']);

// build project
gulp.task('build', (cb) => {
	runSequence('post', 'imgs', 'style', 'scripts', cb);
});
