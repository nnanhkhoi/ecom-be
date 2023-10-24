// const shopModel = require('../../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { createTokenPair, verifyJwt } = require('../auth/authUtils')
const { getInfoData } = require('../utils')

const {
  BadRequestError,
  AuthFailureError,
  FobiddenError,
} = require('../core/error.response')
const KeyTokenService = require('./keyToken.service')
const { User } = require('../models')

const Roles = {
  SHOP: 'SHOP',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
}

class AccessService {
  /*
   * 1 - Check email in dbs
   * 2 - Match password
   * 3 - Create AT vs RT and save
   * 4 - Generate tokens
   * 5 - Get guide return login
   */

  static async login({ email, password }) {
    //1.
    if (!foundShop) {
      throw new BadRequestError('Shop not registered')
    }

    //2.
    const match = bcrypt.compare(password, foundShop.password)

    if (!match) {
      throw new AuthFailureError('Authentication error')
    }

    //3.
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    //4 create token pair
    const { _id: userId } = foundShop
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    )

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    })

    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop,
      }),
      tokens,
    }
  }

  signUp = async ({ name, email, password }) => {
    console.log({ name, email, password })

    //step1: check email exist?
    const user = await User.findOne({ where: { email } })
    console.log(user)
    if (user) {
      throw new BadRequestError('Error: User already registered!')
    }
    const passwordHash = await bcrypt.hash(password, 10)

    const newShop = await User.create({
      name,
      email,
      hashedPassword: passwordHash,
      roles: [Roles.SHOP],
      phoneNumber: 123456,
    })

    if (newShop) {
      // create privateKey, publicKey
      // const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      // })

      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')
      console.log({ privateKey, publicKey })

      // Update to Db
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop.id,
        publicKey: publicKey,
        privateKey: privateKey,
      })

      if (!keyStore) {
        return {
          code: 'xxxx',
          message: 'publicKeyString error',
        }
      }

      //create token pair
      const tokens = await createTokenPair(
        { userId: newShop.id, email },
        publicKey,
        privateKey
      )

      console.log(`Created Token success::`, tokens)

      return {
        shop: getInfoData({
          fields: ['id', 'name', 'email'],
          object: newShop,
        }),
        tokens,
      }
    }

    return {
      code: 200,
      metadata: null,
    }
  }

  logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore.user_id)

    return delKey
  }

  /*
   * 1 - Check email in dbs
   * 2 - Match password
   * 3 - Create AT vs RT and save
   * 4 - Generate tokens
   * 5 - Get guide return login
   */
  login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await User.findOne({ where: { email } })
    //1.
    if (!foundShop) {
      throw new BadRequestError('Shop not registered')
    }

    //2.
    const match = bcrypt.compare(password, foundShop.hashedPassword)

    if (!match) {
      throw new AuthFailureError('Authentication error')
    }

    //3.
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    //4 create token pair
    const { id: userId } = foundShop
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    )

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    })

    return {
      shop: getInfoData({
        fields: ['id', 'name', 'email'],
        object: foundShop,
      }),
      tokens,
    }
  }

  handleRefreshToken = async (refreshToken) => {
    //check if token is used

    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    )

    if (foundToken) {
      //decode who is using this token
      const { userId, email } = await verifyJwt(
        refreshToken,
        foundToken.private_key
      )
      console.log('[1]---', { userId, email })

      //Something suspicious, destroy all tokens
      await KeyTokenService.deleteKeyById(userId)
      throw new FobiddenError('Something wrong happened, please re-login')
    }

    //Token is not used
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if (!holderToken) throw new AuthFailureError('Shop not registered 1')

    //Verify Token
    const { userId, email } = await verifyJwt(
      refreshToken,
      holderToken.private_key
    )
    console.log('[2]---', { userId, email })
    //check UserId
    const foundShop = await User.findOne({ where: { email: email } })
    if (!foundShop) throw new AuthFailureError('Shop not registered 2')

    //Create new pair of token

    const tokens = await createTokenPair(
      { userId, email },
      holderToken.public_key,
      holderToken.private_key
    )

    //Update Token
    await KeyTokenService.updateKeyById(
      userId,
      tokens.refreshToken,
      refreshToken
    )

    return {
      user: { userId, email },
      tokens,
    }
  }
}

module.exports = new AccessService()
