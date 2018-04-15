import EventSource from './../utils/EventSource.js';

'use strict';

/**
 * @implements {IGameScreen}
 * @implements {IEventSource}
 */
export default class BattleScreen extends EventSource {
    constructor(screenNode) {
        super();

        this.domNode = screenNode;

        this._backgroundMusicPlayer = document.querySelector('#background-music');

        // assetManager.loadAssetManifest().then(() => {
        //     backgroundMusicPlayer.stop();
        // });
    }

    dispose()
    {
    }

    show()
    {
    }
}
