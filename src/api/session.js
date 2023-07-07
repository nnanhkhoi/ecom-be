const bcrypt = require('bcrypt')
const router = require('express').Router()
const { Session, User } = require('./../models')
const { getCookieValue } = require('../utils/helper')

router.get('/', async (request, response) => {
  try {
    const token = getCookieValue(request.headers.cookie, 'accessToken')

    const session = await Session.findOne({ where: { token: token } })

    if (!session) {
      return res.status(401).json({ error: 'Not logged in' })
    }

    const user = await User.findByPk(session.userId, { attributes: ['name'] })

    response.status(200).json(user)
  } catch (err) {
    console.error(err)
    response.status(500).send('Server error')
  }
})

module.exports = router
