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
        this.playerAvatars = {};
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        let playerObj = new Player(this.gameEngine, null, { position: new TwoVector(20, 20), playerId: socket.playerId, friction: 0.7 });
        playerObj.playerId = socket.playerId;
        this.playerAvatars[socket.playerId] = playerObj;
        this.gameEngine.addObjectToWorld(playerObj);

    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        let playerObj = this.playerAvatars[playerId];
        this.gameEngine.removeObjectFromWorld(playerObj);
        delete this.playerAvatars[playerId];
    }
}
