const { BadRequestError } = require('../core/error.response')
const { Cart, CartItem, User, Product, ProductImage } = require('../models')

class CartService {
  static getCartItems = async (userId) => {
    // Get all items in the user's active cart
    const cart = await Cart.findOne({
      where: {
        userId: userId,
      },
    })

    if (!cart) {
      return []
    }

    const cartItems = await CartItem.findAll({
      where: {
        cartId: cart.id,
      },
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
      order: [['id', 'ASC']], // Order by cart item ID in ascending order
    })

    const modifiedProducts = cartItems.map((product) => {
      return {
        id: product.id,
        quantity: product.quantity,
        productId: product.product.id,
        name: product.product.name,
        price: product.product.price,
        images: product.product.images
          .map((image) => image.image)
          .sort((a, b) => a.id - b.id),
      }
    })

    return modifiedProducts
  }

  static addToCart = async ({ userId, productId, quantity }) => {
    // Check if user and product exist
    const product = await Product.findByPk(productId)
    if (!product) {
      throw new BadRequestError('Product not found')
    }

    // Check if the user already has an active cart
    let cart = await Cart.findOne({
      where: {
        userId: userId,
      },
    })

    // If there is no active cart, create one
    if (!cart) {
      cart = await Cart.create({
        userId: userId,
      })
    }

    // Check if the item is already in the cart
    const cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    })

    // If the item is already in the cart, update the quantity
    if (cartItem) {
      cartItem.quantity += quantity
      if (cartItem.quantity === 0) {
        // Delete the item if quantity is 0
        await cartItem.destroy()
        return 'Item removed from cart'
      }
      await cartItem.save()
    }
    // If the item is not in the cart, add it
    else {
      await CartItem.create({
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
      })
    }

    return 'Item added to cart'
  }

  static async deleteUserCart({ userId, productId }) {
    // Check if the user already has an active cart
    let cart = await Cart.findOne({
      where: {
        userId: userId,
      },
    })

    if (!cart) throw new BadRequestError('No active cart available')

    // Check if the item exists
    const cartItem = await CartItem.findOne({ where: { productId: productId } })
    if (!cartItem) {
      throw new BadRequestError('Item not found in cart')
    }

    // Remove the item from the cart
    return await cartItem.destroy()
  }
}

module.exports = CartService
