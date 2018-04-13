'use strict';

import ServerEngine from 'lance/ServerEngine';
import TwoVector from 'lance/serialize/TwoVector';
import Player from '../common/Player';

export default class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
    }

    start() {
        super.start();

        this.gameEngine.initGame();

        this.player = null;
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        this.player = socket.id;
        this.gameEngine.addObjectToWorld(new Player(this.gameEngine, null, { position: new TwoVector(20, 20), playerId: socket.playerId, friction: 0.7 }));

    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        this.player = null;
        console.log('Disconnected');
    }
}
