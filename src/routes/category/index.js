const express = require('express')
const { asyncHandler } = require('../../utils/asyncHandler')
const { authentication, verifyTokenAndAdmin } = require('../../auth/authUtils')
const categoryController = require('../../controllers/category.controller')

const router = express.Router()

router.get('', asyncHandler(categoryController.getAllCategory))
router.get('/:category', asyncHandler(categoryController.getSingleCategory))

//authentication
router.use(authentication)
router.use(verifyTokenAndAdmin)

router.post('', asyncHandler(categoryController.addCategory))
router.delete('/:catergoryId', asyncHandler(categoryController.deleteCategory))
router.put('/:catergoryId', asyncHandler(categoryController.editCategory))

module.exports = router
