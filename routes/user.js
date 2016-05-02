/**
 * Created by Davi on 01/05/16.
 */
var express = require('express');
var crypto = require('crypto');
var db = require('../models/models');
var jwt = require("jsonwebtoken");
var router = express.Router();



/* GET home page. */
router.post('/', function(req, res, next) {
    var hash = crypto
        .createHash("sha1")
        .update(req.body.password)
        .digest('hex');

    db.User.findOne({
        where : {login: req.body.login, password: hash},
        attributes: ['id', 'token']

    }).then(function (user) {

        var response = {
            hasUser: false
        };
        if(user) {
            response.hasUser = true;
            user.token = "";
            user.token = jwt.sign(JSON.stringify(user), 'dGVzdGUtc2VsZWNhby1oZXJha2xlcy1tZS1kYS1lbXByZWdv');
            user.updateAttributes({
                token: user.token
            }).then(function() {
                response.user = user;
                res.json(response);
            });
        } else {
            console.log(JSON.stringify(response));
            res.json(response)
        }
    });
});

module.exports = router;
