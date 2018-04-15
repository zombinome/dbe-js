import EventSource from './../utils/EventSource.js';
import * as http from './../utils/http.js';

import { assert } from './../../engine/utils.js';


// Что должен уметь AssetManager?
// Загрузить манифест с адресами ресурсов
// Загрузить и закештровать ресурс
// По списку запрашишваемых ресурсов, определить, что уже было загружено, а что - нет
// Вернуть список загруженных ресурсов
// Вернуть список ресурсов в очереди на загрузку
// Генерировать события по мере загрузки ресурсов
// Веруть уже загруженный ресурс

'use strict';

export const assetTypes = {
    audio: 'audio',
    image: 'image'
};

const errorMessage = {
    assetListNotLoaded: 'Assets weren\'t loaded yet',
    argumentShouldHaveValue: 'Argument should have value',
    argumentValueShouldBeString: 'Argument value should be string',
    invalidAssetType: 'Invalid asset type',
    invalidAssetId: 'Invalid asset ID',
    unknownAssetType: 'Unknown asset type'
};

/**
 * @implements IAssetManager
 * @implements IDisposable
 */
export default class AssetManager {
    constructor(assetsLocation) {
        this.__disposed = false;
        this.__loaded = false;

        this._assetsLocation = assetsLocation;

        this._assetManifest = null;
        this._assetManifestPromise = null;

        /** @type object.<string,object.<string,IAssetInfo>> */
        this._assets = {};
        Object.getOwnPropertyNames(assetTypes).forEach(at => { this._assets[at] = {}; })
    }

    get loaded() {
        throwIfDisposed(this);
        return this.__loaded;
    }

    loadAssetManifest() {
        throwIfDisposed(this);

        if (!this._assetManifestPromise) {
            this._assetManifestPromise = http.get(this._assetsLocation + '/assets.json')
                .then(data => {
                    this._assetManifest = data;
                    this.__loaded = true;
                });
        }

        return this._assetManifestPromise;
    }

    /**
     * Returns URI for required asset
     * @param {string} assetType
     * @param {string} assetId
     * @returns {string}
     */
    getAssetUri(assetType, assetId) {
        throwIfDisposed(this);

        assert.hasValue(assetType, errorMessage.invalidAssetType);
        assert.isString(assetType, errorMessage.invalidAssetType);
        assert.hasValue(assetId, errorMessage.invalidAssetId);
        assert.isString(assetId, errorMessage.invalidAssetId);

        if (!this.__loaded)
            throw new Error(errorMessage.assetListNotLoaded);

        const assetUri = this._assetManifest[assetType][assetId];
        if (!assetUri) {
            throw new Error('Asset with ID=' + assetId + ' not found');
        }

        return this._assetsLocation + '/' + assetType + '/' + assetUri;
    }

    /**
     * Initiates asset loading
     * @param {string} assetType
     * @param {string} assetId
     * @returns Promise<HTMLImageElement> | Promise<HTMLAudioElement>
     */
    loadAsset(assetType, assetId) {
        throwIfDisposed(this);

        assert.hasValue(assetType, errorMessage.invalidAssetType);
        assert.isString(assetType, errorMessage.invalidAssetType);
        assert.hasValue(assetId, errorMessage.invalidAssetId);
        assert.isString(assetId, errorMessage.invalidAssetId);

        assert.isTrue(!!this._assetManifest[assetType] && !!this._assetManifest[assetType][assetId], errorMessage.invalidAssetId);

        const assetInfos = this._assets[assetType];
        var assetInfo = assetInfos[assetId];
        if (!assetInfo) {
            const assetUri = this._assetsLocation + '/' + this._assetManifest[assetType][assetId];
            assetInfo = assetInfos[assetId] = AssetInfo.create(assetId, assetType, assetUri);
        }

        if (!assetInfo.promise)
            assetInfo.load();

        return assetInfo.promise;
    }

    /**
     * Initiates assets loading
     * @param {string} assetType
     * @param {string[]} assetIds
     * @returns AssetBatchInfo
     */
    loadAssets(assetType, assetIds) {
        throwIfDisposed(this);

        assert.hasValue(assetType, errorMessage.invalidAssetType);
        assert.isString(assetType, errorMessage.invalidAssetType);
        assert.hasValue(assetIds, errorMessage.invalidAssetId);

        if (!this.__loaded)
            throw new Error(errorMessage.assetListNotLoaded);

        return assetIds.map(aid => this.loadAsset(assetType, aid));
    }

