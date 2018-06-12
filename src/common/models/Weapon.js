'use strict';

import DynamicObject from 'lance/serialize/DynamicObject';
import Serializer from 'lance/serialize/Serializer';
import Bullet, { bulletsCollisionDictionary } from './Bullet';
import TwoVector from 'lance/serialize/TwoVector';

export default class Weapon extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            name: { type: Serializer.TYPES.STRING },
            bullets: { type: Serializer.TYPES.INT16 },
            maxBullets: { type: Serializer.TYPES.INT16 }
        }, super.netScheme);
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Weapon;
        this.shootFunction = (e) => {};
        this.name = null;
        this.bullets = 0;
        this.maxBullets = 0;
        if (props) {
            if (props.bullets) {
                this.bullets = props.bullets;
                this.maxBullets = props.bullets;
            }
            if (props.shootFunction)
                this.shootFunction = props.shootFunction;
            if (props.name)
                this.name = props.name;
        }
    };

    syncTo(other) {
        this.name = other.name;
        this.bullets = other.bullets;
    }
}

// NullWeapon is used because renderer crashes when it receives actual null
export function nullWeapon(gameEngine, playerId) {
    return new Weapon(gameEngine, null, { name: 'None', playerId: playerId });
}
export function isNullWeapon(weapon) {
    return weapon.name === 'None';
}

let weaponsDictionary = {
    'simpleWeapon': {
        name: 'Simple Weapon',
        bullets: 10,
        shootFunction: (gameEngine, player) => {
            let bulletVelocity = 10;
            let bulletLifetime = 3500;

            let bullet = gameEngine.addObjectToWorld(new Bullet(gameEngine, null, {
                position: player.position,
                velocity: player.velocityTowardsMouse(bulletVelocity),
                onCollisionFunction: bulletsCollisionDictionary['simpleBullet'],
                playerId: player.playerId
            }));
            setTimeout(() => {
                if (gameEngine.world.objects[bullet.id]) // does it still exist?
                    gameEngine.removeObjectFromWorld(bullet);
            }, bulletLifetime);
        }
    },
    'strongWeapon': {
        name: 'Strong Weapon',
        bullets: 3,
        shootFunction: (gameEngine, player) => {
            let bulletVelocity = 15;
            let bulletLifetime = 2500;

            let bullet = gameEngine.addObjectToWorld(new Bullet(gameEngine, null, {
                position: player.position,
                velocity: player.velocityTowardsMouse(bulletVelocity),
                onCollisionFunction: bulletsCollisionDictionary['strongBullet'],
                playerId: player.playerId,
                width: 12,
                height: 12
            }));
            setTimeout(() => {
                if (gameEngine.world.objects[bullet.id]) // does it still exist?
                    gameEngine.removeObjectFromWorld(bullet);
            }, bulletLifetime);
        }
    },
    'disarmer': {
        name: 'Disarmer',
        bullets: 3,
        shootFunction: (gameEngine, player) => {
            let bulletVelocity = 20;
            let bulletLifetime = 2000;

            let bullet = gameEngine.addObjectToWorld(new Bullet(gameEngine, null, {
                position: player.position,
                velocity: player.velocityTowardsMouse(bulletVelocity),
                onCollisionFunction: bulletsCollisionDictionary['disarm'],
                playerId: player.playerId,
                width: 25,
                height: 25
            }));
            setTimeout(() => {
                if (gameEngine.world.objects[bullet.id]) // does it still exist?
                    gameEngine.removeObjectFromWorld(bullet);
            }, bulletLifetime);
        }
    },
    'deathStar': {
        name: 'Death Star',
        bullets: 1,
        shootFunction: (gameEngine, player) => {
            let bulletVelocity = 20;
            let bulletLifetime = 2000;
            let bulletsInStar = 36;

            let velocityVector = new TwoVector(bulletVelocity, 0);
            for (let i = 0; i < bulletsInStar; ++i) {
                let bullet = gameEngine.addObjectToWorld(new Bullet(gameEngine, null, {
                    position: player.position,
                    velocity: velocityVector.clone(),
                    onCollisionFunction: bulletsCollisionDictionary['strongBullet'],
                    playerId: player.playerId,
                    width: 25,
                    height: 25
                }));
                setTimeout(() => {
                    if (gameEngine.world.objects[bullet.id]) // does it still exist?
                        gameEngine.removeObjectFromWorld(bullet);
                }, bulletLifetime);
                // Rotate vector by 10 degrees
                let newX = velocityVector.x * Math.cos(2 * Math.PI / bulletsInStar)
                    - velocityVector.y * Math.sin(2 * Math.PI / bulletsInStar);
                let newY = velocityVector.x * Math.sin(2 * Math.PI / bulletsInStar)
                    + velocityVector.y * Math.cos(2 * Math.PI / bulletsInStar);
                velocityVector.x = newX;
                velocityVector.y = newY;
            }
        }
    },
};

// Create new weapon and set its ownership
export function generateWeapon(gameEngine, weaponId, playerId) {
    let props = weaponsDictionary[weaponId];
    if (props)
        return new Weapon(gameEngine, null, props);
    return nullWeapon(gameEngine, playerId);
}
