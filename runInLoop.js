var debug = true;
var debugPrint = debug ? console.log : function(){};

//runs an async function n times
runInLoop = function(fn, times 
/*, parameters to fn, and callback to be invoked when the loop is over. Bear in mind that the last parameter to fn is also a callback (that is invoked after each iteration). Both callbacks can be null, but can't be skipped */){
	var timesDone = 0;
	
	//remove from arguments the 2 first and the last parameters, and add a new callback
	//the new callback calls the old callback and calls the next iteration (_run)
	var _arguments = Array.prototype.slice.call(arguments, 0);
	_arguments.splice(0, 2);
	var onLoopDoneCallback = _arguments.pop();
	var initialCallback = _arguments.pop();
	_arguments.push(function(){
		if (typeof initialCallback == "function"){
			//the function could want to pass values to the callback , so use the below, rather than simply doing: initialCallback();
			initialCallback.apply(null, arguments);
		}
		run();
	});
		
	var run = function(){
		if (timesDone < times){
			debugPrint("iteration: " + timesDone);
			fn.apply(null, _arguments);
			timesDone++;
		}
		else if (typeof onLoopDoneCallback == "function"){
			onLoopDoneCallback();
		}
	};
	run();
};

if (typeof module !== "undefined" && module.exports)
	exports.runInLoop = runInLoop;