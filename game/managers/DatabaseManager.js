import EventSource from './../utils/EventSource.js';
////import * as http from './../utils/http.js';

////import { assert } from './../../engine/utils.js';

'use strict';

export default class DatabaseManager extends EventSource {
    constructor(dbUri, localizationManager) {
        super();
        this._dbUri = dbUri;
        this._localizationManager = localizationManager;
    }
}