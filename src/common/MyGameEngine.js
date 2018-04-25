'use strict';

import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import TwoVector from 'lance/serialize/TwoVector';
import Player from './Player';
import { config } from './Parameters';

const SPEED = 1;

export default class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });
    }

    registerClasses(serializer) {
        serializer.registerClass(Player);
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
            case 'up':
                player.velocity.add(new TwoVector(0, -SPEED));
                break;
            case 'down':
                player.velocity.add(new TwoVector(0, SPEED));
                break;
            case 'left':
                player.velocity.add(new TwoVector(-SPEED, 0));
                break;
            case 'right':
                player.velocity.add(new TwoVector(SPEED, 0));
                break;
            case 'space':
                player.velocity = (new TwoVector(0, 0));
                break;
            }
        }
    }
}
