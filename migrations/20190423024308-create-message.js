'use strict'

const TABLE_NAME = 'Messages'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      toUserId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fromUserId: {
        type: Sequelize.INTEGER
      },
      fromPhoneNo: {
        type: Sequelize.STRING
      },
      sourceType: {
        type: Sequelize.TINYINT,
        allowNull: false
      },
      isNotified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      originalBody: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      parsed: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      charset: 'utf8mb4'
    })

    await queryInterface.addIndex(TABLE_NAME, ['toUserId'])
    await queryInterface.addIndex(TABLE_NAME, ['fromUserId'])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME)
  }
}
