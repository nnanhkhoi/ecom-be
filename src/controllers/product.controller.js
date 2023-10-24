const { SuccessResponse } = require('../core/success.response')
const ProductService = require('../services/product.service')

class ProductController {
  getAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'getAllProducts Successfully',
      metadata: await ProductService.getAllProducts(),
    }).send(res)
  }

  getSingleProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'getSingleProduct Successfully',
      metadata: await ProductService.getSingleProduct(req.params),
    }).send(res)
  }

  createNewProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'createNewProduct Successfully',
      metadata: await ProductService.createNewProduct(req.body),
    }).send(res)
  }

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'updateProduct Successfully',
      metadata: await ProductService.updateProduct(req.body),
    }).send(res)
  }

  deleteProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'deleteProduct Successfully',
      metadata: await ProductService.deleteProduct(req.params),
    }).send(res)
  }

  uploadProductPhotos = async (req, res, next) => {
    new SuccessResponse({
      message: 'uploadProductPhotos Successfully',
      metadata: await ProductService.uploadProductPhotos(req),
    }).send(res)
  }

  savePhotosToDb = async (req, res, next) => {
    new SuccessResponse({
      message: 'savePhotosToDb Successfully',
      metadata: await ProductService.savePhotosToDb(req.body),
    }).send(res)
  }
}

module.exports = new ProductController()
