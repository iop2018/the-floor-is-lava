'use strict';

import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import TwoVector from 'lance/serialize/TwoVector';
import Player from './Player';
import Platform from './Platform';
import Collectible from './Collectible';
import Bullet from './Bullet';
import Weapon, { nullWeapon, isNullWeapon } from './Weapon';
import { config } from './Parameters';

const FALLING_SPEED = 0.5;
const JUMPING_SPEED = -8;
const POSITION_CHANGE = 5; // pixels moving with every keystoke
const BULLET_VELOCITY = new TwoVector(5, 0);
const BULLET_INITIAL_DISTANCE = new TwoVector(20, 0);
const BULLET_LIFETIME = 3000;
const BULLET_HIT_TIME = 500;

export default class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({
            gameEngine: this,
            collisions: {
                type: 'HSHG',
            },
            gravity: new TwoVector(0, FALLING_SPEED),
        });
        this.playerStats = {};
    }

    registerClasses(serializer) {
        serializer.registerClass(Player);
        serializer.registerClass(Platform);
        serializer.registerClass(Collectible);
        serializer.registerClass(Bullet);
        serializer.addCustomType(Weapon);
        serializer.registerClass(Weapon);
    }

    start() {
        super.start();

        this.on('collisionStart', (e) => {
            let player = null;
            if (e.o1 instanceof Player) {
                player = e.o1;
            } else if (e.o2 instanceof Player) {
                player = e.o2;
                e.o2 = e.o1;
                e.o1 = player;
            }

            if (player) {
                // We need to make sure that all sync corrections are applied, otherwise we risk bouncing from
                // objects during sync ('bending')
                player.forceUpdate();
                if (!this.physicsEngine.collisionDetection.areObjectsColliding(e.o1, e.o2)) return;

                let platform = e.o2 instanceof Platform ? e.o2 : null;
                if (platform) {
                    platform.handlePlayerCollision(player);
                    return;
                }
                let collectible = e.o2 instanceof Collectible ? e.o2 : null;
                if (collectible) {
                    if (collectible.pickup instanceof Weapon) {
                        console.log(`player ${player.id} collected weapon`);
                        if (player.equippedWeapon && !isNullWeapon(player.equippedWeapon))
                            this.removeObjectFromWorld(player.equippedWeapon);
                        player.equippedWeapon = collectible.pickup;
                        this.removeObjectFromWorld(collectible);
                    }
                    return;
                }

                let bullet = e.o2 instanceof Bullet ? e.o2 : null;
                if (bullet) {
                    bullet.onCollisionFunction(player);
                    this.removeObjectFromWorld(bullet);
                }
            }
        });

        this.on('collisionStop', (e) => {
            let collisionObjects = Object.keys(e).map((k) => e[k]);
            let player = collisionObjects.find((o) => o instanceof Player);
            let platform = collisionObjects.find((o) => o instanceof Platform);
            if (player && platform) {
                this.handlePlayerOffPlatform(player);
                console.log(`player ${player.id} collision stops`);
            }
        });
    }
    addPlayer(playerId) {
        this.addObjectToWorld(new Player(
            this,
            null,
            { position: new TwoVector(20, 20), playerId, friction: config.player.friction }
        ));
    }

    handlePlayerOffPlatform(player) {
        player.affectedByGravity = true;
        player.onPlatform = false;
    }

    removePlayer(playerId) {
        const playerObject = this.world.queryObject({ 'playerId': playerId, 'instanceType': Player });
        this.removeObjectFromWorld(playerObject.id);
    }

    processInput(inputData, playerId, isServer) {
        super.processInput(inputData, playerId, isServer);

        // get the player's primary object
        let player = this.world.queryObject({ 'playerId': playerId, 'instanceType': Player });
        if (player) {
            // console.log(`player ${playerId} with id=${player.id} pressed ${inputData.input}`);

            switch (inputData.input) {
            case 'space':
                if (player.onPlatform) {
                    // tak jest zasymulowany skok
                    player.velocity.y = JUMPING_SPEED;
                }
                break;
            case 'left':
                player.position.x -= POSITION_CHANGE;
                break;
            case 'right':
                player.position.x += POSITION_CHANGE;
                break;
            case 'enter':
                if (player.affectedByGravity) {
                    player.affectedByGravity = false;
                    player.velocity.y = 0;
                } else {
                    player.affectedByGravity = true;
                }
                break;
            case 'z':
                this.shoot(player);
                break;
            }
        }
    }


    initGame() {
        // dodaje te platformy
        this.addObjectToWorld(new Platform(this, null, { position: new TwoVector(150, 125) }));
        this.addObjectToWorld(new Platform(this, null, { position: new TwoVector(100, 200) }));
        this.addObjectToWorld(new Platform(this, null, { position: new TwoVector(150, 275) }));
        this.addObjectToWorld(new Platform(this, null, { position: new TwoVector(200, 350) }));
        this.addObjectToWorld(new Platform(this, null, { position: new TwoVector(270, 410) }));
        this.addObjectToWorld(new Platform(this, null, { position: new TwoVector(350, 480) }));

        // Shoot example
        let bulletHitExample = (player) => {
            if (player.onPlatform)
                this.handlePlayerOffPlatform(player);
            player.velocity.y -= 5;
            player.velocity.x += 5;
            setTimeout(() => {
                player.velocity.x = 0;
            }, BULLET_HIT_TIME);
        };
        let shootExample = (player) => {
            console.log(`Hello there!`);
            let bullet = this.addObjectToWorld(new Bullet(this, null, {
                position: player.position.clone().add(BULLET_INITIAL_DISTANCE),
                velocity: BULLET_VELOCITY,
                onCollisionFunction: bulletHitExample
            }));
            setTimeout(() => {
                if (this.world.objects[bullet.id]) // does it still exist?
                    this.removeObjectFromWorld(bullet);
            }, BULLET_LIFETIME);
        };
        let weapon = this.addObjectToWorld(new Weapon(this, null,
            { shootFunction: shootExample, bullets: 50, name: 'Simple Gun 2' }));
        this.addObjectToWorld(new Collectible(this, null,
            { position: new TwoVector(300, 250), pickup: weapon }));
    }

    shoot(player) {
        if (!player.equippedWeapon || isNullWeapon(player.equippedWeapon))
            return;

        let weapon = player.equippedWeapon;
        weapon.shootFunction(player);
        --weapon.bullets;

        if (!weapon.bullets) {
            console.log(`Out of bullets`);
            player.equippedWeapon = nullWeapon(this);
            this.removeObjectFromWorld(weapon);
        }
    }
}
