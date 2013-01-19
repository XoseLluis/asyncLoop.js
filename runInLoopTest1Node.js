var runInLoop = require("./runInLoop").runInLoop;

//async function that we want to run n times in a pausable loop
//the last parameter is a callback to be run after each iteration
var asyncPrint = function(txt1, txt2, onDone){
	console.log("print start: " + txt1 + " - " + txt2);
	setTimeout(function(){
		console.log("print end: " + txt1 + " - " + txt2);
		var result = txt1 + " " + txt2;
		onDone(result);
	}, 400);
};

var asyncPrintOnDone = function(result){
	console.log("asyncPrintOnDone: " + result);
};

console.log("single execution:");
asyncPrint("hi there", "guys", asyncPrintOnDone);

console.log("looped execution 1:");
runInLoop(asyncPrint, 5, "hi there", "guys", asyncPrintOnDone, test2);

function test2(){
	console.log("looped execution 2:");
	runInLoop(asyncPrint, 3, "hi there", "guys", asyncPrintOnDone, function(){
		console.log("the asyncLoop is done");
	});
}

