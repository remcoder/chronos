# Chronos

 * Chronos.Timer - A simple reactive timer
 * Chronos.liveUpdate - make helpers live updating triggered by a timer
 * Chronos.liveMoment - wrapper for moment.js to create live updating timestamps etc
 
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

### Chronos.Timer.start
Start the timer.

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


Example:

	// this will create counter and logs it every second
	var count = 0;
	Tracker.autorun(function() {
		Chronos.liveUpdate();
		console.log(count);
		count++;
	});

## Chronos.liveMoment
If the global variable `moment` exists in your app, this function will wrap it to make it update reactively based on a timer.

Usage:

	// call with the same params as you would moment()
	Chronos.liveMoment(/* arguments */); 
 
Example:

	// prints how long ago the timestamp was made, every second
	var timestamp = new Date();
	Tracker.autorun(function() {
		console.log(Chronos.liveMoment(timestamp).fromNow());
	});
	
