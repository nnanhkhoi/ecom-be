const {
  SuccessResponse,
  SuccessResponseCookie,
  SuccessResponseClearCookie,
} = require('../core/success.response')
const AccessService = require('../services/access.service')

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    new SuccessResponseCookie({
      message: 'Get Token Successfully',
      metadata: await AccessService.handleRefreshToken(
        req.cookies.refreshToken
      ),
    }).send(res)
  }

  logout = async (req, res, next) => {
    new SuccessResponseClearCookie({
      message: 'Logout Successfully',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res)
  }

  login = async (req, res, next) => {
    new SuccessResponseCookie({
      message: 'Login Successfully',
      metadata: await AccessService.login(req.body),
    }).send(res)
  }

  signUp = async (req, res, next) => {
    new SuccessResponse({
      message: 'Register OK',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res)
  }
}

module.exports = new AccessController()
