const jwt = require('jsonwebtoken')
const { SECRET } = require('../configs/config.js')
const Session = require('../models/session.js')
const User = require('../models/user.js')

const tokenExtractor = async (req, res, next) => {
  // const authorization = req.get('Authorization')
  const accessToken = req.cookies.accessToken
  // if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
  if (accessToken) {
    try {
      // const token = jwt.verify(authorization.substring(7), SECRET)
      // const jwtToken = req.header('Authorization').split(' ')[1] // get the session token from the request headers

      const session = await Session.findOne({ where: { token: accessToken } })

      if (!session) {
        return res.status(401).json({ error: 'Invalid authentication token' })
      }

      const user = await User.findByPk(session.userId)

      // if (user.disabled) {
      //   return res.status(401).json({ error: 'This account has been disabled' })
      // }

      req.user = user
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

// Middleware to check if the user is admin
const isAdmin = (req, res, next) => {
  const isAdmin = req.user.isAdmin
  if (!isAdmin) {
    return res.status(401).send('Unauthorized, you are not an admin')
  }
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  } else if (error.name === 'ReferenceError') {
    return response.status(404).json({ error: 'userId is not defined' })
  }
  next(error)
}

module.exports = { tokenExtractor, isAdmin, unknownEndpoint, errorHandler }
