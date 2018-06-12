'use strict';

import DynamicObject from 'lance/serialize/DynamicObject';
import { nullWeapon } from './Weapon';

export default class Bullet extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            // add serializable properties here
        }, super.netScheme);
    }

    get bendingMultiple() { return 0.5; }
    get bendingVelocityMultiple() { return 0; }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Bullet;
        this.width = 5;
        this.height = 5;
        this.affectedByGravity = false;
        this.onCollisionFunction = (e) => {};
        if (props) {
            if (props.playerId)
                this.playerId = props.playerId;
            if (props.width)
                this.width = props.width;
            if (props.height)
                this.height = props.height;
            if (props.onCollisionFunction)
                this.onCollisionFunction = props.onCollisionFunction;
        }
    };
}

export let bulletsCollisionDictionary = {
    'simpleBullet': (gameEngine, player) => {
        player.velocity.y -= 5;
        player.velocity.x += 5;
        setTimeout(() => {
            player.velocity.x = 0;
        }, 500);
    },
    'strongBullet': (gameEngine, player) => {
        player.velocity.y -= 10;
        player.velocity.x += 10;
        setTimeout(() => {
            player.velocity.x = 0;
        }, 750);
    },
    'disarm': (gameEngine, player) => {
        player.equippedWeapon = nullWeapon(gameEngine);
    }
};
