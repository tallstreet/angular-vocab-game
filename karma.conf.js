'use strict';
// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

// You only need to modify this file if you install a new JavaScript
// library. Just add it to the "files" list in that case.

module.exports = function(config) {
  config.set({

    // Base path, that will be used to resolve files and exclude
    basePath: '',

    // Testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // List of files / patterns to load in the browser
    // ADD YOUR FILE THERE
    files: [
      'public/bower_components/angular/angular.js',
      'public/bower_components/angular-mocks/angular-mocks.js',
      'public/bower_components/angular-resource/angular-resource.js',
      'public/bower_components/angular-route/angular-route.js',
      'public/bower_components/jquery/dist/jquery.js',
      'public/js/**/*.js',
      'test/spec/**/*.js'
    ],

    // List of files / patterns to exclude
    exclude: [],

    // Web server port
    port: 9876,

    // Level of logging
    // Possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // Enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    singleRun: true,

    // Karma reporters
    reporters: ['progress', 'coverage', 'junit'],

    // Source files to be track (i.e. files going into prod)
    // You shouldn't need to touch that
    preprocessors: {
      'app/scripts/**/*.js': ['coverage']
    },

    // Coverage reporter configuration
    // Used to generate the unit test coverage report with Istanbul
    coverageReporter: {
      type: 'html',
      dir: 'test/coverage/'
    },

    // JUnit reporter configuration
    // Used to import test results into Jenkins
    junitReporter: {
      outputFile: 'test/test-results.xml'
    }

  });
};
