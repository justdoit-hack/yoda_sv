const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const config = require('config')
require('express-async-errors')
const firebase = require('firebase-admin')
firebase.initializeApp({
  credential: firebase.credential.cert(require('./firebase_credential.json'))
})
const slack = require('./libs/slack')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index'))
app.use('/debug', require('./routes/debug'))

// Backend APIs
app.use('/api/asterisk', require('./routes/asterisk'))

// Front APIs
app.use('/api/users', require('./routes/user'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/messages', require('./routes/message'))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  console.log('===== ERROR =====')
  console.error(err)

  // render the error page
  res.status(err.status || 500)
  res.format({
    json: (req, res) => {
      res.json({
        code: err.code || '0001',
        name: err.name || 'UnknownError',
        message: err.message || 'Internal Server Error! Please check server log!'
      })
    },
    html: (req, res) => {
      const errorTemplate = err.status === 404 ? 'not_found' : 'error'
      res.render(`errors/${errorTemplate}`)
    }
  })

  slack.sendErrorLog(err).catch(e => console.log(e))
})

app.listen(config.Port)
console.log(`server starting... :${config.Port}`)

module.exports = app
