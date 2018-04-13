'use strict';

import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import TwoVector from 'lance/serialize/TwoVector';
import Player from './Player';

const SPEED = 1;

export default class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({gameEngine: this});
        this.player = null;
    }

    registerClasses(serializer) {
        serializer.registerClass(Player);
    }

    start() {
        super.start();

        // this.worldSettings = {
        //     width: 400,
        //     height: 400
        // };

        // this.on('postStep', () => {
        //     this.postStepHandler();
        // })

        this.on('objectAdded', (object) => {
            if (object.class === Player) {
                this.player = object;
            }
        });
    }

    processInput(inputData, playerId) {
        super.processInput(inputData, playerId);

        // get the player's primary object
        let player = this.world.queryObject({ playerId });
        if (player) {
            console.log(`player ${playerId} pressed ${inputData.input}`);

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
            }
        }
    }

    initGame() {
    }
}
