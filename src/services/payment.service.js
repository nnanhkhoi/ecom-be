const { BadRequestError } = require('../core/error.response')
const { Cart, CartItem, Product, Order, OrderItem } = require('../models')

// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

class PaymentService {
  static async checkoutHandler(userId, { payment_id, address_id }) {
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
      throw new BadRequestError('Cart not found')
    }

    // Calculate the total price of the order
    const totalPrice = cart.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    )
    // Make sure that the required input values are valid
    if (!totalPrice || !userId || !payment_id) {
      throw new BadRequestError('Invalid input')
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

    // Make sure that all order items have valid values
    for (const item of orderItems) {
      if (!item.productId || !item.orderId || !item.quantity) {
        throw new BadRequestError('Invalid input')
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
      success_url: 'http://localhost:3000/checkout?success=1',
      cancel_url: 'http://localhost:3000/checkout?canceled=1',
      metadata: { orderId: order.id },
      allow_promotion_codes: true,
    })

    return {
      url: stripeSession.url,
    }
  }

  static async paymentHandler({
    name,
    email,
    city,
    postalCode,
    streetAddress,
    country,
    cartProducts,
  }) {
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
  }
}

module.exports = PaymentService
