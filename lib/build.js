'use strict';

const express = require('express');
const {
    Caller,
    ErrorMessages,
    WhirlerError,
    convertError,
    convertResult
} = require('@whirler/server');
const {StringType} = require('extension-props');
const parseRequest = require('./parseRequest');

function build(whirlerClass) {
    const obj = new Caller(whirlerClass);
    const router = express.Router();

    router.all('/', function (req, res) {
        try {
            const content = parseRequest(req);

            if (content) {
                let result;
                if (StringType.valueOf('post').equalsIgnoreCase(req.method))
                    result = obj.call(content);
                else if (StringType.valueOf('get').equalsIgnoreCase(req.method))
                    result = obj.get(content);
                else if (StringType.valueOf('put').equalsIgnoreCase(req.method))
                    result = obj.set(content);

                if (result) {
                    result.then(value => {
                        res.json(convertResult(value));
                    }).catch(reason => {
                        res.json(convertError(reason));
                    });
                    return;
                }
            }
            res.json({code: 4, error: ErrorMessages.INVALID_REQUEST});
        } catch (e) {
            res.json(convertError(e));
        }
    });

    return router;
}

module.exports = build;
