const models = require('../models')

module.exports = async (req, res, next) => {
  const authToken = req.body.authToken || req.query.authToken
  const user = await models.User.findOne({
    where: { authToken },
    attributes: ['id', 'inAppPhoneNo', 'phoneNo']
  })

  if (user) {
    req.authUser = user.get()
    next()
  } else {
    next({ code: '1006', name: 'TokenAuthError', message: 'Invalid Auth Token' })
  }
}
