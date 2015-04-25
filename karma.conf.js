// Karma configuration
// Generated on Mon Mar 16 2015 13:04:00 GMT+0000 (GMT Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-jshint-preprocessor',
      'karma-mocha-reporter'
    ],


    // list of files / patterns to load in the browser
    // It's important to put these in dependency order
    files: [
      'public/javascripts/CriticalSight.js',
      'public/javascripts/**/*.js',
      'public/lib/**/*.js',
      'test/javascripts/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'public/javascripts/**/*.js': ['jshint'],
      'test/javascripts/**/*.js': ['jshint']
    },


    // test results reporter to use
    // possible defaul values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    // We're using karmer-mocha-reporter
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    // logLevel: config.LOG_INFO,
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    
    // Specific options for jshint. See
    // http://jshint.com/docs/options/
    
    jshint: {
    	strict: true
    }
    
  });
};
