import ClientEngine from 'lance/ClientEngine';
import MyRenderer from '../client/MyRenderer';
import KeyboardControls from 'lance/controls/KeyboardControls';

export default class MyClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, MyRenderer);

        this.controls = new KeyboardControls(this);
        this.controls.bindKey('up', 'up', { repeat: true } );
        this.controls.bindKey('down', 'down', { repeat: true } );
        this.controls.bindKey('left', 'left', { repeat: true });
        this.controls.bindKey('right', 'right', { repeat: true });
        this.controls.bindKey('space', 'space');
    }

}
