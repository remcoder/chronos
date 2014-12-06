// Write your package code here!

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

var timers = {};

// export as global
this.Live = {
  Timer : Timer,

  update : function(interval) {
    // get reactive context
    var ctx = Tracker.currentComputation && Tracker.currentComputation._id;
    if (!ctx)
      throw new Error('Live.update should be called from inside a reactive context.');

    if (!timers[ctx])
      timers[ctx] = new Live.Timer(interval);

    timers[ctx].time.get(); // attach to reactive context and return current time
  },

  // wrap moment.js
  moment: function() {
    Live.update();
    if (moment)
      return moment.apply(null, arguments);
  }
};
