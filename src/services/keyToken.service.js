'use strict'

const keyTokenModel = require('../models/keytoken.model')
const { Types } = require('mongoose')

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken = '',
  }) => {
    try {
      // level 0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // })

      // return tokens ? tokens.publicKey : null

      //level xx

      const filter = { user_id: userId },
        update = {
          public_key: publicKey,
          private_key: privateKey,
          refresh_token_used: [],
          refresh_token: refreshToken,
        },
        options = { upsert: true, new: true }

      const foundUser = await keyTokenModel.findOne({
        where: filter,
      })

      //1.
      let tokens
      if (!foundUser) {
        tokens = await keyTokenModel.create({
          user_id: userId,
          public_key: publicKey,
          private_key: privateKey,
          refresh_token_used: [],
          refresh_token: refreshToken,
        })
      } else {
        tokens = await keyTokenModel.update(update, { where: filter })
      }

      return tokens ? tokens.public_key : null
    } catch (error) {
      console.error('createKeyToken::error::', error)
      throw error
    }
  }

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ where: { user_id: userId } })
  }

  static removeKeyById = async (id) => {
    return await keyTokenModel.destroy({ where: { user_id: id } })
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({
      where: { refresh_token_used: refreshToken },
    })
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({
      where: { refresh_token: refreshToken },
    })
  }

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.destroy({ where: { user_id: userId } })
  }

  static updateKeyById = async (userId, refreshToken, refreshTokenUsed) => {
    return await keyTokenModel.update(
      {
        refresh_token: refreshToken,
        refresh_token_used: refreshTokenUsed,
      },
      { where: { user_id: userId } }
    )
  }
}

module.exports = KeyTokenService
