import { mongoose } from "mongoose"

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    // purchase_datetime: { type: Date, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    products: [{
        _id: false,
        pid: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        quantity: { type: Number, required: true },
        title: { type: String, required: true },
        price: { type: mongoose.Decimal128, required: true },
        stock: { type: Number, required: true }
    }],
    status: { type: String, default: 'pending', enum: ['pending', 'completed'] }
}, { timestamps: true })

export default mongoose.model('ticket', ticketSchema)