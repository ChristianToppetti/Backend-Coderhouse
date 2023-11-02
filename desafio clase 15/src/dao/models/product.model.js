import {mongoose} from 'mongoose'

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: mongoose.Decimal128, required: true },
  description: { type: String, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  thumbnail: { type: String, required: true }
})

export default mongoose.model('product', productSchema)