'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, './index.html');

// define routes and socket
const server = express();
server.get('/', function (req, res) { res.sendFile(INDEX) });
server.use('/', express.static(path.join(__dirname, '.')));
var requestHandler = server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(requestHandler);

// Game Server
const ServerEngine = require(path.join(__dirname, 'src/server/NewServerEngine.js'));
const GameEngine = require(path.join(__dirname, 'src/common/NewGameEngine.js'));

// Game Instance
const gameEngine = new GameEngine({ traceLevel: 1 });
const serverEngine = new ServerEngine(io, gameEngine, { debug:{} });

// start the game
serverEngine.start();
