var debug = true;
var debugPrint = debug ? console.log : function(){};
/**creates a "pausable loop" that runs an async function "fn" for x times
 *
 * @fn: function to be run in our loop. We distinguis 2 types of functions, those that were thought to run in a loop, and that as such expect their first parameter to be the iteration number, and those who were not thought for running in a loop. We use the isLoopAware property to differentiate them.
 * @times
 * after @times we received the list of parameters to fn, the last of which is a callback to be invoked after each iteration. It can be null, but can't be missing
 * after the parameters to fn, we receive another callback function, this one to be invoked when the loop is over. Again, it can be null, but can't be missing.
 *@ return (Function) This new function doing the looping
 */
var runInPausableLoop = function(fn, times 
/*, parameters to fn, and callback to be invoked when the loop is over. Bear in mind that the last parameter to fn is also a callback (that is invoked after each iteration). Both callbacks can be null, but can't be skipped */){
	var paused = false;
	var timesDone = 0;
	
	var timesToRepeat = -1;
	var timesRepeatedDone = 0;
	
	
	//remove from arguments the 2 first and the last parameters, and add a new callback
	//the new callback calls the old callback and calls the next iteration (run)
	var _arguments = Array.prototype.slice.call(arguments, 0);
	_arguments.splice(0, 2); //remove fn and times
	//if the function expects the loop to pass it over the iteration index, we add a bucket here for that first parameter to the function indicating the iteration number
	if (fn.isLoopAware){
		_arguments.unshift(null); 
	}
	
	var onLoopDoneCallback = _arguments.pop();
	var onIterationDoneCallback = _arguments.pop(); 
	var newCallback;
	//newCallback will be invoked after each iteration, and it takes care of:
	//invoking the original callback that the function expects to run each time it's complete
	//invoking the next iteration
	//if the original callback is async, we have to wait for the original callback completion before launching the next iteration
	if (typeof onIterationDoneCallback == "function"){
		if (onIterationDoneCallback.isAsync === true){
			newCallback = function(){
				//onIterationDoneCallback expects a callback as last parameter, that callback will take care of invoking our next iteration
				var __arguments =  Array.prototype.slice.call(arguments, 0);
				__arguments.push(function(){
					run();
				});
				onIterationDoneCallback.apply(null, __arguments);
			};
		}
		else{
			newCallback = function(){
				onIterationDoneCallback.apply(null, arguments);
				run();
			}
		}
	}
	else{
		newCallback = run;
	}
	_arguments.push(newCallback);
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
			if (fn.isLoopAware){
				//update the first parameter with the current value of the iteration
				_arguments[0] = timesDone;
			}
			fn.apply(self, _arguments);
			timesDone++;
			return;
		}
		else {
			//we take into consideration 2 things each time the loop is done
			//1) do we need to repeat it?
			//2) is there any callback to be called after the loop is done?
			//3) if so, is that callback async?
			timesRepeatedDone++;
			if (timesToRepeat == 0 || timesRepeatedDone < timesToRepeat){
				//unlike what happens with the onInterationDoneCallback, here it's us who decides if we're passing any parameters to onLoopDoneCallback
				//so far we settle for not passing any parameter
				if (typeof onLoopDoneCallback == "function"){
					if (onLoopDoneCallback.isAsync === true){
						onLoopDoneCallback(function(){
							timesDone = 0;
							run();
						});
					}
					else{
						onLoopDoneCallback();
						timesDone = 0;
						run();
					}
				}
			}
			else{
				if (typeof onLoopDoneCallback == "function"){
					if (onLoopDoneCallback.isAsync === true){
						onLoopDoneCallback(function(){});
					}
					else{
						onLoopDoneCallback();
					}
				}
			}
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
	
	//repeat this looped execution n times... 0 means infinite
	me.repeat = function(tToRepeat){
		timesToRepeat = tToRepeat;
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