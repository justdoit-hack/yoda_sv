const messagingClient = require('firebase-admin').messaging()
const models = require('../models')
const slack = require('../libs/slack')
const _ = require('lodash')

const activityTypes = {
  MESSAGE: 1
}

module.exports = {
  async bulkSendMessages (messageTableObjs) {
    const bulkSendObjs = messageTableObjs.map(message => this._messagePayload(message))
    return await this._bulkSend(bulkSendObjs)
  },

  async sendMessage (messageTableObj) {
    const sendMessageObj = this._messagePayload(messageTableObj)
    return await this._send(sendMessageObj)
  },

  _messagePayload (messageTableObj) {
    return {
      payload: {
        data: this._objectValueToString({
          title: 'メッセージが届いたよ!',
          body: messageTableObj.originalBody,
          activityType: activityTypes.MESSAGE
        })
      },
      userId: messageTableObj.toUserId
    }
  },

  // payloadは数字をSTRINGに変換しないと送信できない
  _objectValueToString (obj) {
    if (!(obj instanceof Object)) throw new Error('not object!!!')
    Object.keys(obj).forEach(key => {
      if (obj[key] instanceof Object) return
      obj[key] = obj[key].toString()
    })

    return obj
  },

  async _send (endMessageObj) {
    const tokenInfos = await models.NotificationToken.findAll({
      where: { userId: endMessageObj.userId }
    })

    const messages = tokenInfos.map(info => Object.assign(endMessageObj.payload, { token: info.token }))
    return await messagingClient.sendAll(messages)
  },

  async _bulkSend (bulkSendObjs) {
    const userIds = bulkSendObjs.map(info => info.userId)
    const tokenInfos = await models.NotificationToken.findAll({
      where: { userId: userIds }
    })

    const messages = _.flattenDeep(bulkSendObjs.map(info => {
      const tokens = tokenInfos.filter(t => t.userId === info.userId)
      return tokens.map(t => Object.assign(info.payload, { token: t.token }))
    }))

    if (messages.length < 1) return
    await slack.sendPushNotificationLog(messages).catch(e => e)
    return await messagingClient.sendAll(messages)
  }
}
