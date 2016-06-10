var _timers = {};
let moment;

// if moment is not installed, fine. We don't require it as a hard dependency
try {
   moment = require('moment');
}
catch(e) {
}

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

function liveUpdate(interval) {
  // get current reactive context
  var comp = Tracker.currentComputation;
  if (!comp)
    return; // no nothing when used outside a reactive context

  // only create one timer per reactive context to prevent stacking of timers
  var cid =  comp && comp._id;
  if (!_timers[cid]) {
    var timer = new Timer(interval);
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

// wrapper for moment.js
function liveMoment(/* arguments */) {
  // only reactively re-run liveMoment when moment is available
  if (!moment) return;
  
  liveUpdate();
  return moment.apply(null, arguments);
}

function currentTime(interval) {
  liveUpdate(interval);
  return new Date();
}

// export global
Chronos = {

  // a simple reactive timer
  // usage: var timer = new Timer();
  // get current time: timer.time.get();
  Timer : Timer,

  // handy util func for making reactive contexts live updating in time
  // usage: simply call Chronos.liveUpdate() in your helper to make it execute 
  // every interval
  liveUpdate : liveUpdate,
  
  // wrapper for moment.js
  // example usage: Chronos.liveMoment(someTimestamp).fromNow();
  liveMoment: liveMoment,

  // get the current time, reactively
  currentTime: currentTime,

  // for debugging and testing
  _timers : _timers
};
