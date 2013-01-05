var runInPausableLoop = require("./runInPausableLoop").runInPausableLoop;

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
var pausablePrintLoop = runInPausableLoop(asyncPrint, 20, "hi there", "guys", asyncPrintOnDone)();

//let's try the pause-continue functionality
setTimeout(function(){
	console.log("pausing");
	pausablePrintLoop.pause();
}, 1000);

setTimeout(function(){
	console.log("continuing");
	pausablePrintLoop.continue();
}, 4000);