const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const models = require('../models')
const authClient = require('firebase-admin').auth()
const generateNoLogic = require('../logics/in_app_phone_no_logic')
const uuid = require('uuid/v4')

// ユーザーログイン
router.post('/firebase/verify', [check('token').exists()], async(req, res, next) => {
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    next({ code: '1001', name: 'InvalidParameterError', detail: validationErrors.mapped() })
    return
  }

  const decoded = await authClient.verifyIdToken(req.body.token).catch(e => e)
  if (!decoded.uid) {
    next({ code: '1009', name: 'FirebaseAuthError', detail: decoded })
    return
  }
  const userInfo = await authClient.getUser(decoded.uid).catch(e => e)
  if (!userInfo.phoneNumber) {
    next({ code: '1009', name: 'FirebaseAuthError', detail: decoded })
    return
  }
  const inAppPhoneNo = await generateNoLogic.generateNewUserPhoneNo()
  const authToken = uuid().replace(/-/g, '')
  const phoneNo = userInfo.phoneNumber.replace('+81', '0')
  const fromMessages = await models.Message.findAll({ where: { fromPhoneNo: phoneNo } })

  const user = await models.sequelize.transaction(async t => {
    const users = await models.User.findOrCreate({
      where: { uid: decoded.uid },
      defaults: {
        name: '匿名',
        inAppPhoneNo,
        phoneNo,
        authToken
      },
      transaction: t
    })

    if (fromMessages.length > 0) {
      await models.Message.update({ fromUserId: users[0].id }, {
        where: { id: fromMessages.map(fm => fm.id) },
        transaction: t
      })
    }

    return users[0]
  })

  res.json({
    ok: 1,
    user: {
      id: user.id,
      name: user.name,
      inAppPhoneNo: user.inAppPhoneNo,
      authToken: user.authToken
    }
  })
})

module.exports = router
