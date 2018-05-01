import Platform from './models/Platform';
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
            platformStepDelay: () => 40,  // TODO refactor how we feed functions to this constructor
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
            new Platform(this.gameEngine, null, { position: new TwoVector(-150 + Math.random() * 2000, SPAWN_HEIGHT) })
        );
    }
}
