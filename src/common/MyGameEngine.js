'use strict';

import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import TwoVector from 'lance/serialize/TwoVector';
import Player from './models/Player';
import Platform from './models/Platform';
import Collectible from './models/Collectible';
import Bullet from './models/Bullet';
import Weapon, { nullWeapon, isNullWeapon } from './models/Weapon';
import { config } from './Parameters';
import LevelGenerator from './LevelGenerator';
import DynamicObject from 'lance/serialize/DynamicObject';

const FALLING_SPEED = 0.5;
const JUMPING_SPEED = -13;
const POSITION_CHANGE = 12; // pixels moving with every keystoke

const TERMINATE_OBJECT_HEIGHT = 1200;
const INITIAL_WORLD_SPEED = new TwoVector(0.151, 0.6);

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
        this.worldSpeed = INITIAL_WORLD_SPEED;
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
                    collectible.pickupFunction(this, player);
                    this.removeObjectFromWorld(collectible);
                    return;
                }

                let bullet = e.o2 instanceof Bullet ? e.o2 : null;
                if (bullet && bullet.playerId !== player.playerId) { // do not collide with your own bullets
                    bullet.onCollisionFunction(this, player);
                    this.removeObjectFromWorld(bullet);
                }
            }
        });

        this.on('collisionStop', (e) => {
            let collisionObjects = Object.keys(e).map((k) => e[k]);
            let player = collisionObjects.find((o) => o instanceof Player);
            let platform = collisionObjects.find((o) => o instanceof Platform);
            if (player && platform) {
                Platform.handlePlayerOff(player);
                console.log(`player ${player.id} collision stops`);
            }
        });

        this.on('postStep', () => {
            this.world.queryObjects({ instanceType: DynamicObject }).forEach((obj) => {
                obj.position.add(this.worldSpeed);
            });
        });
    }
    addPlayer(playerId) {
        this.addObjectToWorld(new Player(
            this,
            null,
            { position: new TwoVector(20, 20), playerId, friction: config.player.friction }
        ));
    }

    removePlayer(playerId) {
        const playerObject = this.world.queryObject({ 'playerId': playerId, 'instanceType': Player });
        if (playerObject) this.removeObjectFromWorld(playerObject.id);
    }

    processInput(inputData, playerId, isServer) {
        super.processInput(inputData, playerId, isServer);

        // get the player's primary object
        let player = this.world.queryObject({ 'playerId': playerId, 'instanceType': Player });
        if (player) {
            // console.log(`player ${playerId} with id=${player.id} pressed ${inputData.input}`);

            switch (inputData.input) {
            case 'jump':
                if (player.onPlatform) {
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
            case 'shoot':
                this.shoot(player);
                break;
            case 'mousePos':
                console.log(inputData.options.x, inputData.options.y);
                player.mouseXPosition = inputData.options.x;
                player.mouseYPosition = inputData.options.y;
                break;
            }
        }
    }


    // ran on server-side gameEngine instance when the game begins
    initGame() {
        this.levelGenerator = new LevelGenerator(this);
        this.levelGenerator.initLevel();

        // handle level element generation and destruction on server side
        this.on('server__postStep', () => {
            this.levelGenerator.step();
            this.world.queryObjects({ instanceType: DynamicObject }).forEach((obj) => {
                if (obj.position.y > TERMINATE_OBJECT_HEIGHT) this.removeObjectFromWorld(obj);
            });
        });
    }

    shoot(player) {
        if (isNullWeapon(player.equippedWeapon))
            return;

        let weapon = player.equippedWeapon;
        weapon.shootFunction(this, player);
        --weapon.bullets;

        if (!weapon.bullets) {
            player.equippedWeapon = nullWeapon(this);
        }
    }
}
