'use strict';

import ServerEngine from 'lance/ServerEngine';

export default class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
    }

    start() {
        super.start();

        this.gameEngine.initGame();
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        // handle client restart request
        socket.on('requestRestart', () => {
            this.gameEngine.addPlayer(socket.playerId);
        });
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        this.gameEngine.removePlayer(playerId);
        console.log('Disconnected');
    }
}
