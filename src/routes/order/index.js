const express = require('express')
const { asyncHandler } = require('../../utils/asyncHandler')
const { authentication, verifyTokenAndAdmin } = require('../../auth/authUtils')
const orderController = require('../../controllers/order.controller')

const router = express.Router()

//authentication
router.use(authentication)
router.get('', asyncHandler(orderController.getUserOrders))
router.put('/:orderId', asyncHandler(orderController.updateOrder))
router.delete('/:orderId', asyncHandler(orderController.deleteOrder))

router.use(verifyTokenAndAdmin)
router.get('/all', asyncHandler(orderController.getAllOrders))

module.exports = router
