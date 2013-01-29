deploytonenyures.blogspot.com
https://github.com/XoseLluis/asyncLoop.js.git

asyncLoop.js

Repeatedly running an async function, starting each iteration once the previous one is done, is a quite common need in modern JavaScript development. 
We present here 2 functions to help us with that. Both of them expect an async function which when finished invokes a callback function (thought that callback could be null):

- runInLoop does right that:
runInLoop(asyncPrint, 20, "hi there", "guys", asyncPrintOnDone);

- runInPausableLoop is slightly more "sophisticated" allowing us to pause and continue the iteration.
var pausablePrintLoop = runInPausableLoop(asyncFunction, times, /* params to asyncFunction. */, onIterationCallback, onLoopDoneCallback)();
var pausablePrintLoop = runInPausableLoop(asyncPrint, 20, "hi there", "guys", asyncPrintOnDone)();
//then we can pause/continue the loop like this:
pausablePrintLoop.pause();
pausablePrintLoop.continue();

It should be obvious that asyncPrint is an asynchronous function that we want to run 20 times, invoking the asyncPrintOnDone function 
each time one iteration is complete.

The onIterationCallback function is run after each iteration.
the onLoopDoneCallback function is run when the loop has finished.

Both callbacks could be asynchronous in turn, we indicate that by "annotating" the function with a "isAsync" property.

We can repeat the Loop by calling its "repeat" method.

The asynchronous function to be run inside the loop could expect as first parameter the iteration index. We let the loop know about this by anotating the function with an "isLoopAware" property.

this post here:

http://deploytonenyures.blogspot.com.es/2013/01/pausable-async-loop.html

explains it a little bit more







