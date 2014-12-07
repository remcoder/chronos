Package.describe({
  name: 'remcoder:chronos',
  summary: 'A reactive timer and wrapper for momentjs to write time-dependent updates in a Meteoric way. ',
  version: '0.1.3',
  git: 'https://github.com/remcoder/chronos'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('reactive-var');
  api.export('Chronos');
  api.addFiles('remcoder:chronos.js');
});
  
Package.onTest(function(api) {
  // console.warn('no tests implemented yet');
  // api.use('tinytest');
  // api.use('remcoder:live-timer');
  // api.addFiles('remcoder:live-timer-tests.js');
});
