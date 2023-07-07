const multiparty = require('multiparty')
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3')
const fs = require('fs')
const mime = require('mime-types')

const router = require('express').Router()
const { Product, ProductImage, User } = require('../../models')
const { tokenExtractor, isAdmin } = require('../../utils/middleware')
const bucketName = 'nnanhkhoi'

router.post('/', tokenExtractor, isAdmin, async (request, response) => {
  const body = request.body

  const product = await Product.findByPk(body.productId)

  if (!product) {
    return response.status(404).send('product not found')
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
  const uniqueImages = body.images.filter(
    (image) => !existingImageUrls.includes(image)
  )

  // Create an array of new image objects
  const newImages = uniqueImages.map((image) => ({
    image: image,
    productId: product.id,
  }))

  // Insert the new images into the database
  const res = await ProductImage.bulkCreate(newImages)

  response.json(res)
})

router.post('/upload', tokenExtractor, isAdmin, async (request, response) => {
  const body = request.body

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

  return response.json({ links })
})

module.exports = router
