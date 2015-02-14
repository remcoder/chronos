var _timers = {};

function Timer(interval) {
  this.interval = interval || 1000;
  this.time = new ReactiveVar(0);

  this.start();
}

Timer.prototype.start = function() {
  this.time.set(new Date());

  this._timer = Meteor.setInterval(function() {
    this.time.set(new Date());
  }.bind(this), this.interval);
};

Timer.prototype.stop = function() {
  Meteor.clearInterval(this._timer);
  this._timer = null;
};

function liveUpdate(interval) {
  // get current reactive context
  var ctx = Tracker.currentComputation && Tracker.currentComputation._id;
  if (!ctx)
    throw new Error('liveUpdate should be called from inside a reactive context.');

  if (!_timers[ctx])
    _timers[ctx] = new Timer(interval);

  _timers[ctx].time.get(); // attach to reactive context and return current time
}

// wrapper for moment.js
function liveMoment(/* arguments */) {
  // only reactively re-run liveMoment when moment is available
  if (!moment) return;
  
  liveUpdate();
  return moment.apply(null, arguments);
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
  liveMoment: liveMoment
};
