// random floating mockup collectibles
import Spawner, { randomFromRange } from '../Spawner';
import Collectible from '../models/Collectible';
import { nullWeapon } from '../models/Weapon';
import TwoVector from 'lance/serialize/TwoVector';

const props = {
    MIN_DIFF: 165,
    MAX_DIFF: 1075,
    Y_SPEED_SCALE: 3,
    X_SPEED_SCALE: 2,
    MIN_X: 120,
    MAX_X: 1700,
    MIN_Y: 70,
    MAX_Y: 800,
};

export default class collGen extends Spawner {
    constructor(gameEngine) {
        super({
            getNewDelay: () => randomFromRange(props.MIN_DIFF, props.MAX_DIFF),
            spawn: () => {
                const xPos = randomFromRange(props.MIN_X, props.MAX_X);
                const yPos = randomFromRange(props.MIN_Y, props.MAX_Y);
                gameEngine.addObjectToWorld(
                new Collectible(gameEngine, null, {
                    position: new TwoVector(xPos, yPos),
                    velocity: new TwoVector((Math.random() - 0.5) * props.X_SPEED_SCALE,
                        (Math.random() - 0.5) * props.Y_SPEED_SCALE),
                    pickup: nullWeapon(gameEngine)  // TODO change to some real collectible
                })
            );
            },
            options: {
                inits: false,
            },
        });
    }
}
