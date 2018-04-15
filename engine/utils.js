'use strict';

// TODO: Implement different error types
export const assert = {
    hasValue: function(value, message) {
        if (!value && value !== false)
            throw new Error(message);
    },

    isTrue: function (value, message) {
        if (!value)
            throw new Error(message);
    },

    isString: function (value, message) {
        if (typeof value !== 'string')
            throw new Error(message);
    },

    isNumber: function (value, message) {
        if (typeof value != 'number')
            throw new Error(message);
    },

    isFunction: function (value, message) {
        if (typeof value !== 'function')
            throw new Error(message);
    }
};

export function clone(source) {
    if (source === null || source === undefined)
        return source;

    const sourceType = typeof source;

    var copy ;
    if (Array.isArray(source) || source.hasOwnProperty('length')) {
        return cloneArray(source);
    }

    if (sourceType === 'object') {
        return cloneObject(source);
    }

    return source;

    function cloneObject(source) {
        const copy = {};
        for (const propertyName in source) {
            if (!source.hasOwnProperty(propertyName)) continue;

            copy[propertyName] = clone(source[propertyName]);
        }

        return copy;
    }

    function cloneArray(source) {
        const copy = [];
        for (let index = 0; index < source.length; index++) {
            copy[index] = clone(source[index]);
        }

        return copy;
    }
}