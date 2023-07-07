const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const { User, Session } = require('../models')

// each session contains the username of the user and the time at which it expires
class SessionClass {
  constructor(username, token, expiresAt) {
    this.username = username
    this.token = token
    this.expiresAt = expiresAt
  }

  // we'll use this method later to determine if the session has expired
  isExpired() {
    this.expiresAt < new Date()
  }
}

// this object stores the users sessions. For larger scale applications, you can use a database or cache for this purpose
const sessions = {}

loginRouter.post('/', async (request, response) => {
  const { email, password } = request.body

  const user = await User.findOne({
    where: {
      email: email,
    },
  })

  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(password, user.dataValues.hashedPassword)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid email or password',
    })
  }

  const userForToken = {
    email: user.email,
    id: user.id,
    isAdmin: user.isAdmin,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)
  // set the expiry time as 120s after the current time
  const now = new Date()
  const expiresAt = new Date(+now + 120 * 1000)

  // create a session containing information about the user and expiry time
  const session = new SessionClass(user.name, token)
  await Session.create({ token, userId: user.id })

  // In the response, set a cookie on the client with the name "session_cookie"
  // and the value as the UUID we generated. We also set the expiry time
  response.cookie('accessToken', token, {
    sameSite: 'Strict',
    secure: true,
    httpOnly: true,
    // expires: expiresAt,
  })

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
