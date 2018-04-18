'use strict';

import Renderer from 'lance/render/Renderer';
import * as PIXI from 'pixi.js';
import Player from '../common/Player';

function getRandomColor() {
    return Math.random() * 0xffffff;
}

export default class MyRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        console.log('R: Constructing');
        super(gameEngine, clientEngine);

        this.sprites = {};
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

        Object.keys(this.sprites).forEach((objId) => {
            try {
                this.sprites[objId].position.y = this.gameEngine.world.objects[objId].position.y;
                this.sprites[objId].position.x = this.gameEngine.world.objects[objId].position.x;
            } catch (e) {
                console.error('rendering issue (MyRndrr)', e);
            }
        });
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
        this.sprites[obj.id] = sprite;
        this.stage.addChild(sprite);
    }

    removeObject(obj) {
        console.log('R: removeObject: ' + obj + ' with id ' + obj.id + ' -> ' + this.sprites[obj.id]);
        this.stage.removeChild(this.sprites[obj.id]);
        delete this.sprites[obj.id];
    }
}
