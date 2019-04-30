const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const models = require('../models')
const authToken = require('../filters/auth_token')

// ユーザー情報を取得
router.get('/fetch', authToken, async (req, res, next) => {
  res.json({
    ok: 1,
    user: {
      id: req.authUser.id,
      name: req.authUser.name,
      inAppPhoneNo: req.authUser.inAppPhoneNo
    }
  })
})

// 通知用トークンの登録
router.post('/notification/registerToken', [
  authToken,
  check('registerToken').exists()
], async (req, res, next) => {
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    next({ code: '1001', name: 'InvalidParameterError', detail: validationErrors.mapped() })
    return
  }

  const notifications = await models.NotificationToken.findOrBuild({
    where: { userId: req.authUser.id, device: models.NotificationToken.DEVICE_ANDROID },
    defaults: { token: req.body.registerToken }
  })
  notifications[0].token = req.body.registerToken
  await notifications[0].save()

  res.json({ ok: 1 })
})

module.exports = router
