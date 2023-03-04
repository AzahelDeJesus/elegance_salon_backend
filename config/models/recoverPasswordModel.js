const { DataTypes } = require("sequelize");
const { db } = require("../db/connectedDB");


const model_recoverPassword = db.define("recoverPasswords",{
    token:{
        type: DataTypes.STRING,
        allowNull: false
    }
});


module.exports = model_recoverPassword;