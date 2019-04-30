const express = require('express')
const router = express.Router()
const authToken = require('../filters/auth_token')
const { check, validationResult } = require('express-validator/check')
const stdParser = require('../libs/std_parser')
const models = require('../models')

// メッセージ投稿
router.post('/create', [
  authToken,
  check('body').exists(),
  check('isAnonymous').isBoolean(),
  check('toInAppPhoneNo').isLength({ min: 7, max: 7 })
], async (req, res, next) => {
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    next({ code: '1001', name: 'InvalidParameterError', detail: validationErrors.mapped() })
    return
  }
  const isAnonymous = JSON.parse(req.body.isAnonymous)
  const parsed = stdParser(req.body.body)
  const sourceType = isAnonymous ? models.Message.SOURCE_TYPE_ANONYMOUS : models.Message.SOURCE_TYPE_API
  const user = await models.User.findOne({
    where: { inAppPhoneNo: req.body.toInAppPhoneNo }
  })

  if (!user) {
    next({ code: '1007', name: 'UserNotFound', message: 'user not found', detail: { paramName: 'toInAppPhoneNo' } })
    return
  }

  await models.Message.create({
    toUserId: user.id,
    fromUserId: isAnonymous ? null : req.authUser.id,
    sourceType,
    originalBody: req.body.body,
    parsed
  })

  res.json({ ok: 1 })
})

router.post('/createFromWeb', [check('toInAppPhoneNo').isLength({ min: 7, max: 7 }), check('body').exists()], async (req, res, next) => {
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    next({ code: '1001', name: 'InvalidParameterError', detail: validationErrors.mapped() })
    return
  }

  const parsed = stdParser(req.body.body)
  const user = await models.User.findOne({
    where: { inAppPhoneNo: ~~req.body.toInAppPhoneNo }
  })

  if (!user) {
    next({ code: '1007', name: 'UserNotFound', message: 'user not found', detail: { paramName: 'toInAppPhoneNo' } })
    return
  }

  await models.Message.create({
    toUserId: user.id,
    sourceType: models.Message.SOURCE_TYPE_ANONYMOUS,
    originalBody: req.body.body,
    parsed
  })

  res.json({ ok: 1 })
})

// メッセージ送信履歴取得
router.get('/history/send', authToken, async (req, res, next) => {
  const limit = ~~req.query.limit || 50
  const offset = ~~req.query.offset || 0

  const messages = await models.Message.findAll({
    include: [{
      model: models.User.scope('small'),
      as: 'toUser'
    }],
    where: { fromUserId: req.authUser.id },
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  })

  res.json({ ok: 1, messages })
})

// メッセージ受信履歴取得
router.get('/history/receive', authToken, async (req, res, next) => {
  const limit = ~~req.query.limit || 50
  const offset = ~~req.query.offset || 0

  const messages = await models.Message.findAll({
    include: [{
      model: models.User.scope('small'),
      as: 'fromUser'
    }],
    where: { toUserId: req.authUser.id },
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  })

  res.json({ ok: 1, messages })
})

// メッセージ単体取得
router.get('/:messageId', authToken, async (req, res, next) => {
  const message = await models.Message.findOne({
    where: {
      id: req.params.messageId,
      [models.Sequelize.Op.or]: [
        { toUserId: req.authUser.id },
        { fromUserId: req.authUser.id }
      ]
    }
  })

  if (!message) {
    next({ code: '1008', name: 'MessageNotFound', message: 'message not found' })
    return
  }

  res.json({ ok: 1, message })
})

module.exports = router
