const express = require('express')
const AccessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../utils/asyncHandler')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

//sign up
router.post('/shop/signup', asyncHandler(AccessController.signUp))
router.post('/shop/login', asyncHandler(AccessController.login))
router.post(
  '/shop/handleRefreshToken',
  asyncHandler(AccessController.handleRefreshToken)
)

//authentication
router.use(authentication)

router.post('/shop/logout', asyncHandler(AccessController.logout))

module.exports = router
