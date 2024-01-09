const { SuccessResponse } = require('../core/success.response')
const CartService = require('../services/cart.service')

class CartController {
  getCartItems = async (req, res, next) => {
    new SuccessResponse({
      message: 'getCartItems Success',
      metadata: await CartService.getCartItems(req.user.userId),
    }).send(res)
  }

  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'addToCart Success',
      metadata: await CartService.addToCart(req.body),
    }).send(res)
  }

  deleteUserCart = async (req, res, next) => {
    console.log(req.body)
    new SuccessResponse({
      message: 'deleteUserCart Success',
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res)
  }
}

module.exports = new CartController()
