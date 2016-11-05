const ClientEngine = require('incheon').ClientEngine;


class NewClientEngine extends ClientEngine{
    constructor(gameEngine, options){
        super(gameEngine, options);

        this.serializer.registerClass(require('../common/Player'));
        this.gameEngine.on('client.preStep', this.preStep.bind(this));
    }

    start() {
        var that = this;

        super.start();

        //  Game input
        // TODO: clean up this code it's all phaser stuff
        //     not relevant in a boilerplate situation
        this.cursors = game.input.keyboard.createCursorKeys();
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.sounds = {
            fireMissile: game.add.audio('fireMissile'),
            missileHit: game.add.audio('missileHit')
        };

        this.gameEngine.on("fireMissile", => { this.sounds.fireMissile.play(); });
        this.gameEngine.on("missileHit", => { this.sounds.missileHit.play(); });
    }

    // our pre-step is to process all inputs
    preStep() {

        // continuous press
        if (this.cursors.up.isDown) {
            this.sendInput('up', { movement: true } );
        }

        if (this.cursors.left.isDown) {
            this.sendInput('left', { movement: true });
        }

        if (this.cursors.right.isDown) {
            this.sendInput('right', { movement: true });
        }

        // single press
        if (this.spaceKey.isDown && this.spaceKey.repeats == 0){
            this.sendInput('space');
        }
    }
}


module.exports = NewClientEngine;
