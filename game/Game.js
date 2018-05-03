import LogoScreen from './screens/LogoScreen.js';
import MainMenuScreen from './screens/MainMenuScreen.js';
import BattleScreen from './screens/BattleScreen.js';
import * as html from './utils/html.js';

'use strict';

export default class Game {
    constructor(domRoot, serviceLocator, logger, stateManager, assetManager, localizationManager) {
        this.stateManager = stateManager;
        this.assetManager = assetManager;
        this.localizationManager = localizationManager;

        const battleDomNode = domRoot.querySelector('.battle-view');
        const optionsDomNode = domRoot.querySelector('.main-menu-view');

        const canvas = html.createHighDpiCanvas(800, 600);
        domRoot.appendChild(canvas);

        serviceLocator.registerInstance('view', canvas);

        /** @type {{battle: BattleScreen, options: MainMenuScreen}} */
        this.screens = {
            logo: new LogoScreen(canvas, serviceLocator),
            battle: new BattleScreen(battleDomNode, serviceLocator),
            options: new MainMenuScreen(canvas, serviceLocator)
        };

        this.screens.logo.on('close', () => {
            this.screens.options.show();
            canvas.style.display = 'none';
        });
        this.screens.options.on('new-game', this.startNewGame, this);
    }

    run() {
        const loadLocalePromise = this.localizationManager.setLocalization('en-us');
        const loadAssetManifestPromise = this.assetManager.loadAssetManifest();

        Promise.all([loadLocalePromise, loadAssetManifestPromise, this.screens.logo.ready]).then(() => {
            this.screens.logo.show();
        });
    }

    startNewGame() {

    }
}