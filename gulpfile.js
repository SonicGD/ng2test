var gulp = require('gulp');

var PATHS = {
    src: 'src/**/*.ts',
    ngTypings: 'typings/angular2/*.d.ts',
    momentTypings: 'typings/moment/*.d.ts'
};

gulp.task('clean', function (done) {
    var del = require('del');
    del(['dist'], done);
});

gulp.task('ts2js', function () {
    var typescript = require('gulp-typescript');
    var tsResult = gulp.src([PATHS.src, PATHS.ngTypings, PATHS.momentTypings])
        .pipe(typescript({
            module: 'system',
            target: 'ES5',
            "emitDecoratorMetadata": true,
            "experimentalDecorators": true,
            "declaration": false,
            "noImplicitAny": false,
            "removeComments": true,
            "noLib": false,
        }));

    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('play', ['ts2js'], function () {
    var http = require('http');
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var open = require('open');

    var port = 9000, app;

    gulp.watch(PATHS.src, ['ts2js']);

    app = connect().use(serveStatic(__dirname));
    http.createServer(app).listen(port, function () {
        open('http://localhost:' + port);
    });
});

