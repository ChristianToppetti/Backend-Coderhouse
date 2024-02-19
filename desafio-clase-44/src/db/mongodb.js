import mongoose from 'mongoose'
import config from '../config/config.js'
import { getLogger } from '../config/logger.js'

export const URI = config.db.mongoDbUri

export const init = async () => {
  let logger = getLogger()
  try {
    await mongoose.connect(URI)
    logger.info('DB connected')

  } catch (error) {
    logger.error('DB conection error:', error.message)
  }
}