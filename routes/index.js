/**
 * Created by Davi on 01/05/16.
 */
var express = require('express');
var path    = require("path");
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

module.exports = router;
