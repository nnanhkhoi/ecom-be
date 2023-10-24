const express = require('express')
const { asyncHandler } = require('../../utils/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const webhookController = require('../../controllers/webhook.controller')

const router = express.Router()

router.post('', asyncHandler(webhookController.webhookHandler))

module.exports = router
