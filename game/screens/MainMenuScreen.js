import EventSource from './../utils/EventSource.js';
import * as html from './../utils/html.js';

'use strict';

/**
 * @implements {IGameScreen}
 */
export default class MainMenuScreen extends EventSource {
    /**
     * @param canvas {HTMLCanvasElement}
     * @param serviceLocator {IServiceLocator}
     */
    constructor(canvas, serviceLocator) {
        super();

        const screenNode = canvas.parentElement;

        /** @type {HTMLCanvasElement} */ this._canvas = canvas;

        /** @type {IAssetManager} */ this.assetManager = null;
        /** @type {ILayoutManager} */ this.layoutManager = null;

        this.domNode = screenNode.querySelector('div.main-menu-view');

        /** @type {{ newGame: HTMLElement, options: HTMLElement }} */
        this.buttons = {
            newGame: screenNode.querySelector('button.new-game'),
            options: screenNode.querySelector('button.options')
        };

        this.buttons.newGame.addEventListener('click', this._newGameClicked.bind(this));
        this.buttons.options.addEventListener('click', this._optionsClicked.bind(this));

        // TODO: replace with audio manager
        /** @type {HTMLAudioElement} */
        this._backgroundMusicPlayer = document.querySelector('#background-music');

        const assetManagerPromise = serviceLocator.resolve('assetManager')
            .then(assetManager => {
                this.assetManager = assetManager;
                return assetManager.loadAssetManifest();
            });

        /** @type {Promise} */
        this.ready = Promise.all([assetManagerPromise]);
    }

    /**
     * IDisposable.dispose() implementation
     */
    dispose() {
        this._backgroundMusicPlayer.stop();

        this.buttons.newGame.removeEventListener('click');
        this.buttons.options.removeEventListener('click');

        super.dispose();
    }

    /**
     * IGameScreen.getState() implementation
     * @returns {null}
     */
    getState() {
        return null;
    }

    /**
     * IGameScreen.setState() implementation
     * @param newState
     */
    setState(newState) {
    }

    show() {
        html.removeClass(this.domNode, 'hidden');
        this.ready.then(() => {
            this._backgroundMusicPlayer.src = this.assetManager.getAssetUri('audio', 'm-main-menu');
            this._backgroundMusicPlayer.play();
        });
    }

    hide() {
        html.addClass(this.domNode, 'hidden');
    }

    _newGameClicked() {
        this.dispatchEvent('new-game');
    }

    _optionsClicked() {
        // TODO: Implement dummy options menu
    }
}
