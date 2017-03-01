var es            = require('event-stream');
var _             = require('lodash');
var karma         = require('karma').server;
var inject        = require('gulp-inject');
var gulp          = require('gulp');
var fs            = require('fs');
var del           = require('del');
var runSequence   = require('run-sequence');
var plugins       = require('gulp-load-plugins')();
var sass          = require('gulp-sass');
var open          = require('open');
var watch         = require('gulp-watch');
var watchSequence = require('gulp-watch-sequence');
var minifyCss     = require('gulp-minify-css');
var replace       = require('gulp-replace-task');
var concat        = require('gulp-concat');
var clean         = require('gulp-clean');
var livereload    = require('gulp-livereload');
var vinylPaths    = require('vinyl-paths');

var isRelease,
    args = require('yargs')
             .alias('e', 'env')
             .argv;

var paths = {
  gulpFile:   'gulpfile.js',

  src: {
    assetsFile: 'src/assets.json',
    templates:  ['src/templates/**/**.*'],
    index:      'src/index.html',
    fonts:      'src/fonts/**.*',
    imgs:       'src/img/**/**.*',
    audios:     'src/audio/**/**.*',
    path:       'src/',
    scss:       'src/sass/**/**.scss',
    css:        'src/css/**/**.css',
    js:         'src/js/**/**.js'
  },

  dist: {
    templates:       'www/templates',
    scssFiles:       'www/css/**/**.scss',
    cssFiles:        ['www/css/template.css', 'www/css/application.css'],
    cssFile:         'www/css/application.css',
    jsFiles:         'www/js/**/**.*',
    jsFile:          'www/js/application.js',
    files:           'www/**/**.*',
    fonts:           'www/fonts',
    path:            'www/',
    imgs:            'www/img',
    audios:          'www/audio',
    css:             'www/css',
    js:              'www/js'
  },

  root: '.',

  config: {
    test:        "config/test.json",
    sandbox:     "config/sandbox.json",
    production:  "config/production.json",
    development: "config/development.json"
  }
};

var read = function(path) {
  return fs.readFileSync(path, 'utf8')
};

var parse = function(content) {
  return JSON.parse(content)
};

gulp.task('web:build', function () {
  isRelease = false;
  if (!args.env) {
    args.env = 'development';
  }

  runSequence(
    'clean',

    'moveImgs',
    'moveFonts',

    'moveHTML',

    'sass',
    'moveCSS',

    'clearCSS',

    'moveJS',
    'replaceJS',

    'inject'
  )
});

gulp.task('clean', function() {
  return gulp.src(paths.dist.files).pipe(vinylPaths(del))
});

/*
 * IMAGES
 */

gulp.task('moveImgs', function() {
  return gulp.src(paths.src.imgs)
             .pipe(gulp.dest(paths.dist.imgs))
});

/*
 * FONTS
 */

gulp.task('moveFonts', function() {
  var assetsFonts = parse(read(paths.src.assetsFile)).fonts;

  var sources  = _.map(assetsFonts, function(asset) {
    return paths.src.path + asset;
  });
  sources.push(paths.src.fonts);
  return gulp.src(sources)
             .pipe(gulp.dest(paths.dist.fonts))
});


/*
 * STYLESHEETS
 */

gulp.task('sass', function() {
  return gulp.src(paths.src.scss)
             .pipe(sass({
               includePaths: ['src/lib']
             }))
             .pipe(gulp.dest(paths.dist.css));
});

gulp.task('moveCSS', function() {
  var assetsCSS = parse(read(paths.src.assetsFile)).css;
  var sourcesCSS = _.map(assetsCSS, function(asset) {
    return paths.src.path + asset + '.css'
  });
  return gulp.src(sourcesCSS)
        .pipe(gulp.dest(paths.dist.css))
        .pipe(livereload())
});

gulp.task('moveHTML', function() {
  es.concat(
    gulp.src(paths.src.templates)
        .pipe(gulp.dest(paths.dist.templates))
        .pipe(livereload())
  )
});

gulp.task('clearCSS', function() {
  return gulp.src(paths.dist.scssFiles)
             .pipe(vinylPaths(del))
});

gulp.task('concatCSS', function() {
  return gulp.src(paths.dist.cssFiles)
             .pipe(concat('application.css'))
             .pipe(gulp.dest(paths.dist.css))
});

