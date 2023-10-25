const express = require('express')
// const { apiKey, permissions } = require('../auth/checkAuth')
const router = express.Router()

const usersRouter = require('../api/users')
const loginRouter = require('../api/login')
const logoutRouter = require('../api/logout')
const sessionRouter = require('../api/session')
const productRouter = require('../api/product/product')
const proImageRouter = require('../api/product/productImage')
const addressRouter = require('../api/address')
const addToCart = require('../api/cart/cart')
const checkout = require('../api/cart/checkout')

const orderRouter = require('../api/order/order')

const payment = require('../api/payment')

const categories = require('../api/category')
const webhook = require('../api/webhook')

router.use('/api/users', usersRouter)
router.use('/api/login', loginRouter)
router.use('/api/logout', logoutRouter)
router.use('/api/session', sessionRouter)
router.use('/api/products', productRouter)
router.use('/api/proimage', proImageRouter)
router.use('/api/cart', addToCart)
router.use('/api/cart/checkout', checkout)
router.use('/api/order', orderRouter)
router.use('/api/checkout', payment)
router.use('/api/webhook', webhook)
router.use('/api/category', categories)
router.use('/api/address', addressRouter)

module.exports = router
