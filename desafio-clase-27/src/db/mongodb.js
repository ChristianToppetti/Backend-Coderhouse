import mongoose from 'mongoose'
import config from '../config.js'

export const URI = config.db.mongoDbUri

export const init = async () => {
  try {
    await mongoose.connect(URI)
    console.log('DB connected')
  } catch (error) {
    console.log('DB conection error:', error.message)
  }
}