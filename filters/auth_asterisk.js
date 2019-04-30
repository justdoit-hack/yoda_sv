const config = require('config')

module.exports = (req, res, next) => {
  if (req.body.secret === config.Asterisk.secret) {
    next()
  } else {
    next({ code: '1002', message: 'AsteriskAuthError' })
  }
}
