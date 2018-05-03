'use strict';

var handlerCounter = 0;

/**
 * @type {EventSource}
 * @implements {IEventSource}
 * @implements {IDisposable}
 * @export
 */
export default class EventSource {
    constructor() {
        this.__handlers = {};
        this.__disposed = false;
    }

    /**
     * Subscribes event source to event handler
     * @param event {string} Event name
     * @param handler {Function}
     * @param [context] {*}
     * @returns {number} subscription ID required to unsubscribe handler from event
     */
    on(event, handler, context) {
        this._throwIfDisposed();

        if (!this.__handlers[event]) {
            this.__handlers[event] = [];
        }

        const subscriptionId = ++handlerCounter;
        this.__handlers[event].push([subscriptionId, handler, context || null]);
        return subscriptionId;
    }

    once(event, handler, context) {
        this._throwIfDisposed();

        if (!this.__handlers[event]) {
            this.__handlers[event] = [];
        }

        const subscriptionId = ++handlerCounter;
        const wrapper = function(eventArgs, sender) {
            off(event, subscriptionId);
            handler.call(this, eventArgs, sender);
        };
        this.__handlers[event].push([subscriptionId, wrapper, context || null]);
        return subscriptionId;
    }

    off(event, subscriptionId) {
        this._throwIfDisposed();

        if (this.__handlers[event]) {
            if  (arguments.length > 1)
                this.__handlers[event] = this.__handlers[event].filter(h => h[0] !== subscriptionId);
            else
                this.__handlers[event] = null;
        }
    }

    /**
     * Raises new event
     * @param event {string} event name
     * @param [eventArgs] {*} object, containing event arguments
     */
    dispatchEvent(event, eventArgs) {
        this._throwIfDisposed();

        const handlers = this.__handlers[event];
        if (!handlers || !handlers.length) return;

        for (let i = 0; i < handlers.length; i++)
        {
            const handler = handlers[i][1];
            const context = handlers[i][2];
            setTimeout(() => handler.call(context, eventArgs, this), 0);
        }
    }

    dispose() {
        this.__handlers = null;
        this.__disposed = true;
    }

    _throwIfDisposed() {
        if (this._disposed)
            throw new Error(typeof(this) + ' is already disposed');
    }
}
