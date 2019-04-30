'use strict'

module.exports = (sequelize, DataTypes) => {
  const NotificationToken = sequelize.define('NotificationToken', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    device: {
      type: DataTypes.TINYINT,
      allowNull: false
    }
  }, {
    indexes: [{
      fields: ['userId']
    }]
  })

  NotificationToken.associate = function(models) {
    // associations can be defined here
  }

  NotificationToken.DEVICE_ANDROID = 1

  return NotificationToken
}
