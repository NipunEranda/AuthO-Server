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

app.post('/.netlify/functions/auth/v1/login', bodyParser.json(), async function(req, res) {
    await exports.login(req, res);
});

exports.getCode = async (req, res) => {
    try {
        if (req.query.client_id && req.query.redirect_uri && req.query.response_type && req.query.state && req.query.user) {
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
                const query = `INSERT INTO auth VALUES(0, ${req.query.user},'${req.query.client_id}', '${req.query.redirect_uri}', '${req.query.response_type}', '${code}', '${req.query.state}', '${moment(new Date()).format('YYYY-MM-DD')}')`;
                const test = user.executeQuery(query);
                console.log(test);
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
};

exports.login = async (req, res) => {
    try{
        const result = {};
        if (req.query.client_id && req.query.redirect_uri && req.query.code) {
            if (!(req.query.response_type === 'token')) {
                res.status(400).json({ error: 'Invalid response type' });
                return;
            }
            const auth = user.executeQuery(`SELECT a.id as 'auth_id', u.id, u.name, u.googleId, u.email FROM auth a, user u WHERE client_id='${req.query.client_id}' and redirect_uri='${req.query.redirect_uri}' and code = '${req.query.code}' and u.googleId = a.user`);
            const u = auth.data.rows[0];
            if(u){
                const token = await new Promise((resolve, reject) => {
                    jwt.sign({ user: { id: u.id, name: u.name, email: u.email, created: moment(new Date()).format('YYYY-MM-DD') } }, process.env.SECRET, { expiresIn: '24h' }, (err, token) => {
                        resolve(token);
                    })
                });
                user.executeQuery(`DELETE FROM auth WHERE id = ${u.auth_id}`);
                res.status(200).json({ response: { status: 'success', token: token, error: null }});
            }else{
                res.status(result.status ? result.status : 400).json(result.response ? result.response : { error: 'User doesn\'t exists' });
            }
        } else {
            res.status(result.status ? result.status : 500).json(result.response ? result.response : { error: 'Empty required fields' });
        }
    }catch(e){
        console.log(e);
        res.status(500).json({ response: { status: 'failed', token: null, error: e }});
    }
};

exports.handler = serverless(app);