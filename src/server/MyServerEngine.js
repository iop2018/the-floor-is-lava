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

        // lousy function name
        let addPlayerHelper = () => {
            this.gameEngine.addPlayer(socket.playerId);
        };

        // handle client restart request
        socket.on('requestRestart', addPlayerHelper);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        this.gameEngine.removePlayer(playerId);
        console.log('Disconnected');
    }
}
