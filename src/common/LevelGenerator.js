import Platform from './models/Platform';
import TwoVector from 'lance/serialize/TwoVector';
import Collectible from './models/Collectible';
import { nullWeapon } from './models/Weapon';

const SPAWN_HEIGHT = -300;
const INIT_HEIGHT = 1200;
const MAX_SPAWNS_PER_STEP = 100;

const randomFromRange = (left, right) => (Math.random() * (right - left)) + left;

 // not too distant platforms with an occasional mockup weapon
function platformGen(gameEngine) {
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

    return {
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
    };
}

// random floating mockup collectibles
function collGen(gameEngine) {
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
    return {
        getNewDelay: () => randomFromRange(props.MIN_DIFF, props.MAX_DIFF),
        spawn: (height) => {
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
    };
}

const generators = (gameEngine) => [platformGen, collGen].map((fn) => fn(gameEngine));

// TODO refactor the above as subclasses of Spawner
class Spawner {
    constructor({ getNewDelay, spawn, options }) {
        this.countdown = getNewDelay();
        this.getNewDelay = getNewDelay;
        this.spawn = spawn;
        this.spawnHeight = SPAWN_HEIGHT;

        this.options = Object.assign({
            inits: true, // whether level beginning should contain entities of spawned object?
        }, options);
    }

    initWorld(worldSpeed) {
        if (!(this.options && this.options.inits)) return;

        this.spawnHeight = INIT_HEIGHT;
        if (worldSpeed.y > 0) {
            while (this.spawnHeight > SPAWN_HEIGHT) {
                this.step();
                this.spawnHeight -= worldSpeed.y * this.countdown;
                this.countdown = 0;
            }
        }
        this.spawnHeight = SPAWN_HEIGHT;
    }

    step() {
        for (let i = 0; --this.countdown <= 0; i++) {
            this.spawn(this.spawnHeight);
            this.countdown = this.getNewDelay();
            if (i > MAX_SPAWNS_PER_STEP) {
                console.error('Too many spawns, check you delay getter function!');
                return;
            }
        }
    }
}

export default class LevelGenerator {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.generators = generators(gameEngine);

        this.spawners = this.generators.map((gen) => new Spawner(gen));
    }

    initLevel() {
        this.spawners.forEach((s) => s.initWorld(this.gameEngine.worldSpeed));
    }

    step() {
        this.spawners.forEach((s) => s.step());
    }
}
