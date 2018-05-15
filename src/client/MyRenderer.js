'use strict';

import Renderer from 'lance/render/Renderer';
import * as PIXI from 'pixi.js';
import Player from '../common/models/Player';
import Platform from '../common/models/Platform';
import Collectible from '../common/models/Collectible';
import Bullet from '../common/models/Bullet';

const RED = 0xff0000;
const BROWN = 0x8B4513;

function getPlayerColor(playerId) {
    function makeLight(seed) {
        return seed * playerId % 0xff;
    }
    const r = makeLight(0x93);
    const g = makeLight(0x71);
    const b = makeLight(0x57);
    return (r * 0x010000) + (g * 0x000100) + b;
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
        this.players = new Set();
        document.renderer = this;
        this.containerDiv = document.getElementById('gameContainer');
        this.canvas = document.getElementById('gameArea');
        this.HUD = document.getElementById('hud');
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

        for (let playerId of this.players.values()) {
            this.updateHUD(this.gameEngine.world.queryObject({ 'playerId': playerId, 'instanceType': Player }));
        }
    }

    addObject(obj) {
        console.log('R: addObject');
        let sprite;
        if (obj.class === Player) {
            console.log('R: addObject: Player');
            sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
            sprite.tint = getPlayerColor(obj.playerId);
            this.createHUD(obj);
        } else if (obj.class === Platform) {
            console.log('R: addObject: Platform');
            sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
        } else if (obj.class === Collectible) {
            console.log('R: addObject: Collectible');
            sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
            sprite.tint = BROWN;
        } else if (obj.class === Bullet) {
            console.log('R: addObject: Bullet');
            sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
            sprite.tint = RED;
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
        if (obj instanceof Player) {
            this.removeHUD(obj);
        }
    }

    createHUD(player) {
        console.log(`R: Adding HUD of player ` + player.playerId);
        this.players.add(player.playerId);
        console.log(`R: His playerID is ` + player.playerId);
        let playerInfo = document.createElement('div');
        playerInfo.id = 'Player ' + player.playerId;
        playerInfo.innerText = 'Player ' + player.playerId;
        let weaponInfo = document.createElement('div');
        weaponInfo.name = 'weapon';
        weaponInfo.innerText = 'Weapon: ' + player.equippedWeapon.name;
        let bulletsInfo = document.createElement('div');
        bulletsInfo.name = 'bullets';
        bulletsInfo.innerText = 'Bullets: ' + player.equippedWeapon.bullets + '/' + player.equippedWeapon.maxBullets;
        playerInfo.appendChild(weaponInfo);
        playerInfo.appendChild(bulletsInfo);
        this.HUD.appendChild(playerInfo);
    }

    removeHUD(player) {
        console.log(`R: Removing HUD of player ` + player.playerId);
        this.HUD.removeChild(document.getElementById('Player ' + player.playerId));
        this.players.delete(player.playerId);
    }

    updateHUD(player) {
        let playerInfo = document.getElementById('Player ' + player.playerId);
        let weaponInfo = playerInfo.children[0];
        weaponInfo.innerText = 'Weapon: ' + player.equippedWeapon.name;
        let bulletsInfo = playerInfo.children[1];
        bulletsInfo.innerText = 'Bullets: ' + player.equippedWeapon.bullets + '/' + player.equippedWeapon.maxBullets;
    }
}
