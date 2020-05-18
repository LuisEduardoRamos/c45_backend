'use strict'

let express = require('express');
let api = express.Router();
let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();
const csv = require('csvtojson');

api.post("/upload",multipartMiddleware, async function(req, res){
    let datos = await csv().fromFile(req.files.null.path);
    res.status(200).send(datos);
})

module.exports = api;