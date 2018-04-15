import EventSource from './../utils/EventSource.js';
import * as utils from './../../engine/utils.js';
import { assert } from './../../engine/utils.js';

'use strict';

const errorMessages = {
    invalidStatePath: 'Invalid state path',
    statePathNotSpecified: 'State path weren\'t specified'
};

export default class StateManager extends EventSource {
    constructor() {
        super();

        this.__state = {};
        this.__global = {};
    }

    dispose() {
        this.__state = null;
        super.dispose();
    }

    getScreenState(screen, path) {
        if (!this.__state.hasOwnProperty(screen))
            return null;

        const screenState  = this.__state[screen];
        const value = getStateInternal(screenState, path);
        return utils.clone(value);
        // if (!path)
        //     return utils.clone(screenState);
        //
        // const pathTokens = normalizePath(path);
        // if (!pathTokens.length)
        //     return utils.clone(screenState);
        //
        // let index = 0, node = screenState;
        // do {
        //     node = node[pathTokens[index]];
        //     if (!node)
        //          throw new Error(errorMessages.invalidStatePath);
        //     index++;
        // }
        // while(index < pathTokens.length);
        //
        // return utils.clone(node);
    }

    setScreenState(screen, path, value) {
        if (!path) {
            throw new Error(errorMessages.statePathNotSpecified);
        }

        const pathTokens = normalizePath(path);

        if (!this.__state.hasOwnProperty(screen)) {
            this.__state[screen] = null;
        }

        if (!pathTokens.length) {
            this.__state[screen] = utils.clone(value);
        }
        else {
            let index = 0, node  = this.__state[screen];
            do {
                const token = pathTokens[index];
                if (!node[token]) {
                    node[token] = {};
                }

                node = node[token];
                index++;
            } while (index < (pathTokens.length - 1));

            node[pathTokens[pathTokens.length - 1]] = value;
        }
    }

    getState(path) {
        const result = getStateInternal(this.__global, path);

        return utils.clone(result);
    }

    setState(path, value) {
        this.dispatchEvent(StateManager.evnStateChanged, { path: path, newState: value});

        if (!path) {
            throw new Error(errorMessages.statePathNotSpecified);
        }

        const pathTokens = normalizePath(path);

        if (!pathTokens.length) {
            this.__global = utils.clone(value);
        }
        else {
            let index = 0, node  = this.__global;
            do {
                const token = pathTokens[index];
                if (!node[token]) {
                    node[token] = {};
                }

                node = node[token];
                index++;
            } while (index < (pathTokens.length - 1));

            node[pathTokens[pathTokens.length - 1]] = value;
        }
    }
}

StateManager.evnStateChanged = 'stateChanged';

function getStateInternal(state, path) {
    if (!path)
        return state;

    const pathTokens = normalizePath(path);
    if (!pathTokens.length)
        return state;

    let index = 0, node = state;
    do {
        node = node[pathTokens[index]];
        if (!node)
            throw new Error(errorMessages.invalidStatePath);
        index++;
    }
    while(index < pathTokens.length);

    return node;
}

function normalizePath(path) {
    assert.isString(path);

    const normalizedPath = path.replace(/[\/\\]/gi, '.');
    let tokens = [];
    if (normalizedPath !== '.' && normalizedPath !== '')
        tokens = normalizedPath.split('.').filter(x => x !== '');
}

/*
    Получение состояния, по модулю.
    Сохранение состояния по модулю.
    Получение глобального состояния.
    Обновление глобального состояния.
 */