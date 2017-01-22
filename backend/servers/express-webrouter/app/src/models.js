import mongoose from 'mongoose'

const mongoUrl = "mongodb://ec2-52-211-76-129.eu-west-1.compute.amazonaws.com:27017/wax_dfg"

mongoose.Promise = global.Promise
export const mongooseConnection = mongoose.createConnection(mongoUrl)

export const Deputes = mongooseConnection.model('', {}, 'deputes')
