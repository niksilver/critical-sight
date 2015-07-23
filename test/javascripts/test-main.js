// See http://karma-runner.github.io/0.13/plus/requirejs.html
// for details of how to set this up, as well as
// https://github.com/kjbekkelund/karma-requirejs
// for a complete, small, working system.
//
var TEST_REGEXP = /DemoTest.js$/i;
var allTestFiles = [];

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
	allTestFiles.push(file);
  }
});

require.config({
  // Karma serves files under /base,
  // which is the basePath from your config file
  baseUrl: '/base/public/javascripts',

  // example of using a path translations (paths), to allow us to refer
  // to different library dependencies, without using relative paths
  paths: {
    'jquery': '../lib/jquery',
  },

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});

