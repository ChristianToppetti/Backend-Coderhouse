import mongoose from 'mongoose'

export const URI = 'mongodb+srv://christian96atc:BRwBmtLhKEpO3Ilu@cluster0.vtknpri.mongodb.net/ecommerce'

export const init = async () => {
  try {
    await mongoose.connect(URI)
    console.log('DB connected')
  } catch (error) {
    console.log('DB conection error:', error.message)
  }
}