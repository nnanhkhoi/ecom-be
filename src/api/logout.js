const router = require('express').Router()
const { tokenExtractor } = require('../utils/middleware')
const { Session } = require('../models')

router.post('/', tokenExtractor, async (request, response) => {
  console.log(request.user)
  try {
    await Session.destroy({
      where: {
        user_id: request.user.id,
      },
    })

    response.cookie('accessToken', '')

    response.status(204).end()
  } catch (error) {
    response
      .status(500)
      .json({ message: 'Something went wrong, cannot logout' })
  }
})

module.exports = router
