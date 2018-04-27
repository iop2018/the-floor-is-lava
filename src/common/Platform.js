'use strict';

import DynamicObject from 'lance/serialize/DynamicObject';

export default class Platform extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            // add serializable properties here
        }, super.netScheme);
    }

    get bendingVelocityMultiple() { return 0; }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Platform;
        this.width = 100;
        this.height = 25;
        this.affectedByGravity = false;
        this.angle = 0;
    };
}
