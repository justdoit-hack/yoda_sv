const models = require('../../models')
const firebase = require('firebase-admin')
firebase.initializeApp({
  credential: firebase.credential.cert(require('../../firebase_credential.json'))
})
const notificationLogic = require('../../logics/push_notification_logic');

(async () => {
  const messages = await models.Message.findAll({ where: { isNotified: false } })
  await notificationLogic.bulkSendMessages(messages)
  await models.Message.update({ isNotified: true }, { where: { id: messages.map(m => m.id) } })
  process.exit(0)
})()
