var debug = true;
var debugPrint = debug ? console.log : function(){};
/**creates a "pausable loop" that runs an async function "fn" for x times
 *
 * @fn
 * @times
 * after @times we received the list of parameters to fn, the last of which is a callback to be invoked after each iteration. It can be null, but can't be missing
 * after the parameters to fn, we receive another callback function, this one to be invoked when the loop is over. Again, it can be null, but can't be missing.
 *@ return (Function) This new function doing the looping
 */
var runInPausableLoop = function(fn, times 
/*, parameters to fn, and callback to be invoked when the loop is over. Bear in mind that the last parameter to fn is also a callback (that is invoked after each iteration). Both callbacks can be null, but can't be skipped */){
	var paused = false;
	var timesDone = 0;
	
	
	//remove from arguments the 2 first and the last parameters, and add a new callback
	//the new callback calls the old callback and calls the next iteration (run)
	var _arguments = Array.prototype.slice.call(arguments, 0);
	_arguments.splice(0, 2); //remove fn and times
	var onLoopDoneCallback = _arguments.pop();
	var initialCallback = _arguments.pop();
	_arguments.push(function(){
		if (typeof initialCallback == "function"){
			//the function could want to pass values to the callback , so use the below, rather than simply doing: initialCallback();
			initialCallback.apply(null, arguments);
		}
		run();
	});
	var self; //I don't think this _self will be of much use, but well, in case we wanted to use a "this"
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
		if (paused)
			return;
		if (timesDone < times){
			debugPrint("iteration: " + timesDone + "----------------------------");
			fn.apply(self, _arguments);
			timesDone++;
			return;
		}
		else if (typeof onLoopDoneCallback == "function"){
			onLoopDoneCallback();
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
	
	me.reset = function(){
		debugPrint("reset");
		started = false;
		timesDone = 0;
	};
	return me;
};

if (typeof module !== "undefined" && module.exports){
	exports.runInPausableLoop = runInPausableLoop;
}