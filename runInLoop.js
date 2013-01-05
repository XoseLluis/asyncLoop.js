var debug = true;
var debugPrint = debug ? console.log : function(){};

//runs an async function n times
runInLoop = function(fn, times /*, parameters to fn, the last one is a callback, and is compulsory (but can be null)*/){
	var timesDone = 0;
	
	//remove from arguments the 2 first and the last parameters, and add a new callback
	//the new callback calls the old callback and calls the next iteration (_run)
	var _arguments = Array.prototype.slice.call(arguments, 0);
	_arguments.splice(0, 2);
	var initialCallback = _arguments.pop();
	_arguments.push(function(){
		if (typeof initialCallback == "function"){
			initialCallback();
		}
		run();
	});
		
	var run = function(){
		if (timesDone < times){
			debugPrint("iteration: " + timesDone);
			fn.apply(null, _arguments);
			timesDone++;
		}
	};
	run();
};

if (typeof module !== "undefined" && module.exports)
	exports.runInLoop = runInLoop;