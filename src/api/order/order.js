const router = require('express').Router()
const { tokenExtractor, isAdmin } = require('../../utils/middleware')
const { getCookieValue } = require('../../utils/helper')
const {
  User,
  Product,
  Order,
  OrderItem,
  ProductImage,
  Session,
} = require('../../models')

// Delete order
router.delete('/:id', tokenExtractor, async (req, res) => {
  try {
    const { id } = req.params

    // Check if the user is authorized to view the orders
    // Only the user or an admin can view the orders
    const isAdmin = req.decodedToken.isAdmin
    const userId = req.decodedToken.id
    const isUser = req.decodedToken.id === userId
    if (!isAdmin && !isUser) {
      return res.status(401).send('Unauthorized')
    }

    // Check if order exists
    const order = await Order.findByPk(id)
    if (!order) {
      return res.status(404).send('Order not found')
    }

    // Delete order
    await order.destroy()

    res.status(200).send('Order deleted')
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// Get all orders
router.get('/all', tokenExtractor, isAdmin, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
        },
      ],
    })

    res.status(200).json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// Get all orders for a user
router.get('/', async (req, res) => {
  try {
    // Check if the user is authorized to view the orders
    // Only the user or an admin can view the orders

    const token = getCookieValue(req.headers.cookie, 'accessToken')

    const session = await Session.findOne({ where: { token: token } })

    if (!session) {
      return res.status(401).json({ error: 'Not logged in' })
    }

    const user = await User.findByPk(session.userId)
    if (!user) {
      return res.status(404).send('User not found')
    }

    console.log(user)

    // const isAdmin = req.user.isAdmin
    // const userId = req.decodedToken.id
    // const isUser = req.decodedToken.id === userId
    // if (!isAdmin && !isUser) {
    //   return res.status(401).send('Unauthorized')
    // }

    // Check if the user exists
    // const user = await User.findByPk(userId)
    // if (!user) {
    //   return res.status(404).send('User not found')
    // }

    // Get all orders for the user
    const orders = await Order.findAll({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: OrderItem,
          attributes: ['id', 'quantity'],
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'price'],
              include: [
                {
                  model: ProductImage,
                  as: 'images',
                  attributes: ['image'],
                },
              ],
            },
          ],
        },
      ],
    })

    res.status(200).send(orders)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// Update order status
router.put('/:id', tokenExtractor, isAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    // Check if order exists
    const order = await Order.findByPk(id)
    if (!order) {
      return res.status(404).send('Order not found')
    }

    // Update order
    order.status = status
    await order.save()

    res.status(200).send('Order updated')
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// Order complete
router.put('/complete/:id', tokenExtractor, isAdmin, async (req, res) => {
  try {
    const { id } = req.params

    // Check if order exists
    const order = await Order.findByPk(id)
    if (!order) {
      return res.status(404).send('Order not found')
    }

    // Update order
    order.status = 'delivered'
    await order.save()

    res.status(200).send('Order updated')
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

module.exports = router
