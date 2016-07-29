let moment;

// if moment is not installed, fine. We don't require it as a hard dependency
try {
   moment = require('moment');
}
catch(e) {
}

const _timers = {};

function Timer(interval) {
  this.interval = interval || 1000;
  this.time = new ReactiveVar(0);  
}

Timer.prototype.start = function() {
  if (this._timer) throw new Error('Trying to start Chronos.Timer but it is already running.');
  this.time.set(new Date());


  this._timer = setInterval(Meteor.bindEnvironment(function() {
    //console.log('tick', this._timer);
    this.time.set(new Date());

  }.bind(this)), this.interval);
};

Timer.prototype.stop = function() {
  //console.log('stopping timer');
  clearInterval(this._timer);
  this._timer = null;
};

function _update(interval) {
  // get current reactive context
  const comp = Tracker.currentComputation;
  if (!comp)
    return; // no nothing when used outside a reactive context

  // only create one timer per reactive context to prevent stacking of timers
  const cid =  comp && comp._id;
  if (!_timers[cid]) {
    const timer = new Timer(interval);
    _timers[cid] = timer;

    // add destroy method that stops the timer and removes itself from the list
    timer.destroy = function() {
      timer.stop();
      delete _timers[cid];
    };

    timer.start();
  }

  // make sure to stop and delete the attached timer when the computation is stopped
  comp.onInvalidate(function() {
    //console.log('onInvalidated',comp);
    if (comp.stopped && _timers[cid]) {
      //console.log('computation stopped');
      _timers[cid].destroy();
    }
  });

  _timers[cid].time.dep.depend(comp); // make dependent on time

  //console.log(_timers);
  return _timers[cid];
}

// reactive version of moment()
// please install moment separately
// example usage: Chronos.moment(someTimestamp).format('ss');
function _moment(/* arguments */) {
  if (!moment) throw new Error('moment not found. Please install it first');
  
  _update();
  return moment.apply(null, arguments);
}

// reactive version of new Date() get the current date/time
function _date(interval) {
  _update(interval);
  return new Date();
}

// reactive version of Date.now(). get the current # of milliseconds since the start of the epoch
function _now(interval) {
  _update(interval);
  return Date.now();
}

// export global
Chronos = {

  // a simple reactive timer
  // usage: var timer = new Timer();
  // get current time: timer.time.get();
  Timer,

  // handy util func for making reactive contexts live updating in time
  // usage: simply call Chronos.update() in your helper to make it execute
  // every interval
  update: _update,

  // reactive version of new Date() get the current date/time
  date : _date,

  // reactive version of Date.now(). get the current # of milliseconds since the start of the epoch
  now : _now,

  // reactive version of moment()
  // please install moment separately
  // example usage: Chronos.moment(someTimestamp).format('ss');
  moment : _moment,

  // for debugging and testing
  _timers,

  // deprecated. but kept for backwards compatibility
  liveUpdate : _update,
  currentTime : _date,
  liveMoment : _moment
};