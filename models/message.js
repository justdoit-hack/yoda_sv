'use strict'
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    toUserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fromUserId: DataTypes.INTEGER,
    fromPhoneNo: DataTypes.STRING,
    sourceType: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    isNotified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    originalBody: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    parsed: DataTypes.TEXT
  }, {
    indexes: [
      { fields: ['toUserId'] },
      { fields: ['fromUserId'] }
    ]
  })
  Message.associate = function (models) {
    Message.belongsTo(models.User, { as: 'fromUser', foreignKey: 'fromUserId' })
    Message.belongsTo(models.User, { as: 'toUser', foreignKey: 'toUserId' })
  }

  Message.SOURCE_TYPE_API = 0
  Message.SOURCE_TYPE_ASTERISK = 1
  Message.SOURCE_TYPE_ANONYMOUS = 2

  return Message
}
