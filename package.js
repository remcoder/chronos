Package.describe({
  name: 'remcoder:live-timer',
  summary: 'A reactive timer',
  version: '0.1.0',
  git: 'git@github.com:remcoder/live-timer.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('reactive-var');
  api.export('Live');
  api.addFiles('remcoder:live-timer.js');
});
  
Package.onTest(function(api) {
  // console.warn('no tests implemented yet');
  // api.use('tinytest');
  // api.use('remcoder:live-timer');
  // api.addFiles('remcoder:live-timer-tests.js');
});