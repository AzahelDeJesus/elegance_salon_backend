const { DataTypes } = require("sequelize");
const { db } = require("../db/connectedDB");


const model_rol = db.define("roles",{
    rol:{
        type: DataTypes.STRING,
        allowNull: false
    }
})



module.exports = model_rol;