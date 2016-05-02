/**
 * Created by Davi on 02/05/16.
 */


module.exports = function (sequelize, Sequelize, User) {
    return sequelize.define('Postit', {
        id_usuario: {
            type: Sequelize.INTEGER,
            allowNull : false,
            references: {
                model: User,
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        },
        texto : {
            type: Sequelize.TEXT,
            defaultValue: ""
        },
        ativo : {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }, {
        freezeTableName: true
    });
};