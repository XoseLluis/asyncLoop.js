var debug = true;
var debugPrint = debug ? console.log : function(){};

//creates a "pausable loop" that runs an async function "fn" for x times
runInPausableLoop = function(fn, times /*, parameters to fn, the last one is a callback, and is compulsory (but can be null(*/){
	var paused = false;
	var timesDone = 0;
	
	//remove from arguments the 2 first and the last parameters, and add a new callback
	//the new callback calls the old callback and calls the next iteration (run)
	var _arguments = Array.prototype.slice.call(arguments, 0);
	_arguments.splice(0, 2);
	var initialCallback = _arguments.pop();
	_arguments.push(function(){
		if (typeof initialCallback == "function"){
			initialCallback();
		}
		run();
	});
	var self; //I don't think this _self will be of much use, but well, in case we wanted to use a this
	//the loop should be launched only once, so use this started flag so that on second invocation it does nothing
	var started = false;
	var me = function(){
		if (!started){
			self = this;
			started = true;
			run();
		}
		return me; //to allow chaining
	};
	var run = function(){
		if (!paused && timesDone < times){
			debugPrint("iteration: " + timesDone);
			fn.apply(self, _arguments);
			timesDone++;
		}
	};
	
	//"public functions"
	me.pause = function(){
		debugPrint(fn.name + " paused");
		paused = true;
	};
	me.continue = function(){
		debugPrint(fn.name + " continued");
		paused = false;
		run();
	};
	
	return me;
};

if (typeof module !== "undefined" && module.exports){
	exports.runInPausableLoop = runInPausableLoop;
}