var gulp = require('gulp'),
	sequence = require('gulp-sequence'),
	rename = require('gulp-rename'),
	typescript = require('gulp-typescript'),
	uglify = require('gulp-uglify');
	
gulp.task('default', sequence('compile', 'minify'));
	
gulp.task('compile', function() {
	return gulp
		.src('./jquery.equal-height.ts')
		.pipe(typescript())
		.pipe(gulp.dest('./'));
});

gulp.task('minify', function() {
	return gulp
		.src('./jquery.equal-height.js')
		.pipe(uglify({
			preserveComments: 'license'
		}))
		.pipe(rename('jquery.equal-height.min.js'))
		.pipe(gulp.dest('./'));
});