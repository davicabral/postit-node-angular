/**
 * Created by Davi on 02/05/16.
 */

module.exports = function(sequelize, Sequelize) {
    return sequelize.define('Usuario', {
        login: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true

        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        token : {
            type: Sequelize.TEXT,
            defaultValue: null
        }
    }, {
        freezeTableName: true
    });
};