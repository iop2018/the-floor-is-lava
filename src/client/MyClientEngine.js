const ClientEngine = require('incheon').ClientEngine;
const Synchronizer = require('incheon').Synchronizer;
const MyRenderer = require('../client/MyRenderer');

const GAME_UPS = 60;

class MyClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options);

        // initialize renderer
        this.renderer = new MyRenderer();
        this.gameEngine.renderer = this.renderer;

        // initialize object synchronization
        const syncOptions = {
            extrapolate: {
                localObjBending: 0.0,
                remoteObjBending: 0.6
            }
        };
        const synchronizer = new Synchronizer(this, syncOptions);
        synchronizer.extrapolateObjectSelector = () => { return true; };

        this.serializer.registerClass(require('../common/Player'));
        this.gameEngine.on('client.preStep', this.preStep.bind(this));

        // keep a reference for key press state
        this.pressedKeys = {
            down: false,
            up: false,
            left: false,
            right: false,
            space: false
        };

        document.onkeydown = (e) => { onKeyChange.call(this, e, true); };
        document.onkeyup = (e) => { onKeyChange.call(this, e, false); };
    }

    start() {

        super.start();
        this.renderer.init();

        // Simple JS game loop adapted from
        // http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/
        let skipTicks = 1000 / GAME_UPS;
        let nextGameTick = (new Date).getTime();

        let gameLoop = () => {
            while ((new Date).getTime() > nextGameTick) {
                this.step();
                nextGameTick += skipTicks;
            }
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }

    // our pre-step is to process all inputs
    preStep() {

        if (this.pressedKeys.up) {
            this.sendInput('up', { movement: true });
        }

        if (this.pressedKeys.down) {
            this.sendInput('down', { movement: true });
        }

        if (this.pressedKeys.left) {
            this.sendInput('left', { movement: true });
        }

        if (this.pressedKeys.right) {
            this.sendInput('right', { movement: true });
        }

        if (this.pressedKeys.space) {
            this.sendInput('space', { movement: true });
        }
    }
}

function onKeyChange(e, isDown) {
    e = e || window.event;

    if (e.keyCode == '38') {
        this.pressedKeys.up = isDown;
    } else if (e.keyCode == '40') {
        this.pressedKeys.down = isDown;
    } else if (e.keyCode == '37') {
        this.pressedKeys.left = isDown;
    } else if (e.keyCode == '39') {
        this.pressedKeys.right = isDown;
    } else if (e.keyCode == '32') {
        this.pressedKeys.space = isDown;
    }
}

module.exports = MyClientEngine;
