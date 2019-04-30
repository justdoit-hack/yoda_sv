const { IncomingWebhook } = require('@slack/webhook')
const SERVER_LOGS_CHANNEL = new IncomingWebhook('XXXXX')
const ASTERISK_LOGS_CHANNEL = new IncomingWebhook('XXXXX')
const PUSH_NOTIFY_LOGS_CHANNEL = new IncomingWebhook('XXXXX')

module.exports = {
  async sendErrorLog (err) {
    const message = `
エラーが発生しました!!! 対処したまえ!!!
\`\`\`
${JSON.stringify({
  code: err.code || '0001',
  name: err.name || 'UnknownError',
  message: err.message || 'Internal Server Error! Please check server log!',
  detail: err
})}
\`\`\``
    await this._send(SERVER_LOGS_CHANNEL, message)
  },

  async sendAsteriskLog (asteriskReq) {
    const message = `
ASTERISKからの情報がきたぞ！！！
\`\`\`
PHONE_NO: ${asteriskReq.phoneNumber}
MESSAGE_NUM: ${asteriskReq.messageNum}
ORIGINAL_INPUT_DIGITS: ${asteriskReq.originalDigits}
\`\`\``
    await this._send(ASTERISK_LOGS_CHANNEL, message)
  },

  async sendPushNotificationLog (messages) {
    const message = `
PUSH通知を送信したぞ!!! 確認しろおおおお
\`\`\`
${JSON.stringify(messages)}
\`\`\``

    await this._send(PUSH_NOTIFY_LOGS_CHANNEL, message)
  },

  async _send (webhook, message) {
    if (process.env.NODE_ENV !== 'production') return
    await webhook.send(message)
  }
}
