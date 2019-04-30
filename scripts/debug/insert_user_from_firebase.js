const models = require('../../models')
const generateNoLogic = require('../../logics/in_app_phone_no_logic')
const firebase = require('firebase-admin')
firebase.initializeApp({
  credential: firebase.credential.cert(require('../../firebase_credential.json'))
})
const uuid = require('uuid/v4');

(async () => {
  try {
    const firebaseUserList = await firebase.auth().listUsers(1000)
    const users = await Promise.all(firebaseUserList.users.map(async u => {
      const user = u.toJSON()
      return {
        name: '匿名',
        uid: user.uid,
        phoneNo: user.phoneNumber.replace('+81', '0'),
        inAppPhoneNo: await generateNoLogic.generateNewUserPhoneNo(),
        authToken: uuid().replace(/-/g, '')
      }
    }))
    console.log(users)
    await models.User.bulkCreate(users)
  } catch (e) {
    console.error(e)
  }
  models.sequelize.close()
  process.exit(0)
})()
