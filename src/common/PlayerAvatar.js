'use strict';

const DynamicObject= require('incheon').serialize.DynamicObject;

class PlayerAvatar extends DynamicObject {

    static get netScheme() {
        return Object.assign({}, super.netScheme);
    }

    constructor(id, x, y) {
        super(id, x, y);
        this.class = PlayerAvatar;
    };
}

module.exports = PlayerAvatar;
