'use strict';

var gulp = require('gulp');
var server = require('browser-sync').create();

gulp.task('server', function () {
  server.init({ // запускает локальный сервер
    server: './', // путь к источникам
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('*.html', gulp.series('refresh'));
  gulp.watch('js/*.js', gulp.series('refresh'));
});

gulp.task('refresh', function (done) {
  server.reload();
  done();
});

gulp.task('start', gulp.series('server'));
