'use strict';

import ServerEngine from 'lance/ServerEngine';

export default class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
    }

    start() {
        super.start();

        this.players = {};
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        this.players[socket.playerId] = socket.id;
        this.gameEngine.addPlayer(socket.playerId);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        this.gameEngine.removePlayer(playerId);
        delete this.players[playerId];
        console.log('Disconnected');
    }
}
