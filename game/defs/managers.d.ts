interface IAssetManager
    extends IDisposable {

    loadAssetManifest(): Promise;

    getAssetUri(assetType, assetId): string;

    loadAsset(): Promise;

    loadAssets(): Promise;
}

interface IAssetInfo {
    /**
     * Asset ID
     */
    id: string;

    /**
     * Asset type
     */
    type: string;

    /**
     * Full asset uri
     */
    uri: string;

    /**
     * Load promise (if asset were initialized, null otherwise), which resolves with loaded asset
     * Null, if asset weren't been loaded yet
     */
    promise: Promise;

    /**
     * Asset (if loaded, null otherwise)
     */
    asset: HTMLImageElement | HTMLAudioElement;
}

interface IAssetBatchInfo extends IEventSource {

    /**
     * Shortcut to on('batchProgress', callback) method
     * @param {Function} callback
     */
    onBatchProgress(callback: Function): number;

    /**
     * Assets in this batch
     */
    assets: IAssetInfo[];

    /**
     * Asset loading mode.
     * If true, batch loading succeed if all assets from batch were loaded successfully,
     * and fails if any one asset failed to load.
     * If false, batch loading succeed if at least one asset were loaded,
     * and fails if all assets from batch failed to load
     * failed to load.
     */
    requireAllAssets: boolean;

    /**
     * Load batch load promise.
     * If requireAllAssets is true, promise resolves if all assets from batch were loaded successfully, fails otherwise
     * If requireAllAssets is false, promise resolves if at least on asset from bath were loaded successfully,
     * fails otherwise
     */
    promise: Promise;

    /**
     * Number of successfully loaded assets
     */
    loadAssetsCount: number;

    /**
     * Number of assets failed to load
     */
    failedAssetsCount: number;
}

interface ILocalizationManager extends IEventSource {
    readonly currentLocalization: string;

    loadLocalization(locale: string): Promise<any>;

    setLocalization(locale: string): Promise<any>;

    get(path: string): any;
}

interface IShape {
    /**
     * Checks if point with specified coordinates is located inside given shape
     * @param {number} x - the X coordinate
     * @param {number} y - the Y coordinate
     * @returns {boolean} - true if points is located inside the shape, false otherwise
     */
    contains(x: number, y: number): boolean;
}

interface ILayoutRegion {
    /**
     * Region id
     */
    id: number;

    /**
     * Region shape
     */
    shape: IShape;

    /**
     * Any additional data linked to this region
     */
    data: any;
}

interface ILayoutManager {
    /**
     * Register new region
     * @param shape {IShape} Region shape, should implement IShape interface
     * @param data {*}
     * @returns {number} Region id
     */
    registerRegion(shape: IShape, data?: any);

    /**
     * Updates existing region
     * @param regionId {number} Region id
     * @param data {*}
     * @param shape {IShape} new shape, if shape is null, current shape preserved
     */
    updateRegion(regionId: number, shape?: IShape, data?: any);

    /**
     * Deletes new region
     * @param regionId {number} Region id
     */
    deleteRegion(regionId: number);

    /**
     * Deletes all regions
     */
    clear();

    /**
     * Brings region to front
     * @param regionId {number} region
     */
    bringToFront(regionId: number);

    /**
     * Sends region to back
     * @param regionId {number};
     */
    sendToBack(regionId: number);

    /**
     * Returns region which contains point with specified (x,y) coordinates.
     * If no region contains point method returns null
     * @param x {number} the X coordinate
     * @param y {number} the Y coordinate
     * @returns {IRegion}
     */
    getRegionByXY(x, y);

    /**
     * Enumerates existing regions
     * returned collection SHOULD NOT be modified as it returns internal object
     * instead of copy by performance considerations
     * @returns {IRegion[]}
     */
    enumRegions(callback);
}

interface IDatabaseManager
    extends IDisposable {

    loadDatabase()
}

interface IRegion {}