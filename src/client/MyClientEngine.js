import ClientEngine from 'lance/ClientEngine';
import MyRenderer from '../client/MyRenderer';
import KeyboardControls from 'lance/controls/KeyboardControls';

export default class MyClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, MyRenderer);

        this.controls = new KeyboardControls(this);
        const bindKey = this.controls.bindKey.bind(this.controls);

        bindKey(['up', 'w'], 'up', { repeat: false });
        bindKey(['down', 's'], 'down', { repeat: true });
        bindKey(['left', 'a'], 'left', { repeat: true });
        bindKey(['right', 'd'], 'right', { repeat: true });
        bindKey('space', 'jump');
        bindKey('enter', 'enter');
        bindKey(['z', 'shift'], 'shoot');
    }

    start() {
        super.start();

        document.addEventListener('mousemove', (e) => {
            this.sendInput('mousePos', {
                x: (e.clientX - this.renderer.canvas.offsetLeft) * this.renderer.RATIO,
                y: (e.clientY - this.renderer.canvas.offsetTop) * this.renderer.RATIO
            });
        });

        document.addEventListener('click', (e) => {
            this.sendInput('shoot');
        });
    }
}
