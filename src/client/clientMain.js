const qsOptions = require('query-string').parse(location.search);
const MyClientEngine = require('../client/MyClientEngine');
const MyGameEngine = require('../common/MyGameEngine');


// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    isServer: false,
    traceLevel: 1,
    delayInputCount: 3,
    clientIDSpace: 1000000
};
let options = Object.assign(defaults, qsOptions);

// create a client engine and a game engine
const gameOptions = Object.assign({}, options);
const gameEngine = new MyGameEngine(gameOptions);
const clientEngine = new MyClientEngine(gameEngine, options);

document.addEventListener('DOMContentLoaded', function(e) { clientEngine.start(); });
