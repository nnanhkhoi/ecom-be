'use strict'

const mongoose = require('mongoose')
const {
  db: { host, name, port },
} = require('../configs/config.mongodb')

const connectString = `mongodb://${host}:${port}/${name}`
const { countConnect } = require('../utils/check.connect')
const MAX_POLL_SIZE = 50
const TIME_OUT_CONNECT = 3000

console.log(connectString)
//Singleton connection
class Database {
  constructor() {
    this.connect()
  }

  //connect
  connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose
      .connect(connectString, {
        serverSelectionTimeoutMS: TIME_OUT_CONNECT,
        maxPoolSize: MAX_POLL_SIZE,
      })
      .then((_) => {
        try {
          countConnect()
        } catch (e) {
          console.log(e)
        }
        ;(_) => console.log(`Connected mongodb success `)
      })
      .catch((err) => console.log(`Error connect!`, err))
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongoDb = Database.getInstance()
module.exports = instanceMongoDb
