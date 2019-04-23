'use strict';

const express = require('express');
const {Caller, WhirlerError, ErrorMessages} = require('@whirler/server');
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
                        res.json({data: value});
                    }).catch(reason => {
                        if (reason instanceof WhirlerError)
                            res.json({error: reason.message});
                        else res.json({error: ErrorMessages.UNKNOWN});
                    });
                    return;
                }
            }
            res.status(400).json({error: ErrorMessages.INVALID_REQUEST});
        } catch (e) {
            if (e instanceof WhirlerError)
                res.json({error: e.message});
            else res.json({error: ErrorMessages.UNKNOWN});
        }
    });

    return router;
}

module.exports = build;
