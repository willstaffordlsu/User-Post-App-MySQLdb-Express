'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    'users', 
    {
      UserId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      FirstName: DataTypes.STRING,
      LastName: DataTypes.STRING,
      Username: {
        type: DataTypes.STRING,
        unique: true
      },
      Password: {
        type: DataTypes.STRING,
        unique: true
      },
      Email: DataTypes.STRING,
      Admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      Deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
  }, {});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};