'use strict';
const express = require('express');
var crypto = require("crypto");
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const syncsql = require('sync-sql');
const moment = require('moment');
const user = require('./user');
const app = express();

app.get('/.netlify/functions/application/all', bodyParser.json(), user.verifyToken, async function (req, res) {
    res.header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
    res.header('Access-Control-Allow-Origin', '*');
    const result = await exports.getApplications();
    res.status(result.status ? result.status : 500).json(result.response ? result.response : {});
});

exports.getApplications = async () => {
    try{
        const applications = await user.executeQuery('SELECT * FROM application');
        return { status: 200, response: { data: applications.data.rows, error: null } };
    }catch(e){
        console.log(e);
        return { status: 500, response: { data: null, error: e } };
    }
};

exports.handler = serverless(app);