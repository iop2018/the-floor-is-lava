'use strict';

import ServerEngine from 'lance/ServerEngine';

export default class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
    }

    start() {
        super.start();

        this.players = {};
        this.slots = [1, 2, 3, 4, 5];
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        if (this.slots.length < 1) console.error('Too many players');
        this.players[socket.id] = this.slots.pop();
        this.gameEngine.addPlayer(socket.playerId);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        this.gameEngine.removePlayer(playerId);
        this.slots.push(this.players[socketId]);
        delete this.players[socketId];
        console.log('Disconnected');
    }
}
