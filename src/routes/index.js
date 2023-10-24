const express = require('express')
const router = express.Router()

router.use('/v1/api/products', require('./product'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api/order', require('./order'))
router.use('/v1/api/checkout', require('./payment'))
router.use('/v1/api/webhook', require('./webhook'))
router.use('/v1/api/category', require('./category'))
router.use('/v1/api/address', require('./address'))
router.use('/v1/api/user', require('./user'))
router.use('/v1/api', require('./access'))

module.exports = router
