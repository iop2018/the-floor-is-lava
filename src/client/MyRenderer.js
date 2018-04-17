'use strict';

import Renderer from 'lance/render/Renderer';
import * as PIXI from 'pixi.js';
import Player from "../common/Player";

export default class MyRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};
        this.canvasDiv = document.getElementById("gameArea");
        this.stage = new PIXI.Container();
        this.canvasW = this.canvasDiv.offsetWidth;
        this.canvasH = this.canvasDiv.offsetHeight;
        this.renderer = PIXI.autoDetectRenderer({
            'width': this.canvasW,
            'height': this.canvasH,
            'view': this.canvasDiv
        });
        this.renderer.autoResize = true;
        this.renderer.render(this.stage);
    }

    draw(t, dt) {
        super.draw(t, dt);

        if (this.canvasW !== this.canvasDiv.offsetWidth || this.canvasH !== this.canvasDiv.offsetHeight) {
            this.canvasW = this.canvasDiv.offsetWidth;
            this.canvasH = this.canvasDiv.offsetHeight;
            console.log("resize to ("+this.canvasW+', '+this.canvasH+')');
            this.renderer.resize(this.canvasW, this.canvasH);

        }
        this.renderer.render(this.stage);

        for (const objId in Object.keys(this.sprites)) {
            this.sprites[objId].position.y = this.gameEngine.world.objects[objId].position.y;
            this.sprites[objId].position.x = this.gameEngine.world.objects[objId].position.x;
        }
    }

    addObject(obj) {
        console.log("R: addObject");
        let sprite;
        if (obj.class === Player) {
            console.log("R: its player");
            sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
        } else {
            console.log("R: its unknown");
            return;
        }
        this.sprites[obj.id] = sprite;
        this.stage.addChild(sprite);
    }

    removeObject(obj) {
        this.stage.removeChild(this.sprites[obj]);
        delete this.sprites[obj];
    }
}
