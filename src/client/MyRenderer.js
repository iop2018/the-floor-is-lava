'use strict';

const Renderer = require('lance-gg').render.Renderer;

class MyRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};
    }

    draw() {
        super.draw();
    }

}

module.exports = MyRenderer;
