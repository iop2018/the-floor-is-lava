'use strict';

import DynamicObject from 'lance/serialize/DynamicObject';

export default class Weapon extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            // add serializable properties here
        }, super.netScheme);
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Weapon;
        this.shootFunction = (e) => {};
        this.name = null;
        this.bullets = 1;
        if (props) {
            if (props.bullets)
                this.bullets = props.bullets;
            if (props.shootFunction)
                this.shootFunction = props.shootFunction;
            if (props.name)
                this.name = props.name;
        }
    };
}
