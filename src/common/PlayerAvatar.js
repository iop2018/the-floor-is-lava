'use strict';

const DynamicObject= require('lance-gg').serialize.DynamicObject;

class PlayerAvatar extends DynamicObject {

    static get netScheme() {
        return Object.assign({}, super.netScheme);
    }

    constructor(id, position, velocity) {
        super(id, position, velocity);
        this.class = PlayerAvatar;
    };
}

module.exports = PlayerAvatar;
