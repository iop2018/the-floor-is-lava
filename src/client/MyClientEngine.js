import ClientEngine from 'lance/ClientEngine';
import MyRenderer from '../client/MyRenderer';
import KeyboardControls from 'lance/controls/KeyboardControls';
import Player from '../common/models/Player';

export default class MyClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, MyRenderer);

        this.controls = new KeyboardControls(this);
        const bindKey = this.controls.bindKey.bind(this.controls);
        this.comments = ['Are you crying yet?', 'That was lame', 'Seriously, are you retarded?',
            'You\'re pathetic, you know that?', 'Nothing makes me happier than watching you fail', 'Wow, you really suck',
            'Can you focus for a second?', 'It\'s official. You\'re retarded', 'WTF WAS THAT?', 'You\'re sooo dumb',
            'LOL', 'Hahaha', 'You lost, man.', 'I bet you loose this time too', 'Maybe turn your brain on',
            'How about not dying this time?', 'No, not like that', 'Not gonna happen for you, bro'];
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

        // something like the line below seems to be necessary, will add soon
        // this.gameEngine.once('renderer.ready', () => {
        // click event for "try again" button
        document.querySelector('#startGame').addEventListener('click', () => {
            this.hideReplayButton();
            this.socket.emit('requestRestart');
        });
        // });
    }

    showReplayButton() {
        this.comment.textContent = this.comments[Math.floor(Math.random() * this.comments.length)];
        this.replayButton.disabled = false;
        this.guiContainer.style.opacity = 1;
    }

    hideReplayButton() {
        this.replayButton.disabled = true;
        this.guiContainer.style.opacity = 0;
    }
}
