const router = require('express').Router()
const { User, Product, Cart, CartItem, ProductImage } = require('../../models')
const { tokenExtractor } = require('../../utils/middleware')

// Add item to cart
router.post('/', tokenExtractor, async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const userId = req.user.id

    // Check if user and product exist
    const user = await User.findByPk(userId)
    const product = await Product.findByPk(productId)
    if (!user || !product) {
      return res.status(404).send('User or product not found')
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
        return res.status(200).send('Item removed from cart')
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

    res.status(200).send('Item added to cart')
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// Update item quantity in cart
router.patch('/:itemId', tokenExtractor, async (req, res) => {
  try {
    const { itemId } = req.params
    const { quantity } = req.body

    // Check if the item exists
    const cartItem = await CartItem.findByPk(itemId)
    if (!cartItem) {
      return res.status(404).send('Item not found in cart')
    }

    // Update the quantity and save the changes
    cartItem.quantity = quantity

    if (cartItem.quantity === 0) {
      // Delete the item if quantity is 0
      await cartItem.destroy()
      return res.status(200).send('Item removed from cart')
    } else {
      await cartItem.save()
      return res.status(200).send('Item quantity updated')
    }
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// Remove item from cart
router.delete('/:itemId', tokenExtractor, async (req, res) => {
  try {
    const { itemId } = req.params

    // Check if the item exists
    const cartItem = await CartItem.findOne({ where: { productId: itemId } })
    if (!cartItem) {
      return res.status(404).send('Item not found in cart')
    }

    // Remove the item from the cart
    await cartItem.destroy()

    res.status(200).send('Item removed from cart')
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// Get all items in cart for a user
router.get('/', tokenExtractor, async (req, res) => {
  try {
    const userId = req.user.id

    // Check if the user exists
    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).send('User not found')
    }

    // Get all items in the user's active cart
    const cart = await Cart.findOne({
      where: {
        userId: userId,
      },
    })

    if (!cart) {
      return res.status(200).send([])
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

    res.status(200).send(modifiedProducts)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

module.exports = router
