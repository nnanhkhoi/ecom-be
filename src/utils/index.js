'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const convertToObjectIdMongodb = (id) => {
  return new Types.ObjectId(id)
}

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}

// ['a','b'] = {a:1, b:1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]))
}

// ['a','b'] = {a:0, b:0}

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]))
}

const removeUndefinedObject = (object) => {
  Object.keys(object).forEach((key) => {
    if (object[key] === undefined || object[key] === null) delete object[key]
  })

  return object
}

/* 
  const a = {
    c: {
      d: 1,
      e:2
    }
  }

  db.collection.updateOne({
    `c.d`:1
  })
*/
const updateNestedObjectParser = (object) => {
  const final = {}

  Object.keys(object || {}).forEach((key) => {
    if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
      const response = updateNestedObjectParser(object[key])

      Object.keys(response || {}).forEach((a) => {
        final[`${key}.${a}`] = response[a]
      })
    } else {
      final[key] = object[key]
    }
  })

  return final
}

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
}
