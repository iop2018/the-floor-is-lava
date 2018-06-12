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
        this.width = 200;  // TODO support props
        this.height = 35;
        this.affectedByGravity = false;
        this.angle = 0;
    };

    handlePlayerCollision(player) {
        console.log(`Platform: handlePlayerCollision: player ${player.id} with platform ${this.id}`);

        // vertical collision
        if (player.position.y <= this.position.y) {
            if (player.velocity.y > 0) {
                // position player on top and prevent falling down

                player.position.y = this.position.y - (this.height + player.height) / 2 + 0.01; // margin for collisions

                player.affectedByGravity = false;
                player.velocity.y = this.velocity.y;
                // players on platform are different: they can jump
                player.onPlatform = true;
            }
        }
    }

    static handlePlayerOff(player) {
        player.affectedByGravity = true;
        player.onPlatform = false;
    }
}
