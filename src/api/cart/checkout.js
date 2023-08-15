const router = require('express').Router()
const { tokenExtractor } = require('../../utils/middleware')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const {
  User,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
} = require('../../models')

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const { payment_id, address_id } = req.body
    const userId = req.user.id

    // get cart and related cart items
    const cart = await Cart.findAll({
      where: { userId: userId },
      attributes: [
        'id',
        'userId',
        'cart_items.quantity',
        'cart_items.product_id',
        'cart_items.product.name',
        'cart_items.product.price',
      ],
      include: {
        model: CartItem,
        attributes: [],
        include: [
          {
            model: Product,
            attributes: [],
          },
        ],
      },
      raw: true,
    })

    // Make sure that a cart was found
    if (!cart) {
      return res.status(400).send('Cart not found')
    }

    // Calculate the total price of the order
    const totalPrice = cart.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    )
    // Make sure that the required input values are valid
    if (!totalPrice || !userId || !payment_id) {
      return res.status(400).send('Invalid input')
    }

    // Create a new order
    const order = await Order.create({
      totalPrice,
      userId,
      payment_id,
      address_id,
    })

    // Copy items from the cart to the order items table
    const orderItems = cart.map((item) => {
      return {
        productId: item.product_id,
        orderId: order.id,
        quantity: item.quantity,
      }
    })

    console.log(orderItems)

    // Make sure that all order items have valid values
    for (const item of orderItems) {
      if (!item.productId || !item.orderId || !item.quantity) {
        return res.status(400).send('Invalid input')
      }
    }

    // Insert the order items into the database
    await OrderItem.bulkCreate(orderItems)

    const cartIdtoDelete = cart[0].id
    // Clear the cart items table for the user
    await CartItem.destroy({
      where: {
        cartId: cartIdtoDelete,
      },
    })

    await Cart.destroy({
      where: {
        userId: userId,
      },
    })

    let line_items = []
    cart.map((item) => {
      line_items.push({
        quantity: item.quantity,
        price_data: {
          currency: 'USD',
          product_data: { name: item.name },
          unit_amount: item.quantity * item.price * 100,
        },
      })
    })
    const stripeSession = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      // customer_email: email,
      success_url: 'https://54.165.232.218:3003/checkout?success=1',
      cancel_url: 'https://54.165.232.218:3003/checkout?canceled=1',
      metadata: { orderId: order.id },
      allow_promotion_codes: true,
    })

    res.status(200).json({
      url: stripeSession.url,
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

module.exports = router
