const express = require('express')
const { asyncHandler } = require('../../utils/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const cartController = require('../../controllers/cart.controller')

const router = express.Router()

//authentication
router.use(authentication)
router.get('', asyncHandler(cartController.getCartItems))
router.post('', asyncHandler(cartController.addToCart))
router.delete('', asyncHandler(cartController.deleteUserCart))

module.exports = router
