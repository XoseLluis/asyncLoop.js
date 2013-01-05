var runInLoop = require("./runInLoop").runInLoop;

//async function that we want to run n times in a pausable loop
//the last parameter is a callback to be run after each iteration
var asyncPrint = function(txt1, txt2, onDone){
	console.log("print start: " + txt1 + " - " + txt2);
	setTimeout(function(){
		console.log("print end: " + txt1 + " - " + txt2);
		onDone();
	}, 400);
};

var asyncPrintOnDone = function(){
	console.log("asyncPrintOnDone");
};

console.log("single execution:");
asyncPrint("hi there", "guys", asyncPrintOnDone);

console.log("looped execution:");
runInLoop(asyncPrint, 20, "hi there", "guys", asyncPrintOnDone);
//runInLoop(asyncPrint, 20, "hi there", "guys", null);
