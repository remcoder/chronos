Tinytest.add('test timer creation', function(test) {
  var timer = new Chronos.Timer();
  test.instanceOf(timer, Chronos.Timer);
});

Tinytest.add('timer shouldn\'t start immediately', function(test) {
  var timer = new Chronos.Timer();
  test.isUndefined(timer._timer, 'timer._timer should not be set ');
});

Tinytest.addAsync('getting the time should trigger reactive updates', function(test, next) {
  var timer = new Chronos.Timer();
  
  var count = 0;
  Tracker.autorun(Meteor.bindEnvironment(function(c) {
    timer.time.get();
    count++;
    if (count > 1) {
      next();
      c.stop();
    }
  }));

  timer.start();

});

Tinytest.addAsync('liveUpdate should trigger reactive updates', function(test, next) {
  
  var count = 0;
  Tracker.autorun(Meteor.bindEnvironment(function(c) {
    Chronos.liveUpdate();

    count++;
    if (count > 1) {
      next();
      c.stop();
    }
  }));

});
