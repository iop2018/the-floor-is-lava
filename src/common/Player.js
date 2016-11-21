'use strict';

const DynamicObject= require('incheon').serialize.DynamicObject;

class Player extends DynamicObject {

    static get netScheme() {
        return Object.assign({}, super.netScheme);
    }

    static newFrom(sourceObj) {
        let newPlayer = new Player();
        newPlayer.copyFrom(sourceObj);

        return newPlayer;
    }

    constructor(id, x, y) {
        super(id, x, y);
        this.class = Player;
    };
}

module.exports = Player;
