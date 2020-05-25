'use strict'

let express = require('express');
let api = express.Router();
let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();
const csv = require('csvtojson');
const c45 = require('./c45');
api.post("/upload",multipartMiddleware, async function(req, res){
    console.log(req.files);
    let datos = await csv().fromFile(req.files.csv.path);
    res.status(200).send(datos);
})

api.post('/c45', async function(req, res){
    console.log(req.body);
    let response = await c45(req.body.json, req.body.decision);
    res.status(200).send(response)
})

module.exports = api;