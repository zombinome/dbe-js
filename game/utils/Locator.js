import {assert} from './../../engine/utils.js';

'use strict';

/*
 * For instance registration:
 * register('serviceName', ['instance', serviceInstance])
 *
 * For factory of service registration:
 * register('serviceName', ['factory|service'], factory|constructor, 'perResolve|singleton', [argumentValues], [dependenciesToInject]
 * '#' - inserts service name
 * '@' - inserts parent service name
 *
 */

const errorMessages = {
    invalidArguments: 'Invalid arguments were supplied to method',
    serviceNotRegistered: 'Service not registered',
    unsupportedInitializerType: 'Provided initializer type value is not supported',
    unsupportedLifetimePolicy: 'Provided lifetime policy is not supported'
};

export const initializerTypes = {
    instance: 'instance',
    factory: 'factory',
    constructor: 'constructor',
    i: 'i',
    f: 'f',
    c: 'c'
};

export const lifetimePolicies = {
    perResolve: 'perResolve',
    singleton: 'singleton'
};

/**
 * @implements {IServiceLocator}
 */
export default class Locator {
    constructor() {
        this.__dependencies = {
            locator: new DependencyInfo(null, this)
        };
    }

    /**
     * @param serviceName {string|object}
     * @param [rule] Array
     */
    register(serviceName, rule) {
        assert.hasValue(serviceName);

        if (arguments.length === 0 || arguments.length > 2)
            throw new Error(errorMessages.invalidArguments);

        const argType = typeof arguments[0];
        if (argType === 'object' && arguments.length === 1)
            Object.entries(arguments[0]).forEach(entry => this.register(entry[0], entry[1]));
        else if (argType === 'string' && arguments.length === 2)
            this.__dependencies[serviceName] = new DependencyInfo(rule);
        else
            throw new Error(errorMessages.invalidArguments);
    }

    registerInstance(serviceName, value) {
        if (arguments.length !== 2 && typeof serviceName !== 'string')
            throw new Error(errorMessages.invalidArguments);

        this.__dependencies[serviceName] = new DependencyInfo(null, value);
    }

    resolve(serviceName) {
        assert.isString(serviceName);
        assert.hasValue(serviceName);

        if (!this.__dependencies.hasOwnProperty(serviceName)) {
            let error = new Error(errorMessages.serviceNotRegistered + ': ' + serviceName);
            return Promise.reject(error);
        }

        const dependency = this.__dependencies[serviceName];
        if (!!dependency.value)
            return Promise.resolve(dependency.value);

        const initializerType = dependency.rule[0],
            initializer = dependency.rule[1];

        if (initializerType === initializerTypes.instance || initializerType == initializerTypes.i) {
            dependency.value = initializer;
            return Promise.resolve(dependency.value);
        }

        const lifetimePolicy = dependency.rule[2];
        const argsPromise = getArgs(this, dependency.rule[3], dependency.rule[4], serviceName);
        let resolvePromise;
        if (initializerType === initializerTypes.factory || initializerType == initializerTypes.f) {
            resolvePromise = argsPromise.then(args => initializer.apply(null, args));
        }
        else if (initializerType === initializerTypes.constructor || initializerType == initializerTypes.c) {
            resolvePromise = argsPromise.then(args => {
                args.unshift(null);
                let constructor = Function.prototype.bind.apply(initializer, args);
                return new constructor();
            });
        }
        else {
            const error = new Error(errorMessages.unsupportedInitializerType + ': ' + initializerType);
            return Promise.reject(error);
        }

        if (lifetimePolicy === lifetimePolicies.singleton) {
            resolvePromise = resolvePromise.then(service => {
                dependency.value = service;
                return service;
            });
        }

        return resolvePromise;
    }
}

class DependencyInfo {
    /**
     * @constructor
     * @param rule {Array} dependency resolution rule
     * @param [value] {*} value to resolve
     */
    constructor(rule, value) {
        this.rule = rule;
        this.value = value || null;
    }
}

/**
 * @param locator {Locator}
 * @param values {*[]}
 * @param injections {string[]}
 * @param parentServiceName {string}
 */
function getArgs(locator, values, injections, parentServiceName) {
    assert.isTrue(arguments.length === 4);

    values = values || [];
    injections = injections || [];
    const maxArgs = Math.max(values.length, injections.length);

    const promises = [];
    for (let idx = 0; idx < maxArgs; idx++) {
        let serviceName = injections[idx];
        if (!serviceName)
            promises.push(values[idx]);
        else {
            if (serviceName === '#')
                promises.push(serviceName);
            else if (serviceName === '@')
                promises.push(parentServiceName);
            else {
                let argPromise = locator.resolve(serviceName);
                promises.push(argPromise);
            }
        }
    }

    return Promise.all(promises);
}