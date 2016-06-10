import { chai } from 'meteor/practicalmeteor:chai';

const moment = require('moment');

describe('timer creation I', function () {
  it('invoking the constructor of Chronos.Timer should result in an instance of Chronos.Timer', function () {
    var timer = new Chronos.Timer();
    chai.assert.instanceOf(timer, Chronos.Timer);
  })
});

describe('timer creation II', function () {
  it('timer shouldn\'t start immediately', function() {
    var timer = new Chronos.Timer();
    chai.assert.isUndefined(timer._timer, 'timer._timer should not be set ');
  });
});

describe('timer start', function () {
  it('timer should have handle when started', function() {
    var timer = new Chronos.Timer();
    timer.start();
    chai.assert.isTrue( !!timer._timer );
  })
});


describe('reactive updates I',function() {

  let count;
  before(function(done) {
    var timer = new Chronos.Timer();

    count = 0;
    Tracker.autorun(Meteor.bindEnvironment(function (c) {
      timer.time.get();
      count++;
      if (count > 1) {
        timer.stop();
        done();
      }
    }));

    timer.start();
  });

  it('getting the time should trigger reactive updates', function() {
    chai.assert(count>1);
  });
});

describe('reactive updates II',function() {
  let count;

  before(function(done) {
    var timer = new Chronos.Timer();

    count = 0;
    Tracker.autorun(Meteor.bindEnvironment(function (c) {
      timer.time.dep.depend();
      count++;
      if (count > 1) {
        timer.stop();
        done();
      }
    }));

    timer.start();

  });

  it('calling the underlying Dependency should trigger reactive updates', function () {
    chai.assert(count>1);
  });

});

describe('Chronos.update', function() {
  let count;

  before(function(done) {

    count = 0;
    Tracker.autorun(Meteor.bindEnvironment(function(c) {
      var timer = Chronos.update(100);

      count++;
      if (count > 1) {
        timer.destroy();
        done();
      }
    }));
  });

  it('Chronos.update should trigger reactive updates', function() {
    chai.assert(count>1);
  });
});

describe('Backwards compatibility I', function() {
  let count;

  before(function(done) {

    count = 0;
    Tracker.autorun(Meteor.bindEnvironment(function(c) {
      var timer = Chronos.liveUpdate(100);

      count++;
      if (count > 1) {
        timer.destroy();
        done();
      }
    }));
  });

  it('Chronos.liveUpdate should trigger reactive updates', function() {
    chai.assert(count>1);
  });
});

describe('Timer start II', function() {

  it('An already started Timer should not be able to start', function() {
    var timer = new Chronos.Timer();
    timer.start();
    chai.assert.throws(function () {
      timer.start();
    });
  });
});

describe('Destroying a timer', function() {
  var count = 0;
  before(function(done) {

    Tracker.autorun(Meteor.bindEnvironment(function(c) {

      var timer = Chronos.update(10);

      if (count == 1) {
        timer.destroy();
      }

      count++;

    }));

    Meteor.setTimeout(done, 100);
  });

  it('A Chronos.update timer should be destroyable', function() {

    chai.assert.equal( Object.keys(Chronos._timers).length, 0, 'there should be no more timers now' );

    chai.assert.equal( count, 2 );
  });
});


describe('Chronos.date', function () {

  it('Chronos.date should return a Date object', function() {
    var reactiveTime = Chronos.date();
    chai.assert.instanceOf(reactiveTime, Date);
  });
});

describe('Chronos.date II', function() {

  it('Chronos.date should return same time as new Date()', function() {
    var normalTime, reactiveTime;

    Tracker.autorun(function(c) {

      normalTime = new Date().getTime();
      reactiveTime = Chronos.date().getTime();

      c.stop();
    });

    chai.assert.closeTo( reactiveTime, normalTime, 2), 'there shouldn\'t be more than a millisecond difference';
  });
});

describe('Chronos.date reactivity', function() {

  let count = 0;
  before(function(done) {


    Tracker.autorun(Meteor.bindEnvironment(function(c) {
      Chronos.date(10);

      count++;
      if (count == 2) {
        c.stop();
        done();
      }
    }));

  });

  it('Chronos.date should trigger reactive updates', function() {
    chai.assert.equal(count, 2);
  });
});

describe('Chronos.now', function () {

  it('Chronos.now should return a Number ', function() {
    var reactiveTime = Chronos.now();
    chai.assert.isNumber(reactiveTime, Date);
  });
});

describe('Chronos.now II', function() {

  it('Chronos.now should return same time as Date.now()', function() {
    var normalTime, reactiveTime;

    Tracker.autorun(function(c) {

      normalTime = Date.now();
      reactiveTime = Chronos.now();

      c.stop();
    });

    chai.assert.closeTo( reactiveTime, normalTime, 2), 'there shouldn\'t be more than a millisecond difference';
  });
});

describe('Chronos.now reactivity', function() {

  let count = 0;
  before(function(done) {


    Tracker.autorun(Meteor.bindEnvironment(function(c) {
      Chronos.now(10);

      count++;
      if (count == 2) {
        c.stop();
        done();
      }
    }));

  });

  it('Chronos.now should trigger reactive updates', function() {
    chai.assert.equal(count, 2);
  });
});

describe('Stopping the computation', function() {

  let count = 0;

  before(function (done) {

    Tracker.autorun(Meteor.bindEnvironment(function(c) {

      Chronos.update(100);

      if (count > 0)
        c.stop();

      count++;

    }));

    Meteor.setTimeout(done, 400);

  });

  it('Chronos.update timer should be destroyed when computation is stopped', function() {
    chai.assert.equal(count, 2);
  });
});


describe('Stopping the computation II', function() {

  let count = 0;

  before(function (done) {

    Tracker.autorun(Meteor.bindEnvironment(function(c) {

      Chronos.date(100);

      if (count > 0)
        c.stop();

      count++;

    }));

    Meteor.setTimeout(done, 400);

  });

  it('Chronos.date timer should be destroyed when computation is stopped', function() {
    chai.assert.equal(count, 2);
  });
});


describe('Chronos.moment', function () {
  it('Chronos.moment should return a moment instance', function() {
    var reactiveMoment = Chronos.moment();
    // chai.assert.instanceOf(reactiveMoment, moment().constructor);
  });
});
