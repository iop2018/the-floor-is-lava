const SPAWN_HEIGHT = -300;
const INIT_HEIGHT = 1200;
const MAX_SPAWNS_PER_STEP = 100;

export function randomFromRange(left, right) {
    return (Math.random() * (right - left)) + left;
}

export default class Spawner {
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
