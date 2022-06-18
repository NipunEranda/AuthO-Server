'use strict';
const express = require('express');
const jwt = require('jsonwebtoken');
var crypto = require("crypto");
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const syncsql = require('sync-sql');
const moment = require('moment');
const user = require('./user');
const app = express();

app.get('/.netlify/functions/auth/v1/authorize', bodyParser.json(), async function (req, res) {
    await exports.getCode(req, res);
});

exports.getCode = async (req, res) => {
    try {
        if (req.query.client_id && req.query.redirect_uri && req.query.response_type && req.query.state) {
            if (!(req.query.response_type === 'code')) {
                res.status(400).json({ error: 'Invalid response type' });
                return;
            }
            if ((isNaN(parseInt(req.query.state)))) {
                res.status(400).json({ error: 'State should be a numerical value' });
                return;
            }
            const existingApplication = user.executeQuery(`SELECT * FROM application WHERE apiKey='${req.query.client_id}' and redirect_uri='${req.query.redirect_uri}'`);
            if (existingApplication.data.rows.length > 0) {
                const code = crypto.randomBytes(32).toString('hex');
                const query = `INSERT INTO auth(0, '${req.query.client_id}', '${req.query.redirect_uri}', '${req.query.response_type}', '${code}', '${req.query.state}')`;
                res.redirect(`${req.query.redirect_uri}?code=${code}`);
            } else {
                res.status(400).json({ error: 'client or redirect_uri is invalid' });
            }

        } else {
            const result = {};
            res.status(result.status ? result.status : 500).json(result.response ? result.response : { error: 'Empty required fields' });
        }
    } catch (e) {
        console.log(e);
        return { status: 500, response: { data: null, error: e } };
    }
}

exports.handler = serverless(app);