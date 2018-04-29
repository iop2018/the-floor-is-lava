'use strict';

import DynamicObject from 'lance/serialize/DynamicObject';

export default class Bullet extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            // add serializable properties here
        }, super.netScheme);
    }

    get bendingMultiple() { return 0.5; }
    get bendingVelocityMultiple() { return 0; }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Bullet;
        this.width = 5;
        this.height = 5;
        this.affectedByGravity = false;
        if (props && props.onCollisionFunction)
            this.onCollisionFunction = props.onCollisionFunction;
        else
            this.onCollisionFunction = (e) => {};
    };
}
