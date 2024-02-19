import { mongoose } from "mongoose"

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    // purchase_datetime: { type: Date, required: true },
    ammount: { type: Number, required: true },
    purchaser: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    products: [{
        _id: false,
        pid: { type: mongoose.Schema.Types.ObjectId, ref: 'product'},
        quantity: { type: Number }
    }],
}, { timestamps: true })

export default mongoose.model('ticket', ticketSchema)