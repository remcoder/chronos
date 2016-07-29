Package.describe({
  name: 'remcoder:chronos',
  summary: 'Reactive time utilities. Includes reactive replacements for new Date(), Date.now() and moment()',
  version: '0.5.0',
  git: 'https://github.com/remcoder/chronos'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use('tracker');
  api.use('reactive-var');
  api.use('tracker');
  api.use('zodiase:function-bind@0.0.1');
  Npm.depends({
    moment: '2.13.0'
  });
  api.export('Chronos');
  api.addFiles('chronos.js');
});
  
Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tracker');
  Npm.depends({
    moment: '2.13.0'
  });
  api.use('remcoder:chronos');
  api.use('practicalmeteor:mocha');
  api.use('practicalmeteor:chai');

  api.mainModule('unittests.js');
});
