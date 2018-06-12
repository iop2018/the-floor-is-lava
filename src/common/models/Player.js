'use strict';

import DynamicObject from 'lance/serialize/DynamicObject';
import Serializer from 'lance/serialize/Serializer';
import { nullWeapon } from './Weapon';
import TwoVector from 'lance/serialize/TwoVector';

export default class Player extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            equippedWeapon: { type: Serializer.TYPES.CLASSINSTANCE }
        }, super.netScheme);
    }

    get bendingMultiple() { return 0.5; }
    get bendingVelocityMultiple() { return 1; }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        if (props && props.playerId)
            this.playerId = props.playerId;
        this.class = Player;
        this.width = 25;
        this.height = 25;
        this.mouseXPosition = 0;
        this.mouseYPosition = 0;
        this.affectedByGravity = false;
        this.onPlatform = false;
        if (props && props.equippedWeapon)
            this.equippedWeapon = props.equippedWeapon;
        else
            this.equippedWeapon = nullWeapon(gameEngine, this.playerId);
    };


    forceUpdate() {
        let modified = this.bendingIncrements > 0;
        while (this.bendingIncrements) {
            this.applyIncrementalBending();
        }
        return modified;
    };

    syncTo(other) {
        super.syncTo(other);
        this.equippedWeapon = other.equippedWeapon;
    };

    // This function returns TwoVector from player position to mouse position.
    // Velocity is calculated as unit vector (of length 1) and multiplied by multiplier
    velocityTowardsMouse(multiplier) {
        let deltaX = this.mouseXPosition - this.position.x;
        let deltaY = this.mouseYPosition - this.position.y;
        if (deltaX === 0 && deltaY === 0) // edge case
            return new TwoVector(multiplier, 0);
        return new TwoVector(deltaX, deltaY).normalize().multiplyScalar(multiplier);
    };
}
