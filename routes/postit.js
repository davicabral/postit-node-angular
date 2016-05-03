/**
 * Created by Davi on 01/05/16.
 */
var express = require('express');
var db = require('../models/models');
var router = express.Router();

//Chamada responsável por requisitar todos os postits relacionados com o ID parametro
router.get('/:id', tokenValidator, function (req, res) {

   db.User.find({
        where: {
            id: req.params.id
        }, attributes: ['id', 'token']
    }).then(onUserFindSuccess);

    function onUserFindSuccess(user) {
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
    }
});

//Chamada responsável por criar um postit novo
router.post('/', tokenValidator , function (req, res) {

    db.User.find({
        where: {
            id: req.body.id_usuario
        }, attributes: ['id', 'token']
    }).then(onUserFindSuccess);

    //Verificação de token de autenticação
    function onUserFindSuccess(user) {
        if(user && user.token === req.token) {

            db.Postit.create({
                id_usuario: req.body.id_usuario,
                texto: req.body.texto,
                ativo: true
            }).then(onPostitCreationSuccess);
        } else {
            res.sendStatus(403);
        }
    }

    function onPostitCreationSuccess(postit) {
        if(postit) {
            res.json(postit)
        } else {
            res.sendStatus(403);
        }
    }

});

//Chamada responsável por mudar o atributo ativo do postit, tornando-o invisível para o usuário
router.delete('/:id/:id_postit', tokenValidator, function (req, res) {

    //Consulta do usuario para futura verificação de token de autenticação
    db.User.find({
        where: {
            id: req.params.id
        }, attributes: ['id', 'token']
    }).then(onUserFindSuccess);

    function onUserFindSuccess(user) {
        if (user && user.token === req.token) {
            db.Postit.findOne({
                where: {id: req.params.id_postit}
            }).then(onPostitDeleteSuccess);
        } else {
            res.sendStatus(403);
        }
    }

    function onPostitDeleteSuccess(postit){
        if(postit) {
            postit.updateAttributes({
                ativo: false
            }).then(function (data) {
                res.json(data);
            })
        }
    }
});

//Chamada responsável por editar um postit
router.put('/', tokenValidator , function (req, res) {

    //Consulta do usuario para futura verificação de token de autenticação
    db.User.find({
        where: {
            id: req.body.id_usuario
        }, attributes: ['id', 'token']
    }).then(onUserFindSuccess);

    //Verificação de token de autenticação e consulta do postit a ser editado
    function onUserFindSuccess( user ) {
        if(user && user.token === req.token) {
            db.Postit.findOne({
                where : {id: req.body.id}
            }).then(onPostitFindSuccess);
        } else {
            res.sendStatus(403);
        }
    }

    //Updade dos dados do postit
    function onPostitFindSuccess(postit) {
        if(postit) {
            postit.updateAttributes({
                texto: req.body.textoEditado
            }).then(function (data) {
                res.json(data);
            })
        }
    }
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
