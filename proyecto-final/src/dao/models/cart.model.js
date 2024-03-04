import { mongoose } from 'mongoose'

const cartSchema = new mongoose.Schema({
  products: [{
    _id: false,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    quantity: { type: Number, default: 1, required: true },
  }],
  _admincart: { type: Boolean, required: false }
})

export default mongoose.model('cart', cartSchema);