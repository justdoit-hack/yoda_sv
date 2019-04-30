'use strict'

const TABLE_NAME = 'Users'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      phoneNo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      authToken: {
        allowNull: false,
        type: Sequelize.STRING
      },
      inAppPhoneNo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
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

    await queryInterface.addIndex(TABLE_NAME, ['phoneNo'], {
      unique: true
    })
    await queryInterface.addIndex(TABLE_NAME, ['authToken'], {
      unique: true
    })
    await queryInterface.addIndex(TABLE_NAME, ['inAppPhoneNo'], {
      unique: true
    })
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable(TABLE_NAME)
  }
}
