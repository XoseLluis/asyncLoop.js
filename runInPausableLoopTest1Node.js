var runInPausableLoop = require("./runInPausableLoop").runInPausableLoop;

//async function that we want to run n times in a pausable loop
//the last parameter is a callback to be run after each iteration
var asyncPrint = function(txt1, txt2, onDone){
	console.log("print start: " + txt1 + " - " + txt2);
	setTimeout(function(){
		console.log("print end: " + txt1 + " - " + txt2);
		var result = txt1 + txt2;
		onDone(result);
	}, 400);
};

var asyncPrintOnDone = function(result){
	console.log("asyncPrintOnDone: " + result);
};

var onLoopDone = function(){
	console.log("hey, the async loop is done");
};

/*
console.log("single execution:");
asyncPrint("hi there", "guys", asyncPrintOnDone);
*/

//let's run, pause and continue one async loop
function test1(){
	console.log("looped execution:");
	var pausablePrintLoop = runInPausableLoop(asyncPrint, 20, "hi there", "guys", asyncPrintOnDone, onLoopDone)();

	//let's try the pause-continue functionality
	setTimeout(function(){
		console.log("pausing");
		pausablePrintLoop.pause();
	}, 1000);

	setTimeout(function(){
		console.log("continuing");
		pausablePrintLoop.continue();
	}, 4000);
}

//let's run one async loop n times (i.e. an asyncLoop inside another asyncLoop)
function test2(){
	console.log("looped execution:");
	
	//the tricky part here is that the only really async function is the one run inside the internalLoop, it's in its onDoneCallback where we have to launch
	//the next iteration of the external loop.
	var internalLoop = runInPausableLoop(asyncPrint, 3, "hi there", "guys", asyncPrintOnDone, function(){
		console.log("internal loop is done");
		internalLoop.reset();
		externalLoop.continue();
	});
	var externalLoop = runInPausableLoop(internalLoop, 2, null /*a function here will never run, it's the internal loop who has to jump to the next external itereation*/, function(){
		console.log("external loop is done");
	});
	externalLoop();
}

//test1();
test2();