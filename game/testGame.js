import Locator from './utils/Locator.js';

import AssetManager from './managers/AssetManager.js';
import LocalizationManager from './managers/LocalizationManager.js';
import StateManager from './managers/StateManager.js';
import LayoutManager from './managers/LayoutManager.js';

import * as dbe from './../engine/battle/dbe.js';

import TestGame from './Game.js';

'use strict';

const serviceRegistrations = {
    'assetManager':        ['c', AssetManager,        'singleton', ['./../assets']],
    'localizationManager': ['c', LocalizationManager, 'singleton', ['./../localizations']],
    'stateManager':        ['c', StateManager,        'singleton', null, null],
    'layoutManager':       ['c', LayoutManager,       'perResolve', null, null],
    'logger': ['f', loggerFactory, 'perResolve', null, ['@']],
    'game': ['c', TestGame, 'singleton', null, ['domRoot', 'locator', 'logger', 'stateManager', 'assetManager', 'localizationManager']]
};

function loggerFactory(loggerName) {
    return console.log.bind(console, loggerName + ':');
}

window.launchGame = function () {
    const launchGameButton = document.getElementById('launch-game-button');
    launchGameButton.style.display = "none";

    const parties = loadParties();

    const battle = new dbe.Battle(parties.attackers, parties.defenders);
    const unitsQueue = battle.getUnitsQueue();

    //const backgroundMusicPlayer = document.querySelector('#background-music');

    // load assets
    // load units
    // init ui
    // go to some initial game phase
    // game consist of several phases, and could switch from one to another
    // what to do with load screen?

    const locator = new Locator();
    locator.register(serviceRegistrations);

    const domRoot = document.querySelector('.game-viewport');
    locator.registerInstance('domRoot', domRoot);
    locator.resolve('game').then(game => { game.run(); });
};

function loadParties() {
    return {
        attackers: [],
        defenders: []
    };
}
