var TEST_REGEXP = /DemoTest.js$/i;
var allTestFiles = [];

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
  console.log("Got " + file);
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    // var normalizedTestModule = file.replace(/^\/base\/test\/javascripts\/|\.js$/g, '');
    // allTestFiles.push(normalizedTestModule);
	allTestFiles.push(file);
	console.log("Pushed " + file);
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/public/javascripts',

  // example of using a couple path translations (paths), to allow us to refer to different library dependencies, without using relative paths
  paths: {
    'jquery': '../lib/jquery',
    'underscore': '../lib/underscore'
  },

  // example of using a shim, to load non AMD libraries (such as underscore)
  shim: {
    'underscore': {
      exports: '_'
    }
  },

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});

