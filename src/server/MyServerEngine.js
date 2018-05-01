'use strict';

import ServerEngine from 'lance/ServerEngine';
import LevelGenerator from './LevelGenerator';

export default class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
    }

    start() {
        super.start();

        this.gameEngine.initGame();
        this.LevelGenerator = new LevelGenerator(this.gameEngine);
    }

    step() {
        super.step();

        this.LevelGenerator.step(); // TODO discuss whether this should be run here or in /common -  but we don't want
                                    // to associate client side with any computations involving level generation
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        this.gameEngine.addPlayer(socket.playerId);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        this.gameEngine.removePlayer(playerId);
        console.log('Disconnected');
    }
}
