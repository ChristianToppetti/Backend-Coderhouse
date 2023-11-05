import mongoose from 'mongoose'

export const init = async () => {
  try {
    const URI = 'mongodb+srv://christian96atc:BRwBmtLhKEpO3Ilu@cluster0.vtknpri.mongodb.net/ecommerce'
    await mongoose.connect(URI)
    console.log('DB connected')
  } catch (error) {
    console.log('DB conection error:', error.message)
  }
}