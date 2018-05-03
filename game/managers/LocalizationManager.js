import EventSource from './../utils/EventSource.js';
import * as http from './../utils/http.js';

import { assert } from './../../engine/utils.js';

export default class LocalizationManager extends EventSource {

    constructor(localizationsUri, locale) {
        super();

        this._locales = {};
        this._baseUri = localizationsUri;
        this._currentLocale = null;
        if (!!locale) {
            assert.isString(locale);
            this._currentLocale = locale;
        }
    }

    get currentLocalization() {
        this._throwIfDisposed();
        return this._currentLocale;
    }

    /**
     * Loads localization to localization manager
     * @param [locale] {string} code of localization to load, if no locale specified, always reloads current locale
     */
    loadLocalization(locale) {
        this._throwIfDisposed();

        if (!arguments.length) {
            assert.isString(this._currentLocale);
            assert.hasValue(this._currentLocale);

            locale = this._currentLocale;
        }
        else {
            assert.isString(locale);
            assert.hasValue(locale);

            locale = locale.toUpperCase();
            if (this._locales.hasOwnProperty(locale))
                return Promise.resolve(this._locales.locale);
        }

        return http.get(this._baseUri + '/' + locale + '.json')
            .then(data => {
                this._throwIfDisposed();

                this._locales[locale] = data;
                return data;
            });
    }

    /**
     * Sets new localization
     * @param locale {string} Localization code
     * @returns {Promise<Object.<string, string>>}
     */
    setLocalization(locale) {
        this._throwIfDisposed();

        assert.isString(locale);
        assert.hasValue(locale);

        locale = locale.toUpperCase();

        return this.loadLocalization(locale)
            .then(data => {
                this._throwIfDisposed();

                this._currentLocale = locale;

                const eventArgs = { locale: locale, localization: data };
                this.dispatchEvent(LocalizationManager.evnLocalizationChanged, eventArgs);

                return data;
            });
    }

    /**
     * Returns localization node
     * @param path {string}
     * @returns {*} localization node
     */
    get(path) {
        this._throwIfDisposed();
        var node = this._locales[this._currentLocale];
        assert.hasValue(localization);

        const tokens = path.split('.')
            .forEach(token => { node = node[token]; });

        return node;
    }

    dispose() {
        this._locales = null;
        this._currentLocale = null;
        this._baseUri = null;
        super.dispose();
    }
}