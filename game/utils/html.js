import { assert } from './../../engine/utils.js';

'use strict';

export function addClass(element, className) {
    assert.hasValue(element);

    const existClasses = element.className
                             .split(' ')
                             .filter(x => x !== '');

    if (!existClasses.includes(className))
        existClasses.push(className);

    element.className = existClasses.join(' ');
}

export function removeClass(element, className) {
    assert.hasValue(element);

    element.className = element.className
                            .split(' ')
                            .filter(x => x !== '' && x !== className)
                            .join(' ');
}

export function toggleClass(element, className) {
    const existClasses = element.className
                             .split(' ')
                             .filter(x => x !== '');

    if (existClasses.includes(className)) {
        return existClasses.filter(x => x !== className).join(' ');
    }
    else {
        existClasses.push(className);
        return existClasses.join(' ');
    }
}

// Based on:
// https://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
function getPixelRatio() {
    const ctx = document.createElement('canvas').getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    // noinspection SpellCheckingInspection
    const bspr = ctx.webkitBackingStorePixelRatio ||
                 ctx.mozBackingStorePixelRatio ||
                 ctx.msBackingStorePixelRatio ||
                 ctx.oBackingStorePixelRatio ||
                 ctx.backingStorePixelRatio || 1;

    return dpr / bspr;
}

export const pixelRatio = getPixelRatio();

/**
 * Creates new canvas element with required pixel ration
 * @param width {number} canvas width in virtual pixels
 * @param height {number} canvas height in virtual pixels
 * @param [ratio] {number} pixel ratio, iif not specified, we get device ratio
 * @returns {HTMLCanvasElement}
 */
export function createHighDpiCanvas(width, height, ratio) {
    assert.hasValue(parent, 'parent argument should have value');
    assert.isNumber(width, 'width should have value');
    assert.isNumber(height, 'height should have value');

    const canvasElement = document.createElement('canvas');

    ratio = ratio || pixelRatio;
    canvasElement.width = width * ratio;
    canvasElement.height = height * ratio;
    canvasElement.style.width = width + 'px';
    canvasElement.style.height = height + 'px';

    canvasElement.getContext('2d').scale(ratio, ratio);

    return canvasElement;
}

/**
 * Updates internal canvas size in pixels according to device virtual to physical aspect ratio
 * @param canvasElement {HTMLCanvasElement}
 * @param [ratio] {number}
 */
export function makeCanvasHighDpi(canvasElement, ratio) {
    assert.hasValue(canvasElement, 'canvasElement argument should have value');
    ratio = ratio || pixelRatio;
    const width = canvasElement.clientWidth;
    const height = canvasElement.clientHeight;

    canvasElement.width = width * ratio;
    canvasElement.height = height * ratio;
    canvasElement.style.width = width + 'px';
    canvasElement.style.height = height + 'px';

    canvasElement.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
}