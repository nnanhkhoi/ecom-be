const { where } = require('sequelize')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { Order, OrderItem, Product, ProductImage } = require('../models')

class OrderService {
  static getUserOrders = async (userId) => {
    // Get all orders for the user
    const orders = await Order.findAll({
      where: {
        userId: userId,
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

    return orders
  }

  static async getAllOrders() {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
        },
      ],
    })

    return orders
  }

  static async updateOrder(orderId, status) {
    const newStatus = status.status
    // Check if order exists
    const order = await Order.findByPk(orderId)
    if (!order) {
      throw new BadRequestError('Order not found')
    }

    // Update order
    order.status = newStatus
    return await order.save()
  }

  static async deleteOrder(orderId) {
    // Check if order exists
    const order = await Order.findByPk(orderId)
    if (!order) {
      throw new NotFoundError('Order not found')
    }

    // Delete order
    await OrderItem.destroy({ where: { order_id: orderId } })
    return await order.destroy()
  }
}

module.exports = OrderService
