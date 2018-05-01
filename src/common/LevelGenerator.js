import Platform from './models/Platform';
import TwoVector from 'lance/serialize/TwoVector';

const SPAWN_HEIGHT = -300;
const INIT_HEIGHT = 1200;
const MAX_SPAWNS_PER_STEP = 100;

class Spawner {
    constructor(getNewDelay, spawn) {
        this.countdown = getNewDelay();
        this.getNewDelay = getNewDelay;
        this.spawn = spawn;
        this.spawnHeight = SPAWN_HEIGHT;
    }

    initWorld(worldSpeed) {
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
    constructor(gameEngine, options) {
        this.gameEngine = gameEngine;
        this.options = Object.assign({
            platformStepDelay: () => 40,  // TODO refactor how we feed functions to this constructor
        }, options);

        this.spawners = [
            [this.options.platformStepDelay.bind(this), this.spawnPlatform.bind(this)],
        ].map((argList) => new Spawner(...argList));
    }

    initLevel() {
        this.spawners.forEach((s) => s.initWorld(this.gameEngine.worldSpeed));
    }

    step() {
        this.spawners.forEach((s) => s.step());
    }

    spawnPlatform(height) {
        this.gameEngine.addObjectToWorld(
            new Platform(this.gameEngine, null, { position: new TwoVector(-150 + Math.random() * 2000, height) })
        );
    }
}

