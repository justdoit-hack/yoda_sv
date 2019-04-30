const models = require('../models')

module.exports = {
  async generateNewUserPhoneNo () {
    const registeredNumbers = await models.User.findAll({ attributes: ['inAppPhoneNo'] }).map(u => u.inAppPhoneNo)
    while (true) {
      const generateNo = Math.random().toString().slice(2, 8)
      if (!registeredNumbers.includes(generateNo)) return `0${generateNo}`
    }
  }
}
