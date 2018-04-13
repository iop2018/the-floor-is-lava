'use strict';

import DynamicObject from 'lance/serialize/DynamicObject';

export default class Player extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            // add serializable properties here
        }, super.netScheme);
    }

    get bendingVelocityMultiple() { return 0; }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        if (props && props.playerId)
            this.playerId = props.playerId;
        this.class = Player;
    };

    onAddToWorld(gameEngine) {
        if (gameEngine && gameEngine.renderer) {
            gameEngine.renderer.addSprite(this, 'player');
        }
    }
}
