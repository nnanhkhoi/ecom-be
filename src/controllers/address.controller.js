const { SuccessResponse } = require('../core/success.response')
const AddressService = require('../services/address.service')

class AddressController {
  createNewAddress = async (req, res, next) => {
    new SuccessResponse({
      message: ' Create new Address Successfully',
      metadata: await AddressService.createAddress(req.body),
    }).send(res)
  }

  updateAddress = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Address Successfully',
      metadata: await AddressService.updateAddress(req.body),
    }).send(res)
  }
}

module.exports = new AddressController()
