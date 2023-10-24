const express = require('express')
const { asyncHandler } = require('../../utils/asyncHandler')
const addressController = require('../../controllers/address.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

router.use(authentication)
router.post('/', asyncHandler(addressController.createNewAddress))
router.patch('/', asyncHandler(addressController.updateAddress))

module.exports = router
