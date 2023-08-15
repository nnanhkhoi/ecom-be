const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')

const usersRouter = require('./api/users')
const loginRouter = require('./api/login')
const logoutRouter = require('./api/logout')
const sessionRouter = require('./api/session')
const productRouter = require('./api/product/product')
const proImageRouter = require('./api/product/productImage')
const addressRouter = require('./api/address')
const addToCart = require('./api/cart/cart')
const checkout = require('./api/cart/checkout')

const orderRouter = require('./api/order/order')

const payment = require('./api/payment')

const categories = require('./api/category')
const webhook = require('./api/webhook')

const middleware = require('./utils/middleware')

const corsOptions = {
  credentials: true,
  // origin: ['http://localhost:3000', 'http://localhost:3006'],
}

app.use(cors(corsOptions))
app.use(
  express.json({
    limit: '5mb',
    verify: (req, res, buf) => {
      req.rawBody = buf.toString()
    },
  })
)
app.use(express.static(path.join(__dirname, '..', 'build')))

app.use(bodyParser.json())
app.use(cookieParser())

app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/session', sessionRouter)

app.use('/api/products', productRouter)
app.use('/api/proimage', proImageRouter)

app.use('/api/cart', addToCart)
app.use('/api/cart/checkout', checkout)

app.use('/api/order', orderRouter)

app.use('/api/checkout', payment)
app.use('/api/webhook', webhook)
app.use('/api/category', categories)
app.use('/api/address', addressRouter)

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
