'use strict';

import DynamicObject from 'lance/serialize/DynamicObject';
import Serializer from 'lance/serialize/Serializer';

export default class Weapon extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            name: { type: Serializer.TYPES.STRING },
            bullets: { type: Serializer.TYPES.INT16 }
        });
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Weapon;
        this.shootFunction = (e) => {};
        this.name = null;
        this.bullets = 0;
        if (props) {
            if (props.bullets)
                this.bullets = props.bullets;
            if (props.shootFunction)
                this.shootFunction = props.shootFunction;
            if (props.name)
                this.name = props.name;
        }
    };

    syncTo(other) {
        this.name = other.name;
        this.bullets = other.bullets;
    }
}

// We can't let player hold null weapon, because serializer crashes.
// Therefore we create nullWeapon.
export function nullWeapon(gameEngine) {
    return new Weapon(gameEngine, null, { name: 'None' });
}
export function isNullWeapon(weapon) {
    return weapon.name == 'None';
}