import {assert} from "../../engine/utils";

'use strict';

export class LayoutManager {
    constructor() {
        /** @type {number} */ this._nextId = 0;
        /** @type {IRegion[]} */ this._regions = []; // TODO: reimplement custom linked list
    }

    /**
     * Register new region
     * @param shape {IShape} Region shape, should implement IShape interface
     * @returns {number} Region id
     */
    registerRegion(shape, data) {
        assert.hasValue(shape, 'shape');
        assert.isFunction(shape.contains, 'Invalid shape object');

        const region = {
            id: this._nextId++,
            shape: shape,
            data: data
        };

        this._regions.unshift(region);
        return region.id;
    }

    /**
     * Updates existing region
     * @param regionId {number} Region id
     * @param shape {ISHape} new shape, if shape is null, current shape preserved
     */
    updateRegion(regionId, shape, data) {
        assert.hasValue(regionId, 'regionId');
        if (!shape && !callback)
            return;

        region = this._regions.find(x => x.id === regionId);
        if (!region)
            throw new Error('Region with id=' + regionId + ' weren\'t found');

        if (!!shape) {
            assert.isFunction(shape.contains, 'Invalid shape object');

            region.shape = shape;
        }

        if (data !== undefined) {
            region.data = data;
        }
    }

    /**
     * Deletes new region
     * @param regionId {number} Region id
     */
    deleteRegion(regionId) {
        const regionIndex = this._getRegionIndex(regionId);
        if (regionIndex >= 0)
            this._regions.splice(regionIndex, 1);
    }

    /**
     * Deletes all regions
     */
    clear() {
        this._regions = [];
    }

    /**
     * Brings region to front
     * @param regionId {number} region
     */
    bringToFront(regionId) {
        const regionIndex = this._getRegionIndex(regionId);
        if (regionIndex < 0)
            throw new Error('Region with id=' + regionId + ' weren\'t found');

        if (regionIndex === 0)
            return; // we are already on top


        const region = this._regions.splice(regionIndex, 1)[0];
        this._regions.unshift(region);
    }

    /**
     * Sends region to back
     * @param regionId {number};
     */
    sendToBack(regionId) {
        const regionIndex = this._getRegionIndex(regionId);
        if (regionIndex < 0)
            throw new Error('Region with id=' + regionId + ' weren\'t found');

        if (regionIndex === (this._regions.length - 1))
            return; // we are already on bottom


        const region = this._regions.splice(regionIndex, 1)[0];
        this._regions.push(region);
    }

    /**
     * Returns region which contains point with specified (x,y) coordinates.
     * If no region contains point method returns null
     * @param x {number} the X coordinate
     * @param y {number} the Y coordinate
     * @returns {IRegion}
     */
    getRegionByXY(x, y) {
        return this._regions.find(r => r.contains(x, y)) || null;
    }

    /**
     * Enumerates existing regions and calls callback for each of them
     * @param callback {function} a callback to be invoked for each region
     */
    enumRegions(callback) {
        for (var i = this._regions.length - 1; i => 0; i--) {
            const region = this._regions[i];
            callback(region.id, region.shape, region.data);
        }
    }

    /**
     * @param regionId {number}
     * @returns {number}
     * @private
     */
    _getRegionIndex(regionId) {
        return this._regions.findIndex(x => x.id === regionId);
    }
}