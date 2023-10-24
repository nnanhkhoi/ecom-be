const bcrypt = require('bcrypt')

const { NotFoundError } = require('../core/error.response')
const { User } = require('../models')

class UserService {
  static async getAllUser() {
    return await User.findAll({})
  }

  static async getAllAdmin() {
    return await User.findAll({
      where: { isAdmin: true },
    })
  }

  static async getUserById({ id }) {
    const user = await User.findByPk(id)
    if (!user) {
      throw new NotFoundError('user not found')
    }

    return user
  }

  static async updateUserById({
    id,
    name,
    email,
    password,
    phoneNumber,
    address,
  }) {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await User.findByPk(id)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    const updatedUser = await user.update({
      name,
      email,
      hashedPassword,
      phoneNumber,
      address,
    })

    return updatedUser
  }

  static async deleteUserById({ id }) {
    const user = await User.findByPk(id)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return await user.destroy()
  }
}

module.exports = UserService
