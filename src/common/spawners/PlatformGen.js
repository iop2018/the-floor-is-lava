'use strict';

import Spawner, { randomFromRange } from '../Spawner';
import { nullWeapon } from '../models/Weapon';
import TwoVector from 'lance/serialize/TwoVector';
import Platform from '../models/Platform';
import Collectible from '../models/Collectible';

const props = {
    MIN_HEIGHT: 68,
    MAX_HEIGHT: 75,
    MIN_DIST: 130,
    MAX_DIST: 600,
    MIN_X: -150,
    MAX_X: 1800,
    QUEUE_LENGTH: 2,
    COLLECTIBLE_CHANCE: 1/30,
};

// Array of zeroes with size = QUEUE_LENGTH
let xPosQueue = new Array(props.QUEUE_LENGTH+1).join('0').split('').map(parseFloat);

/**
 * Returns new, randomized X position being:
 *   - ranged between MIN_X and MAX_X
 *   - distant from value returned QUEUE_LENGTH calls before current one
 *     with a distance between MIN_DIST and MAX_DIST
 * @returns {Number}
 */
function newPlatformXPos() {
    const lastXPos = xPosQueue.shift();
    const offset = props.MAX_DIST - props.MIN_DIST;
    const leftLim = Math.max(props.MIN_X + props.MIN_DIST, lastXPos - offset);
    const rightLim = Math.min(props.MAX_X - props.MIN_DIST, lastXPos + offset);

    const relXPos = randomFromRange(leftLim, rightLim);

    const sign = relXPos - lastXPos > 0 ? 1 : -1;
    const newXPos = relXPos + (sign * props.MIN_DIST);
    xPosQueue.push(newXPos);
    return newXPos;
}

// not too distant platforms with an occasional mockup weapon
export default class PlatformGen extends Spawner {
    constructor(gameEngine) {
        super({
            getNewDelay: () => {
                const yPxPerStep = gameEngine.worldSpeed.y;
                return randomFromRange(props.MIN_HEIGHT / yPxPerStep, props.MAX_HEIGHT / yPxPerStep);
            },
            spawn: (height) => {
                const xPos = newPlatformXPos();
                gameEngine.addObjectToWorld(
                new Platform(gameEngine, null, { position: new TwoVector(xPos, height) })
            );
                if (Math.random() < props.COLLECTIBLE_CHANCE)
                    gameEngine.addObjectToWorld(
                    new Collectible(gameEngine, null, {
                        position: new TwoVector(xPos, height - 50),
                        pickup: nullWeapon(gameEngine)  // TODO change to some real weapon
                    })
                );
            },
            options: {
                inits: true,
            },
        });
    }
}
