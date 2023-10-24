const express = require('express')
const { asyncHandler } = require('../../utils/asyncHandler')
const paymentController = require('../../controllers/payment.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

//authentication
router.use(authentication)

router.post('/', asyncHandler(paymentController.checkoutHandler))
router.post('/payment', asyncHandler(paymentController.paymentHandler))

module.exports = router
