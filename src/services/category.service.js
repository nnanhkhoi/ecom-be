const { NotFoundError } = require('../core/error.response')
const { Category, Product, ProductImage } = require('../models')

class CategoryService {
  static getAllCategory = async () => {
    const categories = await Category.findAll({
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['title'],
        },
      ],
    })
    return categories
  }

  static getSingleCategory = async ({ category }) => {
    const categories = await Category.findAll()
    const filtered = categories.filter(
      (c) =>
        c.title.toLowerCase().replace(/'/g, '').replace(/\s/g, '') === category
    )

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

    return modifiedProducts
  }

  static async addCategory({ parentCategory, title, sortOrder }) {
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

    return categoryDoc
  }

  static async deleteCategory(categoryId) {
    const categoryDoc = await Category.findByPk(categoryId)

    if (!categoryDoc) {
      throw new NotFoundError('Category not found')
    }

    await categoryDoc.destroy()

    return categoryDoc
  }

  static async editCategory({ categoryId, parent_id, title, sort_order }) {
    const categoryDoc = await Category.findByPk(categoryId)

    if (!categoryDoc) {
      throw new NotFoundError('Category not found')
    }

    await categoryDoc.update({
      parent_id: parent_id || undefined,
      title,
      sort_order,
    })

    return categoryDoc
  }
}

module.exports = CategoryService
