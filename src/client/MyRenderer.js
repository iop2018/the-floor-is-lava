'use strict';

const Renderer = require('incheon').render.Renderer;

class MyRenderer extends Renderer {

    constructor() {
        super();
        this.sprites = {};

        // TODO: the world settings are really a property of the GameEngine.
        //       but they are currently used by interpolate function of DynamicObject.
        this.worldSettings = {
            width: 800,
            height: 600
        };
    }

    init() {
    }

    draw() {
        super.draw();
    }

    addObject(objData, options) {
        let sprite = {};

        // add this object to the renderer:
        // if (objData.class == Player) {
        //     ...
        // }

        Object.assign(sprite, options);
        this.sprites[objData.id] = sprite;

        return sprite;
    }

    removeObject(obj) {
        obj.destroy();
        delete this.sprites[obj.id];
    }

}

module.exports = MyRenderer;
