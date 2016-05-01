/**
 * Created by Davi on 01/05/16.
 */
var express = require('express');
var router = express.Router();
var path    = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile('../view/index.html');
});

module.exports = router;
