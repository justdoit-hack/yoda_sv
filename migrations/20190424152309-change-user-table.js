'use strict'

const TABLE_NAME = 'Users'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(TABLE_NAME, 'uid', {
      type: Sequelize.STRING,
      after: 'id'
    })
    await queryInterface.addColumn(TABLE_NAME, 'authType', {
      type: Sequelize.TINYINT,
      after: 'uid',
      allowNull: false,
      defaultValue: 1
    })
    await queryInterface.addIndex(TABLE_NAME, ['uid'], {
      unique: true
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(TABLE_NAME, 'uid')
    await queryInterface.removeColumn(TABLE_NAME, 'authType')
  }
}
