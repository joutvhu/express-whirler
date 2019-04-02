'use strict';

const express = require('express');
const {Whirler, Caller, WhirlerError, ErrorMessages} = require('@whirler/server');
const parseRequest = require('./parseRequest');

function build(whirlerClass) {
    const obj = new Caller(whirlerClass);
    const router = express.Router();

    router.post('/', function (req, res) {
        const content = parseRequest(req);
        if (content) {
            obj.call(content).then(value => {
                res.json({data: value});
            }).catch(reason => {
                if (reason instanceof WhirlerError)
                    res.json({error: reason.message});
                else res.json(ErrorMessages.UNKNOWN);
            });
        } else res.status(400).json(ErrorMessages.INVALID_REQUEST);
    });

    return router;
}

module.exports = build;