deploytonenyures.blogspot.com
https://github.com/XoseLluis/asyncLoop.js.git

asyncLoop.js

Repeatedly running an async function, starting each iteration once the previous one is done, is a quite common need in modern JavaScript development. 
We present here 2 functions to help us with that. Both of them expect an async function which when finished invokes a callback function (thought that callback could be null):

- runInLoop does right that:
runInLoop(asyncPrint, 20, "hi there", "guys", asyncPrintOnDone);

- runInPausableLoop is slightly more "sophisticated" allowing us to pause and continue the iteration.
var pausablePrintLoop = runInPausableLoop(asyncPrint, 20, "hi there", "guys", asyncPrintOnDone)();
//then we can pause/continue the loop like this:
pausablePrintLoop.pause();
pausablePrintLoop.continue();

It should be obvious that asyncPrint is an asynchronous function that we want to run 20 times, invoking the asyncPrintOnDone function 
each time one iteration is complete.

this post here:

http://deploytonenyures.blogspot.com.es/2013/01/pausable-async-loop.html

explains it a little bit more







