const slack = require('../../libs/slack');

(async () => {
  await slack.sendErrorLog({ debug: 'hogehoghe' })
  await slack.sendAsteriskLog({ phoneNumber: '1234', messageNum: '1234', originalDigits: '1234' })
})()
