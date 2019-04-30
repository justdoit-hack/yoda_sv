const stdTable = require('../std.json')

module.exports = stdCode => {
  const splited = stdCode.split(/(.{2})/).filter(num => num)
  const parsed = splited.map(code => stdTable[code]).join('')
  return parsed
}
