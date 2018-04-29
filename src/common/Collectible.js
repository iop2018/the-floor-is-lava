'use strict';

import DynamicObject from 'lance/serialize/DynamicObject';

export default class Collectible extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            // add serializable properties here
        }, super.netScheme);
    }

    get bendingVelocityMultiple() { return 0; }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Collectible;
        this.width = 40;
        this.height = 40;
        this.affectedByGravity = false;
        if (props && props.pickup)
            this.pickup = props.pickup;
    };
}

