const User = require('./user')
const Address = require('./address')
const Product = require('./product')
const ProductImage = require('./product_image')
const Category = require('./category')

const Order = require('./order')
const OrderItem = require('./order_item')

const Cart = require('./cart')
const CartItem = require('./cart_item')

const Session = require('./session')

const Payment = require('./payment')
const KeyToken = require('./keytoken.model')

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Address)
Address.belongsTo(User)

Order.hasMany(OrderItem)
OrderItem.belongsTo(Order)

Cart.hasMany(CartItem, { onDelete: 'CASCADE' })
CartItem.belongsTo(Cart)

Product.hasMany(CartItem)
CartItem.belongsTo(Product)

Product.hasMany(OrderItem)
OrderItem.belongsTo(Product)

Session.belongsTo(User)

Product.belongsToMany(Order, { through: 'OrderItem' }) // Each order has many Product items through a join table
Product.belongsToMany(Cart, { through: 'CartItem' }) // Each order has many Product items through a join table

// Define the association between Product and ProductImage
Product.hasMany(ProductImage, { as: 'images' })
ProductImage.belongsTo(Product)

// Define the association between Category and its parent category
Category.belongsTo(Category, {
  foreignKey: 'parent_id',
  as: 'parent',
})

Product.belongsTo(Category)
Category.hasMany(Product)

module.exports = {
  User,
  Product,
  ProductImage,
  Category,
  Order,
  OrderItem,
  Session,
  Cart,
  CartItem,
  Payment,
  Address,
  KeyToken,
}
