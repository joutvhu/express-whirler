'use strict';

const {convertRequest} = require('@whirler/server');

function parseRequest(request) {
    if (request.headers['content-type'] === 'application/json' && typeof request.body === 'object') {
        let result = convertRequest(request.method, request.body);

        if (result) {
            if (typeof request.headers.authorization === 'string')
                result.authorization = request.headers.authorization;
            result.request = request;

            return result;
        }
    }
    return undefined;
}

module.exports = parseRequest;
