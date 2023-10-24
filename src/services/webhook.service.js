const Stripe = require('stripe')

const { Order } = require('../models')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET

class WebhookService {
  static async webhookHandler(request) {
    const signature = request.headers['stripe-signature']
    let event = request.body

    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        signature,
        endpointSecret
      )
    } catch (err) {
      throw new BadRequestError(`Webhook Error: ${err.message}`)
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log(
          `PaymentIntent for ${paymentIntent.amount / 100} was successful!`
        )
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break
      case 'checkout.session.completed':
        const data = event.data.object
        const orderId = data.metadata.orderId
        const paid = data.payment_status === 'paid'
        if (orderId && paid) {
          const order = await Order.findByPk(orderId)
          if (!order) {
            throw new NotFoundError('Order not found')
          }

          // Update order
          order.status = 'confirmed'
          await order.save()
        }
        // Then define and call a function to handle the event subscription_schedule.canceled
        break
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    // Return a 200 response to acknowledge receipt of the event
    return 'ok'
  }
}

module.exports = WebhookService
