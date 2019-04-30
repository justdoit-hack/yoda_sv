'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: DataTypes.STRING,
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    authToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    inAppPhoneNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    indexes: [
      { fields: ['phoneNo'], unique: true },
      { fields: ['uid'], unique: true },
      { fields: ['authToken'], unique: true },
      { fields: ['inAppPhoneNo'], unique: true }
    ],
    scopes: {
      small: {
        attributes: ['id', 'inAppPhoneNo']
      }
    }
  })
  User.associate = function (models) {
    User.hasMany(models.Message, { as: 'fromUser', foreignKey: 'fromUserId' })
    User.hasMany(models.Message, { as: 'toUser', foreignKey: 'toUserId' })
  }

  return User
}
