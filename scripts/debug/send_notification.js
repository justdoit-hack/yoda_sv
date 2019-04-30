const models = require('../../models')
const firebase = require('firebase-admin')
firebase.initializeApp({
  credential: firebase.credential.cert(require('../../firebase_credential.json'))
})
const notificationLogic = require('../../logics/push_notification_logic');

(async () => {
  const message = await models.Message.findOne({ where: {id: 1} })
  const result = await notificationLogic.sendMessage(message.get())
  console.log(result)
  process.exit(0)
})()
