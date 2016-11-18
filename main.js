'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, './index.html');

// define routes and socket
const server = express();
server.get('/', function(req, res) { res.sendFile(INDEX); });
server.use('/', express.static(path.join(__dirname, '.')));
let requestHandler = server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(requestHandler);

// Game Server
const MyServerEngine = require(path.join(__dirname, 'src/server/MyServerEngine.js'));
const MyGameEngine = require(path.join(__dirname, 'src/common/MyGameEngine.js'));

// Game Instances
const gameEngine = new MyGameEngine({ traceLevel: 1 });
const serverEngine = new MyServerEngine(io, gameEngine, { debug: {} });

// start the game
serverEngine.start();
