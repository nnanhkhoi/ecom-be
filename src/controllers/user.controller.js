const { SuccessResponse } = require('../core/success.response')
const UserService = require('../services/user.service')

class UserController {
  getAllUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'getAllUser successfully!',
      metadata: await UserService.getAllUser(),
    }).send(res)
  }

  getAllAdmin = async (req, res, next) => {
    new SuccessResponse({
      message: 'getAllAdmin successfully!',
      metadata: await UserService.getAllAdmin(),
    }).send(res)
  }

  getUserById = async (req, res, next) => {
    new SuccessResponse({
      message: 'getUserById successfully!',
      metadata: await UserService.getUserById(req.params),
    }).send(res)
  }

  updateUserById = async (req, res, next) => {
    new SuccessResponse({
      message: 'updateUserById successfully!',
      metadata: await UserService.updateUserById(req.body),
    }).send(res)
  }

  deleteUserById = async (req, res, next) => {
    new SuccessResponse({
      message: 'deleteUserById successfully!',
      metadata: await UserService.deleteUserById(req.params),
    }).send(res)
  }
}

module.exports = new UserController()
