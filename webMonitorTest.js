if (typeof module !== "undefined" && module.exports){
	var runInPausableLoop = require("./runInPausableLoop").runInPausableLoop;
}


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
function webMonitorTest(){
	//simulates an Ajax call
	var myAjax = function(url, onDone){
    	//simulate the waiting for an ajax response
		setTimeout(function(){
			if (Math.random() < 0.3)
				onDone(false);
			else
				onDone(true);
		}, 1000);
	};
	
	console.log("WebMonitor started:");
	var urls = ["productionServer.company.com",
		"testServer.company.com",
		"developmentServer.company.com"];
	
	function printServerResult(result){
		console.log(result);
	}
	//printResult.isAsync = false; //this is the default, no need to set it
	
	//the async function we want to run in a loop
	function monitorServer(index, onDone){
		var url = urls[index];
		console.log("monitoring " + url);
		myAjax(url, function(success){
			onDone("server: " + url + " is " + (success? "Up" : "Down!!!!"));
		});
	};
	monitorServer.isLoopAware = true;
	

	function onAllServersMonitored(next){
		console.log("monitoring round is done, we'll wait for a while to launch the next one");
		console.log("------------------------------------------------------");
		setTimeout(next, 2000);
	};
	onAllServersMonitored.isAsync = true;
		
	var pausablePrintLoop = runInPausableLoop(monitorServer, urls.length, printServerResult, onAllServersMonitored)();
	pausablePrintLoop.repeat(0); //repeat forever

	if (typeof module !== "undefined" && module.exports){
		consolePauseContinue(pausablePrintLoop);
	}
	
	
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

//continues/pauses the loop on each enter typed on the console
function consolePauseContinue(loop){
	var readline = require('readline'),
	rl = readline.createInterface(process.stdin, process.stdout);
	
	var paused = false;
	function readNext(){
		if (paused)
			loop.continue();
		else
			loop.pause();
		
		paused = !paused;
		rl.question("type enter to " + (paused?  "continue" : "pause"), readNext);
	}
	rl.question("type enter to pause", readNext);
}

webMonitorTest();



