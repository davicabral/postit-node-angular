/**
 * Created by Davi on 02/05/16.
 */


module.exports = function (sequelize) {
    return sequelize.define('Postit', {
        id_usuario: {
            type: Sequelize.INTEGER
        },
        texto : {
            type: Sequelize.TEXT,
            defaultValue: ""
        }
    }, {
        freezeTableName: true
    });
};