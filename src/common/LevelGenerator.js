import getSpawners from './spawners';



export default class LevelGenerator {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;

        this.spawners = getSpawners(gameEngine);
    }

    initLevel() {
        this.spawners.forEach((s) => s.initWorld(this.gameEngine.worldSpeed));
    }

    step() {
        this.spawners.forEach((s) => s.step());
    }
}
