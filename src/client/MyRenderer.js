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

        this.RATIO = 1920/1080;
        this.BASE_WIDTH = 1920; // When game container has this width, 1px = 1 game unit

        this.sprites = new Map();
        document.renderer = this;
        this.containerDiv = document.getElementById('gameContainer');
        this.canvas = document.getElementById('gameArea');
        this.stage = new PIXI.Container();
        this.renderer = PIXI.autoDetectRenderer({
            'width': 0,
            'height': 0,
            'view': this.canvas
        });
        this.autoresize();
        let _this = this;
        window.onresize = function() { _this.autoresize(); };
        this.renderer.render(this.stage);
    }

    autoresize() {
        this.renderer.autoResize = true;
        let w = this.containerDiv.offsetWidth;
        let h = this.containerDiv.offsetHeight;
        console.log('R: autoresize: Container is (' + w + ', ' + h + ')');
        if (w/h >= this.RATIO) {
            w = h * this.RATIO;
        } else {
            h = w / this.RATIO;
        }
        this.renderer.view.style.width = w + 'px';
        this.renderer.view.style.height = h + 'px';
        this.stage.scale.x = w / this.BASE_WIDTH;
        this.stage.scale.y = w / this.BASE_WIDTH;
        this.renderer.resize(w, h);
        console.log('R: autoresize: Resize to (' + w + ', ' + h + ')');
    }

    draw(t, dt) {
        super.draw(t, dt);

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
