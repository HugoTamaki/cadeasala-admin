module.exports = function (config) {
  config.set({
    basePath: './',
    preprocessors: {
      '../src/js/**/*.js': ['coverage'],
      'fixtures/**/*.json': ['json_fixtures']
    },
    files: [
      "../src/lib/lodash/dist/lodash.min.js",
      "../src/lib/moment/min/moment-with-locales.min.js",
      "../src/lib/moment/locale/pt-br.js",

      "../src/lib/jquery/dist/jquery.min.js",
      "../src/lib/bootstrap/dist/js/bootstrap.min.js",
      "../src/lib/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js",
      "../src/lib/remarkable-bootstrap-notify/bootstrap-growl.min.js",

      "../src/lib/angular/angular.min.js",
      "../src/lib/angular-mocks/angular-mocks.js",
      "../src/lib/angular-resource/angular-resource.js",
      "../src/lib/angular-animate/angular-animate.js",
      "../src/lib/angular-ui-router/release/angular-ui-router.min.js",
      "../src/lib/angular-bootstrap/ui-bootstrap.min.js",
      "../src/lib/angular-bootstrap/ui-bootstrap-tpls.min.js",
      "../src/lib/angular-spinner/dist/angular-spinner.min.js",
      "../src/lib/angular-local-storage/dist/angular-local-storage.min.js",
      "../src/lib/angular-eonasdan-datetimepicker/dist/angular-eonasdan-datetimepicker.js",

      '../src/js/**/*.js',
      'phantomjs-fix.js',
      'unit/**/*.js'
    ],
    autoWatch: true,
    frameworks: ['jasmine'],
    browsers: ['PhantomJS'],
    reporters: ['spec'],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-coverage',
      'karma-jasmine',
      'karma-json-fixtures-preprocessor',
      'karma-spec-reporter'
    ],
    jsonFixturesPreprocessor: {
      camelizeFilenames: true
    }
  });
}
