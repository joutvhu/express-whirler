'use strict';

const express = require('express');
const {Caller, WhirlerError, ErrorMessages} = require('@whirler/server');
const parseRequest = require('./parseRequest');

function build(whirlerClass) {
    const obj = new Caller(whirlerClass);
    const router = express.Router();

    router.all('/', function (req, res) {
        const content = parseRequest(req);
        let result;

        if (content) {
            if(StringType.valueOf('post').equalsIgnoreCase(req.method))
                result = obj.call(content);
            else if(StringType.valueOf('get').equalsIgnoreCase(req.method))
                result = obj.get(content);
            else if(StringType.valueOf('put').equalsIgnoreCase(req.method))
                result = obj.set(content);

            if(result) {
                result.then(value => {
                    res.json({data: value});
                }).catch(reason => {
                    if (reason instanceof WhirlerError)
                        res.json({error: reason.message});
                    else res.json(ErrorMessages.UNKNOWN);
                });
                return;
            }
        }
        res.status(400).json(ErrorMessages.INVALID_REQUEST);
    });

    return router;
}

module.exports = build;
