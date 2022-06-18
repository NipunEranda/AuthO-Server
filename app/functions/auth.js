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
    const result = await exports.getCode(req, res);
    res.status(result ? result.status ? result.status : 500 : 500).json(result ? result.response ? result.response : {} : {});
});

app.get('/.netlify/functions/auth/v1/login', bodyParser.json(), async function(req, res) {
    res = await exports.setHeaders(res);
    const result = await exports.login(req, res);
    res.status(result ? result.status ? result.status : 500 : 500).json(result ? result.response ? result.response : {} : {});
});

exports.getCode = async (req, res) => {
    try {
        if (req.query.client_id && req.query.redirect_uri && req.query.response_type && req.query.state && req.query.user) {
            if (!(req.query.response_type === 'code')) {
                return { status: 400, response: { data: null, error: 'Invalid response type' } };
            }
            if ((isNaN(parseInt(req.query.state)))) {
                return { status: 400, response: { data: null, error: 'State should be a numerical value' } };
            }
            const existingApplication = user.executeQuery(`SELECT * FROM application WHERE apiKey='${req.query.client_id}' and redirect_uri='${req.query.redirect_uri}'`);
            if (existingApplication.data.rows.length > 0) {
                const code = crypto.randomBytes(32).toString('hex');
                const query = `INSERT INTO auth VALUES(0, ${req.query.user},'${req.query.client_id}', '${req.query.redirect_uri}', '${req.query.response_type}', '${code}', '${req.query.state}', '${moment(new Date()).format('YYYY-MM-DD')}')`;
                user.executeQuery(query);
                return { status: 200, response: { data: {code: code}, error: null } };
            } else {
                return { status: 400, response: { data: null, error: 'client or redirect_uri is invalid' } };
            }

        } else {
            return { status: 400, response: { data: null, error: 'Empty required fields' } };
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
                return { status: 400, response: { data: null, error: 'Invalid response type' } };
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
                return { status: 200, response: { data: { status: 'success', token: token, error: null }, error: null } };
            }else{
                return { status: 400, response: { data: null, error: 'User doesn\'t exists' } };
            }
        } else {
            return { status: 400, response: { data: null, error: 'Empty required fields' } };
        }
    }catch(e){
        console.log(e);
        return { status: 500, response: { data: null, error: e } };
    }
};

exports.setHeaders = async (res) => {
    res.header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
    res.header('Access-Control-Allow-Origin', '*');
    return res;
}

exports.handler = serverless(app);