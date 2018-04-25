'use strict';

import DynamicObject from 'lance/serialize/DynamicObject';

export default class Player extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            // add serializable properties here
        }, super.netScheme);
    }

    get bendingMultiple() { return 0.5; }
    get bendingVelocityMultiple() { return 0; }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        if (props && props.playerId)
            this.playerId = props.playerId;
        this.class = Player;
        this.width = 25;
        this.height = 25;
        this.affectedByGravity = false;
        this.onPlatform = false;
    };
}
