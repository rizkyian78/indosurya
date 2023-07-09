const { DataTypes } = require("sequelize")
const sequelize = require("../models/index").sequelize

const User = require("../models/user")


module.exports = {
User: User(sequelize, DataTypes)
}