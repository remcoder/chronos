Tinytest.add('test timer creation', function(test) {
  var timer = new Chronos.Timer();
  test.instanceOf(timer, Chronos.Timer);
});

Tinytest.add('timer shouldn\'t start immediately', function(test) {
  var timer = new Chronos.Timer();
  test.isUndefined(timer._timer, 'timer._timer should not be set ');
});

Tinytest.add('timer should have handle when started', function(test) {
  var timer = new Chronos.Timer();
  timer.start();
  test.isTrue( !!timer._timer );
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

    var timer = Chronos.liveUpdate(10);

    if (count == 1) {
      timer.destroy();

      test.equal( Object.keys(Chronos.timers).length, 0, 'there should be no more timers now' );

    }

    if (count == 2) 
      test.fail();

    count++;

  }));

  Meteor.setTimeout(next, 100);
});

Tinytest.add('currentTime should return same time as new Date', function(test) {
  var normalTime, reactiveTime;

  Tracker.autorun(function(c) {

    normalTime = new Date();
    reactiveTime = Chronos.currentTime();

    c.stop();
  });

  test.isTrue( (reactiveTime - normalTime)  <= 1), 'there shouldn\'t be more than a milisecond difference';
});

Tinytest.add('currentTime should return a Date object', function(test) {
  var reactiveTime = Chronos.currentTime();
  test.instanceOf(reactiveTime, Date);
});

Tinytest.addAsync('currentTime should trigger reactive updates', function(test, next) {

  var count = 0;
  Tracker.autorun(Meteor.bindEnvironment(function(c) {
    Chronos.currentTime(10);

    count++;
    if (count > 1) {
      c.stop();
      next();
    }
  }));

});

Tinytest.addAsync('liveUpdate timer should be destroyed when computation is stopped', function(test, next) {
  var count = 0;
  Chronos.timers = {};

  Tracker.autorun(Meteor.bindEnvironment(function(c) {

    Chronos.liveUpdate(10);

    if (count == 1)
      test.fail();


    if (count == 0)
      c.stop();

    count++;

  }));

  Meteor.setTimeout(next, 100);
});


Tinytest.addAsync('currentTime timer should be destroyed when computation is stopped', function(test, next) {
  var count = 0;
  Chronos.timers = {};

  Tracker.autorun(Meteor.bindEnvironment(function(c) {

    Chronos.currentTime(10);

    if (count == 1) {
      c.stop();
      next();
    }

    if (count == 2)
      test.fail();

    count++;

  }));

});
