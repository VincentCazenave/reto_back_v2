const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Clubs = sequelize.define("clubs", {
        ClubID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Nom: {
            type: DataTypes.STRING
        },
        Adresse: {
            type: DataTypes.STRING
        },
        Longitude: {
            type: DataTypes.FLOAT
        },
        Latitude: {
            type: DataTypes.FLOAT
        }
    },
    {
        timestamps: false,
        createdAt: false,
        updateAt: false
    });
    return Clubs;
};