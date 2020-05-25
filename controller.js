'use strict'

let express = require('express');
let api = express.Router();
let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();
const csv = require('csvtojson');

api.post("/upload",multipartMiddleware, async function(req, res){
    console.log(req.files)
    let datos = await csv().fromFile(req.files.csv.path);
    res.status(200).send(datos);
})

api.get('/c45', async function(req, res){
    console.log(req.body)
})

module.exports = api;