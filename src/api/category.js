const router = require('express').Router()
const { Category, Product, ProductImage } = require('../models')
const { tokenExtractor, isAdmin } = require('../utils/middleware')
const Sequelize = require('sequelize')
const { Op } = Sequelize
// Add category
router.post('/', tokenExtractor, isAdmin, async (req, res) => {
  try {
    const { parentCategory, title, sortOrder } = req.body

    console.log(parentCategory, title, typeof sortOrder)
    // If category does not exist, create one
    // const parent_id = parentCategory
    //   ? await Category.findByPk(parentCategory)
    //   : undefined

    const categoryDoc = await Category.create({
      parent_id: parentCategory || undefined,
      title,
      sort_order: sortOrder,
    })

    res.status(200).json(categoryDoc)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['title'],
        },
      ],
    })
    res.status(200).json(categories)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// get product based on category
router.get('/:category', async (request, response) => {
  const { category } = request.params
  console.log(category)

  const categories = await Category.findAll()
  const filtered = categories.filter(
    (c) =>
      c.title.toLowerCase().replace(/'/g, '').replace(/\s/g, '') === category
  )

  console.log(filtered)
  const products = await Product.findAll({
    where: { categoryId: filtered[0].id },
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
})

// Edit category
router.put('/:id', tokenExtractor, isAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { parent_id, title, sort_order } = req.body
    const categoryDoc = await Category.findByPk(id)

    if (!categoryDoc) {
      res.status(404).send('Category not found')
    }

    await categoryDoc.update({
      parent_id: parent_id || undefined,
      title,
      sort_order,
    })

    res.status(200).json(categoryDoc)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// Delete category

router.delete('/:id', tokenExtractor, isAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const categoryDoc = await Category.findByPk(id)

    if (!categoryDoc) {
      res.status(404).send('Category not found')
    }

    await categoryDoc.destroy()

    res.status(200).json(categoryDoc)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

module.exports = router
