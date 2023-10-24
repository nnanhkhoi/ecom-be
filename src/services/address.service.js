const { Address } = require('../models')

class AddressService {
  static async createAddress({
    user_id,
    name,
    email,
    phone,
    city,
    country,
    address,
  }) {
    return await Address.create({
      user_id,
      name,
      email,
      phone,
      city,
      country,
      address,
    })
  }

  static async updateAddress() {
    return 'hello'
  }
}

module.exports = AddressService
