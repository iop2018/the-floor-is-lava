'use strict';

import DynamicObject from 'lance/serialize/DynamicObject';

class PlayerAvatar extends DynamicObject {

    static get netScheme() {
        return Object.assign({}, super.netScheme);
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = PlayerAvatar;
    };
}

module.exports = PlayerAvatar;
