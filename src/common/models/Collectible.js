'use strict';

import DynamicObject from 'lance/serialize/DynamicObject';
import { generateWeapon, isNullWeapon } from './Weapon';

export default class Collectible extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            // add serializable properties here
        }, super.netScheme);
    }

    get bendingVelocityMultiple() { return 0; }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Collectible;
        this.width = 40;
        this.height = 40;
        this.affectedByGravity = false;
        if (props && props.pickupFunction)
            this.pickupFunction = props.pickupFunction;
        else
            this.pickupFunction = (e) => {};
    };
}

let pickupFunctionsDictionary = {
    'pickupSimpleWeapon': (gameEngine, player) => {
        player.equippedWeapon = generateWeapon(gameEngine, 'simpleWeapon', player.playerId);
    },
    'pickupStrongWeapon': (gameEngine, player) => {
        player.equippedWeapon = generateWeapon(gameEngine, 'strongWeapon', player.playerId);
    },
    'pickupDisarmer': (gameEngine, player) => {
        player.equippedWeapon = generateWeapon(gameEngine, 'disarmer', player.playerId);
    },
    'pickupDeathStar': (gameEngine, player) => {
        player.equippedWeapon = generateWeapon(gameEngine, 'deathStar', player.playerId);
    },
    'bounceHigh': (gameEngine, player) => {
        player.velocity.y -= 20;
    },
    'refill': (gameEngine, player) => {
        if (!isNullWeapon(player.equippedWeapon))
            player.equippedWeapon.bullets = player.equippedWeapon.maxBullets;
    }
};

export function getPickupFunction(gameEngine, functionId) {
    let pickupFunction = pickupFunctionsDictionary[functionId];
    if (pickupFunction)
        return pickupFunction;
    else
        return (e) => {};
}

export function getRandomPickupFunction(gameEngine) {
    let keys = Object.keys(pickupFunctionsDictionary);
    return pickupFunctionsDictionary[keys[keys.length * Math.random() << 0]]; // << 0 is for rounding number
}
