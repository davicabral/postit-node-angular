/**
 * Created by Davi on 02/05/16.
 */

if (!database) {
    var database;
    var Sequelize = require('sequelize');
    var Usuario = require('./usuario-model');
    var Postit = require('./postit-model');
    var sequelize = null;

    if (process.env.DATABASE_URL) {
        sequelize = new Sequelize(process.env.DATABASE_URL);
    } else {
        sequelize = new Sequelize("postgres://postgres:123456@localhost:5432/postgres")
    }
    var UserModel = Usuario(sequelize, Sequelize)
    database = {
        Sequelize: Sequelize,
        sequelize: sequelize,
        User:      UserModel,
        Postit:    Postit(sequelize, Sequelize, UserModel)
    };
}

module.exports = database;
