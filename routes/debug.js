const express = require('express')
const router = express.Router()

router.get('/', async (req, res, next) => {
  next({hoge: 'fuga'})
})

module.exports = router
