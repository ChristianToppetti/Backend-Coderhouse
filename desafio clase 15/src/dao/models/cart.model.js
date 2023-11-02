import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
  products: { type: Array }
})

export default mongoose.model('cart', cartSchema);