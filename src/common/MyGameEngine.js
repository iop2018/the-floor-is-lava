'use strict';

import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import PlayerAvatar from './PlayerAvatar';

export default class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });
    }

    registerClasses(serializer) {
        serializer.registerClass(PlayerAvatar);
    }

    start() {

        super.start();

        this.worldSettings = {
            width: 400,
            height: 400
        };
    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // get the player's primary object
        let player = this.world.getPlayerObject(playerId);
        if (player) {
            console.log(`player ${playerId} pressed ${inputData.input}`);
            if (inputData.input === 'up') {
                player.isMovingUp = true;
            } else if (inputData.input === 'down') {
                player.isMovingDown = true;
            } else if (inputData.input === 'right') {
                player.isRotatingRight = true;
            } else if (inputData.input === 'left') {
                player.isRotatingLeft = true;
            } else if (inputData.input === 'space') {
                this.fire(player, inputData.messageIndex);
                this.emit('fire');
            }
        }
    }
}
