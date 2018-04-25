'use strict';

import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import TwoVector from 'lance/serialize/TwoVector';
import Player from './Player';
import Platform from './Platform';
import { config } from './Parameters';

export default class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({
            gameEngine: this,
            collisions: {
                type: 'HSHG',
            },
            gravity: new TwoVector(0, 0.1),
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
            let collisionObjects = Object.keys(e).map((k) => e[k]);
            let player = collisionObjects.find((o) => o instanceof Player);
            let platform = collisionObjects.find((o) => o instanceof Platform);

            if (!player || !platform) {
                return;
            }

            this.getPlayerOnPlatform(player);
            console.log(`player ${player.id} collision starts`);

            // nie mozna od dolu wskoczyc
            if (player.position.y > platform.position.y) {
                this.getPlayerOffPlatform(player);
                player.position.y = platform.position.y + (platform.height + player.height) / 2;
            } else { // zawsze gracz jest na gorze platformy
                player.position.y = platform.position.y - (platform.height + player.height) / 2;
            }
        });
        this.on('collisionStop', (e) => {
            let collisionObjects = Object.keys(e).map((k) => e[k]);
            let player = collisionObjects.find((o) => o instanceof Player);
            let platform = collisionObjects.find((o) => o instanceof Platform);
            if (player && platform) {
                // console.log('found falling');
                this.getPlayerOffPlatform(player);
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
                    player.velocity.y = -8;
                    setTimeout(() => {
                        player.velocity.y = 0;
                    }, 100);
                }
                break;
            case 'left':
                player.position.x -= 5;
                break;
            case 'right':
                player.position.x += 5;
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

    getPlayerOnPlatform(player) {
        player.affectedByGravity = false;
        player.velocity.y = 0; // nie wystarczy wylaczyc grawitacji, trzeba jeszcze zatrzymac
        player.onPlatform = true; // mozna skakac tylko, jak jest sie na platformie
    }

    getPlayerOffPlatform(player) {
        player.affectedByGravity = true;
        player.onPlatform = false;
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
