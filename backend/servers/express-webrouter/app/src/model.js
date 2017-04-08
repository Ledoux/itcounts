import fs from 'fs'
import mongoose from 'mongoose'
import path from 'path'

mongoose.Promise = global.Promise

export function getModelWithApp (app, config) {
  const { mongoUrl } = config
  return new global.Promise((resolve, reject) => {
    mongoose.connect(mongoUrl)
    mongoose.connection.on('error', (err) => {
      console.log(err)
      resolve({
        mongooseConnection: null,
        Deputes: null
      })
    })
    mongoose.connection.on('connected', () => {
      const mongooseConnection = mongoose.createConnection(mongoUrl)
      console.log('Connection to mongo is okay')
      resolve({
        mongooseConnection,
        Deputes: mongooseConnection.model('', {}, 'deputes')
      })
    })
  })
}
