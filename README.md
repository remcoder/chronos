# Chronos

_v0.2.0 update: Instantiating a Chronos.Timer will not start the timer immediately anymore. You will have to call timer.start() to do that._

### API overview

 * __Chronos.Timer__ - a simple reactive timer
 * __Chronos.liveUpdate__ - make helpers live updating triggered by a timer
 * __Chronos.liveMoment__ - wrapper for moment.js to create live updating timestamps etc
 
## Chronos.Timer
usage:

	// create new timer. defaults to an interval of 1000ms
	var timer = new Chronos.Timer(interval);
	
The timer exposes the `time` property, which is a `ReactiveVar`.
Getting the time value is reactive so its context will re-run on every
update of the timer.

	timer.time.get();

Example: 	

	// prints the current time every 2 seconds
	var timer = new Chronos.Timer(2000);
	
	Tracker.autorun(function() {
		console.log(timer.time.get());
	});
	
	timer.start();

### Chronos.Timer.start
Starts the timer. (Note: as of v0.2.0 the timer doesn't start immediately anymore. You will need to call timer.start() yourself after instantiating a Chronos.Timer.)

Usage:

	timer.start();
	

### Chronos.Timer.stop
Stop the timer.

Usage:

	timer.stop();
	
## Chronos.liveUpdate
When called from inside a Blaze helper or other reactive context, it will setup a timer once and make the context dependent on the timer. What this means is that for example the helper will we re-run every time the timer updates.

Usage:

	// make context live updating. defaults to an interval of 1000m.
	Chronos.liveUpdate(interval);

Example template + helper:
	
	<template name="foo">
		<div>random number: {{randomNumber}}</div>
	</template>
	
	Template.foo.helpers({
    		randomNumber : function() {
    			Chronos.liveUpdate();
        		return Math.round( Math.random() * 10 );
    		}
	});

Example with autorun:

	// this will create counter and logs it every second
	var count = 0;
	
	Tracker.autorun(function() {
		Chronos.liveUpdate();
		console.log(count);
		count++;
	});
	
_Note: this uses a Chronos.Timer under the hood. This timer is started automatically when you call .liveUpdate_

## Chronos.liveMoment
`Chronos.liveMoment()` is a reactive replacement for the global function `moment()` as provided by moment.js. You'll need to include moment.js yourself (and the reason is that there are [several different versions of momentjs on Atmosphere](https://atmospherejs.com/?q=moment)).

Usage:

	// call with the same params as you would moment()
	Chronos.liveMoment(/* arguments */); 
 
Example template helper:

	var start = new Date();

	Template.foo.helpers({
    		timeSpent : function() {
        		return Chronos.liveMoment(start).fromNow();
    		}
	});

Example with autorun:
	// prints how long ago the timestamp was made, every second
	var timestamp = new Date();
	
	Tracker.autorun(function() {
		console.log(Chronos.liveMoment(timestamp).fromNow());
	});
	
_Note: this uses a Chronos.Timer under the hood. This timer is started automatically when you call .liveMoment_
