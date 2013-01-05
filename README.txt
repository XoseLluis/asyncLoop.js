deploytonenyures.blogspot.com
https://github.com/XoseLluis/asyncLoop.js.git

asyncLoop.js

Repeatedly running an async function, starting each iteration once the previous one is done, is a quite common need in modern JavaScript development. 
We present here 2 functions to help us with that. Both of them expect an async function which when finished invokes a callback function (thought that callback could be null):

- runInLoop just right that

- runInPausableLoop is slightly more "sophisticated" allowing us to pause and continue the iteration.

this post here:

http://deploytonenyures.blogspot.com.es/2013/01/pausable-async-loop.html

explains it a little bit more







