import ClientEngine from 'lance/ClientEngine';
import MyRenderer from '../client/MyRenderer';
import KeyboardControls from 'lance/controls/KeyboardControls';

export default class MyClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, MyRenderer);

        this.controls = new KeyboardControls(this);
        [
            [['up', 'w'], 'up', { repeat: false }],
            [['down', 's'], 'down', { repeat: true }],
            [['left', 'a'], 'left', { repeat: true }],
            [['right', 'd'], 'right', { repeat: true }],
            ['space', 'jump'],
            ['enter', 'enter'],
            [['z', 'shift'], 'shoot'],
        ].forEach((argList) => this.controls.bindKey(...argList));
    }
}
