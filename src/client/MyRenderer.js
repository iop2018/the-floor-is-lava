'use strict';

import Renderer from 'lance/render/Renderer';

function getRandomHexValue() {
    const shade = Math.round(Math.random() * 255).toString(16);
    if (shade.length > 1) return shade;
    return '0' + shade;
}

function getRandomColor(hexCount = 3) {
    let out = '#';
    for (let i = 0; i < hexCount; i++) {
        out += getRandomHexValue();
    }
    return out;
}

export default class MyRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);

        this.sprites = {};
    }

    draw(t, dt) {
        super.draw(t, dt);

        Object.keys(this.sprites).forEach((objId) => {
            this.sprites[objId].el.style.top = this.gameEngine.world.objects[objId].position.y + 'px';
            this.sprites[objId].el.style.left = this.gameEngine.world.objects[objId].position.x + 'px';
        });
    }

    addSprite(obj, objName) {
        if (objName === 'player') {
            objName += obj.playerId;

            const spriteDiv = document.querySelector('.' + objName);
            Object.assign(spriteDiv.style, {
                visibility: 'visible',
                background: getRandomColor(),
                width: '40px',
            });

            this.sprites[obj.id] = {
                el: spriteDiv,
            };
        }
    }


    removeObject(obj) {
        super.removeObject(obj);

        this.sprites[obj.id].el.style.visibility = 'hidden';
        delete this.sprites[obj.id];
    }
}
