'use strict';
module.exports = (sequelize, DataTypes) => {
  const posts = sequelize.define(
    'posts',
    {
      PostId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      PostTitle: DataTypes.STRING,
      PostBody: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      Deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
  }, {});
  posts.associate = function(models) {
    // associations can be defined here
  };
  return posts;
};