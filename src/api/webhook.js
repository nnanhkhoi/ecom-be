const router = require('express').Router()
const Stripe = require('stripe')

const { Order } = require('../models')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  'whsec_5ce5e4576e4fb3368d6a95efe02e10b686fd951ff8186c6675c8f7d36ddfa7bb'

router.post('/', async (request, response) => {
  const signature = request.headers['stripe-signature']
  let event = request.body

  try {
    event = stripe.webhooks.constructEvent(
      request.rawBody,
      signature,
      endpointSecret
    )
    console.log(event)
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`)
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
          return res.status(404).send('Order not found')
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
  response.status(200).send('ok')
})

module.exports = router
