import { assert } from '../../engine/utils.js';

/**
 * @implements {IShape}
 */
export class Rect {
    constructor(x, y, width, height) {
        this.left = x;
        this.top = y;
        this.right = w + width;
        this.bottom = y + height;
    }

    contains(x, y) {
        return this.left < x && this.right >= x && this.top < y && this.bottom >= y;
    }
}

/**
 * @implements {IShape}
 */
export class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    contains(x, y) {
        const dx = this.x - x, dy = this.y - y;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }
}

/** Interface that all shapes should implement
 * @interface IShape
 */

/**
 * @function
 * @name IShape#contains
 * @param x {number}
 * @param y {number}
 * @returns {boolean}
 */

/** Interface for region objects
 * @interface IRegion
 * @member id {number}
 * @member shape {IShape}
 * @member callback {function}
 */
