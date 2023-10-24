const express = require('express')
const { asyncHandler } = require('../../utils/asyncHandler')
const { authentication, verifyTokenAndAdmin } = require('../../auth/authUtils')
const userController = require('../../controllers/user.controller')

const router = express.Router()

//authentication
router.use(authentication)
router.use(verifyTokenAndAdmin)

router.get('', asyncHandler(userController.getAllUser))
router.get('/admin', asyncHandler(userController.getAllAdmin))
router.get('/:id', asyncHandler(userController.getUserById))
router.put('/:id', asyncHandler(userController.updateUserById))
router.delete('/:id', asyncHandler(userController.deleteUserById))

module.exports = router
