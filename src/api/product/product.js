const productRouter = require('express').Router()
const { Product, ProductImage, Category } = require('../../models')
const { tokenExtractor, isAdmin } = require('../../utils/middleware')
const { Op } = require('sequelize')

productRouter.get('/', async (request, response) => {
  try {
    const products = await Product.findAll({
      attributes: ['id', 'description', 'name', 'price', 'categoryId'],
      include: [
        {
          model: ProductImage,
          as: 'images',
          attributes: ['image'],
        },
      ],
    })

    const modifiedProducts = products.map((product) => {
      return {
        id: product.id,
        description: product.description,
        name: product.name,
        price: product.price,
        categoryId: product.categoryId,
        images: product.images.map((image) => image.image),
      }
    })

    response.json(modifiedProducts)
  } catch (err) {
    console.error(err)
    response.status(500).send('Server error')
  }
})
/* Get single product */
productRouter.get('/:id', async (request, response) => {
  try {
    const { id } = request.params
    const product = await Product.findByPk(id, {
      attributes: ['id', 'description', 'name', 'price', 'categoryId'],
      include: [
        {
          model: ProductImage,
          as: 'images',
          attributes: ['image'],
        },
      ],
    })

    if (!product) {
      return response.status(404).send('Product not found')
    }

    const modifiedProduct = {
      id: product.id,
      description: product.description,
      name: product.name,
      price: product.price,
      category: product.categoryId,

      images: product.images.map((image) => image.image),
    }

    response.json(modifiedProduct)
  } catch (err) {
    console.error(err)
    response.status(500).send('Server error')
  }
})

productRouter.post('/', tokenExtractor, isAdmin, async (request, response) => {
  const body = request.body
  console.log(body)
  const newProduct = await Product.create({
    name: body.name,
    description: body.description,
    price: body.price,
    categoryId: body.category,
  })

  response.json(newProduct)
})

productRouter.put(
  '/:id',
  tokenExtractor,
  isAdmin,
  async (request, response) => {
    try {
      const { id } = request.params
      const { name, description, price, category, imageUrl } = request.body

      // Check if product exists
      const product = await Product.findByPk(id)
      if (!product) {
        return response.status(404).send('Product not found')
      }
      console.log(product)
      console.log(category)
      // Update product
      product.name = name
      product.description = description
      product.price = price
      product.categoryId = category

      await product.save()

      response.status(200).json(product)
    } catch (err) {
      console.error(err)
      response.status(500).send('Server error')
    }
  }
)

productRouter.delete(
  '/:id',
  tokenExtractor,
  isAdmin,
  async (request, response) => {
    try {
      const { id } = request.params

      // Check if the user is authorized to view the products
      // Only the user or an admin can view the products

      const isAdmin = request.decodedToken.isAdmin
      if (!isAdmin) {
        return response.status(401).send('Unauthorized')
      }

      // Check if product exists
      const product = await Product.findByPk(id)
      if (!product) {
        return response.status(404).send('Product not found')
      }

      // Delete product
      await product.destroy()

      // Clear the cart items table for the user
      await ProductImage.destroy({
        where: {
          productId: product.id,
        },
      })

      response.status(200).send('Product deleted')
    } catch (err) {
      console.error(err)
      response.status(500).send('Server error')
    }
  }
)

module.exports = productRouter
