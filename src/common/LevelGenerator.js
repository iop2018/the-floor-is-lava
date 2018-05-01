import Platform from './Platform';
import TwoVector from 'lance/serialize/TwoVector';

const SPAWN_HEIGHT = -300;

class Spawner {
    constructor(getNewDelay, spawn) {
        this.countdown = getNewDelay();
        this.getNewDelay = getNewDelay;
        this.spawn = spawn;
    }

    step() {
        if (--this.countdown === 0) {
            this.spawn();
            this.countdown = this.getNewDelay();
        }
    }
}

export default class LevelGenerator {
    constructor(gameEngine, options) {
        this.gameEngine = gameEngine;
        this.options = Object.assign({
            platformStepDelay: () => 40, // TODO depend on distances (basing on world speed (and, later, accel))
                                         // instead of just steps
        }, options);

        this.spawners = [
            new Spawner(() => this.options.platformStepDelay(), () => this.spawnPlatform()),
        ];
    }

    // TODO add LevelGenerator-based level initialization

    step() {
        this.spawners.forEach((s) => s.step());
    }

    spawnPlatform() {
        this.gameEngine.addObjectToWorld(
            new Platform(this.gameEngine, null, { position: new TwoVector(200 + Math.random() * 1500, SPAWN_HEIGHT) })
        );
    }
}
