import fs from 'fs'
import mongoose from 'mongoose'
import path from 'path'

const secret = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config/secret.json')))

mongoose.Promise = global.Promise
export const mongooseConnection = mongoose.createConnection(secret.MONGO_URL)

export const Deputes = mongooseConnection.model('', {}, 'deputes')
