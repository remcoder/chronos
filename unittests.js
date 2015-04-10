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
      timer.stop();
      next();
    }
  }));

  timer.start();

});

Tinytest.addAsync('calling the underlying Dependency should trigger reactive updates', function(test, next) {
  var timer = new Chronos.Timer();

  var count = 0;
  Tracker.autorun(Meteor.bindEnvironment(function(c) {
    timer.time.dep.depend();
    count++;
    if (count > 1) {
      timer.stop();
      next();
    }
  }));

  timer.start();

});

Tinytest.addAsync('liveUpdate should trigger reactive updates', function(test, next) {
  
  var count = 0;
  Tracker.autorun(Meteor.bindEnvironment(function(c) {
    var timer = Chronos.liveUpdate(100);

    count++;
    if (count > 1) {
      timer.destroy();
      next();
    }
  }));

});


Tinytest.addAsync('An already started Timer should not be able to start', function(test, next) {

  var count = 0;
  var timer = new Chronos.Timer();
  Tracker.autorun(Meteor.bindEnvironment(function(c) {
    count++;
    if (count == 0) {
      timer.start();
    }

    if (count > 1) {
      test.throws(function() { timer.start(); });
      timer.stop();
    }

    // get the time to trigger reactivity
    timer.time.get();
    next();
  }));

});

Tinytest.addAsync('a liveUpdate timer should be destroyable', function(test, next) {
  var count = 0;
  Chronos.timers = {};

  Tracker.autorun(Meteor.bindEnvironment(function(c) {

    var timer = Chronos.liveUpdate(100);


    if (count == 1) {
      timer.destroy();

      test.equal( Object.keys(Chronos.timers).length, 0, 'there should be no more timers now' );

      // give it some time
      Meteor.setTimeout(next, 200);
    }

    if (count == 2) 
      test.fail();

    count++;

  }));

});
