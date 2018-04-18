'use strict';

import Renderer from 'lance/render/Renderer';
import * as PIXI from 'pixi.js';
import Player from '../common/Player';

function getRandomColor() {
    return Math.random() * 0xffffff;
}

function updateSprite(sprite, gameObject) {
    sprite.position.x = gameObject.position.x;
    sprite.position.y = gameObject.position.y;
    sprite.height = gameObject.height;
    sprite.width = gameObject.width;
    sprite.rotation = gameObject.angle * Math.PI / 180;
    sprite.anchor.set(0.5, 0.5);
}

export default class MyRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        console.log('R: Constructing');
        super(gameEngine, clientEngine);

        this.sprites = new Map();
        document.sprites = this.sprites;
        this.canvasDiv = document.getElementById('gameArea');
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
            console.log('R: draw: Resize to (' + this.canvasW + ', ' + this.canvasH + ')');
            this.renderer.resize(this.canvasW, this.canvasH);

        }
        this.renderer.render(this.stage);

        for (const [objId, sprite] of this.sprites.entries()) {
            updateSprite(sprite, this.gameEngine.world.objects[objId]);
        }
    }

    addObject(obj) {
        console.log('R: addObject');
        let sprite;
        if (obj.class === Player) {
            console.log('R: addObject: Player');
            sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
            sprite.tint = getRandomColor();
        } else {
            console.log('R: addObject: unknown', obj);
            return;
        }
        this.sprites.set(obj.id, sprite);
        this.stage.addChild(sprite);
    }

    removeObject(obj) {
        console.log('R: removeObject: '+obj+' with id '+obj.id+' -> '+this.sprites.get(obj.id));
        this.stage.removeChild(this.sprites.get(obj.id));
        this.sprites.delete(obj.id);
    }
}
