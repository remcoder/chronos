# Chronos [![Build Status](https://travis-ci.org/remcoder/chronos.svg?branch=master)](https://travis-ci.org/remcoder/chronos)

For a short introduction, see my [lightning talk at the Meteor Meetup](http://vimeo.com/129601361) in Amsterdam about Chronos.

## Installation

	$ meteor add remcoder:chronos

### API overview

 * __Chronos.currentTime__ - a reactive replacement for `new Date()`
 * __Chronos.liveMoment__ - a reactive replacement for `moment()` 
 * __Chronos.liveUpdate__ - trigger reactive updates with a single call 
 * __Chronos.Timer__ - a simple reactive timer

## `Chronos.currentTime(interval)`
A reactive replacement for `new Date`. It returns a `Date` object and triggers reactive updates.
Optionally pass an `interval` in milliseconds. The default is 1000ms (1 second).

Usage:

	<template name="foo">
	   current time: {{currentTime}}
	</template>

	Template.foo.helpers({
	   currentTime : function() {
	       return Chronos.currentTime(); // updates every second
	   }
	});
	
## `Chronos.liveMoment(args...)`
A reactive replacement for the global function `moment()` as provided by [moment.js](http://momentjs.com/). This reactive version will trigger live updates, for live timestamps and such.
 You'll need to include moment.js yourself (and the reason is that there are [several different versions of momentjs on Atmosphere](https://atmospherejs.com/?q=moment)).

Usage:

	// call with the same params as moment()
	Chronos.liveMoment(/* arguments */); 
 
Example template + helper:

	<template name="foo">
    		<div>time spent: {{timeSpent}}</div>
	</template>

	var start = new Date();

	Template.foo.helpers({
    		timeSpent : function() {
        		return Chronos.liveMoment(start).fromNow();
    		}
	});

Example with autorun:

	var timestamp = new Date();
	
	Tracker.autorun(function() {
		// prints how long ago the timestamp was made, every second
		console.log(Chronos.liveMoment(timestamp).fromNow());
	});
	
_Note: this uses a `Chronos.Timer` under the hood. This timer is started automatically when you call `.liveMoment`_

## `Chronos.liveUpdate(interval)`
When called from inside a Blaze helper or other reactive context, it will setup a timer once and make the context dependent on the timer. What this means is that for example the helper will we re-run every time the timer updates.

Usage:

	// make context live updating. defaults to an interval of 1000m.
	Chronos.liveUpdate(interval);

_It returns the `Chronos.Timer` that drives the updates._
	
Example template + helper:
	
	<template name="foo">
		<div>random number: {{randomNumber}}</div>
	</template>
	
	Template.foo.helpers({
	
		// returns a random number between 0 and 10, every second
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
	
_Note: this uses a `Chronos.Timer` under the hood. This timer is started automatically when you call `.liveUpdate`_


 
## `Chronos.Timer()`
usage:

	// create new timer. defaults to an interval of 1000ms
	var timer = new Chronos.Timer(interval);
	
The timer exposes the `time` property, which is a [ReactiveVar](http://docs.meteor.com/#/full/reactivevar) and it holds the current time.
Getting the time value is reactive so it will trigger re-runs whenever the timer produces an update.

	timer.time.get();

Example template + helper:
	
	<template name="timer">
  		<div class="timer">{{time}}</div>
	</template>
	
	var timer = new Chronos.Timer(100);

	Template.timer.helpers({
		
		// counts from 0 to 10 in 10 seconds
  		time: function () {
    			return ((timer.time.get() // get the current time
    				/ 1000) 	  // convert ms to seconds
    				% 10)		  // reset every 10 seconds
    				.toFixed(0);	  // drop any decimals
 		}	
 	});

[See it in action](http://meteorpad.com/pad/3KRq7khsXWYmDkDK4/Chronos.Timer)

Example with autorun: 	

	// prints the current time every 2 seconds
	var timer = new Chronos.Timer(2000);
	
	Tracker.autorun(function() {
		console.log(timer.time.get());
	});
	
	timer.start();

### `Chronos.Timer.start()`
Starts the timer (by kicking off a setInterval loop). 

Usage:

	timer.start();
	

### `Chronos.Timer.stop()`
Stops the timer.

Usage:

	timer.stop();
	
## Changelog

 - 0.3.1
 	 - fixed a bug where `destroy()` would sometimes be called twice, resulting in a TypeError ([#7](https://github.com/remcoder/chronos/issues/7))
 	 thx to [MichelFloyd](https://github.com/MichelFloyd)
 - 0.3.0
	 - added `currentTime()` a reactive replacement for `new Date`
   	 - no longer throws an exception when used outside a reactive context.
 - 0.2.x
 	- bugfixes
 - 0.2.0
 	- Instantiating a Chronos.Timer will not start the timer immediately anymore.
