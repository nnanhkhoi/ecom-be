const multiparty = require('multiparty')
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3')
const fs = require('fs')
const mime = require('mime-types')

const { NotFoundError } = require('../core/error.response')
const { Product, ProductImage } = require('../models')

const bucketName = 'nnanhkhoi'

class ProductService {
  static async getAllProducts() {
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

    return modifiedProducts
  }

  static async getSingleProduct({ id }) {
    const product = await Product.findOne({
      where: { id },
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
      throw new NotFoundError('Product not found')
    }
    const modifiedProduct = {
      id: product.id,
      description: product.description,
      name: product.name,
      price: product.price,
      category: product.categoryId,

      images: product.images.map((image) => image.image),
    }

    return modifiedProduct
  }

  static async createNewProduct({ name, description, price, category }) {
    const newProduct = await Product.create({
      name: name,
      description: description,
      price: price,
      categoryId: category,
    })

    return newProduct
  }

  static async updateProduct({ id, name, description, price, category }) {
    // Check if product exists
    const product = await Product.findByPk(id)
    if (!product) {
      throw new NotFoundError('Product not found')
    }

    // Update product
    product.name = name
    product.description = description
    product.price = price
    product.categoryId = category

    await product.save()

    return product
  }

  static async deleteProduct() {
    const { id } = request.params

    // Check if product exists
    const product = await Product.findByPk(id)
    if (!product) {
      throw new NotFoundError('Product not found')
    }

    // Delete product
    await product.destroy()

    // Clear the cart items table for the user
    await ProductImage.destroy({
      where: {
        productId: product.id,
      },
    })

    return 'Product deleted'
  }

  static async uploadProductPhotos(request) {
    const form = new multiparty.Form()

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(request, (err, fields, files) => {
        if (err) reject(err)
        resolve({ fields, files })
      })
    })

    console.log('length:', files.file.length)

    const client = new S3Client({
      region: 'ap-southeast-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    })

    const links = []
    for (const file of files.file) {
      const ext = file.originalFilename.split('.').pop()
      const newFilename = Date.now() + '.' + ext

      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: newFilename,
          Body: fs.readFileSync(file.path),
          ACL: 'public-read',
          ContentType: mime.lookup(file.path),
        })
      )

      const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`
      links.push(link)
    }

    console.log({ links })

    return links
  }

  static async savePhotosToDb({ productId, images }) {
    const product = await Product.findByPk(productId)

    if (!product) {
      throw new NotFoundError('product not found')
    }

    const existingImages = await ProductImage.findAll({
      where: {
        productId: product.id,
      },
      attributes: ['image'], // Fetch only the 'image' attribute from existing images
    })

    const existingImageUrls = existingImages.map(
      (existingImage) => existingImage.image
    )

    // Filter out any duplicate images
    const uniqueImages = images.filter(
      (image) => !existingImageUrls.includes(image)
    )

    // Create an array of new image objects
    const newImages = uniqueImages.map((image) => ({
      image: image,
      productId: product.id,
    }))

    // Insert the new images into the database
    const res = await ProductImage.bulkCreate(newImages)

    return res
  }
}

module.exports = ProductService
