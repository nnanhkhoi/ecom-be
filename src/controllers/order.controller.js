const { SuccessResponse } = require('../core/success.response')
const OrderService = require('../services/order.service')

class OrderController {
  getUserOrders = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get user order Success',
      metadata: await OrderService.getUserOrders(req.user.userId),
    }).send(res)
  }
  getAllOrders = async (req, res, next) => {
    new SuccessResponse({
      message: 'getAllOrders Success',
      metadata: await OrderService.getAllOrders(req.body),
    }).send(res)
  }
  updateOrder = async (req, res, next) => {
    new SuccessResponse({
      message: 'updateOrder Success',
      metadata: await OrderService.updateOrder(req.params.orderId, req.body),
    }).send(res)
  }
  deleteOrder = async (req, res, next) => {
    new SuccessResponse({
      message: 'deleteOrder Success',
      metadata: await OrderService.deleteOrder(req.params.orderId),
    }).send(res)
  }
}

module.exports = new OrderController()
