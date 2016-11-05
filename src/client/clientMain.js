const qsOptions = require("query-string").parse(location.search);
const NewClientEngine = require("../client/NewClientEngine");
const NewRenderer = require('../client/NewRenderer');
const NewGameEngine = require('../common/NewGameEngine');
const Synchronizer = require('incheon').Synchronizer;

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: 1,
    delayInputCount: 3,
    clientIDSpace: 1000000
};
let options = Object.assign(defaults, qsOptions);

// create a client engine, a game engine, a synchronizer, and a renderer
const renderer = new NewRenderer();
const gameOptions = Object.assign({ renderer }, options);
const gameEngine = new NewGameEngine(gameOptions);
const clientEngine = new NewClientEngine(gameEngine, options);
const synchronizer = new Synchronizer(clientEngine);

// object synchronization:
synchronizer.extrapolateObjectSelector = (obj) => { return true; };

function preload() {
}

function create() {

    clientEngine.start();
}

function update() {

    clientEngine.step();
}
