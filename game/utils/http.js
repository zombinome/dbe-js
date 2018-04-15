'use strict';

/**
 * Performs generic AJAX request
 * @param {string} uri - request URI
 * @param {string} method - HTTP request method
 * @param {*} [data] - request data
 * @param {string} [contentType] - specific content type
 * @param {object.<string, string>} [headers] - a collection of additional header to be added to request
 * @returns {Promise}
 */
export function ajax(uri, method, data, contentType, headers) {
    return new Promise(function (resolve, reject) {
        const request = new XMLHttpRequest();
        request.open(method, uri);

        // setting headers
        if (contentType) {
            request.setRequestHeader('Content-Type', contentType);
        }

        if (headers) {
            for (const header in headers) {
                if (!headers.hasOwnProperty(header)) continue;

                request.setRequestHeader(header, headers[headers]);
            }
        }

        // setting request body
        var requestBody = null;
        if (data && contentType) {
            if (contentType === 'application/json') {
                requestBody = JSON.stringify(data);
            }
            else if (contentType.startsWith('application/x-www-form-urlencoded')) {
                const props = Object.getOwnPropertyNames(data);
                requestBody = encodeURI(props.map(prop => prop + '=' + data[prop]).join('&'));
            }
            else {
                requestBody = !!data ? data.toString() : null;
            }
        }

        // setting callbacks
        request.onload = function () {
            const response = parseSuccessResponse(request);
            resolve(response);
        };

        request.onerror = function () {
            const requestError = parseErrorResponse(request);
            reject(requestError);
        };

        request.ontimeout = function () {
            const timeoutError = createTimeoutError(request);
            reject(timeoutError);
        };

        request.send(requestBody);
    });
}

function parseSuccessResponse(xhrRequest) {
    if (!!xhrRequest.responseXML)
        return xhrRequest.responseXML;

    const contentType = xhrRequest.getResponseHeader('content-type');
    if (!contentType)
        return xhrRequest.responseText;

    switch (contentType) {
        case 'application/json': return JSON.parse(xhrRequest.responseText);
        default: return xhrRequest.response;
    }
}

function parseErrorResponse(xhrRequest) {
    throw new Error('Not implemented');
}

function createTimeoutError(xhrRequest) {
    throw new Error('Not implemented');
}

/**
 * Performs GET request to server
 * @param {string} uri request URI
 * @param {object.<string, string>} [headers] - a collection of additional http headers
 * @returns {Promise} - a promise that resolves with request result or reject with request error
 */
export function get(uri, headers) {
    return ajax(uri, 'GET', null, null, headers);
}

/**
 * Performs POST request to server
 * @param {string} uri request URI
 * @param {*} data - data to be sent to server
 * @param {string} [contentType] - a specific content type to send data to server
 * @param {object.<string, string>} [headers] - a collection of additional http headers
 * @returns {Promise} - a promise that resolves with request result or reject with request error
 */
export function post(uri, data, contentType, headers) {
    return ajax(uri, 'POST', data, contentType, headers);
}
