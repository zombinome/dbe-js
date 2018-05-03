'use strict';

export default class SoundManager {
    /**
     * @param domContainer {HTMLElement}
     */
    constructor(domContainer) {
        this._domContainer = domContainer
    }

    /**
     * @param soundId {string}
     * @returns {number}
     */
    playSound(soundId) {}

    /**
     * @param soundHandle {number}
     * @returns {boolean}
     */
    stopSound(soundHandle) {}

    /**
     * @param musicId {string}
     * @returns {number}
     */
    playMusic(musicId) {}

    /**
     * @param musicHandle {number}
     * @returns {boolean}
     */
    stopMusic(musicHandle) {}
}
