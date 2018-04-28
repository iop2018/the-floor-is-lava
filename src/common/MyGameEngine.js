'use strict';

import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import TwoVector from 'lance/serialize/TwoVector';
import Player from './Player';
import Platform from './Platform';
import { config } from './Parameters';

const FALLING_SPEED = 0.5;
const JUMPING_SPEED = -8;
const POSITION_CHANGE = 5; // pixels moving with every keystoke

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

            }
        });

        this.on('collisionStop', (e) => {
            let collisionObjects = Object.keys(e).map((k) => e[k]);
            let player = collisionObjects.find((o) => o instanceof Player);
            let platform = collisionObjects.find((o) => o instanceof Platform);
            if (player && platform) {
                // console.log('found falling');
                Platform.handlePlayerOff(player);
            }
            console.log(`player ${player.id} collision stops`);
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
        this.removeObjectFromWorld(playerObject.id);
    }

    processInput(inputData, playerId, isServer) {
        super.processInput(inputData, playerId, isServer);

        // get the player's primary object
        let player = this.world.queryObject({ 'playerId': playerId, 'instanceType': Player });
        if (player) {
            console.log(`player ${playerId} with id=${player.id} pressed ${inputData.input}`);

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

    }


}
