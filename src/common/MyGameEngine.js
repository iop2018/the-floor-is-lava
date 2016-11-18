"use strict";

const GameEngine = require('incheon').GameEngine;
const Player = require('./Player');

class MyGameEngine extends GameEngine {

    constructor(options){
        super(options);
    }

    start(){

        super.start();

        this.worldSettings = {
            width: 400,
            height: 400
        };
    };

    processInput(inputData, playerId){

        super.processInput(inputData, playerId);

        // get the player tied to the player socket
        var player;
        for (let objId in this.world.objects) {
            if (this.world.objects[objId].playerId == playerId) {
                player = this.world.objects[objId];
                break;
            }
        }

        if (player) {
            console.log(`player ${playerId} pressed ${inputData.input}`);
            if (inputData.input == "up") {
                player.isMovingUp = true;
            } else if (inputData.input == "down") {
                player.isMovingDown = true;
            } else if (inputData.input == "right") {
                player.isRotatingRight = true;
            } else if (inputData.input == "left") {
                player.isRotatingLeft = true;
            } else if (inputData.input == "space") {
                this.fire(player, inputData.messageIndex);
                this.emit("fire");
            }
        }
    };

    makeShip(playerId) {
        if (playerId in this.world.objects){
            console.log("warning, object with id ", playerId, " already exists");
            return null;
        }

        var newShipX = Math.floor(Math.random()*(this.worldSettings.width-200)) + 200;
        var newShipY = Math.floor(Math.random()*(this.worldSettings.height-200)) + 200;

        var ship = new Ship(++this.world.idCount, newShipX, newShipY);
        ship.playerId = playerId;
        this.addObjectToWorld(ship);

        return ship;
    };

    fire(player, inputId) {
        console.log("POW!");
    };

    makeMissile(playerShip, inputId) {
        var missile = new Missile(++this.world.idCount);
        missile.x = playerShip.x;
        missile.y = playerShip.y;
        missile.angle = playerShip.angle;
        missile.playerId = playerShip.playerId;
        missile.inputId = inputId;

        this.addObjectToWorld(missile);
        this.timer.add(40, this.destroyMissile, this, [missile.id]);

        return missile;
    }

    // destroy the missile if it still exists
    destroyMissile(missileId){
        if (this.world.objects[missileId])
            this.removeObjectFromWorld(missileId);
    }
}

module.exports = MyGameEngine;
