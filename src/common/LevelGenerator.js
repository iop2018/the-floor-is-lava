import Platform from './Platform';
import TwoVector from 'lance/serialize/TwoVector';

const SPAWN_HEIGHT = -300;

class Spawner {
    constructor(getFreq, spawn) {
        this.countdown = getFreq();
        this.getFreq = getFreq;
        this.spawn = spawn;
    }

    step() {
        if (--this.countdown === 0) {
            this.spawn();
            this.countdown = this.getFreq();
        }
    }
}

export default class LevelGenerator {
    constructor(gameEngine, options) {
        this.gameEngine = gameEngine;
        this.options = Object.assign({
            platformStepFreq: () => 70,  // TODO depend on distances (basing on world speed (and, later, accel))
                                         // instead of just steps
        }, options);

        this.spawners = [
            new Spawner(() => this.options.platformStepFreq(), () => this.spawnPlatform()),
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
