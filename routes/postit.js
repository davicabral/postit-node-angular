/**
 * Created by Davi on 01/05/16.
 */
var express = require('express');
var crypto = require('crypto');
var db = require('../models/models');
var router = express.Router();

router.get('/', tokenValidator, function (req, res) {

   db.User.find({
        where: {
            id: req.params.id
        }, attributes: ['id', 'token']
    }).then(function (user) {
        if(user && user.token === req.token) {
            Postit.findAll({
                where : {
                    id_usuario: req.params.id
                }
            }).then( function (postits) {
                res.json(postits);
            })
        } else {
            res.end(403);
        }
    });
});

router.post('/', tokenValidator , function (req, res) {

    db.User.find({
        where: {
            id: req.body.id_usuario
        }, attributes: ['id', 'token']
    }).then(function (user) {
        if(user && user.token === req.token) {

            db.Postit.create({
                id_usuario: req.body.id_usuario,
                texto: req.body.texto
            }).then(function (postit) {
                console.log(JSON.stringify(postit));
                if(postit) {
                    res.json(postit)
                }
                res.send(403);
            });
        } else {
            res.send(403);
        }
    });
});

function tokenValidator(req,res,next) {
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        req.token = bearerHeader;
        next();
    } else {
        res.send(403);
    }
}
module.exports = router;
