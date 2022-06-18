'use strict';
const express = require('express');
const jwt = require('jsonwebtoken');
var crypto = require("crypto");
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const syncsql = require('sync-sql');
const moment = require('moment');
const app = express();

app.post('/.netlify/functions/user/google', bodyParser.json(), async function (req, res) {
    const result = await exports.saveUser({ sub: req.body.sub, name: req.body.name, email: req.body.email, password: req.body.password });
    res.status(result.status ? result.status : 500).json(result.response ? result.response : {});
});

exports.saveUser = async (user) => {
    try {
        const existingUser = exports.executeQuery(`SELECT id, name, email, created FROM user WHERE googleId = ${user.sub}`);
        const tokenValue = crypto.randomBytes(32).toString('hex');
        if (existingUser.data.rows.length === 0) {
            const createdUser = exports.executeQuery(`INSERT INTO user VALUES(0, '${user.name}', ${user.sub ? user.sub : null}, '${user.email}', ${user.password ? `'${user.password}'` : null}, '${tokenValue}', '${moment(new Date()).format('YYYY-MM-DD')}', 1, 0);`);
            const userId = createdUser.data.rows.insertId;
            exports.executeQuery(`INSERT INTO user_role VALUES(${userId}, 2)`);
            const token = await new Promise((resolve, reject) => {
                jwt.sign({ user: { id: userId, name: user.name, email: user.email, created: moment(new Date()).format('YYYY-MM-DD') } }, process.env.SECRET, { expiresIn: '24h' }, (err, token) => {
                    resolve(token);
                })
            });
            return { status: 200, response: { data: { status: 'success', token: token }, error: null } };
        }
        const token = await new Promise((resolve, reject) => {
            jwt.sign({ user: existingUser }, process.env.SECRET, { expiresIn: '24h' }, (err, token) => {
                resolve(token);
            })
        });
        return { status: 200, response: { data: { status: 'loggedIn', token: token }, error: null } };
    } catch (e) {
        console.log(e);
        return { status: 500, response: { data: null, error: e } };
    }
};

exports.verifyToken = function (req, res, next) {
    try {
        const bearerHeader = req.headers.authroization;
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            const data = jwt.verify(bearerToken, process.env.SECRET);
            next();
        } else {
            if (req.query.response_type === 'code') {
                res.redirect('/');
            } else {
                res.status(400).json({ data: null, error: 'Access Denied' });
            }
        }
    } catch (e) {
        if (req.query.response_type === 'code') {
            res.redirect('/');
        } else {
            res.status(400).json({ data: null, error: 'Access Denied' });
        }
    }
}

exports.executeQuery = (query) => {
    return syncsql.mysql({
        host: process.env.MYSQL_HOSTNAME,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        multipleStatements: true
    }, query);
}

exports.handler = serverless(app);