gulp.task('minifyCSS', function() {
  return gulp.src(paths.dist.cssFiles)
             .pipe(cssmin())
             .pipe(gulp.dest(paths.dist.css))
});

/*
 * JAVASCRIPTS
 */

gulp.task('moveJS', function() {
  var assetsJS = parse(read(paths.src.assetsFile)).js;

  var sources  = _.map(assetsJS, function(asset) {
    return paths.src.path + asset + '.js'
  });

  return gulp.src(sources)
             .pipe(gulp.dest(paths.dist.js))
             .pipe(livereload())
});

gulp.task('moveAndConcatJS', function() {
  var assetsJS = parse(read(paths.src.assetsFile)).js;

  var sources  = _.map(assetsJS, function(asset) {
    return paths.src.path + asset + '.js'
  });

  return gulp.src(sources)
             .pipe(concat('application.js'))
             .pipe(gulp.dest(paths.dist.js))
});

gulp.task('minifyJS', function() {
  return gulp.src(paths.dist.jsFiles)
             .pipe(minifyJS({ mangle: false }))
             .pipe(gulp.dest(paths.dist.js))
});

gulp.task('replaceJS', function() {
  var configs = parse(read(paths.config[args.env]));

  var patterns = _.map(configs, function(value, key) {
    return { match: key, replacement: value }
  });

  return gulp.src(paths.dist.jsFiles)
             .pipe(replace({ patterns: patterns }))
             .pipe(gulp.dest(paths.dist.js))
});

gulp.task('inject', function() {
  var assets = parse(read(paths.src.assetsFile));
  var sourcesCss = _.map(assets.css, function(asset) {
    return paths.dist.css + '/' + _.last(asset.split('/')) + '.css'
  });
  _.forEach(paths.dist.cssFiles, function(cssFile) {
    sourcesCss.push(cssFile);
  });
  if (isRelease) {
    var srcOptions    = { read: false };
    var injectOptions = { ignorePath: paths.dist.path, addRootSlash: false };

    return gulp.src(paths.src.index)
               .pipe(inject(gulp.src(paths.dist.jsFile,  srcOptions), injectOptions))
               .pipe(inject(gulp.src(sourcesCss, srcOptions), injectOptions))
               .pipe(gulp.dest(paths.dist.path))
  }
  else {
    var sourcesJS = _.map(assets.js, function(asset) {
      return paths.dist.js + '/' + _.last(asset.split('/')) + '.js'
    });

    srcOptions    = { base: paths.dist, read: false };
    injectOptions = { ignorePath: paths.dist.path, addRootSlash: false };

    return gulp.src(paths.src.index)
               .pipe(inject(gulp.src(sourcesJS,  srcOptions), injectOptions))
               .pipe(inject(gulp.src(sourcesCss, srcOptions), injectOptions))
               .pipe(gulp.dest(paths.dist.path))
  }
});

gulp.task('watch', function() {
  if (!args.env) {
    args.env = 'development';
  }

  // FONTS
  gulp.watch(paths.src.fonts, function() {
    gulp.start('moveFonts')
  });

  // IMGS
  gulp.watch(paths.src.imgs, function() {
    gulp.start('moveImgs')
  });

  // STYLE
  gulp.watch(paths.src.scss, function() {
    gulp.start('sass')
  });

  gulp.watch(paths.src.assetsFile, function() {
    gulp.start('moveCSS')
  });

  // JS
  var jsSources = [
    paths.src.js,
    paths.src.assetsFile
  ];

  var queue = watchSequence(300);

  watch(
    jsSources,
    { name: 'JS', emitOnGlob: false },
    queue.getHandler('moveJS', 'replaceJS', 'inject')
  );

  // HTML
  var htmlSources = [
    paths.src.index,
    paths.src.templates
  ];

  gulp.watch(htmlSources, function() {
    gulp.start('inject');
    gulp.start('moveHTML')
  });

  // INJECT
  var injectSources = [
    paths.src.assetsFile,
    paths.src.index
  ];

  gulp.watch(injectSources, function() {
    gulp.start('inject')
  })
});

/*
 * TESTS
 */

gulp.task('test:unit', function (done) {
  karma.start({
    singleRun: true,
    configFile: __dirname + '/spec/karma.conf.js'
  }, function () {
    done();
    process.exit(0)
  })
});