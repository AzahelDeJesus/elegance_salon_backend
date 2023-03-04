const { DataTypes } = require("sequelize");
const {db} = require("../db/connectedDB");
const model_rol = require("./RolModel");

const model_auth =  db.define("users",{
    id:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    rolId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: "roles",
            key:"id"
        },
        defaultValue: 2
    }
})


model_auth.hasMany(model_rol,{
    foreignKey: "rolId"
});

model_rol.belongsTo(model_auth);


module.exports = model_auth;