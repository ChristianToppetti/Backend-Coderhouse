import { mongoose } from "mongoose"

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    // purchase_datetime: { type: Date, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
}, { timestamps: true })

ticketSchema.pre('find', () => {
    this.populate('purchaser')
    this.populate('products')
})

export default mongoose.model('ticket', ticketSchema)