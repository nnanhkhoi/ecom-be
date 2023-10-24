const express = require('express')
const { asyncHandler } = require('../../utils/asyncHandler')
const { authentication, verifyTokenAndAdmin } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')

const router = express.Router()

router.get('/', asyncHandler(productController.getAllProducts))
router.get('/:id', asyncHandler(productController.getSingleProduct))

//authentication
router.use(authentication)
router.use(verifyTokenAndAdmin)

router.post('', asyncHandler(productController.createNewProduct))
router.post('/upload', asyncHandler(productController.uploadProductPhotos))
router.post('/savephoto', asyncHandler(productController.savePhotosToDb))
router.put('/:id', asyncHandler(productController.updateProduct))
router.delete('/:id', asyncHandler(productController.deleteProduct))
module.exports = router
