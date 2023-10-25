const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()

const corsOptions = {
  credentials: true,
  // origin: ['http://localhost:3000', 'http://localhost:3006'],
}

app.use(cors(corsOptions))
app.use(
  express.json({
    limit: '5mb',
    verify: (req, res, buf) => {
      req.rawBody = buf.toString()
    },
  })
)
// app.use(express.static(path.join(__dirname, '..', 'build')))

app.use(bodyParser.json())
app.use(cookieParser())

// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
// })

// init router
app.use('/', require('./routes'))

// handling error
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message || 'Internal Server Error',
  })
})

module.exports = app
