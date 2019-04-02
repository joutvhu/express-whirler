'use strict';

const express = require('express');
const {Whirler, Caller, WhirlerError} = require('@whirler/server');
const parseRequest = require('./parseRequest');

function build(whirlerClass) {
    let obj = new Caller(whirlerClass);

    if (obj instanceof Whirler) {
        let router = express.Router();

        router.post('/', function (req, res) {
            const content = parseRequest(req);
            if (content) {
                obj.call(content).then(value => {
                    res.json({data: value});
                }).catch(reason => {
                    if (reason instanceof WhirlerError)
                        res.json({error: reason.message});
                    else res.json({error: 'An unknown error has occurred.'});
                });
            } else res.status(400).json({error: 'The request is not properly formatted.'});
        });

        return router;
    } else throw new Error('The class invalid.');
}

module.exports = build;