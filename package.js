Package.describe({
  name: 'remcoder:chronos',
  summary: 'Reactive time utilities. Includes reactive replacements for new Date() and moment()',
  version: '0.3.1',
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
