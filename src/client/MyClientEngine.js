import ClientEngine from 'lance/ClientEngine';
import MyRenderer from '../client/MyRenderer';
import KeyboardControls from 'lance/controls/KeyboardControls';
import Player from '../common/models/Player';

export default class MyClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, MyRenderer);

        this.controls = new KeyboardControls(this);
        const bindKey = this.controls.bindKey.bind(this.controls);
        this.comments = ['You fell into lava!', 'Try to avoid lava next time!', 'Jump higher!', 'You drowned in lava!', 'You must jump to stay alive!'];
        this.comment = document.querySelector('#comment');
        this.replayButton = document.querySelector('#startGame');
        this.guiContainer = document.querySelector('#guiContainer');

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

        this.comment.textContent = 'So you click to start the game';
        // handle gui for game condition
        this.gameEngine.on('objectDestroyed', (obj) => {
            if (obj instanceof Player && this.gameEngine.isOwnedByPlayer(obj)) {
                this.showReplayButton();
            }
        });

        // click event for "try again" button
        document.querySelector('#startGame').addEventListener('click', () => {
            this.hideReplayButton();
            this.socket.emit('requestRestart');
        });

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
    
    showReplayButton() {
        this.comment.textContent = this.comments[Math.floor(Math.random() * this.comments.length)];
        this.replayButton.disabled = false;
        this.guiContainer.style.opacity = 1;
    }

    hideReplayButton() {
        this.replayButton.textContent = 'Replay!' // this will be gone soon anyway
        this.replayButton.disabled = true;
        this.guiContainer.style.opacity = 0;
    }    
}






        

