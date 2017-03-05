import fs from 'fs'
import mongoose from 'mongoose'
import path from 'path'

const secret = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config/secret.json')))
mongoose.Promise = global.Promise

export function getModelWithApp (app) {
  return new global.Promise((resolve, reject) => {
    mongoose.connect(secret.MONGO_URL)
    mongoose.connection.on('error', (err) => {
      console.log(err)
    })
    mongoose.connection.on('connected', () => {
      const mongooseConnection = mongoose.createConnection(secret.MONGO_URL)
      console.log('Connection to mongo is okay')
      resolve({
        mongooseConnection,
        Deputes: mongooseConnection.model('', {}, 'deputes')
      })
    })
  })
}
