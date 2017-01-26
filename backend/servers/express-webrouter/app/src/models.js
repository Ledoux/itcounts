import fs from 'fs'
import mongoose from 'mongoose'
import path from 'path'

const secret = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config/secret.json')))

const mongoUrl = "mongodb://ec2-52-211-76-129.eu-west-1.compute.amazonaws.com:27017/wax_dfg"

mongoose.Promise = global.Promise
export const mongooseConnection = mongoose.createConnection(secret.MONGO_URL)

export const Deputes = mongooseConnection.model('', {}, 'deputes')
