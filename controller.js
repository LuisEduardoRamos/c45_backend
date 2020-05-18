'use strict'

let express = require('express');
let api = express.Router();
let multipart = require('connect-multiparty');
let md_upload = multipart({uploadDir: "./uploads"});
let multipartMiddleware = multipart();

api.post("/upload",multipartMiddleware, function(req, res){
    console.log( req.body);
    res.status(200).send('todobien');
})

module.exports = api;