const { SuccessResponse } = require('../core/success.response')
const CategoryService = require('../services/category.service')

class CategoryController {
  getAllCategory = async (req, res, next) => {
    new SuccessResponse({
      message: 'getAllCategory Successfully',
      metadata: await CategoryService.getAllCategory(),
    }).send(res)
  }

  getSingleCategory = async (req, res, next) => {
    new SuccessResponse({
      message: 'getSingleCategory Successfully',
      metadata: await CategoryService.getSingleCategory(req.params),
    }).send(res)
  }
  addCategory = async (req, res, next) => {
    new SuccessResponse({
      message: 'addCategory Successfully',
      metadata: await CategoryService.addCategory(req.body),
    }).send(res)
  }
  deleteCategory = async (req, res, next) => {
    new SuccessResponse({
      message: 'deleteCategory Successfully',
      metadata: await CategoryService.deleteCategory(req.params),
    }).send(res)
  }
  editCategory = async (req, res, next) => {
    new SuccessResponse({
      message: 'editCategory Successfully',
      metadata: await CategoryService.editCategory(req.body),
    }).send(res)
  }
}

module.exports = new CategoryController()
