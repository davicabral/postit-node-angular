/**
 * Created by Davi on 01/05/16.
 */
var express = require('express');
var crypto = require('crypto');
var db = require('../models/models');
var router = express.Router();

router.get('/:id', tokenValidator, function (req, res) {

   db.User.find({
        where: {
            id: req.params.id
        }, attributes: ['id', 'token']
    }).then(function (user) {
        if(user && user.token === req.token) {
            db.Postit.findAll({
                where : {
                    id_usuario: req.params.id,
                    ativo: true
                }
            }).then( function (postits) {
                res.json(postits);
            })
        } else {
            res.sendStatus(403);
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
                texto: req.body.texto,
                ativo: true
            }).then(function (postit) {
                if(postit) {
                    res.json(postit)
                } else {
                    res.sendStatus(403);
                }
            });
        } else {

            res.sendStatus(403);
        }
    });
});

router.delete('/:id/:id_postit', tokenValidator, function (req, res) {

    db.User.find({
        where: {
            id: req.params.id
        }, attributes: ['id', 'token']
    }).then(function (user) {
        if(user && user.token === req.token) {
            db.Postit.findOne({
                where : {id: req.params.id_postit}
            }).then(function (postit) {
                if(postit) {
                    postit.updateAttributes({
                        ativo: false
                    }).then(function (data) {
                        res.json(data);
                    })
                }
            });
        } else {
            res.sendStatus(403);
        }
    });
});

router.put('/', tokenValidator , function (req, res) {

    console.log(req.body);
    db.User.find({
        where: {
            id: req.body.id_usuario
        }, attributes: ['id', 'token']
    }).then(function (user) {
        if(user && user.token === req.token) {

            db.Postit.findOne({
                where : {id: req.body.id}
            }).then(function (postit) {
                if(postit) {
                    postit.updateAttributes({
                        texto: req.body.textoEditado
                    }).then(function (data) {
                        res.json(data);
                    })
                }
            });
        } else {

            res.sendStatus(403);
        }
    });
});

function tokenValidator(req,res,next) {
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        req.token = bearerHeader;
        next();
    } else {
        res.sendStatus(403);
    }
}
module.exports = router;
