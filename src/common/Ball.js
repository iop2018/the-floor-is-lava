"use strict";


const DynamicObject= require('incheon').serialize.DynamicObject;

class Ball extends DynamicObject {

    static get netScheme() {
        return Object.assign({}, super.netScheme);
    }

    static newFrom(sourceObj) {
        var newBall = new Ball();
        newBall.copyFrom(sourceObj);

        return newBall;
    }

    constructor(id, x, y) {
        super(id, x, y);
        this.class = Ball;
    };
}


module.exports = Ball;
