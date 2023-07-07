const router = require('express').Router()

// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

router.post('/', async (req, res) => {
  const {
    name,
    email,
    city,
    postalCode,
    streetAddress,
    country,
    cartProducts,
  } = req.body

  const productsIds = cartProducts
  const uniqueIds = [...new Set(productsIds)]
  const productsInfos = await Product.find({ _id: uniqueIds })

  let line_items = []
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(
      (p) => p._id.toString() === productId
    )
    const quantity = productsIds.filter((id) => id === productId)?.length || 0
    if (quantity > 0 && productInfo) {
      line_items.push({
        quantity,
        price_data: {
          currency: 'USD',
          product_data: { name: productInfo.title },
          unit_amount: quantity * productInfo.price * 100,
        },
      })
    }
  }

  // const orderDoc = await Order.create({
  //   line_items,
  //   name,
  //   email,
  //   city,
  //   postalCode,
  //   streetAddress,
  //   country,
  //   paid: false,
  //   userEmail: session?.user?.email,
  // })

  // const shippingFeeSetting = await Setting.findOne({ name: 'shippingFee' })
  // const shippingFeeCents = parseInt(shippingFeeSetting.value || '0') * 100

  const stripeSession = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    customer_email: email,
    success_url: process.env.PUBLIC_URL + '/cart?success=1',
    cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
    metadata: { orderId: orderDoc._id.toString() },
    allow_promotion_codes: true,
  })

  res.json({
    url: stripeSession.url,
  })
})

module.exports = router
