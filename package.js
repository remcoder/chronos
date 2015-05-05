Package.describe({
  name: 'remcoder:chronos',
  summary: 'A reactive timer and wrapper for momentjs to write time-dependent updates in a Meteoric way. ',
  version: '0.2.4',
  git: 'https://github.com/remcoder/chronos'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('reactive-var');
  api.export('Chronos');
  api.addFiles('remcoder:chronos.js');
});
  
Package.onTest(function(api) {
  api.use('tinytest');
  api.use('reactive-var');
  api.export('Chronos');
  api.addFiles('bind-polyfill.js');
  api.addFiles('remcoder:chronos.js');
  api.addFiles('unittests.js');
});
