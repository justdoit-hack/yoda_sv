'use strict'

const TABLE_NAME = 'Users'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(TABLE_NAME, 'uid', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    })
    await queryInterface.removeColumn(TABLE_NAME, 'authType')
    await queryInterface.removeColumn(TABLE_NAME, 'password')
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn(TABLE_NAME, 'authType', {
      type: Sequelize.TINYINT,
      after: 'uid',
      allowNull: false,
      defaultValue: 1
    })
    await queryInterface.addColumn(TABLE_NAME, 'password', {
      type: Sequelize.STRING,
      after: 'inAppPhoneNo'
    })
    await queryInterface.changeColumn(TABLE_NAME, 'uid', {
      type: Sequelize.STRING,
      unique: true
    })
  }
}
