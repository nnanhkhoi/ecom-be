'use strict'

const jwt = require('jsonwebtoken')
const { asyncHandler } = require('../utils/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')
const { getCookieValue } = require('../utils/helper')

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //accessToken
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: '1 days',
    })

    // refresh token
    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: '7 days',
    })

    // verify key
    verifyJwt(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify:: `, err)
      } else {
        console.log('decode verify::', decode)
      }
    })

    return {
      accessToken,
      refreshToken,
    }
  } catch (error) {
    console.error(`createTokenPair error:: `, error)
  }
}

const verifyJwt = (token, keySecret) => {
  return jwt.verify(token, keySecret)
}

const authentication = asyncHandler(async (req, res, next) => {
  /* 
  1 - Check userIs missing
  2 - Get accessToken
  3 - verifyToken
  4 - check user in db
  5 - check keyStore with userId
  6 - OK ? next()
  */

  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) {
    throw new AuthFailureError('Invalid request')
  }

  const keyStore = await findByUserId(userId)

  if (!keyStore) {
    throw new NotFoundError('Not found keyStore')
  }
  const accessToken = req.cookies.accessToken

  if (!accessToken) throw new AuthFailureError('Invalid request')

  try {
    const decodeUser = jwt.verify(accessToken, keyStore.public_key)
    if (userId !== decodeUser.userId.toString())
      throw new AuthFailureError('Invalid User')

    req.keyStore = keyStore
    req.user = decodeUser

    return next()
  } catch (error) {
    throw error
  }
})

const verifyTokenAndAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.isAdmin) {
    next()
  } else {
    res.status(403).json("You're not allowed to do that!")
  }
})
module.exports = {
  createTokenPair,
  authentication,
  verifyJwt,
  verifyTokenAndAdmin,
}
