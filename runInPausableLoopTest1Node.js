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
	var pausablePrintLoop = runInPausableLoop(asyncPrint, 10, "hi there", "guys", asyncPrintOnDone, onLoopDone)();

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
	var externalLoop = runInPausableLoop(internalLoop, 2, null /*a function here will never run, it's the internal loop who has to jump to the next external iteration*/, function(){
		console.log("external loop is done");
	});
	externalLoop();
}

function test3(){
	console.log("looped execution:");

	//now the callback to be invoked after each iteration is also async
	var asyncPrintOnDone = function(result, callback){
		console.log("asyncPrintOnDone: " + result);
		setTimeout(function(){
			console.log("asyncPrintOnDone is done");
			callback();
		}, 2000);
	};
	asyncPrintOnDone.isAsync = true;
	
	var pausablePrintLoop = runInPausableLoop(asyncPrint, 8, "hi there", "guys", asyncPrintOnDone, onLoopDone)();

	//let's try the pause-continue functionality
	/*
	setTimeout(function(){
		console.log("pausing");
		pausablePrintLoop.pause();
	}, 1000);

	setTimeout(function(){
		console.log("continuing");
		pausablePrintLoop.continue();
	}, 4000);
	*/
}

function test4(){
	console.log("looped execution:");

	//now the callback to be invoked after each iteration is also async
	var asyncPrintOnDone = function(result, callback){
		console.log("asyncPrintOnDone: " + result);
		setTimeout(function(){
			console.log("asyncPrintOnDone is done ---------------------");
			callback();
		}, 1000);
	};
	asyncPrintOnDone.isAsync = true;
	
	//and the callback to be invoked when the loop is done is also async
	var onLoopDone = function(callback){
		console.log("hey, the Async loop is done-------------------");
		setTimeout(function(){
			console.log("asyncLoopOnDone is done ---------------------");
			callback();
		}, 1000);
	};
	onLoopDone.isAsync = true;
	
	var pausablePrintLoop = runInPausableLoop(asyncPrint, 4, "hi there", "guys", asyncPrintOnDone, onLoopDone)();
	pausablePrintLoop.repeat(3);
	//let's try the pause-continue functionality
	/*
	setTimeout(function(){
		console.log("pausing");
		pausablePrintLoop.pause();
	}, 1000);

	setTimeout(function(){
		console.log("continuing");
		pausablePrintLoop.continue();
	}, 4000);
	*/
}

//extra functionality, the function to be run in our loop can be aware of it, and as such it expects its first parameter to be the index of the iteration
//we indicate that it's a loop aware function with the isLoopAware property
function test5(){
	var items = ["Asturies", "Germany", "UK", "Austria", "Czech"];
	var asyncPrint = function(index, txt1, txt2, onDone){
		console.log("print start: " + txt1 + items[index] + txt2 + " iteration: " + index);
		setTimeout(function(){
			console.log("print end: " + txt1 + items[index] + txt2 + " iteration: " + index);
			var result = txt1 + txt2;
			onDone(result);
		}, 400);
	};
	asyncPrint.isLoopAware = true;
	
	console.log("looped execution:");
	var pausablePrintLoop = runInPausableLoop(asyncPrint, 3, "X", "X", asyncPrintOnDone, onLoopDone)();

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

function test6(){

}

var tests = [
	{
		title: "Looped execution with Pause/Continue",
		code: test1
	},
	{
		title: "Looped execution inside Looped execution",
		code: test2
	},
	{
		title: "Looped execution with callback on Iteration Done",
		code: test3
	},
	{
		title: "Looped execution  with callback on Iteration Done and Loop Done",
		code: test4
	},
	{
		title: "Looped execution with function that is loop aware",
		code: test5
	},
	{
		title: "asyncLoop.repeat",
		code: test6
	},
];

var readline = require('readline'),
rl = readline.createInterface(process.stdin, process.stdout);

rl.write(
	tests.map(function(test, index){
		return index + ") " + test.title;
	}).join("\n")
	.concat("\n")
);

rl.question("type test number\n", function _askForTest(input){
	var op = parseInt(input);
	
	if ( op < 0 || op >= tests.length){
		rl.write("wrong option\n");
		rl.question("type test number\n", _askForTest);
	}
	else{
		console.log("running: " + tests[op].title + "\n");
		rl.close();
		tests[op].code();
	}
});



//test1();
//test2();
//test3();
//test4();
//test5();