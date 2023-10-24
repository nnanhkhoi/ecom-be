const { CREATED, SuccessResponse } = require('../core/success.response')
const PaymentService = require('../services/payment.service')

class PaymentController {
  paymentHandler = async (req, res, next) => {
    new SuccessResponse({
      message: 'Payment Successfully',
      metadata: await PaymentService.paymentHandler(req.body),
    }).send(res)
  }

  checkoutHandler = async (req, res, next) => {
    new SuccessResponse({
      message: 'Checkout Successfully',
      metadata: await PaymentService.checkoutHandler(req.user.userId, req.body),
    }).send(res)
  }
}

module.exports = new PaymentController()
