const express = require('express')
const router = express.Router()
const authAsterisk = require('../filters/auth_asterisk')
const stdParser = require('../libs/std_parser')
const models = require('../models')
const { check, validationResult } = require('express-validator/check')
const slack = require('../libs/slack')

// Asteriskからのメッセージ処理
router.post('/create', [
  authAsterisk,
  check('userId').exists(),
  check('phoneNumber').exists(),
  check('messageNum').exists()
], async (req, res, next) => {
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    next({ code: '1001', name: 'InvalidParameterError', detail: validationErrors.mapped() })
    await slack.sendAsteriskLog(req.body)
    return
  }

  const parsed = stdParser(req.body.messageNum)
  const isAnonymous = req.body.phoneNumber === 'Anonymous'
  const sourceType = isAnonymous ? models.Message.SOURCE_TYPE_ANONYMOUS : models.Message.SOURCE_TYPE_ASTERISK
  const toUser = await models.User.findOne({
    where: { inAppPhoneNo: req.body.userId },
    attributes: ['id', 'inAppPhoneNo']
  })

  await slack.sendAsteriskLog(req.body).catch(e => e)

  if (!toUser) {
    const error = { code: '1005', name: 'AsteriskMessageError', message: 'not find user' }
    next(error)
    return
  }

  const fromUser = await models.User.findOne({
    where: { phoneNo: req.body.phoneNumber },
    attributes: ['id']
  })

  await models.Message.create({
    toUserId: toUser.id,
    fromUserId: fromUser ? fromUser.id : null,
    fromPhoneNo: isAnonymous ? req.body.phoneNumber : null,
    sourceType,
    originalBody: req.body.messageNum,
    parsed
  })

  res.json({ ok: 1 })
})

module.exports = router
