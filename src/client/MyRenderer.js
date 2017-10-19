'use strict';

import Renderer from 'lance/render/Renderer';

export default class MyRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};
    }

    draw() {
        super.draw();
    }

}
