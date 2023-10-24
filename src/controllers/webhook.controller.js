const { SuccessResponse } = require('../core/success.response')
const WebhookService = require('../services/webhook.service')

class WebhookController {
  webhookHandler = async (req, res, next) => {
    new SuccessResponse({
      message: 'Stripe webhook called Successfully',
      metadata: await WebhookService.webhookHandler(req),
    }).send(res)
  }
}

module.exports = new WebhookController()