    dispose() {
        this._assetManifest = null;
        this._assetsLocation = null;
        this._assets = null;
        this._assetManifestPromise = null;
        this.__disposed = true;
    }
}

/**
 * @implements IAssetInfo
 */
class AssetInfo {
    constructor(id, type, uri) {
        this.id = id;
        this.type = type;
        this.uri = uri;

        this.promise = null;
        this.asset = null;
    }

    load() {
        if (this.promise !== null)
            return this.promise;

        if (!assetLoaders.hasOwnProperty(this.type))
            throw new Error(errorMessage.unknownAssetType);

        this.promise = assetLoaders[this.type](this);
        return this.promise;
    }

    static create(id, type, uri, load) {
        const info = new AssetInfo(id, type, uri);
        if (load)
            info.load();

        return info;
    }
}

/**
 * @implements IAssetBatchInfo
 */
class AssetBatchInfo extends EventSource {

    /**
     * Creates new AssetBatchInfo
     * @param assets {AssetInfo[]}
     * @param requireAll {boolean}
     */
    constructor(assets, requireAll) {
        super();

        this.loadedAssetsCount = 0;
        this.failedAssetsCount = 0;

        this.requireAllAssets = requireAll;

        this.assets = assets;

        const batch = this;
        this.promise = null;
    }

    onBatchChanged(callback) {
        return this.on(AssetBatchInfo.evnBatchProgress, callback);
    }

    load() {
        this.promise = new Promise(function (resolve, reject) {
            var completedPromises = 0;
            for (var i = 0; i < assets.lenth; i++) {
                const assetInfo = assets[i];
                if (!assetInfo.promise)
                    assetInfo.load();

                assetInfo.promise.then(
                    function (asset) {
                        batch.loadedAssetsCount++;
                        completedPromises++;

                        // Dispatching 'batchProgress' event
                        batch.dispatchEvent(
                            AssetBatchInfo.evnBatchProgress,
                            { type: assetInfo.type, id: assetInfo.id, asset: asset, success: true });

                        // If all assets are loaded, resolve batch promise
                        if (completedPromises === assets.length) {
                            if (!requireAll && batch.failedAssetsCount === assets.count)
                                reject(batch);
                            else
                                resolve(batch);
                        }
                    },
                    function () {
                        batch.failedAssetsCount++;
                        completedPromises++;
                        batch.dispatchEvent(
                            AssetBatchInfo.evnBatchProgress,
                            { type: assetInfo.type, id: assetInfo.id, asset: asset, success: false });

                        // If all resource state are determined, checking should we resolve or reject current batch
                        if (completedPromises === assets.length) {
                            // If we are not required to successfully load all assets and we load at least on asset
                            if (!requireAll && batch.failedAssetsCount < assets.length)
                                resolve(batch);
                            else
                                reject(batch);
                        }
                    });
                }
            });

        return this.promise;
    }

    static create(assets, requireAll, load) {
        const info = new AssetBatchInfo(assets, requireAll);
        if (load)
            info.load();

        return info;
    }
}

AssetBatchInfo.evnBatchProgress = 'batchProgress';

function loadImage(assetInfo) {
    return new Promise(function(resolve, reject) {
        const image = new Image();
        image.onload = function() {
            assetInfo.asset = image;
            resolve(image);
        };

        image.onerror = function(error) {
            assetInfo.asset = null;
            reject(error);
        };

        image.src = assetInfo.uri;
    });
}

function loadAudio(assetInfo) {
    return new Promise(function (resolve, reject) {
        const audio = new Audio();

        audio.addEventListener('canplaythrough', function () {
            assetInfo.asset = audio;
            resolve(audio);
        });

        audio.onerror = function(error) {
            assetInfo.asset = null;
            reject(error);
        };

        audio.src  = assetInfo.uri;
    });
}

const assetLoaders = {};
assetLoaders[assetTypes.image] = loadImage;
assetLoaders[assetTypes.audio] = loadAudio;

function throwIfDisposed(obj) {
    if (obj.__disposed)
        throw new Error('AssetManager was disposed');
}
