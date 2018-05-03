'use strict';

const requestAnimationFrame = window.requestAnimationFrame.bind(window);
const cancelAnimationFrame = window.cancelAnimationFrame.bind(window);

export default class GameLoop {
    /**
     * Creates new instance of GameLoop class which implement game loop logic in JS environment
     * @param updateCallback {Function} game state update callback
     * @param renderCallback {Function} frame render update callback
     * @param loopEndCallback {Function} game loop ended callback
     * @param frameDelta {number} time span between two frames
     * @param frameSkipDelta {number} time span between two frames, after which update cycles would be skipped
     */
    constructor(updateCallback, renderCallback, loopEndCallback,  frameDelta, frameSkipDelta) {
        this.frameDelta = frameDelta || GameLoop.defaultDelta;
        this.frameSkipDelta = frameSkipDelta || (this.frameDelta * 5);
        this.update = updateCallback;
        this.render = renderCallback;
        this.loopEnd = loopEndCallback || null;

        this.lastUpdate = null;
        this.handle = null;

        this.__run = false;
        this.__bindedLoop = this.__loop.bind(this);
        this.__bindedStop = this.stop.bind(this);
    }

    get isRunning() { return this.__run; }

    /**
     * Starts looping
     */
    start() {
        this.stop();
        this.__run = true;
        this.handle = requestAnimationFrame(this.__bindedLoop);
    }

    /**
     * Stops looping
     */
    stop() {
        if (this.handle) {
            cancelAnimationFrame(this.handle);
            this.handle = null;
        }

        this.__run = false;
    }

    __loop(timeStamp) {
        if (!this.__run) {
            if (this.loopEnd)
                setTimeout(this.loopEnd, 0);
            return;
        }

        this.handler = requestAnimationFrame(this.__bindedLoop);

        if (!timeStamp) {
            this.lastUpdate = timeStamp;
            return;
        }

        var shouldContinue;
        var diff = timeStamp - this.lastUpdate;
        if (diff >= this.frameSkipDelta) {
            // if too much time passed between two this.__loop() calls, we just skipping missing update cycles
            this.lastUpdate = timeStamp;
            shouldContinue = this.update(this.frameDelta, true);
            shouldContinue = shouldContinue && this.render(this.frameDelta, true);
        }
        else {
            shouldContinue = true;
            while (diff >= this.frameDelta) {
                diff -= this.frameDelta;
                this.lastUpdate += this.frameDelta;

                shouldContinue = this.update(this.frameDelta, false);
                if (!shouldContinue)
                    break;
            }

            shouldContinue = shouldContinue && this.render(this.frameDelta, false);
        }

        if (!shouldContinue)
            this.stop();
    }
}

GameLoop.defaultDelta = 1000 / 60;