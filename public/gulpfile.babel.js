// gulpfile.js
import gulp         from 'gulp';
import notify       from 'gulp-notify';
import minifycss    from 'gulp-minify-css'; // deprecated- use cssnano
import babel        from 'gulp-babel';
import sass         from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import rename       from 'gulp-rename';
import cssnano      from 'gulp-cssnano';
import concat       from 'gulp-concat';
import babelify     from 'babelify';
import browserify   from 'browserify';
import source       from 'vinyl-source-stream';
import webserver 	from 'gulp-webserver';
import reactify		from 'reactify';
import imagemin     from 'gulp-imagemin'; // Minify images seamlessly
import progress     from 'progress-stream';

const paths = {
    src: {
        sass: './src/scss/*.*',  //ruta para archivos sass
        js    : './src/**/*.jsx', //ruta para archivos javascript
        images: './src/images/*' // ruta para imagenes
    },
    build: {
        css    	: './build/css', // ruta proyecto producción css
        js    	: './build/js/', // ruta proyecto producción javascript
        images 	: './build/images' // ruta proyecto producción imagenes
    }
}


/**********************************************************/
/*				TASK CREATE SERVER  					***/
/**********************************************************/
gulp.task('server', ['build'],() => {
  gulp.src('./build')
    .pipe(webserver({
      host: '0.0.0.0',
      port: 8080,
      fallback: 'index.html',
      livereload: true
    }))
    .pipe(notify({ message: 'Server created in localhost:8080!!' }));
})

/**********************************************************/
/*				TASK BUILD PROYECTO 					***/
/**********************************************************/
gulp.task('build', ['styles'],() => {
    browserify({
        entries: ['src/index.jsx'],
        extensions: ['jsx', 'js'],
        debug: true
    })
    .transform(babelify, {presets: "react"})
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest(paths.build.js))
    .pipe(notify({ message: 'All js completed. Project load in build folder!!' }));
});


/**********************************************************/
/*				TASK CSS - SASS							***/
/**********************************************************/
gulp.task('styles', () => {
    gulp.src(paths.src.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(concat('main.css'))
        .pipe(rename({suffix: '.min'})) // agregamos el prefijo min para los archivos minimizados
        .pipe(cssnano())  // minimizamos el css
        .pipe(gulp.dest(paths.build.css))  // ruta destino del archivo minimizado
        .pipe(notify({ message: 'Tasks Styles completed!!' }));
});

/**********************************************************/
/*				TASK WATCH  							***/
/**********************************************************/
gulp.task('watch', () => {
  gulp.watch(['./src/**/*.jsx', './src/scss/**/*.scss'], ['build']);
})

/**********************************************************/
/*				TASK DEFAULT							***/
/**********************************************************/
gulp.task('default', ['server', 'watch'])
