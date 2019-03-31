'use strict';

function parseRequest(request) {
    if (request.headers['content-type'] === 'application/json' && typeof request.body === 'object' &&
        typeof request.body.func === 'string') {
        let result = {
            function: request.body.func,
            arguments: null
        };

        if (request.body.nsp instanceof Array && request.body.nsp.length > 0)
            result.namespace = request.body.nsp;
        if (request.body.args instanceof Array && request.body.args.length > 0)
            result.arguments = request.body.args;
        if (typeof request.headers.authorization === 'string')
            result.authorization = request.headers.authorization;
        result.request = request;

        return result;
    } else return null;
}

module.exports = parseRequest;