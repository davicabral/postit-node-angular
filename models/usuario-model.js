/**
 * Created by Davi on 02/05/16.
 */

module.exports = function(sequelize, Sequelize) {
    return sequelize.define('Usuario', {
        login: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        token : {
            type: Sequelize.TEXT
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });
};